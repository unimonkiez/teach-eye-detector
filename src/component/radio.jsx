import React, { Component, PropTypes } from 'react';

export default class Radio extends Component {
  render() {
    const { children, ...otherProps } = this.props;
    return (
      <label className={`t2k-radio ${this.props.checked ? 'checked' : ''} ${this.props.disabled ? 'disabled' : ''}`}>
        <input {...otherProps} type="radio" />
        {children}
      </label>
    );
  }
}
if (__DEV__) {
  Radio.propTypes = {
    children: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool
  };
}
