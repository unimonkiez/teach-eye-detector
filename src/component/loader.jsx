import React, { Component, PropTypes } from 'react';

export default class Loader extends Component {

  static modeTypes = {
    LOADER: 0,
    PROGRESS: 1
  };

  static defaultProps = {
    backgroundColor: '#fff',
    bubbleColor: '#000'
  };

  constructor(props) {
    super(props);

    this.state = {
      show: this.props.show || false,
      progress: 0
    };
  }

  render() {
    const style = {
      display: this.state.show ? 'block' : 'none',
      backgroundColor: this.props.backgroundColor
    };

    return (
      <div className="loader" style={style}>
        {this.props.mode === Loader.modeTypes.PROGRESS &&
        <div className="progress-wrapper">
          <div className="progress-value">
            <span className="progress-number" ref="progressNumber">{this.getRoundedProgress()}</span>%
          </div>
          <progress className="progress-bar" max="100" value={this.state.progress.toString()} ref="progressBar"></progress>
        </div>
        }
        {this.props.mode === Loader.modeTypes.LOADER &&
        <div className="loading-bubbles {this.props.alignToTop ? ' align-top-top' : ''}">
          <div className="bubble-container">
            <div className="bubble" style={{ backgroundColor: this.props.bubbleColor }}></div>
          </div>
          <div className="bubble-container">
            <div className="bubble" style={{ backgroundColor: this.props.bubbleColor }}></div>
          </div>
          <div className="bubble-container">
            <div className="bubble" style={{ backgroundColor: this.props.bubbleColor }}></div>
          </div>
        </div>
        }
      </div>
    );
  }

  getRoundedProgress() {
    return Math.round(this.state.progress).toString();
  }
}
if (__DEV__) {
  Loader.propTypes = {
    mode: PropTypes.number,
    bubbleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    show: PropTypes.bool
  };
}
