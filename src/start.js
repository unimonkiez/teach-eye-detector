'use strict';

var React = require('react-native');
var {
  Text,
  View
} = React;

export default class MyAwesomeApp extends React.Component {
  componentDidMount() {
    setTimeout(this.props.onStart.bind(null, 'HEY'), 1000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Start</Text>
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
