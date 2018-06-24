import React, { Component } from 'react';

class Asset extends Component {

    render() {
        return (
                <tr key={this.props.assetName}>
                    <td>{this.props.assetName}</td>
                    <td>{this.props.count}</td>
                    <td><button>+1</button></td>
                </tr>
        );
    }
}

export default Asset;