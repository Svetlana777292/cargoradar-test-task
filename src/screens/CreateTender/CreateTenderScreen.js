import React,{ useState, useEffect,useRef } from 'react';
import { Platform, KeyboardAvoidingView, Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, StatusBar, ScrollView } from 'react-native';

//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/entypo';
import { Image } from 'react-native-compressor';

//components
import { MainMap } from '../../components/MapComponents/MainMap';
import IconPinSmallOt from '../../components/Svg/IconPinSmallOt';
import IconPinSmallFill from '../../components/Svg/IconPinSmallFill';
import { BtnIconTrs } from '../../components/Buttons/BtnIconTrs';
import ListPoints from '../../components/ListPoints/ListPoints';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import { HeaderTitleComponentNoBg } from '../../components/Headers/HeaderTitleComponentNoBg';
import { DefaultBtnOutline } from '../../components/Buttons/DefaultBtnOutline';

//functions && features && slice
import { askResetTender, height, promptSuccCrTend, width } from '../../util/helperConst';
import { onChangeIndexOfPoint, onDeletePoint, onResetTender, setInfoTender, } from '../../store/features/addTenderSlice';
import { calculateTotalWeight, findJsonObj, formatDateToMls } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import { compressImages, getUrlUploadImage } from '../../util/uploadFilesHelper';
import { uploadImages } from '../../store/features/Upload/uploadfiles';
import { post } from '../../store/features/api/user-api';
import { setUserFormDataFromDB } from '../../store/features/api/userInfoForms';

const CreateTenderScreen = ({route,navigation}) => {
  console.log('\x1b[34m%s %s\x1b[0m \x1b[34m%s', 'screens > CreateTender > CreateTenderScreen.js', 'route:',route);
  const mapViewRef = useRef(null)
  const titleRef = useRef(null)
  const discrRef = useRef(null)
  let scrollref = useRef(null)
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const dataTender = useSelector(state=> state.addTender.tender)
  const userProfile = useSelector((state) => state.login.userProfileInfo)
  const {userFormsInfo, } = useSelector((state) => state.login)
  // console.log('userProfile', userProfile)
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
  const [isDisableBtn, setIsDisableBtn] = useState(true)
  const [isAskResetVisible, setIsAskResetVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessedCreate, setIsSuccessedCreate] = useState(false)
  const [isShowReset, setIsShowReset] = useState(false)
  const [tenderDataToNav,setTenderDataToNav] = useState(null)
  const dispatch = useDispatch()
  // console.log('dataTender', JSON.stringify(dataTender,null,2) )
  // console.log('dataTender',JSON.stringify(dataTender.startPoints,null,2) )

  const onOpenList = (point) => {
    console.log('onOpenList btn', point)

    setIsOpenList(true)
    setListPoint(point)
  }
  const onOpenCreatePoint = (point) => {
    if(point==='start') {
      dataTender.startPoints.length === 0 ?  navigation.navigate('CreateStartPoint',{firstOpen: true}) : navigation.navigate('CreateStartPoint',{firstOpen: false})
    } else if(point==='end') {
      dataTender.endPoints.length === 0 ?  navigation.navigate('CreateEndPoint',{firstOpen: true}) : navigation.navigate('CreateEndPoint',{firstOpen: false})

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
  }

  const handleEditPoint = (item,index,point) => {
    console.log('handleEditPoint: ', )
    if(point==='start'){
      navigation.navigate('CreateStartPoint',{data: {item: item, index: index, type: point, action: 'edit'}})
    } else {
      navigation.navigate('CreateEndPoint',{data: {item: item, index: index, type: point, action: 'edit'}})
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
  
  const handleResetState = (flag) => {
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
      if(flag==='nav') {

        navigation.reset({
          index: 0,
          routes: [{
            name: 'TendersTab', 
            state: {
              routes: [
              {name: 'Tenders'},
              //!! tenderDataToNav - теперь id внутри data - после исправления в скринах включить
              //{name: 'TenderItemClient',params: {dataTender: tenderDataToNav}}
              
            ]
            }
          }],
        })
      } else {
        setIsAskResetVisible(false)
        setIsSuccessedCreate(false)
      }
  }
  const createRouteInfo = (result) => {
    
    setRouteInfo({
      distance: result.distance.toFixed(1),
      duration: result.duration
    })
  }

  const uploadImage = async (photo) => {
    console.log('uploadImage image url:', photo);
    // console.log('uploadImage index: ', index);

    const compressResult = await compressImages(photo)
    // console.log('compressResult', compressResult)

    try {
      //1 - подготовить фото
      const objToUpload = await getUrlUploadImage(compressResult)
      console.log('objToUpload', objToUpload)
      //2. загрузить
      const uris = await uploadImages(objToUpload,'tenders')
      console.log('uris', uris)
      return uris

    } catch (error) {
      console.log('local fn uploadImage error', error);
      return [];
    }

    // if(photo.includes('firebasestorage.googleapis.com')) {
    //   console.log('photo already in storage:', photo);
    //   return 
    // } 

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
          return point; // Возвращаем исходный объект, если images не является массивом или пустым массивом
        }
        const updatedImages = await uploadImage(point.images)
        console.log('updatedImages', updatedImages)
        // await Promise.all(
        //   point.images.map(async (photo) => {
        //     return await uploadImages(photo);
        //   })
        // );
        if(updatedImages?.message) {
          alert(arrResp?.message)
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
      // console.log('updateImagesInStartPoints updatedStartPoints:', updatedStartPoints)
    return updatedStartPoints;
  };

  const testUploads = async () => {
    const updatedStartPoints  = await updateImagesInStartPoints(dataTender.startPoints)
    let obj ={
      'startPoints':  updatedStartPoints,
    }
    console.log('obj', JSON.stringify(obj,null,2))
  }
  // console.log('text', JSON.stringify(dataTender.startPoints,null,2))

  const handleCreateTender = async() => {
    Keyboard.dismiss()
    setIsLoading(true)

    try {
      
      const updatedStartPoints = await updateImagesInStartPoints(dataTender.startPoints)
      // console.log('dataTender', dataTender)
      console.log('updatedStartPoints', updatedStartPoints)
      let tenderObj = {
        'status': 'publish', // create - когда будет админка
        'statusMsg': '',
        'archived': false,
        // 'createdAt': timeCreate,
        'isEdit': null,
        'finishedAt': null,
        'orderStartedAt': null,
        'driverId': null,
        'replyId': null,
        'name':  dataTender.data?.name?.trim(),
        'description':  dataTender.data?.description?.trim(),
        'price': sum,
        'startPoints': updatedStartPoints, //dataTender.startPoints,
        'endPoints':  dataTender.endPoints,
        'route':  routeInfo,
        'userId':  userProfile.id,
        // 'userName':  userProfile?.name,
        // 'avatar':  userProfile?.clientAvatar ? userProfile?.clientAvatar: null,
        // 'rating': userProfile?.rating ? userProfile?.rating : null,
        // 'size': sizeOfTender,
        'usersIdWithBet': [],
        'usersIdWithChat': [],
      }
      
      console.log('tenderObj', tenderObj);  
  
      // сохранение и отправка
      const response = await post('tenders',tenderObj)

      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        alert(response.error);
        return;
      }
      //обновить кол-во заявок в профиле
      let count = userFormsInfo.profile.quantityTenders !== null ? ++userFormsInfo.profile.quantityTenders : 1
      let obj = {profile: {
        quantityTenders: count
      }}
      setUserFormDataFromDB(dispatch,obj)
      // console.log('response.data', response.data)
      setIsLoading(false)
      setIsSuccessedCreate(true)
      setTenderDataToNav(response.data)
      
      // await firestore().collection('tenders')
      // .add(tenderObj)
      // .then((docRef) => {
      //   firestore().collection('tenders').doc(docRef.id).get().then(doc => {
      //     setIsLoading(false)
      //     setIsSuccessedCreate(true)
      //     setTenderDataToNav({data: doc.data(), id: doc.id})
      //     console.log('successfully!',doc.data(), doc.id) 
      //     firestore().collection('forms').doc(uid).update({'profile.quantityTenders': firestore.FieldValue.increment(1)})
      //   })
      //   // console.log('res', res)
      // })
      
      
    } catch (error) {
      setIsLoading(false)
      console.log(' error', error);
      alert(`Ошибка создания заявки \n err:${JSON.stringify(error)}  msg:${JSON.stringify(error?.messages)}`)
    }
  }

  useEffect(()=> { 
    const onCreateRoutePoints = () => {
      console.log(' onCreateRoutePoints START', )

      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})
      
      //координаты в один массив
      const coordsRoute = coordsFrom.concat(coordsTo)
      setCoordinates(coordsRoute)
    }
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      onCreateRoutePoints()
    }
    
  },[dataTender])

  useEffect(()=> { 
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})
      setCoordinatesFrom(coordsFrom)
      setCoordinatesTo(coordsTo)
    }
    
  },[dataTender])


  useEffect(()=>{
    // console.log('text', description)
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
  useEffect(()=>{
    // console.log('text', description)
    if((title !==null && title!==undefined && title?.trim()?.length > 0) ||
    (description !==null && title!==description && description?.trim()?.length > 0) ||
      dataTender.startPoints?.length > 0 ||
      dataTender.endPoints?.length > 0
      ) {
      setIsShowReset(true)
    } else {
      setIsShowReset(false)
    }
  },[dataTender,title,description])
  
  useEffect(()=>{
    if(dataTender.startPoints?.length> 0) {
      let price = dataTender.startPoints.map((item)=>{ return item.price}).reduce((acc, cur) => parseInt(acc) + parseInt(cur),0)
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
  },[])
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex:1,}}
      >
        <View style={[
          
          Platform.OS==='android' ?{
            flex: 1,
            position: 'relative',
            width: width,
            height: height,
            backgroundColor: '#fff',
            justifyContent: 'flex-end'
          // height: height+safeInsets.top,
          
          } :
          {
            flex: 1,
            position: 'relative',
            width: width,
            height: height,
            backgroundColor: '#fff',
            justifyContent: 'flex-end'
          // height: height+safeInsets.top,
          
          },
          // styles.container,
          // { backgroundColor: 'red'}
        ]}>
          <StatusBar translucent barStyle={'dark-content'}/>
          <View  style={[styles.topBar,
            // {backgroundColor: 'orange'}
          ]}>
            <HeaderTitleComponentNoBg customStyle={{paddingTop: safeInsets.top}} title={'Ваша доставка'} onPress={!isOpenList ? ()=>navigation.goBack(): ()=>setIsOpenList(false)} icon={!isOpenList ? false : true}/>
          </View>
          {/* <View style={[
            Platform.OS==='android'? 
              {height: height/3+safeInsets?.top, backgroundColor: 'orange'}
              // {minHeight: height/3, backgroundColor: 'orange'}
            : {height: height/3},{backgroundColor: '#fff'}
          ]
            }> */}
          <View style={[Platform.OS==='android'? 
          // {flex:2, height: height/2+safeInsets?.top}
            // {height: height/3+safeInsets?.top}
            {}

          : 
            {height: height/3+safeInsets?.top},{backgroundColor: '#fff'}
            // {}
            ]}>    
            
    
            <MainMap 
              mapViewRef={mapViewRef} 
              // customStyles={{height:height/3+safeInsets?.top}}
              // custMap={{height:height/3+safeInsets?.top}}
              customStyles={Platform.OS ==='android'?{height: height/2+safeInsets?.top }:{height: height/3+safeInsets?.top }}
              custMap={Platform.OS ==='android'?{minHeight: height/2+safeInsets?.top }:{minHeight: height/3+safeInsets?.top }}
              customBtnPosition={Platform.OS==='android'? safeInsets?.top+25 : safeInsets?.top}
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
                },
            ]}/>
          </View>
          {
            !isOpenList ?
            // <View></View>

            <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} 
              style={[styles.bottomWrapper,{
                // flex: 2,
                height: height/2, 
                position: 'relative',
                },
            ]}>

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

                <ScrollView ref={scrollref} style={[{backgroundColor: 'transparent'}, Platform.OS==='android' ? {}:{}]}
                  keyboardDismissMode='on-drag'
                  contentContainerStyle={{paddingHorizontal: 15,paddingTop: 20, paddingBottom: safeInsets?.bottom}}
                  // StickyHeaderComponent={headerc}
                  // stickyHeaderIndices={[0]}
                >

                  {/* <View style={[{paddingHorizontal: 15,paddingTop: 20, paddingBottom: safeInsets?.bottom}]}> */}

                    <View style={[styles.whiteComponent,mainstyles.shadowPr10,{marginBottom: 20,}]}>
                      <View style={[styles.titleWrapper,{padding: 0,paddingHorizontal:0}]}>
                        <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{title?.length >0? title?.length: 0} | 50</Text>
                        <TextInput 
                          ref={titleRef}
                          style={[mainstyles.text14M,styles.textAddress,styles.inputTitle,Platform.OS === 'ios'? {paddingVertical: 15}: null]}
                          placeholder='Краткое описание*'
                          blurOnSubmit={true}
                          placeholderTextColor={THEME.GREY900}
                          value={title}
                          onChangeText={(v)=>handleSaveText('title',v)}
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
                                      <Icon name='dots-three-horizontal' color={THEME.GREY500} size={20} style={{ }}/>
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
                        
                    <View style={[styles.whiteComponent,mainstyles.shadowPr10,styles.titleSection,]}>
                      <View style={styles.titleDisct}>
                        <TextInput 
                          ref={discrRef}
                          blurOnSubmit={true}
                          style={[mainstyles.text14R,styles.desctInput,Platform.OS==='ios' ? {minHeight: 120}:null]}
                          textAlignVertical='top'
                          placeholder='Уточнения про доставку...'
                          placeholderTextColor={THEME.GREY800}
                          value={description}
                          onFocus={() => {scrollref?.current?.scrollToEnd({animated: true})
                        }}
                          onChangeText={(v)=>handleSaveText('description',v)}
                          multiline={true}
                          numberOfLines={5}
                        />
                      </View>
                    </View>

                    <View style={[styles.btnRow,{alignSelf: 'center',width: '100%',}]}>
                      <View style={[styles.qwe,{width: !isShowReset ? '100%' : '80%'}]}>
                        <DefaultBtnOutline title={'Создать заказ'} disabled={isDisableBtn} onPress={handleCreateTender} 
                        customStyles={[styles.btnCustomStyle, {width: '100%',}]}
                        />
                        {/* {
                          __DEV__&&
                          <DefaultBtnOutline title={'тест'} disabled={true} onPress={testUploads} 
                          customStyles={[styles.btnCustomStyle, {width: '100%',borderColor: 'red', backgroundColor: 'red'}]}
                          />
                        } */}
                      </View>
                      {isShowReset ?
                        <View style={[styles.qwe,{}]}>
                          <TouchableOpacity style={[mainstyles.alCjcC,styles.closeBtn,mainstyles.shadowPr10,]} onPress={handleOpenAsk}>
                            <Icon name="cross" size={30} color={THEME.GREY500}/>
                          </TouchableOpacity>
                        </View>
                        : null
                      }
                    </View>
                  {/* </View> */}

                </ScrollView>

            </LinearGradient>
              :
              <ListPoints 
                point={listPoint} 
                data={dataTender} 
                onClose={()=>setIsOpenList(false)}
                onEdit={handleEditPoint}
                onDelete={handleDeletePoint}
                onChangeIndex={handleChangeIndexPoint}
                nav={'createTender'}
              />
    
          }
          {
            isAskResetVisible?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top,minHeight: height+safeInsets.top,zIndex: 999}]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'askResetTender',askResetTender)} onPress={handleResetState} onClose={()=>setIsAskResetVisible(false)}/>
            </View>
            :
            null
          }
          {
            isLoading?
            <View style={[mainstyles.containerModalGgBl,{zIndex: 999,minHeight: height+safeInsets.top,justifyContent: 'center',paddingTop: safeInsets.top}]}>
              <ActivityIndicator color={'#fff'} size={'large'}/>
            </View>
            : null
          }
          {
            isSuccessedCreate ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets.top,zIndex: 999,paddingTop: safeInsets.top}]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'promptSuccCrTend',promptSuccCrTend)} onPress={()=>handleResetState('nav')} onClose={()=>handleResetState()}/>
            </View>
            :null
          }
        </View>
      </KeyboardAvoidingView>
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
    // backgroundColor: 'pink',
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
    // backgroundColor: 'red'
  },
  bottomWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    // backgroundColor: 'green',
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
  closeBtn: {
    width: 45,
    height: 45,
    borderRadius: 40,
    backgroundColor: '#fff',
    elevation: 10,
    borderWidth: 2,
    borderColor:THEME.PRIMARY
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
    // backgroundColor: 'blue',
    paddingVertical: 10,
    paddingLeft: 15,
    borderRadius: 28,
    width: '100%',
  },
  desctInput: {
    color: THEME.GREY800,
    alignItems: 'center',
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    top: 12,
    right: 20
  },
})

export default CreateTenderScreen;


