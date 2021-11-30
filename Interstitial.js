import React from 'react';
import { Platform,View } from 'react-native';
import { AdMobInterstitial} from 'expo-ads-admob';

export default async function Interstitial () {
  if(__DEV__){
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // テスト広告
  }else{
    if(Platform.OS === 'ios'){
      AdMobInterstitial.setAdUnitID('ca-app-pub-9830305702055127/1992165608'); //iOS
    }else{
      AdMobInterstitial.setAdUnitID('ca-app-pub-9830305702055127/1474641923'); //android
    }
  }
  await AdMobInterstitial.requestAdAsync();
  await AdMobInterstitial.showAdAsync();
};