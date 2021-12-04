import Sounds from "../assets/Sounds";

export default KatomonMoveList = {
  rightStraight:{
    name:"右ストレート",
    sound:Sounds.rightStraight,//音声ファイルのディレクトリ指定
    power:150,
    consumption_Guts:100,
    add_Guts:0,
    range:150,
    additional1:{
      param:"position2x",//変化するパラメータ(position/HP/ATK,,,)
      change:100,//変化量
    },
    additional2:{
      param:"position1x",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional3:{
      param:"p1HP",//変化するパラメータ(position/HP/ATK,,,)
      change:10,//変化量
    },
    personality:1,//移動に影響する性格の設定
  },
  gaia:{
    name:"ガイアの咆哮",
    sound:Sounds.gaia,//音声ファイルのディレクトリ指定
    power:30,
    consumption_Guts:50,
    add_Guts:0,
    range:200,
    additional1:{
      param:"position2x",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional2:{
      param:"p1ATK",//変化するパラメータ(position/HP/ATK,,,)
      change:20,//変化量
    },
    personality:1.5,//移動に影響する性格の設定
  },
  escape:{
    name:"よけろ！",
    sound:Sounds.yokero,//音声ファイルのディレクトリ指定
    power:10,
    consumption_Guts:100,
    add_Guts:0,
    range:500,
    additional1:{
      param:"position1x",//変化するパラメータ(position/HP/ATK,,,)
      change:-50,//変化量
    },
    additional2:{
      param:"p1DEF",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional3:{
      param:"p1ATK",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    personality:0.8,//移動に影響する性格の設定
  },
  drill:{
    name:"マッハドリル",
    sound:Sounds.drill,//音声ファイルのディレクトリ指定
    power:20,
    consumption_Guts:30,
    add_Guts:0,
    range:200,
    additional1:{
      param:"position2x",//変化するパラメータ(position/HP/ATK,,,)
      change:30,//変化量
    },
    additional2:{
      param:"p1ATK",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional3:{
      param:"p1DEF",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    personality:1,//移動に影響する性格の設定
  },
  mai:{
    name:"舞えるだけ舞う",
    sound:Sounds.katou2,//音声ファイルのディレクトリ指定
    power:10,
    consumption_Guts:100,
    add_Guts:0,
    range:500,
    additional1:{
      param:"p1ATK",//変化するパラメータ(position/HP/ATK,,,)
      change:100,//変化量
    },
    additional2:{
      param:"p1HP",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional3:{
      param:"p1Poisson",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    personality:1.3,//移動に影響する性格の設定
  },
  kisei:{
    name:"奇声",
    sound:Sounds.katou2,//音声ファイルのディレクトリ指定
    power:20,
    consumption_Guts:100,
    add_Guts:0,
    range:500,
    additional1:{
      param:"position2x",//変化するパラメータ(position/HP/ATK,,,)
      change:30,//変化量
    },
    personality:1.1,//移動に影響する性格の設定
  },
  moko1:{
    name:"もこう呼び",
    sound:Sounds.moko1,//音声ファイルのディレクトリ指定
    power:50,
    consumption_Guts:100,
    add_Guts:0,
    range:500,
    additional1:{
      param:"position2x",//変化するパラメータ(position/HP/ATK,,,)
      change:30,//変化量
    },
    additional2:{
      param:"p1Poisson",//変化するパラメータ(position/HP/ATK,,,)
      change:2,//変化量
    },
    personality:1.1,//移動に影響する性格の設定
  },
  fuji:{
    name:"危険球",
    sound:Sounds.katou6,//音声ファイルのディレクトリ指定
    power:300,
    consumption_Guts:200,
    add_Guts:0,
    range:1000,
    additional1:{
      param:"p1DEF",//変化するパラメータ(position/HP/ATK,,,)
      change:50,//変化量
    },
    additional2:{
      param:"p1Poisson",//変化するパラメータ(position/HP/ATK,,,)
      change:5,//変化量
    },
    personality:1.1,//移動に影響する性格の設定
  },
  kussinn:{
    name:"魂の屈伸",
    sound:Sounds.katou7,//音声ファイルのディレクトリ指定
    power:30,
    consumption_Guts:150,
    add_Guts:50,
    range:1000,
    additional1:{
      param:"p1ATK",//変化するパラメータ(position/HP/ATK,,,)
      change:20,//変化量
    },
    additional2:{
      param:"p1DEF",//変化するパラメータ(position/HP/ATK,,,)
      change:20,//変化量
    },
    personality:1.4,//移動に影響する性格の設定
  },
}