import React, { Component, PropTypes } from 'react';
import isBrowserSupportsTouchEvents from '../core/is.browser.supports.touch.events.js';

export default class Dropzone extends Component {
  static preventDragEvent(e) {
    // Stop event propogation
    e.stopPropagation();

    // Stop event default behavior
    e.preventDefault();
  }

  static defaultProps = {
    text: {
      placeholderLink: '',
      topRow: '',
      secondRow: '',
      button: ''
    }
  };

  render() {
    return (
      <div className="t2k-dropzone-component" ref="dropzone" onDragEnter={Dropzone.preventDragEvent} onDragOver={Dropzone.preventDragEvent} onDrop={this.handleDrop.bind(this)}>

        { !isBrowserSupportsTouchEvents
          ?

          <div>
            <div>
              <span className="upload-instruction">{this.props.text.topRow} </span>
              <span className="upload-condition">{this.props.text.secondRow} </span>
              <a className="upload-button" onClick={this.showFileChooser.bind(this)}>{this.props.text.button}</a>
            </div>
            <input ref="uploadInput" className="upload-input" type="file" accept={this.props.validTypes} onChange={this.handleFileChosen.bind(this)}/>
          </div>

          :

          <div>
            <a className="upload-button" onClick={this.showFileChooser.bind(this)}>{this.props.text.button}</a>
            <input ref="uploadInput" className="upload-input" type="file" accept={this.props.validTypes} onChange={this.handleFileChosen.bind(this)}/>
          </div>
        }

      </div>
    );
  }

  handleDrop(e) {
    Dropzone.preventDragEvent(e);
    this.props.onFileSelected(e.dataTransfer.files[0]);
  }

  handleFileChosen(e) {
    this.props.onFileSelected(e.target.files[0]);
  }

  showFileChooser() {
    this.refs.uploadInput.click();
  }
}
if (__DEV__) {
  Dropzone.propTypes = {
    onFileSelected: PropTypes.func.isRequired,
    validTypes: PropTypes.string,
    text: PropTypes.objectOf(PropTypes.string)
  };
}
