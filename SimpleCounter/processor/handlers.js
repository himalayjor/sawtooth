'use strict'

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { TransactionHeader } = require('sawtooth-sdk/protobuf');

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length);
  }
  
const FAMILY = 'simple-counter';
const PREFIX = getAddress(FAMILY, 6);

const getBlockChainAddress = (owner, asset) => {
  return PREFIX + getAddress(owner, 6) + getAddress(asset, 58);
};

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));
const decode = buf => JSON.parse(buf.toString());

// Add a new asset to state
const createAsset = (asset, owner, state) => {
    const address = getBlockChainAddress(owner, asset)
  
    return state.get([address])
      .then(entries => {
        const entry = entries[address]
        if (entry && entry.length > 0) {
          throw new InvalidTransaction('Asset name in use')
        }
  
        return state.set({
          [address]: encode({count: 0})
        })
      })
  }

  // Add a new transfer to state
const incrementAsset = (asset, signer, state) => {
  const address = getBlockChainAddress(signer, asset);

  return state.get([address])
    .then(entries => {
      const entry = entries[address]
      if (!entry || entry.length === 0) {
        throw new InvalidTransaction('Asset does not exist')
      }
      // get currentCount
      return Promise.resolve(decode(entry).count);
    }).then(currentCount => {
        // increment count
        return state.set({
          [address]: encode({count: (currentCount + 1)})
        })
    });
}

// Handler for JSON encoded payloads
class JSONHandler extends TransactionHandler {
    constructor () {
      console.log('Initializing JSON handler for Simple Counter')
      super(FAMILY, '1.0.0', 'application/json', [PREFIX])
    }
  
    apply (txn, state) {
      // Parse the transaction header and payload
      const header = TransactionHeader.decode(txn.header)
      const signer = header.signerPubkey
      const { action, asset } = JSON.parse(txn.payload)
  
      if (action === 'createAsset') return createAsset(asset, signer, state)
      else if (action == 'incrementAsset') return incrementAsset(asset, signer, state)

      return Promise.resolve().then(() => {
        throw new InvalidTransaction(
          'Action must be "createAsset" '
        )
      })
    }
  }
  
  module.exports = {
    JSONHandler
  }