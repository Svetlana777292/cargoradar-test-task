import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView,Linking, KeyboardAvoidingView, Platform, Keyboard, BackHandler, ActivityIndicator } from 'react-native';

//packages
// import {Picker} from '@react-native-picker/picker';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
// import messaging from '@react-native-firebase/messaging';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';


//functions && features && slice
import { logoutUser, setIsLogin, userRole } from '../store/features/loginSlice';
import { setUserProfileInfo } from '../store/features/loginSlice';
import { writeLog } from '../util/firebase';
import { height, width } from '../util/helperConst';

//components
import TopFloatBg from '../components/Svg/TopFloatBg';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import InputBtLine from '../components/Inputs/InputBtLine';

//styles
import { SIZE, THEME, mainstyles } from '../theme';
import { DropDownListCustom } from '../components/DropDownListCustom';
import { get, getRequest, put, registration } from '../store/features/api/user-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeToken, setToken } from '../util/asyncstor';
import { updateProfile } from '../util/userprofile';
import { getFCMToken, requestUserPermissionNotif } from '../util/notificationhelpers';
import { setNotifStatus } from '../store/features/addPermissionsSlice';
import { normalize } from '../util/UI/fontsUI';

export const CreateProfileScreen = ({route, navigation}) => {
  // console.log('CreateProfileScreen:', route)
  const currUser = {}//auth().currentUser
  const safeInsets = useSafeAreaInsets()
  const version = useSelector((state) => state.user.version)
  const { userPhone } = useSelector((state) => state.login)
  const {userProfileInfo: info, } = useSelector((state) => state.login)
  console.log('info', info)

  console.log('userPhone', userPhone)
  const [roleTitle,setRoleTitle] = useState(null)
  const [user, setUser] = useState({
    name: null,
    email: '',
    role: null,
    driverAvatar: null,
    clientAvatar: null,
    unp: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [disableBtn, setDisableBtn] = useState(true) 
  const [showWelcome, setShowWelcome] = useState(false)
  const dispatch = useDispatch()

  const handleSaveProfile = async() => {
    setIsLoading(true)
      
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      // console.log('getData token', value);
    }

    //сохранение и отправка данных в firebase
    let profileUserObj = {
      name: user.name,
      role:  user.role,
      email:  user.email,
      unp:  "123",
      organization: "123",
      phone: userPhone
    }
    console.log('profileUserObj', profileUserObj);

    try {
      const response = await registration(profileUserObj,value)
      console.log('response registr', response)
      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        
        if(response?.error === "The email has already been taken.") {
          
          setIsLoading(false)
          setEmailErr(response?.error === 'Такой email уже зарегистрирован')
        } else if(response?.error === "User already registered"){
          const checkProfile = await get('users/me')
          if (!response.success) {
            console.warn('Ошибка запроса:', response.error);

            setIsLoading(false)
            alert(response.error);
            return;
          }
          if(checkProfile !== null && checkProfile !== undefined && checkProfile.data.hasOwnProperty("id")) {
            console.log('checkProfile', checkProfile)
            updateProfile(dispatch,checkProfile.data)
            setShowWelcome(true)
            setIsLoading(false)
          }

        } else {
          alert(response.error);
          setEmailErr('Ошибка регистрации. Попробуйте еще раз')
        }
        setIsLoading(false)
        return;
      }
      //!! todo проверить как работает
      const notifstatus = await requestUserPermissionNotif()
      dispatch(setNotifStatus(notifstatus))
      // if(notifstatus === 'granted') {
      const token = await getFCMToken()
      let objForm = {
        name: user.name,
        role:  user.role,
        email:  user.email,
        phone: userPhone,
        fcm_token: token
      }
      const respUser = await put('users/me',objForm)
      if (!respUser.success) {
        console.warn('Ошибка запроса respUser:', respUser.error);
        setIsLoading(false)
        setEmailErr(respUser.error);
        return;
      }
      console.log('respUser', respUser.data)
      // if(respUser.data.fcm_token !== null) {
      //   dispatch(setNotifStatus(notifstatus))
      // }
      // } else {
      //   dispatch(setNotifStatus(notifstatus))
      // }

      // const respUser = await get('users/me')
      // if (!respUser.success) {
      //   console.warn('Ошибка запроса:', respUser.error);

      //   setIsLoading(false)
      //   setEmailErr(response.error);
      //   return;
      // }
      if(respUser !== null && respUser !== undefined && respUser.data.hasOwnProperty("id")) {
        console.log('respUser', respUser)
        updateProfile(dispatch,respUser.data)
        setShowWelcome(true)
        setIsLoading(false)
        emailErr !== '' ? setEmailErr('') : null
      }
      

    } catch (error) {
      console.log('registration error', error)
      setEmailErr(error);
      setIsLoading(false)
    }
  }
  const handlegetprofile = async() => {
    // setIsLoading(true)
    // {"message": "User already registered"}
    const value = await AsyncStorage.getItem('token');
    if (value !== null && value !== undefined) {
      console.log('getData token', value);
      try {
        return response = await getRequest(value, 'users/me')
        console.log('response getProfile', response)
      } catch (error) {
        return console.log('error', error)
      }
    }
  }

  // const getUserToken = () => {
  //   console.log('getUserToken', )
  //   try {
  //     messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('\x1b[45m%s %s\x1b[0m', 'messaging token: ', token);
  //       try {
  //         firestore().collection('forms').doc(auth().currentUser.uid).update({
  //           // 'profile.tokens': firestore.FieldValue.arrayUnion(token)
  //           'profile.tokens': [token]
  //         }).then(()=>{
  //           writeLog(auth().currentUser.uid,{
  //             type: 'Auth set token success',
  //             token: token,
  //             version: version
  //           })
  //         })
  //       } catch (error) {
  //         console.log('firestore update token error:', error)
  //       }
  //     });
  //     } catch (error) {
  //       console.log('messaging get token error:', error)
  //     }
  //     //old code wrong get token method
  //     // currUser.getIdToken().then(result => {
  //     //   console.log('\x1b[41m%s %s\x1b[0m', 'getIdToken result', result);
  //     //   setUserToken(result)
  //     //   console.log('\x1b[43m%s %s\x1b[0m', 'token res', auth().currentUser.getIdTokenResult().then(res => {
  //     //     console.log('res', res)
  //     //   }));
  //     //   firestore().collection('forms').doc(currUser).update({
  //     //     'profile.tokens': firestore.FieldValue.arrayUnion(result)
  //     //   })
  //     // })
  // }

  const ValidateEmail = (text) => {
    console.log('validate text:' ,text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    console.log('text', reg.test(text))
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      setUser({...user, email: text })
      setEmailErr('Введите корректный email')
      // return false;
    } else {
      setUser({...user, email: text })
      setEmailErr('')
      console.log("Email is Correct");
    }
  }
  const setValueRole = (value) => {
    console.log('setValueRole value', value)
    setUser({
      ...user,
      role: value.value
    })
    // role: value === 'Заказчик' ? 'client' : 'driver'
    setRoleTitle(value.value === 'client' ? 'Заказчик': 'Водитель')
  }
  const handleLink = (flag) => {
    switch (flag) {
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

  useEffect(()=>{
    // console.log('user', user,roleTitle)
    if((user.role ==='driver'||user.role==='client')&&user.name!==undefined&&user.name!==null&&user.name?.length>0) {
      setDisableBtn(false)
    }
  },[user])

  async function qwe() {
      // dispatch(logoutUser())

      await removeToken()
    }
  // useEffect(() => {
  //    qwe()
  // },[])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('onBackPress ',)
        if (true) {
          navigation.goBack()
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'padding'} 
      style={{flex:1}}
    >
      <View style={styles.container} scrollEnabled={false}>
        {
          isLoading  ?
          <View style={[mainstyles.containerModalGgBl,{minHeight: height,flex:1,zIndex: 999,justifyContent: 'center',}]}>
            <ActivityIndicator color={'#fff'} size={'large'}/>
          </View>
          :null
        }
        {
          !showWelcome ?
          <>
            <ScrollView style={styles.wrappera} contentContainerStyle={{backgroundColor: 'transparent',minHeight: height}}>
              <View style={styles.topWrapper}>
                <View style={styles.imgContainer}>
                  <TopFloatBg />
                </View>
                <View style={styles.topTextContainer}>
                  <Text style={[mainstyles.text32SB,{color: '#fff',textAlign: 'center', paddingBottom: 10}]}>Представьтесь!</Text>
                  <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>Пожалуйста, заполните свои данные ниже</Text>
                </View>
              </View>
              <View style={[styles.wrapper,{backgroundColor: 'transparent',paddingTop: 25, paddingBottom: 20}]}>
                <View style={{position: 'relative', paddingBottom: 30}}>
                  <InputBtLine 
                    value={user.name}
                    setValue={(text)=>setUser({...user,name: text})}
                    plctext={"Имя"}
                    inputProps={{
                      placeholderTextColor: THEME.GREY700
                    }}
                    styleInput={[{marginBottom: 10, paddingLeft:  15,},Platform.OS==='ios'?{paddingTop: 15}:null]}
                  />
                  <InputBtLine 
                    value={user.email}
                    setValue={(text)=>ValidateEmail(text)}
                    plctext={"Email"}
                    inputProps={{
                      placeholderTextColor: THEME.GREY700
                    }}
                    styleInput={[{marginBottom: 10,paddingLeft:  15},Platform.OS==='ios'?{paddingTop: 15}:null]}
                  />
                  <View style={[{paddingBottom: 0}]}>
                    <DropDownListCustom
                      text={'Роль'} 
                      data={[{title: 'Заказчик',value: 'client'},{title: 'Водитель',value: 'driver'}]}
                      value={roleTitle}
                      setValue={setValueRole}
                      stylesContainer={styles.dropContainer}
                      baseStylesValue={styles.dropValue}
                      stylesItems={styles.dropItem}
                    />
                  </View>
                  {
                    emailErr !== '' ?
                    <Text style={[mainstyles.text16R,{color:THEME.RED, paddingVertical: 5}]}>{emailErr}</Text>
                    :null
                  }
                </View>
                <View style={[{backgroundColor:'transparent', flex: 1, justifyContent: 'space-between',}]}>
                  <View style={[{backgroundColor:'transparent'}, mainstyles.pV10, ]}>
                    <DefaultBtn title={'Далее'} onPress={handleSaveProfile} disabled={disableBtn}/>
                    {/* {__DEV__ && <DefaultBtn title={'logout'} onPress={() => dispatch(logoutUser(),removeToken())} disabled={false}/>} */}
                    {/* {__DEV__ && <DefaultBtn title={'check'} onPress={handlegetprofile} disabled={false}/>} */}
                  </View>
                  <View style={[styles.botTextContainer,{}]}>
                    <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20, }]}>Создавая аккаунт, вы соглашаетесь с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
                      <Text style={mainstyles.text14R}> и </Text>
                      <Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
          :
          <View style={styles.wrapper}>
            <View style={styles.topWrapper}>
              <View style={styles.imgContainer}>
                <TopFloatBg />
              </View>
              <View style={[styles.topTextContainer,{width: '80%'}]}>
                <Text style={[mainstyles.text32SB,{color: '#fff',textAlign: 'center', paddingBottom: 10}]}>Добро пожаловать!</Text>
                <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>Начнем работу.</Text>
                
              </View>
            </View>
            <View style={{flex: 1,alignItems: 'center', backgroundColor: 'transparent',justifyContent: 'center',width:'70%'}}>
                <Text style={[mainstyles.text18R,styles.textMid]}>Регистрация прошла успешно! Для продолжения нажмите  кнопку.</Text>
            </View>
            <View style={[{flex: 0.5,backgroundColor:'transparent'}, mainstyles.pV10, ]}>
              <DefaultBtn title={'Далее'} onPress={()=>{dispatch(setIsLogin(true))}} disabled={false}/>
            </View>
            <View style={[styles.botTextContainer,{paddingBottom: 20}]}>
              <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20}]}>Создавая аккаунт, вы соглашаетесь с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
                <Text style={mainstyles.text14R}> и </Text><Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
              </Text>
            </View>
          </View>
        }
      </View>
    </KeyboardAvoidingView>
  )
}
  
  // const qwer = (withBtn-30)/2
  
  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#ffffff', 
      width: width,
      // backgroundColor: 'green', 
    },
    wrapper: {
      // backgroundColor: 'green', 
      // height: height,
      flex: 1,
      alignItems: 'center'
    },
    topWrapper: {
      // backgroundColor: 'red', 
      position: 'relative',
      width: width,
      height: 262,
    },
    imgContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    topTextContainer: {
      // backgroundColor: 'transparent',
      position: 'absolute',
      top: 85,
      width: '73%',
      alignSelf: 'center',
      zIndex: 11,
    },
    textMid: {
      textAlign: 'center', 
      paddingBottom: 10, 
      lineHeight: 26, 
      // paddingTop: 15
    },
    botTextContainer: {
      // backgroundColor: 'lightblue', 
      alignSelf: 'center', 
      width: '75%', 
      justifyContent: 'flex-end', 
      // flex:1,
      // paddingBottom: 45
    },
    codeFieldRoot: {
      // backgroundColor: 'purple'
      backgroundColor: '#fff',
    },
    cell: {
      width: 33,
      height: 40,
      lineHeight: 38,
      fontSize: normalize(24),
      borderBottomColor: THEME.GREY400,
      borderBottomWidth: 1,
      textAlign: 'center',
      marginHorizontal: 10
  
    },
    focusCell: {
      backgroundColor: THEME.GREY50
  
    },
    resendCodeWrapper: {
      // flexDirection: 'row',
    },
    dropContainer: {
      // backgroundColor: 'blue',
    },
    dropValue: {
      // backgroundColor: 'pink',
      borderBottomColor: THEME.GREY400,
      borderBottomWidth:1,
      paddingLeft: 15
      
    },
    dropItem: {
      // backgroundColor: 'orange',
      backgroundColor: 'rgba(245,245,245,0.4)',
      // elevation: 30,
      
    },
  });