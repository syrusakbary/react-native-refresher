var React = require('react-native');
var {NativeMethodsMixin} = React;
var {
  View,
  StyleSheet,
  Text
} = React;

class LoadingBarIndicator extends React.Component {
    constructor() {
        super();
        this.state = {
            width: 320,
            height: 60
        };
    }
    measure() {
        (NativeMethodsMixin.measure.bind(this))(...arguments)
    }
    getText() {
        switch (this.props.status) {
            case 'pull':
                if (this.props.threshold > 1) {
                    return 'Release to refresh'
                }
                return 'Pull to refresh'
            break;
            case 'loading':
                return 'Loading...'
            break;
        }
        return null;
    }
    componentDidMount() {
        setTimeout(this.measureDimensions.bind(this));
    }
    measureDimensions() {
        this.measure((ox, oy, width, height) => {
            this.setState({width, height});
        });
    }
    render() {
        if (!this.props.status) return null;
        let maxWidth = this.state.width;
        return (<View style={[styles.main, {height: this.props.height}]}>
            <View style={styles.textWrapper}>
                <Text style={styles.text}>
                    {this.getText()}
                </Text>
            </View>
            <View style={[{backgroundColor:this.props.barColor,width:this.props.threshold*maxWidth}, styles.bar]} />
        </View>);
    }
}

LoadingBarIndicator.defaultProps = {
    barColor: '#00CC33',
    height: 40,
    position: 'top'
}

var styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    textWrapper: {
        flex: 1,
        alignItems: "center",
        flexDirection:"row"
    },
    bar: {
        height: 3
    },
    text: {
        flex: 1,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500'
    }
});

module.exports = LoadingBarIndicator
