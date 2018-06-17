'use strict'

const { createHash } = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { TransactionHeader } = require('sawtooth-sdk/protobuf');

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length);
  }
  
const FAMILY = 'simple-counter';
const PREFIX = getAddress(FAMILY, 6);

const getCounterAddress = name => PREFIX + '00' + getAddress(name, 62);
const getOwnerAddress = name => PREFIX + '01' + getAddress(name, 62);

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));
const decode = buf => JSON.parse(buf.toString());

// Add a new asset to state
const createAsset = (asset, owner, state) => {
    const address = getOwnerAddress(asset)
  
    return state.get([address])
      .then(entries => {
        const entry = entries[address]
        if (entry && entry.length > 0) {
          throw new InvalidTransaction('Asset name in use')
        }
  
        return state.set({
          [address]: encode({name: asset, owner})
        })
      })
  }

// Handler for JSON encoded payloads
class JSONHandler extends TransactionHandler {
    constructor () {
      console.log('Initializing JSON handler for Simple Counter')
      super(FAMILY, ['0.0'], [PREFIX])
    }
  
    apply (txn, state) {
      // Parse the transaction header and payload
      const header = TransactionHeader.decode(txn.header)
      const signer = header.signerPubkey
      const { action, asset, owner } = JSON.parse(txn.payload)
  
      if (action === 'createAsset') return createAsset(asset, signer, state)

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