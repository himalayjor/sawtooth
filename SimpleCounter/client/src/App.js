import React, { Component } from 'react';
import './App.css';
import Asset from './Asset.js';
import Sawtooth from './sawtooth.js';


const privateKey = "xxxxxxxxxxxxxxxxxxxxxxx";
const sawtoothObj = new Sawtooth(privateKey);

const payload = {
  action: 'createAsset',
  asset: 'SixthAsset3'
};

//submitUpdate(payload, privateKey);

class App extends Component {
  constructor(props) {
    super(props);

    const self = this;
    sawtoothObj.getData().then(data => {
      const assets = data.map(row => {
        return JSON.parse(atob(row.data)).name;
      });
      self.setState(() => {
        return { assets };
      });
    });

    this.state = {
      assets: []
    };
  }
  render() {
    return (
      <div>
        <h1> All your assets </h1>
        <table>
          <thead>
            <tr>
              <th>AssetName</th>
              <th>Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.assets.map(element => {
              return <Asset key={element} assetName={element} count="0" />
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

