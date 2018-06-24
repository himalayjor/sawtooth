const {
    signer,
    BatchEncoder,
    TransactionEncoder
} = require('sawtooth-sdk/client');

class Sawtooth {

    constructor(privateKey) {
        this.PREFIX = 'bf4e85';
        this.FAMILY = 'simple-counter';
        this.VERSION = '1.0.0';
        this.privateKey = privateKey;
        this.transactionEncoder = new TransactionEncoder(this.privateKey, {
            inputs: [this.PREFIX],
            outputs: [this.PREFIX],
            familyName: this.FAMILY,
            familyVersion: this.VERSION,
            payloadEncoding: 'application/json',
            payloadEncoder: p => Buffer.from(JSON.stringify(p))
        });
        this.getData = this.getData.bind(this);
        this.makePostCall = this.makePostCall.bind(this);
    }
    
    getData(address) {
        const addr = address ? address : this.PREFIX;
        return fetch(`state?address=${addr}`).then(response => {
            return response.json();
        }).then(respjson => {
            return respjson.data;
        });
    }

    makePostCall(payload) {
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