import React, { Component, PropTypes } from 'react';

export default class LoaderBubbles extends Component {

  static defaultProps = {
    backgroundColor: '#fff',
    bubbleColor: '#000'
  };

  constructor(props) {
    super(props);

    this.state = {
      show: this.props.show || false
    };
  }

  render() {
    const style = {
      display: this.state.show ? 'block' : 'none',
      backgroundColor: this.props.backgroundColor
    };
    const bubbleStyle = { backgroundColor: this.props.bubbleColor };

    return (
      <div className="t2k-loader-bubbles" style={style}>
        <div className={`loading-bubbles ${this.props.alignToTop ? ' align-top-top' : ''}`}>
          <div className="bubble-container">
            <div className="bubble" style={bubbleStyle}></div>
          </div>
          <div className="bubble-container">
            <div className="bubble" style={bubbleStyle}></div>
          </div>
          <div className="bubble-container">
            <div className="bubble" style={bubbleStyle}></div>
          </div>
        </div>
      </div>
    );
  }
}
if (__DEV__) {
  LoaderBubbles.propTypes = {
    bubbleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    show: PropTypes.bool,
    alignToTop: PropTypes.string
  };
}
