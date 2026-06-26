import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform,  TextInput, ActivityIndicator, StatusBar, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';

//packages
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {check, PERMISSIONS, RESULTS,openSettings} from 'react-native-permissions';
import { Image as ImageCompressor } from 'react-native-compressor';

//components
import { HeaderTitleComponent } from '../components/Headers/HeaderTitleComponent';
import AddPhotoTender from '../components/AddPhotoComponents/AddPhotoTender';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import { DropDownList } from '../components/DropDownList';
import PromptComponent from '../components/Modal/PromptComponent';

//functions && features && slice
import { cameraPermissionInfo, height, transportAdd, transportAddErr, width } from '../util/helperConst';
import { findJsonObj } from '../util/tools';
import { takePhotoFromCamera, takePhotoFromLibrary } from '../util/getPhotos';
import { checkCameraPermisson, onOpenModalSource, requestCameraPermisson } from '../util/permissions';

//styles
import { SIZE, THEME, mainstyles } from '../theme';
import IconWeight from '../components/Svg/IconWeight';
import IconVolume from '../components/Svg/IconVolume';
import InfoAskWindow from '../components/Modal/InfoAskWindow';
import { post, postRequest } from '../store/features/api/user-api';
import { getToken } from '../util/asyncstor';
import { compressImages, getUrlUploadImage } from '../util/uploadFilesHelper';
import { uploadImages } from '../store/features/Upload/uploadfiles';



export const AddTransportScreen = ({route,navigation}) => {
  console.log('AddTransportScreen', route)
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const { userProfileInfo } = useSelector((state) => state.login)
  const uid = '1'//auth().currentUser.uid
  const [isLoading,setIsLoading] = useState(false)

  const [modelVehicle,setModelVehicle] = useState('')
  const [typeVehicle,setTypeVehicle] = useState('')
  const [numVehicle,setNumVehicle] = useState('')
  const [yearVehicle,setYearVehicle] = useState('')
  const [weight,setWeight] = useState('')
  const [volume,setVolume] = useState('')

  const [photosTender, setPhotosTender] = useState([])
  const [uploading, setUploading] = useState(false)
  const [isOpenAskSource,setIsOpenAskSource] = useState(false)

  const [errModelField, setModelField] = useState(false)
  const [errTypeField, setTypeField] = useState(false)
  // const [errNumField, setNumField] = useState(false)
  const [errYearField, setYearField] = useState(false)
  const [errWeightField, setWeightField] = useState(false)
  const [flagRes, setFlag] = useState(null)
  const [isShowResult,setIsShowResult] = useState(false)
  const [isShowPermisson,setIsShowPermisson] = useState(false)

  const dispatch = useDispatch()

  const handleOpenModalSource = async (flag) => {
    await onOpenModalSource(Platform,setIsOpenAskSource,setIsShowPermisson)
    // let resultAsk =
    // console.log('1 resultAsk', resultAsk)
  }

  const handleOpenSettings = () => {
    setIsShowPermisson(false)
    openSettings().catch(() => console.warn('cannot open settings'))
  }

  function deletePhoto(currIndex) {
    console.log('1', photosTender.length);

    const filteredData = photosTender.filter((item, index) => index !== currIndex);
    setPhotosTender(filteredData);
  }
  const handleShowResult = () => {
    setIsShowResult(true)    
  }

  //!!загрузка изображения
  const uploadImage = async (photo) => {
    console.log('uploadImage image url:', photo);
    // console.log('uploadImage index: ', index);

    const compressResult = await compressImages(photo)
    console.log('compressResult', compressResult)

    try {
      //1 - подготовить фото
      const objToUpload = await getUrlUploadImage(compressResult)
      console.log('objToUpload', objToUpload)
      //2. загрузить
      const uris = await uploadImages(objToUpload,'cars')
      console.log('uris', uris)
      return uris

    } catch (error) {
      console.log('local fn uploadImage error', error);
      return [];
    }
  }

  //загрузка массива изображений

  //сохранение заявки
  //!!в зависимости от типа траспорта отправлять поля
  
  const handleAddVehicle= async () => {

    if(modelVehicle.trim()?.length < 1) {
      setModelField(true)
    } 
    if(typeVehicle.trim()?.length < 1) {
      setTypeField(true)
    } 
    if(yearVehicle.trim()?.length < 1) {
      setYearField(true)
    } 
    if(weight.trim()?.length < 1) {
      setWeightField(true)
    }
    if(modelVehicle.trim()?.length < 1 || typeVehicle.trim()?.length < 1 || yearVehicle.trim()?.length < 1 || weight.trim()?.length < 1) {
      return
    }

    setIsLoading(true)

    //загрузка массива изображений
    let arrayUrl = []
    if(photosTender.length> 0) {
      // arrayUrl = await Promise.all(photosTender.map(photo => uploadImage(photo)))
      let arrResp = await uploadImage(photosTender)
      if(arrResp?.message) {
        alert(arrResp?.message)
      } else arrayUrl = arrResp
      console.log('arrayUrl', arrayUrl)
    }
    console.log('handleAddVehicle arrayUrl', arrayUrl);

    let vehicleObj = {
      'modelVehicle':  modelVehicle?.trim(),
      'typeVehicle':  typeVehicle?.trim(),
      'numVehicle':  numVehicle?.trim(),
      'yearVehicle':  yearVehicle?.trim(),
      'weight':  weight?.trim(),
      'volume':  volume?.trim(),
      'photos': arrayUrl,
      'userId':  userProfileInfo.id,
    }
    // console.log('vehicleObj', vehicleObj);
    // const token = await getToken()
    try {
      // const response = await postRequest(vehicleObj,token, 'cars')
      const response = await post('cars',vehicleObj)

      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        alert('error');
        setFlag('error')
        return;
      }
      console.log('response', response.data)
      setIsLoading(false)
      setFlag('succeed')
      
    } catch (error) {
      setIsLoading(false)
      setFlag('error')
      console.log(' error', error);
      // alert(`Ошибка \n${JSON.stringify(error)}`)
    }
  }  

  const onCloseAfterAdd = () => {
    if(flagRes!==null && flagRes==='succeed') {
      setFlag(null)
      setIsShowResult(false)
      navigation.goBack()
    } else if(flagRes!==null && flagRes==='error') {
      setFlag(null)
      setIsShowResult(false)
    }
  }


  useEffect(()=>{
    if(flagRes!==null) {
      handleShowResult()
    }
  },[flagRes])

  useEffect(()=> {
    if(errModelField === true && modelVehicle.trim()?.length > 0) {
      setModelField(false)
    } 
    if(errTypeField === true && typeVehicle.trim()?.length > 0) {
      setTypeField(false)
    } 
    if(errYearField === true && yearVehicle.trim()?.length > 0) {
      setYearField(false)
    } 
    if(errWeightField === true && weight.trim()?.length > 0) {
      setWeightField(false)
    }
  },[errWeightField,modelVehicle,errTypeField,typeVehicle,errYearField,yearVehicle,errWeightField,weight])
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding': 'padding'} style={{flex:1}}>      
      <View style={styles.container}>
        <StatusBar translucent barStyle={'dark-content'}/>
        <ScrollView style={[styles.wrapper,{paddingTop: safeInsets.top}]}>
          <HeaderTitleComponent title={'Мой авто'} onPress={()=>navigation.goBack()}/>
          <View style={[mainstyles.pH10]}>
            <View style={[mainstyles.pB15]}>
              <TextInput
                style={[mainstyles.text14R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,errModelField ? styles.errors : null]}
                placeholder='Марка и модель *'
                placeholderTextColor={THEME.GREY600}
                value={modelVehicle}
                onChangeText={setModelVehicle}
                maxLength={30}
              />
              {
                errModelField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Напишите марку и модель авто!</Text>
                  :null
              }
            </View>

            <View style={[mainstyles.pB15]}>
              <DropDownList value={typeVehicle} setValue={setTypeVehicle} error={errTypeField}/>
              {
                errTypeField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Выберите тип авто!</Text>
                  :null
              }
            </View>

            <View style={[mainstyles.pB15]}>
              <TextInput 
                style={[mainstyles.text14R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,]}
                placeholder='Госномер'
                placeholderTextColor={THEME.GREY600}
                value={numVehicle}
                onChangeText={setNumVehicle}
                maxLength={30}
                />
            </View>

            <View style={[mainstyles.pB15]}>
              <TextInput 
                style={[mainstyles.text14R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,errYearField ? styles.errors : null]}
                placeholder='Год выпуска *'
                keyboardType='numeric'
                placeholderTextColor={THEME.GREY600}
                value={yearVehicle}
                onChangeText={setYearVehicle}
                maxLength={30}
                />
              {
                errYearField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Напишите год выпуска авто!</Text>
                  :null
              }
            </View>

            <View style={[mainstyles.pB15]}>
              <View style={[mainstyles.rowalC,mainstyles.text14R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,errWeightField ? styles.errors : null]}>
                <View style={styles.imgContainer}>
                  <IconWeight />
                </View>
                  <TextInput
                    blurOnSubmit={true}
                    style={[mainstyles.text14R,{color: THEME.GREY900,width: '85%'}]}
                    placeholder='Грузоподъемность(т.)*'
                    keyboardType='numeric'
                    placeholderTextColor={THEME.GREY600}
                    value={weight}
                    onChangeText={setWeight}
                    maxLength={20}
                  />
              </View>
              {
                errWeightField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Напишите грузоподъемность авто!</Text>
                  :null
              }
            </View>
            <View style={[mainstyles.pB15]}>
              <View style={[mainstyles.rowalC,mainstyles.text14R,{color: THEME.GREY900},styles.input,mainstyles.shadowG5r5,errWeightField ? styles.errors : null]}>
                <View style={styles.imgContainer}>
                  <IconVolume />
                </View>
                  <TextInput 
                    blurOnSubmit={true}
                    style={[mainstyles.text14R,{color: THEME.GREY900,width: '85%'}]}
                    placeholder='Объем (м3)'
                    placeholderTextColor={THEME.GREY600}
                    keyboardType='numeric'
                    value={volume}
                    onChangeText={setVolume}
                    maxLength={20}
                  />
              </View>
            </View>

            <View style={mainstyles.pB15}>
              <View style={styles.photoWrapper}>
                <Text style={[mainstyles.text16R, {paddingBottom: 15}]}>Добавить фото</Text>
                
                <AddPhotoTender images={photosTender} setImages={setPhotosTender} onOpenAskModal={handleOpenModalSource} onDelete={deletePhoto}/>
              </View>
            </View>
          </View>

        </ScrollView>
        
        <View style={styles.btnRow}>
          <View style={[styles.qwe,{width: '58%'}]}>
            <DefaultBtn  title={'Сохранить'} onPress={handleAddVehicle} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
          </View>
          <View style={[styles.qwe,{width: '38%'}]}>
            <DefaultBtn title={'Отменить'} onPress={()=>{navigation.goBack()}} customStyles={[styles.btnCustomStyle,{width: '100%'}]}/>
          </View>
        </View>
        {
          isLoading ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
          : 
          null
        }
        {
          isOpenAskSource ?
          <TouchableOpacity onPress={()=>setIsOpenAskSource(false)} style={[mainstyles.containerModalGgBl,{justifyContent: 'center',flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',padding: 10}}>
              <DefaultBtn title={'Из галереи'} onPress={()=>{takePhotoFromLibrary(photosTender,setPhotosTender),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
              <DefaultBtn title={'Сделать фото'} onPress={()=>{takePhotoFromCamera(photosTender,setPhotosTender),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
            </View>
          </TouchableOpacity>
          : null
        }
        {
          isShowResult ?
            <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
              <PromptComponent data={flagRes==='succeed'? findJsonObj(jsonDataPrompt,'TransportAdd', transportAdd) : findJsonObj(jsonDataPrompt,'TransportAddErr', transportAddErr)} onPress={onCloseAfterAdd}/>
            </View>
          : 
          null
        }
        {
          isShowPermisson ?
            <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'cameraPermissionInfo',cameraPermissionInfo)} onPress={()=>{handleOpenSettings()}} onClose={()=>setIsShowPermisson(false)}/>
            </View>
          : 
          null
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
  wrapper: {
    // backgroundColor: 'orange',
    // paddingHorizontal: 10,
  },
  infoContainer: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
  },
  infoInputBox: {
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  }, 
  imgContainer: {
    width: '15%',
    // backgroundColor: 'red',
    // alignItems: 'flex-start',
    paddingHorizontal: 5
  },
  photoWrapper: {
    marginBottom: 20
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
    // paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 15,
    // backgroundColor: 'red',
    // shadowColor: THEME.GREY600,
    // shadowOffset: {width: 2, height: 5},
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    height: 45
  },
  errors: {
    elevation: 8,
    shadowColor: '#D32030',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});