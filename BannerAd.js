import React,{Component} from 'react';
import { Platform,View } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';

export default class BannerAd extends Component {
  bannerError() {
    console.log("Ad Fail error")
  }

  render(){
    return (
      <View >
        <AdMobBanner
          adUnitID={
            __DEV__ ? "ca-app-pub-3940256099942544/6300978111" // テスト広告
            : Platform.select({
              ios: "ca-app-pub-9830305702055127/5141073129" , // iOS
              android:"ca-app-pub-9830305702055127/9597702196" , // android 
            })
          }
          onDidFailToReceiveAdWithError={this.bannerError} 
        />
      </View>
    )
  }
}