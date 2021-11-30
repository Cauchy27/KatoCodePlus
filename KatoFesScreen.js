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



// 最初に開くところ
export default class FesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      width: 360, 
      height: 300,
      position1X: 50,
      position1Y: 220,
      position2X: Constants.MAX_WIDTH - 150,
      position2Y: 220,
      now: Date.now(),
      startTime: Date.now(),
      timer:55,
      roundCount:1,
      running:true,
      winning:false,
      endFlag:false,

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

      // p2の技選択の強さ
      p2Level:1,

      // 技を読み込む＝＞後で、読み込んだカトモンの技をロードへ
      p1MOVE_1:this.props.route.params.katomonMove.move1,
      p1MOVE_2:this.props.route.params.katomonMove.move2,
      p1MOVE_3:this.props.route.params.katomonMove.move3,

      katomonImage:this.props.route.params.katomonImage,

      // 初戦の相手は固定?
      p2MOVE_1:KatoFesP2MoveList.ai,
      p2MOVE_2:KatoFesP2MoveList.ronpa,
      p2MOVE_3:KatoFesP2MoveList.ronpa,
    };
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
    this.intervalId = this.system();

    if(this.state.running){
      this.soundStart(Sounds.battle1,0.03);
    }
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.stopBgm();
  };

  stopBgm =async()=>{
    await this.soundId.setStatusAsync({ shouldPlay: false, positionMillis: 0 });
  };

  // BGM再生用（音量なども調整）
  soundStart =async(select,inputVol) =>{
    // bgm
      this.soundId = new Audio.Sound();//オブジェクト導入
      await this.soundId.loadAsync(select);//ファイルロード
      // console.log(this.soundId );
      await this.soundId.setStatusAsync({ volume: inputVol });//音量
      await this.soundId.playAsync();//スタート
  };

  // BGMの切り替え
  bgmChange = (target,select) =>{
    // 
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

      case "p1MOVE":
        this.setState(state =>  ({
          p1MOVE_1: {
            power:this.state.p1MOVE_1.power + p2ATK - p1DEF
          } ,
          p1MOVE_2: {
            power:this.state.p1MOVE_2.power + p2ATK - p1DEF
          } ,
          p1MOVE_3: {
            power:this.state.p1MOVE_3.power + p2ATK - p1DEF
          } 
        }));
        break;

        case "p2MOVE":
        this.setState(state =>  ({
          p2MOVE_1: {
            power:this.state.p2MOVE_1.power + p1ATK - p2DEF
          } ,
          p2MOVE_2: {
            power:this.state.p2MOVE_2.power + p1ATK - p1DEF
          } ,
          p2MOVE_3: {
            power:this.state.p2MOVE_3.power + p2ATK - p1DEF
          } ,
        }));
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
  };

  // p1技発動
  p1move = async(select) =>{
    const soundObject = new Audio.Sound();
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
          await soundObject.loadAsync(this.state.p1MOVE_1.sound);
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
          await soundObject.loadAsync(this.state.p1MOVE_2.sound);
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
          await soundObject.loadAsync(this.state.p1MOVE_3.sound);
        }
        break;
    }
    try{
      await soundObject.playAsync();
    }
    catch(error){
      // console.log("sound error");
    }
  };

  // p2技発動
  p2move = async(select) =>{
    const soundObject = new Audio.Sound();
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
          await soundObject.loadAsync(this.state.p2MOVE_1.sound);
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
          await soundObject.loadAsync(this.state.p2MOVE_2.sound);
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
          await soundObject.loadAsync(this.state.p2MOVE_3.sound);
        }
        break;
    }
    try{
      await soundObject.playAsync();
    }
    catch(error){
      // console.log("sound error");
    }
  };

  // 応援ボタン
  addGuts = () =>{
    this.state.p1Guts = this.state.p1Guts + 5;
  }

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

      this.state.p1Guts = this.state.p1Guts + 3;
      this.state.p2Guts = this.state.p2Guts + 5;

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
      this.autoSelectMove("p1");

    }, 500);

    return this.intervalId;
  }

  // 再戦
  reStart = async(count) =>{
    this.stopBgm();
    this.soundStart(Sounds.battle1,0.03);
    // ラウンド判定
    switch(this.state.roundCount){
      case 1:
        console.log("1");
        this.setState(state =>  ({
          p2MOVE_1:KatoFesP2Data.hiroyuki.move.move1,
          p2MOVE_2:KatoFesP2Data.hiroyuki.move.move2,
          p2MOVE_3:KatoFesP2Data.hiroyuki.move.move3,


          p2Personality:KatoFesP2Data.hiroyuki.personality,
          p2Name:KatoFesP2Data.hiroyuki.name,
          p2HP:KatoFesP2Data.hiroyuki.status.HP,
          p2Guts:KatoFesP2Data.hiroyuki.status.Guts,
          p2ATK:KatoFesP2Data.hiroyuki.status.ATK,
          p2DEF:KatoFesP2Data.hiroyuki.status.DEF,

          p2HPmax:KatoFesP2Data.hiroyuki.status.HP,
        }));     
        break;

        case 2:
          console.log("2");
          this.setState(state =>  ({
            p2MOVE_1:KatoFesP2Data.gear.move.move1,
            p2MOVE_2:KatoFesP2Data.gear.move.move2,
            p2MOVE_3:KatoFesP2Data.gear.move.move3,
  
  
            p2Personality:KatoFesP2Data.gear.personality,
            p2Name:KatoFesP2Data.gear.name,
            p2HP:KatoFesP2Data.gear.status.HP,
            p2Guts:KatoFesP2Data.gear.status.Guts,
            p2ATK:KatoFesP2Data.gear.status.ATK,
            p2DEF:KatoFesP2Data.gear.status.DEF,
  
            p2HPmax:KatoFesP2Data.gear.status.HP,
          }));     
          break;

          case 3:
            console.log("3");
            this.setState(state =>  ({
              p2MOVE_1:KatoFesP2Data.nise.move.move1,
              p2MOVE_2:KatoFesP2Data.nise.move.move2,
              p2MOVE_3:KatoFesP2Data.nise.move.move3,
    
    
              p2Personality:KatoFesP2Data.nise.personality,
              p2Name:KatoFesP2Data.nise.name,
              p2HP:KatoFesP2Data.nise.status.HP,
              p2Guts:KatoFesP2Data.nise.status.Guts,
              p2ATK:KatoFesP2Data.nise.status.ATK,
              p2DEF:KatoFesP2Data.nise.status.DEF,
    
              p2HPmax:KatoFesP2Data.nise.status.HP,
            }));     
            break;

            case 4:
              console.log("4");
              this.setState(state =>  ({
                p2MOVE_1:KatoFesP2Data.naranton.move.move1,
                p2MOVE_2:KatoFesP2Data.naranton.move.move2,
                p2MOVE_3:KatoFesP2Data.naranton.move.move3,
      
      
                p2Personality:KatoFesP2Data.naranton.personality,
                p2Name:KatoFesP2Data.naranton.name,
                p2HP:KatoFesP2Data.naranton.status.HP,
                p2Guts:KatoFesP2Data.naranton.status.Guts,
                p2ATK:KatoFesP2Data.naranton.status.ATK,
                p2DEF:KatoFesP2Data.naranton.status.DEF,
      
                p2HPmax:KatoFesP2Data.naranton.status.HP,
              }));     
              break;

            case 5:
              console.log("5");
              this.setState(state =>  ({
                p2MOVE_1:KatoFesP2Data.golden_naoko.move.move1,
                p2MOVE_2:KatoFesP2Data.golden_naoko.move.move2,
                p2MOVE_3:KatoFesP2Data.golden_naoko.move.move3,


                p2Personality:KatoFesP2Data.golden_naoko.personality,
                p2Name:KatoFesP2Data.golden_naoko.name,
                p2HP:KatoFesP2Data.golden_naoko.status.HP,
                p2Guts:KatoFesP2Data.golden_naoko.status.Guts,
                p2ATK:KatoFesP2Data.golden_naoko.status.ATK,
                p2DEF:KatoFesP2Data.golden_naoko.status.DEF,

                p2HPmax:KatoFesP2Data.golden_naoko.status.HP,
              }));     
              break;

              case 6:
                return 0;

    }

    //ゲーム再スタートのための初期化
    this.setState({
      running:true,
      winning:false,
      now: Date.now(),
      startTime: Date.now(),

      position1X: 50,
      position2X: Constants.MAX_WIDTH - 150,

      timer:55,

      // 戦闘のステータス関連
      p1Personality:1,
      p1HP:this.props.route.params.katomonPower,
      p1Guts:0,
      p1ATK:this.props.route.params.katomonikioi,
      p1DEF:this.props.route.params.katomonMamori,
    });

    this.state.roundCount = count;
    
    this.intervalId = this.system();

    return this.intervalId;
    
  }


  goto = async(destination) => {
    try {
    // destinationごとに音声を変えておく
      const soundObject = new Audio.Sound();
      switch(destination){
        case "ホーム":
          await soundObject.loadAsync(require('./assets/sound/fujinami2.mp3'));
          break;
      }

      await soundObject.playAsync();
      console.log('success!!!');

      this.setState({
        roundCount:1,
        running:true,
        winning:false,
        endFlag:false,
      });

      this.props.navigation.navigate(destination)
    } 
    catch (error) {
      console.log('error...');
    }
  }
  
  render(){

    // console.log(this.props.route.params);
    if(this.state.roundCount==5){
      this.state.roundCount="最終";
    }

    // 対戦の終了判定
    if(Math.round(
    this.state.timer) <= 0){
      clearInterval(this.intervalId);
      this.stopBgm();
      if(this.state.p1HP/this.state.p1HPmax <= this.state.p2HP/this.state.p2HPmax){
        this.state.running = false;
        // 負け広告
        var random = Math.random();
        if(random < 0.3){
          this.Interstitial();
        }
        this.soundStart(Sounds.gameOver,0.03);
      }
      else{
        this.soundStart(Sounds.next1,1);
        if(this.state.roundCount>=5){
          this.state.endFlag = true;
        }
        else{
          this.state.winning = true;
        }
      }
      // this.state.timer = 55;
    }
    if(this.state.p1HP <= 0){
        clearInterval(this.intervalId);
        this.stopBgm();
        if(this.state.p1HP <= this.state.p2HP){
          this.state.running = false;
          // 負け広告
          var random = Math.random();
        if(random < 0.3){
          this.Interstitial();
        }
          this.soundStart(Sounds.gameOver,0.03);
        }
        else{
          this.soundStart(Sounds.next1,1);
          if(this.state.roundCount>=5){
            this.state.endFlag = true;
          }
          else{
            this.state.winning = true;
          }
        }
        // this.state.timer = 55;
      }
    if(this.state.p2HP <= 0){
      clearInterval(this.intervalId);
      this.stopBgm();
      if(this.state.p1HP <= this.state.p2HP){
        this.state.running = false;
        // 負け広告
        var random = Math.random();
        if(random < 0.3){
          this.Interstitial();
        }
        this.soundStart(Sounds.gameOver,0.03);
      }
      else{
        this.soundStart(Sounds.next1,1);
        if(this.state.roundCount>=5){
          this.state.endFlag = true;
        }
        else{
          this.state.winning = true;
        }
      }
      // this.state.timer = 55;
     }

    return(
      <SafeAreaView style = {styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
        <View style={{
          position:'absolute',
          top:"3%"}}>
          <Text style = {{
            textAlign:'center',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'DotGothic16_400Regular',
            backgroundColor:"#fff",
            marginLeft:"30%",
            marginRight:"30%",
            }}>
              現在{this.state.roundCount}戦目
          </Text>
          <View style = {styles.name}>
            <Text style = {styles.name_r}>
              {this.state.p1Name}
            </Text>
            <Text style = {{
            textAlign:'center',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'DotGothic16_400Regular',
            backgroundColor:"#fff",
            flex:0.3,
            }}>
              {Math.round(this.state.timer)}
            </Text>
            <Text style = {styles.name_l}>
              {this.state.p2Name}
            </Text>
          </View>
          <View style = {styles.names}>
            <Text style = {styles.name_r}>
              ガッツ：{this.state.p1Guts}
            </Text>
            <Text style = {styles.name_l}>
              ガッツ：{this.state.p2Guts}
            </Text>
          </View>
          <Image
            width={this.state.width}
            height={this.state.height}
            style={{ 
              backgroundColor: '#eee' ,
              alignItems:"center",
              borderRadius:10,
          }}
            source={Images.battleField}
          />
          {/* Player1 */}
           <Image
              source={this.state.katomonImage}
              style={{ width: 100, height: 100 ,top:this.state.position1Y, left: this.state.position1X, position:'absolute',
              backgroundColor:"#cd853f",
              borderRadius:10,}}
            /> 
            <Text style={{ width:Math.round(this.state.p1HP/this.state.p1HPmax * 100),height: 15,top:this.state.position1Y-20, left: this.state.position1X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p1HP)}</Text>  
            <Text style={{ width:100,height: 15,top:this.state.position1Y-40, left: this.state.position1X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p1HP/this.state.p1HPmax * 100)}%</Text>  
          {/* Player2 */}
          <Image
              source={Images.hiroyuki}
              style={{ width: 100, height: 100 ,top:this.state.position2Y, left: this.state.position2X, position:'absolute',
              backgroundColor:"#ffd700",
              borderRadius:10,}}
            />
            <Text style={{ width:Math.round(this.state.p2HP/this.state.p2HPmax * 100), height: 15 ,top:this.state.position2Y-20, left: this.state.position2X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p2HP)}</Text>  
            <Text style={{ width:100, height: 15 ,top:this.state.position2Y-40, left: this.state.position2X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p2HP/this.state.p2HPmax * 100)}%</Text>  

          {/* 技ボタン */}
          <View style={{marginBottom:"-3%"}}>
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
                <Text style={styles.move}>1.{this.state.p2MOVE_1.name}</Text>
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
                <Text style={styles.move}>2.{this.state.p2MOVE_2.name}</Text>
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
                <Text style={styles.move}>3.{this.state.p2MOVE_3.name}</Text>
                <Text style={styles.moveSub}> 必要ガッツ：{this.state.p2MOVE_3.consumption_Guts}</Text>
                <Text style={styles.moveSub}> 射程：{this.state.p2MOVE_3.range} 威力：{this.state.p2MOVE_3.power}</Text>
              </View>
            </View>
          </View>

          {/* 応援ボタン */}
          <View style = {styles.buttons}>
              <TouchableOpacity 
                style ={styles.button}
                onPress={this.addGuts}
              >
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  fontFamily: 'DotGothic16_400Regular',
                  textAlign:'center',
                }}>
                  応援:ガッツ増加
                </Text>
              </TouchableOpacity>
          </View>
        </View>
        {/* ポップアップ */}
        {!this.state.running && (
          <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.reStart(this.state.roundCount)}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>敗戦...</Text>
              <Text style={styles.gameOverSubText}>立ち上がる☜</Text>
            </View>
          </TouchableOpacity>
        )}
        {this.state.winning && (
          <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.reStart(this.state.roundCount+1)}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>次の相手へ!!</Text>
              <Text style={styles.gameOverSubText}>{this.state.roundCount+1}戦目へ</Text>
            </View>
          </TouchableOpacity>
        )}
        {this.state.endFlag && (
          <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.goto("ホーム")}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>おめでとうございます!!遊んでいただきありがとうございました！！</Text>
              <Text style={styles.gameOverSubText}>Tap</Text>
            </View>
          </TouchableOpacity>
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
    fontFamily: 'DotGothic16_400Regular',
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    marginBottom:"10%",
    // fontFamily: '04b_19',
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24,
    // fontFamily: '04b_19',
  },
  gameArea:{
    height: Constants.TITLE_HEIGHT,
    width:Constants.MAX_WIDTH,
    paddingLeft:"2%" ,
    paddingRight:"2%",
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
    paddingLeft:"10%",
    paddingRight:"10%",
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
    marginTop:"5%",
    textAlign:'center',
    // backgroundColor: "red",
  },
  name_r:{
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    flex:1,
  },
  name_l:{
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    flex:1,
  },
  move:{
    padding:"5%",
    backgroundColor:"#eee",
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'DotGothic16_400Regular',
    textAlign:'left',
    padding:"5%",
    flex:1,
    opacity:0.7,
  },
  moveSub:{
    fontSize: 11,
    backgroundColor:"#eee",
  },
  moveButtons:{
    padding:"3%",
    marginRight:"5%",
    marginLeft:"5%",
    flex:1,
  }
});