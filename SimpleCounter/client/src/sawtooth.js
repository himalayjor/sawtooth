const {
    signer,
    BatchEncoder,
    TransactionEncoder
} = require('sawtooth-sdk/client');
const { createHash } = require('crypto');

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
    return createHash('sha512').update(key).digest('hex').slice(0, length);
}

class Sawtooth {

    constructor(privateKey) {
        this.PREFIX = 'bf4e85';
        this.FAMILY = 'simple-counter';
        this.VERSION = '1.0.0';
        this.privateKey = privateKey;
        this.publicKey = signer.getPublicKey(privateKey);
        this.transactionEncoder = new TransactionEncoder(this.privateKey, {
            inputs: [this.PREFIX],
            outputs: [this.PREFIX],
            familyName: this.FAMILY,
            familyVersion: this.VERSION,
            payloadEncoding: 'application/json',
            payloadEncoder: p => Buffer.from(JSON.stringify(p))
        });
        this.getData = this.getData.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
        this.getBlockChainAddress = this.getBlockChainAddress.bind(this);
    }

    /**
     * 
     * @param {*} asset 
     */
    getBlockChainAddress(asset) {
         return this.PREFIX + getAddress(this.publicKey, 6) + (asset ? getAddress(asset, 58) : '');
    }

    getData(address) {
        const addr = address ? address : this.getBlockChainAddress();
        return fetch(`state?address=${addr}`).then(response => {
            return response.json();
        }).then(respjson => {
            return respjson.data;
        });
    }

    submitUpdate(payload) {
        const transaction = this.transactionEncoder.create(payload)
        const batchBytes = new BatchEncoder(this.privateKey).createEncoded(transaction)

        return fetch(`batches?wait`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: batchBytes
        }).then(response => {
            console.log(response);
            return response;
        }).catch(error => {
            console.error(error);
            return error;
        });
    }
}

export default Sawtooth;