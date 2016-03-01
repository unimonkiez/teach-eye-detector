import React, { Component, View, Text, TextInput } from 'react-native';
import { EDITOR } from '../../constant/mode.js';

export default class Text1 extends Component {
  render() {
    const html = this.props.model.data && this.props.model.data.html;
    return (
      <View>
        {
        this.props.mode === EDITOR ?
        <TextInput defaultValue={html} onChangeText={text => { this.text = text; }} onBlur={this.props.setHtml.bind(null, this.text)}/> :
        <Text>
          { html }
        </Text>
        }
      </View>
    );
  }
}
