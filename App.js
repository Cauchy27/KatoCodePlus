
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';

import 'react-native-gesture-handler';

import React,{ Component } from 'react';
import { 
  SafeAreaView,
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import AppLoading from 'expo-app-loading';
// import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TitleScreen from './TitleScreen';
// import NejikiScreen from './KatoNejikiScreen';
import ChampionshipScreen from './KirinukiChampionshipScreen';
import FesScreen from './KatoFesScreen';
import KatomonGenerateScreen from './KatomonGenerateScreen';

import { Audio } from 'expo-av';
import Sounds from './assets/Sounds';

const Stack = createStackNavigator();


function App(){
  // let [fontsLoaded] = useFonts({
  //   DotGothic16_400Regular,
  // });

  // let fontSize = 24;
  // let paddingVertical = 6;

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        {/* 上の画面がトップとして表示される */}
        <Stack.Screen
            name="ホーム"
            component={TitleScreen}
          />
        {/* <Stack.Screen
            name="フリー対戦"
            component={NejikiScreen}
          /> */}
        <Stack.Screen
            name="カトフェス"
            component={FesScreen}
          />
        <Stack.Screen
            name="切り抜きチャンピオンシップ"
            component={ChampionshipScreen}
          />
        <Stack.Screen
            name="カトモン生成"
            component={KatomonGenerateScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  
};
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
});

export default App;