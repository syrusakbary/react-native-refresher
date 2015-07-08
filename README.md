<img src="https://raw.githubusercontent.com/syrusakbary/react-native-refresher/master/logo.png" width="300"/>

A pull to refresh ListView for React Native completely written in js.
Also supports custom animations.

## Installation

```sh
npm install react-native-refresher --save
```

## Usage

```js
var React = require('react-native');
// Loading the refresher ListView and Indicator
var {
  RefresherListView,
  LoadingBarIndicator
} = require('react-native-refresher');

var {
  AppRegistry,
  Text,
  View,
  ListView,
} = React;


class Content extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(["Row 1", "Row 2"]),
    };
  }
  onRefresh() {
  	// You can either return a promise or a callback
    this.setState({dataSource:this.fillRows(["Row 1", "Row 2", "Row 3", "Row 4"])});
  }
  render() {
    return (
      <View style={{flex:1}}>
        <RefresherListView
          dataSource={this.state.dataSource}
          onRefresh={this.onRefresh.bind(this)}
          indicator={<LoadingBarIndicator />}
          renderRow={(rowData) => <View style={{padding:10,borderBottomColor: '#CCCCCC', backgroundColor: 'white',borderBottomWidth: 1}}><Text>{rowData}</Text></View>}
        />
      </View>
    );
  }
};

```

## Examples

![Refresher: iOS Activity Indicator](https://raw.githubusercontent.com/syrusakbary/react-native-refresher/master/screencasts/activity-indicator-fixed.gif)
![Refresher: Bar Indicator](https://raw.githubusercontent.com/syrusakbary/react-native-refresher/master/screencasts/bar-indicator-top.gif)


#### Props

- `threshold: number`
  The amount of pixeles to validate the refresh.
  By default the theshold will be calculated by the header height.
- `minTime: number`
  The minimum amount of time for showing the loading indicator while is refreshing. Default 320ms.
- `onRefresh: func.isRequired`
  Called when user pulls listview down to refresh.
- `indicator: oneOfType([element])`
  React Element. See [example of a custom indicator](https://github.com/syrusakbary/react-native-refresher/blob/master/examples/CustomIndicator/indicator.js)
- `refreshOnRelease: bool`
  If is necessary to release touch for refresh or refresh will be done automatically once threshold is passed.
- `listStyle: style`
  The list style


# Credits

Refresher is created by [Syrus Akbary](https://www.syrusakbary.com) and inspired by [Refresher](https://github.com/jcavar/refresher) and [react-native-refreshable-listview](https://github.com/jsdf/react-native-refreshable-listview).
If you have suggestions or bug reports, feel free to send pull request or [create new issue](https://github.com/syrusakbary/react-native-pullrefresh-listview/issues/new).

