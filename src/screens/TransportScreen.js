import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';

//packages
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { cameraPermissionInfo, height, transportDel, transportEdit, width } from '../util/helperConst';
import { findJsonObj } from '../util/tools';

//components
import AddPhotoTender from '../components/AddPhotoComponents/AddPhotoTender';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import { DropDownList } from '../components/DropDownList';
import PromptComponent from '../components/Modal/PromptComponent';
import { HeaderTitleComponentWithIcon } from '../components/Headers/HeaderTitleComponentWithIcon';
import IconTrash from '../components/Svg/IconTrash';
import { BtnIconTrs } from '../components/Buttons/BtnIconTrs';
import InfoAskWindow from '../components/Modal/InfoAskWindow';

//styles
import {THEME, mainstyles } from '../theme';
import IconVolume from '../components/Svg/IconVolume';
import IconWeight from '../components/Svg/IconWeight';
import { Platform } from 'react-native';
import { takePhotoFromCamera, takePhotoFromLibrary } from '../util/getPhotos';
import { checkCameraPermisson, onOpenModalSource, requestCameraPermisson } from '../util/permissions';
import { openSettings } from 'react-native-permissions';
import { getToken } from '../util/asyncstor';
import { delRequestById, put, putRequestById } from '../store/features/api/user-api';
import { uploadImages } from '../store/features/Upload/uploadfiles';
import { compressImages, getUrlUploadImage } from '../util/uploadFilesHelper';

export const TransportScreen = ({route, navigation}) => {
  console.log('TransportScreen', route.params);
  // console.log('TransportScreen', route.params);
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  const [isLoading,setIsLoading] = useState(false)

  const [vehicleState,setVehicleState] = useState(null)
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
  const [isAskDelete, setIsAskDelete] = useState(false)
  const [isShowPermisson,setIsShowPermisson] = useState(false)
  

  const dispatch = useDispatch()

  const handleTestFn = async() => {
    console.log('photosTender', photosTender)
    const token = await getToken()
    const arr1 = await getUrlUploadImage(photosTender)
    console.log('arr1', arr1)
    const arr = await uploadImages(arr1,token, 'cars')
    console.log('arr', arr)
  }

  const handleOpenModalSource = async () => {

    let resultAsk = await onOpenModalSource(Platform,setIsOpenAskSource,setIsShowPermisson)
    console.log('3 resultAsk', resultAsk)
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

  //загрузка изображения
  const uploadImage = async (photo) => {
    // console.log('TS uploadImage image url:', photo);
    let alreadyUpload = []
    //1. отфильтровать то что нужно загрузить

    photo.forEach(elem => {
      if(elem && elem.includes('http://api-stage.cargogo.pro/storage/cars')) {
        console.log('photo already in storage:', elem);
        alreadyUpload.push(elem)
      } else {
        console.log('photo isnt in storage:', elem);
        return elem
      }
    })
    console.log('photo', photo)

    //1.1 сжать
    const compressResult = await compressImages(photo) 
    
    console.log('compressResult', compressResult)

    //1.2 - подготовить фото
    const objToUpload = await getUrlUploadImage(compressResult)
    
    console.log('objToUpload', objToUpload)
    console.log('alreadyUpload', alreadyUpload)
    
    //2 загрузить
    const uris = await uploadImages(objToUpload,'cars')
    //3. соеденить массив
    console.log('uris', uris)

    //!!вернуть массив ссылок или ошибку
    if(uris?.message) {
      return uris
    } else {
      console.log('uris.concat', uris.concat(alreadyUpload))

      return uris.concat(alreadyUpload)
    }
    
    // // console.log('uploadImage index: ', index);
    // if(photo === null || photo === undefined) {
    //   return null
    // }
    // // Если не нужно загружать
    // // console.log('\x1b[36m%s\x1b[0m',imageNeedsUpload);
    
    // //для фото проверять если ссылки (https://firebasestorage.googleapis.com) то не добавлять в загрузку a возвращать ссылку. img.includes('firebasestorage.googleapis.com')
    // if(photo.includes('firebasestorage.googleapis.com')) {
    //   console.log('photo already in storage:', photo);
    //   return photo
    // }
    // // console.log('uploadImage next');
    // const result = await ImageCompressor.compress(photo, {
    //   compressionMethod: 'manual',
    //   quality: 0.6,
    // });

    // const uploadUri = result
    // let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);

    // const extension = filename.split('.').pop();
    // const name = filename.split('.').slice(0, -1).join('.');
    // filename = name + Date.now() + '.' + extension;
    // // console.log('extension', extension);
    // // console.log('name', name);
    // // console.log('filename', filename);

    // // setIndexUpload(index)
    // // setUploading(true);
    // // setTransferred(0);

    // const storageRef = storage().ref(`images/${filename}`)
    // const task = storageRef.putFile(uploadUri)

    // task.on('state_changed', (taskSnapshot) => {
    //   // console.log(
    //   //   `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
    //   // );
    //   // setTransferred(
    //   //   Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
    //   //     100,
    //   // );
    // })

    // try {
    //   await task
    //   const url = await storageRef.getDownloadURL()
    //   console.log('getDownloadURL url:', url);

    //   // setUploading(false);
    //   // setIndexUpload(null)
    //   // setImageNeedsUpload(false)

    //   //user
    //   return url;

    // } catch (error) {
    //   // setUploading(false);
    //   // setIndexUpload(null)
    //   console.log('await task error', error);
    //   return null;
    // }
  }

  function comparePhotoArrays(array1, array2) {
    // Проверка на разное количество элементов
    if (array1.length !== array2.length) {
        return false;
    }
    
    // Сравниваем элементы массивов поочередно
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    
    // Если не было найдено несовпадений, то возвращаем true
    return true;
  
  }
  function findMissingElements(array1, array2) {
    const missingElements = [];
    
    for (const element of array1) {
        if (!array2.includes(element)) {
            missingElements.push(element);
        }
    }
    console.log('missingElements', missingElements)
    return missingElements;
  }

  async function deletePhotosFromStorage(array) {
    // try {
    //   await array.map(item => {
    //       let imageRef =  storage().refFromURL(item)
    //       imageRef.delete().then(() => {
    //         console.log("Deleted uri item", item)
    //       }).catch(err => {
    //         console.log(err)
    //       })
    //     })
    // } catch (error) {
    //   console.log('err Deleted:', error);
    // }
  }
  
  //сохранение изменений
  const handleUpdateInfo = async() => {
    console.log('handleUpdateInfo start', vehicleState);
     Keyboard.dismiss()
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
    

    let isntChange = comparePhotoArrays(vehicleState.photos,photosTender)
    console.log('isntChange', isntChange)

    //массив для удаления фото - но уже не нужен
    // let arrFromDelPhoto = findMissingElements(vehicleState.photos,photosTender)
    // console.log('arrFromDelPhoto', arrFromDelPhoto)

    if(
      vehicleState.modelVehicle !== modelVehicle.trim() ||
      vehicleState.typeVehicle.trim() !== typeVehicle.trim() ||
      vehicleState.numVehicle  !==numVehicle?.trim() ||
      vehicleState.yearVehicle !== yearVehicle.trim() ||
      vehicleState.weight !== weight.trim() ||
      vehicleState.volume !== volume.trim() || 
      isntChange === false 
      // || arrFromDelPhoto.length>0
    ) {

      
      console.log('CHANGE', )
      
      setIsLoading(true)
      // const firbaseRef = firestore().collection('cars').doc(route.params.item.id)
      // const token = await getToken()
      let arrayUrl = []
      if(isntChange === false && photosTender.length> 0) {
        // let arrMap = await Promise.all(photosTender.map(photo => uploadImage(photo)))
        arrayUrl = await uploadImage(photosTender)
        console.log('arrayUrl', arrayUrl)
        // arrayUrl = arrMap.filter((url) => !!url)
      }
      if(arrayUrl?.message) {
        alert(arrayUrl?.message)
        setIsLoading(false)
        return 
      }

      //!!не нужно удалять фото
      // let arrayDelUrl = []
      // if(arrFromDelPhoto.length> 0) {
      //   deletePhotosFromStorage(arrFromDelPhoto)
      // }

      // console.log('arrayUrl', arrayUrl, arrayUrl.length);
      console.log('isntChange', isntChange);

      let vehicleObj = {
        "modelVehicle":  modelVehicle?.trim(),
        "typeVehicle":  typeVehicle?.trim(),
        "numVehicle":  numVehicle?.trim(),
        "yearVehicle":  yearVehicle?.trim(),
        "weight":  weight?.trim(),
        "volume":  volume?.trim(),
        "photos": arrayUrl,
        "userId":  route.params?.item.userId,
      }
      
      console.log('vehicleObj', vehicleObj);
      
      try {
        // const response = await putRequestById(vehicleObj,token,'cars',route.params?.item.id)
        const response = await put(`cars/${route.params?.item.id}`,vehicleObj)
        
        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          alert('error');
          return;
        }
        console.log('response', response.data) // отправлять в стейт
        setIsLoading(false)
        setIsShowResult(true)
        
      } catch (error) {
        alert(`Ошибка!.\n${JSON.stringify(error)}`)
        setIsLoading(false)
      }



      // arrayUrl?.length > 0 ? vehicleObj.photos = arrayUrl : null

      // console.log('vehicleObj', vehicleObj);
    
      //отправка данных в firebase
      // try {
      //   await firbaseRef
      //   .update(vehicleObj)
      //   .then(() => {

      //     // setDisable(true)
      //     setIsLoading(false)
      //     setIsShowResult(true)
      //   })
      // } catch (error) {
      //   console.log('User update error', error);
      //   alert(`Ошибка!.\n${JSON.stringify(error)}`)

      //   setIsLoading(false)
      // }

    } else {
      return
    }
    

  }

  const onCloseAfterAdd = () => {
    // if(flagRes!==null && flagRes==='succeed') {
    //   setFlag(null)
    //   setIsShowResult(false)
    //   navigation.goBack()
    // } else if(flagRes!==null && flagRes==='error') {
    //   setFlag(null)
    //   setIsShowResult(false)
    // }
      setIsShowResult(false)
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Profile',
        }],
      })
  }

  const handleDeleteTransport = async() => {
    console.log('handleDeleteTransport start', )
    try {
      const token = await getToken()
      const response = await delRequestById(vehicleState.id,token,'cars')
      console.log('response', response)
      if(response?.message === "Car event deleted") {
        setIsAskDelete(false)
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Profile',
            }],
          })

      }
    } catch (error) {
      console.log('error', error)
      alert(`Ошибка попробуйте позже \n${JSON.stringify(error)}`)
    }
  }

  useEffect(()=>{
    if(route.params!==undefined&&route.params.hasOwnProperty('item')) {
      setVehicleState(route.params.item)
      setModelVehicle(route.params.item.modelVehicle)
      setTypeVehicle(route.params.item.typeVehicle)
      route.params.item.numVehicle !== null ? setNumVehicle(route.params.item.numVehicle) : ("")
      setYearVehicle(route.params.item.yearVehicle)
      setWeight(route.params.item.weight)
      route.params.item.volume !== null ? setVolume(route.params.item.volume) : setVolume("")
      setPhotosTender(route.params.item.photos)
      console.log('route.params.item.photos', route.params.item.photos)
    }
  },[route])

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
    <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'height': 'padding'} style={{flex:1}}>
      <View style={styles.container}>
        <StatusBar translucent barStyle={'dark-content'}/>
        <ScrollView style={styles.wrapper}>
          <HeaderTitleComponentWithIcon title={'Мой авто'} onPress={()=>navigation.goBack()}>
            <BtnIconTrs  onPress={()=>{setIsAskDelete(true)}}>
              <IconTrash />
            </BtnIconTrs>
          </HeaderTitleComponentWithIcon>
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

            {/* <View style={[mainstyles.pB25]}>
              <View style={[styles.input,mainstyles.shadowG5r5,styles.infoContainer,errWeightField ? styles.errors : null]}>
                <View style={[styles.infoInputBox,{width: '55%',borderRightWidth:1, borderRightColor: THEME.GREY300}]}>
                  <View style={styles.imgContainer}>
                  <IconWeight />
                  </View>
                    <TextInput 
                      blurOnSubmit={true}
                      style={[mainstyles.text12R,{color: THEME.GREY900}]}
                      placeholder='Грузоподъемность (т.) *'
                      keyboardType='numeric'
                      placeholderTextColor={THEME.GREY600}
                      value={weight}
                      onChangeText={setWeight}
                      maxLength={20}
                    />

                </View>
                <View style={[styles.infoInputBox,{width: '45%'}]}>
                  <View style={[styles.imgContainer,{paddingLeft: 10}]}>
                    <IconVolume />
                  </View>
                    <TextInput 
                      blurOnSubmit={true}
                      style={[mainstyles.text12R,{color: THEME.GREY900}]}
                      placeholder='Объем (м3)'
                      placeholderTextColor={THEME.GREY600}
                      keyboardType='numeric'
                      value={volume}
                      onChangeText={setVolume}
                      maxLength={20}
                    />
                </View>
              </View>
              {
                errWeightField ?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Напишите грузоподъемность авто!</Text>
                  :null
              }
            </View> */}

            <View style={mainstyles.pB15}>
              <View style={styles.photoWrapper}>
                <Text style={[mainstyles.text16R, {paddingBottom: 15}]}>Добавить фото</Text>
                <AddPhotoTender images={photosTender} setImages={setPhotosTender} onOpenAskModal={()=>{handleOpenModalSource()}} onDelete={deletePhoto}/>
              </View>
            </View>
          </View>

        </ScrollView>

        <View>
          <View style={styles.btnRow}>
            <View style={[styles.qwe,{width: '58%'}]}>
              <DefaultBtn  title={'Сохранить'} onPress={handleUpdateInfo} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
            </View>
            <View style={[styles.qwe,{width: '38%'}]}>
              <DefaultBtn title={'Отменить'} onPress={()=>{navigation.goBack()}} customStyles={[styles.btnCustomStyle,{width: '100%'}]}/>
            </View>
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
              <PromptComponent data={findJsonObj(jsonDataPrompt,'transportEdit',transportEdit)} onPress={onCloseAfterAdd}/>
            </View>
          : 
          null
        }
        {
          isAskDelete ?
            <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'transportDel',transportDel)} onClose={()=>setIsAskDelete(false)} onPress={handleDeleteTransport}/>
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
        {__DEV__ ? 
          <View style={[mainstyles.alCjcC,{paddingBottom: safeInsets?.bottom, backgroundColor: 'pink'}]}>
            <DefaultBtn disabled={false} title={'test'} onPress={handleTestFn} customStyle={{marginBottom: 10}}/> 
          </View> 
        : null} 
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
    // flex:1
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
    // alignItems: 'center',
    // width: '50%',
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
    // backgroundColor: 'pink',
    borderRadius: 30,
    // paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 15,
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
