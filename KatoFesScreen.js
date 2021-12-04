import { StatusBar } from 'expo-status-bar';
import React,{ Component } from 'react';
import { 
  SafeAreaView,
  StyleSheet, 
  View,
  Dimensions,
  TouchableOpacity,
  AppRegistry,
  Image,
  ImageBackground,
  Text,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import Constants from './Constants';
import Images from './assets/Images';
import Sounds from './assets/Sounds';

import KatomonMoveList from './battle/KatomonMoveList';
import KatoFesP2MoveList from './battle/KatoFesP2MoveList';
import KatomonList from './battle/KatomonList';
import KatoFesP2Data from './battle/KatoFesP2Data';
// 
import { Audio } from 'expo-av';
import { AdMobInterstitial} from 'expo-ads-admob';

// 効果音の再生に使う
async function playEffectSound(sound,vol) {

  console.log('Playing ' + ":"+sound);
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
export default class FesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      width:Constants.MAX_WIDTH, 
      height: Constants.MAX_WIDTH * 200/400,
      position1X: 0,
      position1Y: Constants.MAX_WIDTH * 200/400/2+24+24+18,
      position2X: Constants.MAX_WIDTH - 90-20,
      position2Y: Constants.MAX_WIDTH * 200/400/2+24+24+18,
      now: Date.now(),
      startTime: Date.now(),
      timer:55,
      roundCount:1,
      running:false,
      winning:false,
      endFlag:false,

      opacity: new Animated.Value(0),
      animatedFlag:false,

      changeGuts:false,

      firstFlag:true,

      startFlag:false,
      count:2,

      // 戦闘のステータス関連
      p1Personality:1,//>１だと前進しやすい
      p2Personality:KatoFesP2Data.hiroyuki.personality,
      p1Name:this.props.route.params.katomonName,
      p2Name:KatoFesP2Data.hiroyuki.name,
      p1HP:this.props.route.params.katomonPower,
      p2HP:KatoFesP2Data.hiroyuki.status.HP,
      p1Guts:0,
      p2Guts:KatoFesP2Data.hiroyuki.status.Guts,
      p1ATK:this.props.route.params.katomonikioi,
      p2ATK:KatoFesP2Data.hiroyuki.status.ATK,
      p1DEF:this.props.route.params.katomonMamori,
      p2DEF:KatoFesP2Data.hiroyuki.status.DEF,

      p1HPmax:this.props.route.params.katomonPower,
      p2HPmax:KatoFesP2Data.hiroyuki.status.HP,

      p1PoissonFlag:false,
      p2PoissonFlag:false,

      // p2の技選択の強さ
      p2Level:1,

      // 技を読み込む＝＞後で、読み込んだカトモンの技をロードへ
      p1MOVE_1:this.props.route.params.katomonMove.move1,
      p1MOVE_2:this.props.route.params.katomonMove.move2,
      p1MOVE_3:this.props.route.params.katomonMove.move3,

      katomonImage:this.props.route.params.katomonImage,
      p2Katomon:Images.hiroyuki,

      // 初戦の相手は固定?
      p2MOVE_1:KatoFesP2MoveList.ai,
      p2MOVE_2:KatoFesP2MoveList.ronpa,
      p2MOVE_3:KatoFesP2MoveList.ronpa,

      // 音声の管理用
      soundPreload:{
        bgm:{
          battle1:new Audio.Sound,
          title:new Audio.Sound,
          breaking:new Audio.Sound,
          change:new Audio.Sound,
        }
      },
    };
  }

  animate() {
    // console.log("run");
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600*3,
      useNativeDriver:true,
    }).start();
  }

  // 広告
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
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  };

  
  componentDidMount = async() => {
    // 戦闘開始
    // this.intervalId = this.system();

    if(!this.state.running){
      this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.bgm2,0.03);
    }
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.stopBgm(this.state.soundPreload.bgm.battle1);
    this.stopBgm(this.state.soundPreload.bgm.change);
    this.stopBgm(this.state.soundPreload.bgm.breaking);
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

  // BGMの切り替え
  startBreakingBgm = (sound,vol) =>{
    setTimeout(() => {
      playEffectSound(sound,vol);
    }, 1000);
  };

  // p1移動処理
  moving1= async(direction,length) => {
    try{
      switch(direction){
        case "gau":
          this.setState(state =>  ({position1X : this.state.position1X + length}));
          // console.log("gau");
          break;
        case "back":
          this.setState(state =>  ({position1X : this.state.position1X - length}));
          // console.log("back");
          break;
        } 
        
    }
    catch(error){
      // 
      console.log("moveing1 error.");
    }
  };

  // p2移動処理
  moving2= async(direction,length) => {
    try{
      switch(direction){
        case "gau":
          this.setState(state =>  ({position2X : this.state.position2X - length}));
          // console.log("gau");
          break;
        case "back":
          this.setState(state =>  ({position2X : this.state.position2X + length}));
          // console.log("back");
          break;
      }
    }
    catch(error){
      // 
      console.log("moveing2 error.");
    }
  };

  // 技の追加効果の反映
  paramChange = (param,change) =>{
    switch(param){
      case "position1x":
        this.setState(state =>  ({position1X : this.state.position1X + change}));
        break;

      case "position2x":
        this.setState(state =>  ({position2X : this.state.position2X + change}));
        break;

      case "p1HP":
        this.setState(state =>  ({p1HP : this.state.p1HP + change}));
        break;

      case "p2HP":
        this.setState(state =>  ({p2HP : this.state.p2HP + change}));
        break;
      
      case "p1Poisson":
        this.setState(state =>  ({p1PoissonFlag : true}));
        break;

      case "p2Poisson":
        this.setState(state =>  ({p2PoissonFlag : true}));
        break;

      case "p1ATK":
          this.setState(state =>  ({p1ATK : this.state.p1ATK+ change}));
        break;
      case "p2ATK":
          this.setState(state =>  ({p2ATK : this.state.p2ATK+ change}));
        break;
      case "p1DEF":
          this.setState(state =>  ({p1DEF : this.state.p1DEF+ change}));
        break;
      case "p2DEF":
          this.setState(state =>  ({p2DEF : this.state.p2DEF+ change}));
        break;
    }
    // console.log("param:",param);
  };

  // p1技発動
  p1move = async(select) =>{
    switch(select){
      case "1":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p1Guts >= this.state.p1MOVE_1.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p1MOVE_1.range){
          // 相手のHP減少
          this.setState(state =>  ({p2HP : this.state.p2HP - this.state.p1MOVE_1.power * this.state.p1ATK/this.state.p2DEF }));
          // Guts消費
          this.setState(state =>  ({p1Guts : this.state.p1Guts - this.state.p1MOVE_1.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p1MOVE_1.additional1){
            this.paramChange(this.state.p1MOVE_1.additional1.param,this.state.p1MOVE_1.additional1.change);
          }
          if(this.state.p1MOVE_1.additional2){
            this.paramChange(this.state.p1MOVE_1.additional2.param,this.state.p1MOVE_1.additional2.change);
          }
          if(this.state.p1MOVE_1.additional3){
            this.paramChange(this.state.p1MOVE_1.additional3.param,this.state.p1MOVE_1.additional3.change);
          }
          // 移動の傾向変更
          this.setState(state =>  ({p1Personality : this.state.p1MOVE_1.personality}));
          // 音声
          return playEffectSound(this.state.p1MOVE_1.sound,1);
        }
        break;
      case "2":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p1Guts >= this.state.p1MOVE_2.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p1MOVE_2.range){
          // 相手のHP減少
          this.setState(state =>  ({p2HP : this.state.p2HP - this.state.p1MOVE_2.power * this.state.p1ATK/this.state.p2DEF }));
          // Guts消費
          this.setState(state =>  ({p1Guts : this.state.p1Guts - this.state.p1MOVE_2.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p1MOVE_2.additional1){
            this.paramChange(this.state.p1MOVE_2.additional1.param,this.state.p1MOVE_2.additional1.change);
          }
          if(this.state.p1MOVE_2.additional2){
            this.paramChange(this.state.p1MOVE_2.additional2.param,this.state.p1MOVE_2.additional2.change);
          }
          if(this.state.p1MOVE_2.additional3){
            this.paramChange(this.state.p1MOVE_2.additional3.param,this.state.p1MOVE_2.additional3.change);
          }
          // 移動の傾向変更
          this.setState(state =>  ({p1Personality : this.state.p1MOVE_2.personality}));
          // 音声
          return playEffectSound(this.state.p1MOVE_2.sound,1);
        }
        break;
      case "3":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p1Guts >= this.state.p1MOVE_3.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p1MOVE_3.range){
          // 相手のHP減少
          this.setState(state =>  ({p2HP : this.state.p2HP - this.state.p1MOVE_3.power  * this.state.p1ATK/this.state.p2DEF }));
          // Guts消費
          this.setState(state =>  ({p1Guts : this.state.p1Guts - this.state.p1MOVE_3.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p1MOVE_3.additional1){
            this.paramChange(this.state.p1MOVE_3.additional1.param,this.state.p1MOVE_3.additional1.change);
          }
          if(this.state.p1MOVE_3.additional2){
            this.paramChange(this.state.p1MOVE_3.additional2.param,this.state.p1MOVE_3.additional2.change);
          }
          if(this.state.p1MOVE_3.additional3){
            this.paramChange(this.state.p1MOVE_3.additional3.param,this.state.p1MOVE_3.additional3.change);
          }
          // 移動の傾向変更
          this.setState(state =>  ({p1Personality : this.state.p1MOVE_3.personality}));
          // 音声
          return playEffectSound(this.state.p1MOVE_3.sound,1);
        }
        break;
    }
  };

  // p2技発動
  p2move = async(select) =>{
    // console.log("p2HP:",this.state.p2HP);
    switch(select){
      case "1":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p2Guts >= this.state.p2MOVE_1.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p2MOVE_1.range){
          // 相手のHP減少
          this.setState(state =>  ({p1HP : this.state.p1HP - this.state.p2MOVE_1.power  * this.state.p2ATK/this.state.p1DEF }));
          // Guts消費
          this.setState(state =>  ({p2Guts : this.state.p2Guts - this.state.p2MOVE_1.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p2MOVE_1.additional1){
            this.paramChange(this.state.p2MOVE_1.additional1.param,this.state.p2MOVE_1.additional1.change);
          }
          if(this.state.p2MOVE_1.additional2){
            this.paramChange(this.state.p2MOVE_1.additional2.param,this.state.p2MOVE_1.additional2.change); 
          }
          if(this.state.p2MOVE_1.additional3){
            this.paramChange(this.state.p2MOVE_1.additional3.param,this.state.p2MOVE_1.additional3.change); 
          }
          // 移動の傾向変更
          this.setState(state =>  ({p2Personality : this.state.p2MOVE_1.personality}));
          // 音声
          return playEffectSound(this.state.p2MOVE_1.sound,1);
        }
        break;
      case "2":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p2Guts >= this.state.p2MOVE_2.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p2MOVE_2.range){
          // 相手のHP減少
          this.setState(state =>  ({p1HP : this.state.p1HP - this.state.p2MOVE_2.power * this.state.p2ATK/this.state.p1DEF}));
          // Guts消費
          this.setState(state =>  ({p2Guts : this.state.p2Guts - this.state.p2MOVE_2.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p2MOVE_2.additional1){
            this.paramChange(this.state.p2MOVE_2.additional1.param,this.state.p2MOVE_2.additional1.change);
          }
          if(this.state.p2MOVE_2.additional2){
            this.paramChange(this.state.p2MOVE_2.additional2.param,this.state.p2MOVE_2.additional2.change);
          }
          if(this.state.p2MOVE_2.additional3){
            this.paramChange(this.state.p2MOVE_2.additional3.param,this.state.p2MOVE_2.additional3.change);
          }
          // 移動の傾向変更
          this.setState(state =>  ({p2Personality : this.state.p2MOVE_2.personality}));
          // 音声
          return playEffectSound(this.state.p2MOVE_2.sound,1);
        }
        break;
      case "3":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p2Guts >= this.state.p2MOVE_3.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p2MOVE_3.range){
          // 相手のHP減少
          this.setState(state =>  ({p1HP : this.state.p1HP - this.state.p2MOVE_3.power * this.state.p2ATK/this.state.p1DEF}));
          // Guts消費
          this.setState(state =>  ({p2Guts : this.state.p2Guts - this.state.p2MOVE_3.consumption_Guts}));
          // 追加効果(3つまで判定？)
          if(this.state.p2MOVE_3.additional1){
            this.paramChange(this.state.p2MOVE_3.additional1.param,this.state.p2MOVE_3.additional1.change);
          }
          if(this.state.p2MOVE_3.additional2){
            this.paramChange(this.state.p2MOVE_3.additional2.param,this.state.p2MOVE_3.additional2.change);
          }
          if(this.state.p2MOVE_3.additional3){
            this.paramChange(this.state.p2MOVE_3.additional3.param,this.state.p2MOVE_3.additional3.change);
          }
          // 移動の傾向変更
          this.setState(state =>  ({p2Personality : this.state.p2MOVE_3.personality}));
          // 音声
          return playEffectSound(this.state.p2MOVE_3.sound,1);
        }
        break;
    }
    // console.log("p2HP:",this.state.p2HP);
  };

  // 応援ボタン
  addGuts = async() =>{
    this.setState(state =>  ({p1Guts : this.state.p1Guts + 3}));
  };

  changeGuts =async()=>{
    if(this.state.changeGuts){
      this.setState(state =>  ({changeGuts : false}));
    }
    else{
      this.setState(state =>  ({changeGuts : true}));
    }
  };

  //cpuの技選択ロジック
  autoSelectMove = (player) =>{
    var selectRand = Math.random();
    switch(player){
      case "p1":
        // 技選択
        if(selectRand < 0.5){
          return this.p1move("1");
        }
        else{
          if(selectRand < 0.6){
            return this.p1move("2");
          }
          else{
            if(selectRand < 0.65){
              return this.p1move("3");
            }
          }
        }
        break;
      case "p2":
        // 技選択
        if(selectRand < 0.15){
          return this.p2move("1");
        }
        else{
          if(selectRand < 0.3){
            return this.p2move("2");
          }
          else{
            if(selectRand < 0.45){
              return this.p2move("3");
            }
          }
        }
        break;
    }
  }

  // 戦闘システム全体
  system = () =>{
    // 繰り返し処理設定
    this.intervalId = setInterval(()=>{
      this.setState({
        now: Date.now(),
        timer: 55 + this.state.startTime / 1000 - this.state.now / 1000 
      });

      var p1Rand = Math.random();
      var p2Rand = Math.random();

      // this.state.p1Guts = this.state.p1Guts + 2;
      // this.state.p2Guts = this.state.p2Guts + 5;

      this.setState(state =>  ({
        p1Guts:this.state.p1Guts + 2,
        p2Guts:this.state.p2Guts + 5,
      })); 

      if(this.state.p1PoissonFlag){
        this.setState(state =>  ({
          p1HP:this.state.p1HP - 2,
        })); 
      }
      // console.log("p1",this.state.p1PoissonFlag);

      if(this.state.p2PoissonFlag){
        this.setState(state =>  ({
          p2HP:this.state.p2HP - 5,
        })); 
      }
      // console.log("p2",this.state.p2PoissonFlag);

      // player1の移動ロジック
      if(p1Rand  * this.state.p1Personality > 0.5){
        // 前進
        if(this.state.position1X + 50 < this.state.position2X){
          // 追い越さないように、近づくと前進しない
          this.moving1("gau",15);
        }
      }
      else{
        // 後退
        if(this.state.position1X > 50){
          this.moving1("back",10);
        }
      }

      // player2の移動ロジック
      if(p2Rand  * this.state.p2Personality > 0.5){
        // 前進
        if(this.state.position1X + 50 < this.state.position2X){
          // 追い越さないように、近づくと前進しない
          this.moving2("gau",15);
        }
      }
      else{
        // 後退
        if(this.state.position2X < Constants.MAX_WIDTH - 50){
          this.moving2("back",10);
        }
      }

      // オートでの技選択
      this.autoSelectMove("p2");
      if(!this.state.changeGuts){
        this.autoSelectMove("p1");
      }

      if(this.state.p1HP<0){
        this.setState(state =>  ({
          p1HP:0,
        })); 
      }
      if(this.state.p2HP<0){
        this.setState(state =>  ({
          p2HP:0,
        })); 
      }

    }, 500);

    return this.intervalId;
  }

  // 再戦
  start = async(count) =>{
    // 連打で間違って入っても二重にsystemを起動しないため
    if(this.state.runnning){
      console.log("running");
      return;
    }
    // 二重スタート防止
    if(this.state.startFlag){
      return
    }
    this.setState(state =>  ({
      startFlag:true,
    })); 

    // 戦闘の余韻を残すための遅延
    setTimeout(()=>{

      if(this.state.firstFlag){
        this.setState(state =>  ({
          firstFlag:false,
        }));
      }
  
          playEffectSound(Sounds.yaruo,1);
  
        this.stopBgm(this.state.soundPreload.bgm.breaking);
        this.state.roundCount = count;
        // this.state.soundPreload.bgm.breaking = new Audio.Sound;
        // this.state.soundPreload.bgm.battle1 = new Audio.Sound;
        // ラウンド判定
        switch(this.state.roundCount){
          case 1:
            console.log("1");
            this.setState(state =>  ({
              p2MOVE_1:KatoFesP2Data.hiroyuki.move.move1,
              p2MOVE_2:KatoFesP2Data.hiroyuki.move.move2,
              p2MOVE_3:KatoFesP2Data.hiroyuki.move.move3,
              p2Katomon:KatoFesP2Data.hiroyuki.image,
    
              p2Personality:KatoFesP2Data.hiroyuki.personality,
              p2Name:KatoFesP2Data.hiroyuki.name,
              p2HP:KatoFesP2Data.hiroyuki.status.HP,
              p2Guts:KatoFesP2Data.hiroyuki.status.Guts,
              p2ATK:KatoFesP2Data.hiroyuki.status.ATK,
              p2DEF:KatoFesP2Data.hiroyuki.status.DEF,
    
              p2HPmax:KatoFesP2Data.hiroyuki.status.HP,
            })); 
            this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle2,0.03);
            break;
    
            case 2:
              console.log("2");
              this.setState(state =>  ({
                p2MOVE_1:KatoFesP2Data.gear.move.move1,
                p2MOVE_2:KatoFesP2Data.gear.move.move2,
                p2MOVE_3:KatoFesP2Data.gear.move.move3,
                p2Katomon:KatoFesP2Data.gear.image,
      
                p2Personality:KatoFesP2Data.gear.personality,
                p2Name:KatoFesP2Data.gear.name,
                p2HP:KatoFesP2Data.gear.status.HP,
                p2Guts:KatoFesP2Data.gear.status.Guts,
                p2ATK:KatoFesP2Data.gear.status.ATK,
                p2DEF:KatoFesP2Data.gear.status.DEF,
      
                p2HPmax:KatoFesP2Data.gear.status.HP,
              }));     
              this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle5,0.03);
              break;
    
              case 3:
                console.log("3");
                this.setState(state =>  ({
                  p2MOVE_1:KatoFesP2Data.nise.move.move1,
                  p2MOVE_2:KatoFesP2Data.nise.move.move2,
                  p2MOVE_3:KatoFesP2Data.nise.move.move3,
                  p2Katomon:KatoFesP2Data.nise.image,
        
                  p2Personality:KatoFesP2Data.nise.personality,
                  p2Name:KatoFesP2Data.nise.name,
                  p2HP:KatoFesP2Data.nise.status.HP,
                  p2Guts:KatoFesP2Data.nise.status.Guts,
                  p2ATK:KatoFesP2Data.nise.status.ATK,
                  p2DEF:KatoFesP2Data.nise.status.DEF,
        
                  p2HPmax:KatoFesP2Data.nise.status.HP,
                }));     
                this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle3,0.03);
                break;
    
                case 4:
                  console.log("4");
                  this.setState(state =>  ({
                    p2MOVE_1:KatoFesP2Data.naranton.move.move1,
                    p2MOVE_2:KatoFesP2Data.naranton.move.move2,
                    p2MOVE_3:KatoFesP2Data.naranton.move.move3,
                    p2Katomon:KatoFesP2Data.naranton.image,
          
                    p2Personality:KatoFesP2Data.naranton.personality,
                    p2Name:KatoFesP2Data.naranton.name,
                    p2HP:KatoFesP2Data.naranton.status.HP,
                    p2Guts:KatoFesP2Data.naranton.status.Guts,
                    p2ATK:KatoFesP2Data.naranton.status.ATK,
                    p2DEF:KatoFesP2Data.naranton.status.DEF,
          
                    p2HPmax:KatoFesP2Data.naranton.status.HP,
                  }));     
                  this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle1,0.03);
                  break;
    
                case 5:
                  console.log("5");
                  this.setState(state =>  ({
                    p2MOVE_1:KatoFesP2Data.golden_naoko.move.move1,
                    p2MOVE_2:KatoFesP2Data.golden_naoko.move.move2,
                    p2MOVE_3:KatoFesP2Data.golden_naoko.move.move3,
                    p2Katomon:KatoFesP2Data.golden_naoko.image,
    
                    p2Personality:KatoFesP2Data.golden_naoko.personality,
                    p2Name:KatoFesP2Data.golden_naoko.name,
                    p2HP:KatoFesP2Data.golden_naoko.status.HP,
                    p2Guts:KatoFesP2Data.golden_naoko.status.Guts,
                    p2ATK:KatoFesP2Data.golden_naoko.status.ATK,
                    p2DEF:KatoFesP2Data.golden_naoko.status.DEF,
    
                    p2HPmax:KatoFesP2Data.golden_naoko.status.HP,
                  }));     
                  this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle4,0.03);
                  break;
    
                  case 6:
                    return 0;
    
        }
    
        //ゲーム再スタートのための初期化
        this.setState(state =>  ({
          running:true,
          winning:false,
          now: Date.now(),
          startTime: Date.now(),
    
          position1X: 50,
          position2X: Constants.MAX_WIDTH - 150,
  
          p2PoissonFlag:false,
          p1PoissonFlag:false,
  
          opacity: new Animated.Value(0),
          animatedFlag:false,

          startFlag:false,
  
          changeGuts:false,
    
          timer:55,
    
          // 戦闘のステータス関連
          p1Personality:1,
          p1HP:this.props.route.params.katomonPower,
          p1Guts:0,
          p1ATK:this.props.route.params.katomonikioi,
          p1DEF:this.props.route.params.katomonMamori,
        }));     
  
        // console.log(this.state.p1Name.length);
        // console.log(this.state.p2Name.length);
        
        this.intervalId = this.system();
    
        return this.intervalId;
    },1000*this.state.count);

  }

  goto = async(destination) => {
    try {
    // destinationごとに音声を変えておく
      switch(destination){
        case "クレジット":
          await this.stopBgm(this.state.soundPreload.bgm.breaking);
          setTimeout(()=>playEffectSound(Sounds.arigatone,1),1000);
          break;
      }
      this.setState({
        // roundCount:1,
        // running:true,
        // winning:false,
        // endFlag:false,
      });
      setTimeout(()=>this.props.navigation.navigate(destination),2000);
    } 
    catch (error) {
      console.log('error...');
    }
  }
  
  render(){
    if(this.state.firstFlag){
      this.animate();
    }

    if(this.state.running){

      // 対戦の終了判定
      if(Math.round(
      this.state.timer) <= 0){
        // this.state.running = false;
        clearInterval(this.intervalId);
        this.stopBgm(this.state.soundPreload.bgm.battle1);
        if(this.state.p1HP/this.state.p1HPmax <= this.state.p2HP/this.state.p2HPmax){
          this.state.running = false;

          // 負け広告
          var random = Math.random();
          if(random < 0.2){
            this.Interstitial()
          }
          this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.gameOver,0.03);
        }
        else{
          var random_win = Math.random();
          if(random_win < 0.33){
            this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.next1,0.6);
          }else{
            if(random_win < 0.66){
              this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.kenia,0.5);
            }else{
              this.startBreakingBgm(Sounds.say,3);
            }
          }
          if(this.state.roundCount>=5){
            this.state.endFlag = true;
            this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.battle4,0.03);
          }
          else{
            this.state.winning = true;
            this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.next1,0.5);
          }
        }
        this.animate();
        // this.state.timer = 55;
      }else{
        // this.state.running = false;
        if(this.state.p1HP <= 0){
            clearInterval(this.intervalId);
            this.stopBgm(this.state.soundPreload.bgm.battle1);
            if(this.state.p1HP <= this.state.p2HP){
              this.state.running = false;
              // 負け広告
              var random = Math.random();
              if(random < 0.2){
                this.Interstitial()
              }
              this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.gameOver,0.03);
              this.state.running = false
              this.animate();
            }
            // this.state.timer = 55;
          }
        if(this.state.p2HP <= 0){
          clearInterval(this.intervalId);
          this.stopBgm(this.state.soundPreload.bgm.battle1);
          var random_win = Math.random();
          if(random_win < 0.33){
            this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.next1,0.5);
            this.animate();
          }else{
            if(random_win < 0.66){
              this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.kenia,0.5);
              this.animate();
            }else{
              this.startBreakingBgm(Sounds.say,3);
              this.animate();
            }
          }
            if(this.state.roundCount>=5){
              // this.state.running = false;
              this.state.endFlag = true;
              this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.battle4,0.03);
              this.animate();
            }
            else{
              // this.state.running = false;
              this.state.winning = true;
              this.soundStart(this.state.soundPreload.bgm.breaking,Sounds.next1,0.5);
              this.animate();
            }
        } 
      }
     }

    return(
      <SafeAreaView style = {styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
        <View style={{
          position:'absolute',
          top:"1%",width:Constants.MAX_WIDTH}}>
            {this.state.roundCount<=5 &&(
              <Text style = {{
                textAlign:'center',
                fontSize: 18,
                fontWeight: 'bold',
                // fontFamily: 'DotGothic16_400Regular',
                backgroundColor:"#fff",
                marginLeft:"30%",
                marginRight:"30%",
                height:24,
                }}>
                  現在{this.state.roundCount}戦目
              </Text>
            )}
            {this.state.roundCount>5 &&(
              <Text style = {{
                textAlign:'center',
                fontSize: 18,
                fontWeight: 'bold',
                // fontFamily: 'DotGothic16_400Regular',
                backgroundColor:"#fff",
                marginLeft:"30%",
                marginRight:"30%",
                height:24,
                }}>
                  最終戦
              </Text>
            )}
          <View style = {styles.name}>
            <Text style = {{
              fontSize: Math.round(Constants.MAX_WIDTH/3/10),
              fontWeight: 'bold',
              // fontFamily: 'DotGothic16_400Regular',
              textAlign:'center',
              height:Math.round(Constants.MAX_WIDTH/3/10 +5),
              flex:1,
            }}>
              {this.state.p1Name}
            </Text>
            <Text style = {{
            textAlign:'center',
            fontSize:  Math.round(Constants.MAX_WIDTH/3/5),
            fontWeight: 'bold',
            // fontFamily: 'DotGothic16_400Regular',
            backgroundColor:"#fff",
            height:Math.round(Constants.MAX_WIDTH/3/5 +5),
            flex:0.3,
            }}>
              {Math.round(this.state.timer)}
            </Text>
            <Text style = {{
              fontSize:Math.round(Constants.MAX_WIDTH/3/10),
              fontWeight: 'bold',
              // fontFamily: 'DotGothic16_400Regular',
              textAlign:'center',
              height:Math.round(Constants.MAX_WIDTH/3/10 +5),
              flex:1,
            }}>
              {this.state.p2Name}
            </Text>
          </View>
          <View style = {styles.names}>
            <Text style = {{fontSize: Math.round(Constants.MAX_WIDTH/3/10),
              textAlign:'center',
              height:Math.round(Constants.MAX_WIDTH/3/10)+5,
              flex:0.5,}}
            >
              ガッツ：{this.state.p1Guts}
            </Text>
            <Text style = {{fontSize: Math.round(Constants.MAX_WIDTH/3/10),
              textAlign:'center',
              height:Math.round(Constants.MAX_WIDTH/3/10)+5,
              flex:0.5,}}
            >
              ガッツ：{this.state.p2Guts}
            </Text>
          </View>
          <Image
            style={{ 
              width:this.state.width,
              height:this.state.height,
              marginTop:"1%",
              backgroundColor: '#eee' ,
              resizeMode:"cover"
          }}
            source={Images.battleField}
          />

          {/* HPバー */}
          <View style = {{
                flexDirection: 'row',
                position: 'absolute',
                top:Constants.MAX_WIDTH * 250/400/10 +90,
                width:Math.round(Constants.MAX_WIDTH/2*this.state.p1HP/this.state.p1HPmax),
                height:10,
                textAlign:'center',
                justifyContent:"center",
                backgroundColor: "red",
                left:0,
              }}>
          </View>
          <View style = {{
                flexDirection: 'row',
                position: 'absolute',
                top:Constants.MAX_WIDTH * 250/400/10 +90, 
                width:Math.round(Constants.MAX_WIDTH/2*this.state.p2HP/this.state.p2HPmax),
                height:10,
                textAlign:'center',
                justifyContent:"center",
                backgroundColor: "blue",
                right:0,
              }}>
          </View>
          <Text style={{ height: Math.round(Constants.MAX_WIDTH/25)+5 ,top:Constants.MAX_WIDTH * 250/400/10 +80+30, left: this.state.width/6, position:'absolute',fontSize:Math.round(Constants.MAX_WIDTH/25),backgroundColor:"#eee",textAlign:"center"}}>HP:{Math.round(this.state.p1HP)} ({Math.round(this.state.p1HP/this.state.p1HPmax * 100)}%)</Text>  
          <Text style={{ height: Math.round(Constants.MAX_WIDTH/25)+5 ,top:Constants.MAX_WIDTH * 250/400/10 +80+30, right: this.state.width/6, position:'absolute',fontSize:Math.round(Constants.MAX_WIDTH/25),backgroundColor:"#eee",textAlign:"center"}}>HP:{Math.round(this.state.p2HP)} ({Math.round(this.state.p2HP/this.state.p2HPmax * 100)}%)</Text>  
          {/* Player1 */}
           <Image
              source={this.state.katomonImage}
              style={{ width: this.state.height/2.5, height: this.state.height/2.5 ,top:this.state.position1Y, left: this.state.position1X, position:'absolute',
              backgroundColor:"#cd853f",
              borderRadius:10,}}
            /> 
            {/* <Text style={{ width:Math.round(this.state.p1HP/this.state.p1HPmax * 100),height: 15,top:this.state.position1Y-20, left: this.state.position1X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p1HP)}</Text>  
            <Text style={{ width:100,height: 15,top:this.state.position1Y-40, left: this.state.position1X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p1HP/this.state.p1HPmax * 100)}%</Text>   */}
          {/* Player2 */}
          <Image
              source={this.state.p2Katomon}
              style={{width: this.state.height/2.5, height: this.state.height/2.5 ,top:this.state.position2Y, left: this.state.position2X, position:'absolute',
              backgroundColor:"#ffd700",
              borderRadius:10,}}
            />
            {/* <Text style={{ width:Math.round(this.state.p2HP/this.state.p2HPmax * 100), height: 15 ,top:this.state.position2Y-20, left: this.state.position2X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p2HP)}</Text>  
            <Text style={{ width:100, height: 15 ,top:this.state.position2Y-40, left: this.state.position2X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p2HP/this.state.p2HPmax * 100)}%</Text>   */}

          {/* 画面下半分 */}
          {this.state.running &&(

            <ScrollView style={{height:Constants.MAX_HEIGHT - Constants.MAX_WIDTH * 250/400 - 24 -18 -130,
            // backgroundColor:"red"
            }}>
              {/* 技ボタン */}
              <View style={{marginBottom:"0%"}}>
                <View style={styles.names}>
                  <TouchableOpacity 
                    style={styles.moveButtons}
                    onPress={() => this.p1move("1")}
                  >
                    <Text style={styles.move}>1.{this.state.p1MOVE_1.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p1MOVE_1.consumption_Guts}</Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p1MOVE_1.range} 威力：{this.state.p1MOVE_1.power}</Text>
                  </TouchableOpacity>
                  <View style={styles.moveButtons}>
                    <Text style={styles.move_ene}>1.{this.state.p2MOVE_1.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p2MOVE_1.consumption_Guts}</Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p2MOVE_1.range} 威力：{this.state.p2MOVE_1.power}</Text>
                  </View>
                </View>
                <View style={styles.names}>
                  <TouchableOpacity 
                    style={styles.moveButtons}
                    onPress={() => this.p1move("2")}
                  >
                    <Text style={styles.move}>2.{this.state.p1MOVE_2.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p1MOVE_2.consumption_Guts} </Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p1MOVE_2.range} 威力：{this.state.p1MOVE_2.power}</Text>
                  </TouchableOpacity>
                  <View style={styles.moveButtons}>
                    <Text style={styles.move_ene}>2.{this.state.p2MOVE_2.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p2MOVE_2.consumption_Guts}</Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p2MOVE_2.range} 威力：{this.state.p2MOVE_2.power}</Text>
                  </View>
                </View>
                <View style={styles.names}>
                  <TouchableOpacity 
                    style={styles.moveButtons}
                    onPress={() => this.p1move("3")}
                  >
                    <Text style={styles.move}>3.{this.state.p1MOVE_3.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p1MOVE_3.consumption_Guts}</Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p1MOVE_3.range} 威力：{this.state.p1MOVE_3.power}</Text>
                  </TouchableOpacity>
                  <View style={styles.moveButtons}>
                    <Text style={styles.move_ene}>3.{this.state.p2MOVE_3.name}</Text>
                    <Text style={styles.moveSub}> 必要ガッツ：{this.state.p2MOVE_3.consumption_Guts}</Text>
                    <Text style={styles.moveSub}> 射程：{this.state.p2MOVE_3.range} 威力：{this.state.p2MOVE_3.power}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
        {/* ボタン */}
        {this.state.running && (
          <View style={{flexDirection:"row",position: 'absolute',bottom:0}}>
            {!this.state.changeGuts &&(
              <View style = {{
                      position: 'absolute',
                      paddingLeft:"3%",
                      paddingRight:"3%",
                      alignItems:"center",
                      bottom:0,
                      height:Constants.MAX_HEIGHT/10,
                      opacity:0.5,
                      left:0,
                      width:Constants.MAX_WIDTH/2
      
                  }}>
                  <TouchableOpacity 
                    style ={{
                      position: 'relative',
                      marginTop: "3%",
                      marginBottom: "3%",
                      marginRight: "5%",
                      marginRight:"5%",
                      paddingLeft:"5%",
                      paddingRight:"5%",
                      paddingTop:"5%",
                      paddingBottom:"5%",
                      borderRadius:50,
                      backgroundColor: "#ff4500",
                    }}
                    onPress={this.changeGuts}
                  >
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      color:"#eee",
                      textAlign:'center',
                    }}>
                      ガッツ温存！
                    </Text>
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      color:"#eee",
                      textAlign:'center',
                    }}>
                      に変更
                    </Text>
                  </TouchableOpacity>
              </View>
            )}
            {this.state.changeGuts &&(
              <View style = {{
                      position: 'absolute',
                      paddingLeft:"3%",
                      paddingRight:"3%",
                      alignItems:"center",
                      bottom:0,
                      height:Constants.MAX_HEIGHT/10,
                      opacity:0.5,
                      left:0,
                      width:Constants.MAX_WIDTH/2
      
                  }}>
                  <TouchableOpacity 
                    style ={{
                      position: 'relative',
                      marginTop: "3%",
                      marginBottom: "3%",
                      marginRight: "5%",
                      marginRight:"5%",
                      paddingLeft:"5%",
                      paddingRight:"5%",
                      paddingTop:"5%",
                      paddingBottom:"5%",
                      borderRadius:50,
                      backgroundColor: "#7cfc00",
                    }}
                    onPress={this.changeGuts}
                  >
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      // fontFamily: 'DotGothic16_400Regular',
                      textAlign:'center',
                    }}>
                      ガッツ使え！
                    </Text>
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      // fontFamily: 'DotGothic16_400Regular',
                      textAlign:'center',
                    }}>
                      に変更
                    </Text>
                  </TouchableOpacity>
              </View>
            )}
            <View style = {{
                  position: 'absolute',
                  paddingLeft:"3%",
                  paddingRight:"3%",
                  alignItems:"center",
                  bottom:0,
                  height:Constants.MAX_HEIGHT/10,
                  opacity:0.5,
                  right:0,
                  width:Constants.MAX_WIDTH/2
  
              }}>
                  <TouchableOpacity 
                    style ={styles.button}
                    onPress={this.addGuts}
                  >
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      // fontFamily: 'DotGothic16_400Regular',
                      textAlign:'center',
                    }}>
                      応援
                    </Text>
                    <Text style={{
                      fontSize: Math.round(Constants.MAX_WIDTH/15),
                      height:Math.round(Constants.MAX_WIDTH/15+5),
                      fontWeight: 'bold',
                      // fontFamily: 'DotGothic16_400Regular',
                      textAlign:'center',
                    }}>
                      (ガッツ増加)
                    </Text>
                  </TouchableOpacity>
            </View>
          </View>
        )}
      
        {/* ポップアップ */}
        {!this.state.running && !this.state.winning && !this.state.firstFlag && (
          <Animated.View style={{ opacity: this.state.opacity,position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          flex: 1,}}>
            <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.start(this.state.roundCount)}>
              <View style={styles.fullScreen}>
                <Text style={styles.gameOverText}>敗戦...</Text>
                <Text style={styles.gameOverSubText}>立ち上がる☜</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        {this.state.winning && this.state.roundCount <=3 && (
          <Animated.View style={{ opacity: this.state.opacity,position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          flex: 1,}}>
            <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.start(this.state.roundCount+1)}>
              <View style={styles.fullScreen}>
                <Text style={styles.gameOverText}>大勝利!!</Text>
                <Text style={styles.gameOverText}>{this.state.roundCount+1}戦目へ ☜</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        {this.state.winning && this.state.roundCount >=4 && (
          <Animated.View style={{ opacity: this.state.opacity,position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          flex: 1,}}>
            <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.start(this.state.roundCount+1)}>
              <View style={styles.fullScreen}>
                <Text style={styles.gameOverText}>最終決戦へ...!!</Text>
                <Text style={styles.gameOverSubText}>準備はいいですか...？</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        {this.state.endFlag && (
          <Animated.View style={{ opacity: this.state.opacity,position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          flex: 1,}}>
            <View style={styles.fullScreenButton} >
              <View style={styles.fullScreen}>
                <Text style={styles.gameOverText}>おめでとうございます!!</Text>
                <Text style={styles.gameOverSubText}>遊んでいただきありがとうございました！！</Text>
                <Text style={styles.gameOverSubText}>----------------------------------------</Text>
                <TouchableOpacity 
                  style={{height:Math.round(Constants.MAX_WIDTH/20)+5,}}
                  onPress={() =>this.goto("クレジット")}
                >
                  <Text style={styles.gameOverText}> クレジットへ ☜</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        {this.state.firstFlag && !this.state.running && (
          <Animated.View style={{ opacity: this.state.opacity,position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          flex: 1,}}>
      
          <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.start(1)}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>戦闘開始！</Text>
              <Text style={styles.gameOverSubText}>----------------------------------------</Text>
              <Text style={styles.gameOverSubText}>【Tips】</Text>
              <Text style={styles.gameOverSubText}>応援すると、ガッツが多く貯まります</Text>
              <Text style={styles.gameOverSubText}>自動で技は使われますが、自分で選択することも可能です</Text>
              <Text style={styles.gameOverSubText}>技には、隠されたパラメータ変化効果などもあります</Text>
              <Text style={styles.gameOverSubText}>----------------------------------------</Text>
              <Text style={styles.gameOverText}>  START ☜</Text>
            </View>
          </TouchableOpacity>
              </Animated.View>
        )}
      </SafeAreaView>
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
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
  },
  gameOverText: {
    color: 'white',
    fontSize: Math.round(Constants.MAX_WIDTH/8),
    marginBottom:"10%",
    // fontFamily: '04b_19',
  },
  gameOverSubText: {
    color: 'white',
    fontSize: Math.round(Constants.MAX_WIDTH/20),
    margin:"3%",
  },
  gameArea:{
    height: Constants.TITLE_HEIGHT,
    width:Constants.MAX_WIDTH,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    position: 'relative',
    marginTop: "3%",
    marginBottom: "3%",
    marginRight: "5%",
    marginRight:"5%",
    paddingLeft:"5%",
    paddingRight:"5%",
    paddingTop:"5%",
    paddingBottom:"5%",
    borderRadius:50,
    backgroundColor: "#ffdead",
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  buttons:{
    // flexDirection: 'row',
    position: 'relative',
    // marginRight:"30%",
    // marginLeft:"30%",
    paddingLeft:"3%",
    paddingRight:"3%",
    alignItems:"center",
    marginBottom:"3%",
    // backgroundColor: "red",
  },
  backgroundImage: {
    // width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
    resizeMode: "cover",
    position: 'absolute',
  },
  names:{
    flexDirection: 'row',
    position: 'relative',
    marginLeft:"5%",
    marginRight:"5%",
    // marginTop:"5%",
    textAlign:'center',
    // backgroundColor: "red",
  },
  name:{
    flexDirection: 'row',
    position: 'relative',
    marginLeft:"5%",
    marginRight:"5%",
    marginTop:"1%",
    textAlign:'center',
    height:36,
    // backgroundColor: "red",
  },
  name_r:{
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    height:30,
    flex:1,
  },
  name_l:{
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    height:30,
    flex:1,
  },
  move:{
    padding:"5%",
    backgroundColor:"#ffc0cb",
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'left',
    padding:"5%",
    flex:1,
    opacity:0.7,
    // borderRadius:20,
  },
  move_ene:{
    padding:"5%",
    backgroundColor:"#a9a9a9",
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'left',
    padding:"5%",
    flex:1,
    opacity:0.7,
    // borderRadius:20,
  },
  moveSub:{
    fontSize: 16,
    backgroundColor:"#eee",
  },
  moveButtons:{
    padding:"2%",
    // marginRight:"5%",
    // marginLeft:"5%",
    flex:1,
  }
});