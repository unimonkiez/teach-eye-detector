import React, { Component, NativeModules } from 'react-native';
import Start from './src/start.js';
import Quiz from './src/quiz.js';
import Result from './src/result.js';


const START = 0;
const QUIZ = 1;
const RESULT = 2;
class MyAwesomeApp extends Component {
  state = {
    name: undefined,
    results: {},
    step: START
  };
  render() {
    let component
    switch (this.state.step) {
      case START:
        component = <Start name={this.state.name} onStart={this.handleStart}/>;
        break;
      case QUIZ:
        component = <Quiz name={this.state.name} onDone={this.handleDone}/>;
        break;
      case RESULT:
        component = <Result name={this.state.name} results={this.state.results} onReset={this.handleReset}/>;
        break;
      default:
        throw `Error, didn't find step ${this.state.step}`;
    }
    return component;
  }
  handleStart = name => {
    this.setState({
      name,
      step: QUIZ
    }, () => {
      NativeModules.ReactNativePackage.start(this.state.name);
    });
  };
  handleDone = results => {
    this.setState({
      results,
      step: START
    }, () => {
      NativeModules.ReactNativePackage.done();
    });
  };
  handleReset = () => {
    this.setState({
      step: START
    });
  };
}

React.AppRegistry.registerComponent('MyAwesomeApp', () => MyAwesomeApp);
