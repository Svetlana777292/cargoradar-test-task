import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useSelector, useDispatch } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createVideoThumbnail, clearCache, Video, Image as ImgCompres } from 'react-native-compressor';

//functions && features && slice
import { HeaderTitleComponent } from '../components/Headers/HeaderTitleComponent';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import PromptComponent from '../components/Modal/PromptComponent';

//components
import { cameraPermissionInfo, editProfileSucc, height, width } from '../util/helperConst';
import { takeSinglePhotoFromCamera, takeSinglePhotoFromLibrary } from '../util/getPhotos';
import { findJsonObj } from '../util/tools';

//styles
import { THEME, mainstyles } from '../theme';
import { onOpenModalSource } from '../util/permissions';
import InfoAskWindow from '../components/Modal/InfoAskWindow';
import { openSettings } from 'react-native-permissions';
import { put, putRequest } from '../store/features/api/user-api';
import { getToken } from '../util/asyncstor';
import { updateProfile } from '../util/userprofile';
import { setUserProfileInfo } from '../store/features/loginSlice';
import { uploadImage } from '../store/features/Upload/uploadfiles';

export const ProfileUpdateScreen = ({route,navigation}) => {
  console.log('ProfileUpdateScreen', '_______render________',route.params)

  const [uploading, setUploading] = useState(false)
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  const roleState = useSelector((state) => state.login.role)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const firebaseRef = ''//firestore().collection('forms').doc(auth().currentUser.uid)
  const phoneInput = useRef(null);
  const [isLoading,setIsLoading] = useState(false)

  const [organization,setOrganization] = useState('')
  const [unp,setUnp] = useState('')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [phoneState,setPhoneState] = useState('')
  const [avatarUser,setAvatarUser] = useState(null)

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [errModelField, setModelField] = useState(false)
  const [flagRes, setFlag] = useState(null)
  const [isShowResult,setIsShowResult] = useState(false)
  const [isOpenAskSource, setIsOpenAskSource] = useState(false)
  const [isShowPermisson,setIsShowPermisson] = useState(false)
  // console.log('avatarUser', avatarUser)

  const dispatch = useDispatch()

  const handleOpenModalSource = async () => {
    let resultAsk = await onOpenModalSource(Platform,setIsOpenAskSource,setIsShowPermisson)
    // console.log('1 resultAsk', resultAsk)
  }

  const handleOpenSettings = () => {
    setIsShowPermisson(false)
    openSettings().catch(() => console.warn('cannot open settings'))
  }

  const getUrlUploadImage = async (localUri) => {
    console.log('getUrlUploadImage obj',localUri);

    // если аватар не менялся то проверять
    // console.log('\x1b[36m%s\x1b[0m',);

    if(localUri === null) return null
    if(localUri === '') return null

    if(localUri && localUri.includes('http://api-stage.cargogo.pro/storage/avatars')) {
      console.log('photo already in storage:', localUri);
      return localUri
    } else {
      // setIsLoading(false)
      // const token = await getToken()
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      //сжимать изображение 
      let compressRes  = await ImgCompres.compress(
        localUri,
        { 
          compressionMethod: 'auto', // default is 'manual'
          maxWidth: 720
          // minimumFileSizeForCompress: 4048,
          // bitrate: bitrate,
        },
      )
      console.log('compressRes', compressRes)
      const data = {
        uri: compressRes,
        name: filename,
        type: type,
      }
      // console.log('compressRes data', data)
      try {
        const uri = await uploadImage(data)
        return uri
        
      } catch (error) {
        console.log('getUrlUploadImage error', error)
        return null
      }
    }
  }

  //!!сохранение профиля

  const handleUpdateProfile= async () => {
    Keyboard.dismiss()

    if(name.trim()?.length < 1) {
      setModelField(true)
    }
    if(name.trim()?.length < 1 || name.trim() == undefined) {
      return
    }
    setIsLoading(true)

    const imgUrl =  await getUrlUploadImage(avatarUser)
    console.log('imgUrl', imgUrl)

    let profileObj = {
      'name':  name,
      'email':  route.params?.profile.email,
      'phone':  route.params?.profile.phone,
      'role': route.params?.profile.role
    }
    if(imgUrl !== null) {
      profileObj.avatar = imgUrl !== null && Array.isArray(imgUrl) ? imgUrl[0] : imgUrl
    }
    
    if(roleState === 'driver') {
      profileObj.unp = unp
      profileObj.organization = organization
    }

    console.log('profileObj', profileObj);

    try {
      const response = await put('users/me',profileObj)
      if(!response.success) {
      setIsLoading(false)
      console.log('response error', response?.error)
    } 
      console.log('response putRequest updprf success', response.data)
      //диспатчить объект профиля тут а не каждый раз в профиль скрине
      updateProfile(dispatch,response.data)
      setIsLoading(false)
      setIsShowResult(true)
    
      
    } catch (error) {
      setIsLoading(false)
      setFlag('error')
      console.log('1 error', error);
      // alert(`Ошибка \n${JSON.stringify(error)}`)
    }
  }  

  const onCloseAfterAdd = () => {
    navigation.goBack()
  }

  function formatPhoneNumber(phoneNumber) {
    // Проверка, что входная строка начинается с "+", и содержит только цифры
    if (/^\+\d+$/.test(phoneNumber)) {
      // Извлекаем код страны и остаток номера
      const countryCode = phoneNumber.slice(1, 4);
      const restOfNumber = phoneNumber.slice(4);

      // Форматируем остаток номера
      const formattedNumber = `(${restOfNumber.slice(0, 2)}) ${restOfNumber.slice(2, 5)} ${restOfNumber.slice(5, 7)} ${restOfNumber.slice(7, 9)} ${restOfNumber.slice(9)}`;

      // Возвращаем полный форматированный номер
      return `+${countryCode} ${formattedNumber}`;
    } else {
        // Возвращаем исходную строку, если формат не соответствует ожидаемому
        return phoneNumber;
    }
  }

  useEffect(()=> {
    if(route.params?.profile) {
      if(roleState === 'driver') {
        if(route.params?.profile.hasOwnProperty('organization') 
        && route.params?.profile.organization !== undefined 
        && route.params?.profile.organization !== null 
        ) {
          setOrganization(route.params?.profile.organization)
        }

        if(route.params?.profile.hasOwnProperty('unp') 
        && route.params?.profile.unp !== undefined 
        && route.params?.profile.unp !== null 
        ) {
          setUnp(route.params?.profile.unp)
        }

        if(route.params?.profile.hasOwnProperty('driverAvatar') 
        && route.params?.profile.driverAvatar !== undefined 
        && route.params?.profile.driverAvatar !== null 
        ) {
          setAvatarUser(route.params?.profile.driverAvatar)
        }
      }

      if (roleState === 'client') {
        if(route.params?.profile.hasOwnProperty('clientAvatar') 
        && route.params?.profile.clientAvatar !== undefined 
        && route.params?.profile.clientAvatar !== null 
        ) {
          setAvatarUser(route.params?.profile.clientAvatar)
        }
      }

      if(route.params?.profile.hasOwnProperty('email') 
      && route.params?.profile.email !== undefined 
      && route.params?.profile.email !== null 
      ) {
        setEmail(route.params?.profile.email)
      }

      if(route.params?.profile.hasOwnProperty('name') 
      && route.params?.profile.name !== undefined 
      && route.params?.profile.name !== null 
      ) {
        setName(route.params?.profile.name)
      }

      if(route.params?.profile.hasOwnProperty('phone') 
      && route.params?.profile.phone !== undefined 
      && route.params?.profile.phone !== null 
      ) {
        let phoneFormatted = formatPhoneNumber(route.params?.profile.phone)
        setPhone(phoneFormatted)
        setPhoneState(route.params?.profile.phone)
        if (/^\+\d+$/.test(route.params?.profile.phone)) {
          // Извлекаем код страны и остаток номера
          // const countryCode = route.params?.profile.phone.slice(0, 4);
          const restOfNumber = route.params?.profile.phone.slice(4);
          phoneInput.current?.onChangeText(restOfNumber)
          setValue(restOfNumber)
          setFormattedValue(route.params?.profile.phone)
          console.log('restOfNumber', restOfNumber)
          // console.log('countryCode', countryCode)
        }
      } else {
        // if (/^\+\d+$/.test(auth().currentUser.phoneNumber)) {
        //   // Извлекаем код страны и остаток номера
        //   // const countryCode = auth().currentUser.phoneNumber.slice(0, 4);
        //   const restOfNumber = auth().currentUser.phoneNumber.slice(4);
        //   phoneInput.current?.onChangeText(restOfNumber)
        //   setValue(restOfNumber)
        //   setFormattedValue(auth().currentUser.phoneNumber)
        //   // console.log('restOfNumber', restOfNumber)
        //   // setFormattedValue(countryCode)
        // }
        // let phoneFormatted = formatPhoneNumber(auth().currentUser.phoneNumber)
        // setPhone(phoneFormatted)
        // setPhoneState(auth().currentUser.phoneNumber)
        console.log('auth().currentUser.phoneNumber',route.params?.profile.phone)
      }


    }
  },[route])
  
  const onDelete = () => {
    setAvatarUser(null)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding': 'height'} style={{flex:1}}>
      <View style={styles.container}>
        <StatusBar translucent barStyle={'dark-content'}/>
        <ScrollView style={[styles.wrappera,{paddingTop: safeInsets.top}]}>
          <HeaderTitleComponent title={'Профиль'} onPress={()=>navigation.goBack()}/>
          <View style={[mainstyles.pH10, {paddingTop: 20}]}>
            <View style={styles.avatarContainer}>
              {
                avatarUser !== null && avatarUser !== undefined && avatarUser?.length > 0 ?
                
                <View style={[styles.avatarWrapper,mainstyles.shadowG5r8]}>
                  <TouchableOpacity onPress={()=>onDelete()} style={styles.closeRound}>
                    <Icon name={'cross'} size={20} color={'red'} />
                  </TouchableOpacity>
                    <Image source={{uri: avatarUser}}  style={styles.img}/>
                </View>
                : 
                <View style={[styles.avatarWrapper,mainstyles.shadowG5r8]}>
                  <TouchableOpacity style={styles.img} onPress={handleOpenModalSource}>
                    <Icon name="camera" size={20} color={THEME.PRIMARY} />
                  </TouchableOpacity>
                </View>

              }
            </View>
            <View style={[mainstyles.pB15]}>
              <TextInput 
                style={[mainstyles.text15R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,errModelField ? styles.errors : null]}
                placeholder='Имя*'
                placeholderTextColor={THEME.GREY400}
                value={name}
                onChangeText={setName}
              />
              {
                errModelField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Обязательное поле</Text>
                  :null
              }
            </View>
            <View style={[mainstyles.pB15]}>
              <TextInput 
                style={[mainstyles.text15R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5]}
                placeholder='email'
                placeholderTextColor={THEME.GREY400}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {
              roleState === 'driver' ?
              <>
                <View style={[mainstyles.pB15]}>
                  <TextInput 
                    style={[mainstyles.text15R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5]}
                    placeholder='Организация'
                    placeholderTextColor={THEME.GREY400}
                    value={organization}
                    onChangeText={setOrganization}
                  />
                </View>
                <View style={[mainstyles.pB15]}>
                  <TextInput 
                    style={[mainstyles.text15R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5]}
                    placeholder='УНП'
                    placeholderTextColor={THEME.GREY400}
                    value={unp}
                    onChangeText={setUnp}
                  />
                </View>
              </>
              : null
            }
            <View style={[mainstyles.pB15,{backgroundColor: 'transparent',paddingLeft: 13,paddingTop: 10}]}>
              <View style={[{position: 'relative', backgroundColor: 'transparent'}]}>
                <Text
                  style={[mainstyles.text15R,{color: THEME.GREY400,backgroundColor: 'transparent',textDecorationLine: 'underline'},
                  ]}
                >{phone}</Text>
              </View>
            </View>

          </View>

        </ScrollView>
        
        <View style={{}}>
          <View style={styles.btnRow}>
            <View style={[styles.qwe,{width: '46%'}]}>
              <DefaultBtn  title={'Сохранить'} onPress={handleUpdateProfile} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
            </View>
            <View style={[styles.qwe,{width: '46%'}]}>
              <DefaultBtn title={'Отменить'} onPress={()=>{navigation.goBack()}} customStyles={[styles.btnCustomStyle,{width: '100%'}]}/>
            </View>
          </View>
        </View>
        {
          isLoading ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999},mainstyles.alCjcC]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
          : 
          null
        }
        {
          isOpenAskSource ? 
          <TouchableOpacity onPress={()=>setIsOpenAskSource(false)} style={[mainstyles.containerModalGgBl,{justifyContent: 'center',flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',padding: 10}}>
              <DefaultBtn title={'Из галереи'} onPress={()=>{takeSinglePhotoFromLibrary(avatarUser,setAvatarUser),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
              <DefaultBtn title={'Сделать фото'} onPress={()=>{takeSinglePhotoFromCamera(avatarUser,setAvatarUser),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
            </View>
          </TouchableOpacity>
          : null
        }
        {
          isShowResult ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999},mainstyles.alCjcC]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'editProfileSucc',editProfileSucc) } onPress={onCloseAfterAdd}/>
            </View>
          : 
          null
        }
        {
          isShowPermisson ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999},mainstyles.alCjcC]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'cameraPermissionInfo',cameraPermissionInfo)} onPress={()=>{handleOpenSettings()}} onClose={()=>setIsShowPermisson(false)}/>
            </View>
          : 
          null
        }
        {
          __DEV__&&
          <DefaultBtn title={'qqqq'} onPress={()=>getUrlUploadImage(avatarUser)} customStyle={{width: '35%'}}/>
        }
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: 'orange',
  },
  btnRow: {
    // flex:1,
    // backgroundColor: 'red',
    alignSelf: 'center',
    width: width-60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    marginBottom: 20
  },
  btnCustomStyle: {
    height: 55, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
  },
  input: {
    borderRadius: 30,
    paddingVertical: 0,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: THEME.GREY400,
    elevation: 15,
    height: 40
  },
  inputPhone: {
    position: 'absolute',
    // alignSelf: 'center',
    bottom: -10,
    width: '100%',
    // borderRadius: 30,
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: THEME.GREY400
  },
  errors: {
    elevation: 8,
    shadowColor: '#D32030',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  avatarContainer: {
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15
  },
  imgContainer: {
    
  },
  img: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: THEME.GREY100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  closeRound: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderColor: '#ccc',
    borderWidth:1,
    zIndex: 990,
  },
  avatarWrapper: {width:90,height:90,},
});


