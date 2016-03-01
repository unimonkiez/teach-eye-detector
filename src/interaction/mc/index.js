import React, { Component, View, Text, Switch, TouchableNativeFeedback } from 'react-native';
import { PLAYER, EDITOR } from '../../constant/mode.js';
import { MKRadioButton } from 'react-native-material-kit';

export default class Mc extends Component {
  constructor(...args) {
    super(...args);
    const mode = this.props.mode;
    this.state = {};
    if (mode === PLAYER && this.props.model.data.showRandomAnswers) {
      this.state.shuffledIndexes = this.props.state.shuffledIndexes || this._shuffle(Object.keys(this.props.children));
    }
    this.radioGroup = new MKRadioButton.Group();
  }
  render() {
    const isEditor = this.props.mode === EDITOR;
    const userAnswers = (this.props.state && this.props.state.answers) ? this.props.state.answers : {};
    const currentSelection = (isEditor || this.props.showAnswers) ? this.props.model.data.correctAnswersIds : userAnswers;
    return (
      <View>
        { this.props.model.data.options.map((option, index) => {
          const optionId = this.props.model.data.options[index];
          const inputId = true ? `radio${optionId}` : `checkbox${optionId}`;
          const isChecked = (isEditor || this.props.showAnswers) ? (currentSelection && currentSelection.indexOf(optionId) > -1) : (currentSelection && currentSelection[optionId] !== undefined);

          return (
            <TouchableNativeFeedback key={option}
              onPress={ e => {
                const checked = !isChecked;
                // if (isEditor) {
                //   this.props.setOptionInAnswersIds(option, checked);
                // } else {
                //   this.props.setUserAnswerById(option, checked, this.state.shuffledIndexes);
                // }
              }}
            >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <MKRadioButton
                checked={isChecked}
                group={this.radioGroup}
              />
              <View style={{ flex: 0.7 }}>
                <this.props.interaction id={option} style={{ flex: 1, height: 100 }}/>
              </View>
              { isEditor && this.props.model.data.options.length > 2 &&
              <TouchableOpacity style={{ flex: 0.1 }} onPress={this.props.deleteChild.bind(null, option)}>
                <Text style={{ color: 'red', textAlign: 'center' }}>
                  x
                </Text>
              </TouchableOpacity>
              }
            </View>
            </TouchableNativeFeedback>
          );
        }) }
      </View>
    );
  }
}
