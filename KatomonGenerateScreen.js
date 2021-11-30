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
  TextInput,
  Animated,
} from 'react-native';
import axios, { AxiosRequestConfig } from 'axios';
import { Audio } from 'expo-av';
import Images from './assets/Images';
import Constants from './Constants';
import Sounds from './assets/Sounds';
import KatomonList from './battle/KatomonList';
import KatomonMoveList from "./battle/KatomonMoveList";

// 制限がかかった際に切り替える
const YOUTUBE_API_KEY = {
 1:"AIzaSyDWNDiS0XB1tcrkUHzOdhc4uAoGNQh6V5w",
 2:"AIzaSyCeN9u9jcXSHJoLWUrek0m4igqKAvbZjGs",
 3:"AIzaSyBM-Gz05cxeA0HU6VXC79ZOUeH5Y_51pG8",
 4:"AIzaSyCcmePnsCkF8-W5mfwRyKULUvqdQW4UeuA",
 5:"AIzaSyCSI-e5B5H8G93XR2DrJSypqbaFGexvim8",
 6:"AIzaSyBuWDI-BPp8lNaUjtLW-hOGjC2QscJcZdg",
 7:"AIzaSyBfXndA5kNEV8V-Ka1VfQbjrYvZwr5tKac",
 8:"AIzaSyC50BVEl6KvNPdGCupaw7X5CW0Joylp1_A",
 9:"AIzaSyBS7ZLIW4cMmuoZQfsap-B1mC3u2oT3rcw",
 };
 // 使用するキー
 var useApiNum = 9 ;

 

// 最初に開くところ
export default class KatomonGenerateScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      generate:false,
      KatoCode: "https://www.youtube.com/watch?v=VgYQB8vE82I&t=5581s",
      KatoCodeId:"",
      KatoMonData:"",
      KatoMonImage:"",
      KatoMonDataContent:"",
      KatoMonDataStatics:"",

      useAPI:useApiNum,

      generateFlag: false,
      generateFalseFlag: false,
      translateFlag: false,
      inputKatoCode:"",

      katoPower:null,
      katoIkioi:null,
      katoMamori:null,

      opacity: new Animated.Value(0),
      duration_memo:null,

      katomon:"",
    };
  }

  animate() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 600*8,
      useNativeDriver:true,
    }).start();
  }

  changeAPI =() =>{
    this.state.useAPI -=1;
    if(this.state.useAPI <= 0){
      this.state.useAPI = 9;
    }
    console.log(this.state.useAPI);
    this.setState({
      generateFalseFlag:false,
    });
  };

  reset = () => {
    this.setState({
      generateFlag: false,
    });
  };

  inputReset = () => {
    this.setState({
      inputKatoCode: "",
    });
  }

  generateKatomon = () => {

    this.state.KatoCodeId = this.state.inputKatoCode.split("v=");
    if(this.state.KatoCodeId["1"]){
      this.state.KatoCodeId = this.state.KatoCodeId["1"].split("&");
    }
    else{
      // 短縮URLの場合の処理
      if ( this.state.KatoCodeId[0].match(/youtu.be/)) {
        console.log("test");
        this.state.KatoCodeId=this.state.KatoCodeId[0].split("youtu.be/");
        this.state.KatoCodeId[0] =  this.state.KatoCodeId[1];
      }
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics,player,topicDetails,recordingDetails&id=${this.state.KatoCodeId[0]}&key=${YOUTUBE_API_KEY[useApiNum]}`;

    /**https://phpjavascriptroom.com/?t=strm&p=youtubedataapi_v3_list 
     * 取得情報に関してのリファレンス */
  
    axios
      .get(url)
      .then(response => {
          this.setState({
            KatoMonData: response.data.items[0].snippet,
            KatoMonImage:response.data.items[0].snippet.thumbnails.medium.url,
            KatoMonDataContent:response.data.items[0].contentDetails,
            KatoMonDataStatics:response.data.items[0].statistics,

            generateFlag: true,
            generateFalseFlag: false,
          });
          var duration = this.state.KatoMonDataContent.duration.split("PT");
          if(duration[1].match(/H/)){
            duration = duration[1].split("H");
          }else{
            duration[0] = 0.0;
          }
          duration[1] = duration[1].split("M");
          duration[1][1] = duration[1][1].split("S");
          this.setState({
            duration_memo:duration,
          });
      })
      .catch(() => {
          console.log('通信に失敗しました');
          this.setState({
            generateFalseFlag: true,
          });
      });
  };

  // 自動で技のピックアップ
  selectMove = (player) =>{
    switch(player){
      case "p1":
        var selectRand = Math.random();
        if(selectRand <0.1){
          return KatomonMoveList.rightStraight;
        }
        if(selectRand <0.2 && selectRand >= 0.1){
          return KatomonMoveList.gaia;
        }
        if(selectRand <0.3 && selectRand >= 0.2){
          return KatomonMoveList.escape;
        }
        if(selectRand <0.4 && selectRand >= 0.3){
          return KatomonMoveList.drill;
        }
        if(selectRand <0.5 && selectRand >= 0.4){
          return KatomonMoveList.mai;
        }
        if(selectRand <0.6 && selectRand >= 0.5){
          return KatomonMoveList.kisei;
        }
        if(selectRand <0.7 && selectRand >= 0.6){
          return KatomonMoveList.moko1;
        }
        if(selectRand <0.8 && selectRand >= 0.7){
          return KatomonMoveList.fuji;
        }
        if(selectRand <0.9 && selectRand >= 0.8){
          return KatomonMoveList.kussinn;
        }
        else{
          return KatomonMoveList.rightStraight;
        }
      // case "p2":
      //   var selectRand = Math.random();
      //   if(selectRand <0.1){
      //     return KatoFesP2MoveList.ai;
      //   }
      //   if(selectRand <0.2 && selectRand >= 0.1){
      //     return KatoFesP2MoveList.ronpa;
      //   }
      //   if(selectRand <0.3 && selectRand >= 0.2){
      //     return KatoFesP2MoveList.zatudan;
      //   }
      //   if(selectRand <0.4 && selectRand >= 0.3){
      //     return KatoFesP2MoveList.asupara;
      //   }
      //   if(selectRand <0.5 && selectRand >= 0.4){
      //     return KatoFesP2MoveList.craver;
      //   }
      //   if(selectRand <0.6 && selectRand >= 0.5){
      //     return KatoFesP2MoveList.poisson;
      //   }
      //   if(selectRand <0.7 && selectRand >= 0.6){
      //     return KatoFesP2MoveList.mai;
      //   }
      //   if(selectRand <0.8 && selectRand >= 0.7){
      //     return KatoFesP2MoveList.kick;
      //   }
      //   if(selectRand <0.9 && selectRand >= 0.8){
      //     return KatoFesP2MoveList.isogashi;
      //   }
      //   else{
      //     return KatoFesP2MoveList.ronpa;
      //   }
    }
  };

  // ここでかとモンを呼び出す
  translateKatomon = () =>{
    this.setState({
      translateFlag: true,
    });
    
    // 技はランダムで足すことにする。
    var katoRand = Math.random();
    if(katoRand < 0.15){
      this.state.katomon = KatomonList.kingdom;
    }
    if(katoRand < 0.25 && katoRand >= 0.15){
      this.state.katomon = KatomonList.kyomu;
    }
    if(katoRand < 0.35 && katoRand >= 0.25){
      this.state.katomon = KatomonList.smile;
    }
    if(katoRand < 0.4 && katoRand >= 0.35){
      this.state.katomon = KatomonList.piza;
    }
    if(katoRand < 0.5 && katoRand >= 0.4){
      this.state.katomon = KatomonList.dark;
    }
    if(katoRand < 0.55 && katoRand >= 0.5){
      this.state.katomon = KatomonList.naoko_gold;
    }
    if(katoRand < 0.65 && katoRand >= 0.55){
      this.state.katomon = KatomonList.naoko_normal;
    }
    if(katoRand < 0.7 && katoRand >= 0.65){
      this.state.katomon = KatomonList.hae;
    }
    if(katoRand < 0.75 && katoRand >= 0.7){
      this.state.katomon = KatomonList.okurei;
    }
    if(katoRand < 0.8 && katoRand >= 0.75){
      this.state.katomon = KatomonList.suwari;
    }
    if(katoRand < 0.85 && katoRand >= 0.8){
      this.state.katomon = KatomonList.unk;
    }
    if(katoRand < 0.95 && katoRand >= 0.85){
      this.state.katomon = KatomonList.hana1;
    }
    if(katoRand >= 0.95){
      this.state.katomon = KatomonList.hana2;
    }
    // 技をランダムにセット
    this.state.katomon.move.move1 = this.selectMove("p1");
    this.state.katomon.move.move2 = this.selectMove("p1");
    this.state.katomon.move.move3 = this.selectMove("p1");

    // 基礎ステータス

    this.setState({
      // パワー
      katoPower:Math.round((this.state.duration_memo[0] * 60 * 60 + this.state.duration_memo[1][0] * 60 + this.state.duration_memo[1][0][0]) * this.state.katomon.param/1500),
      // 勢い
      katoIkioi:Math.round(this.state.KatoMonDataStatics.commentCount * this.state.KatoMonDataStatics.viewCount * this.state.katomon.param/5000000),
       // 守り
       katoMamori:Math.round((this.state.KatoMonDataStatics.likeCount)/(parseInt(this.state.KatoMonDataStatics.likeCount) + parseInt(this.state.KatoMonDataStatics.dislikeCount)) * this.state.KatoMonDataStatics.viewCount * this.state.katomon.param/50000),
    });
  }

  goto = async(destination) => {
    try {
    // destinationごとに音声を変えておく
      const soundObject = new Audio.Sound();
      switch(destination){
        case "カトフェス":
          await soundObject.loadAsync(require('./assets/sound/yaruo.mp3'));
          break;
      }

      await soundObject.playAsync();
      console.log('success!!!');
      this.stopBgm();
      this.setState(state =>  ({generate : true}));

      var sendKatomonData={
        katomonName:this.state.katomon.name,
        katomonDescription:this.state.katomon.description,
        katomonPower:this.state.katoPower,
        katomonikioi:this.state.katoIkioi,
        katomonMamori:this.state.katoIkioi,
        katomonMove:this.state.katomon.move,
        
        katomonImage:this.state.katomon.image,
      }

      this.props.navigation.navigate(destination,sendKatomonData);
    } 
    catch (error) {
      console.log('error...');
    }
  }

  componentDidMount = async() => {

    // // bgm
    // this.soundId = new Audio.Sound();//オブジェクト導入
    // await this.soundId.loadAsync(Sounds.bgmGeneMenu);//ファイルロード
    // // console.log(this.soundId );
    // await this.soundId.setStatusAsync({ volume: 0.03 });//音量
    // await this.soundId.playAsync();//スタート

    this.soundStart(Sounds.bgmGeneMenu,0.03);

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
    // if(!this.state.generate){
    //   this.soundStart(Sounds.bgm1,0.03);
    // }
  }


  render(){
    // console.log(this.state.KatoMonDataStatics);
    console.log(this.state.duration_memo);
   
    if(this.state.translateFlag){
      this.animate();
    }
    return(
      <SafeAreaView style = {styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
        {!this.state.generateFlag && (
          <View style={{position:'absolute',}}>
            <Text style={{
                fontSize:18,
                marginTop:"-20%",
                marginLeft:"3%",
                marginRight:"3%",
              }}>好きなjun channel の配信URLを教えてもらうことはできますか？
            </Text>
            <Text style={{
                fontSize:18,
                marginLeft:"3%",
                marginRight:"3%",
                textAlign:"center",
              }}>↓↓
            </Text>
            {/* カトコードにゅうりょく */}
            <TextInput
              style={{
                fontSize:18,
                borderBottomWidth: 1,
                backgroundColor: "#d2b48c",
                // color:"#fff",
                textAlign:"center",
                marginLeft:"10%",
                marginRight:"10%",
                marginTop:"5%",
                paddingTop:"5%",
                paddingBottom:"5%",
                borderRadius:10,
              }}
              onChangeText={(inputKatoCode) => this.setState({inputKatoCode})}
              value={this.state.inputKatoCode}
            />
            <View style={{
                // backgroundColor: "#696969",
                color:"#fff",
                alignItems:"center",
                marginLeft:"10%",
                marginRight:"10%",
                marginTop:"5%",
                paddingTop:"5%",
                paddingBottom:"5%",
              }}>

              {this.state.generateFalseFlag && (
                <View>
                  <Text style = {{
                  position:"relative", 
                  marginBottom:"5%", 
                  color:"#ff0000" ,
                  fontSize: 24,
                  fontWeight: 'bold',
                  fontFamily: 'DotGothic16_400Regular',

                  }}>生成失敗です。カトコードが不正な値のようです。</Text>
                  <TouchableOpacity
                    onPress={() =>this.changeAPI()}
                  >
                    <Text>
                      APIの制限の可能性もあります。使用するAPIキーを切り替える場合はこちらをTapしてください。
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{flexDirection: 'row',marginTop:"3%"}}>
                <TouchableOpacity 
                onPress={this.inputReset}
                style={{
                  backgroundColor:"#eee",
                  flex:1,
                  marginLeft:"5%",
                  marginRight:"5%",
                  marginTop:"10%",
                  marginBottom:"10%",
                  borderRadius:20,
                }}>
                  <View>
                    <Text style = {{
                      textAlign:"center",
                      fontSize:20,
                      marginTop:"5%",
                      marginBottom:"5%",
                    }}>リセット</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={this.generateKatomon}
                style={{
                  borderRadius:20,
                  flex:2,
                  marginLeft:"5%",
                  marginRight:"5%",
                  paddingTop:"10%",
                  paddingBottom:"10%",
                  paddingBottom:"5%",
                  backgroundColor:"#ffc0cb"

                }}>
                  <View>
                    <Text style = {{
                      textAlign:"center",
                      paddingLeft:"5%",
                      paddingRight:"5%",
                      fontSize:24,
                    }}>カトモン生成</Text>
                  </View>
                </TouchableOpacity>
              </View>


              {/* test */}
              {/* <Text>入力されたKatoCode</Text>
              <Text>＝＞{this.state.inputKatoCode}</Text> */}
            </View>
          </View>
        )}

        {this.state.generateFlag && !this.state.translateFlag && (
            <View>
              <Text style = {styles.success}>本当に、こちらの配信から
              カトモンを生み出しますか？</Text>
              {/* カトモンのデータ */}
              <ScrollView>
                <Text style = {styles.katomon_title}>{this.state.KatoMonData.title}</Text>
                <Image
                  source={{ uri: `${this.state.KatoMonImage}` }}
                  style={{ 
                    width:368, //16:9
                    height:207,
                    marginLeft:"5%",
                    marginRight:"5%",
                   }}
                />
                <ScrollView style={styles.katomon_detail}>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>配信時間：</Text>
                    {this.state.duration_memo && (
                      <Text style={styles.katomon_detail_text}>{this.state.duration_memo[0]}時間{this.state.duration_memo[1][0]}分{this.state.duration_memo[1][1][0]}秒</Text>
                    )}
                  </View>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>再生回数：</Text>
                    <Text style={styles.katomon_detail_text}>{this.state.KatoMonDataStatics.viewCount}回</Text>
                  </View>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>コメント数：</Text>
                    <Text style={styles.katomon_detail_text}>{this.state.KatoMonDataStatics.commentCount}コメント</Text>
                  </View>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>高評価率：</Text>
                    <Text style={styles.katomon_detail_text}>{Math.round((this.state.KatoMonDataStatics.likeCount)/(parseInt(this.state.KatoMonDataStatics.likeCount) + parseInt(this.state.KatoMonDataStatics.dislikeCount))*100)}%</Text>
                  </View>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>配信日時：</Text>
                    <Text style={styles.katomon_detail_text}>{this.state.KatoMonData.publishedAt}</Text>
                  </View>
                  <View style={styles.katomon_detail_box}>
                    <Text style={styles.katomon_detail_text}>チャンネル名：</Text>
                    <Text style={styles.katomon_detail_text}>{this.state.KatoMonData.channelTitle}</Text>
                  </View>
                </ScrollView>
                <TouchableOpacity 
                onPress={this.translateKatomon}
                style={{
                  borderRadius:20,
                  flex:1,
                  backgroundColor:"#ffc0cb",
                  marginLeft:"5%",
                  marginRight:"5%",
                  marginTop:"3%",
                  paddingTop:"5%",
                  paddingBottom:"5%",

                }}>
                  <View>
                    <Text style = {{
                      textAlign:"center",
                      paddingLeft:"5%",
                      paddingRight:"5%",
                      fontSize:24,
                    }}>カトモン生成</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{
                  this.reset()
                }}
                style={{
                  borderRadius:20,
                  flex:1,
                  backgroundColor:"#eee",
                  marginLeft:"5%",
                  marginRight:"5%",
                  marginTop:"3%",
                  paddingTop:"5%",
                  paddingBottom:"5%",

                }}>
                  <View>
                    <Text style = {{
                      textAlign:"center",
                      paddingLeft:"5%",
                      paddingRight:"5%",
                      fontSize:24,
                    }}>入力に戻る</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
        )}
        {this.state.translateFlag && (
          <View style={{
            marginTop:"-60%",
          }}>
            <Text style={{
              fontSize:18,
              marginTop:"30%",
            }}>
              今ここに、新たなカトモンが誕生しました。
            </Text>
            <Animated.View style={{ opacity: this.state.opacity}}>
              <View style={{flexDirection: 'row',}}>
                <Image
                  source={this.state.katomon.image}
                  style={{ width: 128, height: 128 ,position:'relative',
                  marginTop:"5%",
                  marginBottom:"5%",
                  marginLeft:"5%",
                  marginRight:"5%",
                  backgroundColor:"#fff"}}
                /> 
                <View style={{marginTop:"10%"}}>
                  <Text></Text>
                </View>
              </View>
                  <Text style={{marginTop:"5%",fontSize:24,marginLeft:"5%",marginRight:"5%"}}>
                    名前: {this.state.katomon.name}
                  </Text>
                  <Text style={{marginTop:"5%",
                  marginBottom:"5%",
                  fontSize:14,marginLeft:"5%",marginRight:"5%"}}>
                    {this.state.katomon.destination}
                  </Text>
                  <View style={{flexDirection:"row"}}>
                    <View>
                      <View style={{flexDirection: 'row',marginLeft:"5%",marginRight:"5%"}}>
                        <Text style={{fontSize:18}} >パワー：</Text>
                        <Text  style={{fontSize:18}}>{this.state.katoPower}</Text>
                      </View>
                      <View style={{flexDirection: 'row',marginLeft:"5%",marginRight:"5%"}}>
                        <Text  style={{fontSize:18}}>勢い：</Text>
                        <Text  style={{fontSize:18}}>{this.state.katoIkioi}</Text>
                      </View>
                      <View style={{flexDirection: 'row',marginLeft:"5%",marginRight:"5%"}}>
                        <Text  style={{fontSize:18}}>守り：</Text>
                        <Text  style={{fontSize:18}}>{this.state.katoMamori}</Text>
                      </View>
                    </View>
                    <View>
                      <View>
                        < Text style={styles.move}>1.{this.state.katomon.move.move1.name}</Text>
                        <Text style={styles.moveSub}> 必要ガッツ：{this.state.katomon.move.move1.consumption_Guts}</Text>
                        <Text style={styles.moveSub}> 射程：{this.state.katomon.move.move1.range} 威力：{this.state.katomon.move.move1.power}</Text>
                      </View>
                      <View>
                        < Text style={styles.move}>2.{this.state.katomon.move.move2.name}</Text>
                        <Text style={styles.moveSub}> 必要ガッツ：{this.state.katomon.move.move2.consumption_Guts}</Text>
                        <Text style={styles.moveSub}> 射程：{this.state.katomon.move.move2.range} 威力：{this.state.katomon.move.move2.power}</Text>
                      </View>
                      <View>
                        < Text style={styles.move}>3.{this.state.katomon.move.move3.name}</Text>
                        <Text style={styles.moveSub}> 必要ガッツ：{this.state.katomon.move.move3.consumption_Guts}</Text>
                        <Text style={styles.moveSub}> 射程：{this.state.katomon.move.move3.range} 威力：{this.state.katomon.move.move3.power}</Text>
                      </View>
                    </View>
                  </View>
              <TouchableOpacity 
              style={{
                marginTop:"10%",backgroundColor:"#f5deb3",marginLeft:"20%",marginRight:"20%",
                borderRadius:20,
              }}
              onPress={() =>
                this.goto('カトフェス')}
              >
                <Text style={{fontSize:24,textAlign:"center",margin:"3%"}}>
                  戦場へ向かう...
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
    fontSize: 14,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    position: "relative",
    alignItems: "center",
  },
  success: {
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    position: "relative",
    alignItems: "center",
    paddingBottom: "10%",
    color: "red",
    marginTop:"5%",
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
    fontSize: 48,
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
  katomon_title:{
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    position: "relative",
    alignItems: "center",
    marginLeft:"5%",
    marginRight:"5%",
  },
  katomon_detail:{
    fontSize: 24,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    position: "relative",
    // alignItems: "center",
    marginLeft:"5%",
    marginRight:"5%",
  },
  katomon_detail_box:{
    flex:1,
    flexDirection: 'row',
  },
  katomon_detail_text:{
    fontSize: 18,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
  },
  move:{
    padding:"5%",
    backgroundColor:"#eee",
    fontSize: 14,
    fontWeight: 'bold',
    // fontFamily: 'DotGothic16_400Regular',
    textAlign:'left',
    padding:"5%",
    flex:1,
    opacity:0.9,
  },
});
