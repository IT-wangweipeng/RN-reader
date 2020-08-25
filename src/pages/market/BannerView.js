import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('window')
const PADDING_HORIZONTAL = 16
const BANNER_WIDTH = width - PADDING_HORIZONTAL * 2
const BANNER_HEIGHT = 130

class BannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0
    };
  }


  renderChilds = () => {
    return this.props.data.map((item, i) => {

      return (
        <TouchableOpacity
          key={`recommend_${i}`}
          onPress={()=>{
            const {navigation} = this.props
            switch(item.type) {
              case 1://图书编号
                navigation.navigate('Detail',{bookId: item.url})
                break;
              case 2://URL链接
                navigation.navigate('Web',{url: item.url})
                break;
              case 4://发现二级页面
                if (item.discovery_type == 1) {//书籍
                  this.props.navigation.navigate('DiscoveryBook', {
                    title: item.discovery_title,
                    id: item.discovery_id
                  })
                } else if (item.discovery_type == 2) {//作者
                  this.props.navigation.navigate('DiscoveryAuthor', {
                    id: item.discovery_id
                  })
                }
                break;
              case 5://内部链接(登录)
                break;
              case 6://内部链接(福利)
                break;
            }
            this.props.onPressBanner && this.props.onPressBanner()
          }}
          >
          <Image
            key={`item${i}`}
            source={{uri: item.image, cache: 'force-cache'}}
            resizeMethod="resize"
            style={[styles.imageStyle, this.props.containerStyle]}
          ></Image>
        </TouchableOpacity>
      )
    });
  }

  renderCircles = () => {
    return this.props.data.map((item, i) => {
      if (i === this.state.currentPage) {
        return <View key={`indicator${i}`} style={styles.activeCircleStyle}/>
      }
      return <View key={`indicator${i}`} style={styles.circleStyle}/>
    });
  }

  handleScroll = (e) => {
    var x = e.nativeEvent.contentOffset.x;
    var currentPage = Math.floor(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    this.setState({currentPage: currentPage});
    console.log("currentPage:" + currentPage);
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      var currentPage = ++this.state.currentPage == this.props.data.length ? 0 : this.state.currentPage;
      this.setState({currentPage: currentPage});
      var offsetX = currentPage * BANNER_WIDTH;
      this.refs.scrollView.scrollTo({x: offsetX, y: 0, animated: true});
      console.log(currentPage);
    }, this.props.duration || 5000);
  }

  handleScrollBegin = () => {
    console.log("handleScrollBegin");
    clearInterval(this.timer);
  }

  handleScrollEnd = () => {
    console.log("handleScrollEnd");
    this.startTimer();
  }

  render() {
    return <View style={styles.container}>
      <ScrollView
        ref="scrollView"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        onMomentumScrollEnd={this.handleScroll}
        onScrollBeginDrag={this.handleScrollBegin}
        onScrollEndDrag={this.handleScrollEnd}>
        {this.renderChilds()}
      </ScrollView>
      <View style={styles.circleWrapperStyle}>
        {this.renderCircles()}
      </View>
    </View>;
  }

  componentDidMount = () => {
    this.startTimer();
  }

  componentWillUnmount = () => {
    clearInterval(this.timer);
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  imageStyle: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 8,
  },
  circleWrapperStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
  },
  circleStyle: {
    backgroundColor: '#cccccc',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginStart: 3,
  },
  activeCircleStyle: {
    backgroundColor: '#ffffff',
    width: 11,
    height: 6,
    borderRadius: 3,
    marginStart: 3,
  }
});

export default BannerView
