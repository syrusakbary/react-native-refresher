var React = require('react-native');
var NativeMethodsMixin = require('NativeMethodsMixin')
var {
  View,
  StyleSheet,
  Text
} = React;

class Indicator extends React.Component {
    getText() {
        switch (this.props.status) {
            case 'pull':
                if (this.props.threshold > 1) {
                    return 'Release to refresh'
                }
                return `Pull to refresh ${this.props.threshold}`
            break;
            case 'loading':
                return 'Loading...'
            break;
        }
        return null;
    }
    render() {
        if (!this.props.status) return null;
        return(<Text style={styles.text}>
            {this.getText()}
        </Text>);
    }
}

Indicator.defaultProps = {
    height: 30,
    position: 'top'
}

var styles = StyleSheet.create({
});

module.exports = Indicator
