const {
    signer
} = require('sawtooth-sdk/client');

class SawtoothKeys {
    getPrivatekey() {
        return signer.makePrivateKey();
    }
}

export default SawtoothKeys;