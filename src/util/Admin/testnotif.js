import messaging, { getInitialNotification, getMessaging, getToken, onMessage, onNotificationOpenedApp, requestPermission } from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { setNavigationObjTo } from '../../store/features/userSlice';

const app = getApp(); // инициализирует текущее Firebase-приложение
const messagingInstance = getMessaging(app);

export async function requestUserPermission() {
  const authorizationStatus = await requestPermission(messagingInstance);
  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}

export async function getFCMToken() {
  
  // await registerDeviceForRemoteMessages(messaging);
  const token = await getToken(messagingInstance);
  // const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

export async function listenToNotifications(dispatch) {
  console.log('listenToNotifications', )
  // Когда приложение в Foreground
  const app = getApp(); // инициализирует текущее Firebase-приложение
  const messagingInstance = getMessaging(app);

  // Когда пользователь нажимает на уведомление при Background/Closed
  
  //срабатывает когда нажать на пуш ( который только пришел или на стр блокировки)
  // const sunscribe = onNotificationOpenedApp(messagingInstance,remoteMessage => {
  //   console.log('App opened from background:', remoteMessage.notification);
  // });
  // console.log('sunscribe', sunscribe)

  // Когда приложение запускается после клика по уведомлению (Terminated)
  //срабатывает когда нажать на пуш ( на стр блокировки)
  // const notificationOpen = await getInitialNotification(messagingInstance);
  // if (notificationOpen != null) {
  //   console.log(
  //     'App was opened by tapping on a notification:',
  //     notificationOpen,
  //   )
  // }
  //срабатывает когда приложение открыто
  // onMessage(messagingInstance, async remoteMessage => {

  //   console.log(
  //     'onMessage th',
  //     remoteMessage,
  //   );
  // })
  

  //срабатывает когда нажать на пуш ( который только пришел или на стр блокировки)
  const notificationOpen = await getInitialNotification(messagingInstance);
  if (notificationOpen != null) {

    console.log(
      'App was opened by tapping on a notification:',
      notificationOpen,
    );

    if(notificationOpen?.data && notificationOpen?.data?.partnerId) {
      console.log('getInitialNotification', notificationOpen?.data && notificationOpen?.data?.partnerId)
      const obj = {
        type: notificationOpen.data.type,
        partnerId: notificationOpen.data.partnerId,
        partnerRole: notificationOpen.data.partnerRole,
        tenderId: notificationOpen.data.tenderId
      }
      dispatch(setNavigationObjTo(obj))
      return;
    }
    
  }

  onNotificationOpenedApp(messagingInstance, remoteMessage => {
    // alert(`Notification: ${JSON.stringify(remoteMessage,null,2)}`)
    // const obj = {
    //   type: "newMsg",
    //   partnerId: 2,
    //   partnerRole: 'client',
    //   tenderId: 112
    // }
    if(remoteMessage?.data && remoteMessage?.data?.partnerId) {
      console.log('onNotificationOpenedApp', remoteMessage?.data && remoteMessage?.data?.partnerId)
      const obj = {
        type: remoteMessage.data.type,
        partnerId: remoteMessage.data.partnerId,
        partnerRole: remoteMessage.data.partnerRole,
        tenderId: remoteMessage.data.tenderId
      }
      dispatch(setNavigationObjTo(obj))
    }
    //time out для отправки объекта что бы успели выполниться другие фун-ии?
    console.log(
      'Notification caused app to open from background or terminated state:',
      remoteMessage,
    );

    // {"data": {"partnerId": "2", "partnerRole": "client", "tenderId": "114", "type": "newMessageInChat"}, "from": "586273366428", "messageId": "1753889242068375", "notification": {"body": "Ee", "title": "qweyйу. Заявка Test1233"}}
  });
}


//migrate to v22
// useEffect(() => {
// const configurePushNotifications = async () => {
// const messagingInstance = getMessaging();

//   if (Platform.OS === 'android') {
//     PushNotification.createChannel(
//       {
//         channelId: 'default-channel',
//         channelName: 'Default Channel',
//         channelDescription: 'A default channel for notifications',
//         soundName: 'default',
//         importance: PushNotification.Importance.HIGH,
//         vibrate: true,
//       },
//       created => console.log(`Notification channel created: ${created}`),
//     );
//   }

//   PushNotification.configure({
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
//     popInitialNotification: false,
//     onRegister: async function (token) {
//       console.log('Token:', token);

//       if (Platform.OS === 'ios') {
//         const fcmToken = await getToken(messagingInstance);
//         console.log('FCM Token (iOS):', fcmToken);
//         await AsyncStorage.setItem('notification_token', fcmToken);
//         global.fcmToken = fcmToken;
//       } else {
//         console.log('FCM Token (Android):', token.token);
//         await AsyncStorage.setItem('notification_token', token.token);
//         global.fcmToken = token.token;
//       }
//     },
//     senderID: '581145729913',
//     soundName: Platform.OS === 'ios' ? 'default' : 'default',
//   });

//   if (Platform.OS === 'ios') {
//     // PushNotificationIOS.requestPermissions();
//   }

//   // On message event
//   onMessage(messagingInstance, async remoteMessage => {
//     console.log('Received foreground notification', remoteMessage);
//     global.navigation = navigation;
//     setNotificationMessage(remoteMessage);
//     setShowNotification(true);

//     Animated.sequence([
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 0.85,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     setTimeout(() => {
//       Animated.sequence([
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: -80,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start(() => setShowNotification(false));
//     }, 3000);
//   });

//   // When the app is opened from background or terminated state
//   onNotificationOpenedApp(messagingInstance, remoteMessage => {
//     console.log(
//       'Notification caused app to open from background or terminated state:',
//       remoteMessage,
//     );
//     if (navigation) {
//       navigateToModule(remoteMessage?.data);
//     }
//   });

//   const notificationOpen = await getInitialNotification(messagingInstance);
//   if (notificationOpen != null) {
//     console.log(
//       'App was opened by tapping on a notification:',
//       notificationOpen,
//     );
//     global.onTapNotification = notificationOpen;
//   }
// };

// configurePushNotifications();

// return () => {
//   if (Platform.OS === 'ios') {
//     PushNotificationIOS.removeEventListener('register');
//     PushNotificationIOS.removeEventListener('registrationError');
//     PushNotificationIOS.removeEventListener('notification');
//   }
// };
// }, []);