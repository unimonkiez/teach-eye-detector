import React, { Component, View, Text } from 'react-native';

export default class Richtext extends Component {
  render() {
    return (
      <View>
        {
        this.props.model.data.children && this.props.model.data.children.map((child, index) => (
        <this.props.interaction key={child} id={child}/>
        ))
        }
      </View>
    );
  }
}
