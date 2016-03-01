import React, { Component, PropTypes } from 'react';

export default class Checkbox extends Component {
  render() {
    const { children, ...otherProps } = this.props;
    return (
      <label className="t2k-checkbox">
        <input {...otherProps} type="checkbox"/>
        { children }
      </label>
    );
  }
}

if (__DEV__) {
  Checkbox.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string
    ])
  };
}
