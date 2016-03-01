import React, { Component, PropTypes, View, Text } from 'react-native';
import * as MODE from '../constant/mode.js';
import * as TYPE from '../../.tmp/interaction.type.js';
import * as ANSWER from '../constant/feedback.js';
import getDefaultModel from './get.default.model.js';
import InteractionWrapper from './interaction.wrapper.js';

export default class Interaction extends Component {
  static getDefaultModel = getDefaultModel;
  static MODE = MODE;
  static TYPE = TYPE;
  static ANSWER = ANSWER;
  static defaultProps = {
    mode: MODE.EDITOR,
    ltr: true,
    showAnswers: false
  };
  render() {
    return (
      <InteractionWrapper ref="mainInteraction" {...this.props}/>
    );
  }
  getSettings() {
    return this.refs.mainInteraction._controller.settings;
  }
  checkAnswer() {
    return this.refs.mainInteraction._controller.checkAnswer();
  }
  tryAgain() {
    return this.refs.mainInteraction._controller.tryAgain();
  }
}
if (__DEV__) {
  Interaction.propTypes = {
    language: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])).isRequired,
    ltr: PropTypes.bool.isRequired,
    showAnswers: PropTypes.bool.isRequired
  };
}
