var React = require('react-native');
var precomputeStyle = require('precomputeStyle');
var logError = require('logError');
var LoadingActivityIndicatorIOS = require('./indicators/LoadingActivityIndicatorIOS');
var isPromise = require('is-promise')

var {
  ListView,
  View,
  Text,
  ActivityIndicatorIOS,
  StyleSheet,
  cloneElement
} = React;

let FIXED = 'fixed';
let TOP = 'top';

changeProps = (instance, props) => {
    if (!instance) return;
    Object.keys(props).forEach(function (key) {
        instance.props[key] = props[key];
    });
    instance.forceUpdate()
}

class RefresherListView extends React.Component {
    constructor() {
        super();
        this.state = {
            threshold: 0,
            top: 0,
        }
    }

    onResponderGrant(e) {
        this.props.onResponderGrant && this.props.onResponderGrant(...arguments);
        if (!this.top) {
            this.top = this.top || (e.nativeEvent.contentInset && e.nativeEvent.contentInset.top);
            this.setState({top:this.top});
        }
        this.state.threshold = 0;
        this.scrolling = true;
    }

    onResponderRelease() {
        this.props.onResponderRelease && this.props.onResponderRelease(...arguments);
        this.scrolling = false;
        if (!this.props.refreshOnRelease && !this.scrolling) return;
        this._doLoading();
    }

    getScrollResponder() {
        return this.refs.listview.getScrollResponder();
    }

    setNativeProps(props) {
        this.refs.listview.setNativeProps(props)
    }

    handleRefresh() {
        // Code inspired by
        // react-native-refreshable-listview
        // https://github.com/jsdf/react-native-refreshable-listview/blob/master/lib/RefreshableListView.js#L37

        if (this.willRefresh) return

        this.willRefresh = true

        var loadingPromise = new Promise((resolve) => {
            var refreshReturnValue = this.props.onRefresh(resolve)

            if (isPromise(refreshReturnValue)) {
                loadingPromise = refreshReturnValue
            }

            var delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

            Promise.all([
                loadingPromise,
                new Promise((resolve) => {
                    this.isLoading = true;
                    this.setState(resolve)
                }),
                delay(this.props.minTime),
            ])
            .then(() => {
                this.willRefresh = false;
                this.isLoading = false;
                this._hideLoading();
            })
        })
    }

    onScroll(e) {
        this.props.onScroll && this.props.onScroll();

        let offsetY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y
        if (this.isLoading || this.lastOffsetY==offsetY) return;

        let listviewscroll = this.getScrollResponder();
        let threshold = Math.max(Math.min(-offsetY/this.getIndicatorHeight(),1),0);
        let status = (threshold>=this.state.threshold&&!listviewscroll.scrollResponderIsAnimating()||this.scrolling)?'pull':null;

        this.state.loadingStatus = status;
        this.state.threshold = threshold;
        changeProps(this.refs.indicator, {threshold, status});

        this.lastOffsetY = offsetY;

        if (!this.scrolling) return;
        if (!this.props.refreshOnRelease && this.state.threshold >=1) {
            this._doLoading();
            return;
        }
    }

    requestAnimationFrame() {
        this.refs.listview.requestAnimationFrame(...arguments);
    }

    _hideLoading() {
        let listviewscroll = this.getScrollResponder();

        setTimeout(() => {
            this.updateUIThreshold(0);
        },300)

        setTimeout(() => {
            this.requestAnimationFrame(() => {
                if (!this.scrolling && !listviewscroll.scrollResponderIsAnimating() && this.lastOffsetY<this.top) {
                    listviewscroll.scrollTo(-this.top)
                }
            });
        },50)
    }

    updateUIThreshold(threshold) {
        let listview = this.refs.listview;
        let listviewscroll = listview.getScrollResponder();
        this.requestAnimationFrame(() => {
            listviewscroll.setNativeProps(precomputeStyle({contentInset:{top:threshold}}));
            listviewscroll.refs.InnerScrollView.setNativeProps(precomputeStyle({paddingTop:threshold}))
            listview.setNativeProps(precomputeStyle({top:-threshold,bottom:0}))
        });
    }

    _doLoading(){
        if (this.willRefresh || this.isLoading || this.state.threshold<1) return;

        this.updateUIThreshold(this.getIndicatorHeight());

        this.state.loadingStatus = 'loading';
        this.state.threshold = 1;

        changeProps(this.refs.indicator, {status: this.state.loadingStatus, threshold:this.state.threshold});

        this.handleRefresh()
    }

    _getIndicatorPosition() {
        return this.props.indicatorPosition || this.props.indicator.props.position || this.props.indicator.position || FIXED;
    }

    _isIndicatorFixed() {
        return this._getIndicatorPosition() == FIXED;
    }
    getIndicatorHeight() {
        return this.props.threshold == 'auto' ? 
        (this.refs.indicator && this.refs.indicator.props.height) || this.props.indicator.props.height
        : parseInt(this.props.threshold);
    }
    renderHeader() {
        if (this._isIndicatorFixed()) {
            // Render the default ListView header if the indicator position is fixed
            return this.props.renderHeader && this.props.renderHeader();
        }
        return (<View style={{height:this.getIndicatorHeight(), flex:1, alignItems:'flex-end', flexDirection:'row', marginTop:-this.getIndicatorHeight()}}>
            <View style={{flex:1}}>
                {this.renderIndicator()}
            </View>
        </View>);
    }

    renderIndicator() {
        let Indicator = this.props.indicator;
        return cloneElement(Indicator, {
            ref: (indicator => {this.refs.indicator = indicator || this.refs.indicator}.bind(this)),
            status: this.state.loadingStatus,
            height: this.getIndicatorHeight(),
            threshold: this.state.threshold
        });
    }

    render() {
        let Component = this.props.component;
        return (<View style={[{flex:1}, this.props.style]}>
                <View style={[styles.fixedLoaderWrapper, {marginTop:this.top||0}]}>
                    {this._isIndicatorFixed()?this.renderIndicator():null}
                </View>
                <Component {...this.props}
                style={this.props.listStyle}
                onResponderRelease={this.onResponderRelease.bind(this)}
                onResponderGrant={this.onResponderGrant.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                ref="listview"
                onScroll={this.onScroll.bind(this)}
                />
            </View>);
    }
}

var styles = StyleSheet.create({
    fixedLoaderWrapper: {
        position:'absolute',
        flex:1,
        top:0,
        marginTop:0,
        left:0,
        right:0
    },
    list: {
        backgroundColor:'transparent',
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0
    }
});


RefresherListView.defaultProps = {
    threshold: 'auto',
    component: ListView,
    minTime: 320,
    indicator: <LoadingActivityIndicatorIOS />,
    refreshOnRelease: false,
    listStyle: styles.list,
};

RefresherListView.DataSource = ListView.DataSource;

module.exports = RefresherListView
