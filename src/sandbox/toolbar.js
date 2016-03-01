import React, { Component, PropTypes, StyleSheet, View, ToolbarAndroid } from 'react-native';
import Task from '../task/index.js';
import config from './config.js';

const modeToString = mode => {
  let name;
  switch (mode) {
    case Task.MODE.EDITOR:
      name = 'player';
      break;
    case Task.MODE.PLAYER:
      name = 'editor';
      break;
  }
  return `Change to ${name}`;
};

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: 'green'
  }
});

export default class Toolbar extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };
  render() {
    const { generalOptions, sandboxSettings, isSaveForRefresh } = config;

    return (
      <View>
        <ToolbarAndroid
          title="Interaction app"
          actions={[{ title: sandboxSettings.initialType, show: 'always' }, { title: sandboxSettings.mode, show: 'always' }]}
          onActionSelected={this.handleActionSelected.bind(this)}
          style={styles.toolbar}
        />
      </View>
    );
  }
  selectedIndex = 0;
  handleActionSelected(index) {
    this.selectedIndex++;
    this.selectedIndex = this.selectedIndex % config.generalOptions.initialTypes.length;
    switch (index) {
      case 1:
        this.handleModeClick();
        break;
      default:
        this.handleInitialTypeChange({
          target: {
            selectedIndex: this.selectedIndex
          }
        });
    }
  }
  handleModeClick() {
    const mode = config.sandboxSettings.mode === Task.MODE.EDITOR ? Task.MODE.PLAYER : Task.MODE.EDITOR;
    config.setSandboxSettings({ ...config.sandboxSettings, mode });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleWidthChange(e) {
    const width = config.generalOptions.widths[e.target.selectedIndex];
    config.setSandboxSettings({
      ...config.sandboxSettings,
      width
    });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleInitialTypeChange(e) {
    const initialType = config.generalOptions.initialTypes[e.target.selectedIndex];
    config.setSandboxSettings({ ...config.sandboxSettings, initialType });
    config.setState(undefined);
    config.setModel(Task.getDefaultModel(config.sandboxSettings.initialType));
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleLanguageChange(e) {
    const language = config.generalOptions.languages[e.target.selectedIndex];
    config.setSandboxSettings({ ...config.sandboxSettings, language });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleThemeChange(e) {
    const theme = config.generalOptions.themes[e.target.selectedIndex];
    config.setSandboxSettings({ ...config.sandboxSettings, theme });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleDisplayQuestionChange(e) {
    const displayQuestion = e.target.checked;
    config.setSandboxSettings({ ...config.sandboxSettings, displayQuestion });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleDisplaySettingsChange(e) {
    const displaySettings = e.target.checked;
    config.setSandboxSettings({ ...config.sandboxSettings, displaySettings });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleDisplayProgressChange(e) {
    const displayProgress = e.target.checked;
    config.setSandboxSettings({ ...config.sandboxSettings, displayProgress });
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleIsSaveForRefreshChange(e) {
    const isSaveForRefresh = e.target.checked;
    config.setIsSaveForRefresh(isSaveForRefresh);
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
  handleResetClick() {
    config.setState(undefined);
    if (config.sandboxSettings.mode === Task.MODE.EDITOR) {
      config.setModel(Task.getDefaultModel(config.sandboxSettings.initialType));
    }
    if (this.props.onChange) {
      this.props.onChange();
    }
  }
}
