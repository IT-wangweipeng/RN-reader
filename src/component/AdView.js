import React, {Component} from 'react';
import {
  requireNativeComponent
} from 'react-native';

let RCTAdView = requireNativeComponent('RCTAdView', AdView);
class AdView extends Component {

  render() {
    return <RCTAdView  {...this.props}/>
  }
}

module.exports = AdView;
