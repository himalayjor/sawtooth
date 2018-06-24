import React, { Component } from 'react';

class Asset extends Component {

    constructor(props) {
        super(props);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.props.action(this.props.assetName);
    }

    render() {
        return (
                <tr key={this.props.assetName}>
                    <td>{this.props.assetName}</td>
                    <td>{this.props.count}</td>
                    <td><button onClick={this.handleButtonClick}>+1</button></td>
                </tr>
        );
    }
}

export default Asset;