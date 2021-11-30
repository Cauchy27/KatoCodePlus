import { StatusBar } from 'expo-status-bar';
import React,{ Component } from 'react';
import { 
  SafeAreaView,
  StyleSheet, 
  Text, 
  View,
  Button,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import Images from './assets/Images';
import Constants from './Constants';
import BannerAd from './BannerAd';

import Sounds from './assets/Sounds';

import { AdMobBanner } from 'expo-ads-admob';

// 最初に開くところ
export default class TitleScreen extends Component {

  componentDidMount = async() => {

    // bgm
    this.soundId = new Audio.Sound();//オブジェクト導入
    await this.soundId.loadAsync(Sounds.bgm1);//ファイルロード
    // console.log(this.soundId );
    await this.soundId.setStatusAsync({ volume: 0.03 });//音量
    await this.soundId.playAsync();//スタート

  };

  stopBgm =async()=>{
    await this.soundId.setStatusAsync({ shouldPlay: false, positionMillis: 0 });
  };

  soundStart =async(select,inputVol) =>{
    // bgm
      this.soundId = new Audio.Sound();//オブジェクト導入
      await this.soundId.loadAsync(select);//ファイルロード
      // console.log(this.soundId );
      await this.soundId.setStatusAsync({ volume: inputVol });//音量
      await this.soundId.playAsync();//スタート
  };

  componentWillUnmount(){
    this.stopBgm();
  }

  testData =777;

  Interstitial =async()=>{
    if(__DEV__){
      AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // テスト広告
    }else{
      if(Platform.OS === 'ios'){
        AdMobInterstitial.setAdUnitID('ca-app-pub-9830305702055127/1992165608'); //iOS
      }else{
        AdMobInterstitial.setAdUnitID('ca-app-pub-9830305702055127/1474641923'); //android
      }
    }
    try{
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    }
    catch(error){
      console.log("Ad error...");
    }
  };

  goto = async(destination) => {
    try {
    // destinationごとに音声を変えておく
      const soundObject = new Audio.Sound();
      switch(destination){
        case "フリー対戦":
          await soundObject.loadAsync(require('./assets/sound/yaruo.mp3'));
          break;
        case "カトフェス":
          await soundObject.loadAsync(require('./assets/sound/jun-effect1.mp3'));
          break;
        case "切り抜きチャンピオンシップ":
          await soundObject.loadAsync(require('./assets/sound/pubg1-1.mp3'));
          await soundObject.setStatusAsync({ volume: 0.5 });//音量
          break;
        case "カトモン生成":
          await soundObject.loadAsync(require('./assets/sound/fujinami3.mp3')); 
          break;  
      }

      await soundObject.playAsync();
      console.log('success!!!');
      await this.stopBgm();

      this.props.navigation.navigate(destination)
    } 
    catch (error) {
      console.log('error...');
    }
  };
  


  render(){
    
    return(
      <View style = {styles.container}>
        {console.log(this.testData)}
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.backgroundTitle} />
        <View style = {styles.title}>
          <View>
            <Text style = {styles.hello}>
              カトコードの世界へ
            </Text>
            <Text style = {styles.hello}>ようこそ</Text>
          </View>
          <View style = {styles.menu}>
            <TouchableOpacity 
              onPress={() =>
                this.goto('切り抜きチャンピオンシップ',this.testData)
                // ↑第二引数で、遷移先に渡す変数を
              }
              style = {styles.bottun}
            >
              <Text style={{color : "#ffff00",textAlign:"center"}}>
                切り抜きチャンピオンシップ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.goto('カトモン生成')
              }
              style = {styles.bottun}
            >
              <Text style={{color : "#00ffff",textAlign:"center"}}>
                カトモン生成/カトフェス
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <BannerAd/>
      </View>
    );
  }
}

// CSS的なもの
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hello: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'DotGothic16_400Regular',
    // backgroundColor:"#d2b48c",
    paddingTop:"5%",
    // paddingBottom:0,
    paddingLeft:"2%",
    paddingRight:"2%",
    textAlign:"center",
  },
  backgroundImage: {
    // width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
    resizeMode: "cover",
    position: 'absolute',
  },
  title:{
    backgroundColor:"#d2b48c",
    // color:"#d2b48c",
    height: Constants.TITLE_HEIGHT/2.5,
    // paddingLeft:"2%" ,
    // paddingRight:"2%",
    paddingTop:"5%",
    bottom: "5%",
    paddingLeft:"5%",
    paddingRight:"5%",
    borderRadius:10,
  },
  menu:{
    // backgroundColor: '#eee',
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius:10,
  },
  bottun:{
    margin:"5%",
    padding:"5%",
    backgroundColor:"#696969",
    borderRadius:20,
  },
  
});
