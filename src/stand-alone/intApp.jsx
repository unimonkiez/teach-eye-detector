/**
 * Created by Eyal.Nussbaum on 1/13/2016.
 */
import Task from '../task/index.jsx';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import interactionLangEn from 'interactionLangEn';
import interactionLangFr from 'interactionLangFr';
import interactionLangHe from 'interactionLangHe';

const languageMap = {
  en_us: interactionLangEn,
  fr_fr: interactionLangFr,
  he_il: interactionLangHe
};


class InteractionPlayer extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      language: languageMap[this.props.lang],
      model: JSON.parse(this.props.model)
    };
  }
  render() {
    return (
      <Task
        displayQuestion={false}
        language={this.state.language}
        model={this.state.model}
        onModelChange={model => this.setState({ model })}
        state={this.state.state}
        onStateChange={state => this.setState({ state })}
        mode={Task.MODE.PLAYER}
      />
    );
  }
}
InteractionPlayer.propTypes = {
  lang: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired
};

window.t2k = window.t2k || {};
window.t2k.renderInteractionPlayer = (scriptParams, container) => {
  ReactDOM.render(<InteractionPlayer {...scriptParams}/>, container);
};
