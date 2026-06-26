import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Linking, Platform, Modal } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/entypo';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

//components
import { CarItem } from '../components/Car/CarItem';
import { CreateCar } from '../components/Car/CreateCar';
import { CloseBtn } from '../components/CloseBtn';
import IconStarSmallF from '../components/Svg/IconStarSmallF';
import IconTerms from '../components/Svg/IconTerms';
import IconPrivacy from '../components/Svg/IconPrivacy';
import IconHelpQ from '../components/Svg/IconHelpQ';
import { Switch } from '../components/Switch';
import IconDriverWeel from '../components/Svg/IconDriverWeel';
import IconPinMap from '../components/Svg/IconPinMap';
import IconUserAvatar from '../components/Svg/IconUserAvatar';
import InfoAskWindow from '../components/Modal/InfoAskWindow';

//styles
import { SIZE, THEME, generalStyles, mainstyles } from '../theme';

//functions && features && slice
import { onResetMsg, resetInformerState } from '../store/features/chatsSlice';
import { setIsLogin, setCarsInfo, setFirstOpen, setIsAuth, setWelcomeCaurusel, setUserProfileInfo, userRole, logoutUser, setUserFormsInfo, setUserFormsInfoAll } from '../store/features/loginSlice';
import { onReset } from '../store/features/notificationSlice';
import { changeRoleResetListOfChats, logoutResetListOfChats, setChatsStateReset, setCheckUnreadMsgInformers, setListOfChats } from '../store/features/listOfChatsSlice';
import { askLogout, changeRole, exitAsk, height,} from '../util/helperConst';
import { notificationAsk, notificationOpenSettings } from '../util/permissions';
// import { deleteCollectionTender, deleteCollectionMessages,cleanFormsFields,deleteCollectionFeedback,deleteCollectionRepies,deleteCollectionRoute, deleteCollectionPushes, updateUserProfile, deleteCollectionComplains} from '../util/Admin/adminfn';
import { findJsonObj } from '../util/tools';
import { DefaultBtnOutline } from '../components/Buttons/DefaultBtnOutline';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import IconChatsTab from '../components/Svg/IconChatsTab';
import { get, getRequest, put, putRequest } from '../store/features/api/user-api';
import { getToken, removeToken } from '../util/asyncstor';
import { updateProfile } from '../util/userprofile';
import { setUserActivities, setUserFormDataFromDB, setUserHiddenTenders } from '../store/features/api/userInfoForms';
import IconCross from '../components/Svg/IconCross';


export const ProfileScreen = ({route,navigation}) => {
  console.log('\x1b[43m%s %s\x1b[0m', 'ProfileScreen', );
  // navigation.getState()
  
  const {role, userProfileInfo, userFormsInfo, userPhone, carsInfo,userFormsActivities,userFormsHiddenTenders,driverDeleteTenders,testData} = useSelector((state) => state.login)
  // console.log('\x1b[44m%s %s\x1b[0m', 'userProfileInfo', userProfileInfo);
  // console.log('\x1b[45m%s %s\x1b[0m', 'userFormsInfo', userFormsInfo?.profile);
  const safeInsets = useSafeAreaInsets();
  const version = useSelector((state) => state.user.version)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const isActual = useSelector((state) => state.login.isActual)
  const { currentChatId, arrOfInformers, informerState, informerActiveState,informerRoutesState, tenderInformersState,wsErr,wsStatus } = useSelector((state) => state.listofchats)
  const [user, setUser] = useState({
    fullName: '',
    role: '',
    driverAvatar: null,
    clientAvatar: null,
    rating: null,
    unp: ''
  })

  const [transportInfo, setTransportInfo] = useState([])
  const [pushValue,setPushValue] = useState(true)
  const [isShowDialog,setIsShowDialog] = useState(false)
  const [isShowSuccessed,setIsShowSuccessed] = useState(false)
  const [isShowLogoutAsk,setIsShowLogoutAskd] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [isLoadingAvatar,setIsLoadingAvatar] = useState(false)
  const [isshowtestmodal,setisshowtestmodal] = useState(false)
  // const isFocused = useIsFocused();
  // console.log('isFocused', isFocused)
  const dispatch = useDispatch()
  
  const handleTestPress = async() => {
    setisshowtestmodal(true)
    // navigation.navigate("TestScreen")
    // setUserActivities(dispatch, {driverActiveTender: [110,108]})
    // setUserActivities(dispatch, {driverRoutesOffers: [{tenderId:s116,routeId: null,},{tenderId:115,routeId: 27,}]})
    // setUserHiddenTenders(dispatch, {hiddenTenders: [],hiddenTendersClient:[]})
    // setUserFormDataFromDB(dispatch, {deleteTenders: []})
    // let objForm = {

    //   name: userProfileInfo.name,
    //   role:  userProfileInfo.role,
    //   email:  userProfileInfo.email,
    //   phone: userProfileInfo.phone,
    //   fcm_token: null
    // }
    // console.log('objForm', objForm)
    // const respFormFcm = await put('users/me',objForm)
    // console.log('respFormFcm', respFormFcm?.data)


  }
  const onLoadImage = (e) => {
    // console.log('e', e)
    try {
      // const { width, height } = e.nativeEvent.source;
      // console.log('width, height', width, height)
      // if (width && height) {
      //   setAspectRatio(width / height);
      // }
      setIsLoadingAvatar(false)
    } catch (error) {
      console.log('handleImageLoad error', error)
      setIsLoadingAvatar(false)
    }

  }

  const handleGoBack = (role) => {
    role ==='driver'? navigation.navigate('SearchTab') : navigation.navigate('CreateTab')
  }

  const handleLogout = async () => {
    try {
      // setIsLoading(true)
      //удалить токен 
      await removeToken()
      dispatch(logoutResetListOfChats())
      dispatch(logoutUser())
      // очистить профиль

      //       dispatch(onReset()) для нотификаций
      //       dispatch(setUserProfileInfo(null))
      // setIsLoading(false)
      navigation.reset({
        index: 0,
        routes: [{
          name: 'AuthStack', 
          state: { routes: [{name: 'Auth',}] }
        }],
      })


    } catch (error) {
      setIsLoading(false)
      console.log(' handleLogouterror', error)
    }
  }

  const handleLink = (flag) => {
    switch (flag) {
      case 'supp':
        Linking.openURL('https://cargogo.pro/support') 
        break;
      case 'condition':
        Linking.openURL('https://cargogo.pro/terms-of-use.html') 
        break;
      case 'privacy':
        Linking.openURL('https://cargogo.pro/privacy-policy.html')
        break;
    
      default:
        break;
    }
  }   

  //проверка инфы по юзеру(для теста)
  function getUserInfo(documentSnapshot) {
    return documentSnapshot.get('profile');
  } 

  const handleChangeUserRole = async(currRole) => {
    setIsLoading(true)
    const userRoleChange = currRole==='driver'? 'client' : 'driver'
    //todo смена роли - обновлять только роль в стейт редакса (что если роль берется из формы в других скринах? - тогда не подходит)
    console.log('cl', userProfileInfo.clientAvatar)
    console.log('dr', userProfileInfo.driverAvatar)

    let profileObj = {
      'name':  userProfileInfo.name,
      'email':  userProfileInfo.email,
      'phone':  userProfileInfo.phone,
      'role': userRoleChange,
      // 'avatar': currRole==='driver' ? userProfileInfo.clientAvatar : userProfileInfo.driverAvatar
    }
    if(currRole==='driver') {
      if(userProfileInfo.clientAvatar !== null && userProfileInfo.clientAvatar?.length > 0) {
        profileObj.avatar = userProfileInfo.clientAvatar
      }
    } else {
      if(userProfileInfo.driverAvatar !== null && userProfileInfo.driverAvatar?.length > 0) {
        profileObj.avatar = userProfileInfo.driverAvatar
      }

    }
    console.log('profileObj', profileObj)
    try {

      const respUser = await put(`users/me`,profileObj)
              
      if (!respUser.success) {
        console.warn('Ошибка запроса:', respUser.error);
        //
        alert(respUser.error);
        setIsLoading(false)
        return;
      }
      console.log('respUser.data', respUser.data)

      //вся форма
      const respUserForm = await get(`forms`)
              
      if (!respUserForm.success) {
        console.warn('Ошибка запроса:', respUserForm.error);
        //
        alert(respUserForm.error);
        return;
        // setIsLoading(false)
      }
      console.log('respUserForm.data', respUserForm.data)

      dispatch(setUserFormsInfoAll(respUserForm.data))
      updateProfile(dispatch,respUser.data)
      //чистить информеры
      dispatch(changeRoleResetListOfChats())
      // dispatch(setCheckUnreadMsgInformers(true))

      setIsLoading(false)

    } catch (error) {
      console.log('catch handleChangeUserRole error', error)
      alert(error)
      setIsLoading(false)
    }
    
  }

  const getTransportInfo = async () => {
    console.log('getTransportInfo START', )
      // const token = await getToken()
      
      // const response = await getRequest(token, 'cars')
      const response = await get('cars')
      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        alert('error');
        return;
      }
      
      // const data = response.data;
      // console.log('data', data)
      // console.log('response', response)
      setTransportInfo(response.data)
      dispatch(setCarsInfo(response.data))
      // console.log('getTransportInfo response', response, typeof(response))
  }

  // инфа по юзеру из базы
  async function getProfile() {
    const TOKEN = await getToken()

    // console.log('getProfile start')
    console.log('TOKEN',TOKEN)
    // const token = await getToken()
    // const response = await getRequest(token, 'users/me')
    // console.log('response getProfile', response)
    // if(response?.code == 500 || (response.hasOwnProperty('exception') && response?.message) ) {
    //   alert('Ошибка, профиля попробуйте позже')
    //   //тут обсудить что будет возвращать ошибки
    // } else {
    //   updateProfile(dispatch,setUserProfileInfo,response)
    // }

    // if(auth().currentUser !== null) {
    //   try {
    //     firestore().collection('forms')
    //     .doc(auth().currentUser.uid) //uid юзера
    //     .get()
    //     .then(documentSnapshot => getUserInfo(documentSnapshot))
    //     .then(userInfo => {
    //       console.log('userInfo is: ', userInfo.fullName);
    //       if(userInfo) {
    //         // setUserInfo(userInfo)
    //         if(role && role !== userInfo.role) {
    //           //отправляем роль в стейт
    //           dispatch(userRole(userInfo.role))
    //         }
    //         if((role == null || role == undefined) && (userInfo.role == 'client' || userInfo.role == 'driver')) {
    //           dispatch(userRole(userInfo.role))
    //         }
    //         // setroleCurr(userInfo.role)
    //         setUser(userInfo)
    //         dispatch(setUserProfileInfo({
    //           fullName: userInfo.fullName,
    //           role: userInfo.role,
    //           unp: userInfo.unp ?  userInfo.unp : '',
    //           driverAvatar: userInfo.hasOwnProperty('driverAvatar') ? userInfo.driverAvatar : null,
    //           clientAvatar: userInfo.hasOwnProperty('clientAvatar') ? userInfo.clientAvatar : null,
    //           rating: userInfo?.rating,
    //           phone: userInfo?.phone,
    //           quantityTenders: userInfo?.quantityTenders,
    //           quantityOfFinished: userInfo?.quantityOfFinished,
    //           userComplaintsCounter: userInfo?.userComplaintsCounter
              
    //         }))
    //       }
    //     })
    //   } catch (error) {
    //     console.log('getProfile err', error)
    //   }
    // }
    // //обнуляем что бы функция не запускалась
    // // setUpdateProf(false)
  }

  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('START GET getProfile ', )
  //     getProfile()
  //   }, []))

  useFocusEffect(
    
    React.useCallback(() => {
      console.log('START GET  ', )
      if(userFormsInfo.profile?.fcm_token === null) {
        setPushValue(false)
      } else {
        notificationAsk(pushValue,setPushValue)
      }
    }, [route,userFormsInfo])
  )

  useFocusEffect(
    React.useCallback(() => {
      if(role == 'driver') {
        console.log(' ***role***', role);
        getTransportInfo()
      }
    }, [role, route])
  );

  useEffect(()=>{
    // dispatch(resetInformerState())
    
    console.log('----unmount screen----1',);
  },[])
  // console.log('text',  setUserProfileInfo.hasOwnProperty('driverAvatar'))

  return (
    <LinearGradient colors={['rgba(20, 136, 204, 1)', 'rgba(43, 50, 178, 1)']} useAngle angle={-90} style={[styles.grWrap,]}>
      <CloseBtn nameBtn={'cross'} onPress={()=>handleGoBack(role)} sizeBtn={30} colorBtn={'#fff'} styleBtn={[styles.iconClose,{top: safeInsets.top, }]}/>
      {
        userProfileInfo !== null ?
        <View style={[styles.scrVstyles,{flex: 1, backgroundColor: 'transparent',justifyContent: 'space-between',},
          {paddingBottom: Platform.OS==='android' ? safeInsets?.bottom+20: safeInsets?.bottom}]}>
          <ScrollView style={[styles.wrapperC,{backgroundColor: 'transparent', paddingTop: safeInsets.top+20,},]} showsVerticalScrollIndicator={false} >         
            <TouchableOpacity style={[styles.profileContainer,mainstyles.row,styles.lineContainer]} activeOpacity={1} onPress={()=>{navigation.navigate('ProfileUpdate',{profile: userProfileInfo})}}>
              <View style={[styles.avatarContainer]}>
                {
                  userProfileInfo.role === 'driver' ?
                  <View>
                    {
                      userProfileInfo.hasOwnProperty('driverAvatar') && userProfileInfo?.driverAvatar?.length > 0 ?
                      <Image source={{uri: userProfileInfo.driverAvatar}} style={[styles.avatar]}
                        onLoadStart={()=>setIsLoadingAvatar(true)}
                        onLoad={onLoadImage}
                      />
                      :
                      <IconUserAvatar />
                    }
                  </View>
                  :
                  <View>
                    {
                      userProfileInfo.hasOwnProperty('clientAvatar') && userProfileInfo?.clientAvatar?.length > 0 ?
                      <Image source={{uri: userProfileInfo?.clientAvatar}} style={[styles.avatar]}
                        onLoadStart={()=>setIsLoadingAvatar(true)}
                        onLoad={onLoadImage}
                      />
                      :
                      <IconUserAvatar />
                    }
                  </View>
                }
                {
                  isLoadingAvatar ?
                    <View style={[mainstyles.containerModalGgBl,{backgroundColor: 'transparent'},mainstyles.alCjcC]}>
                      <ActivityIndicator color='blue' size='small'/>
                    </View>
                  : 
                  null
                }
              </View>

              <View style={[styles.infoContainer]}>
                <View>
                  <Text style={[mainstyles.text22SB,{color: '#fff', paddingBottom: 3}]}>{userProfileInfo?.name}</Text>
                </View>
                {
                  __DEV__&&
                  <Text style={[mainstyles.text17R,{color: 'pink', paddingBottom: 3}]}>userId: {userProfileInfo?.id}</Text>
                }
                <View style={[mainstyles.rowalC]}>
                  <Text style={[mainstyles.text17R,{color: '#fff',paddingRight: 10,paddingBottom: 3}]}>Рейтинг: {userFormsInfo?.profile?.rating ? userFormsInfo?.profile?.rating : '0.0'}</Text>
                  <IconStarSmallF />
                </View>
                {
                  userProfileInfo.role === 'driver' ?
                  <Text style={[mainstyles.text14R,{color: '#fff'}]}>Профиль: Водитель</Text>
                  :<Text style={[mainstyles.text14R,{color: '#fff'}]}>Профиль: Заказчик</Text>
                }

              </View>
              <View style={[styles.chevronContainer,{position: 'relative'}]}>
                <Icon name='chevron-right' color={"#fff"} size={36} style={styles.chevronIcon}/>
              </View>
            </TouchableOpacity>
            {
              __DEV__&&
              <>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>informerState:</Text>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>{JSON.stringify(informerState)}</Text>
              <View style={mainstyles.lineTop}/>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>informerActiveState:</Text>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>{JSON.stringify(informerActiveState)}</Text>
              <View style={mainstyles.lineTop}/>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>informerRoutesState:</Text>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>{JSON.stringify(informerRoutesState)}</Text>
              <View style={mainstyles.lineTop}/>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>tenderInformersState:</Text>
              <Text style={[mainstyles.text13M,{color:'#fff'}]}>{JSON.stringify(tenderInformersState)}</Text>
              <View style={mainstyles.lineTop}/>
              <View style={{backgroundColor: 'pink'}}>
                <Text style={{color: '#000'}}>{JSON.stringify(userFormsActivities,null,2)}</Text>
              </View>
              <View style={{backgroundColor: '#f8f8f8'}}>
                <Text style={{color: '#000'}}>{JSON.stringify(userFormsHiddenTenders,null,2)}</Text>
              </View>
              <View style={{backgroundColor: 'pink'}}>
                <Text style={{color: '#000'}}>{JSON.stringify(driverDeleteTenders,null,2)}</Text>
              </View>
              </>
            }
            {/* {
              (userProfileInfo.id == 5 || __DEV__) &&
              <View style={{backgroundColor: 'pink'}}>
                <Text style={{color: '#000'}}>{JSON.stringify(testData,null,2)}</Text>
              </View>
            } */}

            <View style={[styles.menuContainer,styles.lineContainer,{position: 'relative'} ]}>
              {/* <View style={{
                position: 'absolute',
                top: 5,
                left: 18,
                width:1,
                height: 400,
                backgroundColor: 'pink',
                zIndex: 999
              }}/>
              <View style={{
                position: 'absolute',
                top: 5,
                left: 30,
                width:1,
                height: 2100,
                backgroundColor: 'green',
                zIndex: 999
              }}/> */}
              <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pB15]} onPress={()=>handleLink('supp')}>
                <IconHelpQ />
                <Text style={[mainstyles.text16R,{color: '#fff',paddingLeft: 12,backgroundColor: 'transparent'}]}>Поддержка</Text>
              </TouchableOpacity>
              <View style={[mainstyles.rowalC,mainstyles.pB15]}>
                <View style={{backgroundColor: 'transparent'}}>
                  <Image source={require('../../assets/image/icon022.png')} style={{width: 20,height: 20,backgroundColor: 'transparent'}}/>
                </View>
                <Text style={[mainstyles.text16R,{color: '#fff',paddingLeft: 10,width: '70%',backgroundColor: 'transparent'}]}>Push-уведомления</Text>
                <Switch value={pushValue} setValue={()=>navigation.navigate('ProfileNotif')} customStyle={{borderColor:'#fff',borderWidth:1}} gradient={['rgba(217, 217, 217, 0.43)','rgba(217, 217, 217, 0.43)']}/>
              </View>
              {/* <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pB15]} onPress={()=>navigation.navigate('ChatsList')}>
                <IconChatsTab width={20} height={13} color={'#fff'}/>
                <Text style={[mainstyles.text16R,{color: '#fff',paddingLeft: 10,backgroundColor: 'transparent'}]}>Сообщения</Text>
              </TouchableOpacity> */}
              {
                userProfileInfo.role === 'driver' ?
                <>
                <Text style={[mainstyles.text16SB,{color: '#fff'},mainstyles.pV10]}>Moй транспорт</Text>
                <View style={[mainstyles.rowalC]}>
                  <CreateCar onPress={()=>navigation.navigate('AddTransport')}/>
                  {
                    transportInfo&&transportInfo?.length>0?
                    <CarItem data={transportInfo}/>
                    : null
                  }
                </View>
                </>
              :
                null
              }
            </View>

            <TouchableOpacity style={[styles.btnChangeRole]} onPress={()=>handleChangeUserRole(role)}>
              {
                role !== null && role==='driver'?
                <View style={[mainstyles.rowalCjcSb,]}>
                  <View style={[{flexDirection: 'column'}]}>
                    <Text style={[mainstyles.text14M,{color: THEME.PRIMARY,}]}>Изменить роль на:</Text>
                    <Text style={[mainstyles.text14M,{color: THEME.PRIMARY,}]}>заказчик </Text>
                  </View>
                  <IconPinMap/>
                </View>
                :
                <View style={[mainstyles.rowalCjcSb,{}]}>
                  <View style={[{flexDirection: 'column'}]}>
                    <Text style={[mainstyles.text14M,{color: THEME.PRIMARY,}]}>Изменить роль на:</Text>
                    <Text style={[mainstyles.text14M,{color: THEME.PRIMARY,}]}>водитель </Text>
                  </View>
                  <IconDriverWeel/>
                </View>
              }
            </TouchableOpacity>

          <View style={{backgroundColor: 'transparent',position: 'relative', paddingBottom: safeInsets?.bottom+50,}}>
            <TouchableOpacity onPress={() => {handleLink('condition')}} 
            style={[mainstyles.rowalCjcSb, {backgroundColor: 'transparent',paddingVertical: 15} ]}>
              <View style={[{backgroundColor: 'transparent', },mainstyles.row]}>
                <IconTerms />
                <Text style={[mainstyles.text16SB, {color:'#fff',paddingLeft: 11,backgroundColor: 'transparent'}]}>Условия пользования</Text>
              </View>
                <Image source={require('../../assets/image/icon021.png')} style={{width: 20,height: 20}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {handleLink('privacy')}} 
            style={[mainstyles.rowalCjcSb,{backgroundColor: 'transparent',paddingVertical: 15,} ]}>
              <View style={[{backgroundColor: 'transparent', },mainstyles.row]}>
                <IconPrivacy />
                <Text style={[mainstyles.text16SB, {color:'#fff',paddingLeft: 13,backgroundColor: 'transparent'}]}>Политика конфиденциальности</Text>
              </View>
                <Image source={require('../../assets/image/icon021.png')} style={{width: 20,height: 20}}/>
            </TouchableOpacity>
          </View>

          </ScrollView>

          <View style={[styles.btnLogutContainer,]}>
              <Text style={[mainstyles.text14R,{color: '#fff', textAlign: 'center', paddingBottom: 8}]}>Версия {version}</Text>
            <View style={[mainstyles.rowalCjcC]}>
              {isActual !== null && isActual?.version != version ?
                <Text style={[mainstyles.text14R,{color: THEME.RED, textAlign: 'center', paddingBottom: 5}]}>Aктуальная версия {isActual?.version}. Установите актуальную версию.</Text>
                : null
              }

            </View>
            <DefaultBtnOutline title={'Выход'} textStyles={{color: '#fff'}} onPress={() => setIsShowLogoutAskd(true)} 
            color='#fff' customStyle={styles.btnLogout}/>
          </View>

        </View>
        : 
        <View style={{justifyContent: 'center', alignContent: 'center',flex: 1}}>
          <Text style={mainstyles.text14B}>Не удалось загрузить профиль</Text>
        </View>
      }
      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top, },mainstyles.alCjcC]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isShowLogoutAsk ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
            <InfoAskWindow data={findJsonObj(jsonDataPrompt,'Exit',exitAsk)} onClose={()=>setIsShowLogoutAskd(false)} onPress={handleLogout}/>
          </View>
        : 
        null
      }
        {/* {__DEV__ ? 
        : null}  */}
          <View style={[mainstyles.alCjcC,{paddingBottom: safeInsets?.bottom, backgroundColor: '#fff'}]}>
            <DefaultBtn disabled={false} title={'testpress'} onPress={handleTestPress} customStyle={{marginBottom: 10}}/> 
            {/* <DefaultBtn title={'nav to test'} onPress={()=>{navigation.navigate('TestScreen')}} customStyle={{marginBottom: safeInsets?.bottom,}}/>  */}
          </View> 
          <Modal
            visible={isshowtestmodal}
            transparent
          >
            <View style={[StyleSheet.absoluteFill, {}]}>
              <View style={{backgroundColor: '#fff',flex:1, width: '100%',paddingTop: safeInsets?.top+20}}>
                <TouchableOpacity onPress={()=>setisshowtestmodal(false)} style={{width:50, height: 50,justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', alignSelf: 'flex-end'}}>
                  <IconCross color={'red'}/>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={{paddingHorizontal:10}}>
                  <Text style={mainstyles.text13M}>wsErr: {wsErr}</Text>
                  <Text style={[mainstyles.text13M]}>wsStatus: {wsStatus}</Text>
                  <View style={[mainstyles.lineTop,{marginTop: 5, borderTopColor: 'red'}]}/>

                  <Text style={mainstyles.text13M}>informerState:</Text>
                  <Text style={mainstyles.text13M}>{JSON.stringify(informerState)}</Text>
                  <View style={mainstyles.lineTop}/>
                  <Text style={mainstyles.text13M}>informerActiveState:</Text>
                  <Text style={mainstyles.text13M}>{JSON.stringify(informerActiveState)}</Text>
                  <View style={mainstyles.lineTop}/>
                  <Text style={mainstyles.text13M}>informerRoutesState:</Text>
                  <Text style={mainstyles.text13M}>{JSON.stringify(informerRoutesState)}</Text>
                  <View style={mainstyles.lineTop}/>
                  <Text style={mainstyles.text13M}>tenderInformersState:</Text>
                  <Text style={mainstyles.text13M}>{JSON.stringify(tenderInformersState)}</Text>
                  <View style={mainstyles.lineTop}/>
                  <View style={{backgroundColor: 'pink'}}>
                    <Text style={mainstyles.text13M}>userFormsHiddenTenders:</Text>
                    <Text style={{color: '#000'}}>{JSON.stringify(userFormsHiddenTenders,null,2)}</Text>
                  </View>
                  <View style={{backgroundColor: '#f8f8f8'}}>
                  <Text style={mainstyles.text13M}>userFormsActivities:</Text>
                    <Text style={{color: '#000'}}>{JSON.stringify(userFormsActivities,null,2)}</Text>
                  </View>
                  <View style={{backgroundColor: 'pink'}}>
                    <Text style={mainstyles.text13M}>driverDeleteTenders:</Text>
                    <Text style={{color: '#000'}}>{JSON.stringify(driverDeleteTenders,null,2)}</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'pink',    
    // flex: 1,
    position: 'relative',
  },
  grWrap: {
    flex:1, 
    height: height
  },
  scrVstyles: {
    height: height,
    paddingHorizontal: 15,    
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  wrapperC: {
    // flex:0.85,
    paddingRight: 35,
    // marginBottom: 60,
    // paddingBottom: 25,
  },
  profileContainer: {
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
    paddingBottom: 26,
  },
  avatarContainer: {
    // backgroundColor: 'blue',
    minWidth: 80,
    width: '22%'
  },
  infoContainer: {
    // backgroundColor: 'green',
    width: '65%',
    paddingLeft: 5
  },
  chevronContainer: {
    // backgroundColor: 'blue',
    alignContent: 'flex-end',
    justifyContent: 'center',
    width: '13%',
  },
  chevronIcon: {
    position: 'absolute',
    right: 8
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: THEME.GREY400
  },

  //menu
  menuContainer: {
    paddingVertical: 20,
  },

  //line
  lineContainer: {
    paddingBottom: 26,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth:1
  },

  //btns
  logoutBtn: {
    backgroundColor: 'transparent',
    borderColor: '#fff', 
    borderWidth:1,
    height:45,
    borderRadius: 100,
    minWidth: 60,
    width: 120
  },
  btnChangeRole: {
    marginTop: 26,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 15,
    marginBottom: 35,
    justifyContent: 'center'
  },
  btnLogutContainer: {
    // flex: 0.15,
    // backgroundColor: 'orange',
    // paddingBottom: 15, 
  },

  iconClose: {
    // backgroundColor: 'red',
    position: 'absolute',
    width: 40,
    height: 40,
    top: 30,
    right: 0,
    zIndex: 998,
    
  },
  btnLogout: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth:1,
    width: 60,
    alignSelf: 'center',
    elevation: 0,
  },
})