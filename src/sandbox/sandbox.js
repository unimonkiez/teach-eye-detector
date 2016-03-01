import React, { Component, View, Text } from 'react-native';
import Toolbar from './toolbar.js';
import Task from '../task/index.js';
import config from './config.js';


import interactionLangEn from '../../.tmp/language/en_us.json';
import interactionLangFr from '../../.tmp/language/fr_fr.json';
import interactionLangHe from '../../.tmp/language/he_il.json';

const languageMap = {
  en_us: interactionLangEn,
  fr_fr: interactionLangFr,
  he_il: interactionLangHe
};

export default class Sandbox extends Component {
  render() {
    // <Toolbar onChange={this.onToolbarChange.bind(this)}/>
    // <Data/>
    // <div className={config.sandboxSettings.theme} style={{ width: config.sandboxSettings.width }}>
    // </div>
    return (
      <View>
        <Toolbar onChange={this.onToolbarChange.bind(this)}/>
          <Task
            language={languageMap[config.sandboxSettings.language]}
            mode={config.sandboxSettings.mode}
            model={config.model}
            onModelChange={this.handleModelChange.bind(this)}
            state={config.state}
            onStateChange={this.handleStateChange.bind(this)}
            displayQuestion={config.sandboxSettings.displayQuestion}
            displaySettings={config.sandboxSettings.displaySettings}
            displayProgress={config.sandboxSettings.displayProgress}
          />
      </View>
    );
  }
  onToolbarChange() {
    this.forceUpdate();
  }
  handleModelChange(model) {
    config.setModel(model);
    this.forceUpdate();
  }
  handleStateChange(state) {
    config.setState(state);
    this.forceUpdate();
  }
}
