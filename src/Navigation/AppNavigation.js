import React, { useEffect, useRef } from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';

//packages
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import RNBootSplash from "react-native-bootsplash";
import messaging from '@react-native-firebase/messaging';

//screens
import { AuthScreen } from '../screens/AuthScreen';
import { CreateProfileScreen } from '../screens/CreateProfileScreen';
import { TabNavigation } from './TabNavigation';

//functions && features && slice
import { setNavigationObjTo } from '../store/features/userSlice';
import { setDateRefreshPosition, setIsActualInfo, setIsActualInfoError } from '../store/features/loginSlice';
import { DisableScreen } from '../screens/DisableScreen';
import { TestScreen } from '../util/Admin/TestScreen';
import { connectSocket } from '../util/socket/socket';
import { AuthScreenTest } from '../util/Admin/AuthScreenTest';
import { Alert } from 'react-native';
import { getFCMToken, listenToNotifications, requestUserPermission } from '../util/Admin/testnotif';
import { GetData } from './GetData';
// import { getVresion } from '../util/firebase';

//components

//styles

const Stack = createNativeStackNavigator();
const Auth = createNativeStackNavigator();
const Profile = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef()

export const AppNavigation = ({ navigation }) => {
  const {isLogin, userProfileInfo} = useSelector((state) => state.login)
  const { currentChatId } = useSelector((state) => state.listofchats)
  const isDisable = useSelector((state) => state.login.isDisable)
  // console.log('\x1b[44m%s %s\x1b[0m','AN ChatScreen currentChatId ', currentChatId)

  // console.log('isLogin', isLogin)
  const dispatch = useDispatch()
  const datenow = Date.now()
  const socketRef = useRef(null);

  const AuthStack = ({navigation}) => {
    return (
      <Auth.Navigator screenOptions={{
        headerShown: false
      }}
      >
        {
          isDisable === true ? 
          <Auth.Screen name="DisableScreen" component={DisableScreen} options={{navigation}}/>
          : null
        }
        <Auth.Screen name="Auth" component={AuthScreen} options={{navigation}}/>
        {/* <Auth.Screen name="AuthTest" component={AuthScreenTest} options={{navigation}}/> */}
        <Auth.Screen name="CreateProfile" component={CreateProfileScreen} options={{navigation}}/>
      </Auth.Navigator>
    )
  }

  const ProfileStack = ({navigation}) => {
    return (
      <Profile.Navigator screenOptions={{
        headerShown: false
      }}
      >
        <Profile.Screen name="CreateProfile" component={CreateProfileScreen} options={{navigation}}/>
      </Profile.Navigator>
    )
  }

  //!!socket connect
  useEffect(() => {
    // console.log('\x1b[46m%s %s\x1b[0m','AN useEffect connect start, userProfileInfo:', userProfileInfo, 'isLogin',isLogin )

    //todo проверить перезапустится ли сокет при релогине на дргой акк
    //todo test code
    //

    // if(userProfileInfo !== null && isLogin) {
    //   console.log('\x1b[44m%s %s\x1b[0m','AN useEffect currentChatId', currentChatId, userProfileInfo.role)

    // }

    //при запуске приложения/логинке ставить переменную в true после выхода из ака или перезапуске приложения 

    if(userProfileInfo !== null && isLogin) {
      // console.log('\x1b[44m%s %s\x1b[0m','AN useEffect connect if, currentChatId:', currentChatId, )
      connectSocket(userProfileInfo,socketRef,currentChatId,dispatch)
    }

  },[userProfileInfo,currentChatId,isLogin])
 
  // useEffect(()=>{
  //   // console.log('\x1b[44m%s %s\x1b[0m','AppNavigation datenow ', datenow)
  //   dispatch(setDateRefreshPosition(datenow))
    
  // },[])



  useEffect(() => {
    listenToNotifications(dispatch);
  }, []);

  //TODO добавить запрос формы и др данных до загрузки таб навигатора
  return (
    <NavigationContainer  
    // onReady={() => handleTest()}
    onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}
    >
      {/* <GetData /> */}
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {
          !isLogin ? (
            <>
              <Stack.Screen name="AuthStack" component={AuthStack}/>
              <Stack.Screen name="ProfileStack" component={ProfileStack}/>
            </>
          ) : (
            <>
            {/* <Stack.Screen name="TestScreen" component={TestScreen}/> */}
            <Stack.Screen name="TabNavigation" component={TabNavigation}/>
            </>
            )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}




  // useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('\x1b[44m%s %s\x1b[0m', 'onNotificationOpenedApp remoteMessage.notification', remoteMessage.notification, 'remoteMessage.data',remoteMessage.data)
    //   if(remoteMessage.data!== null &&remoteMessage.data !== undefined&&remoteMessage.data.hasOwnProperty('dataExist')) {
    //     obj = {
    //       title: remoteMessage.data.tenderName, 
    //       docId: remoteMessage.data.tenderId, 
    //       clientId: remoteMessage.data.clientId, 
    //       user: remoteMessage.data.userId,
    //       data: remoteMessage.data
    //     }
    //     dispatch(setNavigationObjTo(obj))
        
    //     // navigation.navigate('Chat',obj);
    //   }
    //   // navigation.navigate('HelpScreen');
    // });

    // Check whether an initial notification is available
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     // navigation.navigate('HelpScreen');
        
    //     if (remoteMessage) {
    //       console.log('\x1b[43m%s %s\x1b[0m', 'getInitialNotification remoteMessage.notification', remoteMessage.notification, 'remoteMessage.data', remoteMessage.data)
    //       let obj = {}
    //       if(remoteMessage.data!== null &&remoteMessage.data !== undefined&&remoteMessage.data.hasOwnProperty('dataExist')) {
    //         obj = {
    //           title: remoteMessage.data.tenderName, 
    //           docId: remoteMessage.data.tenderId, 
    //           clientId: remoteMessage.data.clientId, 
    //           user: remoteMessage.data.userId,
    //           data: remoteMessage.data
    //         }
    //         dispatch(setNavigationObjTo(obj))
    //         // navigation.navigate('Chat',obj);
    //       }
    //       // console.log(
    //       //   'Notification caused app to open from quit state:',
    //       //   remoteMessage.notification,
    //       // );
    //       // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
    //     }
    //     // setLoading(false);

        
    // });
  // }, []);
  
  // useEffect(() => {
  //   // console.log('AppNav state user: ', user )
  // }, [isLogin])

  // onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}

  // const handleTest = () => {
  //   console.log('setTimeout', 'start')
  //   setTimeout(()=>{console.log('setTimeout', 'inside'),RNBootSplash.hide({ fade: true, duration: 500 })},10000)
  //   console.log('setTimeout', 'end')
  // }


    // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);