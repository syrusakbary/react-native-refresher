/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  NavigatorIOS,
  PixelRatio
} = React;
var {RefresherListView} = require('react-native-refresher');
var Indicator = require('./indicator');

class Content extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.numRows = 0;
    this.state = {
      dataSource: this.fillRows(),
    };
  }
  fillRows() {
    this.numRows += 5;
    var rows = Array.apply(0, new Array(this.numRows)).map((x,i) => `Row ${i}`);
    return this.ds.cloneWithRows(rows);
  }
  onRefresh() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        this.setState({dataSource:this.fillRows()})
      }, 500);
    });
  }
  render() {
    return (
      <View style={{flex:1}}>
        <RefresherListView
          dataSource={this.state.dataSource}
          indicator={<Indicator />}
          refreshOnRelease={true}
          onRefresh={this.onRefresh.bind(this)}
          renderRow={(rowData) => <View style={styles.row}><Text>{rowData}</Text></View>}
        />
      </View>
    );
  }
};

// A wrapper for showing the iOS Navigator
class CustomIndicator extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={{flex:1}}
        initialRoute={{
          component: Content,
          title: 'Custom Indicator',
        }}
      />
    );
  }
}

var styles = StyleSheet.create({
  row: {
    padding: 10,
    borderTopColor: '#CCCCCC',
    backgroundColor: 'white',
    borderTopWidth: 1/PixelRatio.get(),
    marginBottom:-1,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1/PixelRatio.get(),
  }
});

AppRegistry.registerComponent('CustomIndicator', () => CustomIndicator);
