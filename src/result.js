'use strict';

import React, {
  Component,
  TouchableNativeFeedback,
  TextInput,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Result extends Component {
  render() {
    return (
      <View>
        <Text>
          Result
        </Text>
        <View style={styles.button}>
          <Icon.Button name="retweet" backgroundColor="#3b5998" onPress={this._onSubmit}>
            <Text style={styles.buttonText}>
              AGAIN
            </Text>
          </Icon.Button>
        </View>
      </View>
    )
  }
  _onSubmit = () => {
    this.props.onReset();
  };
}
var styles = React.StyleSheet.create({
  button: {
    margin: 20
  },
  buttonText: {
    color: '#EAF5FD',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  }
});
