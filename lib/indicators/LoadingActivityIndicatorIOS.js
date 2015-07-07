var React = require('react-native');
var {
  View,
  ActivityIndicatorIOS,
  StyleSheet
} = React;

class LoadingActivityIndicatorIOS extends React.Component {
    render() {
        let {threshold, height, status} = this.props;
        if (!status) return null;
        return <View style={[{height},styles.main,this.props.style]}>
            <ActivityIndicatorIOS
                style={{transform:[{scaleX:threshold*0.75},{scaleY:threshold*0.75},{translateY:parseInt((1-threshold)*-10)}, {rotate:parseInt(threshold*12)*30+"deg"}]}}
                size='large'
                animating={status=='loading'}
                hidesWhenStopped={false}/>
        </View>;
    }
}

LoadingActivityIndicatorIOS.defaultProps = {
    threshold: 0,
    height: 60,
    position: 'fixed'
}

var styles = StyleSheet.create({
    main: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
});

LoadingActivityIndicatorIOS.position = 'fixed';

module.exports = LoadingActivityIndicatorIOS
