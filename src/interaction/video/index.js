import React, { Component, View, Text } from 'react-native';

export default class Video extends Component {
  render() {
    return (
      <View>
        <Text>
          Video
        </Text>
      </View>
    );
  }
}
export const VIDEO_MAX_SIZE = 40; // MegaBytes
export const validTypes = ['video/mp4'];
export const displayTypes = {
  INITIAL: 1,
  SHOW_VIDEO: 2,
  ERROR: 4,
  UPLOADING: 8,
  EDIT: 16
};
export const sourceTypes = {
  URL: 1,
  FILE: 2
};
export const errorTypes = {
  SIZE: 1,
  FILE_TYPE: 2,
  MISC: 4
};
export const formatTypes = {
  HTML5: 1,
  YOUTUBE: 2,
  VIMEO: 4
};
