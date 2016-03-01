import React, { Component, PropTypes } from 'react';


export default class Select extends Component {
  componentWillMount() {
    if (this.props.id === undefined) {
      throw Error('Select must have an id!');
    }
  }

  render() {
    const options = this.props.options.map((child, index) => {
      return (
        <option key={`${this.props.id}_${index}`} value={child.val}>
          {child.text}
        </option>
      );
    });

    return (
      <div className="dropdown-select" id={this.props.id}>
        <select value={this.props.selected} onChange={this.props.onChange}>
          { this.props.selected === undefined &&
          <option/>
          }
          {options}
        </select>
      </div>
    );
  }
}
if (__DEV__) {
  Select.propTypes = {
    id: PropTypes.string,
    selected: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired
  };
}
