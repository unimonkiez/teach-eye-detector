import React, { Component } from 'react';

export default class TextInput extends Component {

  render() {
    return (
      <input ref="textInput" {...this.props} type="text" className={'t2k-text-input'}/>
    );
  }

  getInputValue() {
    return this.refs.textInput.value;
  }

  resetInputValue() {
    this.refs.textInput.value = '';
  }
}
