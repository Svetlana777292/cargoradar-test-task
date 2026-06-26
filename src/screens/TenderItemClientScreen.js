import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshControl, Text, View, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, Image, ScrollView, Modal, Linking, FlatList, ActivityIndicator, LogBox, Keyboard, BackHandler, KeyboardAvoidingView, Platform, Pressable } from 'react-native';

// packages
import Icon from '@react-native-vector-icons/entypo';
import { useSelector, useDispatch } from 'react-redux';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

//components
import { OpenGoogleMaps } from '../components/Modal/OpenGoogleMaps';
import { AddressPointsView } from '../components/AddressPointsView';
import BackArrow from '../components/Svg/BackArrow';
import { BtnIconTrs } from '../components/Buttons/BtnIconTrs';
import ListPointSlider from '../components/ListPointSlider';
import IconStarSmallFill from '../components/Svg/IconStarSmallFill';
import { ProfileInfo } from '../components/Profile/ProfileInfo';
import { ProfileInfoWithTestimonial } from '../components/Profile/ProfileInfoWithTestimonial';
import PromptComponent from '../components/Modal/PromptComponent';
import InfoAskWindow from '../components/Modal/InfoAskWindow';
import IconEdit from '../components/Svg/IconEdit';
import IconTrash from '../components/Svg/IconTrash';
import IconDblCheck from '../components/Svg/IconDblCheck';
import { ButtonWithIcon } from '../components/Buttons/ButtonWithIcon';
import IconCall from '../components/Svg/IconCall';
import IconChatsTab from '../components/Svg/IconChatsTab';
import IconCheckThin from '../components/Svg/IconCheckThin';
import IconCross from '../components/Svg/IconCross';
import InfoAskWindowWithInput from '../components/Modal/InfoAskWindowWithInput';
import { TenderMapDriver } from '../components/MapComponents/TenderMapDriver';

//styles
import { mainstyles, SIZE, THEME,} from '../theme';

//functions && features && slice
import { openGM } from '../util/MapUtil/mapFn';
import { messageIdGenerator } from '../util/msgGenerator';
import { getClientActiveTender, getTenderHidden, getTenderHiddenClient } from '../util/firebase';
import { setDataTender, setDataTenderWithChats } from '../store/features/editTenderSlice';
import { askRestoreEditTender, askRestoreTender, cancelTender, finishTender, finishTenderTestimErr, height, hideAppPopup, width } from '../util/helperConst';
import { addUsersWithChatsToHidden, cancelDelivery, firebeseUpdateTender, handleAddChatToHiddenBothRole, handlerCallNumer, restoreAllChats, restoreUsersWithChatsFromHidden } from '../util/tenders';
import { calculateTotalWeight, checkDateOfTender, findJsonObj } from '../util/tools';
import { setClientActiveTenderState, userProfileTenderHidden, userProfileTenderHiddenClient } from '../store/features/userSlice';
import { DescriptionComponent } from '../components/DescriptionComponent';
import ListPointSliderCustom from '../components/ListPointSliderCustom';
import { CarouselImages } from '../components/CarouselImages';
import { CarouselImagesView } from '../components/CarouselImagesView';
import { requestStoragePermisson } from '../util/permissions';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import { timestMonth } from '../util/const';
import { delTenderInformersState, resetList, setCurrentChatId, setListOfChatsTenderClient } from '../store/features/listOfChatsSlice';
import { get, put } from '../store/features/api/user-api';
import { parseDateTimeObj } from '../util/dateFormats';
import { normalize } from '../util/UI/fontsUI';
import { getUserHiddenTenders } from '../store/features/api/userInfoForms';


export const TenderItemClientScreen = ({route, navigation}) => {
  console.log('TenderItemClientScreen navigation route',)
  const safeInsets = useSafeAreaInsets();
  const isfocused = useIsFocused()
  const mapViewRef = useRef()
  const carouselImages = useRef();
  const uid = '2'//auth().currentUser.uid
  const [anim] = useState(new Animated.Value(0));
  const tenderId = route.params.dataTender.id
  const { role, blacklist, userFormsInfo,userProfileInfo,userFormsHiddenTenders } = useSelector(state => state.login)
  // const role = useSelector(state => state.login.role)
  const blackListArr = useSelector((state) => state.user.blacklist)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient)
  // const stateOfMsg = useSelector((state) => state.chats.msgState)
  const stateOfInformers = useSelector((state) => state.chats)
  const listOfChats = useSelector((state) => state.listofchats.listOfChatsTenderClient)
  // console.log('listOfChats',JSON.stringify(listOfChats,null,2) );
  // console.log('userFormsInfo',userFormsInfo );
  const { tenderInformersState, tenderNeedUpdate } = useSelector(state => state.listofchats)
  

  const [loadingImg, setLoadingImg] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [listOfChatsState, setListOfChatsState] = useState([])
  const [statusTenderUpd,setStatusTenderUpd] = useState(false)
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [tenderState, setTenderState] = useState(null)
  const [descriptionPoints, setDescriptionPoints] = useState([])
  const [imagesState, setImagesState] = useState([])
  const [isVisibleModalAsk, setIsVisibleModalAsk] = useState(false)
  const [showPointsDatail, setShowPointsDatail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [allReplies, setAllReplies] = useState([])
  const [sumWeight, setSumWeight] = useState(0)
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [userProfileState, setUserProfileState] = useState(null)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)
  const [isVisibleProfileTestim, setIsVisibleProfileTestim] = useState(false)
  const [isVisibleShowInfoFinish, setIsVisibleShowInfoFinish] = useState(false)
  const [isVisibleCancelAsk, setIsVisibleCancelAsk] = useState(false)
  const [isShowSucceed, setIsShowSucceed] = useState(false)
  const [isShowAskDel, setIsShowAskDel] = useState(false)
  const [isShowAskRestore, setIsShowAskRestore] = useState(false)
  const [activeDriver, setIsActiveDriver] = useState(null)
  const [askDataObj, setAskDataObj] = useState(null)
  const [restoreWithChats, setRestoreWithChats] = useState(false)
  const [msgCancelText,setMsgCancelText] = useState('')
  const [isShowCarousel,setIsShowCarousel] = useState(false)
  const [currIndexImag, setCurrIndexImag] = useState(0)
  const [disableDownload, setDisableDownload] = useState(false)
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isDownloadSucceed, setIsDownloadSucceed ] = useState(false);
  const [downloadedUrl, setDownloadedUrl ] = useState([]);
  const [driversWithOffer, setDriversWithOffer] = useState([]);

  // console.log('tenderState:', JSON.stringify(tenderState,null,2))

  //  console.log('TIC tenderInformersState', tenderInformersState)
  // console.log('imagesState \n', imagesState);
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

  const getTenderState = async (id) => {
    console.log('getTenderState start',)
    setIsLoading(true)
    //TODO получить заявку
    try {
        const response = await get(`tenders/${id}`)

        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          alert(response.error);
          return;
        }
        setTenderState(response.data)
        setIsLoading(false)
        // console.log('response.data', response.data)
    } catch (error) {
      setIsLoading(false)
      console.log('getTender error', error)
    }
    // try {
    //   // return
    //    await firestore().collection('tenders')
    //     .doc(tenderId)        
    //     .get()
    //     .then((documentSnapshot) => {
    //       // console.log('documentSnapshot', documentSnapshot.data())
    //       setTenderState(documentSnapshot.data())
    //       // return {data: documentSnapshot.data(), id: documentSnapshot.id}
    //     })
    // } catch (error) {
    //   console.log('catch getTenderState error', error)
    // }
  }

  const handleOnOpenFile = async (uri) =>{
    console.log('handleOnOpenFile uri', uri)
    await FileViewer.open(uri) // absolute-path-to-my-local-file.
    .then(() => {
      // success
      console.log('success', )
      setIsDownloadSucceed(false)
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

  const onTenderState = () => {
    const tenderData = route.params.dataTender
    // console.log('route.params.dataTender', JSON.stringify(route.params.dataTender,null,2))
    // const tenderId = route.params.dataTender.id
    // console.log('tenderData \n', tenderData);
    let stPointsVolSum = calculateTotalWeight(route.params.dataTender.startPoints)

    setSumWeight(stPointsVolSum)

    const coordsFrom = tenderData.startPoints.map((item,index)=>{return item.coords})
    const coordsTo = tenderData.endPoints.map((item,index)=>{return item.coords})
    //!! временно пока координаты строка а не число
    // const coordsFrom = tenderData.startPoints.map((item,index)=>{return {latitude: parseInt(item.coords.latitude),longitude: parseInt(item.coords.longitude)}})
    // const coordsTo = tenderData.endPoints.map((item,index)=>{return {latitude: parseInt(item.coords.latitude),longitude: parseInt(item.coords.longitude)}})
    setCoordinatesFrom(coordsFrom)
    setCoordinatesTo(coordsTo)
    // console.log('MAKE coords from: ', coordsFrom)
    // console.log('MAKE coords to: ', coordsTo)
    
    //координаты в один массив
    const coordsRoute = coordsFrom.concat(coordsTo)
    // console.log('onCreateRoutePoints coordsRoute: ', coordsRoute);
    setCoordinates(coordsRoute)
    // setTenderState(tenderData)
    getTenderState(route.params.dataTender.id) //api запрос

    //23.03 если есть описания в точках загрузки / разгрузки то показывать их
    let descrArr = tenderData.startPoints.concat(tenderData.endPoints).map(elem => {
      // console.log('elem.description', elem.description)
      if(elem.description !== undefined && elem.description?.trim()?.length > 0) {
        return elem.description
      } else null
    })
    let descrArrCheck = descrArr?.length > 0 ? descrArr.filter((elem) => !!elem) : []
    if(descrArrCheck?.length > 0) {
      // descriptionPoints, 
      setDescriptionPoints(descrArrCheck)
    }

    let imgArr = []
    tenderData.startPoints.forEach(elem => {
      // console.log('images', elem?.images)
      console.log('images', elem?.images)
      imgArr.push(elem?.images)
    })
    let newArrImg = imgArr !== null && imgArr?.length > 0 ? imgArr.flat(1) : []
    // console.log('newArrImg', newArrImg)
    if(newArrImg?.length > 0) {
      setImagesState(newArrImg)
    }
  }

  // map
  const handlerShowMap = () => {
    setIsVisibleModalAsk(!isVisibleModalAsk)
  }

  const handleBack = (showPointsDatail) => {
    // console.log('handleBack fn',navigation.getState())
    // navigation.navigate('SearchScreen')
    // navigation.popToTop() //вернет на верхний уровень стека(если например мы в Заказы > В работе > заказ123 - вернет в Заказы а не в работе)
    // navigation.goBack()
    if(showPointsDatail === true) {
      setShowPointsDatail(false)
    } else {
      
      if(route.params?.from === 'chat') {
        // console.log('userInfo', route.params.userInfo)
        navigation.navigate('Chat',{item: tenderState, userInfo: route.params.userInfo})
      } else {
        // navigation.goBack() //возвращает на предыдущий скрин
        // navigation.navigate('Tenders')
        // navigation.navigate('Tenders');
        const nav = navigation.getState()
        // console.log('nav', nav)
        const firstPart = nav.routes[0].key.split('-')[0];
        if(firstPart !== undefined &&  firstPart === 'ActiveTenders') {
          navigation.navigate('ActiveTenders');
        } else {
          navigation.navigate('Tenders');
        }
      }
    }
  }

  const handleGoSearch = () => {
    // if(tenderState !== null && tenderState.status === 'publish') {
    if(tenderState !== null) {

      navigation.navigate('SearchDivers',{dataTender: tenderState, driversWithOffer: driversWithOffer})
    } else {
      alert('Заявка на модерации')
    }
  }
 
  const handleFinishTestimonial = () => {
    console.log('handleFinishTestimonial', )
    setIsShowSucceed(false)
    navigation.goBack()
    // навигация на предыдущий скрин
  }

  const onCloseNav = () => {
    setIsLoading(false)
    setIsVisibleCancelAsk(false),
    navigation.goBack()
  }

  const handleShowProfile = (item) => {
    // console.log('item', item)
    setUserProfileState(item)
    setIsVisibleProfile(true)
  }

  //!!Open chat
  const handleOpenChat = (props) => {
    console.log('props', props.userInfo)
    dispatch(setCurrentChatId({tenderId: route.params.dataTender.id, userId: props.userInfo.userId}))
    navigation.navigate('Chat',{item: tenderState, userInfo: props.userInfo, data: props})
    
    // navigation.navigate('Chat',{item: item.data, userInfo: item.userInfo})
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

  function filterUniqueElements(inputArray) {
    const seenElements = new Set();
    const uniqueArray = [];
  
    for (const element of inputArray) {
      const key = `${element.userId}-${element.tenderId}`;
      if (!seenElements.has(key)) {
        seenElements.add(key);
        uniqueArray.push(element);
      }
    }
  
    return uniqueArray;
  }

  const getDrivers = async(tenderData)=>{
    console.log('getDrivers start', )
    setIsLoadingChats(true)
    try {
      // `tenders/${tenderId}/replies` - все водители 
      // `tenders/${tenderId}/drivers/${8}/messages`, - один водитель 
      // const response1 = await get(`tenders/${tenderId}/drivers/${8}/messages`)
      // console.log('response1',response1.data)
      // if (!response1.success) {
      //   console.warn('Ошибка запроса:', response1.error);
      //   //
      //   alert(response1.error);
      //   return;
      //   setIsLoading(false)
      // }
      // console.log('response1', JSON.stringify(response1.data,null,2))
      // tenders/{id}/replies/drivers/{userId}
      //  const response2= await get(`tenders/${tenderId}/replies/drivers/8`)
      // console.log('response2', JSON.stringify(response2.data,null,2))
      // console.log('getDrivers tenderState', tenderState)
      console.log('getDrivers tenderState', tenderState)
      // console.log('getDrivers getDrivers', userFormsHiddenTenders)

      const response = await get(`tenders/${tenderData.id}/replies`)

      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        alert(response.error);
        setIsLoadingChats(false)
        return;
      }

      console.log('getDrivers response', JSON.stringify(response.data,null,2))
      // setIsLoading(false)

      if(response.data.length === 0) {
        setIsLoadingChats(false)
        return 
      } else {
        //TODO
        //1 - проверка на скрытые чаты - если пользователь в скрытых то убираем его
        //2 - создание объекта листа:
        // непрочитанные сообщения клиента myUnreadMsg +
        // непрочитанные сообщения водителя unReadMsg +
        // дата сообщения последнего dateMsg + (последнее сообщение в массиве)
        // дата сообщения последнего в млс dateMls + (последнее сообщение в массиве)
        // ставка repl +
        // инфо водителя из формс userInfo +
        // свой рейтинг rating +
        // завершенные заявки водителем finishedTenders +

        const arrData = []
        const arrDataOffers = [] //водители которым уже был отправлен офер - что бы исключить их из повторного поиска водителей
        response.data.forEach(elem => {
          //elem.userId - должен добавить в объект
          if(elem.form === null || elem.form === undefined) return
          if(userFormsHiddenTenders.blackListOfDriver.includes(elem.form.profile.id)) return
          //TODO изменить на проверку - {tenderId:  , userId: }
          // console.log('userFormsHiddenTenders', userFormsHiddenTenders.hiddenTendersClient)
          //!!проверить код - что бы активного водителя не скрывало а остальных если есть в скрытых то скрывало
          let activedrCheck = false
          // console.log('1activedrCheck', tenderData.driverId,tenderData.driverId,elem.form.profile.id)
          if(tenderData.driverId !== null && tenderData.driverId === elem.form.profile.id) {
            //активный водитель - его не скрывать
            activedrCheck = true
          }
          // console.log('2activedrCheck', activedrCheck)

          let chekHidden = userFormsHiddenTenders.hiddenTendersClient.find(itemfnd => { 
            if(itemfnd.hasOwnProperty('tender_id')) {
              // console.log('tender_id', )
              return itemfnd?.user_id === elem.form.profile.id && itemfnd?.tender_id === tenderData.id 
            } else if(itemfnd.hasOwnProperty('tenderId')) {
              // console.log('tenderId', )
              // console.log('1', itemfnd?.userId,elem.form.profile.id)
              // console.log('1', itemfnd?.tenderId,tenderData.id )
              return itemfnd?.userId === elem.form.profile.id && itemfnd?.tenderId === tenderData.id 
            }
          })
          
          // console.log('chekHidden', chekHidden, activedrCheck,chekHidden !== undefined && !activedrCheck)
          if(chekHidden !== undefined && !activedrCheck) return;
          console.log('NEXT ', )
          let myUnreadMsg = []
          let unReadMsg = []

          const userMsgArr = elem.messages

          // console.log('userMsgArr', userMsgArr)
          // console.log('userMsgArr', JSON.stringify(userMsgArr,null,2))

          userMsgArr.forEach(elemmsg => {
            if(elemmsg.tenderId !== tenderData.id) return
            if(elemmsg.read===false && elemmsg.partnerId !== userProfileInfo.id ) myUnreadMsg.push(elemmsg)
            if(elemmsg.read === false && elemmsg.partnerId === userProfileInfo.id ) unReadMsg.push(elemmsg)
            if(elemmsg.textSystem === 'offerFromClient' && userProfileInfo.id === elemmsg.userId) arrDataOffers.push(elemmsg.partnerId)
          })

          // console.log('myUnreadMsg', myUnreadMsg)
          // console.log('unReadMsg ', unReadMsg)

          const formatData = userMsgArr.length > 0 ? parseDateTimeObj(userMsgArr[userMsgArr.length-1]?.createdAt) : {dateMsg: null,dateMls: null}
          
          // console.log('formatData', formatData)
          //todo essages: elem.messages.filter(elemmsg => elemmsg.tenderId === tenderId) отфильтровывать сообщения по водителю ( другие водители что бы не попадали в объект и в чате есть getUserDataChatRout там тоже )
          let obj = {
            data: tenderData,
            messages: userMsgArr,//elem.messages.filter(elemmsg => elemmsg.tenderId === tenderId),
            forms: elem.form, //!! form.profile - или брать профиль только - посмотреть что используется из формс
            unReadMsg: unReadMsg, //Todo - записывать длину
            dateMsg: formatData.dateMsg,
            dateMls: formatData.dateMls,
            repl: elem.reply,
            userInfo: {
              userId: elem.form.profile.id,
              name: elem.form.profile.name,
              avatar: elem.form.profile.driverAvatar,
              rating: elem.form.profile.rating,
              finishedTenders: elem.form.profile.quantityOfFinished,
              phone: elem.form.profile.phone
            },
            myUnreadMsg: myUnreadMsg, //Todo - записывать true/false
          }
          // console.log('obj', obj)

          arrData.push(obj)
        })
        setDriversWithOffer(arrDataOffers)

        if(arrData.length > 0) {
          // console.log('tenderState', tenderState)
          if(tenderData && tenderData?.driverId !== null) {
              let activeDriver = arrData.find(elem => {
                // console.log('elem.data.driverId', elem.data.driverId)
                // console.log('elem.userInfo.userId', elem.userInfo.userId)
                if(elem.data.driverId === elem.userInfo.userId) {
                  // console.log('elem', elem)
                  return elem
                }
              })
    
              let filtered = arrData.filter(elem => {
                
                // console.log('elem', elem)
                // console.log('tenderState.driverId', tenderState.driverId)
                // console.log('elem.data.data.driverId', elem.data.data.driverId)
                return elem.data.driverId !== elem.userInfo.userId
                //не равен айди водителя 
              })
              // console.log('filtered', filtered)
              // console.log('stateOfUsersChat', stateOfUsersChat)
              
              activeDriver !== undefined ? setIsActiveDriver(activeDriver) :  ''
              
              let sortFlArr = filtered?.length > 0 ? filtered.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
              // console.log('activeDriver', activeDriver)
              // setAllReplies(sortFlArr)
              let arrFlOfData = {tenderId: tenderData.id, dataArr: sortFlArr}
              dispatch(setListOfChatsTenderClient(arrFlOfData))
              // console.log('!!! sortFlArr', sortFlArr)
            } else {
              let sortArr = arrData?.length > 0 ? arrData.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
              // console.log('sortArr', sortArr)
              let arrOfData = {tenderId: tenderData.id, dataArr: sortArr}
              dispatch(setListOfChatsTenderClient(arrOfData))
              // setAllReplies(sortArr)
            }
        } else {
          dispatch(resetList())
        }
        setIsLoadingChats(false)

        // setListOfChatsState(arrData)
      }
    } catch (error) {
      console.log('error',error)
      setIsLoadingChats(false)
    }
  }

  const handleEdit = (flag) => {
    dispatch(setDataTender(tenderState))
    dispatch(setDataTenderWithChats(tenderState))
    if(flag === true) {
      navigation.navigate('EditTender',{dataTender: tenderState, withchats: flag})
    } else {
      navigation.navigate('EditTender',{dataTender: tenderState})
    }
  }

  const handleChangeArchivedTender = async(flag,withrestorechats) => {
    // setIsLoading(true)

    const tenderObj = {archived: true}

    const response = await put(`tenders/${tenderId}`,tenderObj)
    
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      setIsLoading(false)
      alert(response.error);
      return;
    }
    navigation.goBack()

    // try {
    //   let obj = flag === 'del' ? {'archived': true} : {'archived': false}
    //   await firestore().collection('tenders')
    //     .doc(route.params.dataTender.id).update(obj)
    //     .then(() => {
    //       console.log('successfully!')
    //       //если удаление - удалять чаты
    //       if(flag==='del') {
    //         let arrOfUserToHidden = route.params.dataTender?.data?.usersIdWithChat?.length > 0 ? route.params.dataTender?.data?.usersIdWithChat.map(elem => {
    //           return {userId: elem, tenderId: route.params.dataTender.id}
    //         }) : []
    //         addUsersWithChatsToHidden(arrOfUserToHidden,hiddenTenderClient,uid,route.params.dataTender)
    //       } else {
    //         //восстановить чаты чаты
    //         restoreAllChats(hiddenTenderClient,uid,route.params.dataTender)

    //         firestore().collection('forms').doc(uid).update({
    //           'clientActiveTender': firestore.FieldValue.arrayRemove(route.params.dataTender.id)
    //         }).then((res)=> {
    //           console.log('forms update &&  getClientActiveTender', )
    //           getClientActiveTender(uid,dispatch,setClientActiveTenderState)
    //         })
    //       }
    //       // console.log('res', res)
    //       setIsLoading(false)
    //       // navigation.navigate('Tenders')
    //       navigation.goBack()
    //     }).catch((errorfb)=>{
    //       console.log('errorfb', errorfb,)
    //       setIsLoading(false)
    //     })
    //     //восстановить чаты со всеми водителями у себя и у них (usersIdWithChat), кроме отказавшегося водителя
    //     // if(withrestorechats === true) {
    //     //   //фун-я восстановления чатов
    //     //   await restoreUsersWithChatsFromHidden(hiddenTenderClient,uid,route.params.dataTender,role,route.params.dataTender.data.driverId)
    //     //   .then((res)=>{
    //     //     console.log('then res', res)
    //     //     getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
    //     //     setIsLoading(false)
    //     //     navigation.navigate('Tenders')
    //     //     handleBack(showPointsDatail)
    //     //   })
    //     // }
      
    // } catch (error) {
    //   console.log('error', error)
    //   setIsLoading(false)
    // }
  }

  const handleRestore = (flag) => {
    console.log('handleRestore', )
    if(askDataObj?.name === 'askRestoreEditTender') {
       //отправлять на редактирование
      handleEdit(restoreWithChats)
    } else if(askDataObj?.name === 'askRestoreTender') {
      //восстаноавливать
      handleChangeArchivedTender('restore',restoreWithChats)
    }
    setIsShowAskRestore(false)
  }

  const handleCheckRestore = async (flag) => {
    console.log('handleCheckRestore', )
    let check = checkDateOfTender(tenderState?.startPoints) //false - нет даты больше либо равной сегодняшней
    console.log('check', check)
    if(check=== true) {
      //восстаноавливать
      let objRt = findJsonObj(jsonDataPrompt,'askRestoreTender',askRestoreTender)
      setAskDataObj(objRt)
      //открывать модалку восстанавливать /нет
      setIsShowAskRestore(true)
    } else if(check=== false) {
      //отправлять на редактирование
      //открывать модалку редактировать /нет      
      let objRt = findJsonObj(jsonDataPrompt,'askRestoreEditTender',askRestoreEditTender)
      setAskDataObj(objRt)
      setIsShowAskRestore(true)
      //отправлять на редактирование
      //открывать модалку редактировать /нет
    }
    // проверять точки загрузки - если нет даті больше сегодняшней то отправлять на редактирование
    //иначе открывать восстановление модалку
  }

  const ChatItem = ({prop, flag}) => {
    // console.log('CL ChatItem prop', prop)
    const data = prop.data
    // console.log('data', data)
    const repl = prop.repl!==null && prop.repl!==undefined? prop.repl: null
    let userInfo = prop.userInfo!==null && prop.userInfo!==undefined? prop.userInfo: null
    let counter = prop.unReadMsg?.length
    let dataMsg = prop?.dateMsg
    let myUnreadMsg = prop?.myUnreadMsg

    // console.log('prop.unReadMsg', prop.unReadMsg, counter )
    // console.log('prop.unReadMsg', prop.unReadMsg, counter )
    // console.log('ChatItem dataMsg,counter', dataMsg, counter)

    // let isChose = choseChatsArr.find(item=> item===prop.data.id)

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

    // console.log('tenderState ', tenderState, prop.data.data.userId)
    // let isActive =  tenderState.driverId !== null && prop.data.userId === tenderState.driverId

    return (
      <View 
        style={[mainstyles.mrChats]} 
        
      >
        <View style={[styles.row,styles.wrapper, mainstyles.shadowG5r5
          // tenderState.driverId !== null ? (prop.data.data.userId === tenderState.driverId ? styles.isActive : styles.isNonActive): null
          ]}>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.imgContainer} activeOpacity={1} 
            onPress={()=>handleShowProfile(userInfo)}
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
            <TouchableOpacity style={[styles.midRifhtContainer, mainstyles.row,]} activeOpacity={0.9} 
            onPress={() => handleOpenChat(prop)}>
              <View style={[styles.content,{justifyContent: 'space-between'}]}>
                <Text style={[mainstyles.text14R,{color: THEME.GREY800,}]}>{userName}</Text>
                <View style={[mainstyles.rowalC]}>
                  <Text style={[mainstyles.text14R,{color: THEME.GREY800}]}>Выполнено заказов: </Text>
                  {/* <Text style={[mainstyles.text14M,{color: THEME.GREY800}]}>{prop.data?.finishTenders}</Text> */}
                  {
                    prop.userInfo?.finishedTenders ? 
                    <Text style={[mainstyles.text14M,{color: THEME.GREY800}]}>{prop.userInfo?.finishedTenders}</Text>
                    : <Text style={[mainstyles.text14M,{color: THEME.GREY800}]}>0</Text>
                  }
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
                        myUnreadMsg&&myUnreadMsg?.length>0?
                        <IconDblCheck color={THEME.GREY300}/>
                        :<IconDblCheck />
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
                      <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{data?.price} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
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

  const handleCancelTender = async() => {
    setIsLoading(true)
    Keyboard.dismiss()

    try {
      const respCancel = await cancelDelivery(
        role,
        activeDriver.repl, //todo check object
        tenderState,
        msgCancelText,
        setIsVisibleCancelAsk
        // messageIdGenerator,
        // firebeseUpdateTender, 
      )
      // if(respCancel !== null && respCancel !== undefined) {
      //     setIsVisibleCancelAsk(false)
      //     setIsLoading(false)
      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         {
      //           name: 'TendersTab',
      //           state: {
      //             routes: [{
      //             name: 'Tenders',
      //             }]
      //           }
      //         },
      //       ]
      //     })
      //     //обновлять профиль? (или прийдет событие через сокет)
      //     //TODO проверять даты заявки
      //     // let check = checkDateOfTender(tenderState?.startPoints) или потом на серваке
      // }
      if(respCancel !== null && respCancel !== undefined) {
        //обновить стейт неактивных что бы скрыть водителя
        getUserHiddenTenders(dispatch)
        setIsVisibleCancelAsk(false)
        setIsLoading(false)
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TendersTab',
              state: {
                routes: [{
                name: 'Tenders',
                }]
              }
            },
          ]
        })
        //обновлять профиль? (или прийдет событие через сокет)
        //TODO проверять даты заявки
        // let check = checkDateOfTender(tenderState?.startPoints) или потом на серваке
      }

    // !!old code
    //   // let driver = activeDriver.data.data
    //   console.log('activeDriver', activeDriver)
    //   await cancelDelivery(
    //     role,
    //     activeDriver.repl,
    //     // {data: activeDriver.data.data, id: activeDriver.data.id},
    //     {data: tenderState, id: tenderId},
    //     firebeseUpdateTender, 
    //     msgCancelText,
    //     messageIdGenerator,
    //     setIsVisibleCancelAsk
    //   ).finally(()=> {
    //     //TODO проверять даты заявки
    //     setIsVisibleCancelAsk(false)
    //     console.log('handleAddChatToHiddenBothRole finally check date', )
    //     //1.если даты просрочены то предложить поменять даты +  сообщение что все чаты будут восстановлены 
    //     //для продолжения поиска исполнителя или закрыть заявку
    //     //если выбор поменять даты
    //     //переход в редактирование - после редактирования - по флагу - востановление чатов
    //     //если нет то отмена
    //     //2.если даты не просрочены - то востановление чатов
    //     setRestoreWithChats(true)
    //     let check = checkDateOfTender(tenderState?.startPoints)
    //     console.log('- check:', check)
    //     if(check === true) {
    //       //2. => нет просроченых дат - востановить чаты
    //       restoreUsersWithChatsFromHidden(hiddenTenderClient,uid,route.params.dataTender,role,route.params.dataTender.data.driverId)
    //       .then((res)=>{

    //         console.log('then res без изменения дат', res)
    //         // getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
    //         setIsLoading(false)
    //         // navigation.navigate('Tenders')
    //         navigation.goBack()
    //         // handleBack(showPointsDatail)
    //       })

    //       //клиент убирать из активных заявок для себя и водителя
    //       firestore().collection('forms').doc(uid).update({
    //         'clientActiveTender': firestore.FieldValue.arrayRemove(route.params.dataTender.id)
    //       }).then((res)=> {
    //         console.log('forms update &&  getClientActiveTender', )
    //         getClientActiveTender(uid,dispatch,setClientActiveTenderState)
    //       })

    //       //водителю
    //       firestore().collection('forms').doc(route.params.dataTender.data.driverId).update({
    //         'driverActiveTender': firestore.FieldValue.arrayRemove(route.params.dataTender.id),
    //       })
    //     } else {
    //       setIsLoading(false)
    //       console.log('показать модалку восстановления заявки', )
    //       // 1. => есть просроченные даты - модалка редактировать
    //       let objRt = findJsonObj(jsonDataPrompt,'askRestoreEditTender',askRestoreEditTender)
    //       setAskDataObj(objRt)
    //       setIsShowAskRestore(true)
    //     }
    //   })

    } catch (error) {
      setIsVisibleCancelAsk(false)
      setIsLoading(false)
      console.log('handleCancelTender error', error)
    }
  }

  const renderImage = ({item,index}) => {
    // console.log('item', item)
    return (
      <TouchableOpacity key={index} onPress={()=>{setIsShowCarousel(true)}}>
         <View style={{
            borderRadius: 10,
            height: width / 4,
            width: width / 4 - 15,
            marginHorizontal: 4,
            backgroundColor: '#e0e0e0', // плейсхолдер фон
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={{uri: item}} style={[{
            borderRadius: 10,
            height: width/4,
            width:  width/4-15, 
            marginHorizontal: 4}]}
            onLoadStart={() => setLoadingImg(true)}
            onLoadEnd={() => setLoadingImg(false)}
          />

        </View>
        {loadingImg && 
          <ActivityIndicator size="small" color="blue" style={{alignSelf: 'center',position: 'absolute',height: width / 4,}}/>
        }

      </TouchableOpacity>
    )
  }

  const handleDownloadFile = async (fileData) => {
    console.log('fileData', fileData)
    console.log('RNFS.DownloadDirectoryPath', RNFS.DownloadDirectoryPath)
    let status = await requestStoragePermisson(Platform)
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
      // const localFile = `${RNFS.DownloadDirectoryPath}/${path}`;

      // const localFile = `${RNFS.ExternalStorageDirectoryPath}/${path}`;
      // const localFile = `${RNFS.DocumentDirectoryPath}/${path}`;
      // const localFile = `${RNFS.ExternalStorageDirectoryPath}/Pictures/${path}`; // не показывает в проводнике
      // console.log('RNFS', )
      //проверять что бы была папка Download у андроида, если нет создавать
      //в 6 андроидах не всегда есть папка Download
      const localFile =  Platform.OS==='android' ? `${RNFS.DownloadDirectoryPath}/${path}` : `${RNFS.DocumentDirectoryPath}/${path}`
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTenderState(route.params.dataTender.id).then(() => setRefreshing(false));
  }, []);

  const checkNewMsg = async () => {
    // console.log('checkNewMsg tenderInformersState', tenderInformersState)
    if(tenderInformersState.length === 0) return false
    let findTenderUpd = tenderInformersState.find(elem => elem.tenderId === route.params.dataTender.id && (elem.textSystem==='feedback'|| elem.textSystem === 'orderCanceled'))
    let findTenderChatsUpd = tenderInformersState.find(elem => elem.tenderId === route.params.dataTender.id )
    // console.log('findTenderUpd', findTenderUpd)
    // console.log('findTenderChatsUpd', findTenderChatsUpd)

    //!!приоритет найти в tenderInformersState 'feedback' или 'orderCanceled' если их нет то проверять дальше
    if(findTenderUpd !== undefined) {
      //обновлять заявку
      console.log('findTenderUpd.textSystem getTenderState', findTenderUpd.textSystem )
      await getTenderState(route.params.dataTender.id)
      //что еще надо делать?
      // при отмене водителем - надо что бы был обновлен стейт неактивных ( по сокету обновлять стейт формы?)
    } else if(findTenderUpd == undefined && findTenderChatsUpd !== undefined) {
      //todo был баг с новым чатом - пришло сообщение но чат не появился
      console.log('findTenderChatsUpd.textSystem getDrivers', findTenderChatsUpd.textSystem )
      if(tenderState === null) {
        // const resp = await getTenderState(route.params.dataTender.id)
        getDrivers(route.params.dataTender)
      } else {
        getDrivers(tenderState)
      }
    }
    
    // dispatch(delTenderInformersState({tenderId: route.params.dataTender.id})) //!! уберет информеры со скрина всех заявок ?? не понятно для чего это было
      
    // if(findTenderUpd !== undefined) {
    //   if(findTender.textSystem === 'feedback' || findTender.textSystem === 'orderCanceled') {
    //     //обновлять заявку
    //     console.log('findTender.textSystem getTenderState', findTender.textSystem )
    //     getTenderState(route.params.dataTender.id)
    //   } else {
    //     console.log('findTender.textSystem getDrivers', findTender.textSystem )
        
    //     getDrivers()
    //   }
    //   console.log('if findTender', findTender)
    //   tenderState !== null ? dispatch(delTenderInformersState({tenderId: tenderId})) : null
    // } else {
    //   console.log('else findTender', findTender)
    // }
  }

  //goback
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

  //tenderstate
  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect onTenderState', )
      if(tenderState === null) {
        onTenderState()
      }
    }, [route])
  )
  
  //getdrivers
  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect getRepl', )
      // getRepl()
      if(isfocused && tenderState !== null) {
        console.log('getDrivers isfocused', isfocused && tenderState !== null, userFormsHiddenTenders)
        getDrivers(tenderState)
      }
    }, [tenderState,isfocused,userFormsHiddenTenders])
  )

  //animation
  useEffect(() => {
    if (isDownloadSucceed) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isDownloadSucceed]);


  //listofchatstate
  useEffect(() => {
    // console.log('listOfChats', listOfChats)
      console.log('START GET useFocusEffect listOfChats', )
        if(listOfChats?.length > 0) {
          let arrOfChats = listOfChats.find(elem => elem.tenderId === tenderId)
          // console.log('arrOfChats', arrOfChats)
          // console.log('arrOfChats.dataArr', arrOfChats?.dataArr)
          setListOfChatsState(arrOfChats?.dataArr)
          // listOfChatsState
        } else {
          setListOfChatsState([])
        }
  }, [listOfChats]);

  //checkmsg
  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect tenderInformersState',tenderInformersState )
      if(isfocused) {
        checkNewMsg()
      }
    }, [tenderInformersState,isfocused])
  )

  // useEffect(() => {
  //   checkNewMsg()
  // }, [tenderInformersState])

  console.log('____render TICS____')


 const testfn = async () => {
      // const responseTender = await put(`tenders/${tenderId}`,{driverId: null, replyId: null})
      // console.log('responseTender', responseTender?.data) 
  }

  return (
    <View style={styles.container}>
      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isShowSucceed ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{height: height, minHeight: height,zIndex: 99999}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTender',finishTender)} onPress={handleFinishTestimonial}/>
          </View>
        : 
        null
      }
      {
        isVisibleProfile && userProfileState ? 
        <View style={[mainstyles.containerModalGgBl,{flex:1, minHeight: height+safeInsets.top, zIndex: 99999}]}>
          <ProfileInfo 
            role={'client'}
            userInfo={userProfileState}
            onClose={()=>{setIsVisibleProfile(false)}}
          />
        </View>
        :null
      }
      {
        isShowAskDel ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
          <InfoAskWindow data={findJsonObj(jsonDataPrompt,'hide_app_popup',hideAppPopup)} onPress={()=>handleChangeArchivedTender('del')} onClose={()=>setIsShowAskDel(false)}/>
        </View>
        : null
      }
      {
        isVisibleProfileTestim && tenderState!==null ?
        <View style={[mainstyles.containerModalGgBl,{flex:1, minHeight: height+safeInsets.top,zIndex: 99999}]}>
          <ProfileInfoWithTestimonial
            partnerProfile={activeDriver.forms}
            tenderState={tenderState}
            onClose={()=>{setIsVisibleProfileTestim(false)}}
            onPress={()=>setIsShowSucceed(true)}
          />
        </View>
        :null
      }
      {
        isShowAskRestore && askDataObj!==null ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
          <InfoAskWindow data={askDataObj} onPress={()=>handleRestore()} onClose={()=>{setIsShowAskRestore(false),navigation.navigate('ActiveTenders')}} customStyleBtn1={{minWidth: '45%'}}/>
        </View>
        : null
      }
      {
        isVisibleShowInfoFinish ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTenderTestimErr',finishTenderTestimErr)} onPress={()=>{setIsVisibleShowInfoFinish(false)}}/>
        </View>
        : null
      }
      {
        isVisibleCancelAsk ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
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

      { 
        tenderState!==null && isfocused ?
          <View style={{}}>
            {
              showPointsDatail ?
              <View style={{}}>
                <ListPointSlider 
                  data={tenderState}
                  topBtnPosition={safeInsets.top+40}
                  mapViewRef={mapViewRef} customStyles={{height:height/2.8}} 
                  cusStMap={{ minHeight: height/2.8}}
                  onClose={()=>setShowPointsDatail(false)}
                />
                {/* <ListPointSliderCustom
                  data={tenderState}
                  topBtnPosition={safeInsets.top+40}
                  mapViewRef={mapViewRef} customStyles={{height:height/2.8}} 
                  cusStMap={{ minHeight: height/2.8}}
                  onClose={()=>setShowPointsDatail(false)}
                /> */}
              </View>
              :
              <ScrollView style={{}} 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
                <LinearGradient style={[styles.headerStyles,mainstyles.rowalCjcSb,{width: '100%',paddingVertical: 10,paddingTop: safeInsets.top, paddingHorizontal: 10}]} colors={['rgba(255,255,255,1)','rgba(255,255,255,0)']} useAngle angle={180}>
                  <View style={{width: '30%',backgroundColor: 'transparent'}}>
                    <BtnIconTrs onPress={() => handleBack(showPointsDatail)} customStyles={{width: '40%',paddingLeft: 10, backgroundColor: 'transparent',alignItems: 'flex-start'}}>
                      <BackArrow />
                    </BtnIconTrs>
                  </View>
                  <View style={[mainstyles.rowalCjcSb,{width: '70%',backgroundColor: 'transparent'}]}>
                    {
                      tenderState.archived === true &&  tenderState.finishedAt !== null ?
                      null
                      :
                      <TouchableOpacity onPress={handleEdit} style={[{width: '50%', alignItems: 'center',backgroundColor: 'transparent', paddingVertical: 5}]}>
                        <View style={[mainstyles.rowalC,{}]}>
                          <IconEdit color={THEME.PRIMARY} size={18}/>
                          <Text style={[mainstyles.text12R,styles.textHeader]}>Редактировать</Text>
                        </View>
                      </TouchableOpacity>
                    }
                    {
                      tenderState.archived === false ?
                        <TouchableOpacity onPress={()=>setIsShowAskDel(true)} style={[{width: '50%',alignItems: 'center',backgroundColor: 'transparent'}]}>
                          <View style={[mainstyles.rowalC,{}]}>
                            <IconTrash  color={THEME.GREY400}/>
                            <Text style={[mainstyles.text12R,styles.textHeader]}>Удалить</Text>
                          </View>
                        </TouchableOpacity>
                        :
                        <>
                          {
                            tenderState.archived === true &&  tenderState.finishedAt !== null ?
                            null
                            :
                            <TouchableOpacity onPress={handleCheckRestore} style={[{width: '50%',alignItems: 'center',backgroundColor: 'transparent'}]}>
                              <View style={[mainstyles.rowalC,{}]}>
                                <IconTrash  color={THEME.GREY400}/>
                                <Text style={[mainstyles.text12R,styles.textHeader]}>Восстановить</Text>
                              </View>
                            </TouchableOpacity>
                          }
                        </>
                    }
                  </View>
                </LinearGradient>

                <TenderMapDriver 
                  mapViewRef={mapViewRef} 
                  customStyles={{height:height/2.8,}}
                  cusStMap={{ minHeight: height/2.8,}}
                  topBtnPosition={safeInsets.top+40}
                  coordinatesArr={coordinates}
                  coordinatesFrom={coordinatesFrom}
                  coordinatesTo={coordinatesTo}
                  isRouteVisible={true}
                />
                {/* {
                  tenderState?.status === 'create' || tenderState?.status === 'edit' ?
                  <View style={{position: 'relative',zIndex: 999}}>
                    <TouchableOpacity style={[styles.button,mainstyles.shadowG5r5,{borderColor: THEME.ORANGE, borderWidth: 2}]} disabled={true}>
                      <Text style={[mainstyles.text14R,{color: THEME.ORANGE}]}>На модерации</Text>
                    </TouchableOpacity>
                  </View>
                  : null
                } */}
                {
                  (tenderState?.status === 'publish' || tenderState?.status === 'create') && tenderState.driverId === null && tenderState?.archived === false?
                  <View style={{position: 'relative',zIndex: 999}}>
                    <TouchableOpacity style={[styles.button,mainstyles.shadowG5r5,{borderColor: THEME.PRIMARY, borderWidth: 2}]} onPress={handleGoSearch}>
                      <Text style={[mainstyles.text14R,{color: THEME.PRIMARY}]}>Поиск водителей</Text>
                    </TouchableOpacity>
                  </View>
                  : null
                }
                {
                  tenderState?.status === 'error'?
                  <View style={{position: 'relative',}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.RED, borderWidth: 2}]}>
                      <IconCross color={'red'}/>
                      <Text style={[mainstyles.text14M,{color: THEME.RED,paddingLeft: 10}]}>Заявка отклонена</Text>
                    </View>
                  </View>
                  : null
                }
                {
                  tenderState?.archived === true ?
                  <View style={{position: 'relative',}}>
                    <View style={[styles.button,mainstyles.shadowG5r5, mainstyles.rowalCjcSb,{borderColor: THEME.RED, borderWidth: 2}]}>
                      <IconCross color={'red'}/>
                      <Text style={[mainstyles.text14M,{color: THEME.RED,paddingLeft: 10}]}>Заявка завершена</Text>
                    </View>
                  </View>
                  : null
                }
                {
                  tenderState?.status === 'error'?
                  // __DEV__ ?
                  <View style={{paddingTop: 22,paddingHorizontal: 10,}}>
                    <Text style={[mainstyles.text16M,{color: THEME.REDERR}]}>{tenderState?.statusMsg}</Text>
                  </View>
                  :null
                }
                <View style={{paddingTop: 22,paddingHorizontal: 10,paddingBottom: 10}}>
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
                
                {
                  tenderState.driverId !==null ?
                  <View style={[{}]}>
                    <Text style={[mainstyles.pH10,mainstyles.text16M,{color: THEME.GREY900,paddingBottom: 15}]}>Выбранный водитель</Text>
                    
                    {
                      activeDriver ?
                      <ChatItem prop={activeDriver} />
                      : null
                    }
                    {
                      tenderState.hasOwnProperty('archived') && tenderState.archived === true ?
                      null
                      :
                      <View style={[mainstyles.rowalCjcSb, mainstyles.pV10, mainstyles.pH10,{paddingBottom: 22} ]}>
                        <ButtonWithIcon title={"Позвонить перевозчику"} onPress={()=>handlerCallNumer(activeDriver.userInfo.phone)}
                          customStyles={{width: '24%'}}
                        >
                          <IconCall />
                        </ButtonWithIcon>
                        <ButtonWithIcon title={"Написать перевозчику"} disabled={activeDriver === null ? true : false} onPress={()=>handleOpenChat(activeDriver)}
                          customStyles={{width: '24%'}}
                        >
                          <IconChatsTab color={'#fff'} width={25} height={18} />
                        </ButtonWithIcon>
                        {
                          tenderState.finishedAt === null ?
                          <ButtonWithIcon title={"Завершить выполнение заказа"} onPress={()=>setIsVisibleShowInfoFinish(true)} color={THEME.GREY200} textColor={THEME.GREY600}
                          customStyles={{width: '25%'}}
                          >
                            <IconCheckThin color={THEME.GREY600} width={23} height={18} />
                          </ButtonWithIcon>
                          :
                          <ButtonWithIcon title={"Завершить выполнение заказа"} onPress={()=>setIsVisibleProfileTestim(true)} customStyles={{width: '25%'}}>
                            <IconCheckThin color={'#fff'} width={23} height={18} />
                          </ButtonWithIcon>
                        }
                        <ButtonWithIcon title={"Отменить выполнение заказа"} onPress={()=>setIsVisibleCancelAsk(true)} customStyles={{width: '25%'}}>
                          <IconCross />
                        </ButtonWithIcon>
                      </View>
                      
                    }
                  </View>
                  : null
                }
                
                  <>
                    <View style={[{marginTop: 20,paddingHorizontal: 10,paddingVertical: 10,backgroundColor: '#f5f5f5'}]}>
                      <Text style={[mainstyles.text14R,styles.textColorD,]}>Отклики водителей</Text>
                    </View>
                    {/* {
                      __DEV__&&
                      <DefaultBtn 
                            title={"resetList"}
                            customStyle={{height: 40, width: '25%',minWidth: null, paddingVertical: 0}}
                            color='#fff'
                            onPress={()=>dispatch(resetList())}/>
                    } */}
                    <FlatList
                      style={{paddingVertical: 15, backgroundColor: 'transparent'}}
                      // data={listOfChats}
                      data={listOfChatsState}
                      ListHeaderComponent={()=>{
                        return (
                          <>
                            {
                              isLoadingChats ?
                                <View style={[mainstyles.rowalCjcC,{backgroundColor: '#fff',paddingBottom: 5}]}>
                                  <ActivityIndicator color={THEME.PRIMARY} size='small'/> 
                                  <Text style={[mainstyles.text12R,{paddingLeft: 15}]}>Поиск обновлений чатов</Text>
                                </View>
                              : 
                              null
                            }
                          </>
                        )
                      }}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index+'tnd'}
                    />
                  </>
                  {/* {__DEV__ &&<TouchableOpacity style={{ paddingTop: 50,backgroundColor: 'orange', height: 40}} onPress={testfn}><Text>123</Text></TouchableOpacity>} */}

              </ScrollView>
            }
            {
              isShowCarousel ? 
              <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: 0,zIndex: 99999},
                stylesCarousel]}>

                <View style={{backgroundColor: 'transparent',alignSelf: 'center',}}>
                  <View style={{position: 'absolute',top: 0,zIndex: 996,width: '100%'}}>
                    <View style={{backgroundColor: 'transparent',paddingTop: safeInsets?.top+10, paddingHorizontal: 10,paddingBottom: 10,alignItems: 'center',width: '100%',flexDirection: 'row', justifyContent: 'space-between'}}> 
                      <View style={{width: '85%',backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
                        <Pressable
                        disabled={disableDownload}
                          onPress={()=>handleDownloadFile(imagesState[currIndexImag])}
                          style={({pressed}) => [
                            {
                              backgroundColor: pressed ? 'rgba(143, 241, 17,0.4)' : 'rgba(255,255,255,0.3)',
                            },
                            {width: '30%',padding: 10,zIndex: 996, borderRadius: 4,borderWidth:1, borderColor: THEME.GREY500 }, mainstyles.alCjcC
                          ]}
                          >
                          <Text style={{color: '#fff',elevation:1}}>Скачать</Text>
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
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // height: 500,
    backgroundColor: '#fff',
    height: height-65
    
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
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
  button: {
    position: 'absolute',
    top: -20, 
    right: 10, 
    // width: 126,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 4,
    elevation: 7,
    shadowColor: THEME.GREY500,
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
  isActive: {
    borderColor: THEME.BRIGHT_GREEN,
    borderWidth: 2
  },
  isNonActive: {
    backgroundColor: THEME.GREY100,
  },
  inner: {
    // backgroundColor: 'lightblue',
    width: '100%',
    flexDirection: 'row',
  },
  imgContainer: {
    // backgroundColor: 'pink',
    width: '20%',
    paddingVertical: 10,
    paddingLeft: 10,
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


  //check and del
  image: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: THEME.MAIN_COLOR,
    borderRadius: 50,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: 'red',
    fontSize: SIZE.normal,
    fontWeight: "600"
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '4%'
  },
  icon: {
    backgroundColor: THEME.MAIN_COLOR,
    borderRadius: 35,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
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
    // right: 15,
    // top: 15,
  },
  
});