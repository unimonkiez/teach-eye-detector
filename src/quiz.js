import React, {
  Component,
  PropTypes,
  TouchableNativeFeedback,
  Text,
  ScrollView,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MKRadioButton } from 'react-native-material-kit';
import Task from '../src/task/index.js';
import Sun from '../src/demo/sun.json';
import Usa from '../src/demo/usa.json';
import Cm from '../src/demo/cm.json';
import englishTaskLanguage from '../.tmp/language/en_us.json';

const styles = React.StyleSheet.create({
  number: {
    fontWeight: 'bold',
    fontFamily: 'notoserif',
    fontSize: 24,
    color: 'white'
  },
  taskContainer: {
    marginTop: 15
  },
  button: {
    backgroundColor: '#0F9D58',
    margin: 20,
    borderRadius: 5
  },
  buttonText: {
    color: '#EAF5FD',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 30
  }
});

export default class Quiz extends Component {
  _onSubmit = () => {
    this.props.onDone();
  };
  static propTypes = {
    onDone: PropTypes.func.isRequired
  };
  state = {
    yuval: true,
    interactionModels: [
      Sun,
      Usa,
      Cm
    ],
    interactionStates: []
  };
  render() {
    return (
      <ScrollView>
        { this.state.interactionModels.map((interactionModel, index) => (
          <View key={index} style={styles.taskContainer}>
            <Icon.Button name="question-circle">
              <Text style={styles.number}>
                { index + 1 }
              </Text>
            </Icon.Button>
            <Task
              key={index}
              language={englishTaskLanguage}
              mode={Task.MODE.PLAYER}
              model={interactionModel}
              state={this.state.interactionStates[index]}
              onStateChange={ newState => {
                this.setState({
                  interactionStates: this.state.interactionStates.map((interactionState, interactionStateIndex) => interactionStateIndex === index ? newState : interactionState)
                });
              }}
            />
          </View>
        )) }
        <TouchableNativeFeedback
          onPress={this._onSubmit}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>DONE</Text>
          </View>
        </TouchableNativeFeedback>
      </ScrollView>
    );
  }
}
