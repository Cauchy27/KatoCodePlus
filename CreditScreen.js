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
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import Images from './assets/Images';
import Constants from './Constants';
import BannerAd from './BannerAd';

import Sounds from './assets/Sounds';

import { AdMobBanner } from 'expo-ads-admob';

// 効果音の再生に使う
async　function playEffectSound(sound,vol) {
  // console.log('Playing ' + name);
  Audio.Sound.createAsync(
     sound, {
        shouldPlay: true,
        volume: vol
     }
  ).then((res) => {
     res.sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.didJustFinish) return;
        // console.log('Unloading ' + name);
        res.sound.unloadAsync().catch(() => {});
     });
  }).catch((error) => {});
}

// 最初に開くところ
export default class CreditScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      opacity: new Animated.Value(0),
      flagCount:1,
      bgm:{
        title:new Audio.Sound,
        change:new Audio.Sound,
      }
    };
  }
  animate() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600*8,
      useNativeDriver:true,
    }).start();
  }

  componentDidMount = async() => {
    // this.state.bgm.title = new Audio.Sound;
    this.soundStart(this.state.bgm.title,Sounds.bgm1, 0.03);
    playEffectSound(Sounds.thanks,1);
  };

  stopBgm =async(state)=>{
    await state.unloadAsync()
    .then((res) => {
      res.sound.setOnPlaybackStatusUpdate((status) => {
         if (!status.didJustFinish) return;
         console.log('Unstop ' + state);
         res.sound.unloadAsync().catch(() => {});
      });
   }).catch((error) => {});
  };

  // BGM再生用（音量なども調整）
  soundStart =async(state,select,inputVol) =>{
    // bgm
      await state.loadAsync(select)
      .then((res) => {
        res.sound.setOnPlaybackStatusUpdate((status) => {
           if (!status.didJustFinish) return;
           console.log('Unloading ' + state);
           res.sound.unloadAsync().catch(() => {});
        });
     }).catch((error) => {});
      await state.setVolumeAsync(inputVol)
      .then((res) => {
        res.sound.setOnPlaybackStatusUpdate((status) => {
           if (!status.didJustFinish) return;
           console.log('UnVol ' + state);
           res.sound.unloadAsync().catch(() => {});
        });
     }).catch((error) => {});//音量
      await state.playAsync()
      .then((res) => {
        res.sound.setOnPlaybackStatusUpdate((status) => {
           if (!status.didJustFinish) return;
           console.log('UnPlay ' + state);
           res.sound.unloadAsync().catch(() => {});
        });
     }).catch((error) => {});//スタート
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
    // destinationごとに音声を変えておく
      switch(destination){
        // case "フリー対戦":
        //   selector = Sounds.yaruo;
        //   break;
        // case "カトフェス":
        //   selector = Sounds.yaruo;
        //   break;
        // case "切り抜きチャンピオンシップ":
        //   playEffectSound(Sounds.katou7,0.5)
        //   .then(()=>{
        //     // 
        //   });
        //   this.stopBgm(this.state.bgm.title);
        //   return this.props.navigation.navigate(destination);    
        // case "カトモン生成":
        //   playEffectSound(Sounds.katou8,1)
        //   .then(()=>{
        //     // 
        //   });
        //   this.stopBgm(this.state.bgm.title);
        //   return this.props.navigation.navigate(destination);
        case "ホーム":
          
          playEffectSound(Sounds.generate1,0.05);
          return this.props.navigation.navigate(destination);
          break;
      }
    } 
    catch (error) {
      console.log('error...');
    }
  };
  next =async(select)=>{
    switch(select){
      case 4:
        return this.goto('ホーム');
  }
    this.setState(state =>  ({
      opacity:new Animated.Value(0),
      flagCount:this.state.flagCount+1,
    }));
    switch(select){
        case 5:
          return setTimeout(()=>{ this.goto('ホーム')},1000);
    }
    this.animate();
  };

  render(){
    console.log(this.state.opacity);

    this.animate();
    
    return(
      <View style = {styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.backgroundTitle} />
        <TouchableOpacity
          onPress={() =>
            this.next(this.state.flagCount)
          }
          style = {{
            backgroundColor:"#dcdcdc",
            height:Constants.TITLE_HEIGHT/2,
            width:Constants.MAX_WIDTH/1.5,
          }}
        >

          <Animated.View style={{ opacity: this.state.opacity,justifyContent:"center",flexDirection:"column"}}>
            {/* タッチするたびに画面が切り替わるように変更する */}
            {this.state.flagCount==1 &&(
              <View style={{justifyContent:"center",flexDirection:"column",alignItems:"center",marginTop:"20%"}}>
                <Text style={{
                    fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                    height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                    marginTop:"5%",
                    textAlign:"center",
                  }}>
                    ~企画・ゲームデザイン~
                  </Text>
                  <Text style={{
                    fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                    height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                    textAlign:"center"
                  }}>
                    こーしー
                  </Text>
                  <Text style={{
                    fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                    height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                    marginTop:"5%",
                    textAlign:"center"
                  }}>
                    ~ゲーム・アプリケーション制作~
                  </Text>
                  <Text style={{
                    fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                    height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                    textAlign:"center"
                  }}>
                    こーしー
                  </Text>
                  <Text style={{
                    fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                    height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                    marginTop:"5%",
                    textAlign:"center"
                  }}>
                  ~ドット絵協力~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  酒井 ユウ
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center"
                }}>
                  ~PV協力~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  美枸淵
                </Text>
              </View>
            )}
            {this.state.flagCount==2 &&(
              <View style={{}}>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center",
                  marginTop:"40%"
                }}>
                  ~BGM~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  魔王魂
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center"
                }}>
                  ~デバッグ協力~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  酒井 ユウ
                </Text>
              </View>
            )}
          </Animated.View>
          <Animated.View style={{ opacity: this.state.opacity}}>
            {this.state.flagCount==3 &&(
              <View>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center",
                  marginTop:"40%"
                }}>
                  ~加藤純一の声~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  jun channel
                </Text>
              </View>
            )}
            {this.state.flagCount==3 &&(
              <View>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center"
                }}>
                  ~原作~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  うんこちゃん
                </Text>
              </View>
            )}
          </Animated.View>
          <Animated.View style={{ opacity: this.state.opacity}}>
            
          </Animated.View>
          <Animated.View style={{ opacity: this.state.opacity}}>
            {this.state.flagCount==4&&(
              <View>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"5%",
                  textAlign:"center",
                  marginTop:"30%"
                }}>
                  ~スペシャルサンクス~
                </Text>
                <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  textAlign:"center"
                }}>
                  加藤 純一, 加藤 尚子
                </Text>
              </View>
            )}
            {this.state.flagCount==4 &&(
              <View>
              <Text style={{
                  fontSize:Math.round(Constants.TITLE_WIDTH/2/10),
                  height:Math.round(Constants.TITLE_WIDTH/2/10)+5,
                  marginTop:"20%",
                  textAlign:"center"
                }}>
                  ...thank you so much!!! 
                </Text>
              </View> 
            )}
          </Animated.View>
        </TouchableOpacity>
        <View style={{backgroundColor:"#eee"}}>
          <Text>↑枠内をタップして次へ...</Text>
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
