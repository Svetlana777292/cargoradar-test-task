import React, { useEffect, useState} from 'react';
import { StatusBar, Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, LogBox, Image, BackHandler,} from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//components
import TopTabBarText from '../../components/TopTabBarText';
import IconDblCheck from '../../components/Svg/IconDblCheck';
import IconStarSmallF from '../../components/Svg/IconStarSmallF';
import IconTrash from '../../components/Svg/IconTrash';
import IconCheck from '../../components/Svg/IconCheck';
import IconDocDel from '../../components/Svg/IconDocDel';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import IconDocRecover from '../../components/Svg/IconDocRecover';
import { ProfileInfo } from '../../components/Profile/ProfileInfo';
import IconStarSmallFill from '../../components/Svg/IconStarSmallFill';

//functions && features && slice
import { findJsonObj, unique } from '../../util/tools';
import { getBlackList, getTenderHidden, getTenderHiddenClient } from '../../util/firebase';
import { timestMonth } from '../../util/const';
import { auctionPopup, height, titleChat } from '../../util/helperConst';
import { userProfileBlackList, userProfileTenderHidden, userProfileTenderHiddenClient } from '../../store/features/userSlice';
import { setFirstOpenChats, setListOfChats, setListOfChatsHidden } from '../../store/features/listOfChatsSlice';
import { removeDuplicates } from '../../util/FiltersAndSorts/FiltersAndSorts';
import { addMsg, firebeseUpdateTender } from '../../util/tenders';
import { messageIdGenerator } from '../../util/msgGenerator';

//styles
import {THEME, SIZE, mainstyles} from '../../theme'
import { normalize } from '../../util/UI/fontsUI';


export const ChatsListScreen = ({route, navigation}) => {

  // console.log('ChatsListScreen CLS', navigation.getState())
  const safeInsets = useSafeAreaInsets();
  const role = useSelector(state => state.login.role)
  // const tnReply = useSelector(state => state.user.tenderRplInfo)
  const tenderDel = useSelector((state) => state.user.tenderDelete)
  const hiddenTender = useSelector((state) => state.user.hiddenTender)
  const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient)
  const blacklist = useSelector((state) => state.user.blacklist)
  // const stateOfMsg = useSelector((state) => state.chats.msgState)
  const stateOfInformers = useSelector((state) => state.chats)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const listOfChats = useSelector(state=>state.listofchats.listOfChats)
  const listOfChatsHidden = useSelector(state=>state.listofchats.listOfChatsHidden)
  const firstOpenChats = useSelector(state=>state.listofchats.firstOpenChats)
  const arrayOfHiddenTenders = useSelector(state=>state.listofchats.arrHidTend)
  // console.log('!!!listOfChats', listOfChats)
  // console.log('!!!firstOpenChats', firstOpenChats)
  //actual
  const [isLoading, setIsLoading] = useState(false)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)
  const [isVisibleAskHideChat, setIsVisibleAskHideChat] = useState(false)
  const [isActiveTab, setIsActiveTab] = useState(0)
  const [isVisibleSettings, setIsVisibleSettings] = useState(false)
  const [choseChatsArr, setChoseChatsArr] = useState([])
  const [choseChatsArrHidden, setChoseChatsArrHidden] = useState([])
  const [arrFromDelTender, setArrFromDelTender] = useState([])
  const [userProfileState, setUserProfileState] = useState(null)
  const [unreadMsg, setUnreadMsg] = useState([])

  // console.log('choseChatsArr State', choseChatsArr)
  // console.log('choseChatsArrHidden State', choseChatsArrHidden)
  // console.log('hiddenTenderClient State', hiddenTenderClient)
  // console.log('!!!New msg stateOfMsg', stateOfMsg)
  // console.log('hiddenTender State', hiddenTender)
  // console.log('arrayOfHiddenTenders State', arrayOfHiddenTenders)
  // console.log('blacklist State', blacklist)
  
  // console.log('tnReply:', tnReply)
  // console.log('msgState', msgState)
  // const driverReplies = useSelector(state => state.tender.userReplies)
  // const msgState = useSelector(state => state.notification.msgState)
  // const [dataTenders, setDataTenders] = useState([])
  // const [dataTendersHidden, setDataTendersHidden] = useState([])
  // const [roleStateScreen, setRoleStateScreen] = useState(null)
  // const [dataTn, setDataTn] = useState([])
  // const [dataRepl, setDataRepl] = useState([])
  // const [dataTendersInfo, setDataTendersInfo] = useState([])
  // const [idTenders, seIdTenders] = useState([])
  // const [msgUsersForTender, setMsgUsersForTender] = useState([])
  // const [arrToCheckMsg, setArrToCheckMsg] = useState([])
  // const [cancelBetMsg, setCancelBetMsg] = useState([])
  // console.log('------------------roleStateScreen-------------', roleStateScreen)
  // const [dataTenders, setDataTenders] = useState(testDataChat)
  

  const uid = '2'//auth().currentUser.uid

  const dispatch = useDispatch()

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

  const handleCloseSettings =()=>{
    setIsVisibleSettings(false)
    setChoseChatsArr([])
    setChoseChatsArrHidden([])
    setArrFromDelTender([])
  }

  const handleOnPressTopTab = (item) => {
    console.log('item', item)
    if(item===isActiveTab) return;
    switch (item) {
      case 0:
        setIsActiveTab(0)
        setChoseChatsArrHidden([])
        setArrFromDelTender([])
        setIsVisibleSettings(false)
        break;
      case 1:
        setIsActiveTab(1)
        setChoseChatsArr([])
        setArrFromDelTender([])
        setIsVisibleSettings(false)
        break;
        
      default:
        setIsActiveTab(0)
        setIsVisibleSettings(false)
        break;
    }
  }
  
  const handlePress = async(item) => {
    console.log('handlePress', )
    if(role==='driver') {
      // console.log('text', item)
      navigation.navigate('Chat',{item: item.data, from: 'list'})
      
    } else {
      
      navigation.navigate('Chat',{item: item.data, userInfo: item.userInfo, from: 'list'})
    }
  }

  //2 получение заявок
  const getDataTender = async(uniqueUid,driverUid) => {
    // // console.log('getDataTender start', uniqueUid)
    // // setIsLoading(true)
    // if(role == 'driver') {
    //   // console.log('getDataTender driver role', role)
    //   try {
    //     let arrOfData = []
    //     await firestore().collection('tenders')
    //     // .where('createdAt', '>', timestMonth)
    //     .get()
    //     .then(querySnapshot => {
    //       // console.log('querySnapshot getDataTender', querySnapshot.size)
          
    //       querySnapshot.forEach(documentSnapshot => {
    //         if(uniqueUid.includes(documentSnapshot.id)) {
    //           // console.log('documentSnapshot', documentSnapshot.id)
    //           //проверть в блек листе нет ли этой ID

    //           if(tenderDel!== null && tenderDel!== undefined&&tenderDel.includes(documentSnapshot.id)) {
    //             // console.log('tenderDel', tenderDel)
    //           } else {                  
    //             let data = documentSnapshot.data()
    //             let id = documentSnapshot.id

    //             arrOfData.push({
    //               data: data,
    //               id: id,
    //             })
    //           }
    //         }
    //       })
    //       // console.log('getDataTender arrOfData', arrOfData)
    //     })
    //     // console.log('arrOfData', arrOfData)
    //     return arrOfData
    //   } catch (error) {
    //     console.log('getDataTender driver error ', error)
    //   }

    // } else if (role == 'client') {
    //   try {
    //     let arrOfDataCl = []
    //     await firestore().collection('tenders')
    //     .where('userId', '==', uid)
    //     // .where('createdAt', '>', timestMonth)
    //     .get()
    //     .then(querySnapshot => {
    //       console.log('querySnapshot getDataTender', querySnapshot.size)
          
    //       querySnapshot.forEach(documentSnapshot => {

    //         //для одиночных чатов - проверять что бы заявка была в массиве сообщений
    //         if(uniqueUid.includes(documentSnapshot.id)) {

    //           arrOfDataCl.push({
    //             data: documentSnapshot.data(),
    //             id: documentSnapshot.id,
    //           })
    //         }
    //       })
    //       // console.log('arrOfDataUsers', arrOfDataUsers)
    //     })
    //     // console.log('arrOfDataCl', arrOfDataCl)
    //     return  arrOfDataCl
        
    //   } catch (error) {
    //     console.log('getDataTender client error ', error)
    //   }
    // }
  }  
  
  const getReply = async (item,uid) => {
    // if(role==='driver') {
    //   try {
    //     let replies
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
    //           // console.log('--id', documentSnapshot.data())
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
    // } else if(role==='client') {
    //   try {        
    //     let replies = null
    //     // console.log('item', item)
    //     //добавлять условие что ставки на мои заявки?
    //     await firestore().collection('replies')
    //     .doc(item)
    //     .get()
    //     .then(documentSnapshot => {
    //       // console.log(' Client documentSnapshot replies', documentSnapshot.data())
    //       // console.log('userInfo 1', userInfo)
    //       if(documentSnapshot.data() !== null && documentSnapshot.data()!==undefined) {

    //         replies = {
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id,
    //         }
    //       }
    //     })
    //     // console.log('Client replies', replies?.id)
    //     return replies
        
    //   } catch (error) {
    //     console.log('getReply error', error)
    //   }
    // }
  }
  
  //1 получение сообщений
  const getChatTender = async (blacklist,hiddenTender,hiddenTenderClient) => {
    // console.log('getChatTender start')
    // setIsLoading(true)
    
    // if(role === 'driver') {
    //   let uniqueUid = []
    //   let messagesArr = []
    //   let arrOfUid = []
    //   let msgOfferFromClient = []

    //   await firestore().collection('messages')
    //   .where('userId', '==' , uid) 
    //   .where('userRole', '==' , 'driver')
    //   .get()
    //   .then(querySnapshot => {
    //     console.log('querySnapshot getChatTender', querySnapshot.size)
    //     if(querySnapshot.size > 0 ) {
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('documentSnapshot', documentSnapshot.data())
    //         arrOfUid.push(documentSnapshot.data().tenderId)
    //         messagesArr.push(documentSnapshot.data())
    //       })
    //     }
    //   })

    //   // получить сообщения для меня, в том числе сообщения предложения от клиента
    //   let arrOfMsg = []
    //   await firestore().collection('messages')
    //   .where('createdAt', '>' , timestMonth)
    //   .where('partnerId', '==' , uid) 
    //   .where('partnerRole', '==' , 'driver')
    //   .get()
    //   .then(querySnapshot => {
    //     console.log('MSG to Driver querySnapshot.size', querySnapshot.size)

    //     if(querySnapshot.size > 0) {
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('documentSnapshot', documentSnapshot.data())
    //         // documentSnapshot.data().textSystem!=='systemMsg15978461238' ? arrofMsgDriver.push(documentSnapshot.data()) : null
    //         // arrofMsgDriver.push(documentSnapshot.data())

    //         arrOfMsg.push(documentSnapshot.data())
    //         // console.log('MSG', documentSnapshot.data())
    //         if(documentSnapshot.data().typeMsg === 'offerFromClient') {
    //           msgOfferFromClient.push(documentSnapshot.data())
    //           arrOfUid.push(documentSnapshot.data().tenderId)
    //         }
    //       })
    //     } else {
    //       // return []
    //     } 
    //     // console.log('arrofMsgDriver', arrofMsgDriver)
    //     // return arrofMsgDriver
    //   }).catch(error => console.log('arrOfMsg catch error', error))
              
    //   // console.log('msgOfferFromClient', msgOfferFromClient)
    //   // console.log('arrOfMsg', arrOfMsg)

    //   uniqueUid = unique(arrOfUid)
    //   // console.log('uniqueUid', uniqueUid)

    //   //получить заявки
    //   let arrTender = await getDataTender(uniqueUid)
    
    //   // console.log('arrTender', arrTender)
    //   //заявки архивные но чат не в неактивных

    //   //получение ствок по заявкам
    //   let arrOfReply = await new Promise.all(
    //     arrTender.map(async(item)=> {
    //       let allRepl = await getReply(item.id,uid)
    //       // console.log('allRepl', allRepl)
    //       return allRepl
    //   }))
    //   // console.log('arrOfReply', arrOfReply)
    //   let arrOfReplyCheck = arrOfReply.filter((elem) => !!elem)
    //   // console.log('arrOfReplyCheck', arrOfReplyCheck)
      
    //   let newArr = arrTender.map((item,index)=> {
    //     // console.log('arrTender item id', item.id)
    //     let repl = arrOfReplyCheck.find((elem)=> {
    //       // console.log('elem.data.tenderId', elem.data.tenderId, 'item.id', item.id)
    //        if(elem.data.tenderId===item.id) {
    //         return elem
    //        } else return
    //     })
    //     // console.log('repl obj', repl)

    //     //сообщения от меня клиенту 
    //     let arrMyMessages = messagesArr.filter((elemfl) => elemfl.tenderId === item.id)

    //     //arrOfMsg - сообщ для меня по этой заявке
    //     let arrMessages = arrOfMsg.filter((elemfl) => elemfl.tenderId === item.id)
        
    //     //сообщения- предложения от клиента мне по этой заявке
    //     let propouseMsg = msgOfferFromClient.find(elempr => elempr.tenderId === item.id)
    //     // console.log('propouseMsg', propouseMsg)

    //     let unReadMsg = arrMessages.filter((elemunr) => elemunr.read===false)
    //     // console.log('arrMessages', arrMessages)
    //     // console.log('unReadMsg', unReadMsg)
    //     //messagesArr -сообщения от меня по этой заявке - если есть не прочитанные то серые галки
    //     let myUnreadMsg = messagesArr.filter((elemunr) => elemunr.read===false && item.id===elemunr.tenderId)
    //     // console.log('myUnreadMsg', myUnreadMsg)

    //     // let rating = getUserRatingInfo(item.data.userId).then(res => console.log('res', res))
    //     let rating = item.data?.rating
    //     // console.log('rating', rating)

    //     let date
    //     if(unReadMsg!==undefined && unReadMsg && unReadMsg?.length>0) {
    //       date = getLastData(unReadMsg)
    //     } else if( arrMessages!==undefined && arrMessages && arrMessages?.length> 0) {
    //       date = getLastData(arrMessages)
    //     } else if(arrMyMessages!==undefined && arrMyMessages && arrMyMessages?.length> 0) {
    //       date = getLastData(arrMyMessages)
    //     } else if(propouseMsg!==undefined) {
    //       date = getLastData([propouseMsg])
    //     }
    //     // console.log('date', date)

    //     let obj = {
    //       data: item,
    //       repl: repl!==undefined ? repl : null,
    //       myUnreadMsg: myUnreadMsg, 
    //       // messages: arrMessages,
    //       unReadMsg: unReadMsg,
    //       dateMsg: date.formattedDate,
    //       dateMls: date.dateMls,
    //       rating: rating,
    //     }
    //     // на один тендер одинчат
    //     // console.log('obj', obj.data)
    //     return obj
    //   })
      
    //   // console.log('newArr', newArr)

    //   //проверка на удаленные 
    //   // console.log('blacklist 11', blacklist)
    //   if(newArr && newArr?.length> 0) {
    //     let filterMapTendersDr = newArr.map(elem=> {
    //       let checkAr = blacklist.find(item => 
    //         item.tenderId===elem.data.id && item.userId===elem.data.data.userId
    //       //   {
    //       //   console.log('item', item, 'elem', elem,)
    //       //   console.log('elem', elem, )
    //       //   console.log('condition', item.tenderId===elem.data.id && item.userId===elem.data.data.userId )
    //       // }
    //       )
    //       // console.log('checkAr', checkAr)
    //       if(checkAr !== undefined ) {
    //         return null 
    //       } else return elem
    //     })
  
    //     let checkArrblacklist = filterMapTendersDr.filter((elem) => !!elem)
    //     // console.log('checkArrblacklist', checkArrblacklist)
  
    //     // проверка на скрытые
    //     if(hiddenTender!==null) {
  
    //       let tenderArr = []
    //       let tenderArrHid = []
    //       checkArrblacklist.forEach((elem)=> {
    //         let fltrTn = hiddenTender.find(item => item===elem.data.id)
    //         fltrTn ===undefined ? tenderArr.push(elem) : tenderArrHid.push(elem)
    //         // console.log('fltrTn', fltrTn, 'elem',elem,)      
    //       })
    //       // console.log('tenderArr', tenderArr)
    //       let sortTenderArr = tenderArr.length > 0 ? tenderArr.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
    //       let sortTenderHidArr = tenderArrHid.length > 0 ? tenderArrHid.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []

    //       dispatch(setListOfChats(sortTenderArr))
    //       dispatch(setListOfChatsHidden(sortTenderHidArr))
    //       // setDataTenders(tenderArr)
    //       // setDataTendersHidden(tenderArrHid)
    //     } else {
    //       let sortCheckArrblacklist = checkArrblacklist.length > 0 ? checkArrblacklist.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
    //       dispatch(setListOfChats(sortCheckArrblacklist))

    //       // setDataTenders(checkArrblacklist)
    //     }
    //     firstOpenChats === true ? dispatch(setFirstOpenChats(false)) : ''
    //   }
    //   setIsLoading(false)

    // } else if(role === 'client') {
    //   try {
    //     let uniqueUidTender = []
    //     let msgFromDriver = []
    //     let replyId = []
    //     let uniqueUidFromDriver = []
    //     let arrOfUid = []
    //     let arrOfUidDrivers = []
    //     let arrMsgRoute = []

    //     await firestore().collection('messages')
    //     .where('createdAt', '>' , timestMonth)
    //     .where('partnerId', '==' , uid)
    //     .where('partnerRole','==','client')
    //     .get()
    //     .then(querySnapshot => {
    //       // console.log('CLIENT querySnapshot getChatTender', querySnapshot.size)
          
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('documentSnapshot ', documentSnapshot.id)
    //         if(documentSnapshot.data().userId == uid && documentSnapshot.data().userRole == 'client') {
    //           return
    //         } else {
    //           // console.log('documentSnapshot.data():', documentSnapshot.data())
    //           arrOfUid.push(documentSnapshot.data().tenderId)
    //           arrOfUidDrivers.push({userId: documentSnapshot.data().userId, tenderId: documentSnapshot.data().tenderId,})
    //           documentSnapshot.data()?.replyId ? replyId.push(documentSnapshot.data().replyId) : null
    //           // documentSnapshot.data().textSystem !== 'systemMsg15978461238' ?  null  : null - єто сообщение когда делаешь ставку, всегда прочитаное
    //           msgFromDriver.push(documentSnapshot.data())

    //           // arrOfMsg.push({
    //           //   tender: documentSnapshot.data().tenderId,
    //           //   user: documentSnapshot.data().userId
    //           // })
    //         }
    //       })
          
    //       // console.log('replyId - айди ставок из системного сообщение', replyId)
    //       // console.log('uniqueUidTender - уникальные айди заявок', uniqueUidTender)
    //       // console.log('uniqueUidFromDriver - уникальные айди водиетелей и заявок', uniqueUidFromDriver)
          
    //     }).catch(error => console.log('getChatTender client messages error', error))
        

    //     //когда есть предложения по маршрутам - искать собщения свои с типом сообщения offerFromClient и добавлять айди 
    //     await firestore().collection('messages')
    //     .where('createdAt', '>' , timestMonth)
    //     .where('userId', '==' , uid)
    //     .where('typeMsg', '==' , 'offerFromClient')
    //     .get()
    //     .then(querySnapshot => {
    //       // console.log('querySnapshot offerFromClient', querySnapshot.size)
          
    //       if(querySnapshot.size > 0 ) {

    //         querySnapshot.forEach(documentSnapshot => {
    //           arrOfUid.push(documentSnapshot.data().tenderId)
    //           arrOfUidDrivers.push({userId: documentSnapshot.data().partnerId, tenderId: documentSnapshot.data().tenderId,})
    //         })
    //       }
    //     })

    //     uniqueUidTender = unique(arrOfUid)
    //     uniqueUidFromDriver = filterUniqueElements(arrOfUidDrivers)

    //     // console.log('Client uniqueUidTender - уникальные айди заявок', uniqueUidTender)
    //     // console.log('Client uniqueUidFromDriver - уникальные айди водиетелей и заявок', uniqueUidFromDriver)
    //     // console.log('\x1b[42m%s %s\x1b[0m', 'Client uniqueUidFromDriver', uniqueUidFromDriver);

    //     //получаем заявки по айди из uniqueUidTender
    //     let arrTender = await getDataTender(uniqueUidTender) //на одну заявку может быть несколько ставок от водителей
    //     // console.log('Client !!!!!arrTender', arrTender)

    //     //получение массива ставок по айди ставок
    //     let arrOfReply = await new Promise.all(
    //       replyId.map(async(item)=> {
    //         let allRepl = await getReply(item)
    //         // console.log('allRepl', allRepl)
    //         return allRepl
    //     }))
    //     //отфильтрованый массив ставок
    //     // console.log('!!!arrOfReply', arrOfReply)
    //     let arrOfReplyCheckCl = arrOfReply.filter((elem) => !!elem)
    //     // console.log('Client arrOfReplyCheckCl', arrOfReplyCheckCl.length)


    //     let messagesArr = []
    //     await firestore().collection('messages')
    //     .where('userId', '==' , uid) 
    //     .where('userRole', '==' , 'client')
    //     .get()
    //     .then(querySnapshot => {
    //       // console.log('querySnapshot getChatTender', querySnapshot.size)    
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('documentSnapshot', documentSnapshot.data())
    //         querySnapshot.size > 0 ? messagesArr.push(documentSnapshot.data()) : null
    //       })
    //     })
    //     // console.log('Client ---messagesArr', messagesArr.length)

    //     let stateOfUsersChat = []
    //     let arrToAddToHid = []
    //     uniqueUidFromDriver.forEach((item, index) => {
    //       // console.log('\x1b[44m%s %s\x1b[0m', 'forEach uniqueUidFromDriver item:', item);

    //       //находим тендер
          
    //       let tenData = arrTender.find((elemtn) => {
    //         // console.log('compare', elemtn.id,item.tenderId,elemtn.id === item.tenderId)
    //         if(elemtn.id === item.tenderId) {
    //           // console.log('elemtn', elemtn)
    //           return elemtn
    //         }
    //        })
    //       // console.log('tenData', tenData)

    //       //!! проверка на архив var2
    //       //для клиента
    //       //проверять еть ли этот айди в стейте заявки (usersIdWithChat)
    //       //если есть ничего не делаем
    //       //проверять еcть ли этот айди в стейте заявки (usersIdWithBet)
    //       //если есть ничего не делаем
    //       //проверять есть ли этот юзер в неактивных hiddenTenderClient(userId && tenderId) - зачем?
    //       //если есть ничего не делаем
    //       //если нету - значит нужно добавлять его айди в поле usersIdWithChat
    //       //таким образом получаем в заявке айди всех юзеров с перепиской
    //       //и при завершении заявки или уходе в архив по времени юзеры из usersIdWithChat добавляются в неактивные у клиента и у водителя
    //       //так как архив в заявке проставляется клиентом 
    //       let inArrBet = tenData.data?.usersIdWithBet?.includes(item.userId)
    //       if(!inArrBet) {
    //         let inArrChats = tenData.data?.usersIdWithChat?.includes(item.userId)
    //         if(!inArrChats) {
    //           //добавлять в это поле
    //           firebeseUpdateTender(tenData.id,{usersIdWithChat: firestore.FieldValue.arrayUnion(item.userId)})
    //         }
    //       }
          
    //       //мои соообщения пропозиция по маршруту/геолокации будут в messagesArr
    //       // let msgRoute = messagesArr.find(elemRt => elemRt.partnerId === item.userId && item.tenderId === elemRt.tenderId) 
    //       // вариант выше не учитывает то что после предложения клиент может отправить сообщение и тогда найдется сообщение последнее без аватара и имени
    //       //поэтому надо искать сообщение пропозицию
    //       let msgRoute = messagesArr.find(elemRt => elemRt.partnerId === item.userId && item.tenderId === elemRt.tenderId &&  elemRt.typeMsg==='offerFromClient')
    //       let msgRouteChanged = {}
    //       if(msgRoute!==undefined) {

    //          msgRouteChanged = {
    //           driverAvatar: msgRoute.driverAvatar,
    //           userName: msgRoute.userName,
    //           userId: msgRoute.partnerId, //для перехода в чат нужно что бы userId - был драйвер а не автор сообщения в случае сообщ пропозиции
              
    //         }
    //       }
    //       // console.log('msgRoute', msgRoute, 'msgRouteChanged', msgRouteChanged)

    //       //все сообщения не прочитаные от водителей, 
    //       let allMsg = msgFromDriver.filter((elemfilter) => elemfilter.tenderId ===item.tenderId && elemfilter.userId ===item.userId)
    //       // console.log('allMsg', allMsg)
    //       let unReadMsg = allMsg.filter((elemunr) => elemunr.read===false)
    //       // console.log('unReadMsg', unReadMsg)
    //       let userInfo = allMsg.find((elemfind) => elemfind?.textSystem ==='systemMsg15978461238')
    //       // console.log('\x1b[46m%s %s\x1b[0m', 'userInfo:', userInfo);
    //       //ставка 
    //       let tenderRepl = arrOfReplyCheckCl.find(elemrpl => elemrpl.data.tenderId ===item.tenderId && elemrpl.data.userId ===item.userId)
    //       // console.log('tenderRepl', tenderRepl)

    //       let myUnreadMsg = messagesArr.filter((elemunr) => elemunr.read===false && item.userId===elemunr.partnerId)
    //       // console.log('myUnreadMsg', myUnreadMsg)          

    //       let rating = tenderRepl !== undefined ? tenderRepl?.data?.rating : (userInfo !== undefined ? userInfo?.rating : (
    //         allMsg?.length > 0 && allMsg[0].hasOwnProperty('text') &&  allMsg[0]?.textSystem==='systemMsg15978461238' ? allMsg[0] : 
    //         (msgRoute!==undefined ? msgRoute?.rating : 4.5)
    //         ))
    //         // console.log('rating', rating)
    //       // console.log('rating', rating)
    //       // console.log('tenderRepl?.data?.rating', tenderRepl?.data?.rating)
    //       // console.log('userInfo?.rating',  userInfo?.rating)
    //       // console.log('allMsg[0]', allMsg[0])
    //       // console.log('info rating', tenderRepl !== undefined ? tenderRepl?.data?.rating : (userInfo !== undefined ? userInfo?.rating : (allMsg?.length > 0 ? allMsg[0]?.rating : 5.0)))

    //       let date = ''
    //       if(unReadMsg!==undefined && unReadMsg && unReadMsg?.length>0) {
    //         date = getLastData(unReadMsg)
    //       } else if(allMsg!==undefined && allMsg?.length > 0){
    //         date = getLastData(allMsg)            
    //       } else if (msgRoute!==undefined) {
    //         date = getLastData([msgRoute])
    //         //если клиент сделал предложение драйверу а у того нет ставок и сообщений по данной заявке
    //       }

    //       let userInfoWithRating = userInfo !== undefined ? userInfo : (
    //         allMsg?.length > 0 && allMsg[0].hasOwnProperty('text') &&  allMsg[0]?.textSystem==='systemMsg15978461238' ? allMsg[0] : msgRouteChanged
    //       )
    //       userInfoWithRating.rating = rating
    //       // console.log('\x1b[46m%s %s\x1b[0m', 'userInfoWithRating:', userInfoWithRating);

    //       let obj = {
    //         data: tenData,
    //         unReadMsg: unReadMsg,
    //         dateMsg: date.formattedDate,
    //         dateMls: date.dateMls,
    //         repl: tenderRepl !== undefined ? tenderRepl: null,
    //         userInfo: userInfoWithRating,
    //         rating: userInfoWithRating?.rating,
    //         myUnreadMsg: myUnreadMsg
    //       }
    //       // console.log('!!!obj', obj)
    //       stateOfUsersChat.push(obj)
    //     })

    //     // console.log('arrToAddToHid', arrToAddToHid)

    //     // console.log('stateOfUsersChat',stateOfUsersChat);

    //     if(stateOfUsersChat?.length> 0) {

    //       let filterMapTenders = stateOfUsersChat?.length> 0 && stateOfUsersChat.map(elem=> {
    //         // console.log('------------elem', elem.data)
    //         // console.log('----------blacklist', blacklist)
    //         let checkAr = blacklist.find(item => item.tenderId===elem.data.id && item.userId===elem.userInfo.userId)
  
    //         if(checkAr !== undefined ) {
    //           return null 
    //         } else return elem
    //       })
    //       // console.log('filterMapTenders', filterMapTenders)
          
    //       let checkArrblacklist = filterMapTenders.filter((elem) => !!elem)
    //       // console.log('checkArrblacklist', checkArrblacklist)
    //       //проверка на скрытые
  
    //       if(hiddenTenderClient!==null) {
    //         // console.log('hiddenTenderClient', hiddenTenderClient)
    //         let tenderArr = []
    //         let tenderArrHid = []
    //         checkArrblacklist.forEach((elem)=> {
    //           // console.log('elem.data.id', elem.data.id)
    //           let fltrTn = hiddenTenderClient.find(item => item.tenderId === elem.data.id && item.userId === elem.userInfo.userId)
    //           fltrTn === undefined ? tenderArr.push(elem) : tenderArrHid.push(elem)
    //           // console.log('fltrTn', fltrTn, 'elem',elem.data.id,)      
    //           // console.log('tnder length', tenderArr.length, tenderArrHid.length)
    //         })
    //         //sortOfDate
    //         let sortTenderArr = tenderArr.length > 0 ? tenderArr.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
    //         let sortTenderHidArr = tenderArrHid.length > 0 ? tenderArrHid.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []
    //         dispatch(setListOfChats(sortTenderArr))
    //         dispatch(setListOfChatsHidden(sortTenderHidArr))
    //         // setDataTenders(tenderArr)
    //         // setDataTendersHidden(tenderArrHid)
    //         //фун-я проверки чатов - если есть чат то пушить айди водителя в эту заявку - когда заявка архивная то
    //         //из этого поля берутся все айди и добавляются в неактивные
    //         //если этот айди есть в поле в заявке или в поле ставок то не пушить
    //         // console.log('sortTenderArr', sortTenderArr)

    //         // sortTenderArr.forEach

    //       } else {
    //         let sortCheckArrblacklist = checkArrblacklist.length > 0 ? checkArrblacklist.sort((a,b) => a.dateMls < b.dateMls ? 1 : -1): []

    //         dispatch(setListOfChats(sortCheckArrblacklist))
    //         // setDataTenders(checkArrblacklist)
    //       }
    //       // setDataTenders(stateOfUsersChat)
    //     }

    //   } catch (error) {
    //     console.log('try catch error', error)
    //   }
    //   firstOpenChats === true ? dispatch(setFirstOpenChats(false)) : ''
    //   setIsLoading(false)
    // }
  }
  
  //выбор чата для удаления/в скрытые
  const handleChoseChat = (item,activeTab,obj) => {
    // console.log('handleChoseChat item', item,choseChatsArr)
    
    if(activeTab===0) {
      let arr = role === 'driver' ? choseChatsArr.find(elem=>
        // console.log('!!!!!elem', elem,item)
        elem===item
      ) : choseChatsArr.find(elem=> elem.userId === item.userId && elem.tenderId === item.tenderId )
      console.log('activeTab 0 arr', arr)
      // undefined- в choseChatsArr  нет item - добавляем
      //7,11,23
      //для клиента нужна отдельная логика для скрытх - так как item - айди заявки и может быть несколько чатов
      //удаление тоже проверить
      if(role === 'driver') {
        arr===undefined ? setChoseChatsArr([...choseChatsArr, item]) : setChoseChatsArr(choseChatsArr.filter((elem)=> elem!==item))
      } else {
        //тут могут быть одинаковые айди
        arr===undefined ? setChoseChatsArr([...choseChatsArr, obj]) : setChoseChatsArr(choseChatsArr.filter((elem)=> elem.tenderId !==obj.tenderId && elem.userId !== obj.userId))
      }

      arr===undefined ? setArrFromDelTender([...arrFromDelTender, obj]) : setArrFromDelTender(arrFromDelTender.filter((elem)=> elem.tenderId !== obj.tenderId && elem.userId !== obj.userId))

    } else {
      let arr = role === 'driver' ? choseChatsArr.find(elem=>
        // console.log('!!!!!elem', elem,item)
        elem===item
      ) : choseChatsArr.find(elem=> elem.userId === item.userId && elem.tenderId === item.tenderId )
      console.log('activeTab 1 arr', arr)
      // undefined- в choseChatsArrHidden  нет item - добавляем
      if(role === 'driver') {
        arr===undefined ? setChoseChatsArrHidden([...choseChatsArrHidden, item]) : setChoseChatsArrHidden(choseChatsArrHidden.filter((elem)=>elem!==item))
      } else {
        //тут могут быть одинаковые айди
        arr===undefined ? setChoseChatsArrHidden([...choseChatsArrHidden, obj]) : setChoseChatsArrHidden(choseChatsArrHidden.filter((elem)=> elem.tenderId !== obj.tenderId && elem.userId !== obj.userId))
        // let test = choseChatsArrHidden.filter((elem)=> elem.tenderId !== obj.tenderId && elem.userId !== obj.userId)
        // console.log('test!!!!', test)
      }
      //тут могут быть одинаковые айди
      arr===undefined ? setArrFromDelTender([...arrFromDelTender, obj]) : setArrFromDelTender(arrFromDelTender.filter((elem)=> elem.tenderId !== obj.tenderId && elem.userId !== obj.userId))

    }
  }
  
  const handleChoseAllChats = (arrOfTenders,arrOfId,setArrOfId,setArrBl) => {
    // console.log('handleChoseAllChats', arrOfTenders.length)

    if(arrOfTenders.length===arrOfId?.length) return // у клиента arrOfId будет с объектом
    
    if(role==='driver') {
      //для удаления
      let newArrBL = []
      arrOfTenders.forEach((elem,index)=> {
        // console.log('HCAC newArrCl elem ',elem.data.data.userId)
        newArrBL.push({userId: elem.data.data.userId, tenderId: elem.data.id})
      })
      console.log('newArr to del', newArrBL)
      setArrBl(newArrBL)

      //для скрытия
      let newArr = []
      arrOfTenders.forEach((elem,index)=> {
        // console.log('HCAC newArr elem ',)
        newArr.push(elem.data.id)
      })
      console.log('newArr to hid', newArr)
      setArrOfId(newArr)

    } else {
      //для клиента удаление и скрытие - одинаковое - айди заявки и айди водителя, так как для одной заявки могут быть разные водители
      // let newArrCl = []
      let newArrBL = []
      arrOfTenders.forEach((elem,index)=> {
        console.log('HCAC newArrCl elem ',)
        // newArrCl.push(elem.data.id)
        newArrBL.push({userId: elem.userInfo.userId, tenderId: elem.data.id})
      })
      // console.log('newArrCl', newArrCl)
      console.log('newArrBL', newArrBL)
      setArrOfId(newArrBL)
      setArrBl(newArrBL)
    }
  }
  //в неактуальные
  const handleAddToHidden = async(arrOfUid,onClose) => {
    // console.log('handleAddToHidden start arrOfUid:', arrOfUid)
    // let tenderInfo = listOfChats.find(elem => elem.data.id === arrOfUid[0])
    // console.log('tenderInfo', tenderInfo)
    // try {
    //   if(role === 'driver') {

    //     let delTender = await new Promise.all(
    //       arrOfUid.map(
    //         async(item) => {
    //         let newArr = await firestore()
    //           .collection('forms')
    //           .doc(uid)
    //           .update({
    //             'hiddenTenders': firestore.FieldValue.arrayUnion(item)
    //           })
    //           .then(res => {              
    //             //отправлять сообщение клиенту что чат перенесен в неактивные
    //             let tenderInfo = listOfChats.find(elem => elem.data.id === item)
    //             let msg = {
    //               _id: messageIdGenerator(),
    //               createdAt: firestore.FieldValue.serverTimestamp(),
    //               read: false,
    //               text: 'Чат добавлен в неактивные',
    //               tenderId: item,
    //               system: true,
    //               typeMsg: 'addToArchFromDriver',
    //               userId: uid,
    //               userRole: role,
    //               partnerId: role === 'driver' ? tenderInfo.data.data.userId : uid,
    //               partnerRole: role === 'driver' ? 'client' : 'driver'
    //             }
    //             console.log('msg', msg)
    //             addMsg(msg)
    //             return true
    //           })
    //           return newArr
    //       }
    //       ))
    //       let check = delTender.filter((elem) => !!elem)
    //       console.log('check', check)
    //       console.log('newArr', check)

    //       if(check.length > 0) {
    //         // setIsLoading(true)
    //         // клиент/водитель разные фун-ии
    //         getTenderHidden(uid,dispatch,userProfileTenderHidden)
    
    //         setIsVisibleSettings(false)
    //         setArrFromDelTender([])
    //         setChoseChatsArr([])
    //         setChoseChatsArrHidden([])
    //       }

    //   } else {
    //     let arrupdate =  hiddenTenderClient !== null ? hiddenTenderClient.concat(arrOfUid) : arrOfUid
    //     console.log('arrupdate add', arrupdate)
    //     await firestore()
    //       .collection('forms')
    //       .doc(uid)
    //       .update({
    //         'hiddenTendersClient': arrupdate
    //       })
    //       .then(res => {
    //         arrOfUid.forEach(elem => {

    //           let msg = {
    //             _id: messageIdGenerator(),
    //             createdAt: firestore.FieldValue.serverTimestamp(),
    //             read: false,
    //             text: 'Чат добавлен в неактивные',
    //             tenderId: elem.tenderId,
    //             system: true,
    //             typeMsg: 'addToArchFromClient',
    //             userId: uid,
    //             userRole: role,
    //             partnerId: role === 'driver' ? uid : elem.userId,
    //             partnerRole: role === 'driver' ? 'client' : 'driver'
    //           }
    //           addMsg(msg)
    //           console.log('msg', msg)
    //         })
                          
    //         console.log('res', res)
    //         // setIsLoading(true)
    //         // клиент/водитель разные фун-ии
    //         getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
    //         setIsVisibleSettings(false)
    //         setArrFromDelTender([])
    //         setChoseChatsArr([])
    //         setChoseChatsArrHidden([])
    //         onClose()    
    //       }).catch(err=> {
    //         console.log('firebase error hiddenTendersClient', err)
    //       })
        
    //     //проверять стейт скрытых - добавлять в него новые скрытые и перезаписывать поле
    //   }
    //   } catch (error) {
    //     console.log('handleAddToHidden error', error)
    //   }
  }
  //восстановить,
  const handleRemoveToHidden = async(arrOfUid) => {
    // console.log('handleRemoveToHidden start arrOfUid:', arrOfUid)
    // try {
    //   if(role === 'driver') {
    //     let delTender = await new Promise.all(
    //       arrOfUid.map(
    //         async(item) => {
    //         let newArr = await firestore()
    //           .collection('forms')
    //           .doc(uid)
    //           .update({
    //             'hiddenTenders': firestore.FieldValue.arrayRemove(item)
    //           })
    //           .then(res => {
    //             let tenderInfo = listOfChatsHidden.find(elem => elem.data.id === item)
    //             let msg = {
    //               _id: messageIdGenerator(),
    //               createdAt: firestore.FieldValue.serverTimestamp(),
    //               read: false,
    //               text: 'Чат восстановлен',
    //               tenderId: item,
    //               system: true,
    //               typeMsg: 'removeFromArchFromDriver',
    //               userId: uid,
    //               userRole: role,
    //               partnerId: role === 'driver' ? tenderInfo.data.data.userId : uid,
    //               partnerRole: role === 'driver' ? 'client' : 'driver'
    //             }
    //             console.log('msg', msg)
    //             addMsg(msg)
    //             return true
    //           //   console.log('forms update deleteTenders res: ', res);
    //           //   //свой id в заявку для рассылки массового пуша
    //           //   firestore()
    //           //   .collection('tenders')
    //           //   .doc(docId)
    //           //   .update({
    //           //     'usersIdWithBet': firestore.FieldValue.arrayRemove(uid)
    //           //   }
    //           })
    //           return newArr
    //       }
    //       ))
  
    //     let check = delTender.filter((elem) => !!elem)
    //     console.log('check', check)
    //     if(check.length > 0) {
    //       setIsLoading(true)
    //       getTenderHidden(uid,dispatch,userProfileTenderHidden)
    //       setIsVisibleSettings(false)
    //       setArrFromDelTender([])
    //       setChoseChatsArr([])
    //       setChoseChatsArrHidden([])
    //       // getChatTender()
    //     }
    //   } else {
    //     //client remove obj
    //     let arrupdate =  hiddenTenderClient !== null ? removeDuplicates(hiddenTenderClient,arrOfUid) : []
    //     console.log('arrupdate remove', arrupdate)

    //     await firestore()
    //       .collection('forms')
    //       .doc(uid)
    //       .update({
    //         'hiddenTendersClient': arrupdate
    //       })
    //       .then(res => {
            
    //         arrOfUid.forEach(elem => {

    //           let msg = {
    //             _id: messageIdGenerator(),
    //             createdAt: firestore.FieldValue.serverTimestamp(),
    //             read: false,
    //             tenderId: elem.tenderId,
    //             system: true,
    //             text: 'Чат восстановлен',
    //             typeMsg: 'removeFromArchFromClient',
    //             userId: uid,
    //             userRole: role,
    //             partnerId: role === 'driver' ? uid : elem.userId,
    //             partnerRole: role === 'driver' ? 'client' : 'driver'
    //           }
    //           addMsg(msg)
    //           console.log('msg', msg)
    //         })

    //         console.log('res', res)
    //         setIsLoading(true)
    //         // клиент/водитель разные фун-ии
    //         getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
    //         setIsVisibleSettings(false)
    //         setArrFromDelTender([])
    //         setChoseChatsArr([])
    //         setChoseChatsArrHidden([])
    //         // onClose()    
    //       }).catch(err=> {
    //         console.log('firebase error hiddenTendersClient', err)
    //       })
    //   }

    // } catch (error) {
    //   console.log('handleRemoveToHidden error', error)
    // }
  }

  const handleOnBlock = async(arrOfUid) => {
    // // let uidClient = role==='driver' ? :
    // // let uidDriver = role==='driver' ? uid :
    // // console.log('handleOnBlock start ', arrOfUid)
    // //в удаленных чатах для роли клиент и водитель один стейт
    // //так как свои заявки в роли водителя видны не будут - поэтому не будет конфликтов
    // let arrupdate =  blacklist !== null ? blacklist.concat(arrOfUid) : arrOfUid
    // // console.log('arrupdate block', arrupdate)
    // try {
    //   await firestore()
    //     .collection('forms')
    //     .doc(uid)
    //     .update({
    //       'blackListOfDriver': arrupdate
    //     })
    //     .then(res => {
    //       console.log('res', res)
    //       setIsLoading(true)
    //       setChoseChatsArr([])
    //       setChoseChatsArrHidden([])
    //       setArrFromDelTender([])
    //       getBlackList(uid,dispatch,userProfileBlackList)
    //       setIsVisibleSettings(false)
    //     })
    //   } catch (error) {
    //     setIsLoading(false)
    //   console.log('error', error)
      
    // }

  }

  const handleChoseChatRemove = (item,activeTab,obj) => {
    // console.log('handleChoseChatRemove', item,activeTab,obj)
    if(activeTab===0) {
        //удалять из скрытых
        role === 'driver' ? setChoseChatsArr(choseChatsArr.filter((elem)=> elem!==item)) : setChoseChatsArr(choseChatsArr.filter((elem)=> elem.tenderId !==obj.tenderId && elem.userId !== obj.userId))
        //удалять из черного листа
      } else {
        role === 'driver' ? setChoseChatsArrHidden(choseChatsArrHidden.filter((elem)=> elem!==item)) : setChoseChatsArrHidden(choseChatsArrHidden.filter((elem)=> elem.tenderId !==obj.tenderId && elem.userId !== obj.userId))
    }
    setArrFromDelTender(arrFromDelTender.filter((elem)=> elem.tenderId !== obj.tenderId && elem.userId !== obj.userId))
  }

  const handleShowProfile = (item) => {
    setUserProfileState(item)
    setIsVisibleProfile(true)
  }

  const ChatItem = ({prop, index, flag}) => {
    // console.log('CL ChatItem prop', prop)
    // "userInfo": {"_id": "17ace7e2-06b3-4bd2-b9d4-fd62703baebe", "createdAt": [Object], 
    // "driverAvatar": null, "driverName": "Zakj2", "id": null, "partnerId": "FuliDRDN57XK7uRrMTzt287ynGv1", 
    // "partnerRole": "client", "read": true, "replyId": "zow1tNqpUORnAFNGMcib", "tenderId": "AvRhS37fc8VIIkQnbFvd", 
    // "textSystem": "systemMsg15978461238",
    //  "userId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", "userRole": "driver"}
    const data = prop.data.data
    // console.log('ChatItem id', prop.data.id, prop.data.data.name)

    const repl = prop.repl!==null && prop.repl!==undefined? prop.repl: null
    let userInfo = prop.userInfo!==null && prop.userInfo!==undefined? prop.userInfo: null
    // let messages = null
    let counter 
    let dataMsg = prop?.dateMsg
    let myUnreadMsg = prop?.myUnreadMsg

   
    if(role ==='driver') {
      //нужно получать сообщения мне, сейчас это мои сообщения
      dataMsg = prop.dateMsg
      counter = prop.unReadMsg?.length

    } else if(role ==='client'){
      counter = prop.unReadMsg?.length
      dataMsg = prop.dateMsg
    }
    // console.log('prop.unReadMsg', prop.unReadMsg, counter )
    // console.log('ChatItem dataMsg,counter', dataMsg, counter)

    let isChose 
    if( isActiveTab === 0 ) {
      isChose = role === 'driver' ? choseChatsArr.find(item=> item===prop.data.id) : choseChatsArr.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId)
    } else {
      isChose = role === 'driver' ? choseChatsArrHidden.find(item=> item===prop.data.id) : choseChatsArrHidden.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId)
      // console.log('isChose', role === 'driver' ? choseChatsArrHidden.find(item=> item===prop.data.id) : choseChatsArrHidden.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId))
    }

    // console.log('isChose', isChose)
    let statusBet = 'base'
    let avatar = role ==='driver'? data?.avatar : userInfo?.driverAvatar
    let userName = role ==='driver'? data?.userName : userInfo?.userName
    // console.log('avatar', avatar, 'userName', userName)

    if(repl!==null) {
      if((repl.data.clientBetStatus==='accept'||repl.data.driverBetStatus==='accept')) {
        statusBet = 'accept'
      } else if (role ==='driver'&&repl.data.driverBetStatus==='wait') {
        statusBet = 'base'
      } else if (role ==='client'&&repl.data.clientBetStatus==='wait') {
        statusBet = 'base'
      } else {
        statusBet = 'wait'
      }
    }
    // console.log('statusBet ', statusBet, repl)
    

    return (
      <>
        <View 
          style={[mainstyles.mrChats,isChose?{marginTop: 5,marginLeft: 30, marginRight: 0, }:null,
            {marginBottom: index === listOfChats.length-1 ? 30:12}
          ]}
        >
          <View style={[styles.row,[styles.wrapper,mainstyles.shadowG5r8,isChose?{ backgroundColor: THEME.GREY100}:{}]]}>
            <View style={[styles.inner, ]}>
              <TouchableOpacity style={styles.imgContainer}
              activeOpacity={1}
               onPress={()=>handleShowProfile(role==='client'? userInfo.userId : prop.data.data.userId)}>
              {
                avatar!==null && avatar?.length > 0 ?
                  <View style={{width:60,height:60,backgroundColor: '#fff',borderRadius: 30,}}>
                    <Image source={{uri: avatar }} style={styles.img}/>
                    <View style={[styles.starContainer]}>
                      <Text style={[mainstyles.text10R,styles.starText]}>{prop?.rating}</Text>
                      <IconStarSmallFill color={THEME.YELLOW}/>
                    </View>
                  </View>
                  :
                  <View style={{width:60,height:60,}}>
                    <View style={styles.img}>
                      <Icon name="camera" size={20} color={THEME.PRIMARY} />
                    </View>
                    <View style={[styles.starContainer]}>
                      <Text style={[mainstyles.text10R,styles.starText]}>{prop?.rating}</Text>
                      <IconStarSmallFill color={THEME.YELLOW}/>
                    </View>
                  </View>
              }
              </TouchableOpacity>
              <TouchableOpacity style={[styles.midRifhtContainer, mainstyles.row,]} activeOpacity={0.9}
                onLongPress={()=>{setIsVisibleSettings(true),handleChoseChat(prop.data.id,isActiveTab, {userId: role==='client'? userInfo.userId : prop.data.data.userId, tenderId: prop.data.id})}}
                onPress={() => handlePress(prop)}
              >
                <View style={styles.content}>
                  <Text style={[mainstyles.text14R,{color: THEME.GREY800}]}>{userName}</Text>
                  <Text style={[mainstyles.text12R,{color: THEME.GREY900}]}>{data.name}</Text>
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
                        <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{repl?.data?.betUpdate} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
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
          
          {
            isChose ?
            <TouchableOpacity onPress={()=>handleChoseChatRemove(prop.data.id,isActiveTab, {userId: role==='client'? userInfo.userId : prop.data.data.userId, tenderId: prop.data.id})}
             style={[mainstyles.bagePriceBase,{position: 'absolute', top: -5,left: -10, justifyContent: 'center', alignItems: 'center', borderColor: THEME.PRIMARY,width: 25, height: 25, borderRadius: 25, borderWidth:2}]}>
              <IconCheck />
            </TouchableOpacity>
            : null
          }
        </View>
      </>
    )
  }

  const ChatItemHidden = ({prop, index, flag}) => {
    // console.log('CL ChatItem prop', prop)
    // "userInfo": {"_id": "17ace7e2-06b3-4bd2-b9d4-fd62703baebe", "createdAt": [Object], 
    // "driverAvatar": null, "driverName": "Zakj2", "id": null, "partnerId": "FuliDRDN57XK7uRrMTzt287ynGv1", 
    // "partnerRole": "client", "read": true, "replyId": "zow1tNqpUORnAFNGMcib", "tenderId": "AvRhS37fc8VIIkQnbFvd", 
    // "textSystem": "systemMsg15978461238",
    //  "userId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", "userRole": "driver"}
    const data = prop.data.data
    // console.log('ChatItem id', prop.data.id, prop.data.data.name)

    const repl = prop.repl!==null && prop.repl!==undefined? prop.repl: null
    let userInfo = prop.userInfo!==null && prop.userInfo!==undefined? prop.userInfo: null
    // let messages = null
    let counter 
    let dataMsg = prop?.dateMsg
    let myUnreadMsg = prop?.myUnreadMsg

   
    if(role ==='driver') {
      //нужно получать сообщения мне, сейчас это мои сообщения
      dataMsg = prop.dateMsg
      counter = prop.unReadMsg?.length

    } else if(role ==='client'){
      dataMsg = prop.dateMsg
      counter = prop.unReadMsg?.length
    }
    // console.log('prop.unReadMsg', prop.unReadMsg, counter )
    // console.log('ChatItem dataMsg,counter', dataMsg, counter)

    let isChose 
    if( isActiveTab === 0 ) {
      isChose = role === 'driver' ? choseChatsArr.find(item=> item===prop.data.id) : choseChatsArr.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId)
    } else {
      isChose = role === 'driver' ? choseChatsArrHidden.find(item=> item===prop.data.id) : choseChatsArrHidden.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId)
      // console.log('isChose', role === 'driver' ? choseChatsArrHidden.find(item=> item===prop.data.id) : choseChatsArrHidden.find(item=> item?.tenderId === prop.data.id && item?.userId == prop.userInfo.userId))
    }

    // console.log('isChose', isChose)
    let statusBet = 'base'
    let avatar = role ==='driver'? data?.avatar : userInfo?.driverAvatar
    let userName = role ==='driver'? data?.userName : userInfo?.userName
    // console.log('avatar', avatar, 'userName', userName)

    if(repl!==null) {
      if((repl.data.clientBetStatus==='accept'||repl.data.driverBetStatus==='accept')) {
        statusBet = 'accept'
      } else if (role ==='driver'&&repl.data.driverBetStatus==='wait') {
        statusBet = 'base'
      } else if (role ==='client'&&repl.data.clientBetStatus==='wait') {
        statusBet = 'base'
      } else {
        statusBet = 'wait'
      }
    }
    // console.log('statusBet ', statusBet, repl)
    

    return (
      <>
        <View
          style={[mainstyles.mrChats,isChose?{marginTop: 5,marginLeft: 30, marginRight: 0, }:null,
          {marginBottom: index === listOfChatsHidden.length-1 ? 30:12}]} 
        >
          <View style={[styles.row,[styles.wrapper,mainstyles.shadowG5r8,isChose?{ backgroundColor: THEME.GREY100}:{}]]}>
            <View style={styles.inner}>
              <TouchableOpacity style={styles.imgContainer}
                activeOpacity={1}
               onPress={()=>handleShowProfile(role==='client'? userInfo.userId : prop.data.data.userId)}>
              {
                avatar!==null && avatar?.length > 0 ?
                  <View style={{width:60,height:60,backgroundColor: '#fff',borderRadius: 30,}}>
                    <Image source={{uri: avatar }} style={styles.img}/>
                    <View style={[styles.starContainer]}>
                      <Text style={[mainstyles.text10R,styles.starText]}>{prop?.rating}</Text>
                      <IconStarSmallFill color={THEME.YELLOW}/>
                    </View>
                  </View>
                  :
                  <View style={{width:60,height:60,}}>
                    <View style={styles.img}>
                      <Icon name="camera" size={20} color={THEME.PRIMARY} />
                    </View>
                    <View style={[styles.starContainer]}>
                      <Text style={[mainstyles.text10R,styles.starText]}>{prop?.rating}</Text>
                      <IconStarSmallFill color={THEME.YELLOW}/>
                    </View>
                  </View>
              }
              </TouchableOpacity>
              <TouchableOpacity style={[styles.midRifhtContainer, mainstyles.row,]} activeOpacity={0.9} 
                onLongPress={()=>{setIsVisibleSettings(true),handleChoseChat(prop.data.id,isActiveTab, {userId: role==='client'? userInfo.userId : prop.data.data.userId, tenderId: prop.data.id})}}
                onPress={() => handlePress(prop)}
              >
                <View style={styles.content}>
                  <Text style={[mainstyles.text14R,{color: THEME.GREY800}]}>{userName}</Text>
                  <Text style={[mainstyles.text12R,{color: THEME.GREY900}]}>{data.name}</Text>
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
                        <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{repl?.data?.betUpdate} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
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
          
          {
            isChose ?
            <TouchableOpacity onPress={()=>handleChoseChatRemove(prop.data.id,isActiveTab, {userId: role==='client'? userInfo.userId : prop.data.data.userId, tenderId: prop.data.id})}
             style={[mainstyles.bagePriceBase,{position: 'absolute', top: -5,left: -10, justifyContent: 'center', alignItems: 'center', borderColor: THEME.PRIMARY,width: 25, height: 25, borderRadius: 25, borderWidth:2}]}>
              <IconCheck />
            </TouchableOpacity>
            : null
          }
        </View>
      </>
    )
  }

  const renderItem = ({ item, index }) => (
    <ChatItem prop={item} index={index} />
  )
  const renderItemHidden = ({ item, index}) => (
    <ChatItemHidden prop={item} index={index}/>
  )

  const checkUnreadMsg = (activeChats=[],hiddenChats=[]) => {
    // console.log('checkUnreadMsg', )
    let activeCh = activeChats.filter(elem => elem?.unReadMsg?.length > 0)
    let hiddenCh = hiddenChats.filter(elem => elem?.unReadMsg?.length > 0)
    setUnreadMsg([activeCh?.length,hiddenCh?.length])
  }
  
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if(role === 'driver') {

        getTenderHidden(uid,dispatch,userProfileTenderHidden)
      } else {
        getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
      }
    }, [route])
  );

  useFocusEffect(
    React.useCallback(() => {
      console.log('START GET useFocusEffect getChatTender', )

      getChatTender(blacklist,hiddenTender,hiddenTenderClient)
    }, [hiddenTender,blacklist,role,stateOfInformers,hiddenTenderClient])
  );

  useEffect(()=>{

  },[choseChatsArr])


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('onBackPress ',)
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  useEffect(()=>{
    checkUnreadMsg(listOfChats,listOfChatsHidden)
  },[listOfChats,listOfChatsHidden])

  // useEffect(()=>{
  //   console.log('\x1b[46m%s %s\x1b[0m', '----------------render CL----------------',' ');
  // },[])

  return (
    <View style={[styles.container,]} >
      <StatusBar translucent barStyle={'dark-content'}/>
      {
        isLoading && firstOpenChats === true ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isVisibleProfile && userProfileState ? 
        <View style={[mainstyles.containerModalGgBl,{flex:1, minHeight: height+safeInsets.top, zIndex: 99999}]}>
          <ProfileInfo role={role} userInfo={userProfileState} onClose={()=>{setIsVisibleProfile(false)}}/>
        </View>
        :null
      }
      {
        isVisibleAskHideChat ?
        <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
          <InfoAskWindow
            data={findJsonObj(jsonDataPrompt,'auctionPopup',auctionPopup)} 
            onPress={()=>handleAddToHidden(choseChatsArr,()=>setIsVisibleAskHideChat(false))} 
            onClose={()=>setIsVisibleAskHideChat(false)}/>
        </View>
        : null
      }
      <View style={{paddingTop: safeInsets.top,paddingBottom: 60,}}>
        <View style={{}}>
          {
            !isVisibleSettings ? 
            <Text style={[mainstyles.text18R,{color: THEME.PRIMARY,textAlign: 'center',paddingVertical: 3,}]}>Чаты</Text>
          :
          <>
            {
              isActiveTab===0 ?
              <View style={[mainstyles.rowalCjcSb,mainstyles.pV10,{width: '100%'}]}>
                <TouchableOpacity style={{paddingLeft: 10}} onPress={handleCloseSettings}>
                  <Icon name='cross' color={THEME.PRIMARY} size={28}/>
                </TouchableOpacity>
                <View style={[mainstyles.outlBage25]}>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY600}]}>{choseChatsArr?.length}</Text>
                </View>
                <TouchableOpacity style={[mainstyles.pH5]} onPress={()=>handleChoseAllChats(listOfChats,choseChatsArr,setChoseChatsArr,setArrFromDelTender)}>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Выбрать все</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pH5]} onPress={()=>setIsVisibleAskHideChat(true)}>
                  <IconDocDel/>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Прекратить торг</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pH5]} onPress={()=>handleOnBlock(arrFromDelTender)}>
                  <IconTrash />
                </TouchableOpacity>
              </View>
              :<View style={[mainstyles.rowalCjcSb,mainstyles.pV10]}>
                <TouchableOpacity style={{paddingLeft: 10}} onPress={()=>{setIsVisibleSettings(false),setChoseChatsArrHidden([])}}>
                  <Icon name='cross' color={THEME.PRIMARY} size={28}/>
                </TouchableOpacity>
                <View style={[mainstyles.outlBage25]}>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY600}]}>{choseChatsArrHidden?.length}</Text>
                </View>
                <TouchableOpacity style={[mainstyles.pH5]} onPress={()=>handleChoseAllChats(listOfChatsHidden,choseChatsArrHidden,setChoseChatsArrHidden,setArrFromDelTender)}>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Выбрать все</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pH5]} onPress={()=>handleRemoveToHidden(choseChatsArrHidden)}>
                  <IconDocRecover/>
                  <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Восстановить</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pH5]} onPress={()=>handleOnBlock(arrFromDelTender)}>
                  <IconTrash />
                </TouchableOpacity>
              </View>
            }
          </>
          }
          <TopTabBarText data={titleChat} isActive={isActiveTab} onPress={handleOnPressTopTab} renderAction={unreadMsg}/>
        </View>
        {
          isActiveTab===0 ?
          <FlatList
            style={{paddingTop: 15, marginBottom: 15,}}
            ListHeaderComponent={()=>{
              return (
                <>
                  {
                    isLoading && firstOpenChats === false ?
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
            data={listOfChats}
            // data={dataTenders}
            renderItem={renderItem}
            keyExtractor={(item, index) => index+'tnd'}
          />
          :<FlatList
            style={{marginBottom: 15,paddingTop: 15}}
            // onRefresh={()=>{getTenderHidden(uid,dispatch,userProfileTenderHidden)}}
            ListHeaderComponent={()=>{
              return (
                <>
                  {
                    isLoading && firstOpenChats === false ?
                      <View style={[mainstyles.rowalCjcC,{backgroundColor: '#fff',paddingBottom: 5}]}>
                        <ActivityIndicator color={THEME.PRIMARY} size='small'/> 
                        <Text style={[mainstyles.text12R,{paddingLeft: 15}]}>Обновление данных...</Text>
                      </View>
                    : 
                    null
                  }
                </>
              )
            }}
            data={listOfChatsHidden}
            // data={dataTendersHidden}
            renderItem={renderItemHidden}
            keyExtractor={(item, index) => index+'hid'}
          />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    // backgroundColor: 'red',
    // paddingBottom: 20
  },  
  wrapper: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    // backgroundColor: 'blue',
    elevation: 7,

  },
  inner: {
    // backgroundColor: 'lightblue',
    width: '100%',
    flexDirection: 'row',
  },
  imgContainer: {
    // backgroundColor: 'lightblue',
    width: '18%',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  midRifhtContainer: {
    // backgroundColor: 'lightblue',
    width: '82%',
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



  //check and del
  ind: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    // flex: 1,
    width: '100%',
    // height: 800,
    height: '100%',
    // minHeight: '100%',
    // height: Dimensions.get('window').height,
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999
  },
  bgImage: {
    width: '100%',
    height: 340,
    // height: height*0.5
  },
  list: {
    flex: 1,
    // backgroundColor: 'pink',
  },
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
  iconText: {
    color: '#fff',
    fontSize: normalize(10)
  },
  priceBet: {
    backgroundColor: THEME.RED,
    borderRadius: 3,
    padding: 3,
  },

});