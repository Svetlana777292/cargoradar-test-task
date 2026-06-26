import React, { useEffect, useState,useRef, createRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, TouchableOpacity, Image, TextInput, ActivityIndicator, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';

//packages
import { useSelector, useDispatch } from 'react-redux';
// import ImagePicker from 'react-native-image-crop-picker';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DefaultBtn } from '../../components/Buttons/DefaultBtn';


import { initPusher, disconnectPusher } from './pusherClient';
// import { getToken } from '../asyncstor';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useReverbSocket from './reverbsocet';
import useReverbSocketAnother from './reverbsocetanother';

import { Pusher } from '@pusher/pusher-websocket-react-native';
import useReverbSocketEcho from './reverbsocetecho';
import { NativeSocetComponent } from './NativeSocetComponent';
import dayjs from 'dayjs';

import { getMessaging, getToken, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';
// import messaging from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

export const TestScreen = ({route, navigation}) => {
  // const ref = useRef(null);
  const dispatch = useDispatch()
  const [result,setResult]=useState()
  const {userProfileInfo, role, userPhone} = useSelector((state) => state.login)
  // console.log('userProfileInfo', userProfileInfo)
  const safeInsets = useSafeAreaInsets();

  const fntest =()=> {
      console.log('res', )
      navigation.goBack()
  }

    const testfn = async () => {
      try {
        const app = getApp(); // инициализирует текущее Firebase-приложение
        const messaging = getMessaging(app);
        // await registerDeviceForRemoteMessages(messaging);
        const token = await getToken(messaging);
        console.log('\x1b[45m%s %s\x1b[0m', 'messaging token: ', token);
        // setTokenmsg(token);
      } catch (error) {
        console.log('messaging get token error:', error);
      }
    }

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }
  async function getNotif() {
    const message = await messaging().getInitialNotification();

    if (message) {
      console.log('message :', message);
    }
  }
  useEffect(()=>{
    requestUserPermission()
  },[])

   useEffect(() => {
    //todo - новая документация (посмотреть клик?)
    getNotif()
    //  messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //   });
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });

    // return unsubscribe;
  }, []);


  
  return (
    <View style={[styles.container1,{paddingTop: safeInsets?.top}]}>
    {/* <NativeSocetComponent /> */}
    <Text style={{color: 'red'}}>111</Text>
    <DefaultBtn onPress={fntest}
      title="goBack" />
    <DefaultBtn onPress={testfn}
      title="notif" />
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa'
  },
});