
import React,{ Component } from 'react';
import { 
  SafeAreaView,
  StyleSheet, 
  Text, 
  View,
  Button,
  Modal,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import Constants from './Constants';
import axios, { AxiosRequestConfig } from 'axios';
import { Audio } from 'expo-av';
import Images from './assets/Images';
import Sounds from './assets/Sounds';
import KatomonMoveList from './battle/KatomonMoveList';
import KatoFesP2MoveList from './battle/KatoFesP2MoveList';
import ChampMoveList from "./battle/ChampMoveList";

// import {
//   Audio
// } from 'expo';

// 効果音の再生に使う
function playEffectSound(sound,vol) {
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

// function stopSound(taeget,name, sound) {
//   console.log('Stop ' + name);
//   target.setStatusAsync(
//      sound, {
//         shouldPlay: false,
//         positionMillis: 0
//      }
//   ).then((res) => {
//      res.sound.setOnPlaybackStatusUpdate((status) => {
//         if (!status.didJustFinish) return;
//         console.log('Unloading ' + name);
//         res.sound.unloadAsync().catch(() => {});
//      });
//   }).catch((error) => {});
// }


// 制限がかかった際に切り替える
const YOUTUBE_API_KEY = {
 1:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 2:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 3:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 4:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 5:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 6:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 7:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 8:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
 9:"AIzaSyBpowKN3ngEqlSGT-r-9jeBVUce0CulPC8",
};
// 使用するキー
var useApiNum = 9 ;

// 最初に開くところ
export default class ChampionshipScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      apiSuccess:　false,
      memberListFlag:true,
      // memberListFlag:false,
      resultFlag:false,
      opacity: new Animated.Value(0),

      useAPI:useApiNum,
      changing:false,

      errorCatch:null,

      groupA:false,
      // groupA:true,
      groupB:false,
      groupC:false,
      groupD:false,

      endA:false,
      // endA:true,
      endB:false,
      endC:false,
      endD:false,

      final:false,

      firstFlag:true,
      expFlag:false,

      // final用
      tableR1_final:Images.item1,
      tableR2_final:Images.item2,
      tableR3_final:Images.item3,
      tableR4_final:Images.item4,

      tableR1_name_final:null,
      tableR2_name_final:null,
      tableR3_name_final:null,
      tableR4_name_final:null,

      tableR1_st_final:null,
      tableR2_st_final:null,
      tableR3_st_final:null,
      tableR4_st_final:null,

      katoPoint1_final:null,
      katoPoint2_final:null,
      katoPoint3_final:null,
      katoPoint4_final:null,

      final_count:0,

      // Champion用
      champ_image:null,
      champ_name:null,
      champ_st:null,
      champ_katoPoint:null,

      tableR1:Images.item1,
      tableR2:Images.item2,
      tableR3:Images.item3,
      tableR4:Images.item4,

      tableR1_name:null,
      tableR2_name:null,
      tableR3_name:null,
      tableR4_name:null,

      tableR1_st:null,
      tableR2_st:null,
      tableR3_st:null,
      tableR4_st:null,

      tableData:{
        1:{
          2:null,
          3:null,
          4:null,
        },
        2:{
          1:null,
          3:null,
          4:null,
        },
        3:{
          2:null,
          1:null,
          4:null,
        },
        4:{
          2:null,
          3:null,
          1:null,
        }
      },
      

      Kirinuki1_lose:false,
      Kirinuki2_lose:false,
      Kirinuki3_lose:false,
      Kirinuki4_lose:false,

      Kirinuki5_lose:false,
      Kirinuki6_lose:false,
      Kirinuki7_lose:false,
      Kirinuki8_lose:false,

      Kirinuki9_lose:false,
      Kirinuki10_lose:false,
      Kirinuki11_lose:false,
      Kirinuki12_lose:false,

      Kirinuki13_lose:false,
      Kirinuki14_lose:false,
      Kirinuki15_lose:false,
      Kirinuki16_lose:false,


      JunData:"",
      JunDes:"",
      JunImage:"",

      KirinukiData1:"",
      KirinukiDes1:"",
      KirinukiImage1:Images.item1,

      KirinukiData2:"",
      KirinukiDes2:"",
      KirinukiImage2:Images.item2,

      KirinukiData3:"",
      KirinukiDes3:"",
      KirinukiImage3:Images.item3,

      KirinukiData4:"",
      KirinukiDes4:"",
      KirinukiImage4:Images.item4,

      KirinukiData5:"",
      KirinukiDes5:"",
      KirinukiImage5:Images.item1,

      KirinukiData6:"",
      KirinukiDes6:"",
      KirinukiImage6:Images.item2,

      KirinukiData7:"",
      KirinukiDes7:"",
      KirinukiImage7:Images.item3,

      KirinukiData8:"",
      KirinukiDes8:"",
      KirinukiImage8:Images.item4,

      KirinukiData9:"",
      KirinukiDes9:"",
      KirinukiImage9:Images.item1,

      KirinukiData10:"",
      KirinukiDes10:"",
      KirinukiImage10:Images.item2,

      KirinukiData11:"",
      KirinukiDes11:"",
      KirinukiImage11:Images.item3,

      KirinukiData12:"",
      KirinukiDes12:"",
      KirinukiImage12:Images.item4,

      KirinukiData13:"",
      KirinukiDes13:"",
      KirinukiImage13:Images.item1,

      KirinukiData14:"",
      KirinukiDes14:"",
      KirinukiImage14:Images.item2,

      KirinukiData15:"",
      KirinukiDes15:"",
      KirinukiImage15:Images.item3,

      KirinukiData16:"",
      KirinukiDes16:"",
      KirinukiImage16:Images.item4,

      // KirinukiData18:"",
      // KirinukiData19:"",
      // KirinukiData20:"",
      // KirinukiData21:"",
      // KirinukiData22:"",
      // KirinukiData23:"",
      // KirinukiData24:"",

      // 戦闘関係
      timer:25,
      timeMax:25,
      width: Constants.MAX_WIDTH, 
      height: Constants.MAX_WIDTH * 250/400,
      position1X: Constants.MAX_WIDTH * 250/400/10,
      position1Y: Constants.MAX_WIDTH * 250/400/2 - Constants.MAX_WIDTH * 250/400/6/2,
      position2X: Constants.MAX_WIDTH -Constants.MAX_WIDTH * 250/400/10 ,
      position2Y: Constants.MAX_WIDTH * 250/400/2 - Constants.MAX_WIDTH * 250/400/6/2,

      battleFlag:false,

      p1:null,
      p2:null,

      p1Name:"",
      p2Name:"",

      p1Image:Images.item4,
      p2Image:Images.item4,

      p1KatoPoint:0,
      p2KatoPoint:0,

      p1HP:1000,
      p2HP:1000,

      p1Guts:0,
      p2Guts:0,

      p1MOVE_1:ChampMoveList.rightStraight,
      p1MOVE_2:ChampMoveList.gaia,

      p2MOVE_1:ChampMoveList.rightStraight,
      p2MOVE_2:ChampMoveList.gaia,

      p1Personality:1.2,
      p2Personality:1.2,

      p1PoissonFlag:false,
      p2PoissonFlag:false,

      table1Count:0,
      table2Count:0,
      table3Count:0,
      table4Count:0,

      katoPoint1:0,
      katoPoint2:0,
      katoPoint3:0,
      katoPoint4:0,

      // 音声をロードしておくところ
      soundPreload:{
        r1:{
          move1:new Audio.Sound,
          move2:new Audio.Sound,
        },
        r2:{
          move1:new Audio.Sound,
          move2:new Audio.Sound,
        },
        bgm:{
          battle1:new Audio.Sound,
          title:new Audio.Sound,
          final:new Audio.Sound,
          change:new Audio.Sound,
        }
      },

    };
  };

  animate() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600*8,
      useNativeDriver:true,
    }).start();
  }

  reset = () => {
    // resetPipes();
    // this.gameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
    });
  };

  componentDidMount = async() => {

    // this.state.soundPreload.bgm.title = new Audio.Sound;
    this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);

    
    // playEffectSound(this.state.soundPreload.bgm.title,"bgm1",Sounds.bgm1);
    // セリフをBGMが邪魔しないように音量調整

    // 切り抜き情報取得
    this.getList();
    // this.getJun();
    console.log(this.state.apiSuccess);

  };

  componentWillUnmount =async()=>{
    this.stopBgm(this.state.soundPreload.bgm.title);
    this.stopBgm(this.state.soundPreload.bgm.battle1);
    // this.stopBgm(this.state.soundPreload.bgm.final);
    // stopSound(this.state.soundPreload.bgm.title,"bgm1",Sounds.bgm1);
    // this.state.soundPreload.bgm.title=null,
    clearInterval(this.intervalId);
  };

  getJun = async()=>{
    const url_jun =`https://www.googleapis.com/youtube/v3/channels?id=UCx1nAvtVDIsaGmCMSe8ofsQ&part=snippet,contentDetails,statistics,topicDetails&key=${YOUTUBE_API_KEY[this.state.useAPI]}`;

    axios
      .get(url_jun)
      .then(res_jun => {
        this.setState(state =>  ({
          JunData:res_jun["data"]["items"][0]["snippet"]["title"],
          JunDes:res_jun["data"]["items"][0]["statistics"],
          JunImage:res_jun["data"]["items"][0]["snippet"]["thumbnails"]["default"]["url"],
        }));
        console.log(this.state.JunDes);
        console.log(this.state.JunImage);
      })
      .catch(() => {
        console.log('通信に失敗しました_res');
        this.state.errorCatch = true;
        this.state.apiSuccess = true;
    });
  };

  getList = async() =>{
    // 切り抜きチャンネルの取得
    const url = `https://www.googleapis.com/youtube/v3/search?type=channel&part=snippet&q=加藤純一&maxResults=25&order=relevance&key=${YOUTUBE_API_KEY[this.state.useAPI]}`;

    // const url =`https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=HIKAKIN&key=${YOUTUBE_API_KEY}`

    /**https://phpjavascriptroom.com/?t=strm&p=youtubedataapi_v3_list 
     * 取得情報に関してのリファレンス */
  
    axios
      .get(url)
      .then(response => {
          // ピザラジのIDを除外
          var piza =false;
          var pizaCount=1;
          while(!piza){
            if(response["data"]["items"][pizaCount]["snippet"]["channelId"]=="UCeWZN7rNRQaHCtMCdHEZFqw"){
              response["data"]["items"][pizaCount]["snippet"]["channelId"] = response["data"]["items"][17]["snippet"]["channelId"];
              piza = true;
            }
            pizaCount += 1;
            if(pizaCount >= 17){
              piza = true
            }
            // console.log(pizaCount);
            // console.log(response["data"]["items"][pizaCount]["snippet"]["channelId"]);
          }

          // 引数を関数系にしないことで順番をランダムに
          this.setState({
            JunData: response["data"]["items"][0]["snippet"]["channelId"],

            // 1つ目は本人なので、0は省いて１から
            // ここでIDを取得へ
            //ピザラジのID＝UCeWZN7rNRQaHCtMCdHEZFqw

            KirinukiData1: response["data"]["items"][1]["snippet"]["channelId"],

            KirinukiData2: response["data"]["items"][2]["snippet"]["channelId"],

            KirinukiData3: response["data"]["items"][3]["snippet"]["channelId"],

            KirinukiData4: response["data"]["items"][4]["snippet"]["channelId"],

            KirinukiData5: response["data"]["items"][5]["snippet"]["channelId"],

            KirinukiData6: response["data"]["items"][6]["snippet"]["channelId"],

            KirinukiData7: response["data"]["items"][7]["snippet"]["channelId"],

            KirinukiData8: response["data"]["items"][8]["snippet"]["channelId"],

            KirinukiData9: response["data"]["items"][9]["snippet"]["channelId"],

            KirinukiData10: response["data"]["items"][10]["snippet"]["channelId"],

            KirinukiData11: response["data"]["items"][11]["snippet"]["channelId"],

            KirinukiData12: response["data"]["items"][12]["snippet"]["channelId"],

            KirinukiData13: response["data"]["items"][13]["snippet"]["channelId"],

            KirinukiData14: response["data"]["items"][14]["snippet"]["channelId"],

            KirinukiData15: response["data"]["items"][15]["snippet"]["channelId"],

            KirinukiData16: response["data"]["items"][16]["snippet"]["channelId"],

          });
          this.state.apiSuccess = true;

          // 以下、IDを用いてチャンネル詳細取得
          const url_res = `https://www.googleapis.com/youtube/v3/channels?id=${this.state.KirinukiData1},${this.state.KirinukiData2},${this.state.KirinukiData3},${this.state.KirinukiData4},${this.state.KirinukiData5},${this.state.KirinukiData6},${this.state.KirinukiData7},${this.state.KirinukiData8},${this.state.KirinukiData9},${this.state.KirinukiData10},${this.state.KirinukiData11},${this.state.KirinukiData12},${this.state.KirinukiData13},${this.state.KirinukiData14},${this.state.KirinukiData15},${this.state.KirinukiData16}&part=snippet,contentDetails,statistics,topicDetails&key=${YOUTUBE_API_KEY[this.state.useAPI]}`;

          axios
          .get(url_res)
          .then(response2 => {

              this.setState({
                // 詳細データ取得
                KirinukiData1: response2["data"]["items"][0]["snippet"]["title"],
                KirinukiDes1:response2["data"]["items"][0]["statistics"],
                KirinukiImage1: response2["data"]["items"][0]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData2: response2["data"]["items"][1]["snippet"]["title"],
                KirinukiDes2:response2["data"]["items"][1]["statistics"],
                KirinukiImage2:response2["data"]["items"][1]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData3: response2["data"]["items"][2]["snippet"]["title"],
                KirinukiDes3:response2["data"]["items"][2]["statistics"],
                KirinukiImage3: response2["data"]["items"][2]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData4: response2["data"]["items"][3]["snippet"]["title"],
                KirinukiDes4:response2["data"]["items"][3]["statistics"],
                KirinukiImage4: response2["data"]["items"][3]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData5: response2["data"]["items"][4]["snippet"]["title"],
                KirinukiDes5:response2["data"]["items"][4]["statistics"],
                KirinukiImage5: response2["data"]["items"][4]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData6: response2["data"]["items"][5]["snippet"]["title"],
                KirinukiDes6:response2["data"]["items"][5]["statistics"],
                KirinukiImage6: response2["data"]["items"][5]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData7: response2["data"]["items"][6]["snippet"]["title"],
                KirinukiDes7:response2["data"]["items"][6]["statistics"],
                KirinukiImage7: response2["data"]["items"][6]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData8: response2["data"]["items"][7]["snippet"]["title"],
                KirinukiDes8:response2["data"]["items"][7]["statistics"],
                KirinukiImage8: response2["data"]["items"][7]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData9: response2["data"]["items"][8]["snippet"]["title"],
                KirinukiDes9:response2["data"]["items"][8]["statistics"],
                KirinukiImage9: response2["data"]["items"][8]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData10: response2["data"]["items"][9]["snippet"]["title"],
                KirinukiDes10:response2["data"]["items"][9]["statistics"],
                KirinukiImage10: response2["data"]["items"][9]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData11: response2["data"]["items"][10]["snippet"]["title"],
                KirinukiDes11:response2["data"]["items"][10]["statistics"],
                KirinukiImage11: response2["data"]["items"][10]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData12: response2["data"]["items"][11]["snippet"]["title"],
                KirinukiDes12:response2["data"]["items"][11]["statistics"],
                KirinukiImage12: response2["data"]["items"][11]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData13: response2["data"]["items"][12]["snippet"]["title"],
                KirinukiDes13:response2["data"]["items"][12]["statistics"],
                KirinukiImage13: response2["data"]["items"][12]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData14: response2["data"]["items"][13]["snippet"]["title"],
                KirinukiDes14:response2["data"]["items"][13]["statistics"],
                KirinukiImage14: response2["data"]["items"][13]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData15: response2["data"]["items"][14]["snippet"]["title"],
                KirinukiDes15:response2["data"]["items"][14]["statistics"],
                KirinukiImage15: response2["data"]["items"][14]["snippet"]["thumbnails"]["default"]["url"],

                KirinukiData16: response2["data"]["items"][15]["snippet"]["title"],
                KirinukiDes16:response2["data"]["items"][15]["statistics"],
                KirinukiImage16: response2["data"]["items"][15]["snippet"]["thumbnails"]["default"]["url"],
              });
              this.state.apiSuccess = false;
          })
          .catch((error) => {
              console.log('通信に失敗しました_res');
              console.log(error);
              this.state.errorCatch = true;
              this.state.apiSuccess = true;
          });
      })
      .catch((error) => {
          console.log('通信に失敗しました');
          console.log(error.message);
          console.log(error instanceof Error);
          this.state.errorCatch = true;
          this.state.apiSuccess = true;
          console.log(this.state.errorCatch);
      });
  };
  
  changeAPI =async() =>{

    // 初回取得の間の時間でボタンを連打されても反応しないようにエスケープ
      this.state.useAPI -=1;
      if(this.state.useAPI <= 0){
        this.state.useAPI = 9;
      }
      console.log(this.state.useAPI);
  
      this.getList().then(()=>{
        if(!this.state.KirinukiDes1["subscriberCount"]){
          this.state.KirinukiDes1["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes2["subscriberCount"]){
          this.state.KirinukiDes2["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes3["subscriberCount"]){
          this.state.KirinukiDes3["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes4["subscriberCount"]){
          this.state.KirinukiDes4["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes5["subscriberCount"]){
          this.state.KirinukiDes5["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes6["subscriberCount"]){
          this.state.KirinukiDes6["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes7["subscriberCount"]){
          this.state.KirinukiDes7["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes8["subscriberCount"]){
          this.state.KirinukiDes8["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes9["subscriberCount"]){
          this.state.KirinukiDes9["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes10["subscriberCount"]){
          this.state.KirinukiDes10["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes11["subscriberCount"]){
          this.state.KirinukiDes11["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes12["subscriberCount"]){
          this.state.KirinukiDes12["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes13["subscriberCount"]){
          this.state.KirinukiDes13["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes14["subscriberCount"]){
          this.state.KirinukiDes14["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes15["subscriberCount"]){
          this.state.KirinukiDes15["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes16["subscriberCount"]){
          this.state.KirinukiDes16["subscriberCount"]=0;
        }
      }).catch((error) => {console.log(error.message)});
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

  // シーンを変更して、チャンネル情報を表に渡す
  changeScene = async(select) =>{
    if(this.state.firstFlag){
      this.state.expFlag = true;
      this.state.firstFlag = false;
    }
    console.log(select);
    // this.state.soundPreload.bgm.change = new Audio.Sound;
    // await this.soundStart(this.state.soundPreload.bgm.change,Sounds.generate1,0.03);

    playEffectSound(Sounds.generate1,0.07);

    this.setState(state =>  ({
      tableData:{
        1:{
          2:null,
          3:null,
          4:null,
        },
        2:{
          1:null,
          3:null,
          4:null,
        },
        3:{
          2:null,
          1:null,
          4:null,
        },
        4:{
          2:null,
          3:null,
          1:null,
        }
      },
    }));
    switch(select){
      case "A":
        if(!this.state.KirinukiDes1["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes1["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes2["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes2["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes3["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes3["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes4["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes4["subscriberCount"]=0;
        }
        this.setState(state =>  ({
          groupA :true,
          
          memberListFlag:false,
          groupB :false,
          groupC :false,
          groupD :false,

          tableR1:this.state.KirinukiImage1,
          tableR2:this.state.KirinukiImage2,
          tableR3:this.state.KirinukiImage3,
          tableR4:this.state.KirinukiImage4,

          tableR1_name:this.state.KirinukiData1,
          tableR2_name:this.state.KirinukiData2,
          tableR3_name:this.state.KirinukiData3,
          tableR4_name:this.state.KirinukiData4,

          tableR1_st:this.state.KirinukiDes1,
          tableR2_st:this.state.KirinukiDes2,
          tableR3_st:this.state.KirinukiDes3,
          tableR4_st:this.state.KirinukiDes4,

          katoPoint1:parseInt(this.state.KirinukiDes1["viewCount"],10) + parseInt(this.state.KirinukiDes1["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes1["subscriberCount"],10)*1000,
          katoPoint2:parseInt(this.state.KirinukiDes2["viewCount"],10) + parseInt(this.state.KirinukiDes2["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes2["subscriberCount"],10)*1000,
          katoPoint3:parseInt(this.state.KirinukiDes3["viewCount"],10) + parseInt(this.state.KirinukiDes3["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes3["subscriberCount"],10)*1000,
          katoPoint4:parseInt(this.state.KirinukiDes4["viewCount"],10) + parseInt(this.state.KirinukiDes4["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes4["subscriberCount"],10)*1000,

        }));
      break;

      case "B":
        if(!this.state.KirinukiDes5["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes5["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes6["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes6["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes7["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes7["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes8["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes8["subscriberCount"]=0;
        }
        this.setState(state =>  ({
          groupB :true,
          
          memberListFlag:false,
          groupA :false,
          groupC :false,
          groupD :false,

          tableR1:this.state.KirinukiImage5,
          tableR2:this.state.KirinukiImage6,
          tableR3:this.state.KirinukiImage7,
          tableR4:this.state.KirinukiImage8,

          tableR1_name:this.state.KirinukiData5,
          tableR2_name:this.state.KirinukiData6,
          tableR3_name:this.state.KirinukiData7,
          tableR4_name:this.state.KirinukiData8,

          tableR1_st:this.state.KirinukiDes5,
          tableR2_st:this.state.KirinukiDes6,
          tableR3_st:this.state.KirinukiDes7,
          tableR4_st:this.state.KirinukiDes8,

          katoPoint1:parseInt(this.state.KirinukiDes5["viewCount"],10) + parseInt(this.state.KirinukiDes5["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes5["subscriberCount"],10)*1000,
          katoPoint2:parseInt(this.state.KirinukiDes6["viewCount"],10) + parseInt(this.state.KirinukiDes6["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes6["subscriberCount"],10)*1000,
          katoPoint3:parseInt(this.state.KirinukiDes7["viewCount"],10) + parseInt(this.state.KirinukiDes7["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes7["subscriberCount"],10)*1000,
          katoPoint4:parseInt(this.state.KirinukiDes8["viewCount"],10) + parseInt(this.state.KirinukiDes8["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes8["subscriberCount"],10)*1000,

        }));
      break;

      case "C":
        if(!this.state.KirinukiDes9["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes9["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes10["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes10["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes11["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes11["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes12["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes12["subscriberCount"]=0;
        }
        this.setState(state =>  ({
          groupC :true,
          
          memberListFlag:false,
          groupB :false,
          groupA :false,
          groupD :false,

          tableR1:this.state.KirinukiImage9,
          tableR2:this.state.KirinukiImage10,
          tableR3:this.state.KirinukiImage11,
          tableR4:this.state.KirinukiImage12,

          tableR1_name:this.state.KirinukiData9,
          tableR2_name:this.state.KirinukiData10,
          tableR3_name:this.state.KirinukiData11,
          tableR4_name:this.state.KirinukiData12,

          tableR1_st:this.state.KirinukiDes9,
          tableR2_st:this.state.KirinukiDes10,
          tableR3_st:this.state.KirinukiDes11,
          tableR4_st:this.state.KirinukiDes12,

          katoPoint1:parseInt(this.state.KirinukiDes9["viewCount"],10) + parseInt(this.state.KirinukiDes9["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes9["subscriberCount"],10)*1000,
          katoPoint2:parseInt(this.state.KirinukiDes10["viewCount"],10) + parseInt(this.state.KirinukiDes10["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes10["subscriberCount"],10)*1000,
          katoPoint3:parseInt(this.state.KirinukiDes11["viewCount"],10) + parseInt(this.state.KirinukiDes11["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes11["subscriberCount"],10)*1000,
          katoPoint4:parseInt(this.state.KirinukiDes12["viewCount"],10) + parseInt(this.state.KirinukiDes12["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes12["subscriberCount"],10)*1000,

        }));
      break;

      case "D":
        if(!this.state.KirinukiDes13["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes13["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes14["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes14["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes15["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes15["subscriberCount"]=0;
        }
        if(!this.state.KirinukiDes16["subscriberCount"]){
          console.log("1s");
          this.state.KirinukiDes16["subscriberCount"]=0;
        }
        this.setState(state =>  ({
          groupD :true,
          
          memberListFlag:false,
          groupB :false,
          groupC :false,
          groupA :false,

          tableR1:this.state.KirinukiImage13,
          tableR2:this.state.KirinukiImage14,
          tableR3:this.state.KirinukiImage15,
          tableR4:this.state.KirinukiImage16,

          tableR1_name:this.state.KirinukiData13,
          tableR2_name:this.state.KirinukiData14,
          tableR3_name:this.state.KirinukiData15,
          tableR4_name:this.state.KirinukiData16,

          tableR1_st:this.state.KirinukiDes13,
          tableR2_st:this.state.KirinukiDes14,
          tableR3_st:this.state.KirinukiDes15,
          tableR4_st:this.state.KirinukiDes16,

          katoPoint1:parseInt(this.state.KirinukiDes13["viewCount"],10) + parseInt(this.state.KirinukiDes13["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes13["subscriberCount"],10)*1000,
          katoPoint2:parseInt(this.state.KirinukiDes14["viewCount"],10) + parseInt(this.state.KirinukiDes14["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes14["subscriberCount"],10)*1000,
          katoPoint3:parseInt(this.state.KirinukiDes15["viewCount"],10) + parseInt(this.state.KirinukiDes15["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes15["subscriberCount"],10)*1000,
          katoPoint4:parseInt(this.state.KirinukiDes16["viewCount"],10) + parseInt(this.state.KirinukiDes16["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes16["subscriberCount"],10)*1000,

        }));
      break;

      // 後で設定
      case "final":
        console.log("final_1");
        this.setFinal().then(()=>{
          // console.log(this.state.tableR1_final);
          // console.log(this.state.tableR2_final);
          // console.log(this.state.tableR3_final);
          // console.log(this.state.tableR4_final);
          // console.log("=====1====");
          this.setState(state =>  ({
            memberListFlag:false,
            final:true,
            timeMax:55,
  
            groupA :false,
            groupB :false,
            groupC :false,
            groupD :false,
  
            tableR1:this.state.tableR1_final,
            tableR2:this.state.tableR2_final,
            tableR3:this.state.tableR3_final,
            tableR4:this.state.tableR4_final,
  
            tableR1_name:this.state.tableR1_name_final,
            tableR2_name:this.state.tableR2_name_final,
            tableR3_name:this.state.tableR3_name_final,
            tableR4_name:this.state.tableR4_name_final,
  
            tableR1_st:this.state.tableR1_st_final,
            tableR2_st:this.state.tableR2_st_final,
            tableR3_st:this.state.tableR3_st_final,
            tableR4_st:this.state.tableR4_st_final,
  
            katoPoint1:this.state.katoPoint1_final,
            katoPoint2:this.state.katoPoint2_final,
            katoPoint3:this.state.katoPoint3_final,
            katoPoint4:this.state.katoPoint4_final,
  
          }));
          // console.log(this.state.tableR1_final);
          // console.log(this.state.tableR2_final);
          // console.log(this.state.tableR3_final);
          // console.log(this.state.tableR4_final);
          // console.log("=====2====");
          // console.log(this.state.tableR1);
          // console.log(this.state.tableR2);
          // console.log(this.state.tableR3);
          // console.log(this.state.tableR4);
          // console.log("------------2------------");
        });
        break;
    }
  };

  skipGroup =() =>{
    if(!this.state.KirinukiDes1["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes1["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes2["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes2["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes3["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes3["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes4["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes4["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes5["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes5["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes6["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes6["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes7["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes7["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes8["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes8["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes9["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes9["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes10["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes10["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes11["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes11["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes12["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes12["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes13["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes13["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes14["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes14["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes15["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes15["subscriberCount"]=0;
    }
    if(!this.state.KirinukiDes16["subscriberCount"]){
      console.log("1s");
      this.state.KirinukiDes16["subscriberCount"]=0;
    }
    if(!this.state.endA){
      console.log("skipA");
      this.setState(state =>  ({

        groupA:true,

        katoPoint1:parseInt(this.state.KirinukiDes1["viewCount"],10) + parseInt(this.state.KirinukiDes1["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes1["subscriberCount"],10)*1000,
        katoPoint2:parseInt(this.state.KirinukiDes2["viewCount"],10) + parseInt(this.state.KirinukiDes2["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes2["subscriberCount"],10)*1000,
        katoPoint3:parseInt(this.state.KirinukiDes3["viewCount"],10) + parseInt(this.state.KirinukiDes3["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes3["subscriberCount"],10)*1000,
        katoPoint4:parseInt(this.state.KirinukiDes4["viewCount"],10) + parseInt(this.state.KirinukiDes4["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes4["subscriberCount"],10)*1000,

      }));
      // 戦闘力で決定)
      // 1の勝ち抜け
      if(this.state.katoPoint1 > this.state.katoPoint2 &&　this.state.katoPoint1 > this.state.katoPoint3 && this.state.katoPoint1 > this.state.katoPoint4){
        try{return this.loseSynser(false,true,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 2の勝ち抜け
      if(this.state.katoPoint2 > this.state.katoPoint1 &&　this.state.katoPoint2 > this.state.katoPoint3 && this.state.katoPoint2 > this.state.katoPoint4){
        try{return this.loseSynser(true,false,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 3の勝ち抜け
      if(this.state.katoPoint3 > this.state.katoPoint1 &&　this.state.katoPoint3 > this.state.katoPoint2 && this.state.katoPoint3 > this.state.katoPoint4){
        try{return this.loseSynser(true,true,false,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 4の勝ち抜け
      if(this.state.katoPoint4 > this.state.katoPoint1 &&　this.state.katoPoint4 > this.state.katoPoint2 && this.state.katoPoint4 > this.state.katoPoint3){
        try{return this.loseSynser(true,true,true,false).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }

      console.log("tie");
      // 同着はスキップできないように。
    }
    else{
      console.log("not skipA");
      if(!this.state.endB){
        console.log("skipB");
        this.setState(state =>  ({

          groupB:true,
  
          katoPoint1:parseInt(this.state.KirinukiDes5["viewCount"],10) + parseInt(this.state.KirinukiDes5["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes5["subscriberCount"],10)*1000,
          katoPoint2:parseInt(this.state.KirinukiDes6["viewCount"],10) + parseInt(this.state.KirinukiDes6["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes6["subscriberCount"],10)*1000,
          katoPoint3:parseInt(this.state.KirinukiDes7["viewCount"],10) + parseInt(this.state.KirinukiDes7["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes7["subscriberCount"],10)*1000,
          katoPoint4:parseInt(this.state.KirinukiDes8["viewCount"],10) + parseInt(this.state.KirinukiDes8["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes8["subscriberCount"],10)*1000,
  
        }));
        // 戦闘力で決定)
      // 1の勝ち抜け
      if(this.state.katoPoint1 > this.state.katoPoint2 &&　this.state.katoPoint1 > this.state.katoPoint3 && this.state.katoPoint1 > this.state.katoPoint4){
        try{return this.loseSynser(false,true,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 2の勝ち抜け
      if(this.state.katoPoint2 > this.state.katoPoint1 &&　this.state.katoPoint2 > this.state.katoPoint3 && this.state.katoPoint2 > this.state.katoPoint4){
        try{return this.loseSynser(true,false,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 3の勝ち抜け
      if(this.state.katoPoint3 > this.state.katoPoint1 &&　this.state.katoPoint3 > this.state.katoPoint2 && this.state.katoPoint3 > this.state.katoPoint4){
        try{return this.loseSynser(true,true,false,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 4の勝ち抜け
      if(this.state.katoPoint4 > this.state.katoPoint1 &&　this.state.katoPoint4 > this.state.katoPoint2 && this.state.katoPoint4 > this.state.katoPoint3){
        try{return this.loseSynser(true,true,true,false).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }

      console.log("tie");
      // 同着はスキップできないように。
      }
      else{
        console.log("not skiB");
        if(!this.state.endC){
          console.log("skipC");
          this.setState(state =>  ({

            groupC:true,

            katoPoint1:parseInt(this.state.KirinukiDes9["viewCount"],10) + parseInt(this.state.KirinukiDes9["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes9["subscriberCount"],10)*1000,
            katoPoint2:parseInt(this.state.KirinukiDes10["viewCount"],10) + parseInt(this.state.KirinukiDes10["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes10["subscriberCount"],10)*1000,
            katoPoint3:parseInt(this.state.KirinukiDes11["viewCount"],10) + parseInt(this.state.KirinukiDes11["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes11["subscriberCount"],10)*1000,
            katoPoint4:parseInt(this.state.KirinukiDes12["viewCount"],10) + parseInt(this.state.KirinukiDes12["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes12["subscriberCount"],10)*1000,
    
          }));
          // 戦闘力で決定)
      // 1の勝ち抜け
      if(this.state.katoPoint1 > this.state.katoPoint2 &&　this.state.katoPoint1 > this.state.katoPoint3 && this.state.katoPoint1 > this.state.katoPoint4){
        try{return this.loseSynser(false,true,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 2の勝ち抜け
      if(this.state.katoPoint2 > this.state.katoPoint1 &&　this.state.katoPoint2 > this.state.katoPoint3 && this.state.katoPoint2 > this.state.katoPoint4){
        try{return this.loseSynser(true,false,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 3の勝ち抜け
      if(this.state.katoPoint3 > this.state.katoPoint1 &&　this.state.katoPoint3 > this.state.katoPoint2 && this.state.katoPoint3 > this.state.katoPoint4){
        try{return this.loseSynser(true,true,false,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 4の勝ち抜け
      if(this.state.katoPoint4 > this.state.katoPoint1 &&　this.state.katoPoint4 > this.state.katoPoint2 && this.state.katoPoint4 > this.state.katoPoint3){
        try{return this.loseSynser(true,true,true,false).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }

      console.log("tie");
      // 同着はスキップできないように。
        }
        else{
          console.log("not skipC");
          if(!this.state.endD){
            console.log("skipD");
            this.setState(state =>  ({

              groupD:true,

              katoPoint1:parseInt(this.state.KirinukiDes13["viewCount"],10) + parseInt(this.state.KirinukiDes13["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes13["subscriberCount"],10)*1000,
              katoPoint2:parseInt(this.state.KirinukiDes14["viewCount"],10) + parseInt(this.state.KirinukiDes14["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes14["subscriberCount"],10)*1000,
              katoPoint3:parseInt(this.state.KirinukiDes15["viewCount"],10) + parseInt(this.state.KirinukiDes15["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes15["subscriberCount"],10)*1000,
              katoPoint4:parseInt(this.state.KirinukiDes16["viewCount"],10) + parseInt(this.state.KirinukiDes16["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes16["subscriberCount"],10)*1000,
      
            }));
            // 戦闘力で決定)
      // 1の勝ち抜け
      if(this.state.katoPoint1 > this.state.katoPoint2 &&　this.state.katoPoint1 > this.state.katoPoint3 && this.state.katoPoint1 > this.state.katoPoint4){
        try{return this.loseSynser(false,true,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 2の勝ち抜け
      if(this.state.katoPoint2 > this.state.katoPoint1 &&　this.state.katoPoint2 > this.state.katoPoint3 && this.state.katoPoint2 > this.state.katoPoint4){
        try{return this.loseSynser(true,false,true,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 3の勝ち抜け
      if(this.state.katoPoint3 > this.state.katoPoint1 &&　this.state.katoPoint3 > this.state.katoPoint2 && this.state.katoPoint3 > this.state.katoPoint4){
        try{return this.loseSynser(true,true,false,true).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }
      // 4の勝ち抜け
      if(this.state.katoPoint4 > this.state.katoPoint1 &&　this.state.katoPoint4 > this.state.katoPoint2 && this.state.katoPoint4 > this.state.katoPoint3){
        try{return this.loseSynser(true,true,true,false).then(()=>{});}
        catch(error){
          console.log("lose error");
        }
      }

      console.log("tie");
      // 同着はスキップできないように。
          }
          else{
            console.log("not skipD");
          }
        }
      }
    }
    console.log("skip finish");
  };

  setBattle = async(col1,col2) =>{
    try{
      console.log("stop");

    }
    catch(error){
      console.log("no stop");
    }
    if(this.state.battleFlag){
      return 0;
    }
    if(this.state.tableData[col1][col2]){
      return 0;
    }
    this.setState(state =>  ({
      p1:col1,
      p2:col2,
    }));

    switch(col1){
      case 1:
        this.setState(state =>  ({
          p1Name:this.state.tableR1_name,
          p1Image:this.state.tableR1,
          p1KatoPoint:this.state.katoPoint1,
        }));
      break;
      case 2:
        this.setState(state =>  ({
          p1Name:this.state.tableR2_name,
          p1Image:this.state.tableR2,
          p1KatoPoint:this.state.katoPoint2,
        }));
      break;
      case 3:
        this.setState(state =>  ({
          p1Name:this.state.tableR3_name,
          p1Image:this.state.tableR3,
          p1KatoPoint:this.state.katoPoint3,
        }));
      break;
      case 4:
        this.setState(state =>  ({
          p1Name:this.state.tableR4_name,
          p1Image:this.state.tableR4,
          p1KatoPoint:this.state.katoPoint4,
        }));
      break;
    }
    switch(col2){
      case 1:
        this.setState(state =>  ({
          p2Name:this.state.tableR1_name,
          p2Image:this.state.tableR1,
          p2KatoPoint:this.state.katoPoint1,
        }));
      break;
      case 2:
        this.setState(state =>  ({
          p2Name:this.state.tableR2_name,
          p2Image:this.state.tableR2,
          p2KatoPoint:this.state.katoPoint2,
        }));
      break;
      case 3:
        this.setState(state =>  ({
          p2Name:this.state.tableR3_name,
          p2Image:this.state.tableR3,
          p2KatoPoint:this.state.katoPoint3,
        }));
      break;
      case 4:
        this.setState(state =>  ({
          p2Name:this.state.tableR4_name,
          p2Image:this.state.tableR4,
          p2KatoPoint:this.state.katoPoint4,
        }));
      break;
    }
    
    this.start();
  };

  // 自動で技のピックアップ
  selectMove = (player) =>{
    switch(player){
      case "p1":
        var selectRand = Math.random();
        if(selectRand <0.11){
          return KatomonMoveList.rightStraight;
        }
        if(selectRand <0.22 && selectRand >= 0.11){
          return KatomonMoveList.gaia;
        }
        if(selectRand <0.33 && selectRand >= 0.22){
          return KatomonMoveList.escape;
        }
        if(selectRand <0.44 && selectRand >= 0.33){
          return KatomonMoveList.drill;
        }
        if(selectRand <0.55 && selectRand >= 0.44){
          return KatomonMoveList.mai;
        }
        if(selectRand <0.66 && selectRand >= 0.55){
          return KatomonMoveList.kisei;
        }
        if(selectRand <0.77 && selectRand >= 0.66){
          return KatomonMoveList.moko1;
        }
        if(selectRand <0.88 && selectRand >= 0.77){
          return KatomonMoveList.fuji;
        }
        if(selectRand <0.99 && selectRand >= 0.88){
          return KatomonMoveList.kussinn;
        }
        else{
          return KatomonMoveList.rightStraight;
        }
      case "p2":
        var selectRand = Math.random();
        if(selectRand <0.1){
          return KatoFesP2MoveList.ai;
        }
        if(selectRand <0.2 && selectRand >= 0.1){
          return KatoFesP2MoveList.ronpa;
        }
        if(selectRand <0.3 && selectRand >= 0.2){
          return KatoFesP2MoveList.zatudan;
        }
        if(selectRand <0.4 && selectRand >= 0.3){
          return KatoFesP2MoveList.asupara;
        }
        if(selectRand <0.5 && selectRand >= 0.4){
          return KatoFesP2MoveList.craver;
        }
        if(selectRand <0.6 && selectRand >= 0.5){
          return KatoFesP2MoveList.poisson;
        }
        if(selectRand <0.7 && selectRand >= 0.6){
          return KatoFesP2MoveList.mai;
        }
        if(selectRand <0.8 && selectRand >= 0.7){
          return KatoFesP2MoveList.kick;
        }
        if(selectRand <0.9 && selectRand >= 0.8){
          return KatoFesP2MoveList.isogashi;
        }
        else{
          return KatoFesP2MoveList.watch;
        }
    }
  };

  // 戦闘関係
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
        this.setState(state =>  ({p1HP : this.state.p1HP + change/2 }));
        break;

      case "p2HP":
        this.setState(state =>  ({p2HP : this.state.p2HP + change/2 }));
        break;
      
      case "p1Poisson":
        this.setState(state =>  ({p1PoissonFlag : true}));
        break;

      case "p2Poisson":
        this.setState(state =>  ({p2PoissonFlag : true}));
        break;

        case "p1ATK":
          console.log("p1katopoint:",this.state.p1KatoPoint);
          this.setState(state =>  ({p1KatoPoint:this.state.p1KatoPoint * 1.5 + change*1000*100}));
        break;
        case "p2ATK":
          console.log("p2katopoint:",this.state.p2KatoPoint);
          this.setState(state =>  ({p2KatoPoint:this.state.p2KatoPoint * 1.5  + change*1000*100}));
        break;
        case "p1DEF":
          console.log("p1katopoint:",this.state.p1KatoPoint);
          this.setState(state =>  ({p1KatoPoint:this.state.p1KatoPoint * 1.5  + change*1000*100}));
        break;
        case "p2DEF":
          console.log("p2katopoint:",this.state.p2KatoPoint);
          this.setState(state =>  ({p2KatoPoint:this.state.p2KatoPoint * 1.5  + change*1000*100}));
        break;
    }
  };

  // p1技発動
  p1move = async(select) =>{
    
    switch(select){
      case "1":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p1Guts >= this.state.p1MOVE_1.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p1MOVE_1.range){
          // 相手のHP減少
          this.setState(state =>  ({p2HP : this.state.p2HP - this.state.p1MOVE_1.power * this.state.p1KatoPoint/(this.state.p2KatoPoint+10) * Math.random()* Math.random()*3}));
          // Guts消費
          this.setState(state =>  ({p1Guts : this.state.p1Guts - this.state.p1MOVE_1.consumption_Guts + this.state.p1MOVE_1.add_Guts}));
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
          this.setState(state =>  ({p2HP : this.state.p2HP - this.state.p1MOVE_2.power * this.state.p1KatoPoint/(this.state.p2KatoPoint+10)* Math.random() * Math.random()*3}));
          // Guts消費
          this.setState(state =>  ({p1Guts : this.state.p1Guts - this.state.p1MOVE_2.consumption_Guts + this.state.p1MOVE_2.add_Guts}));
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
    }
  };

  // p2技発動
  p2move = async(select) =>{
    switch(select){
      case "1":
        // 消費ガッツ判定　＆　レンジ範囲内か判定
        if(this.state.p2Guts >= this.state.p2MOVE_1.consumption_Guts && this.state.position2X - this.state.position1X < this.state.p2MOVE_1.range){
          // 相手のHP減少
          this.setState(state =>  ({p1HP : this.state.p1HP - this.state.p2MOVE_1.power * this.state.p2KatoPoint/(this.state.p1KatoPoint+10)* Math.random() * Math.random()*2}));
          // Guts消費
          this.setState(state =>  ({p2Guts : this.state.p2Guts - this.state.p2MOVE_1.consumption_Guts + this.state.p2MOVE_1.add_Guts}));
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
          this.setState(state =>  ({p1HP : this.state.p1HP - this.state.p2MOVE_2.power * this.state.p2KatoPoint/(this.state.p1KatoPoint+10)* Math.random() * Math.random()*2}));
          // Guts消費
          this.setState(state =>  ({p2Guts : this.state.p2Guts - this.state.p2MOVE_2.consumption_Guts + this.state.p2MOVE_2.add_Guts}));
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
  };



  // 戦闘システム全体
  system = () =>{
    // 繰り返し処理設定
    this.intervalId = setInterval(()=>{
      this.setState({
        now: Date.now(),
        timer: this.state.timeMax + this.state.startTime / 1000 - this.state.now / 1000 
      });

      var p1Rand = Math.random();
      var p2Rand = Math.random();

      // this.state.p1Guts = this.state.p1Guts + 10;
      // this.state.p2Guts = this.state.p2Guts + 10;

      this.setState(state =>  ({
        p1Guts:this.state.p1Guts + 12,
        p2Guts:this.state.p2Guts + 12,
      })); 

      if(this.state.p1PoissonFlag){
        this.setState(state =>  ({
          p1HP:this.state.p1HP - 25,
        })); 
      }

      if(this.state.p2PoissonFlag){
        this.setState(state =>  ({
          p2HP:this.state.p2HP - 25,
        })); 
      }

      // player1の移動ロジック
      if(p1Rand > 0.4){
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
      if(p2Rand > 0.4){
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
  };

  getResult =async()=>{

    if(this.state.tableData[1][2]=="←勝"){

      this.state.tableData[1][2]=1;
      this.state.tableData[2][1]=0;
    }
    else{

      this.state.tableData[1][2]=0;
      this.state.tableData[2][1]=1;
    }
    if(this.state.tableData[1][3]=="←勝"){
 
      this.state.tableData[1][3]=1;
      this.state.tableData[3][1]=0;
    }
    else{
 
      this.state.tableData[1][3]=0;
      this.state.tableData[3][1]=1;
    }
    if(this.state.tableData[1][4]=="←勝"){
   
      this.state.tableData[1][4]=1;
      this.state.tableData[4][1]=0;
    }
    else{
  
      this.state.tableData[1][4]=0;
      this.state.tableData[4][1]=1;
    }
    if(this.state.tableData[2][3]=="←勝"){
   
      this.state.tableData[2][3]=1;
      this.state.tableData[3][2]=0;
    }
    else{
      
      this.state.tableData[2][3]=0;
      this.state.tableData[3][2]=1;
    }
    if(this.state.tableData[2][4]=="←勝"){
     
      this.state.tableData[2][4]=1;
      this.state.tableData[4][2]=0;
    }
    else{
     
      this.state.tableData[2][4]=0;
      this.state.tableData[4][2]=1;
    }
    if(this.state.tableData[3][4]=="←勝"){
     
      this.state.tableData[3][4]=1;
      this.state.tableData[4][3]=0;
    }
    else{
     
      this.state.tableData[3][4]=0;
      this.state.tableData[4][3]=1;
    }
  };

  setResult =async()=>{
    this.setState(state =>  ({
      table1Count:this.state.tableData[1][2]+ this.state.tableData[1][3] + this.state.tableData[1][4],
      table2Count:this.state.tableData[2][1]+ this.state.tableData[2][3] + this.state.tableData[2][4],
      table3Count:this.state.tableData[3][1]+ this.state.tableData[3][2] + this.state.tableData[3][4],
      table4Count:this.state.tableData[4][1]+ this.state.tableData[4][2] + this.state.tableData[4][3],
    }));
  };

  // 対戦一巡チェック
  checkTable = () =>{
    // チェック
    if(!this.state.tableData[1][2]){
      return 0;
    }
    if(!this.state.tableData[1][3]){
      return 0;
    }
    if(!this.state.tableData[1][4]){
      return 0;
    }
    if(!this.state.tableData[2][3]){
      return 0;
    }
    if(!this.state.tableData[2][4]){
      return 0;
    }
    if(!this.state.tableData[3][4]){
      return 0;
    }
    
    // 終わっていたら
    this.getResult().then(()=>{
      this.setResult().then(()=>{
            // 1の勝ち抜け
        if(this.state.table1Count > this.state.table2Count &&　this.state.table1Count > this.state.table3Count && this.state.table1Count > this.state.table4Count){
          this.loseSynser(false,true,true,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 2の勝ち抜け
        if(this.state.table2Count > this.state.table1Count &&　this.state.table2Count > this.state.table3Count && this.state.table2Count > this.state.table4Count){
          this.loseSynser(true,false,true,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 3の勝ち抜け
        if(this.state.table3Count > this.state.table1Count &&　this.state.table3Count > this.state.table2Count && this.state.table3Count > this.state.table4Count){
          this.loseSynser(true,true,false,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 4の勝ち抜け
        if(this.state.table4Count > this.state.table1Count &&　this.state.table4Count > this.state.table2Count && this.state.table4Count > this.state.table3Count){
          this.loseSynser(true,true,true,false).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
    
        // 同着がある場合(戦闘力*勝敗で決定)
        // 1の勝ち抜け
        if(this.state.table1Count * this.state.katoPoint1 > this.state.table2Count * this.state.katoPoint2 &&　this.state.table1Count * this.state.katoPoint1 > this.state.table3Count * this.state.katoPoint3 && this.state.table1Count * this.state.katoPoint1 > this.state.table4Count * this.state.katoPoint4){
          this.loseSynser(false,true,true,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 2の勝ち抜け
        if(this.state.table2Count * this.state.katoPoint2 > this.state.table1Count * this.state.katoPoint1 &&　this.state.table2Count * this.state.katoPoint2 > this.state.table3Count * this.state.katoPoint3 && this.state.table2Count * this.state.katoPoint2 > this.state.table4Count * this.state.katoPoint4){
          this.loseSynser(true,false,true,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 3の勝ち抜け
        if(this.state.table3Count * this.state.katoPoint3 > this.state.table1Count * this.state.katoPoint1 &&　this.state.table3Count * this.state.katoPoint3 > this.state.table2Count * this.state.katoPoint2 && this.state.table3Count * this.state.katoPoint3 > this.state.table4Count * this.state.katoPoint4){
          this.loseSynser(true,true,false,true).then(()=>{
            if(!this.state.final){
              this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
            }
          });
        }
        // 4の勝ち抜け
        if(this.state.table4Count * this.state.katoPoint4 > this.state.table1Count * this.state.katoPoint1 &&　this.state.table4Count * this.state.katoPoint4 > this.state.table2Count * this.state.katoPoint2 && this.state.table4Count * this.state.katoPoint4 > this.state.table3Count * this.state.katoPoint3){
        this.loseSynser(true,true,true,false).then(()=>{
          if(!this.state.final){
            this.soundStart(this.state.soundPreload.bgm.title,Sounds.bgm1,0.03);
          }
        });
        }
      }).catch((error) => {console.log("setResult error")});
    }).catch((error) => {console.log("getResult error")});
    
  };

  loseSynser = async(r1,r2,r3,r4) =>{
    if(this.state.groupA){
      console.log("A finished");
      this.setState(state =>  ({
        Kirinuki1_lose:r1,
        Kirinuki2_lose:r2,
        Kirinuki3_lose:r3,
        Kirinuki4_lose:r4,

        memberListFlag:true,
        endA:true,
        groupA:false,
      }));
    }
    if(this.state.groupB){
      console.log("B finished");
      this.setState(state =>  ({
        Kirinuki5_lose:r1,
        Kirinuki6_lose:r2,
        Kirinuki7_lose:r3,
        Kirinuki8_lose:r4,

        memberListFlag:true,
        endB:true,
        groupB:false,
      }));
    
    }
    if(this.state.groupC){
      console.log("C finished");
      this.setState(state =>  ({
        Kirinuki9_lose:r1,
        Kirinuki10_lose:r2,
        Kirinuki11_lose:r3,
        Kirinuki12_lose:r4,

        memberListFlag:true,
        endC:true,
        groupC:false,
      }));
    }
    if(this.state.groupD){
      console.log("D finished");
      this.setState(state =>  ({
        Kirinuki13_lose:r1,
        Kirinuki14_lose:r2,
        Kirinuki15_lose:r3,
        Kirinuki16_lose:r4,

        memberListFlag:true,
        endD:true,
        groupD:false,
      }));   
    }
    if(this.state.final){
      if(!r1){
        this.setState(state =>  ({
          champ_image:this.state.tableR1,
          champ_name:this.state.tableR1_name,
          champ_st:this.state.tableR1_st,
          champ_katoPoint:this.state.katoPoint1,
        }));
      }
      if(!r2){
        this.setState(state =>  ({
          champ_image:this.state.tableR2,
          champ_name:this.state.tableR2_name,
          champ_st:this.state.tableR2_st,
          champ_katoPoint:this.state.katoPoint2
        }));
      }
      if(!r3){
        this.setState(state =>  ({
          champ_image:this.state.tableR3,
          champ_name:this.state.tableR3_name,
          champ_st:this.state.tableR3_st,
          champ_katoPoint:this.state.katoPoint3
        }));
      }
      if(!r4){
        this.setState(state =>  ({
          champ_image:this.state.tableR4,
          champ_name:this.state.tableR4_name,
          champ_st:this.state.tableR4_st,
          champ_katoPoint:this.state.katoPoint4
        }));
      }

      this.setState(state =>  ({
        resultFlag:true,
      }));
      playEffectSound( Sounds.next1,1);
      console.log("next sound finished");
    }
    this.setState(state =>  ({
      tableData:{
        1:{
          2:null,
          3:null,
          4:null,
        },
        2:{
          1:null,
          3:null,
          4:null,
        },
        3:{
          2:null,
          1:null,
          4:null,
        },
        4:{
          2:null,
          3:null,
          1:null,
        }
      },
      p1Image:Images.item4,
      p2Image:Images.item4,
      p1Name:null,
      p2Name:null,

      p1HP:0,
      p2HP:0,

      p1KatoPoint:0,
      p2KatoPoint:0,
      
      Timer:this.state.timeMax,
    }));
  };

  setFinal =async()=>{
    // groupA
    if(!this.state.Kirinuki1_lose){
      this.setState(state =>  ({
        tableR1_final:this.state.KirinukiImage1,
        tableR1_name_final:this.state.KirinukiData1,
        tableR1_st_final:this.state.KirinukiDes1,
        katoPoint1_final:parseInt(this.state.KirinukiDes1["viewCount"],10) + parseInt(this.state.KirinukiDes1["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes1["subscriberCount"],10)*1000,
      }));
    }else{
      if(!this.state.Kirinuki2_lose){
        this.setState(state =>  ({
          tableR1_final:this.state.KirinukiImage2,
          tableR1_name_final:this.state.KirinukiData2,
          tableR1_st_final:this.state.KirinukiDes2,
          katoPoint1_final:parseInt(this.state.KirinukiDes2["viewCount"],10) + parseInt(this.state.KirinukiDes2["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes2["subscriberCount"],10)*1000,
        }));
      }else{
        if(!this.state.Kirinuki3_lose){
          this.setState(state =>  ({
            tableR1_final:this.state.KirinukiImage3,
            tableR1_name_final:this.state.KirinukiData3,
            tableR1_st_final:this.state.KirinukiDes3,
            katoPoint1_final:parseInt(this.state.KirinukiDes3["viewCount"],10) + parseInt(this.state.KirinukiDes3["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes3["subscriberCount"],10)*1000,
          }));
        }else{
          if(!this.state.Kirinuki4_lose){
            this.setState(state =>  ({
              tableR1_final:this.state.KirinukiImage4,
              tableR1_name_final:this.state.KirinukiData4,
              tableR1_st_final:this.state.KirinukiDes4,
              katoPoint1_final:parseInt(this.state.KirinukiDes4["viewCount"],10) + parseInt(this.state.KirinukiDes4["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes4["subscriberCount"],10)*1000,
            }));
          }
        }
      }
    }
    // groupB
    if(!this.state.Kirinuki5_lose){
      this.setState(state =>  ({
        tableR2_final:this.state.KirinukiImage5,
        tableR2_name_final:this.state.KirinukiData5,
        tableR2_st_final:this.state.KirinukiDes5,
        katoPoint2_final:parseInt(this.state.KirinukiDes5["viewCount"],10) + parseInt(this.state.KirinukiDes5["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes5["subscriberCount"],10)*1000,
      }));
    }else{
      if(!this.state.Kirinuki6_lose){
        this.setState(state =>  ({
          tableR2_final:this.state.KirinukiImage6,
          tableR2_name_final:this.state.KirinukiData6,
          tableR2_st_final:this.state.KirinukiDes6,
          katoPoint2_final:parseInt(this.state.KirinukiDes6["viewCount"],10) + parseInt(this.state.KirinukiDes6["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes6["subscriberCount"],10)*1000,
        }));
      }else{
        if(!this.state.Kirinuki7_lose){
          this.setState(state =>  ({
            tableR2_final:this.state.KirinukiImage7,
            tableR2_name_final:this.state.KirinukiData7,
            tableR2_st_final:this.state.KirinukiDes7,
            katoPoint2_final:parseInt(this.state.KirinukiDes7["viewCount"],10) + parseInt(this.state.KirinukiDes7["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes7["subscriberCount"],10)*1000,
          }));
        }else{
          if(!this.state.Kirinuki8_lose){
            this.setState(state =>  ({
              tableR2_final:this.state.KirinukiImage8,
              tableR2_name_final:this.state.KirinukiData8,
              tableR2_st_final:this.state.KirinukiDes8,
              katoPoint2_final:parseInt(this.state.KirinukiDes8["viewCount"],10) + parseInt(this.state.KirinukiDes8["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes8["subscriberCount"],10)*1000,
            }));
          }
        }
      }
    }

    // groupC
    if(!this.state.Kirinuki9_lose){
      this.setState(state =>  ({
        tableR3_final:this.state.KirinukiImage9,
        tableR3_name_final:this.state.KirinukiData9,
        tableR3_st_final:this.state.KirinukiDes9,
        katoPoint3_final:parseInt(this.state.KirinukiDes9["viewCount"],10) + parseInt(this.state.KirinukiDes9["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes9["subscriberCount"],10)*1000,
      }));
    }else{
      if(!this.state.Kirinuki10_lose){
        this.setState(state =>  ({
          tableR3_final:this.state.KirinukiImage10,
          tableR3_name_final:this.state.KirinukiData10,
          tableR3_st_final:this.state.KirinukiDes10,
          katoPoint3_final:parseInt(this.state.KirinukiDes10["viewCount"],10) + parseInt(this.state.KirinukiDes10["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes10["subscriberCount"],10)*1000,
        }));
      }else{
        if(!this.state.Kirinuki11_lose){
          this.setState(state =>  ({
            tableR3_final:this.state.KirinukiImage11,
            tableR3_name_final:this.state.KirinukiData11,
            tableR3_st_final:this.state.KirinukiDes11,
            katoPoint3_final:parseInt(this.state.KirinukiDes11["viewCount"],10) + parseInt(this.state.KirinukiDes11["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes11["subscriberCount"],10)*1000,
          }));
        }else{
          if(!this.state.Kirinuki12_lose){
            this.setState(state =>  ({
              tableR3_final:this.state.KirinukiImage12,
              tableR3_name_final:this.state.KirinukiData12,
              tableR3_st_final:this.state.KirinukiDes12,
              katoPoint3_final:parseInt(this.state.KirinukiDes12["viewCount"],10) + parseInt(this.state.KirinukiDes12["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes12["subscriberCount"],10)*1000,
            }));
          }
        }
      }
    }

    // groupD
    if(!this.state.Kirinuki13_lose){
      this.setState(state =>  ({
        tableR4_final:this.state.KirinukiImage13,
        tableR4_name_final:this.state.KirinukiData13,
        tableR4_st_final:this.state.KirinukiDes13,
        katoPoint4_final:parseInt(this.state.KirinukiDes13["viewCount"],10) + parseInt(this.state.KirinukiDes13["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes13["subscriberCount"],10)*1000,
      }));
    }else{
      if(!this.state.Kirinuki14_lose){
        this.setState(state =>  ({
          tableR4_final:this.state.KirinukiImage14,
          tableR4_name_final:this.state.KirinukiData14,
          tableR4_st_final:this.state.KirinukiDes14,
          katoPoint4_final:parseInt(this.state.KirinukiDes14["viewCount"],10) + parseInt(this.state.KirinukiDes14["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes14["subscriberCount"],10)*1000,
        }));
      }else{
        if(!this.state.Kirinuki15_lose){
          this.setState(state =>  ({
            tableR4_final:this.state.KirinukiImage15,
            tableR4_name_final:this.state.KirinukiData15,
            tableR4_st_final:this.state.KirinukiDes15,
            katoPoint4_final:parseInt(this.state.KirinukiDes15["viewCount"] ,10)+ parseInt(this.state.KirinukiDes15["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes15["subscriberCount"],10)*1000,
          }));
        }else{
          if(!this.state.Kirinuki16_lose){
            this.setState(state =>  ({
              tableR4_final:this.state.KirinukiImage16,
              tableR4_name_final:this.state.KirinukiData16,
              tableR4_st_final:this.state.KirinukiDes16,
              katoPoint4_final:parseInt(this.state.KirinukiDes16["viewCount"],10) + parseInt(this.state.KirinukiDes16["videoCount"],10)*1000*100+parseInt(this.state.KirinukiDes16["subscriberCount"],10)*1000,
            }));
          }
        }
      }
    }
  };

  // 再戦
  start = async() =>{
    this.stopBgm(this.state.soundPreload.bgm.title);

    // 決勝戦ではBGMを変更
    if(!this.state.final){
      this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle1,0.03);
      console.log("normal");
    }
    else{
      this.soundStart(this.state.soundPreload.bgm.battle1,Sounds.battle6,0.05);
      console.log("final");
    }

    // バトル中のボタン停止
    this.setState(state =>  ({battleFlag:true}));

    //ゲーム再スタートのための初期化
    this.setState({
      running:true,
      now: Date.now(),
      startTime: Date.now(),

      position1X: 0,
      position2X: Constants.MAX_WIDTH - 90-20,

      timer:this.state.timeMax,

      p1HP:1000,
      p2HP:1000,

      p1PoissonFlag:false,
      p2PoissonFlag:false,

      p1Guts:0,
      p2Guts:0,

      // ここで技をランダムに持ってくるようにする
      p1MOVE_1:this.selectMove("p1"),
      p1MOVE_2:this.selectMove("p1"),
      p2MOVE_1:this.selectMove("p2"),
      p2MOVE_2:this.selectMove("p2"),

    });
    
    this.intervalId = this.system();

    return this.intervalId;
    
  };

  goto = async(destination) => {
    try {
    // destinationごとに音声を変えておく
      switch(destination){
        case "クレジット":
          return this.props.navigation.navigate(destination);
      }
    } 
    catch (error) {
      console.log('error...');
    }
  };

  render(){
    if(this.state.battleFlag){
      // 対戦の終了判定
      if(Math.round(
        this.state.timer) <= 0){
          clearInterval(this.intervalId);
          this.stopBgm(this.state.soundPreload.bgm.battle1);
          this.state.battleFlag=false;
          if(this.state.p1HP < this.state.p2HP){
            // p1負け
            this.state.tableData[this.state.p2][this.state.p1]="←勝";
            this.state.tableData[this.state.p1][this.state.p2]="←負";
            this.checkTable();
          }
          else{
            if(this.state.p1HP > this.state.p2HP){
              // p2負け
              this.state.tableData[this.state.p2][this.state.p1]="←負";
              this.state.tableData[this.state.p1][this.state.p2]="←勝";
              this.checkTable();
            }
            //引き分け

            // this.start();
          }
          console.log(this.state.tableData);
          // this.state.timer = 55;
        }
        if(this.state.p1HP <= 0){
            // p1負け
            clearInterval(this.intervalId);
            this.stopBgm(this.state.soundPreload.bgm.battle1);
            this.state.battleFlag=false;
            this.state.tableData[this.state.p2][this.state.p1]="←勝";
            this.state.tableData[this.state.p1][this.state.p2]="←負";
            this.checkTable();
            // this.state.timer = 55;
          }
        if(this.state.p2HP <= 0){
          // p2負け
          clearInterval(this.intervalId);
          this.stopBgm(this.state.soundPreload.bgm.battle1);
          this.state.battleFlag=false;
          this.state.tableData[this.state.p2][this.state.p1]="←負";
          this.state.tableData[this.state.p1][this.state.p2]="←勝";
          this.checkTable();
          // this.state.timer = 55;
         }
    }

    return(
      <SafeAreaView style = {styles.fullScreen}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
        {this.state.memberListFlag && !this.state.resultFlag && (
          <View>
            {/* コメントの表示切り替え */}
            {!this.state.groupA && !this.state.groupB && !this.state.groupC && !this.state.groupD && (
              <View style={{flex: 0.2,marginTop:"5%",marginBottom:"5%" }}>
                {this.state.running && (
                  <View>
                    {this.state.apiSuccess &&(
                      <Text style = {styles.hello}>さて、今回エントリーの16チャンネルは...</Text>
                    )}
                  </View>        
                )}
              </View>
            )}
            <View style={{flex: 3,paddingBottom:"1%",paddingTop:"1%",backgroundColor:"#eee"}}>
              <ScrollView style = {styles.kirinuki}>
                <View style={{fontSize:24,backgroundColor:"#ffffe0"}}>
                  <Text style={{textAlign:"center"}}>
                    予選A
                  </Text>
                  {!this.state.Kirinuki1_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage1}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text style={styles.hello}>{this.state.KirinukiData1}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes1["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes1["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes1["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki2_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage2}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text style={styles.hello}>{this.state.KirinukiData2}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes2["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes2["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes2["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki3_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage3}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text style={styles.hello}>{this.state.KirinukiData3}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes3["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes3["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes3["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki4_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage4}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData4}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes4["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes4["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes4["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                </View>
                <View style={{fontSize:24,backgroundColor:"#e0ffff"}}>
                  <Text style={{textAlign:"center"}}>
                    予選B
                  </Text>
                  {!this.state.Kirinuki5_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage5}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData5}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes5["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes5["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes5["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki6_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage6}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData6}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes6["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes6["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes6["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki7_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage7}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData7}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes7["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes7["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes7["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki8_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage8}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData8}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes8["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes8["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes8["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                </View>
                <View style={{fontSize:24,backgroundColor:"#ffe4b5"}}>
                  <Text style={{textAlign:"center"}}>
                    予選C
                  </Text>
                  {!this.state.Kirinuki9_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage9}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData9}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes9["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes9["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes9["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki10_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage10}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData10}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes10["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes10["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes10["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki11_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage11}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData11}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes11["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes11["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes11["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki12_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage12}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData12}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes12["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes12["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes12["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                </View>
                <View style={{fontSize:24,backgroundColor:"#98fb98"}}>
                  <Text style={{textAlign:"center"}}>
                    予選D
                  </Text>
                  {!this.state.Kirinuki13_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage13}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData13}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes13["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes13["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes13["videoCount"]}本</Text>
                      </View>
                    </View>        
                  )}
                  {!this.state.Kirinuki14_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage14}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData14}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes14["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes14["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes14["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki15_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage15}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData15}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes15["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes15["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes15["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                  {!this.state.Kirinuki16_lose && (
                    <View style ={styles.channels}>
                      <Image style ={styles.image}
                        source={{ uri: `${this.state.KirinukiImage16}` }}
                        style={{ width: 90, height: 90 }}
                      />
                      <View>
                        <Text  style={styles.hello}>{this.state.KirinukiData16}</Text>
                        <Text style={styles.description}>総視聴数：{this.state.KirinukiDes16["viewCount"]}回</Text>
                        <Text style={styles.description}>登録者数：{this.state.KirinukiDes16["subscriberCount"]}人</Text>
                        <Text style={styles.description}>投稿本数：{this.state.KirinukiDes16["videoCount"]}本</Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* groupA_on */}
            {this.state.memberListFlag && (
              <View style={{flex:1,alignItems:"center",marginTop:"3%"}}>
                <View style={{alignItems:"center",flexDirection:"row"}}>
                  {!this.state.endA && (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.changeScene("A")}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',
                    }}>
                        Aの対戦を見守る
                      </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.endA && !(this.state.endA && this.state.endB && this.state.endC && this.state.endD) &&  (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.skipGroup()}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                      1つスキップ(2回Tap)
                      </Text>
                    </TouchableOpacity>
                  )}
                  {!this.state.endB && (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.changeScene("B")}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                        Bの対戦を見守る
                      </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.endB && !(this.state.endA && this.state.endB && this.state.endC && this.state.endD) &&  (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.skipGroup()}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                      1つスキップ(2回Tap)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{alignItems:"center",flexDirection:"row"}}>
                  {!this.state.endC && (
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => 
                      this.changeScene("C")}
                    >
                    <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                      Cの対戦を見守る
                    </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.endC && !(this.state.endA && this.state.endB && this.state.endC && this.state.endD) &&  (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.skipGroup()}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                      1つスキップ(2回Tap)
                      </Text>
                    </TouchableOpacity>
                  )}
                  {!this.state.endD && (
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => 
                      this.changeScene("D")}
                    >
                    <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                      Dの対戦を見守る
                    </Text>
                    </TouchableOpacity>
                  )}
                  {this.state.endD && !(this.state.endA && this.state.endB && this.state.endC && this.state.endD) &&  (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.skipGroup()}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                        1つスキップ(2回Tap)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{alignItems:"center",flexDirection:"row"}}>
                  {this.state.endA && this.state.endB && this.state.endC && this.state.endD && (
                    <TouchableOpacity 
                      style={styles.button}
                      onPress={() => 
                        this.changeScene("final")}
                    >
                      <Text style={{textAlign:"center",fontSize: 14,fontWeight: 'bold',}}>
                        決勝戦へ
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {!this.state.apiSuccess && this.state.firstFlag &&(
          <TouchableOpacity 
            style={styles.fullScreenButton}
            onPress={() =>this.changeAPI()}
          >
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>
                再読み込み ☜
              </Text>
                <Text style={styles.gameOverSubText}>
                  何度か押しても変わらない場合は、APIの制限の可能性があります。カトフェスをプレイいただくか、しばらくお待ちください。
                </Text>
            </View>
          </TouchableOpacity>
        )}
        
        {/* groupAの画面 */}
        {/* 対戦表→バトルフィールド */}
        {!this.state.memberListFlag && !this.state.resultFlag  && (
          <View 
            style={{
              flex:1,
              width:Constants.MAX_WIDTH}}
          >
            {/* フィールド */}
            <View >
              <Image
                style={{ 
                  backgroundColor:'#eee',
                  width:this.state.width,
                  height:this.state.height,
                  // alignItems:"center",
                  // position:"absolute",
                  resizeMode:"cover",
                }}
                source={Images.pizaField}
              />
              <View style = {{
                flexDirection: 'row',
                position: 'absolute',
                top:Constants.MAX_WIDTH * 250/400/10,
                width:Constants.MAX_WIDTH,
                height:60,
                textAlign:'center',
                justifyContent:"center",
                // backgroundColor: "red",
              }}>
                <Text style = {styles.name_r}>
                  {this.state.p1Name}
                </Text>
                <Text style = {{
                textAlign:'center',
                padding:"2%",
                fontSize: 24,
                fontWeight: 'bold',
                backgroundColor:"#fff",

                }}>
                  {Math.round(this.state.timer)}
                </Text>
                <Text style = {styles.name_l}>
                  {this.state.p2Name}
                </Text>
              </View>
              {/* HPバー */}
              <View style = {{
                flexDirection: 'row',
                position: 'absolute',
                top:Constants.MAX_WIDTH * 250/400/10+60,
                width:Math.round(Constants.MAX_WIDTH/2*this.state.p1HP/1000),
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
                top:Constants.MAX_WIDTH * 250/400/10+60,
                width:Math.round(Constants.MAX_WIDTH/2*this.state.p2HP/1000),
                height:10,
                textAlign:'center',
                justifyContent:"center",
                backgroundColor: "blue",
                right:0,
              }}>
              </View>
              {/* Player1 */}
              <Image
                source={{ uri: `${this.state.p1Image}` }}
                style={{ width: this.state.height/3, height: this.state.height/3 ,top:this.state.position1Y, left: this.state.position1X, position:'absolute',
                // backgroundColor:"#cd853f",
                resizeMode:"contain",
                borderRadius:10,}}
              /> 
              {/* <Text style={{ width:Math.round(this.state.p1HP/1000 *100),height: 15,top:this.state.position1Y-20, left: this.state.position1X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p1HP)}</Text>  
              <Text style={{ width:100,height: 15,top:this.state.position1Y-40, left: this.state.position1X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p1HP/1000 *100)}%</Text>   */}
              

              {/* Player2 */}
              <Image
                source={{ uri: `${this.state.p2Image}` }}
                style={{ width: this.state.height/3, height: this.state.height/3 ,top:this.state.position2Y, left: this.state.position2X, position:'absolute',
                // backgroundColor:"#cd853f",
                borderRadius:10}}
              />
              {/* <Text style={{ width:Math.round(this.state.p2HP/1000*100), height: 15 ,top:this.state.position2Y-20, left: this.state.position2X, position:'absolute',backgroundColor:"#ff6347",textAlign:"center",borderRadius:10}}>HP:{Math.round(this.state.p2HP)}</Text> 

              <Text style={{ width:100, height: 15 ,top:this.state.position2Y-40, left: this.state.position2X, position:'absolute',textAlign:"center",borderRadius:10}}>{Math.round(this.state.p2HP/1000*100)}%</Text>   */}


              <Text style={{ width:this.state.width/2,height: 30,top:Constants.MAX_WIDTH * 250/400 - 35, left: 0, position:'absolute',backgroundColor:"#eee",textAlign:"center",borderRadius:10,fontSize:20}}>戦闘力:{Math.round(this.state.p1KatoPoint/1000)}</Text>  
              <Text style={{ width:this.state.width/2,height: 30,top:Constants.MAX_WIDTH * 250/400 - 35, right:0, position:'absolute',backgroundColor:"#eee",textAlign:"center",borderRadius:10,fontSize:20}}>戦闘力:{Math.round(this.state.p2KatoPoint/1000)}</Text>  
            </View>
            {/* 対戦表 */}
            <View style={{flex:1,position:"absolute",bottom:0}}>
              <View style={styles.tableRow}>
                <View 
                  style={{ width: this.state.width/5, height: Constants.TITLE_WIDTH/5,
                  backgroundColor:"#000000",borderColor:"#000000",justifyContent:"center"}}
                >
                  <Text style={{color:"#eee",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>
                    {this.state.groupA && ("A予")}
                    {this.state.groupB && ("B予")}
                    {this.state.groupC && ("C予")}
                    {this.state.groupD && ("D予")}
                    {this.state.final && ("決勝")}
                  </Text>
                </View>
                <Image 
                  style ={styles.image}
                  source={{ uri: `${this.state.tableR1}` }}
                  style={{ width: this.state.width/5, height: this.state.width/5 }}
                />
                <Image 
                  style ={styles.image}
                  source={{ uri: `${this.state.tableR2}` }}
                  style={{ width: this.state.width/5, height: this.state.width/5 }}
                />
                <Image 
                  style ={styles.image}
                  source={{ uri: `${this.state.tableR3}` }}
                  style={{ width: this.state.width/5, height: this.state.width/5 }}
                />
                <Image 
                  style ={styles.image}
                  source={{ uri: `${this.state.tableR4}` }}
                  style={{ width: this.state.width/5, height: this.state.width/5 }}
                />
              </View>
              <View style={styles.tableRow}>
                <Image 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5  }}
                  source={{ uri: `${this.state.tableR1}` }}
                />
                <View 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5  ,
                  backgroundColor:"#000000",borderColor:"#000000", }}
                >
                </View>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40 )/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(1,2)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[1][2]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(1,3)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[1][3]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(1,4)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[1][4]}</Text></TouchableOpacity>
              </View>
              <View style={styles.tableRow}>
                <Image 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   }}
                  source={{ uri: `${this.state.tableR2}` }}
                />
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(2,1)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[2][1]}</Text></TouchableOpacity>
                <View 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5  ,
                    backgroundColor:"#000000"}}
                />
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(2,3)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[2][3]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(2,4)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[2][4]}</Text></TouchableOpacity>
              </View>
              <View style={styles.tableRow}>
                <Image 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   }}
                  source={{ uri: `${this.state.tableR3}` }}
                />
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(3,1)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[3][1]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(3,2)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[3][2]}</Text></TouchableOpacity>
                <View 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5  ,
                    backgroundColor:"#000000"}}
                />
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(3,4)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[3][4]}</Text></TouchableOpacity>
              </View>
              <View style={styles.tableRow}>
                <Image 
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   }}
                  source={{ uri: `${this.state.tableR4}` }}
                />
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(4,1)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[4][1]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(4,2)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[4][2]}</Text></TouchableOpacity>
                <TouchableOpacity
                  style={{ width: this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5   ,backgroundColor:"#deb887"}}
                  onPress={() => 
                    this.setBattle(4,3)}
                ><Text style={{color:"#000000",textAlign:"center",fontSize:Math.round(Constants.MAX_WIDTH/5/3),flex:1}}>{this.state.tableData[4][3]}</Text></TouchableOpacity>
                <View 
                  style={{ width:this.state.width/5, height: (Constants.TITLE_HEIGHT - this.state.height - this.state.width/5 -40)/5 ,
                    backgroundColor:"#000000"}}
                />
              </View>
            </View>
          </View>
        )}
        {this.state.resultFlag &&(
            <TouchableOpacity style={styles.fullScreenButton} onPress={() =>this.goto("クレジット")}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>切り抜きチャンピオンシップ、今回の優勝は...</Text>
              <View style={{
                // backgroundColor:"#eee",
                flexDirection: 'row',
                position: 'relative',
                marginLeft:"1%",
                marginRight:"1%",
                paddingBottom:"1%",
                paddingTop:"1%",
              }}>
                <Image
                    source={{ uri: `${this.state.champ_image}` }}
                    style={{ width: Constants.MAX_WIDTH/3, height: Constants.MAX_WIDTH/3 ,
                    flex:1,
                    resizeMode:"contain"}}
                />
                <View style={{flex:1,backgroundColor:"#ffffe0"}}>

                 <Text  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign:"center",
                  }}>{this.state.champ_name}</Text>
                  <Text style={
                    styles.description
                    }>総視聴数：{this.state.champ_st["viewCount"]}回</Text>
                  <Text style={
                    styles.description
                    }>登録者数：{this.state.champ_st["subscriberCount"]}人</Text>
                  <Text style={
                    styles.description
                    }>投稿本数：{this.state.champ_st["videoCount"]}本</Text>
                  <Text style={
                    styles.description
                    }>切り抜き戦闘力：{Math.round(this.state.champ_katoPoint/1000)}
                    </Text><Text style={
                    styles.description
                    }></Text>
                    <Text style={
                    styles.description
                    }>---タップしてクレジットへ---</Text>
                </View>
              </View> 
            </View>
          </TouchableOpacity>
        )}
        {this.state.expFlag &&(
          <TouchableOpacity 
            style={styles.fullScreenButton}
            onPress={()=>{this.setState(state =>  ({
              expFlag:false,
            }))}}
          >
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>
                対戦表をタップして、戦闘開始！！
              </Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:"center",
    // fontFamily: 'DotGothic16_400Regular',
    // position:"absolute",
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  gameOverText: {
    color: 'white',
    fontSize: 30,
    // fontFamily: '04b_19',
  },
  gameOverSubText: {
    color: 'white',
    fontSize: 24,
    // fontFamily: '04b_19',
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
  backgroundImage: {
    // width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
    resizeMode: "cover",
    position: 'absolute',
  },
  kirinuki:{
    position: 'relative',
    // margin:"1%"
  },
  image:{
    position: 'relative',
    top: "3%",
    bottom: "1%"
  },
  channels:{
    flexDirection: 'row',
    position: 'relative',
    marginLeft:"1%",
    marginRight:"1%",
    paddingBottom:"1%",
    paddingTop:"1%",
  },
  description:{
    fontSize: 14, 
    top:"10%",
  },
  button:{
    position: 'relative',
    marginTop: "1%",
    marginBottom: "1%",
    marginRight: "2%",
    marginLeft:"2%",
    paddingLeft:"7%",
    paddingRight:"7%",
    paddingTop:"3%",
    paddingBottom:"3%",
    borderRadius:50,
    backgroundColor: "#ffdead",
  },
  table:{
    // 
  },
  tableRow:{
    flexDirection: 'row', 
    backgroundColor:"#ffffe0",
    borderColor:"#000000",
    width: Constants.TITLE_WIDTH,
    textAlign:"center",
    justifyContent: 'center',
    paddingRight:"1%",
  },
  tableCol:{
    // 
  },
  tableData:{
    textAlign:"center",
    fontSize:18,
  },
  names:{
    flexDirection: 'row',
    position: 'relative',
    marginLeft:"5%",
    marginRight:"5%",
    paddingTop:"3%",
    paddingBottom:"3%",
    textAlign:'center',
    flex:1,
    // backgroundColor: "red",
  },
  name:{
    flexDirection: 'row',
    position: 'relative',
    marginLeft:"1%",
    marginRight:"1%",
    marginBottom:"1%",
    marginTop:"1%",
    textAlign:'center',
    height:60,
    justifyContent:"center",
    // backgroundColor: "red",
  },
  name_r:{
    fontSize: 20,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    flex:1,
    // backgroundColor:"blue",
    justifyContent: 'center',
    // paddingTop:"5%",
  },
  name_l:{
    fontSize: 20,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'center',
    flex:1,
    // backgroundColor:"red",
    justifyContent: 'center',
    // paddingTop:"5%",
  },
});
