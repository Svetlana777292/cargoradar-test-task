import React,{ useState, useEffect,useRef } from 'react';
import { Platform, KeyboardAvoidingView,ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, StatusBar } from 'react-native';

//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/entypo';
// import storage from '@react-native-firebase/storage';
import { Image } from 'react-native-compressor';

//components
import { MainMap } from '../../components/MapComponents/MainMap';
import IconPinSmallOt from '../../components/Svg/IconPinSmallOt';
import IconPinSmallFill from '../../components/Svg/IconPinSmallFill';
import { BtnIconTrs } from '../../components/Buttons/BtnIconTrs';
import { DefaultBtnWite } from '../../components/Buttons/DefaultBtnWite';
import ListPoints from '../../components/ListPoints/ListPoints';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import PromptComponent from '../../components/Modal/PromptComponent';
import { HeaderTitleComponentNoBg } from '../../components/Headers/HeaderTitleComponentNoBg';

//functions && features && slice
import { askResetEditTender, height, promptShowDateExpired, promptSuccEditTend, width } from '../../util/helperConst';
import { onChangeIndexOfPoint, onDeletePoint, onResetTender, setDataTender, setInfoTender, } from '../../store/features/editTenderSlice';
import { calculateTotalWeight, checkActualDateOfTender, checkDateOfTender, checkPointsToCurrDataTender, findJsonObj, findMinDateOfTender, findSmallestDate, findSmallestDateUtc, isDateGreaterOrEqual, validateDatesAfterGiven } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import { restoreUsersWithChatsFromHidden } from '../../util/tenders';
import { getTenderHiddenClient } from '../../util/firebase';
import { userProfileTenderHiddenClient } from '../../store/features/userSlice';
import { DefaultBtn } from '../../components/Buttons/DefaultBtn';
import { put } from '../../store/features/api/user-api';
import { compressImages, getUrlUploadImage } from '../../util/uploadFilesHelper';
import { uploadImages } from '../../store/features/Upload/uploadfiles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditTenderScreen = ({route,navigation}) => {
  console.log('\x1b[34m%s %s\x1b[0m \x1b[34m%s', 'screens > CreateTender > EditTenderScreen.js', 'route:',route);
  const mapViewRef = useRef(null)
  const titleRef = useRef()
  const discrRef = useRef()
  let scrollref = useRef()
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  const role = useSelector((state) => state.login.role)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 

  const dataTender = useSelector(state=> state.editTender.tender)
  const dataTenderState = useSelector(state=> state.editTender.tenderState)
  const userProfile = useSelector((state) => state.login.userProfileInfo)
  const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient)
  // console.log('dataTender images', dataTender.startPoints[0]?.images)
  // console.log('dataTender', dataTender.startPoints[0]?.urlToDel)

  console.log('dataTender', JSON.stringify(dataTender,null,2) )

  const [title, setTitle] = useState('')
  const [description, setDiscription] = useState('')
  const [sum, setSum] = useState(0)
  const [sumWeight, setSumWeight] = useState(0)
  const [isOpenList, setIsOpenList] = useState(false)
  const [listPoint, setListPoint] = useState('')
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [routeInfo, setRouteInfo] = useState({
    distance: '',
    duration: ''
  })  
  const [coordinates, setCoordinates] = useState([])
  const [tenderState, setTenderState] = useState(null)
  const [isDisableBtn, setIsDisableBtn] = useState(true)
  const [isAskResetVisible, setIsAskResetVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessedCreate, setIsSuccessedCreate] = useState(false)
  const [isShowDateExpired, setIsShowDateExpired] = useState(false)

  const dispatch = useDispatch()
  // console.log('1 edit dataTender', dataTender )

  const onOpenList = (point) => {
    console.log('onOpenList btn', point)

    setIsOpenList(true)
    setListPoint(point)
  }
  const onOpenCreatePoint = (point) => {
    if(point==='start') {
      dataTender.startPoints.length === 0 ?  navigation.navigate('EditStartPoint',{firstOpen: true}) : navigation.navigate('EditStartPoint',{firstOpen: false})
    } else if(point==='end') {
      dataTender.endPoints.length === 0 ?  navigation.navigate('EditEndPoint',{firstOpen: true}) : navigation.navigate('EditEndPoint',{firstOpen: false})

    }
  }

  const handleSaveText = (flag,value) => {
    if(value!==undefined && value.trim().length > 0){
      dispatch(setInfoTender({type: flag, data: value}))
      flag==='title' ? setTitle(value) : setDiscription(value)
    } else {
      
      dispatch(setInfoTender({type: flag, data: ''}))
      flag==='title' ? setTitle('') : setDiscription('')
    }
    // if(flag==='title' && title!==undefined && title.trim().length > 0){
    //   dispatch(setInfoTender({type: 'title', data: title}))
    // } else if(flag==='description'&& description!==undefined && description.trim().length > 0){
    //   dispatch(setInfoTender({type: 'description', data: description}))
    // }
  }

  const handleEditPoint = (item,index,point) => {
    console.log('handleEditPoint: ', )
    if(point==='start'){
      navigation.navigate('EditStartPoint',{data: {item: item, index: index, type: point, action: 'edit'}})
    } else {
      navigation.navigate('EditEndPoint',{data: {item: item, index: index, type: point, action: 'edit'}})
    }
  }
  const handleDeletePoint = (index, point) => {
    console.log('handleDeletePoint: ', )
    dispatch(onDeletePoint({type: point, data: index}))
    
  }
  const handleChangeIndexPoint = (data) => {
    console.log('handleChangeIndexPoint: ', )
    dispatch(onChangeIndexOfPoint(data))
  }
  const handleOpenAsk = () => {
    console.log('handleOpenAsk', )  
    Keyboard.dismiss()  
    if(
      dataTender.data.name?.length>0||
      dataTender.data.description?.length>0||
      dataTender.data.price!==null||
      dataTender.startPoints?.length>0||
      dataTender.endPoints?.length>0
      ) {
        console.log('!!!!!!',  dataTender.data.name?.length>0||
        dataTender.data.description?.length>0||
        dataTender.data.price!==null||
        dataTender.startPoints?.length>0||
        dataTender.endPoints?.length>0)
        setIsAskResetVisible(true)
    } else {
      setIsAskResetVisible(true)
      // navigation.goBack()
    }
  }
  const handleResetState = () => {
    console.log('handleResetState',)
      setIsAskResetVisible(false)
      dispatch(onResetTender()) 
      setTitle('')
      setDiscription('')
      setSum(0)
      setSumWeight(0)
      setIsDisableBtn(true)
      setCoordinatesFrom([])
      setCoordinatesTo([])
      setRouteInfo({
        distance: '',
        duration: ''
      })
      setCoordinates([])
      setIsSuccessedCreate(false)

      // navigation.navigate('Tenders')
      navigation.reset({
        index: 0,
        routes: [{
          name: 'TendersTab', 
          state: {
            routes: [{
              name: 'Tenders',
            }]
          }
        }],
      })
      // navigation.goBack()
  }
  const createRouteInfo = (result) => {
    // console.log('createRouteInfo result', result)
    // console.log('createRouteInfo result', typeof(result.distance), typeof(result.distance.toFixed(0)))
    
    setRouteInfo({
      distance: result.distance.toFixed(1),
      duration: result.duration
    })
    // const time = changeFormatTime(result.duration)
    // setDuration(time)
  }

  async function deletePhotosFromStorage(array) {
    // console.log('deletePhotosFromStorage start', array)
    // try {
    //   await array.map(item => {
    //     if(item.includes('firebasestorage.googleapis.com')){
    //       console.log('item.include firebasestorage', item)
    //       let imageRef =  storage().refFromURL(item)
    //       console.log("uri imageRef", imageRef)
    //       imageRef.delete().then(() => {
    //         console.log("Deleted uri item", item)
    //       }).catch(err => {
    //         console.log(err)
    //       })          
    //     }
    //   })
    // } catch (error) {
    //   console.log('err Deleted:', error);
    // }
  }

  const uploadImage = async (photo) => {
    console.log('uploadImage image url:', photo);
    // console.log('uploadImage index: ', index);

    // const compressResult = await compressImages(photo)
    // console.log('compressResult', compressResult)

    try {
      //1 - убрать uri те что уже на сервере
      const actualUris = []
      const inStorageUris = []
      photo.forEach(elem => {
        if(elem.includes('http://api-stage.cargogo.pro')) {
          console.log('elem photo already in storage:', elem);
          inStorageUris.push(elem)
        } else {
          actualUris.push(elem)
        }
      })
      const compressResult = await compressImages(actualUris)

      console.log('compressResult', compressResult)
      //2 - подготовить фото
      const objToUpload = await getUrlUploadImage(compressResult)
      console.log('objToUpload', objToUpload)
      //3. загрузить
      const uris = await uploadImages(objToUpload,'tenders')
      console.log('uris', uris)
      ///4 вернуть ссылки
      return uris.concat(inStorageUris)

    } catch (error) {
      console.log('local fn uploadImage error', error);
      setIsLoading(false)
      return [];
    }



    // const result = await Image.compress(photo, {
    //   compressionMethod: 'manual',
    //   quality: 0.6,
    // });
    // console.log('result', result)

    // const uploadUri = result 
    // let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);

    // const extension = filename.split('.').pop();
    // const name = filename.split('.').slice(0, -1).join('.');
    // filename = name + Date.now() + '.' + extension;
    // // console.log('extension', extension);
    // // console.log('name', name);
    // // console.log('filename', filename);

    // const storageRef = storage().ref(`images/${filename}`)
    // const task = storageRef.putFile(uploadUri)

    // task.on('state_changed', (taskSnapshot) => {
    // })

    // try {
    //   await task
    //   const url = await storageRef.getDownloadURL()
    //   console.log('getDownloadURL url:', url);

    //   return url;

    // } catch (error) {
    //   console.log('await task error', error);
    //   return null;
    // }
  }

  const updateImagesInStartPoints = async (startPoints) => {

    const updatedStartPoints = await Promise.all(
      startPoints.map(async (point) => {
        if (!Array.isArray(point.images) || point.images.length === 0) {
          // Возвращаем исходный объект, если images не является массивом или пустым массивом
          return point; 
        }
        //point.images - будет содержать ссылки на хранилище и ссылки на файлы из памяти телефона
        
        //
        const updatedImages = await uploadImage(point.images)
        console.log('updatedImages', updatedImages)

        if(updatedImages?.message) {
          alert(arrResp?.message)
          setIsLoading(false)
          return {
            ...point,
            images: [],
          };
        } return {
          ...point,
          images: updatedImages.filter((url) => !!url), // Уберем возможные пустые значения
        };
      })
    );
      console.log('updateImagesInStartPoints updatedStartPoints:', updatedStartPoints)
    return updatedStartPoints;
  };

  const checkEditFields = () => {
    // проверка были ли изменения
    return true
  }

  const handleEditTender = async() => {
    // const obj = dataTender
    console.log('\x1b[42m%s %s\x1b[0m','handleEditTender start', )
    /*проверять все точки загрузки и разгрузки - если точки загрузки даты меньше сегодняшней то - алерт - что надо отредактировать точки
  
    */
    setIsLoading(true)
    Keyboard.dismiss()

    const checkDateStPoints = await checkActualDateOfTender(dataTender.startPoints)
    console.log('checkDateStPoints', checkDateStPoints)
    let dateMin = findSmallestDateUtc(dataTender.startPoints)    
    console.log('dateMin', dateMin)
    let checkDateEndPoints = validateDatesAfterGiven(dataTender.endPoints,dateMin)
    console.log('check end', checkDateEndPoints)
    // console.log('1', dataTender.startPoints)
    // console.log('2', dataTender.endPoints)


    if(checkDateStPoints === false ) {
      setIsShowDateExpired(true)
      setIsLoading(false)
      return
    } else if(checkDateEndPoints === false ) {
      setIsShowDateExpired(true)
      setIsLoading(false)
    } else {
      console.log(' no expired', )
      // try {
      //   console.log('check', dataTenderState && dataTenderState !== null)
    
      //загрузка фоток по точкам
      const updatedStartPoints = await updateImagesInStartPoints(dataTender.startPoints)
      //   console.log('dataTender', dataTender)
  
      let tenderObj = {
        'status': 'publish', // - потом заменить на edit как будет админка
        'archived': false,
        'name':  dataTender.data?.name?.trim(),
        'description':  dataTender.data?.description?.trim(),
        'price': sum,
        'startPoints':  updatedStartPoints, 
        'endPoints':  dataTender.endPoints,
        'route':  routeInfo,
        'userId':  userProfile.id,
        'id': dataTenderState.id
      }
      
      console.log('tenderObj', tenderObj);
      console.log('dataTenderState.id', dataTenderState.id);
        
      // сохранение и отправка
      const response = await put(`tenders/${dataTenderState.id}`,tenderObj)

      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        setIsLoading(false)
        alert(response.error);
        return;
      }
      console.log('response.data', response.data)
      setIsLoading(false)
      setIsSuccessedCreate(true)
        
      //   // сохранение и отправка данных в firebase
      //   await firestore().collection('tenders').doc(tenderState.id)
      //   .update(tenderObj)
      //   .then(() => {
      //     console.log('successfully!')
      //     // console.log('res', res)
      //     //!!если заявка восстанавливается после отмены выполнения (withchats === true) - восстанавливать чаты
      //     if(dataTenderState && dataTenderState !== null) {
      //       restoreUsersWithChatsFromHidden(hiddenTenderClient,uid,dataTenderState,role,dataTenderState.data.driverId)
      //       .then((res)=>{
      //         console.log('then res', res)
      //         getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
      //         setIsLoading(false)
      //         setIsSuccessedCreate(true)
      //       })
      //     } else {

      //       setIsLoading(false)
      //       setIsSuccessedCreate(true)
      //     }

      //   }).catch(e => {
      //     setIsLoading(false)
      //     console.log(' сохранение и отправка данных в firebase update', e)
      //   })
        
      // } catch (error) {
      //   setIsLoading(false)
      //   console.log('Ошибка сохранения заявки error', error);
      //   // alert(`Ошибка создания заявки \n err:${JSON.stringify(error)}  msg:${JSON.stringify(error?.messages)}`)
      // }
    }

  }

  useEffect(()=> { 
    const onCreateRoutePoints = () => {
      console.log(' onCreateRoutePoints START', )
      // console.log(' onCreateRoutePoints coordinatesFrom.length: ', coordinatesFrom.length)
      // console.log(' onCreateRoutePoints coordinatesTo.length: ', coordinatesTo.length)
      // if(coordinatesFrom.length == 0 && coordinatesTo.length == 0 && coordinates == 0) return

      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})

      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)
      
      //координаты в один массив
      const coordsRoute = coordsFrom.concat(coordsTo)
      // console.log('onCreateRoutePoints coordsRoute: ', coordsRoute);
      setCoordinates(coordsRoute)
    }

    // if(coordinates.length == 0) {
    //   console.log('coordinates.length = 0', coordinates.length);
    //   setRouteInfo({
    //     distance: '',
    //     duration: ''
    //   })
    //   setDuration('')
    // }
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      // console.log(' onCreateStartEndPoints start: ', startEndPoints)
      onCreateRoutePoints()
      // console.log('test: ', )
    }
    //если нет то ставим предупреждение в слайд route
    
  },[dataTender])

  useEffect(()=> { 
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})
      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)
      setCoordinatesFrom(coordsFrom)
      setCoordinatesTo(coordsTo)
    }
    
  },[dataTender])

  useEffect(()=>{
    // console.log('text', description)
    // checkEditFields()
    if(title !== null && title!==undefined && title?.trim()?.length > 0 &&
      sum !== null && sum !==undefined && sum > 0 &&
      dataTender.startPoints?.length > 0 &&
      dataTender.endPoints?.length > 0
      ) {
        // console.log('useEffect disable', isDisableBtn)
      setIsDisableBtn(false)
    } else {
      setIsDisableBtn(true)
    }
  },[dataTender,title,description,sum])

  //кнопка сброса
  // useEffect(()=>{
  //   // console.log('text', description)
  //   if((title !==null && title!==undefined && title?.trim()?.length > 0) ||
  //   (description !==null && title!==description && description?.trim()?.length > 0) ||
  //     dataTender.startPoints?.length > 0 ||
  //     dataTender.endPoints?.length > 0
  //     ) {
  //       // console.log('useEffect ', )
  //     setIsShowReset(true)
  //   } else {
  //     setIsShowReset(false)
  //   }
  // },[dataTender,title,description])

  // const testUploads = async () => {
  //   const updatedStartPoints  = await updateImagesInStartPoints(dataTender.startPoints)
  //   let obj ={
  //     'startPoints':  updatedStartPoints,
  //   }
  //   console.log('obj', JSON.stringify(obj,null,2))
  // }
  
  useEffect(()=>{
    if(dataTender.startPoints?.length> 0) {
      let price = dataTender.startPoints.map((item)=>{ return item.price}).reduce((acc, cur) => parseInt(acc) + parseInt(cur),0)
      console.log('dataTender.startPoints', dataTender.startPoints)
      setSum(price)
      let stPointsVolSum = calculateTotalWeight(dataTender.startPoints)
      setSumWeight(stPointsVolSum)
    }
  },[dataTender])

  useEffect(()=>{
    if(dataTender.data.name?.length> 0) {
      setTitle(dataTender.data.name)
    } 
    if(dataTender.data.description?.length> 0) {
      setDiscription(dataTender.data.description)
    }
  },[dataTender])


  useEffect(()=>{
    if(route?.params !== undefined) {
      setTenderState(route?.params.dataTender)
    }
  },[route])

  
    return (
      // <View
      //   // behavior={Platform.OS === 'ios' ? 'height' : 'height'} 
      //   style={{flex:1,}}
      // >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'} 
        style={{flex:1,}}
      >
        <View style={[styles.container,{}]}>
          <StatusBar translucent barStyle={'dark-content'}/>
          <View  style={[styles.topBar,{}]} >
            <HeaderTitleComponentNoBg customStyle={{paddingTop: safeInsets.top,}} title={'Редактирование заказа'} onPress={!isOpenList ? ()=>navigation.goBack(): ()=>setIsOpenList(false)} icon={!isOpenList ? true : true}/>
          </View>
          <View style={[Platform.OS==='android'? {}: {height: height/3+safeInsets?.top},{backgroundColor: '#fff'}]}>    
            <MainMap
              mapViewRef={mapViewRef} 
              // customStyles={{height:height/3+safeInsets?.top}} 
              // custMap={{ minHeight: height/3+safeInsets?.top}}
              customStyles={Platform.OS ==='android'?{height: height/2+safeInsets?.top }:{height: height/3+safeInsets?.top }}
              custMap={Platform.OS ==='android'?{minHeight: height/2+safeInsets?.top }:{minHeight: height/3+safeInsets?.top }}
              // customBtnPosition={safeInsets?.top+40}
              customBtnPosition={Platform.OS==='android'? safeInsets?.top+90 : safeInsets?.top+20}
              coordinatesArr={coordinates}
              coordinatesFrom={coordinatesFrom}
              coordinatesTo={coordinatesTo}
              isRouteVisible={true}
              onCreateRouteInfo={createRouteInfo}
            />
            <LinearGradient colors={['rgba(256, 256, 256, 0.1)','rgba(20, 136, 204, 0.2)', 'rgba(20, 136, 204, 1)']} 
              style={[{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 40,
                zIndex: 1000,
                paddingBottom: Platform.OS==='android' ? 0 : 0, 
                // opacity:0.5
                },// Keyboard.isVisible() ? {flex: 2} :{}
            ]}/>
          </View>
          
          {
            !isOpenList ?
            <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} useAngle angle={-135}
            style={[styles.bottomWrapper,{
              // flex: 2,
              height: height/2,
              paddingBottom: Platform.OS==='android' ? 0 : 0, opacity:1,
              position: 'relative'
            }]}>
              <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(20, 136, 204, 0.1)','rgba(20, 136, 204, 0.0)']} 
                  style={[{
                    position: 'absolute',
                    bottom: 'top',
                    width: '100%',
                    height: 30,
                    zIndex: 1000,
                    paddingBottom: Platform.OS==='android' ? 0 : 0, 
                    // opacity:0.5
                    },
                ]}/>
              {/* <View onPress={()=>Keyboard.dismiss()}> */}
                {/* <ScrollView style={[{backgroundColor: 'transparent'}, Platform.OS==='android' ? {}:{}]}> */}
                <KeyboardAwareScrollView
                  innerRef={ref => {
                    scrollref = ref
                  }}
                  enableOnAndroid={true}
                  extraScrollHeight={0} // на сколько дополнительно поднять поле над клавой
                  // keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    // backgroundColor: 'red',
                    
                    // paddingHorizontal: 15,
                    // paddingTop: 20,
                    // paddingBottom: safeInsets?.bottom,
                  }}
                  keyboardDismissMode='on-drag'
                >
                  <View style={[{paddingHorizontal: 15,paddingTop: 20, paddingBottom: safeInsets?.bottom}]}>

                  <View style={[styles.whiteComponent,mainstyles.shadowPr10,{marginBottom: 20,}]}>
                    <View style={[styles.titleWrapper,{padding: 0,paddingHorizontal:0}]}>
                      <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{title?.length >0? title?.length: 0} | 50</Text>
                      <TextInput 
                        ref={titleRef}
                        style={[mainstyles.text14M,styles.textAddress,styles.inputTitle,Platform.OS==='ios' ? {paddingVertical: 15}: null]}
                        placeholder='Краткое описание*'
                        blurOnSubmit={true}
                        placeholderTextColor={THEME.GREY900}
                        value={title}
                        onChangeText={(v)=>handleSaveText('title',v)}
                        // onFocus={()=>{paddingB===65?setPaddingB(0):null}}
                        // onBlur={()=>{handleSaveText('title'),paddingB===0?setPaddingB(65):null}}
                        maxLength={50}
                      />
                    </View>
                  </View>

                    <View style={[styles.whiteComponent,mainstyles.shadowPr10, styles.midWrapperContent]}>
                      <View style={styles.midTopInner}>
                        <View style={styles.leftContainer}>
                          <IconPinSmallOt />
                          <View style={styles.vertLine}/>
                          <IconPinSmallFill />
                        </View>
        
                        <View style={styles.rightContainer}>
                          <View style={[styles.addressItem,mainstyles.botLineGr]}>
                            {
                              dataTender.startPoints.length===0 ?
                                <TouchableOpacity onPress={()=>onOpenCreatePoint('start')}
                                  style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                                  <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>Загрузка</Text>
                                </TouchableOpacity>
                              :
                                <TouchableOpacity onPress={()=>onOpenList('start')}
                                  style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                                  {dataTender.startPoints.length===1?
                                    <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>{dataTender?.startPoints[0].address}</Text>
                                    :
                                    <View style={[mainstyles.rowalC,styles.textAddress]}>
                                      <Text style={[mainstyles.text14R,styles.textAddressWithNum]}>{dataTender.startPoints?.length}</Text>
                                        {
                                          dataTender.startPoints?.length === 1 ?
                                          <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точка</Text>
                                          :
                                          <>
                                            {
                                              dataTender.startPoints?.length >1&&dataTender.startPoints?.length <=4 ?
                                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точки</Text>
                                              :
                                              <>
                                                {
                                                  dataTender.startPoints?.length > 4?
                                                  <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точек</Text>
                                                  :
                                                  null
                                                }
                                              </>
                                            }
                                          </>
          
                                        }
                                    </View>
                                  }                            
                                  {
                                    dataTender.startPoints?.length > 1 ?
                                    // <BtnIconTrs onPress={()=>onOpenList('start')}>
                                      <Icon name='dots-three-horizontal' color={THEME.GREY500} size={20} style={{ }}/>
                                    // </BtnIconTrs>
                                    : null
                                  }
                                </TouchableOpacity>
                            }
                            <View style={[styles.btnAddressContainer,{width: '18%'}]}>
                              {
                                (dataTender.startPoints?.length+dataTender.endPoints?.length) < 10 &&
                                dataTender.startPoints?.length < 9 ?
                                <BtnIconTrs onPress={()=>onOpenCreatePoint('start')} customStyles={{height: 30}}>
                                  <Icon name={'plus'} color={THEME.GREY500} size={20}/>
                                </BtnIconTrs>
                                :
                                null
                              }
                            </View>
                          </View>
        
                          <View style={[styles.addressItem,styles.addressItemBottom]}>
                            {
                              dataTender.endPoints.length===0?
                                <TouchableOpacity onPress={()=>onOpenCreatePoint('end')}
                                style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                                  <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>Разгрузка</Text>
                                </TouchableOpacity>
                              :
                                <TouchableOpacity onPress={()=>onOpenList('end')}
                                style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                                  
                                  {dataTender.endPoints.length===1?
                                    <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>{dataTender?.endPoints[0].address}</Text>
                                    :
                                    <View style={[mainstyles.rowalC,styles.textAddress]}>
                                      <Text style={[mainstyles.text14R,styles.textAddressWithNum]}>{dataTender.endPoints?.length}</Text>
                                        {
                                          dataTender.endPoints?.length === 1 ?
                                          <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точка</Text>
                                          :
                                          <>
                                            {
                                              dataTender.endPoints?.length >1&&dataTender.endPoints?.length <=4 ?
                                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точки</Text>
                                              :
                                              <>
                                                {
                                                  dataTender.endPoints?.length > 4?
                                                  <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точек</Text>
                                                  :
                                                  null
                                                }
                                              </>
          
                                            }
                                          </>
          
                                        }
                                    </View>
                                  }
                                  {
                                    dataTender.endPoints?.length >1?
                                    // <BtnIconTrs onPress={()=>onOpenList('end')}>
                                      <Icon name='dots-three-horizontal' color={THEME.GREY500} size={20} style={{ }}/>
                                    // </BtnIconTrs>
                                    : null
                                  }
                                </TouchableOpacity>
                            }
                            <View style={[styles.btnAddressContainer,{width: '18%'}]}>
                              {
                                (dataTender.startPoints?.length+dataTender.endPoints?.length) <10 &&
                                dataTender.endPoints?.length < 9 ?
                                <BtnIconTrs onPress={()=>onOpenCreatePoint('end')} customStyles={{height: 30}}>
                                  <Icon name={'plus'} color={THEME.GREY500} size={20}/>
                                </BtnIconTrs>
                                :
                                null
                              }
                            </View>
        
                            
                          </View>
                        </View>
                      </View>
        
                      <View style={[mainstyles.lineTop,mainstyles.pH20,{paddingBottom: 15}]}>
                        <View style={[mainstyles.rowalCjcSb,mainstyles.pV5]}>
                          <Text style={[mainstyles.text14M,styles.textAddress]}>Стоимость</Text>
                          <Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>{sum} BYN</Text>
                        </View>
                        <View style={[mainstyles.rowalCjcSb,mainstyles.pV5]}>
                          <Text style={[mainstyles.text14M,styles.textAddress]}>Расстояние:</Text>
                          {
                            routeInfo?.distance && routeInfo.distance?.length > 0 ? 
                            <Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>{routeInfo.distance} км</Text>
                            :<Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>-</Text>
                          }
                        </View>
                        <View style={[mainstyles.rowalCjcSb,mainstyles.pV5]}>
                          <Text style={[mainstyles.text14M,styles.textAddress]}>Общий вес:</Text>
                          {
                            sumWeight > 0 ?
                            <Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>{sumWeight} кг</Text>
                            :<Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>-</Text>
                          }
                        </View>
                      </View>
                    </View>

                    <View style={[styles.whiteComponent,mainstyles.shadowPr10,mainstyles.inputMultiline5,styles.titleSection]}>
                      <View style={styles.titleDisct}>
                        <TextInput 
                          ref={discrRef}
                          blurOnSubmit={true}
                          style={[mainstyles.text14R,styles.desctInput,]}
                          textAlignVertical='top'
                          placeholder='Уточнения про доставку...'
                          placeholderTextColor={THEME.GREY800}
                          value={description}
                          onChangeText={(v)=>handleSaveText('description',v)}
                          // onChangeText={setDiscription}
                          multiline={true}
                          numberOfLines={5}
                          // setNum(5),
                          // onFocus={()=>{paddingB===65?setPaddingB(0):null}}
                          // onBlur={()=>{handleSaveText('description'),paddingB===0?setPaddingB(65):null}}
                        />
                      </View>
                    </View>

                    <View style={[styles.btnRow,{width: '100%'}]}>
                      <View style={[styles.qwe,{width: '48%'}]}>
                        <DefaultBtnWite title={'Сохранить'} disabled={isDisableBtn} onPress={handleEditTender} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
                      </View>
                        <View style={[styles.qwe,{width: '48%'}]}>
                          <DefaultBtnWite title={'Отменить'} onPress={handleOpenAsk} customStyles={[styles.btnCustomStyle,{width: '100%'}]}/>
                        </View>
                      {/* {isShowReset ?
                        : null
                      } */}
                    </View>
                  </View>

                </KeyboardAwareScrollView>
                {/* </ScrollView> */}
                    
              {/* </View> */}
            </LinearGradient>
              :
              <ListPoints 
                point={listPoint} 
                data={dataTender} 
                onClose={()=>setIsOpenList(false)}
                onEdit={handleEditPoint}
                onDelete={handleDeletePoint}
                onChangeIndex={handleChangeIndexPoint}
                nav={'editTender'}
              />
    
          }
          {
            isAskResetVisible?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top+safeInsets?.top,minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'askResetEditTender',askResetEditTender)} onPress={handleResetState} onClose={()=>setIsAskResetVisible(false)}/>
            </View>
            :
            null
          }
          {
            isLoading?
            <View style={[mainstyles.containerModalGgBl,{zIndex: 999,minHeight: height+safeInsets?.top,justifyContent: 'center',}]}>
              <ActivityIndicator color={'#fff'} size={'large'}/>
            </View>
            : null
          }
          {
            isSuccessedCreate ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'promptSuccEditTend',promptSuccEditTend)} onPress={handleResetState}/>
            </View>
            :null
          }
          {
            isShowDateExpired  ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'promptShowDateExpired',promptShowDateExpired)} onPress={()=>setIsShowDateExpired(false)}/>
            </View>
            :null
          }
        </View>
      </KeyboardAvoidingView>
      // </View>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: '#fff',
    justifyContent: 'flex-end'
  },
  topBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    zIndex: 990,
  },
  whiteComponent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 15,
  },
  bottomWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 999
  },
  midWrapperContent: {
    // backgroundColor: 'pink',
    marginBottom: 20,
  },
  midTopInner: {
    // backgroundColor: 'yellow',
    width: '100%',
    flexDirection: 'row',
  },
  leftContainer: {
    // backgroundColor: 'red',
    paddingLeft: 23,
    paddingRight: 13,
    width: '15%',
    // paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vertLine: {
    width: 1.7,
    height: 35,
    backgroundColor: THEME.PRIMARY,
    marginVertical: 6
  },
  rightContainer: {
    // backgroundColor: 'blue',
    width: '85%',
  },
  addressItem: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    paddingRight: 20
  },
  addressItemBottom: {
    // backgroundColor: 'green',
    borderBottomWidth: 0,
  },
  btnAddressContainer: {
    // backgroundColor: 'blue', 
    width: '30%', 
    alignItems: 'center',
    justifyContent: 'flex-end', 
    flexDirection: 'row'
  },
  textAddress: {
    width: '70%',
    color: THEME.GREY900, 
    paddingHorizontal: 5,
  },
  textAddressWithNum: {
    color: THEME.GREY900, 
    paddingHorizontal: 5,
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth:1,
    borderTopColor: THEME.GREY300,    
  },
  btnRow: {
    // backgroundColor: 'red',
    width: width-60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  btnCustomStyle: {
    height: 45, 
    borderRadius: 50,
    shadowColor: THEME.PRIMARY,
    elevation: 20,
  },
  titleSection: {    
    paddingVertical: 5,
    marginBottom: 20,
    borderRadius: 28,
  },
  titleWrapper: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 20,
  },
  titleDisct: {
    paddingHorizontal: 20,
  },
  inputTitle: {
    padding: 0,
    // backgroundColor: 'red',
    paddingVertical: 10,
    paddingLeft: 15,
    borderRadius: 28,
    width: '100%',
  },
  discrWrapper: {
    // backgroundColor: 'purple',
    paddingTop: 12,
  },
  desctInput: {
    color: THEME.GREY800,
    alignItems: 'center',
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    top: 12,
    right: 20,
    justifyContent: 'center'
  },
})

export default EditTenderScreen;