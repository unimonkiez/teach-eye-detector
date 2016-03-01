'use strict';

var React = require('react-native');
var {
  TouchableNativeFeedback,
  TextInput,
  Text,
  View
} = React;

export default class Start extends React.Component {
  state = {
    name:  this.props.name
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter your name"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          onSubmitEditing={this._onSubmit}
        />
        <Text style={styles.errorText}>
        { ' ' }
        {
        this.state.error &&
        'Must provide a name'
        }
        </Text>
        <TouchableNativeFeedback
            onPress={this._onSubmit}
            background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>START</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
  _onSubmit = () => {
    if (this.state.name) {
      this.props.onStart(this.state.name);
    } else {
      this.setState({ error: true });
    }
  };
}
var styles = React.StyleSheet.create({
  container: {
    paddingBottom: 150,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    margin: 20,
    borderRadius: 5
  },
  buttonText: {
    color: '#EAF5FD',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 30
  },
  errorText: {
    color: '#f00'
  }
});
