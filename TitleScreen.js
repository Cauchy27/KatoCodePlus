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

  constructor(props) {
    super(props);
    this.state = { 
      bgm:{
        title:new Audio.Sound,
        change:new Audio.Sound,
      }
    };
  }

  componentDidMount = async() => {
    this.state.bgm.title = new Audio.Sound;
    this.soundStart(this.state.bgm.title,Sounds.bgm1, 0.03);
  };

  stopBgm =async(state)=>{
    await state.stopAsync();
  };

  // BGM再生用（音量なども調整）
  soundStart =async(state,select,inputVol) =>{
    // bgm
      await state.loadAsync(select);//ファイルロード
      // console.log(state );
      await state.setVolumeAsync(inputVol);//音量
      await state.playAsync();//スタート
  };

  componentWillUnmount(){
    this.stopBgm(this.state.bgm.title);
  }

  // restartSound = async(state) =>{
  //   return await state.playAsync();
  // };


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
      console.log("1");
    // destinationごとに音声を変えておく
      this.stopBgm(this.state.bgm.title);
      this.state.bgm.change = new Audio.Sound;
      switch(destination){
        // case "フリー対戦":
        //   selector = Sounds.yaruo;
        //   break;
        // case "カトフェス":
        //   selector = Sounds.yaruo;
        //   break;
        case "切り抜きチャンピオンシップ":
          this.soundStart(this.state.bgm.change,Sounds.katou7,0.5);
          this.stopBgm(this.state.bgm.title);
          return this.props.navigation.navigate(destination);
        case "カトモン生成":
          this.soundStart(this.state.bgm.change,Sounds.katou8,1);
          this.stopBgm(this.state.bgm.title);
          return this.props.navigation.navigate(destination);
      }
    } 
    catch (error) {
      console.log('error...');
    }
  };

  render(){
    
    return(
      <View style = {styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.backgroundTitle} />
        <View style = {styles.title}>
          <View style={{flex:1}}>
            <Text style = {styles.hello}>
              カトコードの世界へ
            </Text>
            <Text style = {styles.hello}>ようこそ</Text>
          </View>
          <View style = {styles.menu}>
            <TouchableOpacity 
              onPress={() =>
                this.goto('切り抜きチャンピオンシップ')
                // ↑第二引数で、遷移先に渡す変数を
              }
              style = {styles.bottun}
            >
              <Text style={{color : "#ffff00",textAlign:"center",
              fontSize:Math.round(Constants.MAX_WIDTH/1.3/20)
            }}>
                切り抜きチャンピオンシップ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.goto('カトモン生成')
              }
              style = {styles.bottun}
            >
              <Text style={{color : "#00ffff",textAlign:"center",
              fontSize:Math.round(Constants.MAX_WIDTH/1.3/20)
            }}>
                カトモン生成/カトフェス
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() =>
                this.restartSound(this.state.bgm.title)
              }
              style = {styles.bottun}
            >
              <Text style={{color : "#00ffff",textAlign:"center"}}>
                BGM再再生
              </Text>
            </TouchableOpacity> */}
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
    fontSize: Math.round(Constants.TITLE_WIDTH/1.3/12),
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
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
    height: Constants.TITLE_HEIGHT/2.3,
    width:Constants.TITLE_WIDTH/1.3,
    paddingTop:"10%",
    marginBottom: "5%",
    paddingLeft:"5%",
    paddingRight:"5%",
    borderRadius:20,
  },
  menu:{
    // backgroundColor: '#eee',
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius:10,
    flex:1.5,
    flexDirection:"column",
    justifyContent:"center",
  },
  bottun:{
    marginTop:"5%",
    marginBottom:"5%",
    backgroundColor:"#696969",
    borderRadius:20,
    flex:1,
    flexDirection:"column",
    justifyContent:"center",
  },
  
});
