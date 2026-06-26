/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Alert, Dimensions, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import { AppNavigation } from './src/Navigation/AppNavigation';
import { PersistGate } from 'redux-persist/integration/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { SplashScreen } from './src/screens/SplashScreen';

 const App = () => {
  // const [isReady, setIsReady] = useState(false)
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  //   // Alert.alert('Message handled in the background!', JSON.stringify(remoteMessage));
  //   // "collapseKey": "com.cargoradar.main", "data": {}, "from": "586273366428", "messageId": "0:1676707632336287%32a5c9f032a5c9f0", "notification": {"android": {}, "body": "Заказ отклонен клиентом в 18.02.2023 10:7", "title": "Test111 отказался от заказа Test21q"}, "sentTime": 1676707632327, "ttl": 2419200}
  // });
  
//   useEffect(() => {
//     // зкоментировать
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('\x1b[35m%s %s\x1b[0m', '!!!remoteMessage!!!', remoteMessage);
//       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
// //       {"collapseKey": "com.cargoradar.main", "data": {}, "from": "586273366428", "messageId": "0:1676707692847132%32a5c9f032a5c9f0", "notification": 
// // {"android": {}, "body": "Заказ отклонен клиентом в 18.02.2023 10:8", "title": "Test111 отказался от заказа Test21q"}, "sentTime": 1676707692839, "ttl": 2419200}
//     });

//     return unsubscribe;
//   }, []);

// if(!isReady) {
//   return (
//     <SplashScreen />
//   )
// } else {

  return (
    <GestureHandlerRootView style={{flex: 1,backgroundColor: '#fff'}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigation/>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
// }
 };
 
 export default App; 
