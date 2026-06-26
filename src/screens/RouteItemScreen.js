import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView,  Modal, FlatList, ActivityIndicator } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useSelector, useDispatch } from 'react-redux';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

//functions && features && slice
import { openGM } from '../util/MapUtil/mapFn';
import { askDelRoute, askRestoreEditRoute, askRestoreRoute, height } from '../util/helperConst';
import { setDataRoute } from '../store/features/editRouteSlice';
import { timest, timestMonth } from '../util/const';
import { checkDateOfTender, findJsonObj } from '../util/tools';

//components
import { OpenGoogleMaps } from '../components/Modal/OpenGoogleMaps';
import { TenderMapDriver } from '../components/MapComponents/TenderMapDriver';
import { AddressPointsView } from '../components/AddressPointsView';
import BackArrow from '../components/Svg/BackArrow';
import { BtnIconTrs } from '../components/Buttons/BtnIconTrs';
import ListPointSlider from '../components/ListPointSlider';
import IconStarSmallFill from '../components/Svg/IconStarSmallFill';
import { ProfileInfo } from '../components/Profile/ProfileInfo';
import InfoAskWindow from '../components/Modal/InfoAskWindow';
import IconTrash from '../components/Svg/IconTrash';
import IconEdit from '../components/Svg/IconEdit';
import IconDblCheck from '../components/Svg/IconDblCheck';

//styles
import { mainstyles, SIZE, THEME,} from '../theme';
import { get, put } from '../store/features/api/user-api';
import { parseDateTimeObj } from '../util/dateFormats';
import { setCurrentChatId } from '../store/features/listOfChatsSlice';
import { normalize } from '../util/UI/fontsUI';


export const RouteItemScreen = ({route, navigation}) => {
  console.log('RouteItemScreen route', route.params)
  //! когда навигация из чата то предается айди маршрута данные маршрута из фаербейз
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 

  const mapViewRef = useRef()
  const uid = ''//auth().currentUser.uid
  // const routeData = route.params.dataTender
  // const chatsRef = firestore().collection('messages')
  const role = useSelector(state => state.login.role)
  // const userProfile =  useSelector((state) => state.login.userProfileInfo)
  // const tenderFaivor = useSelector((state) => state.user.tenderFaivor)
  // const tenderDelete = useSelector((state) => state.user.tenderDelete)
  // const blackListArr = useSelector((state) => state.user.blacklist)
  // const [isFaivor, setIsFaivor] = useState(false)
  // const [isHidden, setIsHidden] = useState(false)
  const stateOfInformersRoutes = useSelector((state) => state.chats.informerRoutesState)
  const informerRoutesState = useSelector((state) => state.listofchats.informerRoutesState)
  
  const { userProfileInfo,userFormsInfo, userFormsActivities,checkUpdFormActivities, checkUpdFormsRouteOffers,userFormsHiddenTenders,driverDeleteTenders } = useSelector((state) => state.login)

  const userProfile = useSelector((state) => state.login.userProfileInfo)

  // const tenderId = route.params.dataTender.id

  const [tenderState, setTenderState] = useState(null)
  const [propouses, setPropouses] = useState([])
  const [coordsFirstPointOfTenders, setCoordsFirstPointOfTenders] = useState([])
  // console.log('propouses', propouses)
  const [isVisibleModalAsk, setIsVisibleModalAsk] = useState(false)

  const [showPointsDatail, setShowPointsDatail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [coordinates, setCoordinates] = useState([])
  // const [isVisibleProfileTestim, setIsVisibleProfileTestim] = useState(false)
  // const [isVisibleAddCarsModal, setIsVisibleAddCarsModal] = useState(false)
  // const [isShowSucceed, setIsShowSucceed] = useState(false)
  const [isShowAskDel, setIsShowAskDel] = useState(false)
  const [userProfileState, setUserProfileState] = useState(null)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)  
  const [askDataObj, setAskDataObj] = useState(null)
  const [isShowAskRestore, setIsShowAskRestore] = useState(false)

  const dispatch = useDispatch()

  const getTenderState = async (tenderId) => {
    // try {
    //   return await firestore().collection('tenders')
    //     .doc(tenderId)        
    //     .get()
    //     .then((documentSnapshot) => {
    //       console.log('documentSnapshot', documentSnapshot.data())
    //       return {data: documentSnapshot.data(), id: documentSnapshot.id}
    //     })
    // } catch (error) {
    //   console.log('catch getTenderState error', error)
    // }
  }

  const handleOpenChat = (props) => {
    console.log('handleOpenChat props', props)
    dispatch(setCurrentChatId({tenderId: props.data.id, userId: props.userInfo.userId}))

    navigation.navigate('Chat',{item: props.data, userInfo: props.userInfo, data: props, from: 'routes'})

  }

  function formatDate(milliseconds) {
    console.log('milliseconds', milliseconds)
    // let datefb = prop?.msgPropouse !== null ? 

    const date = new Date(milliseconds.toMillis());
  
    // Извлекаем день, месяц и год из объекта Date
    const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль, если день < 10
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear().toString().slice(-2); // Получаем последние две цифры года
  
    // Формируем строку в нужном формате
    const formattedDate = `${day}.${month}.${year}`;
  
    return formattedDate;
  }

  const getTender = async (data) => {
    // try {
    //   let obj = {
    //     msgPropouse: data,
    //     tender: null,
    //   }
    //   await firestore().collection('tenders')
    //     .doc(data.tenderId)
    //     .get()
    //     .then(documentSnapshot => {
    //       console.log('documentSnapshot tenders', documentSnapshot.id)
    //       obj.tender = {
    //         data: documentSnapshot.data(),
    //         id: documentSnapshot.id,
    //       }
    //     }).catch((error) => {
    //       console.log('error', error)
    //     })
    //     return obj
    // } catch (errorw) {
      
    // }
  }

  const getLastData = (arr) => {
    // console.log('arr', arr)
    let date = arr && arr.reduce(function(prev, current) {
      
      return (prev.createdAt.toMillis() > current.createdAt.toMillis()) ? prev : current
    });
    const d = new Date(date.createdAt.toMillis())
    
    let formattedDate = ("0" + d.getDate()).slice(-2)  + "." + ("0"+(d.getMonth()+1)).slice(-2)  + "." + d.getFullYear()
    // console.log('d', d)
    // console.log('formattedDate', formattedDate)
    return {formattedDate: formattedDate, dateMls: date.createdAt.toMillis()};
  }

  const getReply = async (item,uid) => {
    // console.log('item', item)
    //   try {
    //     let replies = null
    //     await firestore().collection('replies')
    //     .where('userId','==', uid)
    //     .where('tenderId','==', item)
    //     .where('rejectedAt','==', null)
    //     .where('rejectedByDriverAt','==', null)
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('querySnapshot replies', querySnapshot.size)
    //       // console.log('userInfo 1', userInfo)
    //       if(querySnapshot.size > 0) {
    //         querySnapshot.forEach(documentSnapshot => {
    //           console.log('--id', documentSnapshot.data())
    //           replies = {
    //               data: documentSnapshot.data(),
    //               id: documentSnapshot.id,
    //             }
    //         })
    //       } else return null
    //     })
    //     // console.log('replies', replies)
    //     return replies
        
    //   } catch (error) {
    //     console.log('getReply error', error)
    //   }    
  }

  const getPropouse = async () => {
    console.log('getPropouse', route.params.dataTender.id)
    // try {
    //   let arrPropouse = []
    //   // let tendersId = []
    //   await firestore().collection('messages')
    //     // .where('createdAt', '>' , timest)
    //     .where('routeId', '==' , route.params.dataTender.id)
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('querySnapshot messages', querySnapshot.size)
    //       if(querySnapshot.size > 0 ) {
    //         querySnapshot.forEach((documentSnapshot)=>{
    //           console.log('documentSnapshot id', documentSnapshot.id)
    //           arrPropouse.push(documentSnapshot.data())
    //           // tendersId.push(documentSnapshot.data().tenderId)
    //         })
    //       }
    //     }).catch((error) => {
    //       console.log('error', error)
    //     })
    //     // console.log('arrPropouse', arrPropouse)
        
    //     let tenders = await Promise.all(arrPropouse.map(elem => getTender(elem)))
    //     // console.log('arrPropouse', arrPropouse)

    //     let filteredTenders = tenders.filter(elem => elem.tender !== null)
    //     // console.log('tenders', tenders)
    //     // let sortArr = filteredTenders?.length > 0 ? filteredTenders.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []

    //     //все сообщения мне и от меня
    //     let uniqueUid = []
    //     let messagesArr = []
    //     let arrOfUid = []
    //     let msgOfferFromClient = []
    //     await firestore().collection('messages')
    //     .where('userId', '==' , uid) 
    //     .where('userRole', '==' , 'driver')
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('querySnapshot getChatTender', querySnapshot.size)
    //       if(querySnapshot.size > 0 ) {
    //         querySnapshot.forEach(documentSnapshot => {
    //           // console.log('documentSnapshot', documentSnapshot.data())
    //           // arrOfUid.push(documentSnapshot.data().tenderId)
    //           messagesArr.push(documentSnapshot.data())
    //         })
    //       }
    //     })

    //     // получить сообщения для меня, в том числе сообщения предложения от клиента
    //     let arrOfMsg = []
    //     await firestore().collection('messages')
    //     // .where('createdAt', '>' , timestMonth)
    //     .where('partnerId', '==' , uid) 
    //     .where('partnerRole', '==' , 'driver')
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('MSG to Driver querySnapshot.size', querySnapshot.size)

    //       if(querySnapshot.size > 0) {
    //         querySnapshot.forEach(documentSnapshot => {
    //           // console.log('documentSnapshot', documentSnapshot.data())
    //           // documentSnapshot.data().textSystem!=='systemMsg15978461238' ? arrofMsgDriver.push(documentSnapshot.data()) : null
    //           // arrofMsgDriver.push(documentSnapshot.data())

    //           arrOfMsg.push(documentSnapshot.data())
    //           // console.log('MSG', documentSnapshot.data())
    //           if(documentSnapshot.data().typeMsg === 'offerFromClient') {
    //             msgOfferFromClient.push(documentSnapshot.data())
    //             arrOfUid.push(documentSnapshot.data().tenderId)
    //           }
    //         })
    //       }
    //       // console.log('arrofMsgDriver', arrofMsgDriver)
    //     }).catch(error => console.log('arrOfMsg catch error', error))
    //     // console.log('arrOfMsg', arrOfMsg)
        
    //     //получение ствок по заявкам
    //     let arrOfTenders = filteredTenders.slice()
    //     // console.log('arrOfTenders', arrOfTenders)
    //     let arrOfReply = []
    //     if(arrOfTenders?.length > 0) {
    //       arrOfReply = await new Promise.all(
    //         //если нет ставок то надо другой код - внутри фун-ии ставок проверять и возвращать объект
    //         arrOfTenders.map(async(item)=> {
    //           let allRepl = await getReply(item.tender.id,uid)
    //           // console.log('allRepl', allRepl)
    //           return allRepl
    //       }))
          
    //     }
    //     // console.log('arrOfReply', arrOfReply)

    //     let arrOfReplyCheck = arrOfReply.filter((elem) => !!elem)
    //     // console.log('arrOfReplyCheck', arrOfReplyCheck)

    //     // console.log('1', filteredTenders);
    //     let newArr = filteredTenders.map((item,index)=> {
    //       // console.log('arrTender item', item)
    //       let repl = arrOfReplyCheck?.length > 0 ? arrOfReplyCheck.find((elem)=> {
    //         // console.log('elem.data.tenderId', elem.data.tenderId, 'item.tender.id', item.tender.id)
    //          if(elem.data.tenderId===item.tender.id) {
    //           return elem
    //          } else return null
    //       }) : null
    //       // console.log('repl obj', repl)
  
    //       //сообщения от меня клиенту 
    //       let arrMyMessages = messagesArr.filter((elemfl) => elemfl.tenderId === item.tender.id)
    //       // console.log('arrMyMessages', arrMyMessages)
  
    //       //arrOfMsg - сообщ для меня по этой заявке
    //       let arrMessages = arrOfMsg.filter((elemfl) => elemfl.tenderId === item.tender.id)
    //       // console.log('arrMessages', arrMessages)
          
    //       //сообщения- предложения от клиента мне по этой заявке
    //       let propouseMsg = item.msgPropouse //.find(elempr => elempr.tenderId === item.tender.id)
    //       // console.log('propouseMsg', propouseMsg)
  
    //       let unReadMsg = arrMessages.filter((elemunr) => elemunr.read===false)
    //       // console.log('unReadMsg', unReadMsg)

    //       //messagesArr -сообщения от меня по этой заявке - если есть не прочитанные то серые галки
    //       let myUnreadMsg = messagesArr.filter((elemunr) => elemunr.read===false && item.tender.id===elemunr.tenderId)
    //       // console.log('myUnreadMsg', myUnreadMsg)
  
    //       // let rating = getUserRatingInfo(item.data.userId).then(res => console.log('res', res))
    //       let rating = item.tender.data?.rating
    //       // console.log('rating', rating)
  
    //       let date
    //       if(unReadMsg!==undefined && unReadMsg && unReadMsg?.length>0) {
    //         date = getLastData(unReadMsg)
    //       } else if( arrMessages!==undefined && arrMessages && arrMessages?.length> 0) {
    //         date = getLastData(arrMessages)
    //       } else if(arrMyMessages!==undefined && arrMyMessages && arrMyMessages?.length> 0) {
    //         date = getLastData(arrMyMessages)
    //       } else if(propouseMsg!==undefined) {
    //         date = getLastData([propouseMsg])
    //       }
    //       // console.log('date', date)
  
    //       let obj = {
    //         data: item.tender,
    //         repl: repl!==undefined ? repl : null,
    //         myUnreadMsg: myUnreadMsg, 
    //         // messages: arrMessages,
    //         unReadMsg: unReadMsg,
    //         dateMsg: date.formattedDate,
    //         dateMls: date.dateMls,
    //         rating: rating,
    //       }
    //       // на один тендер одинчат
    //       // console.log('obj', obj)
    //       return obj
    //     })
    //     // console.log('newArr', newArr)
    //     setPropouses(newArr)
    //     let coordsArr = newArr.map(elem => {return {coords: elem.data.data.startPoints[0].coords, nameTender: elem.data.data.name}})
    //     console.log('coordsArr', coordsArr)
    //     setCoordsFirstPointOfTenders(coordsArr)
      
    // } catch (error) {
    //   console.log('error', error)
    // }

  }
  //!!1 чат
  const getUsersInfo = async(offerItem) => {
    //fferItem {"routeId": 27, "tenderId": 115}
    // запрос инфы по заявке - и формировать объект для чата 
    //вернуть объект или нулл

    const response = await get(`tenders/${offerItem.tenderId}/replies/drivers/${userProfileInfo.id}`)
    if (!response.success) {
      // console.warn('Ошибка запроса:', response.error);
      // alert(response.error);
      return null;
      
    }
    const responsetender = await get(`tenders/${offerItem.tenderId}`)
    if (!responsetender.success) {
      // console.warn('Ошибка запроса:', response.error);
      // alert(response.error);
      return null;
      
    }
    // console.log('responsetender', JSON.stringify(response.data,null,2))

    const tender = {} // запрос заявки
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
    
    userMsgArr.forEach(elemmsg => {
      // console.log('userFormsInfo.profile.id', userFormsInfo.profile.id)
      if(elemmsg.tenderId !== responsetender.data.id) return
      if(elemmsg.read===false && elemmsg.partnerId !== userFormsInfo.profile.id ) myUnreadMsg.push(elemmsg) 
      if(elemmsg.read === false && elemmsg.partnerId === userFormsInfo.profile.id ) unReadMsg.push(elemmsg)
    })
            
    const formatData = userMsgArr.length > 0 ? parseDateTimeObj(userMsgArr[userMsgArr.length-1]?.createdAt) : {dateMsg: null,dateMls: null}
    // console.log('formatData', formatData)
            
    let obj = {
      data: responsetender.data,
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
    return obj
    // console.log('obj', obj)
    // console.log('obj', JSON.stringify(obj,null,2))
    
          
  }
  //!!все чаты
  const getChats = async() => {
    try {
      const arrTenderId = userFormsActivities.driverRoutesOffers.filter(elem => elem.routeId === tenderState.id)
      // console.log('arrTenderId', arrTenderId)
      // console.log('userFormsHiddenTenders.hiddenTenders', userFormsHiddenTenders.hiddenTenders)
      const arrTenderCheck = arrTenderId.filter(elem => {
        // console.log('elem', elem)
        let hidAndDelArr = userFormsHiddenTenders.hiddenTenders.concat(driverDeleteTenders)
        if(!hidAndDelArr.includes(elem.tenderId)) return elem
      })
      if(arrTenderId?.length === 0) return


      const result = await Promise.all(arrTenderCheck.map(elem => getUsersInfo(elem)))
      // console.log('result', result)
      let check = result.filter(elem => !!elem )
      // console.log('check', check)
      setPropouses(check)
    } catch (error) {
        console.log('error', error)
    }
  }

  const handleChangeArchivedRoute = async(flag) => {
    setIsLoading(true)

    try {
      let obj = flag === 'del' ? {'archived': true} : {'archived': false}

      const response = await put(`routes/${tenderState.id}`,obj)
      
      if (!response.success) {
        console.warn('Ошибка запроса:', response.error);
        //
        setIsLoading(false)
        setIsShowAskDel(false)
        alert(response.error);
        return;
      }
      setIsShowAskDel(false)
      setIsLoading(false)
      navigation.goBack()

      // await firestore().collection('routes')
      //   .doc(route.params.dataTender.id).update(obj)
      //   .then(() => {
      //     console.log('successfully!')
      //     // console.log('res', res)
      //     setIsLoading(false)
      //     navigation.navigate('Routes')
      //   }).catch((errorfb)=>{console.log('errorfb', errorfb,)})
      
    } catch (error) {
      console.log('error', error)
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    dispatch(setDataRoute(route?.params.dataTender))
    navigation.navigate('EditRoute',{dataTender: route.params.dataTender})
  }

  const handleRestore = (flag) => {
    console.log('handleRestore', )
    if(askDataObj?.name === 'askRestoreEditRoute') {
       //отправлять на редактирование
      handleEdit()
    } else if(askDataObj?.name === 'askRestoreRoute') {
      //восстаноавливать
      handleChangeArchivedRoute('res')
    }
    setIsShowAskRestore(false)
  }
  
  const handleCheckRestore = () => {
    console.log('handleCheckRestore', )
    // setIsShowAskRestore(true)
    let check = checkDateOfTender(tenderState?.startPoints) //false - нет даты больше либо равной сегодняшней
    console.log('check', check)
    if(check=== true) {
      //восстаноавливать
      let objRt = findJsonObj(jsonDataPrompt,'askRestoreRoute',askRestoreRoute)
      setAskDataObj(objRt)
      //открывать модалку восстанавливать /нет
      setIsShowAskRestore(true)
    } else if(check=== false) {
      let objRt = findJsonObj(jsonDataPrompt,'askRestoreEditRoute',askRestoreEditRoute)
      setAskDataObj(objRt)
      setIsShowAskRestore(true)
      //отправлять на редактирование
      //открывать модалку редактировать /нет
    }
    // проверять точки загрузки - если нет даті больше сегодняшней то отправлять на редактирование
    //иначе открывать восстановление модалку
  }
  // map
  const handlerShowMap = () => {
    setIsVisibleModalAsk(!isVisibleModalAsk)
  }

  const handleBack = () => {
    // navigation.goBack()
    navigation.navigate('Routes')
  }

  const handleShowProfile = (item) => {
    setUserProfileState(item)
    setIsVisibleProfile(true)
  }
  

  const ChatItem = ({prop, flag}) => {
    // console.log('CL ChatItem prop', prop)
    // {
    //   "data": {
    //     "data": {"archived": false, "avatar": null, "createdAt": [FirestoreTimestamp], "description": "", 
    //     "driverId": null, "endPoints": [Array], "finishedAt": null, "isEdit": null, 
    //     "name": "Test003-34", "orderStartedAt": null, "price": 22, "rating": 4.5, "replyId": null, 
    //     "route": [Object], "size": 4, "startPoints": [Array], "status": "create", "statusMsg": "", 
    //     "userId": "18FqxCrZDyelhOSBkGtHXWoYmGv1", "userName": "Ann", "usersIdWithBet": [Array], 
    //     "usersIdWithChat": [Array]}, 
    //     "id": "osad88zvJ1gERPRlaDrl"
    //   },
    //   "dateMls": 1713340993772, 
    //   "dateMsg": "17.04.2024",
    //   "myUnreadMsg": [], 
    //   "rating": 4.5, 
    //   "repl": [], 
    //   "unReadMsg": 
    //     [{"_id": "ec86ef2f-3bb6-4ddc-bab6-236518f7f983", "createdAt": [FirestoreTimestamp], "driverAvatar": null, 
    //     "id": null, "partnerId": "FuliDRDN57XK7uRrMTzt287ynGv1", "partnerRole": "driver", "priceBet": 22, 
    //     "rating": 4.5, "read": false, "replyId": null, "routeId": "nNOI9XvU8PYlnFxwwNYJ", "sizeOfTenders": 4, 
    //     "system": true, "tenderId": "osad88zvJ1gERPRlaDrl", "textSystem": "systemMsg15978461238", "typeMsg": 
    //     "offerFromClient", "userId": "18FqxCrZDyelhOSBkGtHXWoYmGv1", "userName": "Test user11", "userRole": "client"}]
    // }
    //todo - сделать объект как и в заявках с userInfo и открытие профиля передавать userInfo
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
    // const data = prop.data.data
    // // console.log('data', data)
    // const repl = prop.repl!==null && prop.repl!==undefined? prop.repl: null
    // let counter = prop.unReadMsg?.length
    // let dataMsg = prop?.dateMsg
    // let myUnreadMsg = prop?.myUnreadMsg

    // let statusBet = 'base'
    // let avatar = data?.avatar
    // let userName = data?.userName
    // // console.log('avatar', avatar, 'userName', userName)

    // if(repl!==null) {
    //   if((repl.data.clientBetStatus==='accept'||repl.data.driverBetStatus==='accept')) {
    //     statusBet = 'accept'
    //   } else if (role ==='driver'&&repl.data.driverBetStatus==='wait') {
    //     statusBet = 'base'
    //   } else if (role ==='client'&&repl.data.clientBetStatus==='wait') {
    //     statusBet = 'base'
    //   } else {
    //     statusBet = 'wait'
    //   }
    // }

    // const data = prop.data
    // console.log('data', data)

    // let counter = prop.unReadMsg?.length
    // // let dataMsg = prop?.dateMsg
    // // let  currentDateState = prop.msgPropouse.createdAt
    
    // // let dataMsg = formatDate(prop?.msgPropouse?.createdAt)
    // let myUnreadMsg = prop.myUnreadMsg
    // let statusBet = 'base'
    // // let avatar = data?.avatar //аватар из заявки
    // // console.log('avatar', avatar, 'userName', userName)

    // if(data !== null ) {
    //   if((data.clientBetStatus==='accept'||data.driverBetStatus==='accept')) {
    //     statusBet = 'accept'
    //   } else if (role ==='client' && data.clientBetStatus==='wait') {
    //     statusBet = 'base'
    //   } else {
    //     statusBet = 'wait'
    //   }
    // }
    // console.log('statusBet ', statusBet, repl)
    

    return (
      <View 
        style={[mainstyles.mrChats]} 
      >
        <View style={[styles.row,[styles.wrapper,mainstyles.shadowG5r5]]}>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.imgContainer} onPress={()=>handleShowProfile()}>
            {
              avatar!==null && avatar?.length > 0 ?
                <View style={{width:60,height:60}}>
                  <Image source={{uri: avatar }} style={styles.img}/>
                  <View style={[styles.starContainer]}>
                    <Text style={[mainstyles.text10R,styles.starText]}>{prop?.userInfo.rating}</Text>
                    <IconStarSmallFill color={THEME.YELLOW}/>
                  </View>
                </View>
                :
                <View style={{width:60,height:60,}}>
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
            <TouchableOpacity activeOpacity={0.9} 
              style={styles.innerItem}
              onPress={() => handleOpenChat(prop)}
            >
              <View style={[styles.content,{justifyContent: 'space-between'}]}>
                <Text style={[mainstyles.text14R,{color: THEME.GREY800,}]}>{userName}</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[mainstyles.text14R,{color: THEME.GREY800,}]}>{data.name}</Text>
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
                        myUnreadMsg&&myUnreadMsg?.length>0?
                        <IconDblCheck />
                        :
                        <IconDblCheck color={THEME.GREY300}/>
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

  useEffect(() => {
    //заявка контент
    const onTenderState = async () => {
      // console.log('text', variable)
      // let tenderData = {}
      // if(route.params?.from === 'chat') {

      //   tenderData = await getTenderState(route.params.dataTender.id)
      // } else {
        
      // }
      const tenderData = route.params.dataTender
      // const tenderId = route.params.dataTender.id
      // console.log('tenderData \n', tenderData);
      // console.log('tenderId \n', tenderId);

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
      setTenderState(tenderData)
    }  
    onTenderState()
    // return () => onTenderState()
  },[route])

  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect START: \n', 'START GET useFocusEffect getPropouse');
      console.log('START GET useFocusEffect getChats', )
      if(tenderState!==null) {
        getChats()
      }
    }, [tenderState,informerRoutesState])
  )
  


  console.log('____render TIS____', )

  return (
    <View style={styles.container}>
      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{height: height, minHeight: height,zIndex: 99999}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isVisibleProfile && tenderState!==null ?
        <View style={[mainstyles.containerModalGgBl,{ height: height, minHeight: height,zIndex: 99999}]}>
          <ProfileInfo role={role} userInfo={userProfileState} type={'route'} onClose={()=>{setIsVisibleProfile(false)}}/>
        </View>
        :null
      }
      {
        isShowAskDel ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
          <InfoAskWindow data={findJsonObj(jsonDataPrompt,'askDelRoute',askDelRoute)} onPress={()=>{handleChangeArchivedRoute('del')}} onClose={()=>setIsShowAskDel(false)}/>
        </View>
        : null
      }
      {
        isShowAskRestore && askDataObj!==null ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 999}]}>
          <InfoAskWindow data={askDataObj} onPress={()=>handleRestore()} onClose={()=>setIsShowAskRestore(false)}/>
        </View>
        : null
      }
      { 
        tenderState!==null ?
          <ScrollView style={{paddingBottom: 20}}>
            {
              showPointsDatail ?
              <View>
                <ListPointSlider 
                  data={tenderState}
                  isRoutes={true}
                  topBtnPosition={safeInsets.top+60}
                  mapViewRef={mapViewRef} customStyles={{height:height/2.8}} cusStMap={{ minHeight: height/2.8}}
                  onClose={()=>setShowPointsDatail(false)}
                />
              </View>
              :
              <View style={{}}>
                <LinearGradient style={[styles.headerStyles,mainstyles.rowalCjcSb,{width: '100%',paddingVertical: 10,paddingTop: safeInsets.top}]} colors={['rgba(255,255,255,1)','rgba(255,255,255,0)']} useAngle angle={180}>
                  
                  <View style={{width: '40%',}}>
                    <BtnIconTrs onPress={handleBack} customStyles={{width: '40%',paddingLeft: 10, backgroundColor: 'transparent',alignItems: 'flex-start'}}>
                      <BackArrow />
                    </BtnIconTrs>
                  </View>
                  <View style={[mainstyles.rowalCjcSb,{width: '60%',backgroundColor: 'transparent'}]}>
                  
                  <TouchableOpacity onPress={handleEdit} style={[tenderState.archived === false ? {width: '60%',}: {},{ alignItems: 'center',backgroundColor: 'transparent', paddingVertical: 5}]}>
                    <View style={[mainstyles.rowalC,{}]}>
                      <IconEdit color={THEME.PRIMARY} size={18}/>
                      <Text style={[mainstyles.text12R,styles.textHeader]}>Редактировать</Text>
                    </View>
                  </TouchableOpacity>
                  {
                    tenderState.archived === true ? 
                    <TouchableOpacity onPress={handleCheckRestore} style={[{alignItems: 'center',backgroundColor: 'transparent',paddingRight:10}]}>
                      <View style={[mainstyles.rowalC,{}]}>
                        <IconTrash  color={THEME.GREY400}/>
                        <Text style={[mainstyles.text12R,styles.textHeader]}>Восстановить</Text>
                      </View>
                    </TouchableOpacity>
                    :
                      <TouchableOpacity onPress={()=>setIsShowAskDel(true)} style={[{width: '40%',alignItems: 'center',backgroundColor: 'transparent'}]}>
                        <View style={[mainstyles.rowalC,{}]}>
                          <IconTrash  color={THEME.GREY400}/>
                          <Text style={[mainstyles.text12R,styles.textHeader]}>Удалить</Text>
                        </View>
                    </TouchableOpacity>
                  }
                  </View>

                </LinearGradient>

                <TenderMapDriver 
                  mapViewRef={mapViewRef} 
                  customStyles={{height:height/2}} 
                  cusStMap={{ minHeight: height/2}}
                  topBtnPosition={safeInsets.top+55}
                  coordinatesArr={coordinates}
                  coordinatesFrom={coordinatesFrom}
                  coordinatesTo={coordinatesTo}
                  isRouteVisible={true}
                  arrOfTenderFirstPoints={coordsFirstPointOfTenders}
                />

                <View style={{paddingTop: 10,paddingHorizontal: 10,paddingBottom: 15}}>
                  <View style={[mainstyles.rowalCjcSb, {paddingBottom:20}]}>
                    <Text style={[mainstyles.text16M,styles.textColorD,]}>{tenderState.name}</Text>
                  </View>
                  <TouchableOpacity style={[mainstyles.botLineGr,{}]} onPress={()=>setShowPointsDatail(true)}>
                    <AddressPointsView type={'start'} data={tenderState.startPoints} length={tenderState.startPoints.length} disable={true} />
                    <AddressPointsView type={'end'} data={tenderState.endPoints} length={tenderState.endPoints.length} disable={true} />
                  </TouchableOpacity>
                </View>
                {
                  tenderState?.route?.distance!==undefined?
                  <View style={{paddingHorizontal: 10,paddingBottom: 10}}>
                    <Text style={[mainstyles.text14R,styles.textColorD]}>Расстояние: {tenderState.route.distance} км.</Text>
                  </View>
                  :null
                }

                <View style={[{marginTop: 20,paddingHorizontal: 10,paddingVertical: 10,backgroundColor: '#f5f5f5'}]}>
                  <Text style={[mainstyles.text14R,styles.textColorD,]}>Предложения по маршруту</Text>
                </View>
                

                <FlatList
                  style={{paddingVertical: 15, backgroundColor: 'transparent'}}
                  data={propouses}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index+'tnd'}
                />
              </View>

            }

            <Modal
              visible={isVisibleModalAsk}
              transparent={true}
              animationType={'fade'}
            >
              <OpenGoogleMaps openGM={()=>openGM(coordinates,handlerShowMap)} onClose={handlerShowMap}/>
            </Modal>
          </ScrollView>
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
    // backgroundColor: 'blue',
    // paddingBottom: 65,
    
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
    top: -22, 
    right: 10, 
    width: 126,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    elevation: 7,
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
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    // padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.GREY100,
    borderColor: '#fff',
    borderWidth: 1,
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
  imgContainer: {
    // backgroundColor: 'lightblue',
    width: '20%',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  innerItem: {
    // backgroundColor: 'pink',
    paddingVertical: 10,
    width: '80%',
    paddingRight: 10,
    flexDirection: 'row',
  },
  content: {
    // backgroundColor: 'yellow',
    width: '75%',
    paddingHorizontal: 10,
    
  },
  priceContainer: {
    // backgroundColor: 'red',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMsgCounter: {
    color: '#fff'
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
});