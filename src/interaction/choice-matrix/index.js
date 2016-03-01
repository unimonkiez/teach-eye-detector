import React, { Component, View, Text } from 'react-native';
import { MKRadioButton } from 'react-native-material-kit';

const styles = React.StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default class ChoiceMatrix extends Component {
  radioGroups = this.props.model.data.rows.map(() => new MKRadioButton.Group());
  render() {
    return (
      <View>
        <View style={styles.row}>
          { this.props.model.data.columns.map((column, columnIndex) => (
            <View key={columnIndex}>
              <Text>
                { column }
              </Text>
            </View>
          )) }
        </View>
      { this.props.model.data.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <View>
            <Text>
              { row.text }
            </Text>
          </View>
          { this.props.model.data.columns.map((column, columnIndex) => (
              <View key={columnIndex}>
                <MKRadioButton
                  group={this.radioGroups[rowIndex]}
                />
              </View>
            ))
          }
        </View>
      )) }
      </View>
    );
  }
}
export const MIN_COLUMNS = 2;
export const MIN_ROWS = 2;
export const MAX_COLUMNS = 7;
