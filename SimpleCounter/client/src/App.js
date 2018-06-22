import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const {
  signer,
  BatchEncoder,
  TransactionEncoder
} = require('sawtooth-sdk/client');
var request = require('request');

const privateKey = "63769fa8776a8ec66e7ec98d74ae70ed1497e890c824ce320ef56c9356721483";
const publicKey = "02b87e4069985b34e414f6d090819a00371d523e98fd29bca0da7f6ec7910dd51a";

const PREFIX = 'bf4e85';
const FAMILY = 'simple-counter';
const VERSION = '1.0.0';

const API_URL = 'http://sawtooth-counter-rest-api-1412363039.us-west-2.elb.amazonaws.com';

// request(`${API_URL}/state`,  function (error, response, body) {
//  console.log(response);
//  console.log(error);
//  console.log(body);
// });

//Submit signed Transaction to validator
const submitUpdate = (payload, privateKey) => {
  const transaction = new TransactionEncoder(privateKey, {
    inputs: [PREFIX],
    outputs: [PREFIX],
    familyName: FAMILY,
    familyVersion: VERSION,
    payloadEncoding: 'application/json',
    payloadEncoder: p => Buffer.from(JSON.stringify(p))
  }).create(payload);

  const batchBytes = new BatchEncoder(privateKey).createEncoded(transaction)

  console.log('something');

request({
 
  uri: `${API_URL}/batches?wait`,
  body: batchBytes,
  method: 'POST'
}, function (error, response, body) {
  console.log('HelloWorld');
  console.log(response);
  console.log(error);
  console.log(body);
 });
};

const payload = {
  action: 'createAsset',
  asset: 'FirstAsset'
};

submitUpdate(payload, privateKey);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

