import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ScrollView,Platform, Dimensions, KeyboardAvoidingView, Button, SafeAreaView } from 'react-native';

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
import { setIsAuth, setIsLogin, setUserDisable, userPhone, setUserProfileInfo, userRole, setUserPhone } from '../../store/features/loginSlice';
import { writeLog } from '../firebase';
import { height, width } from '../helperConst';

//components
import TopFloatBg from '../../components/Svg/TopFloatBg';
import { DefaultBtn } from '../../components/Buttons/DefaultBtn';
import RoundCloseBtn from '../../components/Svg/RoundCloseBtn';
import CaretDown from '../../components/Svg/CaretDown';

//styles
import { THEME, mainstyles } from '../../theme';
import { login, sendcode } from '../../store/features/api/user-api';
// import { SERVERURL } from '../apiVars';
// import { getToken, setToken } from '../asyncstor';
import { updateProfile } from '../userprofile';
import { TextInput } from 'react-native-gesture-handler';
import { getMessaging, getToken, registerDeviceForRemoteMessages } from '@react-native-firebase/messaging';
// import messaging from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { normalize } from '../UI/fontsUI';

export const AuthScreenTest = ({navigation}) => {
  console.log('AuthScreenTest ', )
  const safeInsets = useSafeAreaInsets();
  // const navigation = useNavigation()
  const dispatch =  useDispatch()
  // const isDisable = useSelector((state) => state.login.isDisable)
  const {isLogin: userIsLogged, userProfileInfo: userInfo} = useSelector((state) => state.login)

  const version = useSelector((state) => state.user.version)
  const [logincheck, setLogincheck] = useState(false)
  const [phone, setPhone] = useState()
  const [confirm, setConfirm] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsgCode, setErrorMsgCode] = useState('')
  const [validPhone, setValidPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false)
  const [disableBtn, setDisableBtn] = useState(true) 

  const phoneInput = useRef(null);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  // console.log('AuthScreen showWelcomeCaurusel', showWelcomeCaurusel)

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const CELL_COUNT = 6;
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [timerStart, setTimerStart] = useState('');
  const [isDisablSendCode, setIsDisablSendCode] = useState(false);
  const [isDisableCodeBtn, setIsDisablCodeBtn] = useState(false);
  const refTimer = useRef();
  const [timerEnd, setTimerEnd] = useState(false);
  

  const [phonetest, setPhonetesst] = useState("+375297297650")
  const [custValue, setCustValue] = useState('');
  const [dataurl, setDataurl] = useState({
    a: "https://cat-fact.herokuapp.com/facts"
  });

  const [showErrorCode, setShowErrorCode] = useState('');
  const [showErrorCodeTry, setShowErrorCodeTry] = useState('');
  const [responseShow, setResponseShow] = useState('');
  const [tokenmsg, setTokenmsg] = useState('-');

  const handleSubmitPhone = () => {
    // console.log('handleSubmitPhone: ', formattedValue, value)
    setIsLoading(true)
    setPhone(formattedValue)
    setErrorMsg(false)
    setErrorMsgCode('')
    signInWithPhoneNumber(formattedValue,setTimerStart,setIsDisablSendCode)
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
    if(response.success) setConfirm(true)
    if(response.data.message === "Verify code sent to your phone number") {
      alert(`${response.data.message}`)
      // setConfirm(true)
    }

    setIsLoading(false)
  }
    
  async function confirmCode() {
    try {
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
          setIsLoading(false)
        } else {

          alert(response.error);
          setIsLoading(false)
        }
        return;
      }
      if(response.data && response.data?.access_token) {
        console.log('data?.access_token',)
        //expires_in - в стейт и проверять при логине на истечение срока
        //запись токена в хранилище
        // проверка есть ли профиль
        try {
          await setToken(response.data.access_token)

          if(response.data && response.data.user !== null) {
            console.log('data.user', response.data.user)
            //запись профиля в хранилище
            //переход в экраны
            updateProfile(dispatch,response.data.user)

          //TODO все остальные поля должны быть у юзера
          //   {
          //   fullName: profile.fullName,
          //   role: profile.role,
          //   unp: profile.unp ?  profile.unp : '',
          //   email: profile.email ?  profile.email : '',
          //!!    organization
          //!!   driverAvatar: profile.hasOwnProperty('driverAvatar') ? profile.driverAvatar : null,
          //!!   clientAvatar: profile.hasOwnProperty('clientAvatar') ? profile.clientAvatar : null,
          //!!   quantityOfFinished: profile.hasOwnProperty('quantityOfFinished') ? profile.quantityOfFinished : 0,
          //!!   quantityTenders: profile.hasOwnProperty('quantityTenders') ? profile.quantityTenders : 0,
          //   phone: profile?.phone,
          //!!   rating: profile?.rating,
          //!!   userComplaintsCounter: profile?.userComplaintsCounter ? profile?.userComplaintsCounter : 0,

          // }
            dispatch(setIsLogin(true))
            // dispatch(setIsAuth(true)) //!!удалить не используется
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

  useEffect(()=>{
    if(value && value?.length > 0) {
      // console.log('value', value)
        const checkValid = phoneInput.current?.isValidNumber(value);
        setValidPhone(checkValid ? checkValid : false);
        setDisableBtn(checkValid ? false : true)
        checkValid ? setErrorMsg(false):null
        // console.log('checkValid',checkValid)
    }
  },[value])

  useEffect(()=>{
  // console.log('useEffect', value)
  if(code && code!== undefined && code?.length === 6) {
    setIsDisablCodeBtn(false)
  }
  },[code])

  const parseErrorMessage = (err) => {
  // 1. Если уже строка
  if (typeof err === 'string') return err;

  // 2. Классическая ошибка — у неё есть .message
  if (err && typeof err.message === 'string') return err.message;

  // 3. Пробуем «красиво» вытащить объект
  try {
    return JSON.stringify(err, null, 2);
  } catch {
    // 4. Фоллбек на toString
    return String(err);
  }
};

  const handleTestFn1 = async () =>{
    //обычный запрос на карго
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        "phone": phonetest
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("http://api-stage.cargogo.pro/api/auth/send", requestOptions)
      const resjson = await response.json()
      const res = JSON.stringify(resjson,null,2)
      setResponseShow(res)
      
      if (!response.ok) {
        // Ошибка с JSON
        const errorBody = await response.json();
        setShowErrorCode(JSON.stringify(errorBody,null,2))
      }

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setShowErrorCodeTry(errorMessage)    }
  } 
  const handleTestFn2 = async (phonetest) =>{
    //обычный запрос на номер заготовленный  без myHeaders.append("Accept", "application/json");  redirect: 'follow'
    const myHeaders = new Headers();
    // myHeaders.append("Accept", "application/json"); 
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "phone": "+375297297650"
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    
    try {
      const response = await fetch("http://api-stage.cargogo.pro/api/auth/send", requestOptions)
      const resjson = await response.json()
      const res = JSON.stringify(resjson,null,2)
      setResponseShow(res)
      
      if (!response.ok) {
        // Ошибка с JSON
        const errorBody = await response.json();
        setShowErrorCode(JSON.stringify(errorBody,null,2))
      }

    } catch (error) {
      console.log('handleTestFn2 error', error)
      const errorMessage = parseErrorMessage(error);
      setShowErrorCodeTry(errorMessage)
    }
  } 
  const handleTestFn3 = async () =>{
    // запрос "http://httpbin.org/post"
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "test": "cleartext"
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
      // body: formdata
    };

    let url = "http://httpbin.org/post"
    console.log('fn3 url', url)
    try {
      const response = await fetch(url, requestOptions)
      const resjson = await response.json()
      console.log('fn3 resjson', resjson)

      const res = JSON.stringify(resjson,null,2)
      setResponseShow(res)
      
      if (!response.ok) {
        // Ошибка с JSON
        const errorBody = await response.json();
        setShowErrorCode(JSON.stringify(errorBody,null,2))
      }

    } catch (error) {
      console.log('handleTestFn3 error', error)
      const errorMessage = parseErrorMessage(error);
      setShowErrorCodeTry(errorMessage)
    }
  } 
  const handleTestFn4 = async () =>{
    // запрос "https://httpbin.org/post"
    const myHeaders = new Headers();
    // myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "test": "cleartext"
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
      // body: formdata
    };

    let url = "https://httpbin.org/post"
    console.log('fn4 url', url)
    try {
      const response = await fetch(url, requestOptions)
      const resjson = await response.json()
      console.log('fn4 resjson', resjson)

      const res = JSON.stringify(resjson,null,2)
      setResponseShow(res)
      
      if (!response.ok) {
        // Ошибка с JSON
        const errorBody = await response.json();
        setShowErrorCode(JSON.stringify(errorBody,null,2))
      }

    } catch (error) {
      console.log('handleTestFn4 error', error)
      const errorMessage = parseErrorMessage(error);
      setShowErrorCodeTry(errorMessage)
    }
  } 
  const handleTestFn5 = async () =>{
    // запрос "https://httpbin.org/post"
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLXN0YWdlLmNhcmdvZ28ucHJvL2FwaS9hdXRoL3ZlcmlmeSIsImlhdCI6MTc1MTQ1ODc4OSwiZXhwIjoxNzU0MDUwNzg5LCJuYmYiOjE3NTE0NTg3ODksImp0aSI6IjF4TkxtREdGaGF2aHVKcVQiLCJzdWIiOiI1IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.AOyaoZOzRohR0tVYk6O9txdJrZv4XYdq5OtS9D_jP2I"
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    // const raw = JSON.stringify({
    //   "test": "cleartext"
    // });
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw
      // body: formdata
    };
    try {
      const response = await fetch("http://api-stage.cargogo.pro/api/forms", requestOptions)
      const resjson = await response.json()
      console.log('fn5 resjson', resjson)

      const res = JSON.stringify(resjson,null,2)
      setResponseShow(res)
      
      if (!response.ok) {
        // Ошибка с JSON
        const errorBody = await response.json();
        setShowErrorCode(JSON.stringify(errorBody,null,2))
      }

    } catch (error) {
      console.log('handleTestFn5 error', error)
      const errorMessage = parseErrorMessage(error);
      setShowErrorCodeTry(errorMessage)
    }
  } 

  const resetfn = ()=>{
    setShowErrorCode('')
    setShowErrorCodeTry('')
    setResponseShow('')
  }

  const testfn = async () => {
    try {
      const app = getApp(); // инициализирует текущее Firebase-приложение
      const messaging = getMessaging(app);
      await registerDeviceForRemoteMessages(messaging);
      const token = await getToken(messaging);
      console.log('\x1b[45m%s %s\x1b[0m', 'messaging token: ', token);
      setTokenmsg(token);
    } catch (error) {
      console.log('messaging get token error:', error);
    }
  }

  return (
    <SafeAreaView style={{flex:1,}}>
    <View style={{flex:1,backgroundColor: 'pink'}}>
      <DefaultBtn title={'Отправить'} onPress={testfn} />
      <Text style={[mainstyles.text13SB]}>{tokenmsg}</Text>
    </View>
    </SafeAreaView>
  )

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
          <View style={[styles.wrapper]}>

            <View style={[styles.midContainera,{position: 'relative', paddingBottom: 30}]}>
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
                  textInputStyle={{color: THEME.GREY600, paddingVertical: 0}}
                  codeTextStyle={{color: THEME.GREY600, fontWeight: '400'}}
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
            <DefaultBtn title={'Отправить'} onPress={handleSubmitPhone} disabled={disableBtn}/>

            {/* TEST */}
            <View style={{backgroundColor: '#fafafa',flex:1, padding:15,alignContent: 'center',width: '100%'}}>
              <Text style={{color: '#000'}}>123</Text>
              <TextInput
                multiline
                style={{backgroundColor: 'pink',height: 40,width: '100%'}}
                value={custValue}
                onChangeText={setCustValue}
              />
              <View style={{paddingBottom: 5}}/>
              <View>
                <Button title={'test1'} onPress={handleTestFn1} color={'lightcoral'}/>
                <View style={{paddingBottom: 5}}/>
                <Button title={'test phone 375297297650'} onPress={()=>handleTestFn2(phonetest)} color={'lightcoral'}/>
                <View style={{paddingBottom: 5}}/>
                <Button title={'test uri http'} onPress={handleTestFn3} color={'lightcoral'}/>
                <View style={{paddingBottom: 5}}/>
                <Button title={'test uri https'} onPress={handleTestFn4} color={'lightcoral'}/>
                <View style={{paddingBottom: 5}}/>
                <Button title={'test get form'} onPress={handleTestFn5} color={'lightcoral'}/>
                <View style={{paddingBottom: 5}}/>
                <Button title={'resetlog'} onPress={resetfn} />
                <View style={{paddingBottom: 5}}/>
              </View>

            <View style={{backgroundColor: "lightskyblue",flex:1,width: '100%'}}>
              <Text style={{color: '#000'}}>responseShow:</Text>
              <Text style={{color: '#000'}}>{responseShow}</Text>
            </View>
            <View style={{backgroundColor: 'lightsalmon',flex:1,width: '100%'}}>
              <Text style={{color: '#000'}}>showErrorCode:</Text>
              <Text style={{color: '#000'}}>{showErrorCode}</Text>
            </View>
            <View style={{backgroundColor: 'peachpuff',flex:1,width: '100%'}}>
              <Text style={{color: '#000'}}>showErrorCodeTry:</Text>
              <Text style={{color: '#000'}}>{showErrorCodeTry}</Text>
            </View>
            <View>

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
                    <Text style={[[styles.cell, mainstyles.text18R]]}>
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
                  onPress={()=>{handleSubmitPhone(),setTimerEnd(false)}} disabled={isDisablSendCode}>
                  {/* <CountDownTimer
                    ref={refTimer}
                    timestamp={180}
                    timerCallback={timerCallbackFunc}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    textStyle={[mainstyles.text18SB,{color: THEME.GREY800}]}
                  /> */}
                  <Text style={[mainstyles.text18SB,{color: THEME.GREY800}]}>{timerStart}  Отправить еще раз</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.bottomContainer,{backgroundColor: 'transparent'}]}>
  
              <View style={[styles.midBtnContainera, mainstyles.pV10, ]}>
                <DefaultBtn title={'Далее'} onPress={()=>{confirmCode()}} disabled={isDisableCodeBtn}/>
              </View>
              {/* <View style={styles.botTextContainer}>
                <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20}]}>Создавая аккаунт, вы соглашаетесь с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
                  <Text style={mainstyles.text14R}> и </Text><Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
                </Text>
              </View> */}
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
    lineHeight: 38,
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