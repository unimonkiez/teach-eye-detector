'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;

export default class MyAwesomeApp extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Result</Text>
      </View>
    )
  }
}
var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
