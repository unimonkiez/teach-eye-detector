import React, { Component, StyleSheet, View, Text, Image } from 'react-native';

const styles = StyleSheet.create({
  image: {
    height: 150
  }
});

export default class Image1 extends Component {
  static TITLE_MAX_LENGTH = 140;
  static CREDIT_MAX_LENGTH = 140;
  static IMAGE_MAX_SIZE = 40;

  static displayTypes = {
    INITIAL: 1,
    SHOW_IMAGE: 2,
    UPLOADING: 4
  };

  static errorTypes = {
    FILE_SIZE: 1,
    FILE_TYPE: 2,
    MISC: 4
  };
  render() {
    return (
      <View>
        <Image source={{ uri: `http://54.209.139.250/${this.props.model.data.src}` }} style={styles.image} />
      </View>
    );
  }
}
