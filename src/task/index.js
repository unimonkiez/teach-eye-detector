import React, { Component, PropTypes, View, Text } from 'react-native';
const getIsCheckAnswerReady = () => true;

import Interaction from '../interaction/index.js';

export default class Task extends Component {
   static MODE = Interaction.MODE;
   static TYPE = Interaction.TYPE;
   static defaultProps = {
     displaySettings: true,
     displayQuestion: true,
     displayProgress: true
   };
   static getDefaultModel = type => ({
     data: {
       maxAttempts: 2,
       feedback: {}
    },
    question: Interaction.getDefaultModel(Interaction.TYPE.RICHTEXT),
    interaction: Interaction.getDefaultModel(type)
  });
  componentWillMount() {
    this.setState({
      model: this.props.defaultModel,
      state: this.props.defaultState
    });
  }
  render() {
    const isPlayer = this.props.mode === Task.MODE.PLAYER;

    const model = this.props.model || this.state.model;
    const state = this.props.state || this.state.state;
    const attempts = state && state.data && state.data.attempts !== undefined ? state.data.attempts : 0;
    const isCheckAnswerReady = getIsCheckAnswerReady(model && model.interaction, state && state.interaction);

    let currentFeedback;
    if (this.props.mode === Task.MODE.PLAYER) {
      const feedback = this.props.model.data.feedback;
      const currentTextFeedback = feedback && feedback[this._currentAnswer];
      currentFeedback = currentTextFeedback && picker.unicodeToImage(currentTextFeedback);
    }
    return (
      <View>
        {
        this.props.displayQuestion &&
        <Interaction
          language={this.props.language.interaction}
          mode={this.props.mode}
          ltr={this.props.language.task.DIRECTION === 'ltr'}
          model={this.props.model && this.props.model.question}
          defaultModel={this.state.model && this.state.model.question}
          onModelChange={question => this.setTaskModel({ question })}
          state={this.props.state && this.props.state.question}
          defaultState={this.state.state && this.state.state.question}
          onStateChange={question => this.setTaskState({ question })}
        />
        }
        <View style={{ height: 1, backgroundColor: 'gray', marginTop: 10, marginBottom: 5 }}/>
        <Interaction
          ref="interaction"
          language={this.props.language.interaction}
          mode={this.props.mode}
          ltr={this.props.language.task.DIRECTION === 'ltr'}
          showAnswers={state && state.data && state.data.progress === prosressState.SHOW_MY_ANSWER}
          model={this.props.model && this.props.model.interaction}
          defaultModel={this.state.model && this.state.model.interaction}
          onModelChange={interaction => this.setTaskModel({ interaction })}
          state={this.props.state && this.props.state.interaction}
          defaultState={this.state.state && this.state.state.interaction}
          onStateChange={interaction => this.setTaskState({ interaction })}
        />
      </View>
    );
  }
  setTaskModel(newModel) {
    if (this.props.model !== undefined) {
      const model = {
        ...this.props.model,
        ...newModel
      };
      this.props.onModelChange(model);
    } else {
      const model = {
        ...this.state.model,
        ...newModel
      };
      this.setState({
        model
      }, this.props.onModelChange.bind(undefined, model));
    }
  }
  setTaskState(newState) {
    if (this.state.state === undefined) {
      const state = {
        ...this.props.state,
        ...newState
      };
      this.props.onStateChange(state);
    } else {
      const state = {
        ...this.state.state,
        ...newState
      };
      this.setState({
        state
      }, this.props.onStateChange.bind(undefined, state));
    }
  }
}
