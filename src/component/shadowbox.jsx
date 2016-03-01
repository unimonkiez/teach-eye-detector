import React, { Component, PropTypes } from 'react';

export default class Shadowbox extends Component {
  render() {
    const { show, children, onClose, ...otherProps } = this.props;

    return (
      <div {...otherProps} className={`t2k-shadowbox ${!show && 'invisible'}`} onClick={onClose}>
        <div className="content">
          { children }
        </div>
      </div>
    );
  }
}

if (__DEV__) {
  Shadowbox.propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired
  };
}
