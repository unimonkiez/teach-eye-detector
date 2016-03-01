import React, { Component, PropTypes } from 'react';

export const FLAT = 0;
export const RAISED = 1;
export const FLOATING = 2;

/**
 * Gets the metrialize css class for the button
 * @type {number} can be FLAT, RAISED or FLOATING (enum)
 */
const getClassNameByType = type => {
  switch (type) {
    case FLAT:
      return '';
    case RAISED:
      return 'raised';
    case FLOATING:
      return 'floating';
  }
};

export default class Button extends Component {
  static defaultProps = {
    type: FLAT
  };
  render() {
    const { type, className, children, ...otherProps } = this.props;

    return (
      <button {...otherProps} className={`t2k-button ${className} ${getClassNameByType(type)}`}>
        <span>
          { children }
        </span>
      </button>
    );
  }
}
if (__DEV__) {
  Button.propTypes = {
    type: PropTypes.oneOf([FLAT, RAISED, FLOATING]),
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string
    ])
  };
}
