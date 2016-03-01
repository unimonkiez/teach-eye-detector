import React, { Component, View, Text } from 'react-native';

export default class Audio extends Component {
  render() {
    return (
      <View>
        <Text>
          Audio
        </Text>
      </View>
    );
  }
}
export const AUDIO_MAX_SIZE = 40;
export const displayTypes = {
  INITIAL: 1,
  UPLOADING: 2,
  SHOW_AUDIO: 4,
  ERROR: 8
};
export const playerTypes = {
  HTML_PLAYER: 1,
  SINGLE_BUTTON: 2
};
export const errorTypes = {
  MISC: 1,
  FILE_TYPE: 2,
  SIZE: 4
};
export const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/wav'];
