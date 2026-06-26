import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, View,Text,Pressable, Image, Keyboard, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import messaging from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { useSelector, useDispatch } from 'react-redux';
import { checkNotifications, requestNotifications } from 'react-native-permissions';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';

//screens
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TendersScreen } from '../screens/TendersScreen';
import { ChatsListScreen } from '../screens/ChatScreen/ChatsListScreen';
import { ChatScreen } from '../screens/ChatScreen/ChatScreen';
import { TransportScreen } from '../screens/TransportScreen';
import { MyTendersScreen } from '../screens/MyTendersScreen';
import { TenderItemScreen } from '../screens/TenderItemScreen';
import { TenderItemClientScreen } from '../screens/TenderItemClientScreen';
import { AddTransportScreen } from '../screens/AddTransportScreen';
import CreateTenderScreen from '../screens/CreateTender/CreateTenderScreen';
import CreateStartPointScreen from '../screens/CreateTender/CreateStartPointScreen';
import CreateEndPointScreen from '../screens/CreateTender/CreateEndPointScreen';
import EditTenderScreen from '../screens/EditTender/EditTenderScreen';
import EditStartPointScreen from '../screens/EditTender/EditStartPointScreen';
import EditEndPointScreen from '../screens/EditTender/EditEndPointScreen';
import { FilterScreen } from '../screens/FilterScreen';
import { RoutesScreen } from '../screens/RoutesScreen';
import CreateRouteScreen from '../screens/CreateRoute/CreateRouteScreen';
import CreateRoutePointScreen from '../screens/CreateRoute/CreateRoutePointScreen';
import EditRouteScreen from '../screens/EditRoute/EditRouteScreen';
import EditRoutePointScreen from '../screens/EditRoute/EditRoutePointScreen';
import { RouteItemScreen } from '../screens/RouteItemScreen';
import { SearchDriversScreen } from '../screens/SearchDriversScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { ProfileUpdateScreen } from '../screens/ProfileUpdateScreen';

//components
import PromptNetConnection from '../components/Modal/PromptNetConnection';
import InfoAskWindow from '../components/Modal/InfoAskWindow';
import { CustomTabBar } from '../components/CustomTabBar';
import PromptComponent from '../components/Modal/PromptComponent';
import { NotificationsScreen } from '../screens/NotificationsScreen';

//functions && features && slice
import { userProfileTenderDelete,userProfileTenderHidden, userProfileTenderFaivor, userProfileBlackList, setNavigationObjTo, setCurrentDate, onSaveCurrPositionWithAddress, setConnectedInternet, setSatatusGeolocation, setShowInfoModal, setShowStatusGps, setDriverTenderAvtivity, userProfileTenderHiddenClient, setClientActiveTenderState, setDriverRoutesOffersState, setDriverActiveTenderState } from '../store/features/userSlice';
import { getTenderHidden, getUserRating, getProfileInfo, setPositionDriver, getPositionDriver, navToChat, getJsonData, getCarsInfo, getVresion } from '../util/firebase';
import { setIsLogin, setCarsInfo, setIsActualInfo, setIsActualInfoError, setIsAuth, setPositionDriverWithTime, setUserDisable, setUserProfileInfo, setCheckUpdFormActivities } from '../store/features/loginSlice';
import {  onMsgState, updMsg, setInformerState, updInformerState, updateTimeInformerState, updInformerActiveState, setInformerActiveState, updateTimeInformerActiveState, updInformerRoutesState, setInformerRoutesState, updateTimeInformerRoutesState, } from '../store/features/chatsSlice';
import { setJsonDataPrompt, setJsonDataPromptErr } from '../store/features/jsonInfoSlice';
import { setCheckUnreadMsgInformers, setCurrentChatId, setNewTendersInHidden } from '../store/features/listOfChatsSlice';
import { checkDriverPositionDoc, getCurrentPositionAdressAndCoords,checkTimeAndPosition, check24hPosition, positionDriverCheckAndSet } from '../util/geolocation';
import { checkArrNewElem, findJsonObj, getCurrentDate, isWithin24Hours, nowDateUTC } from '../util/tools';
import { timestMonth } from '../util/const';
import { notificationOpenSettings } from '../util/permissions';
import { gpsErr, notifAlarm, notifRoleChangeAsk, testPrompt, } from '../util/helperConst';

//styles
import { THEME, mainstyles } from '../theme';
import { TestScreen } from '../util/Admin/TestScreen';
import { ActiveTendersScreen } from '../screens/ActiveTendersScreen';
import { ActiveDriverTendersScreen } from '../screens/ActiveDriverTendersScreen';
import IconHomeDriver from '../components/Svg/IconHomeDriver';
import IconHomeClient from '../components/Svg/IconHomeClient';
import IconClientTnd from '../components/Svg/IconClientTnd';
import IconRoutes from '../components/Svg/IconRoutes';
import IconBurgerMenu from '../components/Svg/IconBurgerMenu';
import { get, post, put } from '../store/features/api/user-api';
import { checkAndUpdCoords, checkPositionDriver } from '../util/geolocationTools';
import { getUserFormDataFromDB, getUserInfoDataFromDB, getUserRatingFdback, getUserTransportInfo, setUserActivities } from '../store/features/api/userInfoForms';
import { connectSocket } from '../util/socket/socket';
import { setInformersStates } from '../util/informersHelpers';
import { CustomTabBarOld } from '../components/CustomTabBarOld';
import { getJsonDataPrompt, getJsonDataSliderData } from '../store/features/api/api-json';
import { getAllUnreadMsg } from '../store/features/api/userInformers';
import { onOpenChatWithPush } from '../util/notificationhelpers';
import { normalize } from '../util/UI/fontsUI';

const Tab = createBottomTabNavigator()
const Search = createNativeStackNavigator()
const Profile = createNativeStackNavigator()
const Tenders = createNativeStackNavigator()
const Create = createNativeStackNavigator()
const Routes = createNativeStackNavigator()
const ActiveTenders = createNativeStackNavigator()
const ActiveDriverTenders = createNativeStackNavigator()
// const Chat = createNativeStackNavigator()

const SearchScreenStack = ({ route, navigation }) => {
  // console.log('route', route)
  const showWelcomeCaurusel = useSelector((state) => state.login.showWelcomeCaurusel)

  return (
    <Search.Navigator screenOptions={{}}
    >
      {
        showWelcomeCaurusel ?
        <Search.Screen name="Splash" component={SplashScreen} 
          options={{
            headerShown: false
          }}
        />
        : null
      }
      <Search.Screen name="Search" component={SearchScreen} 
        options={{
          headerShown: false
        }}
      />
      <Search.Screen name="SearchFilter" component={FilterScreen} 
        options={{
          animation: 'slide_from_right',
          headerShown: false
        }}
      />
      <Search.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Search.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          title:'Чаты'
        }}
      />
      <Search.Screen name="Chat" component={ChatScreen} options={({route})=>({
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      })}/>
    </Search.Navigator>
  )
}
const ActiveDriverTendersScreenStack = ({ route, navigation }) => {
  // console.log('route', route)

  return (
    <ActiveDriverTenders.Navigator screenOptions={{}}
    >
      <ActiveDriverTenders.Screen name="ActiveDriverTenders" component={ActiveDriverTendersScreen} 
        options={{
          headerShown: false
        }}
      />
      <ActiveDriverTenders.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <ActiveDriverTenders.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          title:'Чаты'
        }}
      />
      <ActiveDriverTenders.Screen name="Chat" component={ChatScreen} options={({route})=>({
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      })}/>
    </ActiveDriverTenders.Navigator>
  )
}
const TendersScreenStack = ({ route, navigation }) => {

  //!!!!
  // Platform.OS==='android' ? React.useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   // console.log('routeName', routeName)
  //   if (routeName === "EditStartPoint" || routeName === "EditEndPoint" ||  routeName === 'SearchDivers'){
  //       navigation.setOptions({tabBarStyle: {display: 'none',}});
  //   }else {
  //       navigation.setOptions({tabBarStyle: {display: 'flex',}});
  //   }
  // }, [navigation, route])
  // : null

  return (
    <Tenders.Navigator initialRouteName='Tenders'
      screenOptions={{
        headerShown: false,
        // headerTintColor:  THEME.MAIN_COLOR,
      }}
    >
      <Tenders.Screen name="Tenders" component={TendersScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="SearchDivers" component={SearchDriversScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="TenderItemClient" component={TenderItemClientScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="EditTender" component={EditTenderScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="EditStartPoint" component={EditStartPointScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="EditEndPoint" component={EditEndPointScreen}
        options={{
          headerShown: false
        }}
      />
      <Tenders.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          headerShown: false,
          title:'Сообщения'
        }}
      />
      <Tenders.Screen name="Chat" component={ChatScreen} options={{
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      }}/>
      {/* <Tenders.Screen name="TenderItemArchive" component={TenderItemArchiveScreen} options={{
        headerShown: false,
      }}/> */}
    </Tenders.Navigator>
  )
}
const ActiveTendersScreenStack = ({ route, navigation }) => {

  //!!!!
  // Platform.OS==='android' ? React.useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   console.log('routeName', routeName)
  //   if (routeName === "EditStartPoint" || routeName === "EditEndPoint" ||  routeName === 'SearchDivers'){
  //       navigation.setOptions({tabBarStyle: {display: 'none',}});
  //   }else {
  //       navigation.setOptions({tabBarStyle: {display: 'flex',}});
  //   }
  // }, [navigation, route])
  // : null

  return (
    <ActiveTenders.Navigator 
    // initialRouteName='ActiveTendersTest'
    initialRouteName='ActiveTenders'
      screenOptions={{
        headerShown: false,
        // headerTintColor:  THEME.MAIN_COLOR,
      }}
    >
      <ActiveTenders.Screen name="ActiveTenders" component={ActiveTendersScreen}
        options={{
          headerShown: false
        }}
      />     
      <ActiveTenders.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false
        }}
      />
      <ActiveTenders.Screen name="TestScreen" component={TestScreen}
        options={{
          headerShown: false,
        }}
      />
      <ActiveTenders.Screen name="TenderItemClient" component={TenderItemClientScreen}
        options={{
          headerShown: false
        }}
      />
      <ActiveTenders.Screen name="EditTender" component={EditTenderScreen}
        options={{
          headerShown: false
        }}
      />
      <ActiveTenders.Screen name="EditStartPoint" component={EditStartPointScreen}
        options={{
          headerShown: false
        }}
      />
      <ActiveTenders.Screen name="EditEndPoint" component={EditEndPointScreen}
        options={{
          headerShown: false
        }}
      />
      <ActiveTenders.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          headerShown: false,
          title:'Сообщения'
        }}
      />
      <ActiveTenders.Screen name="Chat" component={ChatScreen} options={{
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      }}/>
    </ActiveTenders.Navigator>
  )
}
const RoutesScreenStack = ({ route, navigation }) => {
  // const role = useSelector((state) => state.login.role)
  // console.log('TS TN', role);
  // const safeInsets = useSafeAreaInsets();

  // //!!!! hide tab bar actual
  // Platform.OS==='android' ? React.useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   console.log('routeName', routeName)
  //   if (routeName === "CreateRoutePoint"||routeName === "EditRoutePoint"){
  //       // navigation.setOptions({tabBarStyle: Platform.OS ==='android'? {display: 'none',} : {display: 'none',height:0, paddingBottom: 0}});
  //       navigation.setOptions({tabBarStyle: {display: 'none'}});
  //   }else {
  //       // navigation.setOptions({tabBarStyle: Platform.OS ==='android'? {display: 'flex',} : {display: 'flex',height:65+safeInsets?.bottom, paddingBottom: safeInsets?.bottom}});
  //       navigation.setOptions({tabBarStyle: {display: 'flex'}});
  //   }
  // }, [navigation, route])
  // : null

  return (
    <Routes.Navigator initialRouteName='Routes'
      screenOptions={{
      }}
    >
      <Routes.Screen name="Routes" component={RoutesScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="CreateRoute" component={CreateRouteScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="CreateRoutePoint" component={CreateRoutePointScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="RouteItem" component={RouteItemScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="EditRoute" component={EditRouteScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="EditRoutePoint" component={EditRoutePointScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false
        }}
      />
      <Routes.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          title:'Сообщения'
        }}
      />
      <Routes.Screen name="Chat" component={ChatScreen} options={{
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      }}/>
    </Routes.Navigator>
  )
}
// const ChatScreenStack = ({route, navigation}) => {

//   // Platform.OS==='ios' ? React.useLayoutEffect(() => {
//   //   const routeName = getFocusedRouteNameFromRoute(route);
//   //   console.log('routeName', routeName)
//   //   if (routeName === "Chat"){
//   //       // navigation.setOptions({tabBarStyle: Platform.OS ==='android'? {display: 'none',} : {display: 'none',height:0, paddingBottom: 0}});
//   //       navigation.setOptions({tabBarStyle: {display: 'none'}});
//   //   }else {
//   //       // navigation.setOptions({tabBarStyle: Platform.OS ==='android'? {display: 'flex',} : {display: 'flex',height:65+safeInsets?.bottom, paddingBottom: safeInsets?.bottom}});
//   //       navigation.setOptions({tabBarStyle: {display: 'flex'}});
//   //   }
//   // }, [navigation, route])
//   // : null

//   return (
//     <Chat.Navigator>
//       <Chat.Screen name="ChatsList" component={ChatsListScreen} 
//       options={{
//         headerShown: false,
//       }}
//       />
//       <Chat.Screen name="Chat" component={ChatScreen} options={({route})=>({
//         headerShown: false,
//         unmountOnBlur: true
//       })}/>
//       <Chat.Screen name="TenderItemScreen" component={TenderItemScreen} options={({route})=>({
//         headerShown: false,
//       })}/>
//       <Chat.Screen name="TenderItemClient" component={TenderItemClientScreen} options={({route})=>({
//         headerShown: false,
//       })}/>
//         <Chat.Screen name="Profile" component={ProfileScreen}
//         options={{
//           headerShown: false,
//           // animation: 'slide_from_right',
//         }}
//       />
//     </Chat.Navigator>
//   )
// }
const ProfileScreenStack = ({route, navigation}) => {

  return (
    <Profile.Navigator
    screenOptions={{
      animation: 'none'
    }}
    >
      <Profile.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: false,
          // animation: 'slide_from_right',
        }}
      />
      <Profile.Screen name="Transport" component={TransportScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="MyTenders" component={MyTendersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="AddTransport" component={AddTransportScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="ProfileUpdate" component={ProfileUpdateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="ProfileNotif" component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="TestScreen" component={TestScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="Splash" component={SplashScreen} 
          options={{
            headerShown: false
          }}
        />
      <Profile.Screen name="ChatsList" component={ChatsListScreen} 
        options={{
          headerShown: false,
        }}
        />
      <Profile.Screen name="Chat" component={ChatScreen} options={({route})=>({
        headerShown: false,
        unmountOnBlur: true,
        gestureEnabled: false,
      })}/>
      <Profile.Screen name="TenderItemScreen" component={TenderItemScreen}
        options={{
          headerShown: false,
        }}
      />
      <Profile.Screen name="TenderItemClient" component={TenderItemClientScreen}
        options={{
          headerShown: false
        }}
      />
    </Profile.Navigator>
  )
}
const CreateScreenStack = ({route, navigation}) => {
  const showWelcomeCaurusel = useSelector((state) => state.login.showWelcomeCaurusel)

  // //!!!! hide tab bar actual
  // Platform.OS==='android' ? React.useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   console.log('routeName', routeName)
  //   if (routeName === "CreateStartPoint"||routeName === "CreateEndPoint"){
  //       navigation.setOptions({tabBarStyle: {display: 'none',}});
  //   }else {
  //       navigation.setOptions({tabBarStyle: {display: 'flex',}});
  //   }
  // }, [navigation, route])
  // : null
  
  return (
    <Create.Navigator screenOptions={{
      headerShown: false
    }}>
      {
        showWelcomeCaurusel ?
        <Search.Screen name="Splash" component={SplashScreen} 
          options={{
            headerShown: false
          }}
        />
        : null
      }
      <Create.Screen name="CreateTender" component={CreateTenderScreen} options={({route})=>({
        })}
      />
      <Create.Screen name="CreateStartPoint" component={CreateStartPointScreen} options={({route})=>({
        })}
      />
      <Create.Screen name="CreateEndPoint" component={CreateEndPointScreen} options={({route})=>({
        })}
      />
    </Create.Navigator>
  )
}

export const TabNavigation = ({navigation}) => {

  const appState = useRef(AppState.currentState);
  const { role, userProfileInfo,userFormsInfo, userFormsActivities,checkUpdFormActivities, checkUpdFormsRouteOffers,userFormsHiddenTenders,driverDeleteTenders } = useSelector((state) => state.login)
  const { currentChatId, arrOfInformers, informerState, informerActiveState,informerRoutesState, checkUnreadMsgInformers } = useSelector((state) => state.listofchats)
  const isActual = useSelector((state) => state.login.isActual)
  const versionInState = useSelector((state) => state.user.version)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const positionDriver = useSelector((state) => state.login.positionDriver)
  
  const [isLoading,setIsLoading] = useState(false)
  const [isShowWarningActualVersion, setIsShowWarningActualVersion] = useState(false)
  const navObj = useSelector(state=>state.user.navigationObjTo)
  const currentDate = useSelector(state=>state.user.currentDate)
  const currentPositionWithAddress = useSelector(state=>state.user.currentPositionWithAddress)
  const isConnectedInternet = useSelector(state=>state.user.isConnectedInternet)
  const askGps = useSelector((state) => state.user.showInfoModal)
  const [isVisibleNotification,setIsVisibleNotification] = useState(false)
  const [isVisibleChangeRoleNotif,setIsVisibleChangeRoleNotif] = useState(false)
  const [notifData,setNotifData] = useState(null)
  const [isShowNotifInfo,setIsShowNotifInfo] = useState(false)
  // console.log('\x1b[41m%s %s\x1b[0m', 'TabNavigation currentChatId:', currentChatId );
  // console.log('\x1b[46m%s %s\x1b[0m', 'TabNavigation arrOfInformers:', arrOfInformers );
  // console.log('\x1b[42m%s %s\x1b[0m', 'TabNavigation currentPositionWithAddress:', currentPositionWithAddress );
  // console.log('\x1b[46m%s %s\x1b[0m', 'TabNavigation informerRoutesState:', informerRoutesState );
  // console.log('\x1b[46m%s %s\x1b[0m', 'TabNavigation userFormsInfo:', userFormsInfo?.profile );
  // console.log('\x1b[46m%s %s\x1b[0m', 'TabNavigation isActual:', isActual, );
  // console.log('\x1b[46m%s %s\x1b[0m', 'TabNavigation positionDriver:', positionDriver, );
  // console.log('TabNavigation role', role)
  
  
  // const msgRef = firestore().collection('messages')
  // const formsRef = firestore().collection('forms')
  // const isDisable = useSelector((state) => state.login.isDisable)
  // const jsonDataCheckVers = useSelector((state) => state.login.jsonDataCheckVers)
  // const dateRefreshPosition = useSelector((state) => state.login.dateRefreshPosition)
  // const [isReady,setIsReady] = useState(false)
  // const blacklist = useSelector((state) => state.user.blacklist)
  // const userState = useSelector((state) => state.user)
  // const hiddenTender = userState.hiddenTender
  // const hiddenTenderClient = userState.hiddenTenderClient
  // const clientActiveTenderState = userState.clientActiveTender
  // const driverActiveTenderState = userState.driverActiveTender
  // const driverRoutesOffers = userState.driverRoutesOffers
  // const tendersActivity = userState.tendersActivity
  // const stateOfMsg = useSelector((state) => state.chats.msgState)
  // const stateOfInformers = useSelector((state) => state.chats.informerState)
  // const stateOfInformersActive = useSelector((state) => state.chats.informerActiveState)
  // const stateOfInformersRoutes = useSelector((state) => state.chats.informerRoutesState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)
  // const [appCheck, setAppCheck] = useState(false)


  const dispatch = useDispatch()

  const handleOpenSettings = () => {
    setIsShowNotifInfo(false)
    notificationOpenSettings()
  }
  const handleChangeRole = () => {
    setIsVisibleChangeRoleNotif(false)
    navigation.navigate('ProfileTab',{
      state: {
        routes: [{
          name: 'Profile',
        }]
      }
    })
  }

  const checkloc = async () => {
    const res = await getCurrentPositionAdressAndCoords(dispatch,onSaveCurrPositionWithAddress, setSatatusGeolocation,setShowInfoModal,setShowStatusGps)
    // console.log('\x1b[46m%s res %s\x1b[0m', res)
    // setCoordsState(res)
  }

  //!!координаты и дата
  useEffect(()=>{
    if(currentDate===null) {
      const result = getCurrentDate()
      dispatch(setCurrentDate(result))
    }
    if(currentPositionWithAddress===null){
      getCurrentPositionAdressAndCoords(dispatch,onSaveCurrPositionWithAddress, setSatatusGeolocation,setShowInfoModal,setShowStatusGps)
    }
    // const res = checkloc()
    // console.log('\x1b[46m%s res %s\x1b[0m', res)
  },[])

  useEffect(()=>{
    if(isConnectedInternet===null) {
      NetInfo.fetch().then(state => {
        // console.log('\x1b[46m%s %s\x1b[0m',"Connection type", state.type);
        // console.log("Is connected?", state.isConnected);
        state.isConnected===false?dispatch(setConnectedInternet(state.isConnected)): null
      });
    }
  },[isConnectedInternet])

  //!!данные профиля
  useEffect(() => {
    getUserFormDataFromDB(dispatch)
    getJsonDataPrompt(dispatch,setJsonDataPrompt,setJsonDataPromptErr)
  },[])

  useEffect(() => {
    if(userProfileInfo !== null) {

      getUserRatingFdback(userProfileInfo.id,dispatch)
    }
  },[userProfileInfo])

  useEffect(() => {
    if(role === 'driver') {
      getUserTransportInfo(dispatch)
    }
  },[role])
  
  //получение непрочитаных сообщений по апи
  useEffect(() => {
    console.log('useEffect getAllUnreadMsg ','checkUnreadMsgInformers:', checkUnreadMsgInformers,appStateVisible)
    if(checkUnreadMsgInformers === true) {
      console.log('useEffect getAllUnreadMsg in if','checkUnreadMsgInformers:', checkUnreadMsgInformers)

      getAllUnreadMsg(dispatch,role)
    }
  },[checkUnreadMsgInformers,role])

  //распределяет информеры по табам (каждый раз как добавляются информеры (с сокета или при загрузке))
  useEffect(() => {
    console.log('useEffect setInformersStates- распределяет информеры по табам',)
    if(arrOfInformers.length > 0 && userProfileInfo !== null) {
      //проверить currentChatId === null что будет если в чате - что с оферами и тд
      // setInformersStates(dispatch,userFormsActivities,userProfileInfo,arrOfInformers)
      //todo убрать из зависимостей поля формы(скрытые, активные, удаленные) оставить только роль и информеры
      setInformersStates(dispatch,role,arrOfInformers,userFormsInfo)
    }
  },[arrOfInformers,role,userFormsInfo])
  //     setInformersStates(dispatch,userFormsActivities,role,arrOfInformers,userFormsHiddenTenders,driverDeleteTenders)
  //   }
  // },[arrOfInformers,userFormsActivities,role,userFormsHiddenTenders,driverDeleteTenders])

  // позиция пользователя currentPositionWithAddress - NEW
  useEffect(() => {
    if(role==='driver' && currentPositionWithAddress !== null) {
      positionDriverCheckAndSet(positionDriver,dispatch,userProfileInfo.id,currentPositionWithAddress,setPositionDriverWithTime)
      // if(positionDriver === null || positionDriver === undefined) {
        
      //   checkTimeAndPosition(positionDriver,dispatch,userProfileInfo.id,currentPositionWithAddress,setPositionDriverWithTime)
      // } else {
      //   // //TODO проверять позицию на 24 ч и затем выполнять обновление
      //   check24hPosition(positionDriver,dispatch,currentPositionWithAddress,setPositionDriverWithTime)
      // }
    }
  },[role,currentPositionWithAddress])

  //notif nav fn
  useEffect(() => {
    console.log('\x1b[42m%s %s\x1b[0m', 'TN navObj', navObj)
    if(navObj !==null) {
      if(userProfileInfo.role !== navObj.partnerRole) {
        Keyboard.dismiss()
        setIsLoading(true)
        setTimeout(() =>
          onOpenChatWithPush(navObj,userProfileInfo,navigation,setIsLoading,dispatch)
        ,2000)
      } else {
        Keyboard.dismiss()
        setIsVisibleChangeRoleNotif(true)
        dispatch(setNavigationObjTo(null))
      }
    }
  },[navObj])

  // !!setAppStateVisible
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
        ) {
      console.log('\x1b[42m%s %s\x1b[0m', 'useEffect TabNavigation appStateVisible:', appStateVisible, );
      console.log('App has come to the foreground!');
      dispatch(setCheckUnreadMsgInformers(true))
    }

    appState.current = nextAppState;
    // setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      {
        askGps===true ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'gpsErr',gpsErr)} 
            onPress={()=>dispatch(setShowInfoModal(false))}/>
        </View>
        :
        null
      }
      {/* test nav to chat */}
      {/* {
        false && __DEV__ ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'testPrompt',testPrompt)} 
            onPress={()=>navToChat(navObj,role,'Chat',navigation,setIsLoading,uid,)}/>
        </View>
        :
        null
      } */}
      {
        isShowWarningActualVersion===true ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <PromptComponent data={{
            "name": "versionCheck",
            "img": "",
            "title": `Ваша версия приложения устарела`,
            "text": `Актуальная версия приложения ${versionInState}, версия вашего приложения ${isActual?.version ? isActual?.version : '-'}. Обновите версию приложения для корректной работы`,
            "button": "Закрыть"
          }}
          onPress={()=>setIsShowWarningActualVersion(false)}>
            <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/cargo-radar.appspot.com/o/alert.png?alt=media&token=b7cf317d-8b85-4160-8c06-90aa58500ebe'}} style={{width: 50, alignSelf: 'center',aspectRatio:1, paddingBottom: 20}}/>
            </PromptComponent>
        </View>
        :
        null
      }
      {
        isLoading ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999,backgroundColor: '#fff'}]}>
          <ActivityIndicator color='#205CBE' size='large'/>
        </View>
        :
        null
      }
      {
        // true ? 
        isConnectedInternet===false ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <PromptNetConnection data={{}} onPress={()=>dispatch(setConnectedInternet(true))}/>
        </View>
        :
        null
      } 
      {
        // true ? 
        isShowNotifInfo ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <InfoAskWindow data={findJsonObj(jsonDataPrompt,'notifAlarm',notifAlarm)
            // {title: 'Пуш-нотификации не включены',text:'Для того что бы получать пуш уведомления перейдите в Настройки телефона и разрешите получать уведомления. Вы можете менять настроки получения уведомлений в Профиле приложения.',button1:'В настройки',button2:'Закрыть'}
            } onPress={handleOpenSettings} onClose={()=>setIsShowNotifInfo(false)}/>
        </View>
        :
        null
      } 
      {
        // true ? //todo проверить
        isVisibleNotification ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999}]}>
          <InfoAskWindow data={notifData?.dataShow} onClose={()=>{setNotifData(null),setIsVisibleNotification(false)}} onPress={()=>{navToChat(notifData,role,'Chat',navigation),setNotifData(null),setIsVisibleNotification(false)}}/>
        </View>
        :
        null
      } 
      {
        // true ? //todo проверить
        isVisibleChangeRoleNotif ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999,backgroundColor: 'transparent'}]}>
          <TouchableOpacity onPress={()=>{setNotifData(null),setIsVisibleChangeRoleNotif(false)}} 
            style={[mainstyles.containerModalGgBl,{flex:1, }]}
            />
          <InfoAskWindow data={findJsonObj(jsonDataPrompt,'notifRoleChangeAsk',notifRoleChangeAsk)} 
          onClose={()=>{setNotifData(null),setIsVisibleChangeRoleNotif(false)}} 
          onPress={() => handleChangeRole()}/>
        </View>
        :
        null
      } 
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display: 'flex',
          },
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontSize: normalize(12),
            fontWeight: 500,
          },

          tabBarActiveTintColor: "#205CBE",
          tabBarInactiveTintColor: "#BDBDBD"
        })}
        id="tabs"
        tabBar={(props) => <CustomTabBar {...props} style={{}}/>}
        // tabBar={(props) => <CustomTabBarOld {...props} style={{}}/>}
      >
        {
          role === 'driver' ? 
            <Tab.Screen name="SearchTab" component={SearchScreenStack}
              listeners={({ navigation, route }) => ({
                tabPress: e => {
                  const state = navigation.getState();
                  const isFocused = route.key === state.routes[state.index].key;
                  currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                  if (!isFocused) {
                    navigation.navigate('SearchTab', { screen: 'Search' });
                  }
                },
              })}
              options={{
                tabBarLabel: "Поиск",
                tabBarBadge: informerState?.length > 0 ? informerState?.length : null,
                tabBarIcon: ({focused}) => <IconHomeDriver color={focused ? THEME.PRIMARY:THEME.GREY400}/>
                
              }}/>
            :
            <Tab.Screen name="CreateTab" component={CreateScreenStack} 
              listeners={({ navigation, route }) => ({
                  tabPress: e => {
                    const state = navigation.getState();
                    const isFocused = route.key === state.routes[state.index].key;
                    currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                    if (!isFocused) {
                      navigation.navigate('CreateTab', { screen: 'CreateTender' });
                    }
                  },
              })}
            options={({route}) => ({
              tabBarLabel: "Создать",
              tabBarIcon: ({focused}) => <IconHomeClient color={focused ? THEME.PRIMARY:THEME.GREY400}/>
            })}/>          
        }
        {
          role === 'driver' ? 
          <Tab.Screen name="ActiveDriverTendersTab" component={ActiveDriverTendersScreenStack} 
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                const state = navigation.getState();
                const isFocused = route.key === state.routes[state.index].key;
                currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                if (!isFocused) {
                  navigation.navigate('ActiveDriverTendersTab', { screen: 'ActiveDriverTenders' });
                }
              },
            })}
            options={{
            tabBarLabel: "В работе",
            tabBarBadge: informerActiveState?.length > 0 ? informerActiveState?.length : null,
            tabBarIcon: ({focused}) => <Icon name="direction" size={20} color={focused ? THEME.PRIMARY:THEME.GREY400} />
            // <IconHomeDriver />
          }}/>          
          :
          <Tab.Screen name="TendersTab" component={TendersScreenStack} 
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                const state = navigation.getState();
                const isFocused = route.key === state.routes[state.index].key;
                currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                if (!isFocused) {
                  navigation.navigate('TendersTab', { screen: 'Tenders' });
                }
              },
            })}
            options={{
            tabBarLabel: "Мои заказы",
            tabBarBadge: informerState?.length > 0 ? informerState?.length : null,
            tabBarIcon: ({focused}) => <IconClientTnd color={focused ? THEME.PRIMARY:THEME.GREY400}/>
          }}/>
        }
        {
          role === 'driver' ? 
          <Tab.Screen name="RoutesTab" component={RoutesScreenStack}
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                const state = navigation.getState();
                const isFocused = route.key === state.routes[state.index].key;
                currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                if (!isFocused) {
                  navigation.navigate('RoutesTab', { screen: 'Routes' });
                }
              },
            })}
            options={({route})=>({
              tabBarLabel: "Маршруты",
              tabBarBadge: informerRoutesState?.length > 0 ? informerRoutesState?.length : null,
              tabBarIcon: ({focused}) => <IconRoutes color={focused ? THEME.PRIMARY:THEME.GREY400}/>
            })}/>
            :
          <Tab.Screen name="ActiveTendersTab" component={ActiveTendersScreenStack} 
            listeners={({ navigation, route }) => ({
              tabPress: e => {
                const state = navigation.getState();
                const isFocused = route.key === state.routes[state.index].key;
                currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
                if (!isFocused) {
                  navigation.navigate('ActiveTendersTab', { screen: 'ActiveTenders' });
                }
              },
            })}
            options={{
              tabBarLabel: "В работе",
              tabBarBadge: informerActiveState?.length > 0 ? informerActiveState?.length : null,
              tabBarIcon: ({focused}) => <Icon name="direction" size={20} color={focused ? THEME.PRIMARY:THEME.GREY400}/>
            }}/>
        }
        <Tab.Screen name="ProfileTab" component={ProfileScreenStack}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              const state = navigation.getState();
              const isFocused = route.key === state.routes[state.index].key;
              currentChatId !== null ? dispatch(setCurrentChatId(null)) : null
              if (!isFocused) {
                navigation.navigate('ProfileTab', { screen: 'Profile' });
              }
            },
          })}
        options={{
          tabBarLabel: "Меню",
          tabBarIcon: ({focused}) => <IconBurgerMenu color={focused ? THEME.PRIMARY:THEME.GREY400}/>
        }}/>
        
      </Tab.Navigator>
    </>
  )
}

  // <Tab.Navigator
  //   screenOptions={({route}) => ({
  //     headerShown: false,
  //     tabBarStyle: {
  //       display: 'flex',
  //     },
  //     tabBarHideOnKeyboard: true,
  //   })}
  //   id="tabs"
  //   tabBar={(props) => <CustomTabBar {...props} style={{}}/>}
  // >
  //   {
  //     role === 'driver' ? 
  //       <Tab.Screen name="SearchTab" component={SearchScreenStack} options={{
  //         tabBarLabel: "Поиск",
  //         tabBarBadge: informerState?.length > 0 ? informerState?.length : null,
  //         tabBarIcon: () => <IconHomeDriver />
  //       }}/>
  //       :
  //       <Tab.Screen name="CreateTab" component={CreateScreenStack}
  //         listeners={({ navigation, route }) => ({
  //           tabPress: e => {
  //             const state = navigation.getState();
  //             const isFocused = route.key === state.routes[state.index].key;
  //             if (!isFocused) {
  //               navigation.navigate('CreateTab', { screen: 'CreateTender' });
  //             }
  //           },
  //       })}
        
  //       options={({route}) => ({
  //         tabBarLabel: "Создать",
  //         tabBarIcon: () => <IconHomeClient />
          
  //       })}/>          
  //   }
  //   {
  //     role === 'driver' ? 
  //     <Tab.Screen name="ActiveDriverTendersTab" component={ActiveDriverTendersScreenStack} options={{
  //       tabBarLabel: "В работе",
  //       tabBarBadge: informerActiveState?.length > 0 ? informerActiveState?.length : null,
  //       tabBarIcon: () => <IconHomeDriver color={'red'}/>
  //       // <IconHomeDriver />
  //     }}/>          
  //     :
  //     <Tab.Screen name="TendersTab" component={TendersScreenStack} 
  //     listeners={({ navigation, route }) => ({
  //         tabPress: e => {
  //           const state = navigation.getState();
  //           const isFocused = route.key === state.routes[state.index].key;
  //           if (!isFocused) {
  //             navigation.navigate('TendersTab', { screen: 'Tenders' });
  //           }
  //         },
  //       })}
  //     options={{
  //       tabBarLabel: "Мои заказы",
  //       tabBarBadge: informerState?.length > 0 ? informerState?.length : null,
  //       tabBarIcon: ({focused}) => <IconClientTnd color={focused ? 'red' : 'blue'}/>
  //     }}/>
  //   }
  //   {
  //     role === 'driver' ? 
  //     <Tab.Screen name="RoutesTab" component={RoutesScreenStack} options={({route})=>({
  //         tabBarLabel: "Маршруты",
  //         tabBarBadge: stateOfInformersRoutes?.length > 0 ? stateOfInformersRoutes?.length : null,
  //         tabBarIcon: () => <IconRoutes />
  //       })}/>
  //       :
  //     <Tab.Screen name="ActiveTendersTab" component={ActiveTendersScreenStack} options={{
  //         tabBarLabel: "В работе",
  //         tabBarBadge: informerActiveState?.length > 0 ? informerActiveState?.length : null,
  //         tabBarIcon: () => <IconHomeDriver />
  //         // <IconHomeDriver />
  //       }}/>
  //   }
  //   <Tab.Screen name="ProfileTab" component={ProfileScreenStack} 
  //   listeners={({ navigation, route }) => ({
  //         tabPress: e => {
  //           const state = navigation.getState();
  //           const isFocused = route.key === state.routes[state.index].key;
  //           if (!isFocused) {
  //             navigation.navigate('ProfileTab', { screen: 'Profile' });
  //           }
  //           // if (isFocused) {
  //           //   // сброс именно вложенного стека, без огромного payload
  //           //   navigation.dispatch(
  //           //     CommonActions.reset({
  //           //       index: 0,
  //           //       routes: [{ name: 'Profile' }],
  //           //     })
  //           //   );
  //           // }
  //         },
  //       })}
  //   options={{
  //     tabBarLabel: "Меню",
  //     tabBarIcon: () => <IconBurgerMenu color={'#205CBE'}/>
  //     // tabBarButton: (props) => (<Pressable 
  //     //   style={({pressed})=>[{backgroundColor: pressed ? 'blue':'red'}]}
  //     //     onPress={()=>{console.log('props:',props)}}
  //     //   ><Text>123</Text></Pressable>)
  //   }}/>
    
  // </Tab.Navigator>




  //!! notification request
  // useEffect(()=>{
    
  //   //!!lдобавить запрос на разрешеник нотификаций
  //   //https://github.com/zoontek/react-native-permissions#requestnotifications

  //   //есть открытие настроек
  //   //Open application settings.
    
  //   checkNotifications().then(({status, settings}) => {
  //     // console.log('checkNotifications----status', status)
  //     // console.log('checkNotifications----settings', settings)
  //     // requestNotifications([]).then(({status, settings}) => {
  //     //   console.log('requestNotifications---status', status)
  //     //   console.log('requestNotifications---settings', settings)
  //     // });
  //     if(status !== 'granted') {
  //       // openSettings().catch(() => console.warn('cannot open settings'));
  //       if(Platform.OS === 'android') {
  //         setIsShowNotifInfo(true)

  //       } else if(Platform.OS === 'ios') {
  //         requestNotifications(["sound", "badge",]).then(({status, settings}) => {
  //           console.log('requestNotifications ios----status', status, settings)
  //         });
  //       }
  //     } else {
  //     }
  //   })
  // },[])
  

  // const handleGetVersion = async () => {
  //   const res = await getVresion(dispatch,setIsActualInfo,setIsActualInfoError,setAppCheck)
  //   console.log('res', res)
  //   // setAppVersion(res)
  // }

  // const handleCompareVersion = async () => {
    
  //   // console.log('1', versionInState !== null && isActual !== null)
  //   // console.log('1 versionInState, isActual', versionInState,isActual)
  //   if(versionInState !== null && isActual !== null) {
  //     if(versionInState < isActual?.version && appCheck) {
  //       // console.log('2', versionInState < isActual?.version)
  //       setIsShowWarningActualVersion(true)
  //     }
  //   }    
  // }

  //!! AppVersion
  // useEffect(()=>{
  //   handleGetVersion()
  // },[])

  // useEffect(()=>{
  //   handleCompareVersion()
  // },[versionInState,isActual,appCheck])

    //todo перенести в setInformersStates по взятию в работу от клиента или офер по маршруту -то в форме уже будет нужный айди в стейте
  //todo убрать этот код
  // useEffect(() => {
  //   //когда будут приходить сообщения
  //   if(checkUpdFormActivities !== null && role ==='driver' && currentChatId === null) {
  //     console.log('TN checkUpdFormActivities client accept dr', checkUpdFormActivities)
  //     // в setInformersStates есть похожий код на офер - подумать над общей функцией
  //     //если водителя выбрали исполнителем и он не в чате то обновить стейт активностей для информеров
  //     // console.log('userFormsActivities.driverActiveTender', userFormsActivities.driverActiveTender)
  //     if(!userFormsActivities.driverActiveTender.includes(checkUpdFormActivities)) {
  //       //чаты в неактивном? информеры не показывать
  //       setUserActivities(dispatch, { "driverActiveTender": userFormsActivities.driverActiveTender.concat(checkUpdFormActivities)}).then(() => {
  //         dispatch(setCheckUpdFormActivities(null))
  //       })
  //     }
  //   }
  // },[checkUpdFormActivities,userFormsActivities,role,currentChatId])

  //todo проверить юзэфекты ниже
  // useEffect(()=>{
  //   // console.log('\x1b[43m%s %s\x1b[0m', 'askGps', askGps)
  // },[askGps])

  // useEffect(()=>{
  //   // console.log('\x1b[43m%s %s\x1b[0m', '!!!!!!!!', )
  //   // auth().currentUser.reload()
  // },[])

  // useEffect(()=>{
  //   // console.log('\x1b[43m%s %s\x1b[0m', 'jsonDataCheckVers', )
  //   if(jsonDataCheckVers?.length > 0 && jsonDataCheckVers[0]) {
  //   }
  // },[jsonDataCheckVers])


  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     // console.log('\x1b[35m%s %s\x1b[0m', '!!!remoteMessage!!!', remoteMessage);
  //     // !! dispatch(setNotificationData(remoteMessage)) через стейт&?
  //     // notifyAllDriverReject
  //     // - попап водителю когда водитель не выбран исполнителем по заявке в которой он участвовал в обсуждении или чат торгах

  //     // acceptBet
  //     // -попап водителю когда водитель выбран исполнителем по заявке

  //     // acceptedByDriver
  //     // - попап заказчику когда водитель принял ставку по заявке
  //     if(remoteMessage?.data?.typeNotif === 'notifyAllDriverReject' && role === 'driver') {
  //       getTenderHidden(uid, dispatch, userProfileTenderHidden)
  //     }
  //     // console.log('\x1b[42m%s %s\x1b[0m', 'role', role, 'remoteMessage?.data', remoteMessage?.data)

  //     if(
  //       remoteMessage?.data?.typeNotif === 'acceptedByDriver' ||
  //       remoteMessage?.data?.typeNotif === 'notifyAllDriverReject' ||
  //       remoteMessage?.data?.typeNotif === 'acceptBet' ||
  //       remoteMessage?.data?.typeNotif === 'orderCanceled' 
  //     ) {
  //       // console.log('\x1b[43m%s %s\x1b[0m', 'receiverRole compare, **role & remoteMessage?.data?.receiverRole**',
  //       // role, remoteMessage?.data?.receiverRole, remoteMessage?.data?.receiverRole !== role);
  //       // console.log('\x1b[43m%s %s\x1b[0m', 'type of role & receiverRole',role, remoteMessage.data.receiverRole,
  //       // typeof(role), typeof(remoteMessage?.data?.receiverRole));

  //       if(remoteMessage?.data?.receiverRole !== role) {
  //         // console.log('\x1b[46m%s %s\x1b[0m', '!!!remoteMessage receiverRole!!!',role, remoteMessage?.data);
  //         setIsVisibleChangeRoleNotif(true)
  //         return
  //       } else {
  //         // console.log('\x1b[46m%s %s\x1b[0m', '!!!remoteMessage setNotifData!!!', remoteMessage?.data);
  //         setNotifData({
  //           data: remoteMessage?.data, 
  //           dataShow: {
  //             title: remoteMessage?.notification?.title,
  //             text: remoteMessage?.notification?.body,
  //             button1: 'Посмотреть', 
  //             button2: 'Закрыть',
  //           }})
  //         setIsVisibleNotification(true)
  //       }

  //     }

  //     // {"collapseKey": "com.cargoradar.main", "data": {}, "from": "586273366428", "messageId": "0:1676707692847132%32a5c9f032a5c9f0", "notification": 
  //     // {"android": {}, "body": "Заказ отклонен клиентом в 18.02.2023 10:8", "title": "Test111 отказался от заказа Test21q"}, "sentTime": 1676707692839, "ttl": 2419200}
        
  //     // {
  //     //   "collapseKey": "com.cargoradar.main",
  //     //   "data": {
  //     //     "clientId": "cS0i0NnsJmVrrDYP9swlwdkaPH72", 
  //     //     "dataExist": "yes", 
  //     //     "tenderId": "owaYi2CKaiWWQvaYwdBj", 
  //     //     "tenderName": "Test34@87-&", 
  //     //     "type": "chat", 
  //     //     "userId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2"
  //     //   }, 
  //     //   "from": "586273366428", 
  //     //   "messageId": "0:1700675252264850%32a5c9f032a5c9f0", 
  //     //   "notification": {
  //     //     "android": {}, 
  //     //     "body": "Vg", 
  //     //     "title": "Zakj2qy. Заявка Test34@87-&."
  //     //   }, 
  //     //   "sentTime": 1700675252253, 
  //     //   "ttl": 2419200
  //     // }
  //   });

  //   return unsubscribe;
  // }, [role]);


  //todo скрыть  !!msg прослушка сообщений 
  // useEffect(()=>{
  //   if(isReady) {

  //     const unsubscribe = msgRef.where('partnerId', '==', uid).where('createdAt', '>', timestMonth).onSnapshot((querySnapshot) => {
  //       // console.log('\x1b[41m%s %s\x1b[0m','TN msgRef прослушка partnerId==uid', querySnapshot.size, 'role', role)
  
  //       let refreshHidden = new Set()
  //       let msgTenders = []
  //       let tendersId = []
  //       let tendersIdTime = []
  //       let tendersIdActive = []
  //       let tendersIdTimeActive = []
  //       let tendersIdRoutes = []
  //       let tendersIdTimeRoutes = []
  //       querySnapshot.docChanges().forEach((change) => {
  //         if(change.type === 'added') {
  //           console.log('\x1b[42m%s %s\x1b[0m','change.type === added ', change.doc.data().tenderId)
  //           //сообщения самому себе не будут отображаться
  //           //чат не должен быть в  blacklist
  //           //чат не должен быть в неактивных(уточнить, пока сделаю проверку)
  //           //userId - владелец сообщения
  //           if (
  //             change.doc.data().read === false &&
  //             change.doc.data().userId !== uid &&
  //             change.doc.data().partnerRole === role
  //           ) {
  //             console.log('read === false', )
  //               let isActive =  false
  //               let isRoute = driverRoutesOffers.includes(change.doc.data().tenderId)
  //               if(role === 'driver') {
  //                 isActive =  driverActiveTenderState.includes(change.doc.data().tenderId)
  //               } else {
  //                 isActive = clientActiveTenderState.includes(change.doc.data().tenderId)
  //               }
  //               // console.log('\x1b[42m%s %s\x1b[0m','isActive ', isActive,'isRoute',isRoute)
  //             // console.log('!! message added: => blacklist: \n', blacklist, 'hiddenTender: \n', hiddenTender)
  //             let inBlackList = blacklist?.length > 0 && blacklist.find(elem => elem.tenderId === change.doc.data().tenderId &&  elem.userId === change.doc.data().partnerId ) //obj or undefined
  //             // console.log('change.type added inBlackList', inBlackList)
              
  //             // //!!если было не прочитаное сообщение в стейте и чат удалили то удалять это сообщение из стейта
  //             // if(stateOfMsg.includes(change.doc.id) && inBlackList !== undefined  && inBlackList !== false) {
  //             //   dispatch(updMsg([change.doc.id]))
  //             // }

  //             //!!проверка если заявка в черном листе то убирать ее из стейта информеров 
  //             if(inBlackList !== undefined && inBlackList !== false) {
  //               // console.log(' 686 inBlackList', inBlackList)
                
                
  //               let resultActive = stateOfInformersActive?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               let resultInfo = stateOfInformers?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               if(role === 'client') {
  //                 //проверять оба стейта на удаление
  //                 if (resultActive !== undefined) {
  //                   dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 //если есть в общем стейте то удалять
  //                 if (resultInfo !== undefined) {
  //                   dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }                
  //               } else if(role === 'driver') {
  //                 //!!TODO для водителя
  //                 //проверять оба стейта на удаление
  //                 if (resultActive !== undefined) {
  //                   dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 let resultRoutes = stateOfInformersRoutes?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId  && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //                 if (resultRoutes !== undefined) {
  //                   dispatch(updInformerRoutesState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 if (resultInfo !== undefined) {
  //                   dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //               }
  //             }
  
  //             let inHidden
  //             if(role === 'driver') {
  //               inHidden = hiddenTender?.length > 0 && hiddenTender.includes(change.doc.data().tenderId) //true or false
                
  //             } else {
  //               inHidden = hiddenTenderClient?.length > 0 && hiddenTenderClient.find(item => item.tenderId === change.doc.data().tenderId && item.userId === change.doc.data().userId)
  //             }

  //             if(inHidden) {
  //               //!!если заявка в неакитвном но остался информер удалять информер
  //               let resultInfo = stateOfInformers?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               let resultActive = stateOfInformersActive?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               // console.log('resultInfo', resultInfo)
  //               // console.log('resultActive', resultActive)
  //               if(role === 'client') {
  //                 //проверять оба стейта на удаление
  //                 if (resultActive !== undefined) {
  //                   dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 //если есть в общем стейте то удалять
  //                 if (resultInfo !== undefined) {
  //                   dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }                
  //               } else if(role === 'driver') {
  //                 //!!TODO для водителя
  //                 //проверять оба стейта на удаление
  //                 if (resultActive !== undefined) {
  //                   dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 let resultRoutes = stateOfInformersRoutes?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //                 if (resultRoutes !== undefined) {
  //                   dispatch(updInformerRoutesState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //                 if (resultInfo !== undefined) {
  //                   dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                 }
  //               }
  //             }
  
  //             console.log('inBlackList', inBlackList, 'inHidden', inHidden,hiddenTender)
  //             //!! msg not in blacklist and not hidden
  //             //* добавление информеров */
  //             if((inBlackList === undefined || inBlackList === false) && (inHidden === false || inHidden === undefined)) {
  //               // console.log('change.type added, inBlackList && inHidden', inBlackList, inHidden)
  //               //сообщения нет в стейте
  //               // console.log('stage stateOfMsg', stateOfMsg )
  //               // !stateOfMsg.includes(change.doc.id) ? msgTenders.push(change.doc.id) : null
                
  //               //проверка  стейта есть ли эл-т с айди этого пользователя(кто прислал сообщение) и айди заявки
  //               let resultInfo = stateOfInformers?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               let resultActive = stateOfInformersActive?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               console.log('resultInfo', resultInfo)
  //               console.log('resultActive', resultActive)
  //               if(role === 'client') {
  //                 //проверка айди заявки в clientActiveTender - стейт стейт активних заявок или архивных
  //                 //если в активных то в стейт активных,если нет то в общий
  //                 if(isActive) {
  //                   //!!если есть в общем стейте то удалять
  //                   if (resultInfo !== undefined) {
  //                     dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                   }
  //                   //добавлять в активные либо менять время
  //                   if(resultActive === undefined) {
  //                     tendersIdActive.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                   }
  //                 } else {
  //                   if(resultInfo === undefined) {
  //                     tendersId.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                   }
  //                 }
  //               } else if(role === 'driver') {
  //                 //!!TODO для водителя
  //                 // driverActiveTenderState,driverRoutesOffers,stateOfInformersRoutes
  //                 let resultRoutes = stateOfInformersRoutes?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //                 // console.log('resultRoutes', resultRoutes)
  //                 if(isActive) {
  //                   //!!проверять был ли информер в маршрутах или общих и удалять
  //                   if (resultInfo !== undefined) {
  //                     // console.log('resultInfo !== undefined', resultInfo !== undefined)
  //                     dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                   }
  //                   if (resultRoutes !== undefined) {
  //                     // console.log('resultRoutes !== resultRoutes', resultRoutes !== resultRoutes)
  //                     dispatch(updInformerRoutesState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //                   }
  //                   if(resultActive === undefined) {
  //                     // console.log('resultActive === undefined', resultActive === undefined)
  //                     tendersIdActive.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                   } 
  //                   // else {
  //                   //   // console.log('resultActive !== undefined', resultActive !== undefined)
  //                   //   tendersIdTimeActive.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                   // }
  //                 } else {
  //                   // console.log('!!! change.doc.data()', change.doc.data())                  
  //                   if(isRoute) {
  //                     if(resultRoutes === undefined) {
  //                       // console.log('resultRoutes === undefined', resultRoutes === undefined)
  //                       tendersIdRoutes.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                     } 
  //                     // else {
  //                     //   // console.log('resultRoutes !== resultRoutes', resultRoutes !== resultRoutes)
  //                     //   tendersIdTimeRoutes.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                     // }
  //                   } else {
  //                     if(resultInfo === undefined) {
  //                       // console.log('resultInfo === undefined', resultInfo === undefined)
  //                       tendersId.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                     } 
  //                     // else {
  //                     //   tendersIdTime.push({tenderId: change.doc.data().tenderId, userId: change.doc.data().userId, createdAt: change.doc.data().createdAt.toMillis()})
  //                     // }
  //                   }
  //                 }
  //               }
  //             }
  
  //           } else if(
  //             change.doc.data().read !== false &&
  //             change.doc.data().userId !== uid &&
  //             change.doc.data().partnerRole === role
  //           ) {
  //             //*убирание информеров в прочитанных сообщениях */
  
  //             // if(stateOfMsg.includes(change.doc.id)) {
  //             //   dispatch(updMsg([change.doc.id]))
  //             // }
              
  //             //!!если сообщение найдено то отправляем на удаление (логика как и проверке блеклиста)
  //             let resultActive = stateOfInformersActive?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //             let resultInfo = stateOfInformers?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //             if(role === 'client') {
  //               //проверять оба стейта на удаление
  //               if (resultActive !== undefined) {
  //                 dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               //если есть в общем стейте то удалять
  //               if (resultInfo !== undefined) {
  //                 dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }                
  //             } else if(role === 'driver') {
  //               //!!TODO для водителя
  //               //проверять оба стейта на удаление
  //               if (resultActive !== undefined) {
  //                 dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               let resultRoutes = stateOfInformersRoutes?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               if (resultRoutes !== undefined) {
  //                 dispatch(updInformerRoutesState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               if (resultInfo !== undefined) {
  //                 dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //             }
  //           }
  //         }
  
  //         if(change.type ==='modified') {
  //           // console.log('\x1b[41m%s %s\x1b[0m','change.type === modified ', change.doc.data().tenderId)
  //           // console.log('change.type === modified ', change.doc.data())
  //           if(change.doc.data().read !== false &&
  //           change.doc.data().userId !== uid &&
  //           change.doc.data().partnerRole === role) {
  //             //если сообщение прочитано в чате но еще осталось в стейте редакса
  //             // console.log('TN modified if change.doc.data().read !== false', change.doc.id,change.doc.data(), stateOfMsg.includes(change.doc.id))
              
  //             // if(stateOfMsg.includes(change.doc.id)) {
  //             //   dispatch(updMsg([change.doc.id]))
  //             // }
  
  //             //!!если сообщение найдено то отправляем на удаление
  //             let resultActive = stateOfInformersActive?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //             let resultInfo = stateOfInformers?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //             if(role === 'client') {
  //               //проверять оба стейта на удаление
  //               if (resultActive !== undefined) {
  //                 dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               //если есть в общем стейте то удалять
  //               if (resultInfo !== undefined) {
  //                 dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }                
  //             } else if(role === 'driver') {
  //               //!!TODO для водителя
  //               //проверять оба стейта на удаление
  //               if (resultActive !== undefined) {
  //                 dispatch(updInformerActiveState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               let resultRoutes = stateOfInformersRoutes?.find(elemFind => elemFind.tenderId === change.doc.data().tenderId && elemFind.userId === change.doc.data().userId && elemFind.createdAt === change.doc.data().createdAt.toMillis())
  //               if (resultRoutes !== undefined) {
  //                 dispatch(updInformerRoutesState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //               if (resultInfo !== undefined) {
  //                 dispatch(updInformerState([{tenderId: change.doc.data().tenderId, userId: change.doc.data().userId,createdAt: change.doc.data().createdAt.toMillis()}]))
  //               }
  //             }
  //           }
  //         }
          
  //       })
  //       // console.log('---msgTenders', msgTenders)
  //       // console.log('---tendersId', tendersId)
  //       // console.log('---tendersIdActive', tendersIdActive)
  //       // console.log('---tendersIdRoutes', tendersIdRoutes)
        
  //       if(msgTenders.length > 0) {
  //         dispatch(onMsgState(msgTenders))
  //       }
  //       if(tendersId.length > 0) {
  //         dispatch(setInformerState(tendersId))
  //       }
  //       if(tendersIdActive.length > 0) {
  //         dispatch(setInformerActiveState(tendersIdActive))
  //       }
  //       if(tendersIdRoutes.length > 0) {
  //         dispatch(setInformerRoutesState(tendersIdRoutes))
  //       }
  //       // if(tendersIdTime.length > 0) {
  //       //   dispatch(setInformerState(tendersIdTime))
  //       //   let uniqueElements = Object.values(tendersIdTime.reduce((acc, obj) => {
  //       //     if (!acc[obj.tenderId] || acc[obj.tenderId].createdAt < obj.createdAt) {
  //       //       acc[obj.tenderId] = obj;
  //       //     }
  //       //     return acc;
  //       //   }, {}));
  //       //   // console.log('tendersIdTime', tendersIdTime)
  //       //   // console.log('uniqueElements', uniqueElements)
  //       //   dispatch(updateTimeInformerState(uniqueElements))
  //       // }
  //       // if(tendersIdTimeActive.length > 0) {
  //       //   let uniqueElementsActive = Object.values(tendersIdTimeActive.reduce((acc, obj) => {
  //       //     if (!acc[obj.tenderId] || acc[obj.tenderId].createdAt < obj.createdAt) {
  //       //       acc[obj.tenderId] = obj;
  //       //     }
  //       //     return acc;
  //       //   }, {}));
  //       //   // console.log('tendersIdTimeActive', tendersIdTimeActive)
  //       //   // console.log('uniqueElementsActive', uniqueElementsActive)
  //       //   dispatch(updateTimeInformerActiveState(uniqueElementsActive))
  //       // }
  //       // if(tendersIdTimeRoutes.length > 0) {
  //       //   let uniqueElementsRoutes = Object.values(tendersIdTimeRoutes.reduce((acc, obj) => {
  //       //     if (!acc[obj.tenderId] || acc[obj.tenderId].createdAt < obj.createdAt) {
  //       //       acc[obj.tenderId] = obj;
  //       //     }
  //       //     return acc;
  //       //   }, {}));
  //       //   // console.log('tendersIdTimeRoutes', tendersIdTimeRoutes)
  //       //   // console.log('uniqueElementsActive', uniqueElementsActive)
  //       //   dispatch(updateTimeInformerRoutesState(uniqueElementsRoutes))
  //       // }
  //     })
  //     return () => {
  //       console.log('\x1b[41m%s %s\x1b[0m','TN msgRef return unsubscribe', )
  //       unsubscribe()
  //     }
  //   }
  // },[role,userState,isReady,appStateVisible])
  
  // !!прослушка профиля для обновления данных
  // useEffect(()=>{
  //   if(isReady) {

  //     const unsubscribe = formsRef.where('profile.phone', '==', auth()?.currentUser?.phoneNumber).onSnapshot((querySnapshot) => {
  //       // console.log('\x1b[46m%s %s\x1b[0m','TN formsRef прослушка profile', querySnapshot.size,role)
  
  //       // let refreshHidden = new Set()
  //       // let refreshHidden = []
  //       querySnapshot.docChanges().forEach((change) => {
            
  //         if(change.type ==='modified') {
  //           // console.log('change.type === modified ', change.doc.data())
  
  //           //!!!если акк пользователя заблокирован то вылогинивать и отпраялять на скрин с пояснением
  //           // console.log('\x1b[45m%s %s\x1b[0m','DISABLED', isDisable, change.doc.data()?.disabled)
  //           if(change.doc.data()?.disabled === true) {
  //             //logout и чистка стейта
  //             //отправка в стейт флага для перехода на скрин с поддержкой
  //             dispatch(setUserDisable({flag: true, text: change.doc.data()?.disabledMsg}))
  //             dispatch(setIsLogin(false))
  //             dispatch(setIsAuth(false))
  //             // auth().currentUser.reload()
  //             auth()
  //             .signOut()
  //             .then(() => {
  //               console.log('User signed out!')
  //               dispatch(setUserProfileInfo(null))          
  //               // auth().currentUser.reload()
  //               navigation.reset({
  //                 index: 0,
  //                 routes: [{
  //                   name: 'AuthStack', 
  //                   state: { routes: [{name: 'DisableScreen',}] }
  //                 }],
  //               })
  //             })
  //           } else if(change.doc.data()?.disabled === false && isDisable === true) {
  //             console.log('\x1b[45m%s %s\x1b[0m','DISABLED FALSE', change.doc.data()?.disabled)
  //             dispatch(setUserDisable({flag: false, text: change.doc.data()?.disabledMsg}))
  //           }
  
  //           //* обновление стейта неактивных чатов и активных заявок и заявок по маршруту *//
  //           if(role === 'driver') {
  //             console.log('hiddenTender', hiddenTender)
  //             // console.log('driverRoutesOffers', driverRoutesOffers)
  //             // console.log('driverActiveTenderState', driverActiveTenderState)
  //             // console.log('send hiddenTenders to redux', change.doc.data()?.hiddenTenders)
  //             let checkHide = checkArrNewElem(change.doc.data()?.hiddenTenders,hiddenTender)
  //             checkHide?.identical === false ? dispatch(userProfileTenderHidden(change.doc.data()?.hiddenTenders)) : null
  //             // console.log('checkHide', checkHide)
              
  //             let checkRouteOffer = checkArrNewElem(change.doc.data()?.driverRoutesOffers,driverRoutesOffers)
  //             checkRouteOffer?.identical === false ? dispatch(setDriverRoutesOffersState(change.doc.data()?.driverRoutesOffers)) : null
  //             // console.log('checkRouteOffer', checkRouteOffer)
              
  //             let checkActiveTender = checkArrNewElem(change.doc.data()?.driverActiveTender,driverActiveTenderState)
  //             checkActiveTender?.identical === false ? dispatch(setDriverActiveTenderState(change.doc.data()?.driverActiveTender)) : null
  //             // console.log('checkActiveTender', checkActiveTender)

  //             let checkTenderActivity = checkArrNewElem(change.doc.data()?.driverTenderActivity,tendersActivity)
  //             checkTenderActivity?.identical === false ? dispatch(setDriverTenderAvtivity(change.doc.data()?.driverTenderActivity)) : null
  //             // dispatch(setDriverRoutesOffersState(change.doc.data()?.driverRoutesOffers))
  //             // dispatch(setDriverActiveTenderState(change.doc.data()?.driverActiveTender))
  //           } else {
  //             // console.log('send hiddenTendersClient to redux', change.doc.data()?.hiddenTendersClient)   
  //             // let checkHide = checkArrNewElem(change.doc.data()?.hiddenTendersClient,hiddenTenderClient)     
  //             // checkHide.identical === false ? dispatch(userProfileTenderHiddenClient(change.doc.data()?.hiddenTendersClient)) : null    
  //             //у клиента другой объект - написать фун-я (в редаксе есть похожее с обновл информеров)
  //             // let checkHide = checkArrNewElem(change.doc.data()?.hiddenTenders,hiddenTender)
  //             // checkHide?.identical === false ? dispatch(userProfileTenderHidden(change.doc.data()?.hiddenTenders)) : null
  //             dispatch(userProfileTenderHiddenClient(change.doc.data()?.hiddenTendersClient))

  //             let checkActiveTender = checkArrNewElem(change.doc.data()?.clientActiveTender,clientActiveTenderState)
  //             checkActiveTender?.identical === false ? dispatch(setClientActiveTenderState(change.doc.data()?.clientActiveTender)) : null

  //           }
  //            //TODO добавить отправку по driverTenderActivity
  //         }        
  //       })
        
  //     })
  //     return () => {
  //       console.log('\x1b[41m%s %s\x1b[0m','TN formsRef return unsubscribe', )
  //       unsubscribe()
  //     }
  //   }
  // },[role,userState,isReady,appStateVisible])

  // !!навигация по пушам
  
      