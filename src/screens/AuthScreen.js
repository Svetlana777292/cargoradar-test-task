import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ScrollView,Platform, Dimensions, KeyboardAvoidingView, Keyboard } from 'react-native';

//packages
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
// import messaging from '@react-native-firebase/messaging';
import PhoneInput from "react-native-phone-number-input";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { setIsAuth, setIsLogin, setUserDisable, userPhone, setUserProfileInfo, userRole, setUserPhone } from '../store/features/loginSlice';
import { writeLog } from '../util/firebase';
import { height, width } from '../util/helperConst';

//components
import TopFloatBg from '../components/Svg/TopFloatBg';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import RoundCloseBtn from '../components/Svg/RoundCloseBtn';
import CaretDown from '../components/Svg/CaretDown';

//styles
import { THEME, mainstyles } from '../theme';
import { login, put, sendcode } from '../store/features/api/user-api';
import { SERVERURL } from '../util/apiVars';
import { getToken, setToken } from '../util/asyncstor';
import { updateProfile } from '../util/userprofile';
import { getFCMToken, requestUserPermissionNotif } from '../util/notificationhelpers';
import { setNotifStatus } from '../store/features/addPermissionsSlice';
import { normalize } from '../util/UI/fontsUI';

export const AuthScreen = ({navigation}) => {
  console.log('AuthScreen ', )
  const safeInsets = useSafeAreaInsets();
  const dispatch =  useDispatch()
  // const isDisable = useSelector((state) => state.login.isDisable)
  const {isLogin: userIsLogged, userProfileInfo: userInfo} = useSelector((state) => state.login)
  // console.log('userInfo==', userInfo)
  const version = useSelector((state) => state.user.version)
  const [logincheck, setLogincheck] = useState(true)
  const [phone, setPhone] = useState()
  const [confirm, setConfirm] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authenticated, setAutheticated] = useState(false)
  const [errorMsgCode, setErrorMsgCode] = useState('')
  // const [version, setVersion] = useState(53) 
  const [validPhone, setValidPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false)
  // const [confirmTest, setConfirmTest] = useState(null)
  // const [user, setUser] = useState()  
  // const [currUser, setCurrUser] = useState('') 
  const [disableBtn, setDisableBtn] = useState(true) 

  const phoneInput = useRef(null);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  // console.log('AuthScreen showWelcomeCaurusel', showWelcomeCaurusel)

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [showErrorCode, setShowErrorCode] = useState(false);
  const CELL_COUNT = 6;
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [timerStart, setTimerStart] = useState('');
  const [isDisablSendCode, setIsDisablSendCode] = useState(true);
  const [isDisableCodeBtn, setIsDisablCodeBtn] = useState(true);
  const [isCarouruselVisible, setIsCarouruselVisible] = useState(false) 
  // console.log('log', logincheck, 'confirm', confirm)
  const refTimer = useRef();

  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = useState(false);


  const timerCallbackFunc = (timerFlag) => {
    // Setting timer flag to finished
    setTimerEnd(timerFlag);
    console.log('timerFlag', timerFlag)
    setIsDisablSendCode(false)
    // console.warn(
    //   'You can alert the user by letting him know that Timer is out.',
    // );
  };
  
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

  const handleSubmitPhone = () => {
    console.log('handleSubmitPhone: ', formattedValue, value)
    Keyboard.dismiss()
    setIsLoading(true)
    setPhone(formattedValue)
    setErrorMsg(false)
    setErrorMsgCode('')
    signInWithPhoneNumber(formattedValue,setTimerStart,setIsDisablSendCode)
    // countdown('clock', 3, 0,setTimerStart,setIsDisablSendCode);
    // //!!!for tests
    // signInWithPhoneNumber('+375555555555')
    // // timerStart
    // countdown('clock', 3, 0,setTimerStart,setIsDisablSendCode);    
    // setIsLoading(true)
  }
  
  async function signInWithPhoneNumber(phoneNumber) {
    
    const response = await login(phoneNumber)
    console.log('signInWithPhoneNumber response', response)

    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      setErrorMsg(response?.error)
      setIsLoading(false)
      if(response?.error === "The email has already been taken.") {
        return;
      }
    }
    //if(response.success) setConfirm(true)
    if(response.data.message === "Verify code sent to your phone number") {
      setConfirm(true)
    }

    setIsLoading(false)
    // setConfirm(confirmation);
    // console.log('confirmation \n',confirmation);
  }
    
  async function confirmCode() {
    try {
      Keyboard.dismiss()
      setIsLoading(true)
      const response = await sendcode({phone: phone, code: code})
      console.log('response code', response.data)
      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        if(response?.error === "Code expired") {
          //код истек показать сообщение отправить заново
          // стереть предыдущий код и заблокировать кнопку
          setCode('')
          // setShowErrorCode(true)
          setErrorMsgCode("Время действия кода истекло")
          setIsDisablSendCode(false)
          setIsLoading(false)
        } else {

          alert(response.error);
          setIsLoading(false)
        }
        return;
      }
      console.log('1 response.data',response.data)
      if(response.data && response.data?.access_token) {
        console.log('data?.access_token',)
        //запись токена в хранилище
        // проверка есть ли профиль
        try {
          await setToken(response.data.access_token)

          if(response.data && response.data.user !== null) {
            console.log('data.user', response.data.user)
            //todo fcm_token получить и записать
            // if(response.data.user.fcm_token === null) {
              const notifstatus = await requestUserPermissionNotif()
              dispatch(setNotifStatus(notifstatus))

              console.log(' AS --- notifstatus', notifstatus)
              const token = await getFCMToken()
              console.log(' AS --- token', notifstatus)

                let objForm = {
                  name: response.data.user.name,
                  role:  response.data.user.role,
                  email:  response.data.user.email,
                  phone: response.data.user.phone,
                  fcm_token: token
                }
                console.log('objForm', objForm)
                const respFormFcm = await put('users/me',objForm)
                if (!respFormFcm.success) {
                  console.warn('Ошибка запроса respFormFcm:', respFormFcm.error);
                }
                console.log('respFormFcm', respFormFcm.data)
                // if(respFormFcm.data.fcm_token !== null) {
                //   dispatch(setNotifStatus(notifstatus))
                // }
                updateProfile(dispatch,respFormFcm.data) //тут без data.user так как put возвращает другую фому 
                
            // } else {

              //запись профиля в хранилище
              //переход в экраны
              // updateProfile(dispatch,response.data.user)
            // }
            dispatch(setIsLogin(true))
            // isDisable === true ? dispatch(setUserDisable({flag: false,text: ''})) : null
            setIsLoading(false)

          } else {
            //создание профиля
            //TODO номер телефона записать в стейт редакса для след скрина
            dispatch(setUserPhone(phone))
            setIsLoading(false)
            navigation.navigate('ProfileStack', {screen: 'CreateProfile'})
          }
        } catch (e) {
          console.log('catch e', e)
          setIsLoading(false)
          setCode('')
          alert('Не удалось сохранить данные авторизации')
          setConfirm(false)
        }

      }  
      // await confirm.confirm(code);
      // setAutheticated(true)
      // setIsLoading(true)
      // setErrorMsgCode(false)
      // setShowErrorCode(false)
      // console.log('confirmCode code \n', code);
    } catch (err) {
      setIsLoading(false)
      console.log('Invalid code. error:', err);
    }
  }

  const cleanTextFields = () => {
    phoneInput.current.setState({number:''})
    setValue('')
    setFormattedValue('')
    setValidPhone(true)
    setDisableBtn(true)
    errorMsg !== false ? setErrorMsg(false):null
  };

  const checklogin = async  () => {
    const token = await getToken()
    console.log('checklogin token ', token)
    if(token !== null && token !== undefined ) {
      // setConfirm(false)
      navigation.navigate('CreateProfile')
    } else {
      setLogincheck(false)
    }
  }

  useEffect(()=>{
    if(value && value?.length > 0) {
      console.log('value', value)
      // if(value != '666666666'&&value!='111111111') {
        const checkValid = phoneInput.current?.isValidNumber(value);
        setValidPhone(checkValid ? checkValid : false);
        setDisableBtn(checkValid ? false : true)
        checkValid ? setErrorMsg(false):null
        console.log('checkValid',checkValid)
      // } else {
      //   console.log('useEffect value: ', value,'disableBtn',disableBtn)
      //   setValidPhone(true)
      //   setDisableBtn(false)
      // }
    }
  },[value])

  useEffect(()=>{
  // console.log('useEffect', value)
  if(code && code!== undefined && code?.length === 6) {
    setIsDisablCodeBtn(false)
  }
  },[code])

  console.log('-----render----', userIsLogged);
  
  useEffect(()=>{
    if(userIsLogged === false && userInfo === null) {
      checklogin()
    } else {
      dispatch(setIsLogin(true))
    }
  },[])
// navigation.navigate('CreateProfile')

  if(logincheck) {
    return (
      <View style={[styles.container]} >
        {
          true  ?
          <View style={[mainstyles.containerModalGgBl,{backgroundColor: '#ffffff', minHeight: height,flex:1,zIndex: 999,justifyContent: 'center',}]}>
            <ActivityIndicator color={THEME.MAIN_COLOR} size={'large'}/>
          </View>
          : null
        }
      </View>
    )
  }

  if (!confirm) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'} 
        style={{flex:1}}
      >
      <View style={[styles.container]} scrollEnabled={false}>
        {
          isLoading  ?
          <View style={[mainstyles.containerModalGgBl,{minHeight: height,flex:1,zIndex: 999,justifyContent: 'center',}]}>
            <ActivityIndicator color={'#fff'} size={'large'}/>
          </View>
          :null
        }
        <ScrollView contentContainerStyle={{backgroundColor: 'transparent',minHeight: height}}>
          <View style={styles.topWrapper}>
            <View style={styles.imgContainer}>
              <TopFloatBg />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={[mainstyles.text32SB,{color: '#fff',textAlign: 'center', paddingBottom: 10}]}>Приветствуем!</Text>
              <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>Для выполнения или создания заказа нужна регистрация</Text>
            </View>
          </View>

          <View style={[styles.wrapper]}>

            <View style={[styles.midContainera,{position: 'relative', paddingBottom: 30}]}>
              <View style={{width:'80%', alignSelf: 'center'}}>
                <Text style={[mainstyles.text18R,styles.textMid]}>Введите номер мобильного телефона для входа или регистрации</Text>
              </View>
              <View style={{position: 'relative'}}>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={value}
                  defaultCode="BY"
                  layout="first"
                  onChangeText={(text) => {
                    setValue(text);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                  }}
                  withShadow={false}
                  autoFocus={false}
                  renderDropdownImage={<CaretDown/>}
                  containerStyle={{backgroundColor: '#fff',borderBottomColor: THEME.GREY400, borderBottomWidth: 1, height: 70}}
                  // countryPickerButtonStyle={{backgroundColor: 'transparent'}}
                  textContainerStyle={{backgroundColor: 'transparent'}}
                  textInputStyle={{color: THEME.GREY600, paddingVertical: 0,fontSize: normalize(14)}}
                  codeTextStyle={{color: THEME.GREY600, fontWeight: '400', fontSize: normalize(14)}}
                  flagButtonStyle={{}}
                  withDarkTheme={false}
                  placeholder={'(29) 111 11 11'}
                  filterProps={{maxLength: 20}}
                  textInputProps={{placeholderTextColor: '#757575'}}
                  // mask={'([00]) [0] [0000]-[0000]'}
                />
                <TouchableOpacity style={{position: 'absolute', right: 0, top: 20, width: 30, height: 30,backgroundColor: 'transparent',
                  justifyContent: 'center', alignItems: 'center'}}
                  onPress={cleanTextFields}
                  >
                  <RoundCloseBtn />
                </TouchableOpacity>
              </View>
              {
                validPhone === false&& value?.length>0?
                <Text style={[mainstyles.text13R,{color:THEME.RED}]}>Неверно введен номер телефона</Text>
                :null
              }
              {
                errorMsg  ?
                <Text style={[mainstyles.text13R,{color:THEME.RED}]}>{errorMsg}</Text>
                :null
              }
            </View>

            <View style={[styles.bottomContainer]}>

              <View style={[styles.midBtnContainera, mainstyles.pV10,]}>
                <DefaultBtn title={'Отправить'} onPress={handleSubmitPhone} disabled={disableBtn}/>            
              </View>
              <View style={styles.botTextContainer}>
                <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20}]}>Создавая аккаунт, вы соглашаетесь с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
                <Text style={mainstyles.text14R}> и </Text><Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    )
  } else {

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'padding'} 
      style={{flex:1}}
      >
      <View style={[styles.container]} contentContainerStyle={{height:height,flex:1,}} scrollEnabled={false}>
        {
          isLoading  ?
            <View style={[mainstyles.containerModalGgBl,{minHeight:height,flex:1,zIndex: 999,justifyContent: 'center',}]}>
              <ActivityIndicator color={'#fff'} size={'large'}/>
            </View>
            :null
        }
        <ScrollView contentContainerStyle={{backgroundColor: 'transparent',minHeight: height}}>
          <View style={styles.topWrapper}>
            <View style={styles.imgContainer}>
              <TopFloatBg />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={[mainstyles.text32SB,{color: '#fff',textAlign: 'center', paddingBottom: 10}]}>Верификация!</Text>
              <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>Пожалуйста, введите 6-значный код, отправленный вам на номер </Text>
              <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>{formattedValue}</Text>
            </View>
          </View>
          <View style={[styles.wrapper]}>
            <View style={[styles.midContainera,{position: 'relative', paddingTop: 25, paddingBottom: 30, backgroundColor: 'transparent'}]}>
              <View style={{position: 'relative',}}>
                <CodeField
                  ref={ref}
                  {...props}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={code}
                  onChangeText={setCode}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      key={index}
                      style={[styles.cellWrapper, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}
                    >
                    <Text style={[[styles.cell, mainstyles.text18R,{}]]}>
                      {symbol || (isFocused ? <Cursor /> : <Text style={[mainstyles.text18R,{color: THEME.GREY400,}]}>{index+1}</Text>)}
                    </Text>
                    </View>
                  )}
                />
              </View>
              <View style={{paddingVertical: 5,width: '80%', alignSelf: 'center'}}>
                {
                  errorMsgCode !== '' ?
                  <Text style={[mainstyles.text14R,{color:THEME.RED,textAlign: 'center'}]}>{errorMsgCode}</Text>
                  : null
                }
              </View>
              <View style={{alignItems: 'center', }}> 
                <Text style={[mainstyles.text18R,{color: THEME.GREY800, textAlign: 'center'}]}>Не получили код?</Text>
                <TouchableOpacity
                  style={styles.resendCodeWrapper}
                  // onPress={()=>{setTimerEnd(false), refTimer.current.resetTimer()}} disabled={isDisablSendCode}>
                  onPress={()=>{handleSubmitPhone(),setTimerEnd(false), refTimer.current.resetTimer()}} disabled={isDisablSendCode}>
                  <CountDownTimer
                    ref={refTimer}
                    timestamp={180}
                    timerCallback={timerCallbackFunc}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    textStyle={[mainstyles.text18SB,{color: THEME.GREY800}]}
                  />
                  <Text style={[mainstyles.text18SB,{color: THEME.GREY800}]}>{timerStart}  Отправить еще раз</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.bottomContainer,{backgroundColor: 'transparent'}]}>
  
              <View style={[styles.midBtnContainera, mainstyles.pV10, ]}>
                <DefaultBtn title={'Далее'} onPress={()=>{confirmCode()}} disabled={isDisableCodeBtn}/>
              </View>
              <View style={styles.botTextContainer}>
                <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20}]}>Создавая аккаунт, вы соглашаетесь с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
                  <Text style={mainstyles.text14R}> и </Text><Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
                </Text>
              </View>
            </View>
  
          </View>
        </ScrollView>
      </View>
  
      </KeyboardAvoidingView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffffff', 
    width:width,
    // backgroundColor: 'orange', 
  },
  wrapper: {
    // height: height,
    // backgroundColor: 'orange', 
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20
  },
  topWrapper: {
    // backgroundColor: 'red', 
    position: 'relative',
    width: width,
    // flex: 1,
    height: 262,
  },
  imgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  topTextContainer: {
    // backgroundColor: 'orange',
    position: 'absolute',
    top: 85,
    width: '73%',
    alignSelf: 'center',
    zIndex: 11,
  },
  midContainer: {
    // backgroundColor: 'pink',
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMid: {
    textAlign: 'center', 
    paddingBottom: 15, 
    lineHeight: 26, 
    // paddingTop: 15
  },
  midBtnContainer: {
    // backgroundColor: 'orange',
    flex: 0.4,
  },
  botTextContainer: {
    // backgroundColor: 'lightblue', 
    alignSelf: 'center', 
    width: '75%', 
    justifyContent: 'flex-end', 
  },
  codeFieldRoot: {
    // backgroundColor: 'purple',
    // backgroundColor: '#fff',
    backgroundColor: 'transparent'
  },
  cellWrapper: {
    width: 33,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: THEME.GREY400,
    // shadowColor: 'red',
    // shadowOffset: {width:1, height:2},
    // shadowRadius:1,
    marginHorizontal: 10,
    // backgroundColor: 'red'
    
  },
  cell: {
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    // justifyContent: 'center',
    lineHeight: 38,
    // backgroundColor: 'red',
    fontSize: normalize(24),
  },
  focusCell: {
    backgroundColor: THEME.GREY50
  },
  resendCodeWrapper: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1, 
    justifyContent: 'space-between',
  },
});