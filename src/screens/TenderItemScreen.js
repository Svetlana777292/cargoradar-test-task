import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Keyboard, Animated, TouchableWithoutFeedback, Image, ScrollView, SafeAreaView, Modal, Linking, TextInput, FlatList, Pressable, ActivityIndicator, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
// import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useSelector, useDispatch } from 'react-redux';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

//functions && features && slice
import {  getAllComplaints, getDetailProfile, getGetTenderCountInfo, getProfileUserInfoForComplaint, getTenderDelete, getTenderFaivor, getTenderHidden, getTenderHiddenClient } from '../util/firebase';
import { userProfileTenderDelete, userProfileTenderFaivor, userProfileTenderHidden, userProfileTenderHiddenClient, } from '../store/features/userSlice';
import { openGM } from '../util/MapUtil/mapFn';
import { cancelAlertClient, cancelTender, complaintSucceed, finishTender, finishTenderErr, height, width } from '../util/helperConst';
import { cancelDelivery, firebeseUpdateTender, handleAddChatToHiddenBothRole, handlerCallNumer, restoreUsersWithChatsFromHidden } from '../util/tenders';
import { messageIdGenerator } from '../util/msgGenerator';
import { calculateTotalWeight, findJsonObj } from '../util/tools';

//components
import { OpenGoogleMaps } from '../components/Modal/OpenGoogleMaps';
import { TenderMapDriver } from '../components/MapComponents/TenderMapDriver';
import { AddressPointsView } from '../components/AddressPointsView';
import BackArrow from '../components/Svg/BackArrow';
import { BtnIconTrs } from '../components/Buttons/BtnIconTrs';
import ListPointSlider from '../components/ListPointSlider';
import IconStarSmall from '../components/Svg/IconStarSmall';
import IconStarSmallFill from '../components/Svg/IconStarSmallFill';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import { ProfileInfo } from '../components/Profile/ProfileInfo';
import { ProfileInfoWithTestimonial } from '../components/Profile/ProfileInfoWithTestimonial';
import PromptComponent from '../components/Modal/PromptComponent';
import { ButtonWithIcon } from '../components/Buttons/ButtonWithIcon';
import IconCall from '../components/Svg/IconCall';
import IconChatsTab from '../components/Svg/IconChatsTab';
import IconCheck from '../components/Svg/IconCheck';
import IconCross from '../components/Svg/IconCross';
import IconCheckThin from '../components/Svg/IconCheckThin';
import InfoAskWindowWithInput from '../components/Modal/InfoAskWindowWithInput';

//styles
import { mainstyles, SIZE, THEME,} from '../theme';
import { MenuListComponent } from '../components/MenuListComponent';
import IconMenuDots from '../components/Svg/IconMenuDots';
import ComplaintComponent from '../components/Modal/ComplainComponent';
import { userProfileInfo } from '../store/features/loginSlice';
import { WrapperModalView } from '../components/Modal/WrapperModalView';
import { DescriptionComponent } from '../components/DescriptionComponent';
import { CarouselImages } from '../components/CarouselImages';
import { CarouselImagesView } from '../components/CarouselImagesView';
import { requestStoragePermisson } from '../util/permissions';
import IconDblCheck from '../components/Svg/IconDblCheck';
import { getUserHiddenTenders, setDriverFormUpd, setUserFormDataFromDB } from '../store/features/api/userInfoForms';
import { toggleNumberInArray } from '../util/arrayHelpers';
import { get } from '../store/features/api/user-api';
import { parseDateTimeObj } from '../util/dateFormats';
import { delTenderInformersState, setCurrentChatId } from '../store/features/listOfChatsSlice';
import { sendComplain } from '../util/helpersapidatafunc';
import { normalize } from '../util/UI/fontsUI';

export const TenderItemScreen = ({route, navigation}) => {
  console.log('TenderItemScreen route getstate',)
  const safeInsets = useSafeAreaInsets();
  const isfocused = useIsFocused()
  // console.log('TenderItemScreen isfocused', isfocused)
  const mapViewRef = useRef()
  const carouselImages = useRef();
  const uid = '2'//auth().currentUser.uid
  // const role = useSelector(state => state.login.role)
  const [anim] = useState(new Animated.Value(0));
  // const routeData = route.params.dataTender
  // const chatsRef = firestore().collection('messages')
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  
  // const stateOfMsg = useSelector((state) => state.chats.msgState)
  const stateOfInformers = useSelector((state) => state.chats)
  const { currentChatId, currentChatMsgState, currentChatReplState, tenderInformersState } = useSelector(state => state.listofchats)
  //!!todo currentChatMsgState currentChatReplState сделать стейты для заявок ( для обновления сообщений и ставок когда водитель в этом скрине)
  //todo сокет - сразу отправлять объект в стейт  и от туда уже брать для чатов или заявок? продумать

  // const userProfileInfo =  useSelector((state) => state.login.userProfileInfo)
  // const tenderFaivor = useSelector((state) => state.user.tenderFaivor)
  // const tenderDelete = useSelector((state) => state.user.tenderDelete) //скрытые заявки только водитель deleteTenders
  // const blackListArr = useSelector((state) => state.user.blacklist)
  const {userProfileInfo, userFormsInfo, role,userFormsHiddenTenders,driverFavoritsTenders,driverDeleteTenders,userFormsActivities } = useSelector((state) => state.login)
  const tendersActivity = useSelector((state) => state.user.tendersActivity)
  const hiddenTender = useSelector((state) => state.user.hiddenTender)

  // console.log('TenderItemScreen userFormsInfo: ', userFormsInfo)

  const tenderId = route.params?.dataTender.id

  const [tenderState, setTenderState] = useState(null)
  const [statusTenderUpd,setStatusTenderUpd] = useState(false)
  const [clientInfo, setClientInfo] = useState(null)
  const [descriptionPoints, setDescriptionPoints] = useState([])
  const [imagesState, setImagesState] = useState([])
  const [isFaivor, setIsFaivor] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isShowHideButton, setShowHideButton] = useState(true)
  const [isVisibleModalAsk, setIsVisibleModalAsk] = useState(false)

  const [showPointsDatail, setShowPointsDatail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)
  const [isVisibleProfileTestim, setIsVisibleProfileTestim] = useState(false)
  const [showAlertCancel, setShowAlertCancel] = useState(false)
  const [isVisibleCancelAsk, setIsVisibleCancelAsk] = useState(false)
  const [isVisibleAddCarsModal, setIsVisibleAddCarsModal] = useState(false)
  const [isShowSucceed, setIsShowSucceed] = useState(false)
  const [ownerInfo, setOwnerInfo] = useState(null)
  const [msgCancelText,setMsgCancelText] = useState('')
  const [isScrollEnb,setIsScrollEnb] = useState(true)
  const [isVisibleMenu,setIsVisibleMenu] = useState(false)
  const [isVisibleForm,setIsVisibleForm] = useState(false)
  const [isVisibleFormSucceed,setIsVisibleFormSucceed] = useState(false)
  const [sumWeight, setSumWeight] = useState(0)
  const [isShowCarousel,setIsShowCarousel] = useState(false)
  const [currIndexImag, setCurrIndexImag] = useState(0)
  const [disableDownload, setDisableDownload] = useState(false)
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isDownloadSucceed, setIsDownloadSucceed ] = useState(false);
  const [downloadedUrl, setDownloadedUrl ] = useState([]);
  // console.log('currIndexImag', currIndexImag)
  // console.log('clientInfo', clientInfo)
  const stylesCarousel = Platform.OS==='android' ? (height > 700 ? {flex:1, minHeight: height+safeInsets?.top, } : {}) : {flex:1,}


  const dispatch = useDispatch()

  const top = safeInsets?.top+10
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, top] // Начальное значение и значение после анимации
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1] // Начальное значение и значение после анимации
  });
  
  const animateIn = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500, // Продолжительность анимации
      useNativeDriver: true
    }).start();
  };

  const animateOut = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 600, // Продолжительность анимации
      useNativeDriver: true
    }).start();
  };

  const handleOnOpenFile = async (uri) =>{
    console.log('handleOnOpenFile uri', uri)
    const path = await FileViewer.open(uri) // absolute-path-to-my-local-file.
    .then(() => {
      // success
      console.log('success', )
    })
    .catch((error) => {
      // error
      console.log('handleOnOpenFile error', error)
    });
  }

  const handleCloseSettings = () => {
    setIsShowCarousel(false)
    setCurrIndexImag(0)
    setDisableDownload(false)
    setProgress(0)
    setProgressStatus('')
    // setImageState([])
    // setEnScr(true)
  }  

  const getLastData = (arr) => {
    // console.log('arr', arr)
    let date = arr && arr.reduce(function(prev, current) {
      
      return (prev.createdAt.toMillis() > current.createdAt.toMillis()) ? prev : current
    });
    const d = new Date(date.createdAt.toMillis())
    // console.log('d', d)
    
    let formattedDate = ("0" + d.getDate()).slice(-2)  + "." + ("0"+(d.getMonth()+1)).slice(-2)  + "." + d.getFullYear()
    // console.log('d', d)
    // console.log('formattedDate', formattedDate)
    return {formattedDate: formattedDate, dateMls: date.createdAt.toMillis()};

  }
  //!!Get data client(form repl massages)
  const getClientChat = async (tenderData) => {
    console.log('getClientChat start', )
    setIsLoadingChat(true)
    try {

      const response = await get(`tenders/${tenderData.id}/replies/drivers/${userProfileInfo.id}`)
      
      if (!response.success) {
        // console.warn('Ошибка запроса:', response.error);
        alert(response.error);
        return;
        
      }
  
      // console.log('response', JSON.stringify(response.data,null,2))
    
      //TODO
      //2 - создание объекта листа:
      // непрочитанные сообщения клиента myUnreadMsg +
      // непрочитанные сообщения водителя unReadMsg +
      // дата сообщения последнего dateMsg + (последнее сообщение в массиве)
      // дата сообщения последнего в млс dateMls + (последнее сообщение в массиве)
      // ставка repl +
      // инфо водителя из формс userInfo +
      // свой рейтинг rating +
      // завершенные заявки водителем finishedTenders +
      
      let myUnreadMsg = []
      let unReadMsg = []

      const userMsgArr = response.data.messages 
      
      //если попадают чужие сообщения
      // response.data.messages.forEach(elemmsg => {
      //     //todo как исправят точку тогда это не надо
      //     // console.log('elemmsg', elemmsg)
      //     //он создатель я получатель или я создатель он получатель
      //     if((elemmsg.userId === response.data.forms.profile.id && elemmsg.partnerId === userProfileInfo.id) || (elemmsg.userId === userProfileInfo.id && elemmsg.partnerId === response.data.forms.profile.id)) userMsgArr.push(elemmsg)  
      // })
      // console.log('userMsgArr', userMsgArr)
      // console.log('userMsgArr', JSON.stringify(userMsgArr,null,2))

      userMsgArr.forEach(elemmsg => {
        // console.log('userProfileInfo.id', userProfileInfo.id)
        if(elemmsg.tenderId !== tenderData.id) return
        if(elemmsg.read===false && elemmsg.partnerId !== userProfileInfo.id ) myUnreadMsg.push(elemmsg) 
        if(elemmsg.read === false && elemmsg.partnerId === userProfileInfo.id ) unReadMsg.push(elemmsg)
      })
        
      const formatData = userMsgArr.length > 0 ? parseDateTimeObj(userMsgArr[userMsgArr.length-1]?.createdAt) : {dateMsg: null,dateMls: null}
      // console.log('formatData', formatData)
        
      let obj = {
        data: tenderData,
        messages: userMsgArr,//response.data.messages.filter(elemmsg => elemmsg.tenderId === tenderId),
        forms: response.data.forms, //!! forms.profile - или брать профиль только - посмотреть что используется из формс
        unReadMsg: unReadMsg, //Todo - записывать длину
        dateMsg: formatData.dateMsg,
        dateMls: formatData.dateMls,
        repl: response.data?.reply,
        userInfo: {
          name: response.data.forms.profile.name, 
          avatar: response.data.forms.profile.clientAvatar, 
          userId: response.data.forms.profile.id,
          rating: response.data.forms.profile.rating,
          quantityTenders: response.data.forms.profile.quantityTenders,
          phone: response.data.forms.profile.phone
        },
        myUnreadMsg: myUnreadMsg, //Todo - записывать true/false
      }
      // console.log('obj', obj)
      // console.log('obj', JSON.stringify(obj,null,2))

      
      setClientInfo([obj])
      setIsLoadingChat(false)
      
    } catch (error) {
      console.log('getClientChat error', error)
    }
  }

  //!!Open chat
  const handleOpenChat = (props) => {
    // console.log('props', props)
    dispatch(setCurrentChatId({tenderId: route.params.dataTender.id, userId: props.userInfo.userId}))

    navigation.navigate('Chat',{item: tenderState, userInfo: props.userInfo, data: props})

  }
  
  const getTenderState = async (id) => {
    console.log('getTenderState start', )
    setIsLoading(true)
    try {
      const responseTender = await get(`tenders/${id}`)
      
      if (!responseTender.success) {
        console.warn('Ошибка запроса tenders/id :', responseTender.error);
        //
        alert(responseTender.error);
        return null;
      }
      console.log('getTenderState new data',responseTender.data)
      setTenderState(responseTender.data)
      setIsLoading(false)
      return responseTender.data
    } catch (error) {
      setIsLoading(false)
      console.log('catch getTenderState error', error)
    }
  }

  const handleOpenTestimonials = async () => {
    //todo getTenderState дописать
    //проверять что бы заявка не была отменена клиентом
    let tenderObj = {}//await getTenderState() 
    // console.log('tenderObj', tenderObj)
    // if(tenderObj?.driverId == null && tenderObj?.canceledBy == tenderObj?.userId) {
    //   setTenderState(tenderObj)
    //   setShowAlertCancel(true)
    // } else {

    //   setIsVisibleProfileTestim(true)
    // }
    setIsVisibleProfileTestim(true)
    // console.log('112312', JSON.stringify(clientInfo,null,2))
  }

  const handleOpenCancelTender = async () => {
    //проверять что бы заявка не была отменена клиентом
    let tenderObj = await getTenderState(route.params.dataTender.id)
    // console.log('tenderObj', tenderObj)
    if(tenderObj.driverId == null && tenderObj.canceledAt !== null && tenderObj.canceledBy == tenderObj.userId) {
      setTenderState(tenderObj)
      setShowAlertCancel(true)
    } else {
      setIsVisibleCancelAsk(true)
    }
  }
  //image
  const handleOpenProfile = () => {
    setIsVisibleProfile(true)
  }
  // map
  const handlerShowMap = () => {
    setIsVisibleModalAsk(!isVisibleModalAsk)
  }

  const handleBack = (showPointsDatail) => {
    // navigation.navigate('SearchScreen')
    // navigation.popToTop() //вернет на верхний уровень стека(если например мы в Заказы > В работе > заказ123 - вернет в Заказы а не в работе)
    if(showPointsDatail) {
      setShowPointsDatail(false)
    } else {
      console.log('navigation.getState()', navigation.getState() )
      // console.log('navigation.getState()', JSON.stringify(navigation.getState(),null,2) )
      const nav = navigation.getState()
      const firstPart = nav.routes[0].key.split('-')[0];
      if(firstPart !== undefined &&  firstPart === 'ActiveDriverTenders') {
        navigation.navigate('ActiveDriverTenders');
      } else {
        navigation.navigate('Search');
      }
// {"index": 1, 
//   "key": "stack-1G0o1gauK-ufEnY--TITX", 
//   "routeNames": ["ActiveDriverTenders", "TenderItemScreen", "ChatsList", "Chat"], 
//   "routes": [{"key": "ActiveDriverTenders-V5VU81Fugg1n9yZpef2Cq", "name": "ActiveDriverTenders", "params": undefined}, {"key": "TenderItemScreen-yHVJhoC1THaDGK7FreGrS", "name": "TenderItemScreen", "params": [Object], "path": undefined}],
//    "stale": false, "type": "stack"}
      // navigation.goBack() //возвращает на предыдущий скрин
      // navigation.navigate('ActiveDriverTenders');
    }
  }

  const handleFinishTestimonial = () => {
    console.log('handleFinishTestimonial', )
    setIsShowSucceed(false)
    navigation.goBack()

    //!! водителя возвращает в чат
    // навигация на предыдущий скрин
  }

  const onCloseNav = () => {
    setIsLoading(false)
    setIsVisibleCancelAsk(false),
    navigation.goBack()
  }

  const handleToggleFormsItem = async (flag) => {
    setIsLoading(true)
    // driverDeleteTenders,driverFavoritsTenders 
    let obj = []
    let array = flag === 'faivorTenders' ? driverFavoritsTenders : driverDeleteTenders
    if(array?.length > 0) {
      
      let res = toggleNumberInArray(array,tenderId)
      obj = {[flag]: res}
    } else {
      obj = {[flag]: [tenderId]}
    }
    if(flag === 'deleteTenders' && userFormsActivities.driverTenderActivity.includes(tenderId)) {
      let objActive = userFormsActivities.driverTenderActivity.filter(elem => elem !== tenderId)
      console.log('objActive', objActive)
      obj.driverTenderActivity = objActive
    }

    console.log('handleToggleFormsItem obj', obj)

    try {
      //todo если удаление то убирать из driverTenderActivity
      await setDriverFormUpd(dispatch,obj,flag)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsVisibleMenu(false)
    setIsVisibleForm(true)
  }

  const handleSendComplain = async (data,description) => {
    // console.log('handleSendComplain start data',data,description?.trim())

    setIsVisibleForm(false)
    setIsLoading(true)

    try {
      const partnerInfo = await get(`users/${tenderState.userId}`)
      if (!partnerInfo.success) {
        // console.warn('Ошибка запроса:', response.error);
        setIsLoading(false)
        alert(partnerInfo.error);
        return null;
      }
      const responseCompl = await sendComplain(data,description,userProfileInfo,partnerInfo.data,tenderState.id,'tender')
      if (responseCompl === null) {
        // console.warn('Ошибка запроса:', response.error);
        setIsLoading(false)
        alert(responseCompl.error);
        return null;
      }
  
      setIsLoading(false)
      setIsVisibleFormSucceed(true)
    } catch (error) {
      console.log('handleSendComplain', error)
      alert(error)
      setIsLoading(false)
    }
  }

  const handleCancelTender = async() => {
    // setIsLoading(true)
    try {
      const respCancel = await cancelDelivery(
        role,
        clientInfo[0].repl,
        tenderState,
        msgCancelText,
        setIsVisibleCancelAsk
      )
      if(respCancel !== null && respCancel !== undefined) {
        getUserHiddenTenders(dispatch)
        //todo убирать у себя и клиента будет в точке cancel
        //обновлять стейт активностей
        // "clientActiveTender"
        // "driverActiveTender"

        setIsVisibleCancelAsk(false)
        setIsLoading(false)

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SearchTab',
              state: {
                routes: [{
                name: 'Search',
                }]
              }
            },
          ]
        })
      }

    //   await firestore().collection('replies')
    //   .doc(tenderState.replyId) //
    //   .get()
    //   .then(documentSnapshot=>{
    //     console.log('documentSnapshot.exists', documentSnapshot.exists,)
    //     if(documentSnapshot.exists) {
    //       cancelDelivery(
    //         role,
    //         {data: documentSnapshot.data(), id: documentSnapshot.id},
    //         {data: tenderState, id: tenderId},
    //         firebeseUpdateTender, 
    //         msgCancelText,
    //         messageIdGenerator,
    //         setIsVisibleCancelAsk
    //       ).finally((res)=> {

    //         restoreUsersWithChatsFromHidden([],uid,route.params.dataTender,role,uid)
    //           .then((res)=>{

    //             console.log('then res восстановление ', res)
    //             // getTenderHidden(uid,dispatch,userProfileTenderHidden)
    //             setIsLoading(false)
    //             navigation.reset({
    //               index: 0,
    //               routes: [
    //                 {
    //                   name: 'SearchTab',
    //                   state: {
    //                     routes: [{
    //                     name: 'Search',
    //                     }]
    //                   }
    //                 },
    //               ]
    //             })
    //             // handleBack(showPointsDatail)
    //           })

    //         //убирать у клиента заявку из активных 
    //         firestore().collection('forms').doc(tenderState.userId).update({
    //           'clientActiveTender': firestore.FieldValue.arrayRemove(route.params.dataTender.id)
    //         })
    //         //у себя
    //         firestore().collection('forms').doc(uid).update({
    //           'driverActiveTender': firestore.FieldValue.arrayRemove(route.params.dataTender.id),
    //         })
    //         //TODO и себе из активных
    //       })
          
    //     }
    //   })
    } catch (error) {
      setIsLoading(false)
      setIsVisibleCancelAsk(false)
      console.log('handleCancelTender error', error)
    }
  }

  const renderImage = ({item,index}) => {
    // console.log('item', item)
    return (
      <TouchableOpacity key={index} onPress={()=>{setIsShowCarousel(true)}}>
        <Image source={{uri: item}} style={[{
          borderRadius: 10,
          height: width/4,
          width:  width/4-15, 
          marginHorizontal: 4}]}/>
      </TouchableOpacity>
    )
  }

  const handleDownloadFile = async (fileData) => {
    console.log('fileData', fileData)
    let status = await requestStoragePermisson(Platform)
    // console.log('RNFS.LibraryDirectoryPath', RNFS.LibraryDirectoryPath)

    console.log('status', status)
    setDisableDownload(true)

    try {
      // if(status === 'granted') {      
        
      // }
      const parts = fileData.split("/");
      let filenameWithExtension = parts[parts.length - 1];
      // Удаляем часть запроса после имени файла
      filenameWithExtension = filenameWithExtension.split("?")[0];
      console.log('filenameWithExtension', filenameWithExtension)
  
      // Удаляем префикс "image/"
      filenameWithExtension = decodeURIComponent(filenameWithExtension).replace("images/", "")
      let path = Date.now()+filenameWithExtension
      console.log(path);
  
      //ios  LibraryDirectoryPath (String) The absolute path to the NSLibraryDirectory (iOS only) //или DocumentDirectoryPath 
      //android DownloadDirectoryPath
      const localFile =  Platform.OS==='android' ? `${RNFS.DownloadDirectoryPath}/${path}` : `${RNFS.DocumentDirectoryPath}/${path}`
      // const localFile =  Platform.OS==='android' ? `${RNFS.DownloadDirectoryPath}/${path}` : `${RNFS.LibraryDirectoryPath}/${path}`
      console.log('localFile', localFile)
      // Download the file
      await RNFS.downloadFile({
        fromUrl: fileData,
        toFile: localFile,
        progressInterval: 100,
        progressDivider: 10,
        connectionTimeout: 60 * 1000,
        readTimeout: 120 * 1000,
        begin: (res) => { 
          console.log('begin :- ', res);
       },
       progress: (res) => {
          console.log('res :- ', res);
          
          let percentage = (res.bytesWritten * 100) / res.contentLength;
          percentage = Math.round(percentage);
          console.log('percentage', percentage)
          setProgress(percentage);
      },
      }).promise.then((res) => {
        console.log('res', res)
        setProgress(0)
        // setProgressStatus('Файл скачан')
        setDownloadedUrl([localFile,path])
        setIsDownloadSucceed(true)
        setDisableDownload(false)
        setTimeout(()=>{
          setIsDownloadSucceed(false)
        },5000)
        // Open the file
      }).catch((error) => {
        setProgress(0)
        setProgressStatus('Ошибка загрузки')
        setDisableDownload(false)
        setTimeout(()=>{
          setProgressStatus('')
        },3000)
        console.error('Download error', error);
      });
      
    } catch (error) {
      console.error('Download error trycatch', error);
      setProgress(0)
      setDisableDownload(false)
      setProgressStatus('')
    }
  }

  const ChatItem = ({prop, flag}) => {
    // console.log('CL ChatItem prop', prop)
    const data = prop.data
    // console.log('data', data, data?.price)
    const repl = prop.repl
    let counter = prop.unReadMsg?.length
    let dataMsg = prop?.dateMsg
    let myUnreadMsg = prop?.myUnreadMsg

    let statusBet = 'base'
    let avatar = prop.userInfo.avatar //userInfo?.driverAvatar
    let userName = prop.userInfo.name //userInfo?.userName
    // console.log('avatar', avatar, 'userName', userName)

    if(repl!==null) {
      if((repl.clientBetStatus==='accept'||repl.driverBetStatus==='accept')) {
        statusBet = 'accept'
      } else if (role ==='driver'&&repl.driverBetStatus==='wait') {
        statusBet = 'base'
      } else if (role ==='client'&&repl.clientBetStatus==='wait') {
        statusBet = 'base'
      } else {
        statusBet = 'wait'
      }
    }

    return (
      <View 
        style={[mainstyles.mrChats]} 
        
      >
        <View style={[styles.row,styles.wrapper,mainstyles.shadowG5r5 
          // tenderState.driverId !== null ? (prop.data.data.userId === tenderState.driverId ? styles.isActive : styles.isNonActive): null
          ]}>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.imgContainer} activeOpacity={1} 
            onPress={()=>handleOpenProfile()}
            // onPress={()=>{}}
            >
            {
              avatar!==null && avatar?.length > 0 ?
                <View style={{width:60,height:60,backgroundColor: '#fff', borderRadius: 30}}>
                  <Image source={{uri: avatar }} style={styles.img}/>
                  <View style={[styles.starContainer]}>
                    <Text style={[mainstyles.text10R,styles.starText]}>{prop?.userInfo.rating}</Text>
                    <IconStarSmallFill color={THEME.YELLOW}/>
                  </View>
                </View>
                :
                <View style={{width:60,height:60,backgroundColor: '#fff', borderRadius: 30}}>
                  <View style={styles.img}>
                    <Icon name="camera" size={20} color={THEME.PRIMARY} />                    
                  </View>
                  <View style={[styles.starContainer]}>
                    <Text style={[mainstyles.text10R,styles.starText]}>{prop?.userInfo.rating}</Text>
                    <IconStarSmallFill color={THEME.YELLOW}/>
                  </View>
                </View>
            }
            </TouchableOpacity>
            <TouchableOpacity style={[styles.midRifhtContainer, mainstyles.row,]} activeOpacity={0.9} onPress={() => handleOpenChat(prop)}
            >
              <View style={[styles.content,{justifyContent: 'space-between'}]}>
                <Text style={[mainstyles.text14R,{color: THEME.GREY800,}]}>{userName}</Text>
                <View style={[mainstyles.rowalC]}>
                  <Text style={[mainstyles.text14R,{color: THEME.GREY800}]}>Создано заказов: </Text>
                  <Text style={[mainstyles.text14M,{color: THEME.GREY800}]}>{prop?.userInfo.quantityTenders}</Text>
                </View>
              </View>
              <View style={[styles.priceContainer]}>
                {
                  dataMsg!==null&&dataMsg!==undefined?
                  <Text style={[mainstyles.text12R,{color: THEME.GREY600,paddingBottom: 5,}]}>{dataMsg}</Text>
                  : null
                }
                <View style={[mainstyles.pB5]}>
                  {
                    counter!==null&&counter!==0?
                    <View style={[mainstyles.msgCounter,{width: counter<10? 24: null,}]}>
                      <Text style={[styles.textMsgCounter]}>{counter}</Text>
                    </View>
                    :
                    <>
                    {
                      dataMsg!==null&&dataMsg!==undefined ?
                      <>
                        {
                          myUnreadMsg&&myUnreadMsg?.length>0?
                          <IconDblCheck color={THEME.GREY300}/>
                          :<IconDblCheck />
                        }
                      </>
                      : null
                    }
                    </>
                  }
                </View>
                {
                  repl !== null ?
                    <View style={[mainstyles.bagePriceContainer,statusBet==='accept'?mainstyles.bagePriceAccept:(statusBet==='wait'?mainstyles.bagePriceWait:mainstyles.bagePriceBase)]}>
                      <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{repl?.betUpdate} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
                    </View>
                    :
                    <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                      <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{data.price} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
                    </View>
                }
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    )
  }
  
  const renderItem = ({ item }) => (
    <ChatItem prop={item} />
  )

  const checkNewMsg = async () => {
    //стейт tenderInformersState что есть обновления по сообщениям или заявке
    console.log('tenderInformersState', tenderInformersState)
    if(tenderInformersState?.length === 0) return false;
    let findTenderUpd = tenderInformersState.find(elem => elem.tenderId === route.params.dataTender.id && (elem.textSystem==='feedback'|| elem.textSystem === 'orderCanceled' || elem.textSystem === "acceptTenderByClient"))
    let findTenderChatsUpd = tenderInformersState.find(elem => elem.tenderId === route.params.dataTender.id )
    console.log('findTenderUpd', findTenderUpd)
    console.log('findTenderChatsUpd', findTenderChatsUpd)

    //todo у водителя сделать так же
    //!! todo - приоритет найти в tenderInformersState 'feedback' или 'orderCanceled' если их нет то проверять дальше
    if(findTenderUpd !== undefined) {
      //обновлять заявку
      console.log('findTenderUpd.textSystem getTenderState', findTenderUpd.textSystem )
      await getTenderState(route.params.dataTender.id)

    } else if(findTenderUpd == undefined && findTenderChatsUpd !== undefined) {
      console.log('findTenderChatsUpd.textSystem getClientChat', findTenderChatsUpd.textSystem )
      if(tenderState === null) {
        // const resp = await getTenderState(route.params.dataTender.id)
        getClientChat(route.params.dataTender)
      } else {
        getClientChat(tenderState)
      }
    }

    // let findTender = tenderInformersState.find(elem => {
    //   // console.log('elem.tenderId', elem.tenderId)
    //   // console.log('route.params.dataTender.id', route.params.dataTender.id)
    //   if(elem.tenderId == route.params.dataTender.id) return elem
    // })
    // console.log('findTender', findTender)
    // if(findTender !== undefined) {
    //   if(findTender.textSystem === 'feedback' || findTender.textSystem === 'orderCanceled' || findTender.textSystem === 'acceptTenderByClient') {
    //     //обновлять заявку
    //     console.log('findTender.textSystem getTenderState', findTender.textSystem )
    //     getTenderState(route.params.dataTender.id)
    //   } else {
    //     console.log('findTender.textSystem getClientChat', findTender.textSystem )
        
    //     getClientChat()
    //   }
    //   console.log('if findTender', findTender)
    //   tenderState !== null ? dispatch(delTenderInformersState({tenderId: tenderId})) : null
    // } else {
    //   console.log('else findTender', findTender)
    // }
  }

// useEffect(() => {
//   console.log('useEffect tenderInformersState && statusTenderUpd', tenderInformersState, statusTenderUpd)
//   console.log('useEffect checkNewMsg', tenderInformersState, statusTenderUpd)
//   // clientInfo то проверять сообщения - если есть не прочитанное ->
//   // завершение заявки / отмена выполнения/ - то обновлять стейт заявки и удалять информер
//   if(clientInfo !== null && statusTenderUpd === false  && tenderState.archived === false) {

//     const checkUpdTender = clientInfo[0].messages.find(elem => {
//       console.log('elem', elem)
//       if(elem.read === false && (elem.textSystem === 'feedback' || elem.textSystem === 'orderCanceled' || elem.textSystem === 'acceptTenderByClient')) {
//         return elem
//       }
//     })
//     console.log('checkUpdTender', checkUpdTender)
//     if(checkUpdTender !== undefined) {
//       getTenderState()
//       setStatusTenderUpd(true)
//       //удалять из стейта сообщений?
//       tenderState !== null ? dispatch(delTenderInformersState({tenderId: tenderId,userId: tenderState.userId})) : null
//     } else {
//       setStatusTenderUpd(false)

//     }
//   }
// }, [clientInfo,tenderInformersState])
  
  useEffect(() => {
    //заявка контент
    const onTenderState = async () => {

      await getTenderState(route.params.dataTender.id) //api запрос
      const tenderData = route.params.dataTender
      // const tenderId = route.params.dataTender.id
      // console.log('tenderData \n', tenderData);
      // console.log('tenderId \n', tenderId);

      
      let stPointsVolSum = calculateTotalWeight(route.params.dataTender.startPoints)

      setSumWeight(stPointsVolSum)

      const coordsFrom = tenderData.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = tenderData.endPoints.map((item,index)=>{return item.coords})
      setCoordinatesFrom(coordsFrom)
      setCoordinatesTo(coordsTo)
      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)
      
      //координаты в один массив
      const coordsRoute = coordsFrom.concat(coordsTo)
      // console.log('onCreateRoutePoints coordsRoute: ', coordsRoute);
      setCoordinates(coordsRoute)
      // setTenderState(tenderData)

      //23.03 если есть описания в точках загрузки / разгрузки то показывать их
      let descrArr = tenderData.startPoints.concat(tenderData.endPoints).map(elem => {
        // console.log('elem.description', elem.description)
        if(elem.description !== null && elem.description !== undefined && elem.description?.trim()?.length > 0) {
          return elem.description
        } else null
      })
      let descrArrCheck = descrArr?.length > 0 ? descrArr.filter((elem) => !!elem) : []
      if(descrArrCheck?.length > 0) {
        // descriptionPoints, 
        setDescriptionPoints(descrArrCheck)
      }

      //state of all img
      let imgArr = []
      tenderData.startPoints.forEach(elem => {
        // console.log('images', elem?.images)
        // console.log('images', elem?.images)
        imgArr.push(elem?.images)
      })
      let newArrImg = imgArr?.length > 0 ? imgArr.flat(1) : []
      // console.log('newArrImg', newArrImg)
      if(newArrImg?.length > 0) {
        setImagesState(newArrImg)
      }

    }
    if(tenderState === null ) {
      onTenderState()
    }
  },[route])

  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect getClientChat', )
      // getRepl()
      if(isfocused && tenderState !== null) {
        getClientChat(tenderState)
        // getClChatTest()
      }
      // isfocused ? getClientChat() : null
    }, [tenderState,isfocused,stateOfInformers])
  )
// driverDeleteTenders,driverFavoritsTenders 
  useEffect(() => {
    // console.log('tenderFaivor', tenderFaivor, tenderId);
    if(driverFavoritsTenders.includes(tenderId)) {
      !isFaivor ? setIsFaivor(true) : null
    } else {
      isFaivor ? setIsFaivor(false) : null
    }
  },[driverFavoritsTenders,tenderId])

  useEffect(() => {
    // console.log('tenderFaivor', tenderFaivor, tenderId);
    if(driverDeleteTenders.includes(tenderId)) {
      !isHidden ? setIsHidden(true) : null
      setShowHideButton(false)
    } else {
      isHidden ? setIsHidden(false) : null
      setShowHideButton(true)
    }
  },[driverDeleteTenders,tenderId])


  useEffect(() => {
    // console.log('isHiddenCheck', tenderId); /driverTenderActivity - проверка - 
    //если есть отклики - то не будет кнопки скрыть
    
    if(tenderId && userFormsActivities.driverTenderActivity?.includes(tenderId) ) {
      setShowHideButton(false)
    } else {
      setShowHideButton(true)

    }
  },[route,tenderId,userFormsActivities])


  // useEffect(() => {
  //   // console.log('useEffect checkNewMsg', tenderInformersState)
  //   if(tenderState !== null) {

  //     checkNewMsg()
  //   }
  // }, [tenderInformersState])

  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect checkNewMsg', )
      
      if(isfocused) {
        checkNewMsg()
      }
      // checkNewMsg()
      

    }, [tenderInformersState])
    // isSelectionModeEnabled, disableSelectionMode
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log('1showPointsDatail', showPointsDatail)
      const onBackPress = () => {
        console.log('onBackPress ')
        if (true) {
          // console.log('2showPointsDatail', showPointsDatail)
          // navigation.goBack()
          handleBack(showPointsDatail)
          return true;
        } else {
          // console.log('3showPointsDatail', showPointsDatail)
          return false;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [showPointsDatail])
    // isSelectionModeEnabled, disableSelectionMode
  );

  useEffect(() => {
    if (isDownloadSucceed) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isDownloadSucceed]);
  

  console.log('____render TIS____', )

  const testfn = async () => {
    // getTenderState(route.params.dataTender.id)
    // const responseTender = await put(`tenders/${tenderId}`,{driverId: null, replyId: null})
    // console.log('responseTender', responseTender?.data) 
  }

  return (
    <View style={styles.container}>
      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height,zIndex: 99999}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isVisibleFormSucceed ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height,zIndex: 99999}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'complaintSucceed',complaintSucceed)} onPress={()=>setIsVisibleFormSucceed(false)}/>            
          </View>
        : 
        null
      }
      {
        showAlertCancel ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height,zIndex: 99999}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'cancelAlertClient',cancelAlertClient)} onPress={()=>setShowAlertCancel(false)}/>            
          </View>
        : 
        null
      }
      {
        isVisibleForm ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height,zIndex: 99999}]}>
            <ComplaintComponent
              onPress={handleSendComplain}
              onClose={()=>{setIsVisibleForm(false)}}
            />
            
          </View>
        : 
        null
      }
      {
        isShowSucceed ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height,zIndex: 99999}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTender',finishTender)} onPress={handleFinishTestimonial}/>
          </View>
        : 
        null
      }
      {
        isVisibleProfile && tenderState!==null ?
        <View style={[mainstyles.containerModalGgBl,{flex:1, minHeight: height+safeInsets.top, zIndex: 99999}]}>
          <ProfileInfo 
            role={role}
            userInfo={clientInfo[0].userInfo}
            onClose={()=>{setIsVisibleProfile(false)}}
          />
        </View>
        :null
      }
      {
        isVisibleProfileTestim && tenderState!==null ?
        <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top,zIndex: 99999}]}>
          <ProfileInfoWithTestimonial
            partnerProfile={clientInfo[0].forms}
            tenderState={tenderState}
            onClose={()=>{setIsVisibleProfileTestim(false)}}
            onPress={()=>setIsShowSucceed(true)}
            // role={role}
            // partnerId={tenderState.userId}
            // userProfileInfo={{userInfo: userProfileInfo, userId: userProfileInfo.id}}
            // data={{data: tenderState, id: tenderId}}
            // driver={role==='driver'  : null?}
          />
          {/* переделать как у клиента */}
        </View>
        :null
      }
      {
        isVisibleMenu ?
        <WrapperModalView
          stylesContainer={{}}
          stylesBg={{}}
          stylesMenu={{}}
          safeInsets={safeInsets}
          onClose={()=>setIsVisibleMenu(false)}
        > 
          <MenuListComponent 
            isFaivor={isFaivor}
            isHidden={isHidden}
            onPressToggle={handleToggleFormsItem}
            onPressComplain={handleOpenModal}
            showHideButton={isShowHideButton}
          />
        </WrapperModalView>
        : null
      }
      { 
        tenderState!==null ?
        // scrollEnabled={isScrollEnb}
          <View style={{backgroundColor: '#fff', flex:1}} >
            {
              showPointsDatail ?
              // minHeight:height+safeInsets?.top+65,
              <View style={{}}>
                <ListPointSlider 
                  data={tenderState}
                  topBtnPosition={safeInsets.top+40}
                  mapViewRef={mapViewRef} 
                  customStyles={{height:height/2.8}} 
                  cusStMap={{ minHeight: height/2.8}}
                  // coordinates={coordinates}
                  // coordinatesFrom={coordinatesFrom}
                  // coordinatesTo={coordinatesTo}
                  setEnScr={setIsScrollEnb}
                  onClose={()=>setShowPointsDatail(false)}
                />
              </View>
              :
              <ScrollView style={{backgroundColor: 'transparent'}}>
                
                <LinearGradient style={[styles.headerStyles,mainstyles.rowalCjcSb,
                  {width: '100%',paddingVertical: 0,paddingHorizontal: 15,paddingTop: safeInsets.top}]}
                  // colors={['orange','blue']} 
                  colors={['rgba(255,255,255,1)','rgba(255,255,255,0)']} 
                   useAngle angle={180}>
                  <View style={{width: '13%',backgroundColor: 'transparent', }}>
                    <BtnIconTrs onPress={()=>handleBack(showPointsDatail)} customStyles={{width: '40%', backgroundColor: 'transparent',alignItems: 'flex-start'}}>
                      <BackArrow />
                    </BtnIconTrs>
                  </View>
                  <View style={[mainstyles.rowalCjcSb,{width: '74%',backgroundColor: 'transparent', justifyContent: 'flex-end'}]}>
                    <TouchableOpacity style={styles.menuDots} onPress={()=>setIsVisibleMenu(prev => !prev)}>
                      <IconMenuDots />
                    </TouchableOpacity>
                  </View>
                  

                </LinearGradient>

                <TenderMapDriver 
                  mapViewRef={mapViewRef} 
                  customStyles={{height:height/2.8}} 
                  cusStMap={{ minHeight: height/2.8}}
                  topBtnPosition={safeInsets.top+45}
                  coordinatesArr={coordinates}
                  coordinatesFrom={coordinatesFrom}
                  coordinatesTo={coordinatesTo}
                  isRouteVisible={true}
                />
                {
                  (tenderState?.archived === true && tenderState.finishedAt !== null) ?
                  <View style={{position: 'relative'}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.RED, borderWidth: 2}]}>
                      <IconCross color={'red'}/>
                      <Text style={[mainstyles.text14M,{color: THEME.RED,paddingLeft: 10}]}>Заявка завершена</Text>
                    </View>
                  </View>
                  : null
                }
                {
                  // true ?
                  (tenderState?.archived === false && tenderState.driverId == userProfileInfo.id && tenderState.finishedAt == null) && !hiddenTender.includes(tenderId) ?
                  <View style={{position: 'relative'}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.BRIGHT_GREEN, borderWidth: 2}]}>
                      <Text style={[mainstyles.text14M,{color: THEME.BRIGHT_GREEN,}]}>В работе</Text>
                    </View>
                  </View>
                  : null
                }
                {
                  (tenderState?.archived === false && tenderState.driverId == null && tendersActivity.includes(tenderId)) && !hiddenTender.includes(tenderId) ?
                  <View style={{position: 'relative'}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.PRIMARY, borderWidth: 2}]}>
                      <Text style={[mainstyles.text14M,{color: THEME.PRIMARY,}]}>На согласовании</Text>
                    </View>
                  </View>
                  : null
                }
                {
                  hiddenTender.includes(tenderId) && tenderState.finishedAt == null ?
                  <View style={{position: 'relative'}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.RED, borderWidth: 2}]}>
                      <IconCross color={'red'}/>
                      <Text style={[mainstyles.text14M,{color: THEME.RED,paddingLeft: 10}]}>Заблокирована</Text>
                    </View>
                  </View>
                  : null
                }
                

                <View style={{paddingTop: 20,paddingHorizontal: 10,paddingBottom: 10}}>
                  <View style={[mainstyles.rowalCjcSb, {paddingBottom:20}]}>
                    <Text style={[mainstyles.text16M,styles.textColorD,]}>{tenderState.name}</Text>
                    <Text style={[mainstyles.text16M,styles.textColorD,]}>{tenderState.price} руб.</Text>
                  </View>
                  <TouchableOpacity style={[mainstyles.botLineGr,{paddingBottom: 10}]} onPress={()=>setShowPointsDatail(true)}>
                    <AddressPointsView type={'start'} data={tenderState.startPoints} length={tenderState.startPoints.length} disable={true}/>
                    <AddressPointsView type={'end'} data={tenderState.endPoints} length={tenderState.endPoints.length} disable={true}/>
                  </TouchableOpacity>
                </View>
                {
                  tenderState?.route?.distance!==undefined?
                  <View style={[{paddingHorizontal: 10,paddingBottom: 10}, mainstyles.rowalCjcSb]}>
                    <Text style={[mainstyles.text14R,styles.textColorD]}>Расстояние: 
                    {
                      tenderState.route.distance?.length > 0? 
                      <Text> {tenderState.route.distance} км.</Text>
                      : <Text> - </Text>
                    }
                    </Text>
                    <Text style={[mainstyles.text14R,styles.textColorD]}>Общий вес:
                        {
                          sumWeight > 0 ? 
                          <Text> {sumWeight} кг.</Text>
                          : <Text> - </Text>
                        }
                    </Text>
                  </View>
                  :null
                }

                {
                  descriptionPoints?.length > 0 ||  (tenderState.description!==undefined&&tenderState.description!==null&&tenderState.description.trim().length > 0) ? 
                  <DescriptionComponent 
                    points={descriptionPoints}
                    description={tenderState.description}
                  />
                  : null
                }

                {
                  imagesState?.length > 0 ?
                  <FlatList 
                    style={[{paddingTop: 15,paddingBottom: 15}, imagesState?.length > 4 ? {paddingLeft: 6,} : {paddingHorizontal: 10}]}
                    data={imagesState}
                    horizontal
                    keyExtractor={(item,index)=>index+'w8'}
                    renderItem={renderImage}
                  />
                  :null
                }

                <View style={[ {width: '30%',paddingHorizontal: 10,paddingBottom: 15}]}>
                  <Text style={[mainstyles.text14R,styles.textColorD,{textDecorationLine: 'underline'}]}>Заказчик</Text>
                </View>

                {
                  clientInfo ?
                  <FlatList 
                    style={[{width: '100%',}]}
                    data={clientInfo}
                    keyExtractor={(item,index)=>index+'w2'}
                    renderItem={renderItem}
                  />
                  // <ChatItem prop={clientInfo} />
                  : 
                  <>
                    {
                      isLoadingChat ?
                      <View style={[mainstyles.alCjcC, {width: '100%', paddingBottom: 20}]}>
                        <ActivityIndicator color={THEME.PRIMARY} size={'small'}/>
                      </View>
                      : null
                    }
                  </>
                }
                
                {/* заявка архивная, заявка завершина, есть сообщение */}
                {
                  clientInfo !== null ? 
                  <>
                    {
                      (tenderState?.archived === true || tenderState.finishedAt !== null  || (clientInfo[0].messages.length > 0 && tenderState.driverId ==null)) ?
                      <View style={{position: 'relative',paddingVertical: 10, paddingBottom: 20,alignSelf: 'center'}}>
                        <DefaultBtn title={'В чат'} onPress={() => handleOpenChat(clientInfo[0])} customStyle={{width: '48%', }}/>
                      </View>
                      : 
                      <> 


                      {
                        tenderState.driverId !==null && tenderState?.archived === false && clientInfo[0].messages.length > 0?
                        null
                        :
                        <View style={{position: 'relative',paddingVertical: 10, paddingBottom: 20,alignSelf: 'center'}}>
                          <DefaultBtn title={'Предложить'} onPress={()=>handleOpenChat(clientInfo[0])} customStyle={{width: '48%',}}/>
                        </View>
                      }
                      </>
                    }
                  </>
                  : null
                }
                {/* {
                  __DEV__ ?
                  <View style={{position: 'relative',paddingVertical: 10, paddingBottom: 20,alignSelf: 'center'}}>
                    <DefaultBtn title={'test'} onPress={handleTestFn} customStyle={{width: '48%', }}/>
                  </View>
                  : 
                    null
                } */}
                {
                  tenderState.driverId!==null&&tenderState.driverId===userProfileInfo.id &&tenderState.finishedAt===null ?
                  <View style={[mainstyles.rowalCjcSb,mainstyles.pH10,mainstyles.pV15, {paddingBottom: 30}]}>
                    <ButtonWithIcon title={"Позвонить заказчику"} onPress={()=>handlerCallNumer(clientInfo[0].userInfo.phone)}
                      customStyles={{width: '24%'}}
                    >
                      <IconCall />
                    </ButtonWithIcon>
                    <ButtonWithIcon title={"Написать заказчику"} onPress={() => handleOpenChat(clientInfo[0])}
                      customStyles={{width: '24%'}}>
                      <IconChatsTab color={'#fff'} width={25} height={18} />
                    </ButtonWithIcon>
                    <ButtonWithIcon title={"Завершить выполнение заказа"} onPress={handleOpenTestimonials}
                      customStyles={{width: '25%'}}
                    > 
                      <IconCheckThin color={'#fff'} width={23} height={18} />
                    </ButtonWithIcon>
                    <ButtonWithIcon title={"Отменить выполнение заказа"} onPress={handleOpenCancelTender}
                    customStyles={{width: '25%'}}>
                      <IconCross />
                    </ButtonWithIcon>
                  </View>
                  : null
                }
                 {/* {__DEV__ &&<TouchableOpacity style={{backgroundColor: 'orange', height: 40}} onPress={testfn}><Text>123</Text></TouchableOpacity>} */}

              </ScrollView>

            }
            {
              isShowCarousel ? 
              <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: 0,zIndex: 99999}, 
                stylesCarousel
              ]}>

                <View style={{backgroundColor: 'transparent',alignSelf: 'center'}}>
                  <View style={{position: 'absolute',top: 0,zIndex: 997,width: '100%'}} >
                    <View style={{paddingTop: safeInsets?.top+10, paddingHorizontal: 10,paddingBottom: 10,alignItems: 'center',width: '100%',flexDirection: 'row', justifyContent: 'space-between'}}> 
                      <View style={{width: '85%',backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
                        <Pressable
                        disabled={disableDownload}
                          onPress={()=>handleDownloadFile(imagesState[currIndexImag])}
                          style={({pressed}) => [
                            {
                              backgroundColor: pressed ? 'rgba(143, 241, 17,0.4)' : 'rgba(255,255,255,0.3)',
                            },
                            {width: '30%',padding: 10,zIndex: 996, borderRadius: 4,borderWidth:1, borderColor: THEME.GREY500}, mainstyles.alCjcC
                          ]}
                          >
                          <Text style={{color: '#fff'}}>Скачать</Text>
                        </Pressable>
                        <View style={{width: '70%',backgroundColor: 'transparent',paddingLeft: 15}}>
                          {
                            progress > 0 ?
                            <Text style={{color: THEME.BRIGHT_GREEN,fontSize: normalize(14)}}> Загрузка: {progress}%</Text>
                            : <Text style={{color: THEME.BRIGHT_GREEN,fontSize: normalize(14)}}>{progressStatus}</Text>
                          }
                        </View>
                      </View>
                      <TouchableOpacity style={[styles.close,{zIndex: 996,borderWidth:1, borderColor: THEME.GREY500}]} onPress={handleCloseSettings}>
                        <Icon name='cross' color={'#fff'} size={28} style={{}}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {
                    isDownloadSucceed && (

                    <TouchableWithoutFeedback >
                      <Animated.View style={[
                        {position: 'absolute',transform: [{ translateY }], zIndex: 998,width: '95%', padding: 15,alignSelf: 'center',opacity: opacity},
                        {backgroundColor: '#fff',borderRadius: 3,},
                      ]}
                      // top: translateY
                        // onAnimationEnd={animateOut}
                      >
                        <View style={[ mainstyles.rowalCjcSb]}>
                          <View style={{width: '74%'}}>
                            <Text style={[mainstyles.text14R,]}>Скачан 1 файл</Text>
                            <Text style={[mainstyles.text10R,]}>{downloadedUrl[1]}</Text>
                          </View>
                          <DefaultBtn 
                            title={"Открыть"}
                            customStyle={{height: 40, width: '25%',minWidth: null, paddingVertical: 0}}
                            color='#fff'
                            onPress={()=>handleOnOpenFile(downloadedUrl[0])}/>
                        </View>
                      </Animated.View>
                    </TouchableWithoutFeedback>
                    )
                  }

                  <CarouselImagesView imageState={imagesState} safeInsets={safeInsets} setIndex={setCurrIndexImag}/>
                  
                </View>

              </View>
              : null
            }
            {/* открыть карту */}
            <Modal
              visible={isVisibleModalAsk}
              transparent={true}
              animationType={'fade'}
              >
              <OpenGoogleMaps openGM={()=>openGM(coordinates,handlerShowMap)} onClose={handlerShowMap}/>
            </Modal>
          </View>
        : null
      }
      {
        isVisibleCancelAsk ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top,zIndex: 999}]}>
          <InfoAskWindowWithInput
            disabled={isLoading}
            data={findJsonObj(jsonDataPrompt,'cancelTender',cancelTender)} 
            value={msgCancelText}
            setValue={setMsgCancelText}
            onPress={handleCancelTender} 
            onClose={()=>{setIsVisibleCancelAsk(false),Keyboard.dismiss()}}
          />
        </View>
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // height: 500,
    backgroundColor: '#fff',
    height: height-65,
    // paddingBottom: 65,
    
    backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  headerStyles: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    width: '100%',
    zIndex: 999
  },
  textHeader: {
    color: THEME.PRIMARY,
    paddingLeft: 10,
  },
  menuDots: {
    // backgroundColor: 'red',
    width:'13%',
    paddingLeft: 10,
    height:40,    
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    // backgroundColor: 'pink',
    width: '20%',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  button: {
    position: 'absolute',
    top: -22, 
    right: 10, 
    // width: 126,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 8,
    elevation: 7,
    shadowColor: THEME.GREY500,
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  textColorD: {
    color: THEME.GREY900
  },
  whiteBlock: {
    marginHorizontal: 10,
    minHeight: 115,
    borderRadius: 27,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.3)',
    elevation: 5,
    marginBottom: 15
  },
  img: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.GREY100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  starContainer: {
    position: 'absolute',
    bottom: 0,
    right: -7,
    width: 30,
    height: 30,
    // borderRadius: 10,
    // padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: THEME.GREY100,
    // borderColor: '#fff',
    // borderWidth: 1,
  },
  starText: {
    color: '#000',
    lineHeight: 11,
    position: 'absolute',
    bottom: 7,
    // backgroundColor: 'red',
    zIndex: 2
  },
  btnRow: {
    // backgroundColor: 'red',
    paddingTop: 15,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20
  },
  bottomBtns: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    borderColor: THEME.PRIMARY,
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 45,
    elevation: 10,
    backgroundColor: '#fff',
    shadowColor: THEME.PRIMARY
  },
  itemBtn: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  itemBtnMid: {
    borderRightColor: THEME.PRIMARY,
    borderRightWidth: 2,
    borderLeftColor: THEME.PRIMARY,
    borderLeftWidth: 2,   
  },
  btnCustomStyle: {
    height: 55, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    // padding: 10,
    elevation: 7,
    shadowColor: THEME.GREY500,
    // shadowOffset: {width: 2, height: 5},
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // marginBottom: 15,
    // marginHorizontal: 15

  },
  inner: {
    // backgroundColor: 'lightblue',
    width: '100%',
    flexDirection: 'row',
  },
  midRifhtContainer: {
    // backgroundColor: 'orange',
    width: '80%',
    paddingVertical: 10,
    paddingRight: 10
  },
  content: {
    // backgroundColor: 'yellow',
    width: '70%',
    paddingHorizontal: 10,

  },
  textMsgCounter: {
    color: '#fff'
  },
  
  priceContainer: {
    // position: 'relative',
    width: '30%',
    // backgroundColor: 'pink',
    justifyContent: 'space-between',
    alignItems: 'center'  
  },


  ind: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
  },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: SIZE.normal,
    fontWeight: "600",
    color: THEME.MAIN_COLOR
  },
  close: {
    // position: 'absolute',
    // right: 20,
    // top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
  },
});
