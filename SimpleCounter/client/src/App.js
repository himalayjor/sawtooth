import React, { Component } from 'react';
import './App.css';
import Asset from './Asset.js';
import Sawtooth from './sawtooth.js';
import SawtoothKeys from './sawtoothKeys.js';


const privateKey = (new SawtoothKeys()).getPrivatekey();
//const privateKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const sawtoothObj = new Sawtooth(privateKey);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: []
    };
    this.refreshState = this.refreshState.bind(this);
    this.handleIncrementAsset = this.handleIncrementAsset.bind(this);
    this.createAsset = this.createAsset.bind(this);
    this.refreshState();
  }

  refreshState() {
    sawtoothObj.getData().then(data => {
      const assets = data.map(row => {
        return JSON.parse(atob(row.data));
      });
      this.setState(() => {
        return { assets };
      });
    });
  }

  handleIncrementAsset(assetName) {
    const payload = {
      action: 'incrementAsset',
      asset: assetName
    };
    sawtoothObj.submitUpdate(payload, privateKey).then(() => this.refreshState());
  }

  createAsset(e) {
    e.preventDefault();
    const assetName = e.target.elements.option.value.trim();
    const payload = {
      action: 'createAsset',
      asset: assetName
    };
    sawtoothObj.submitUpdate(payload, privateKey).then(() => this.refreshState());
  }

  render() {
    return (
      <div>
        <h1> All your assets </h1>
        <form onSubmit={this.createAsset}>
              <p>CreateAsset</p>
              <input type="text" name="option" />
              <button>Submit</button>
        </form>
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
              return <Asset key={element} assetName={element.name} count={element.count} action={this.handleIncrementAsset}/>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;

