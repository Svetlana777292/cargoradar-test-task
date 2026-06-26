import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions,Modal, Text, TouchableOpacity, Keyboard,TextInput, Alert, Linking, Image, KeyboardAvoidingView, LogBox, BackHandler, StatusBar, Platform, ActivityIndicator, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { GiftedChat, Send, Bubble, Day,InputToolbar, Avatar, Composer } from 'react-native-gifted-chat';
import { useSelector, useDispatch } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import { useHeaderHeight } from '@react-navigation/elements';

//functions && features && slice
import { addMsg, firebeseUpdateTender, handlerCallNumer, onAcceprCurrBetByDriver, onAcceprCurrTender, sendBet, updateBet } from '../../util/tenders';
import { createNotification, getAllComplaints, getClientActiveTender, getDetailProfile, getDriverTndActv, getProfileUserInfoForComplaint, getTenderHidden, getTenderHiddenClient, getTenderInfo } from '../../util/firebase';
import { setClientActiveTenderState, setDriverTenderAvtivity, userProfileTenderHidden, userProfileTenderHiddenClient, userProfileTenderReply } from '../../store/features/userSlice';
import { messageIdGenerator } from '../../util/msgGenerator';
import { updInformerActiveState, updInformerRoutesState, updInformerState, updMsg } from '../../store/features/chatsSlice';
import { auctionPopup, cancelTenderBet, complaintSucceed, finishTender, height, offerBid, restoreChat, waitingAnswer } from '../../util/helperConst';
import { removeDuplicates } from '../../util/FiltersAndSorts/FiltersAndSorts';
import { findJsonObj, validateNumberInput } from '../../util/tools';

//styles
import { mainstyles, THEME } from '../../theme';

//components
import BackArrow from '../../components/Svg/BackArrow';
import IconStarSmallF from '../../components/Svg/IconStarSmallF';
import { DefaultBtnOutline } from '../../components/Buttons/DefaultBtnOutline';
import { DefaultBtn } from '../../components/Buttons/DefaultBtn';
import { BtnIconTrs } from '../../components/Buttons/BtnIconTrs';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import { ProfileInfo } from '../../components/Profile/ProfileInfo';
import { ProfileInfoWithTestimonial } from '../../components/Profile/ProfileInfoWithTestimonial';
import PromptComponent from '../../components/Modal/PromptComponent';
import IconDocDel from '../../components/Svg/IconDocDel';
import IconDocRecover from '../../components/Svg/IconDocRecover';
import IconStarSmallFill from '../../components/Svg/IconStarSmallFill';
import ComplaintComponent from '../../components/Modal/ComplainComponent';
import { MenuListComponentChat } from '../../components/MenuListComponentChat';
import IconMenuDots from '../../components/Svg/IconMenuDots';
import { WrapperModalView } from '../../components/Modal/WrapperModalView';
import { setUserFormsHiddenTenders, userProfileInfo } from '../../store/features/loginSlice';
import Actions from '../../components/ChatComponents/Actions';
import { ImageCustomView } from '../../components/ChatComponents/customMedia/ImageCustomView';
import { VideoCustomView } from '../../components/ChatComponents/customMedia/VideoCustomView';
import { VideoCustomModal } from '../../components/ChatComponents/customMedia/Modals/VideoCustomModal';
import { ImageCustomModal } from '../../components/ChatComponents/customMedia/Modals/ImageCustomModal';
import { renderBubble } from './ChatParts/Bubble';
import { renderDay } from './ChatParts/Day';
import { renderInputToolbar } from './ChatParts/InputToolbar';
import { renderSystemMessage } from './ChatParts/SystemMessages';
import { convertChatsDate } from '../../util/dateFormats';
import dayjs from 'dayjs';
import { get, post, put } from '../../store/features/api/user-api';
import { delCurrentChatMsgStateDel, setCurrentChatId, setCurrentChatReplState } from '../../store/features/listOfChatsSlice';
import { getUserDataChatRouteClient, getUserDataChatRouteDriver, sendComplain } from '../../util/helpersapidatafunc';
import { getUserActivities, getUserHiddenTenders, setUserActivities, setUserFormDataFromDB, setUserHiddenTenders } from '../../store/features/api/userInfoForms';
import { updateInformers } from '../../util/informersHelpers';
import { normalize } from '../../util/UI/fontsUI';

export const ChatScreen = ({route, navigation}) => {
  console.log('\x1b[46m%s %s\x1b[0m','ChatScreen', 'route.params')
  const safeInsets = useSafeAreaInsets();
  const isfocused = useIsFocused()

  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset= Platform.OS === 'ios' ? headerHeight : headerHeight 
  // + StatusBar.currentHeight;
  // const uid = '2'//auth().currentUser.uid  
  const chatRef=useRef()
  const inputChatRef=useRef(null)
  const inputRef=useRef(null)
  const { role, userProfileInfo, userFormsInfo,userFormsActivities,userFormsHiddenTenders } = useSelector(state => state.login)
  const { currentChatId, currentChatMsgState, currentChatReplState,informerState, informerActiveState,informerRoutesState } = useSelector(state => state.listofchats)
  
  // const driverRoutesOffers = useSelector((state) => state.user.driverRoutesOffers)
  // const myProfileInfo = useSelector(state => state.login.userProfileInfo) //TODO заменить на userProfileInfo
  // const hiddenTender = useSelector((state) => state.user.hiddenTender) //TODO заменить на userProfileInfo.hiddenTenders
  // const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient) //TODO заменить на userProfileInfo.hiddenTendersClient
  // const stateOfMsg = useSelector((state) => state.chats.msgState) //TODO один обект { msgState, informerState, informerActiveState, informerRoutesState ...}
  // const stateOfInformers = useSelector((state) => state.chats.informerState) //TODO один обект
  // const stateOfInformersActive = useSelector((state) => state.chats.informerActiveState) //TODO один обект
  // const stateOfInformersRoutes = useSelector((state) => state.chats.informerRoutesState) //TODO один обект
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const carsInfo = useSelector(state=>state.login.carsInfo) 
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen currentChatId ', currentChatId, currentChatMsgState)
  // console.log('\x1b[46m%s %s\x1b[0m','ChatScreen userFormsHiddenTenders ', userFormsHiddenTenders)
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen currentChatReplState ', currentChatReplState)
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen currentChatMsgState ', currentChatMsgState)
  
  // console.log('ChatScreen hiddenTenderClient ', hiddenTenderClient)
  // const tenderIdFromRoute = route.params?.item.id
  const chatsRef = ()=>{}//().collection('messages')
  
  const [tenderState, setTendeState] = useState(null)
  const [routeState, setRouteState] = useState(null)
  // console.log('----tenderState-----', tenderState)
  const [clientId,setClientId] = useState(null)
  const [driverUserId,setDriverUserId] = useState(null)
 
  const [profileClient, setProfileClient] = useState(null)
  const [profileDriver, setProfileDriver] = useState(null)

  const [isHidden,setIsHidden] = useState(false)
  // console.log('Profiles', profileClient,profileDriver)
  const [messages, setMessages] = useState([])
  const [betState, setBetState] = useState(null)
  const [betInput, setBetInput] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [isShowConfirmSendBet,setIsShowConfirmSendBet]= useState(false)
  const [priceFromDialog,setPriceFromDialog]= useState(null)
  const [statusOfBetPrice,setStatusOfBetPrice]= useState('wait')
  const [isDisableBtn,setIsDisableBtn]= useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [abortController, setAbortController] = useState(null);
  const [processing, setProcessing] = useState(0)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)
  const [isVisibleProfileWithTestim, setIsVisibleProfileWithTestim] = useState(false)
  const [isShowSucceed, setIsShowSucceed] = useState(false)
  const [isShowCancelDialog, setIsShowCancelDialog] = useState(false)
  const [isVisibleCancalSucceed, setIsVisibleCancalSucceed] = useState(false)
  const [isVisibleAskHideChat, setIsVisibleAskHideChat] = useState(false)
  const [isVisibleAskRestoreChat,setIsVisibleAskRestoreChat] = useState(false)
  const [isDisableAcceptBtn,setDisableAcceptBtn] = useState(false)
  const [isShowCarAlert,setIsShowCarAlert] = useState(false)
  const [msgLoader, setMsgLoader] = useState(false)
  const [disableFirstBetBtn, setDisableFirstBetBtn] = useState(false)
  const [renderChat, setRenderChat] = useState(false)
  const [isVisibleMenu,setIsVisibleMenu] = useState(false)
  const [isVisibleForm,setIsVisibleForm] = useState(false)
  const [isVisibleFormSucceed,setIsVisibleFormSucceed] = useState(false)

  const [isPaused, setIsPaused] = useState(false);
  const [currImage, setCurrImage] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [showModalCurrImage, setShowModalCurrImage] = useState(false);
  const [msgStateReady, setMsgStateReady] = useState(false)
  // console.log('profileDriver', profileDriver)
  // console.log('betState', betState)
  // console.log('----betState----', betState)
  // console.log('\x1b[42m%s %s\x1b[0m','isHidden', isHidden)
  const dispatch = useDispatch()

  const handlePlayVideo = () => {
    console.log('handlePlayVideo: ', isPaused)
    isPaused ? setIsPaused(false) :  setIsPaused(true) 
  }
  
  // //* Nav |---
  //!!что бы перейти в таб "В работе"  
  const handleNavigateCurrentChat = async(flag,data) => {
    setIsLoading(true)
    // {item: newData.tender, userInfo: route.params?.userInfo,  data: newData.data}
    const userId = role === 'client' ? driverUserId : clientId
    const newData = role === 'client' ? await getUserDataChatRouteClient(tenderState.id,userId,userProfileInfo.id) : await getUserDataChatRouteDriver(tenderState.id,clientId,userProfileInfo.id)

    //todo если переход в активные чаты то стирать все информеры в обчном стейте)

      if(role ==='client') {
        setIsLoading(false)
        navigation.reset({
          index: 0,
          routes: [{
            name: 'ActiveTendersTab', 
            state: {
              routes: [
              {
                name: 'ActiveTenders',
              },
              {
                name: 'Chat',
                // params: {item: response, userInfo: route.params?.userInfo, data: data}
                params: {item: newData.tender, userInfo: route.params?.userInfo, data: newData.data}
              },
              
            ]
            }
          }],
        })
      } else {
        setIsLoading(false)
        navigation.reset({
          index: 0,
          routes: [{
            name: 'ActiveDriverTendersTab', 
            state: {
              routes: [
              {
                name: 'ActiveDriverTenders',
              },
              {
                name: 'Chat',
                params: {item: newData.tender, userInfo: route.params?.userInfo, data: newData.data}
                // params: {item: result,}
              },
              
            ]
            }
          }],
        })
      }
    // }
  }

  const handleNavToArchive = ()=>{
    setIsShowSucceed(false)
    navigation.reset({
      index: 0,
      routes: [{
        name: 'TendersTab', 
        state: {
          routes: [
          {
            name: 'ActiveTenders',
          }
        ]
        }
      }],
    })
  }

  const handleNavToProfile = () => {
    setIsShowCarAlert(false),
    // navigation.reset('Profile')
    dispatch(setCurrentChatId(null))
    navigation.reset({
      index: 0,
      routes: [{
        name: 'ProfileTab', 
        state: {
          routes: [
          {
            name: 'Profile',
            // params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
          },
          
        ]
        }
      }],
    })
  }

  const handleOnPressBack = (flag) => {
    // console.log('navigation.getState()', navigation.getState())
    // navigation.goBack()
    dispatch(setCurrentChatId(null))
    console.log('handleOnPressBack flag', flag)
    if(flag === 'title') {

      if(role==='driver') {
        // navigation.navigate('SearchTenderItemScreen',{dataTender: tenderState})
        navigation.replace('TenderItemScreen',{dataTender: tenderState})  
        
      } else {
        navigation.replace('TenderItemClient',{dataTender: tenderState})
        
        // navigation.reset({
        //   index: 0,
        //   routes: [{
        //     name: 'TendersTab', 
        //     state: {
        //       routes: [
        //       {
        //         name: 'TenderItemClient',
        //         params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
        //         // params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
        //       },
        //     ]
        //     }
        //   }],
        // })
      }
    } else {
      //если заявка перешла в работу то navigation.goBack() не сработает
      if(role==='driver') { 
        try {
          if(route?.params?.from == 'list') {
            navigation.goBack()
          } else if(route?.params?.from == 'routes'){
            navigation.replace('RouteItem',{dataTender: routeState, form: 'chat'})
          } else {
            navigation.replace('TenderItemScreen',{dataTender: tenderState})
          }

        } catch (error) {
          console.log('handleOnPressBack error driver nav', error)
          navigation.replace('TenderItemScreen',{dataTender: tenderState})
        }
      } else {
        try {
          // navigation.goBack()
          if(route?.params?.from == 'list') {
            navigation.goBack()

          } else {
            navigation.replace('TenderItemClient',{dataTender: tenderState})
            //  from: 'chat'
          }

        } catch (error) {
          console.log('handleOnPressBack error client nav', error)
          navigation.reset({
            index: 0,
            routes: [{
              name: 'TendersTab', 
              state: {
                routes: [
                {
                  name: 'TenderItemClient',
                  params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
                },
              ]
              }
            }],
          })          
        }
      }
    }
  }
  // //* Nav ---|

  //TODO установка стейта зявки и профелей, добавить установку ставки (передавать при переходе)
  const onRouteParamsSet = async (routeState) => {
    // console.log('onRouteParamsSet', JSON.stringify(routeState,null,2))
    // const routeParams = routeState.params
    
    //можно проверять роль и если роль клиент а нету userInfo то не рендерит ничего
    // console.log('routeState.params.hasOwnProperty(userInfo)', routeState.params)
    if(routeState.params !== undefined && routeState.params !== null) {
      if( role === 'client' && !routeState.params.hasOwnProperty('userInfo')) {
        // console.log('111', )
        return
      } else {
        if(routeState.params?.from === 'routes') {
          //если с маршрута то сохранять айди маршрута
          setRouteState(routeState.params?.item)
        }
        setTendeState(routeState.params?.item)
        role==='driver'? setDriverUserId(userProfileInfo.id) : setDriverUserId(routeState.params?.userInfo.userId)
        setClientId(routeState.params?.item.userId)
        
      }

      onSetProfiles(routeState.params)
      onSetMessages(routeState.params.data)
      routeState.params?.data.repl ? setBetState(routeState.params?.data.repl) : null

      // routeState.params.data
      // routeState.params.data.forms
      // routeState.params.data.messages
    } else {
      console.log('else 355', )
    }
  }

  const onSetProfiles = async (data) => {
    // console.log('onSetProfiles data', data)
    if( role ==='client') {
      setProfileDriver({
        _id: 2,
        avatar: data.userInfo.avatar !==null && data.userInfo.avatar !== undefined  ?  data.userInfo.avatar  : '',
        name: data.userInfo.name
      })
      setProfileClient({
        _id: 1,
        avatar: userProfileInfo.clientAvatar !==null && userProfileInfo.clientAvatar !== undefined ? userProfileInfo.clientAvatar : '',
        name: userProfileInfo.name
      })

    } else {
      //driver      
      setProfileClient({
        _id: 2,
        avatar: data.userInfo.avatar ?  data.userInfo.avatar  : '',
        name: data.userInfo.name
      })
      setProfileDriver({
        _id: 1,
        avatar: userProfileInfo.driverAvatar ? userProfileInfo.driverAvatar : '',
        name: userProfileInfo.name
      })
    }
  }

  const setReadyToReadMsg = (arrOfRead) => {
    setMsgStateReady(true) // что бы запустился юз эфект с onSetMessagesFromState

    if(arrOfRead?.length > 0) {
      dispatch(delCurrentChatMsgStateDel(arrOfRead))
    }
  }

  const onSetMessages = async (data) => {
    //data.forms
    // data.messages
    console.log('\x1b[45m%s %s\x1b[0m','onSetMessages set new msgs', 'data.messages', data.messages)
    // console.log('\x1b[45m%s %s\x1b[0m','onSetMessages set new msgs', data.messages, data.messages?.length)
    if (data.messages?.length === 0) {
      setMsgStateReady(true)
    }
    
    if (data.messages?.length === 0) return
    const arrOfRead = []
    let needUpdHidd = false
    let needUpdActiv = false
    const msgArr = await Promise.all( 
      data.messages.map(async elem => {
      // console.log('1sm texelemt', elem._id, Object.isFrozen(elem) )
      let elemUnFr = {...elem}
      if(elem.userId === userProfileInfo.id) {
        elemUnFr._id = +elemUnFr._id 
        elemUnFr.createdAt = convertChatsDate(elemUnFr.createdAt)
        elemUnFr.read = elemUnFr.read
        elemUnFr.user = {
          _id: 1,
          name: userProfileInfo.name,
          avatar: role === 'client' ? userProfileInfo.clientAvatar: userProfileInfo.driverAvatar
        }
        elemUnFr.text = elemUnFr.text !== null ? elemUnFr.text : ''
      } else {

        if(elemUnFr.read === false) {
          //todo отправка прочитаных сообщений
          const resp = await put(`messages/${elem._id}`,{"read":true})
          if (!resp.success) {
            console.warn('Ошибка запроса messages read:', resp.error);
            return;
          }
          arrOfRead.push(elem)
          //do some code ...
          // console.log('resp.data read',resp.data)
          elemUnFr.read = resp.data.read
          //todo убирать из стейта информеров (тут или в юзэфекте) //!!userProfileInfo или с кем чат?
          // updateInformers(dispatch,elemUnFr.partnerId,informerState,informerActiveState,route.params.item.id)
          if(elemUnFr.textSystem === 'orderCanceled' || elemUnFr.textSystem === 'feedback' || elemUnFr.textSystem === 'notifyAllDriver') {
            needUpdHidd = true
            needUpdActiv = true
          }
          if( role === 'driver' && (elemUnFr.textSystem === 'acceptTenderByClient' || elemUnFr.textSystem === 'offerFromClient' )) {
            //просто получить новый стейт
            console.log('\x1b[42m%s %s\x1b[0m','driver odder or accept -> need getUserActivities ', elemUnFr.textSystem)
            
            needUpdActiv = true
          }
        }
        elemUnFr._id = +elemUnFr._id 
        elemUnFr.createdAt = convertChatsDate(elemUnFr.createdAt)
        // console.log('elem.createdAt ', elem.createdAt )
        elemUnFr.user = {
          _id: 2,
          name: data.forms.profile.name,
          avatar: role === 'client' ? data.forms.profile.driverAvatar : data.forms.profile.clientAvatar,
        }
        elemUnFr.text = elemUnFr.text !== null ? elemUnFr.text : ''
      }

      console.log('1 elem', elemUnFr)
      return elemUnFr
    }).reverse())

    // console.log('msgArr', msgArr)
    //проверять id как в appendMessages
    appendMessages(msgArr)
    setReadyToReadMsg(arrOfRead)
    // arrOfRead?.length > 0 ? dispatch(delCurrentChatMsgStateDel(arrOfRead)) : null
    // setMessages((previousMessages) => GiftedChat.append(previousMessages, msgArr))
    if(needUpdHidd) {
      getUserHiddenTenders(dispatch)
    }
    if(needUpdActiv) {
      getUserActivities(dispatch)
    }
    
  }

  const onSetMessagesFromState = async (data,client,driver,role) => {
    //data
    console.log('\x1b[44m%s %s\x1b[0m','onSetMessagesFromState set new msgs', data, data?.length)
    if (data?.length === 0) return
    
    //read && add msg to arr
    const arrOfRead = []
    let partner = role === 'driver' ? client : driver
    // console.log('partner', partner)
    let needUpdTender = false
    let needUpdHidd = false
    let needUpdActiv = false
    console.log('1needUpdTender', needUpdTender)
    const msgArr = await Promise.all( 
      data.map(async elem => {
        //!!сообщение всегда от партнера
        arrOfRead.push(elem)
        let modified = {...elem}

        modified._id = +modified._id
        modified.createdAt = convertChatsDate(modified.createdAt)
        modified.user = {
          _id: 2,
          name: partner.name,
          avatar: partner.avatar
        }

        if(elem.read === false) {
          //todo отправка прочитаных сообщений
          const resp = await put(`messages/${elem._id}`,{"read":true})
          if (!resp.success) {
            console.warn('Ошибка запроса messages read:', resp.error);
            return;
          }
          // do some code ...
          console.log('resp.data read',resp.data)

          modified.read = resp.data.read
          //!!todo - если пришло сообщение принятие водителя как исполнителя то обновлять стейт заявки, ставка обновится
          //!!todo - об отмене заявки/отзывах/ - тоже обновить стейт только заявки заявки 
          //что бы сработал юз эфект навигации
          console.log('modified.textSystem', modified.textSystem)
          console.log('check first if', modified.textSystem === 'orderCanceled' || modified.textSystem === 'feedback' || modified.textSystem === 'notifyAllDriver')

          if(modified.textSystem === 'orderCanceled' || modified.textSystem === 'feedback' || modified.textSystem === 'notifyAllDriver') {
            needUpdHidd = true
            needUpdActiv = true

            // getUserHiddenTenders(dispatch)
          }
          if( role === 'driver' && (modified.textSystem === 'acceptTenderByClient' || modified.textSystem === 'offerFromClient' )) {
            //просто получить новый стейт
            console.log('\x1b[42m%s %s\x1b[0m','driver odder or accept -> need getUserActivities ', modified.textSystem)
            
            needUpdActiv = true
            // //юзер в чате и его выбрали исполнителем обновить стейт активностей из формы для показа информеров активных
            // //todo надо самому апдейтнуть поле
            // // driverActiveTender
            // let res = userFormsActivities.driverActiveTender.includes(tenderState.id)
            // console.log('check activities res', res)
            // // getUserActivities(dispatch)
            // let obj = userFormsActivities.driverActiveTender
            // if(res) {
            //   // setUserActivities(dispatch,obj)
            // } else {
            //   let objActive = {'driverActiveTender': obj.concat([tenderState.id])}
            //   setUserActivities(dispatch,objActive)

            // }
          }
          if(modified.textSystem === 'acceptTenderByDriver' || modified.textSystem === 'acceptTenderByClient' || modified.textSystem === 'orderCanceled' || modified.textSystem === 'feedback') {
            // const respTender = await get(`tenders/${tenderState.id}`)
            
            // if (!respTender.success) {
            //   console.warn('Ошибка запроса:', respTender.error);
            //   //
            //   // alert(respTender.error);
            //   return;
            // }
            // setTendeState(respTender.data)
            console.log('needUpdTender upd if',modified.textSystem)
            needUpdTender = true
          }

          //acceptTenderByDriver - если драйвер согласен - обновить ставки
        }
        // console.log('nw modified', modified._id)
        return modified
      // }
    }).reverse())

    // console.log('2msgArr', msgArr)
    
    // setMessages((previousMessages) => GiftedChat.append(previousMessages, msgArr))

    appendMessages(msgArr)

    //todo проверить коректность работы delCurrentChatMsgStateDel
    arrOfRead?.length > 0 ? dispatch(delCurrentChatMsgStateDel(arrOfRead)) : null

    if(needUpdTender) {
      const respTender = await get(`tenders/${tenderState.id}`)
      
      if (!respTender.success) {
        console.warn('Ошибка запроса:', respTender.error);
        //
        // alert(respTender.error);
        return;
      }
      // console.log('respTender.data', respTender.data)
      setTendeState(respTender.data)
    }
    if(needUpdHidd) {
      getUserHiddenTenders(dispatch)
    }
    if(needUpdActiv) {
      getUserActivities(dispatch)
    }
    console.log('end set', )
  }


  //* Parts chats |---

  const renderSend = (props) => {
    // console.log('PROPS in renderSend',props);
    return (
      <>
      {
        isHidden ?
        null
        :
        <Send {...props}
          disabled={msgLoader}
          containerStyle={{justifyContent: 'flex-end', alignItems: 'center',width: 110,
          // backgroundColor: 'pink',
        }}
        >
          <View style={[styles.btnSend,]}>
            {
              !msgLoader ?
              <Text style={[mainstyles.text14R,{color: '#ffffff'}]}>Отправить</Text>
              : <ActivityIndicator size={'small'} color={'#ffffff'}/>
            }
          </View>
        </Send>
      }
      </>
    )
  }

  const renderCustomView = (props) => {
    // console.log('renderCustomView',props?.currentMessage )
    let name = props?.currentMessage?.name
    let size = props?.currentMessage?.size/1000 + ' Kb'
    let fileDoc = props.currentMessage?.file_type !== null && props.currentMessage?.file_type !== 'image' && props.currentMessage?.file_type !== 'video'

    const handleOpenFile = async (fileData) => {
      // Create a path for the downloaded file
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileData.name}`;

      try {
        
        // Download the file
        RNFS.downloadFile({
          fromUrl: fileData.url,
          toFile: localFile,
        }).promise.then(() => {
          // Open the file
          FileViewer.open(localFile)
            .then(() => {
              console.log('FileViewer success');
            })
            .catch((error) => {
              console.log('FileViewer error', error);
              if (error && error.message === 'No app associated with this mime type') {
                Alert.alert(t("transl93"), t("errorMsgNoAppAvailable"));
              }
            });
        }).catch((error) => {
          console.error('Download error', error);
        });
      } catch (err) {
        console.error('Download err', err);
      }
    }

    const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
    const commonFileTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];

    //todo переделать как в фото видео commonFileTypes props?.currentMessage?.file_type
    if (fileDoc) {

      // console.log('\x1b[91m props.currentMessage.uri \x1b[0m', props?.currentMessage?.url)

      return (
        <TouchableOpacity onPress={()=>{handleOpenFile(props.currentMessage)}} style={[mainstyles.rowalC, {paddingHorizontal: 10, paddingTop: 5}]}>
          <View style={{padding:10,backgroundColor: THEME.PRIMARY, borderRadius: 50, width: 40, height: 40}}>
            <Icon
              name={'folder'}
              size={20}
              color={'#fff'}
              style={{left:0, bottom:0}}
            />
          </View>
          <View style={{paddingLeft: 5}}>
            <Text style={{fontSize: normalize(10), color: THEME.PRIMARY}}>{name}</Text>
            <Text style={{fontSize: normalize(10), color: THEME.PRIMARY}}>{size}</Text>
          </View>
      </TouchableOpacity>
      )
    } else if (props?.currentMessage?.file_type === 'video') {
      //videoTypes.includes(props?.currentMessage?.file_type)
      // console.log('renderCustomView props.currentMessage', props.currentMessage)
      // console.log('renderCustomView prop isPaused:', isPaused)
      return(
        <VideoCustomView src={props.currentMessage.url} thumb={props.currentMessage?.thumbnail} setSrc={setCurrImage} onOpenModal={setShowVideo}/>
      )
    } else if (props?.currentMessage?.file_type === 'image') {
      // imageTypes.includes(props?.currentMessage?.file_type)
      return(
        <ImageCustomView src={props.currentMessage.url} setSrc={setCurrImage} onOpenModal={setShowModalCurrImage}/>
      )
    } 

  }
  // //* Parts chats ---|

  const appendMessages = useCallback(
    (messagesArr) => {
      // console.log('messagesArr', messagesArr)
      let newarr = messagesArr?.filter(elem => {
        // console.log('elem', elem)
        let res = messages?.find(item => {
          // console.log('item', item, item._id)
          item._id !== elem._id
        })
        // console.log('1 res', res)
        if(res === undefined) {
          // console.log('2 res', res)
          return elem
        }
      })
      // console.log('newarr', newarr)
      let checkRes = newarr.filter((elem) => !!elem)
      // console.log('checkRes', checkRes)
      setMessages((previousMessages) => GiftedChat.append(previousMessages, checkRes))
    },
    [messages]
  )

  // const appendMessages = (messagesArr) => {
  //   const newArr = [...messages, ...messagesArr]
  //     .filter((obj, index, self) => 
  //       index === self.findIndex((item) => item._id === obj._id)
  //   );
  //   console.log('1111newArr', newArr)
  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, newArr))
  // }

  //!!добавление сообщения в чат (поле некоторых точек - само сообщение будет отправлено с сервера)
  const handleSetMsgInChat = (objMsg) => {
    console.log('handleSetMsgInChat objMsg', objMsg)
    let newMsg = { ...objMsg }
    newMsg.user = {
      _id: 1,
      name: userProfileInfo.name,
      avatar: role === 'client' ? userProfileInfo.clientAvatar: userProfileInfo.driverAvatar
    }
    console.log('newMsg', newMsg)

    // //todo set to state
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMsg))
  }

  //!!Send
  async function handleSend(messages) {
    console.log('\x1b[43m%s %s\x1b[0m', 'handleSend messages:', messages)
    
    setMsgLoader(true)
    
   //todo send notif obj

    const msg = {
      read: false,
      text: messages[0].text,
      tenderId: tenderState.id,
      userId: userProfileInfo.id,
      userRole: role,
      partnerId: role === 'driver' ? clientId : driverUserId,
      partnerRole: role === 'driver' ? 'client' : 'driver',
      priceBet: null,
      system: false,
      textSystem: null,
      replyId: null,
      typeMsg: null,
      size: null,
      url: "",
      file_type: null,
      name: null,
      thumbnail: null
    }

    // console.log('msg', msg)

    //если есть файл
    if(messages[0]?.file_type) {
      msg.size = messages[0]?.size
      msg.url = messages[0]?.url
      msg.file_type = messages[0]?.file_type
      msg.name = messages[0]?.name
      msg.thumbnail = messages[0]?.thumbnail ? messages[0]?.thumbnail : ''
    }

    //todo
    //создать сообщение
    //в случе успеха:
    //переформатировать сообщение и добавить в чат

    const response = await post(`messages`,msg)
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      alert(response.error);
      return;
    }

    // console.log('response', JSON.stringify(response.data,null,2))
    // //todo сделать объект сообщения  
    const newMsg = response.data
    // if(newMsg.hasOwnProperty('id')) newMsg._id = newMsg.id
    // if(newMsg.hasOwnProperty('_id')) newMsg._id = newMsg._id
    newMsg.createdAt = convertChatsDate(newMsg.createdAt) //проверить что бы был правильное время
    newMsg.read = convertChatsDate(newMsg.read)
    newMsg.user = {
      _id: 1,
      name: userProfileInfo.name,
      avatar: role === 'client' ? userProfileInfo.clientAvatar: userProfileInfo.driverAvatar
    }
    //todo
    if(newMsg.url && newMsg.url.length > 0 && newMsg.url.includes("http://api-stage.cargogo.pro/upload/messages")) {
      //todo функция которая проверить тип файла и вернет image/video/doc
    //file_type - в нем должен быть тип
      switch (newMsg.file_type) {
        case 'image':
          newMsg.image = newMsg.url
          break;
        case 'video':
          newMsg.video = newMsg.url
          break;
      
        default:
          break;
      }
    }
    console.log('newMsg', newMsg)

    
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMsg))
    setMsgLoader(false)

    // try {
    //   // createNotification(notifObj) //todo
    //   setMsgLoader(false)
    //   setIsLoadingUpload(false)
    //   setProcessing(0)
      
    // } catch (error) {
    //   setMsgLoader(false)
    //   setIsLoadingUpload(false)
    //   setProcessing(0)
    //   console.log('chatscreen fn handleSend -> createNotification error', error)
    // }


    //!!old code

    //todo - надо ли записывать в tenderActive ?
    // if(messages.length===1&& role==='driver') {
    //   //первое сообщение - вкладываем аватарку и имя
    //   msg.userName = profileDriver?.name
    //   msg.driverAvatar = profileDriver?.avatar
    //   msg.rating = userProfileInfo?.rating ? userProfileInfo?.rating : 4.5
    //   msg.textSystem='systemMsg15978461238'

    //   //добавляем в заявку usersIdWithChat
    //   let updateTender = {'usersIdWithChat': firestore.FieldValue.arrayUnion(uid)}
    //   firebeseUpdateTender(tenderState.id,updateTender) 
    //   //добавляем активность по заявки если такой айди нет
    //   try {
    //     let obj = {'driverTenderActivity': firestore.FieldValue.arrayUnion(tenderState.id) }
    //     await firestore()
    //       .collection('forms')
    //       .doc(uid)
    //       .update(obj)
    //       .then(res => {
    //         getDriverTndActv(uid,dispatch,setDriverTenderAvtivity)
    //       })
    //       .catch(e=>console.log('e', e))
        
    //   } catch (error) {
    //     console.log(' CS 261 error', error)
    //   }
    // }
  }

  //!! send system msg
  async function handleSendSystem(message,flag) {
    // console.log('\x1b[43m%s %s\x1b[0m', 'handleSendSystem message:', message,flag)
    setMsgLoader(true)

    const response = await post(`messages`,message)
    if (!response.success) {
      console.log('Ошибка запроса:', response.error);
      // alert(response.error);
      setMsgLoader(false)
      return;
    }

    // console.log('response send system msg', JSON.stringify(response.data,null,2))
    // //todo сделать объект сообщения  
    const newMsg = response.data
    
    newMsg.createdAt = convertChatsDate(newMsg.createdAt)
    newMsg.read = newMsg.read
    newMsg.user = {
      _id: 1,
      name: userProfileInfo.name,
      avatar: role === 'client' ? userProfileInfo.clientAvatar: userProfileInfo.driverAvatar
    }
    console.log('newMsg', newMsg)

    // //todo set to state
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMsg))
    setMsgLoader(false)

    //!!old code
    //todo - подумать на до ли записывать в tenderActive ?
    // let obj = {'driverTenderActivity': firestore.FieldValue.arrayUnion(tenderState.id) }
  }

  //* диалог принятия ставки (с кнопки принять/одобрить)
  const handleOpenDialog = ()=> {
    Keyboard.dismiss()
    if(role==='driver') {
      
      if(carsInfo?.length === 0) {
        setIsShowCarAlert(true)
      } else {

        if(betState===null) {
          //нет ставки
          // console.log('handleOpenDialog 1', )
          setPriceFromDialog(route.params.item.price)
        } else if(betState.clientBetStatus==='wait'&& betState.driverBetStatus==='cancel') {
          // console.log('handleOpenDialog 2', )
          // есть ставка и принимаем предложение клиента
          setPriceFromDialog(betState.betUpdate)
        } else if(betState.driverBetStatus==='wait') {
          // console.log('handleOpenDialog 3', )
          // есть ставка, ставка также отправлена клиенту и принимаем предложение клиента из передыдущей цены //(старое)изначальное из цены заказа 
          setPriceFromDialog(betState?.clientBet)
        } else if(betState.driverBetStatus=== null) {
          console.log('handleOpenDialog 4', betState?.betUpdate, betState.clientBetStatus)
          if(betState?.betUpdate !== null && betState.clientBetStatus==='wait') {
            
            // когда клиент перебил уже принятую ставку водителем
            setPriceFromDialog(betState?.betUpdate)
          } else {
            // когда водитель отменял принятую ставку
            setPriceFromDialog(tenderState?.price)
          }

          //!!
          // console.log('tenderState?.data?.price', tenderState?.data?.price)
        }
        setIsShowConfirmSendBet(true)
      }
    } else if(role==='client' && betState !==null ) {
      console.log('betState', betState)
      if(betState.driverBetStatus==='wait') { 
        console.log('1 betState', betState.betUpdate)
        setPriceFromDialog(betState.betUpdate)
      } else {
        console.log('2 betState', betState.betUpdate)
        setPriceFromDialog(betState.betUpdate)
      }
      setIsShowConfirmSendBet(true)
    }
    
  }

  //* sendBet - ready & test, onAcceprCurrBetByDriver - ready & -, onAcceprCurrTender - ready & test
  //todo - 
  //водитель - принятие ставки sendBet когда нет ставки и onAcceprCurrBetByDriver
  //клиент - одобрить водителя и заявка в работу
  const handleAcceptBet = async(flag) => {
    // console.log('handleAcceptBet', betInput, betInput.length, betState !== null, '123',role === 'client' && betState !== null)
    setIsLoading(true)
    if(role === 'driver') {
      if(betState===null) {
        //!! вариант когда нет ставки и водитель соглашается выполнить заказ

        //todo 1 - создать ставку с полем принял предложение acceptedByDriverAt: true
        setDisableFirstBetBtn(true)
        
        const sendBetResp = await sendBet(
          betInput,
          tenderState,
          userProfileInfo,
          profileClient,
          true

          // setIsLoading,          
          // messageIdGenerator,
          // betInput,
          // tenderState.id, 
          // tenderState.data.name, 
          // tenderState.data.userId, 
          // tenderState.data.price, 
          // uid,
          // dispatch, 
          // true, // быстрая ставка 
          // profileClient.name,
          // profileDriver.name,
          // profileDriver.avatar,
          // userProfileInfo?.rating ? userProfileInfo?.rating : 5.0,
        )
        if(sendBetResp !== null) {
          //отправить сообщение
          // handleSendSystem(sendBetResp.message,'quiqbet')
          //!! добавить сообщение в стейт без отправки
          handleSetMsgInChat(sendBetResp.message)
          setBetState(sendBetResp.data)
          setIsLoading(false)
        } 
        setIsShowConfirmSendBet(false)
        // setIsLoading(false)

      } else if((betState.clientBetStatus==='wait'&&betState.driverBetStatus==='cancel')||(betState.driverBetStatus==='wait')||(betState.driverBetStatus=== null && betState.clientBetStatus==='wait')) {
        
        const responseAccept = await onAcceprCurrBetByDriver(role,priceFromDialog,betState)
        //!! priceFromDialog - вместо betState.betUpdate - так как если водитель сделает ставку а потом примет старцю цену клиента то в betUpdate будет цена ставки водителя

        console.log('responseAccept', responseAccept)

        if(responseAccept !== null && responseAccept !== undefined) {
          setBetState(responseAccept.data)
          //!!сообщение записать в стетт без отправки
          // handleSendSystem(responseAccept.message,'acceptbydriver')
          handleSetMsgInChat(responseAccept.message)
          setIsShowConfirmSendBet(false)
          setIsLoading(false)
        } else {
          setIsShowConfirmSendBet(false)
          setIsLoading(false)
        }
      } 
      //!!old code - оставить и проверить как отрабатывает один if else
      //if (betState.clientBetStatus==='wait'&&betState.driverBetStatus==='cancel') {
        // есть ставка и принимаем предложение клиента и заказ уходит в работу
        // console.log('!!!!!priceFromDialog',priceFromDialog, 'есть ставка и принимаем предложение клиента и заказ уходит в работу')
        //!! решение о принятии заказа в работу принимает клиент
        
      //}else if(betState.driverBetStatus==='wait') {
      //   // есть ставка, ставка также отправлена клиенту и принимаем ставку( будет взята ставка клиента которая была отклонена//25.11.23//(старое)принимаем предложение клиента изначальное из цены заказа 
      //   //!!решение о принятии заказа в работу принимает клиент
      //   onAcceprCurrBetByDriver(role,betState.betUpdate,betState)
      // } else if(betState.driverBetStatus=== null && betState.clientBetStatus==='wait') {
      //   //когда водитель принял и отменил ставку 
      //   onAcceprCurrBetByDriver(role,betState.betUpdate,betState)
      // }
      
    } else if(role === 'client' && betState !== null) {
      // console.log('!!!!!', betState.driverBetStatus,betState.clientBetStatus)
      // если ставки нет то блокировать кнопку пока не появится ставка+
      // есть ставка от водителя и клиент не отправлял свою
      setDisableAcceptBtn(true)
      const resAccept = await onAcceprCurrTender(
        betState,
        tenderState,
      )
      setIsLoading(false)
      console.log('resAccept', resAccept)
      if(resAccept.success && resAccept.data?.message == "Applied to tender successfully") {
        let objForm = userFormsActivities.clientActiveTender.concat([route.params.item.id])
        await setUserActivities(dispatch,{"clientActiveTender": objForm})
        handleNavigateCurrentChat('active')
      } else {
        alert(`${resAccept.data?.message}`)
      }
      // {"message": "Applied to tender successfully"}
      // if(resAccept !== null && resAccept.hasOwnProperty('repl') && resAccept.hasOwnProperty('tender')) {
      //   // отправить сообщение что водитель выбран  и отправиться в чат
      //   //todo добавить в форму id тендера в clientActiveTender
      //   let objForm = userFormsActivities.clientActiveTender.concat([route.params.item.id])
      //   await setUserActivities(dispatch,{"clientActiveTender": objForm})
      //   handleNavigateCurrentChat('active')
      // }
    }
  }

  //*
  //todo - 
  // отмена ставки водителем
  const handleCancelAccept = async() => {
    // alert('handleCancelAccept')
    //todo доделать upd repl на изначальную
    // setIsLoading(true)
    // try {
    //   let bet = betState.driverBet !== null ? betState.driverBet : betState.price
    //   let obj = {
    //     'driverBetStatus' : null,
    //     'driverBet': null,
    //     // 'clientBet' : value,
    //     // 'betUpdate' : value,
    //     'clientBetStatus' : "wait",
    //     'acceptedByDriverAt': null,
    //     'price': route.params.item.price,
    //     'finalBet': null,
    //   }
    //   await firestore()
    //     .collection('replies')
    //     .doc(betState.id)
    //     .update(obj).then(() => {
    //       // alert('Вы успешно отменили принятую ставку')
    //       let msg = {
    //         _id: messageIdGenerator(),
    //         createdAt: firestore.FieldValue.serverTimestamp(),
    //         read: false,
    //         text: 'отменил ставку',
    //         priceBet: bet,
    //         tenderId: tenderState.id,
    //         system: true,
    //         typeMsg: 'cancelAcceptedBet',
    //         userId: uid,
    //         userRole: role,
    //         partnerId: role === 'driver' ? clientId : driverUserId,
    //         partnerRole: role === 'driver' ? 'client' : 'driver'
    //       }
    //       // console.log('msg', msg)
    //       addMsg(msg)

    //       setIsShowCancelDialog(false)
    //       setIsVisibleCancalSucceed(true)
    //       setIsLoading(false)
    //     }).catch((e)=>{

    //       console.log('handleCancelAccept e', e)
    //       // alert('Ошибка. Не удалось отменить ставку, попробуйте позже.')
    //       setIsShowCancelDialog(false)
    //       setIsLoading(false)
    //     })
    //   } catch (error) {
    //     console.log('handleCancelAccept error', error)
    //     // alert('Ошибка. Не удалось отменить ставку, попробуйте позже.')
    //     setIsShowCancelDialog(false)
    //     setIsLoading(false)
    // }
  }
  
  //* tested & ready driver & client
  //todo - протестить
  //!!отправить ставку - кнопка
  const handleSendBet = async(flag) => {
    console.log('handleSendBet', betInput, )
    setIsLoading(true)
    Keyboard.dismiss()

    if(role === 'driver') {
      if(betState===null) {
        console.log('CREATE NEW BET',)
        // setDisableFirstBetBtn(true) //!! надо блокировать кнопку?
        const sendBetResp = await sendBet(
          betInput,
          tenderState,
          userProfileInfo,
          profileClient,
          false
        )
        if(sendBetResp !== null && sendBetResp !== undefined) {
          //!! добавить сообщение в стейт без отправки
          // handleSendSystem(sendBetResp.message,'sendbet')
           handleSetMsgInChat(sendBetResp.message)
          setBetState(sendBetResp.data)
          setBetInput('')
          setShowInput(false)
          setIsLoading(false)
        }
        setIsLoading(false)
        // setDisableFirstBetBtn(false) //!! надо блокировать кнопку?
      } else {
        console.log('UPD NEW BET',)
        // есть ставка и водитель хочет отправить новую цену
        const responseUpd = await updateBet(betInput,betState,role)

        console.log('responseUpd', responseUpd) 

        if(responseUpd !== null && responseUpd !== undefined) {
          //!! добавить сообщение в стейт без отправки
          // handleSendSystem(responseUpd.message,'updbet')
          handleSetMsgInChat(responseUpd.message)
          setBetState(responseUpd.data)
          setBetInput('')
          setShowInput(false)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    }
    if(role === 'client' && betState !== null) {
      const responseUpd = await updateBet(betInput,betState,role)

      console.log('responseUpd', responseUpd) 

      if(responseUpd !== null && responseUpd !== undefined) {
        setBetState(responseUpd.data)
        //!! добавить сообщение в стейт без отправки
        // handleSendSystem(responseUpd.message,'updbet')
        handleSetMsgInChat(responseUpd.message)
        setBetInput('')
        setShowInput(false)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }
    
    
    // setShowInput(false)
  }

  const handleOpenModalHidden = (flag) => {
    Keyboard?.dismiss()
    setIsVisibleMenu(false)
    if(flag==='del') {
      setIsVisibleAskHideChat(true)
    } else {
      setIsVisibleAskRestoreChat(true)
    }
  }

  const handleSetOrResetHidden = async(tenderId,flag,onCloseFn) => {
    //водитель восстановить или скрыть
    console.log('handleSetOrResetHidden start', tenderId,flag,userFormsHiddenTenders)
    // setIsLoading(true)
    flag === 'restore' ? setIsVisibleAskRestoreChat(false) : setIsVisibleAskHideChat(false)
    //todo userFormsActivities заменить на стейт скрытых?
    const key = role ==='driver' ? 'hiddenTenders' : 'hiddenTendersClient'
    // добавить в неактивные или удалить 
    let newArrHidd = [...userFormsHiddenTenders[key]]
    // console.log('newArrHidd', newArrHidd, Array.isArray(newArrHidd))
    // newArrHidd.push(111)
    // const response = await put('forms',{'hiddenTenders': []})
    
    
    if(role === 'client') {
      //todo - клиент - проверка id
      const checkArr =  newArrHidd.find(elem => elem.tenderId === tenderId && elem.userId === driverUserId)
      
      if(flag === 'restore') {
        //restore убрать из key
        newArrHidd = checkArr !== undefined ? newArrHidd.filter(elem => elem.tenderId !== tenderId && elem.userId !== driverUserId) : null
      } else {
        //add to hidden добавить в key
        checkArr !== undefined ? null : newArrHidd.push({tenderId: tenderId, userId: driverUserId})
      }
    } else {
      const checkArr =  newArrHidd.find(elem => elem === tenderId)
      console.log('checkArr', checkArr)
      if(flag === 'restore') {
        //restore убрать из key
        newArrHidd = checkArr !== undefined ? newArrHidd.filter(elem => elem !== tenderId) : null
      } else {
        //add to hidden добавить в key
        checkArr !== undefined ? null : newArrHidd.push(tenderId)
      }

    }
    console.log('to put newArrHidd', newArrHidd)

    if(newArrHidd !== null) {
      let obj = {[key]: newArrHidd}
      setUserHiddenTenders(dispatch,obj)
      // const response = await put('forms',obj)
      // if (!response.success) {
      //   // console.warn('Ошибка запроса:', response.error);
      //   setIsLoading(false)
      //   setIsVisibleAskHideChat(false)
      //   alert(response.error);
      //   return null;
      // }
      // // console.log('------ response.data', response.data)
      // dispatch(setUserFormsHiddenTenders(response.data))
      
      const msgObjBet = {
        partnerId: role==='driver'? clientId : driverUserId, //id клиента
        partnerRole: role==='driver'? 'client' : 'driver',
        read: false,
        tenderId: tenderState.id,
        text: flag ==='restore' ? 'Чат восстановлен': 'Чат добавлен в неактивные',
        textSystem: flag ==='restore' ? 'removeFromHidden': 'addToHidden',
        typeMsg: flag ==='restore' ? 'removeFromHidden': 'addToHidden',
        system: true,
        priceBet: null,
        replyId: null,
        userId: userFormsInfo.id,
        userRole: role==='driver'? 'driver' : 'client',
        size: null,
        uri: null,
        file_type: null,
        name: null,
        thumbnail: null
      }
      handleSendSystem(msgObjBet,'hidden')
    }
    setIsLoading(false)
  }

  const handleOpenProfile = () => {
    Keyboard.dismiss()
    //убрать проверку на archived
    if(role==='client' && tenderState.finishedAt !== null ) {
      if(tenderState.hasOwnProperty('archived') ) {
        tenderState.archived === false ?  setIsVisibleProfileWithTestim(true) : setIsVisibleProfile(true)
        
      } else setIsVisibleProfileWithTestim(true)
    } else {
      setIsVisibleProfile(true)
    }
  }
  
  const handleOpenBetInput = () => {
    if(role === 'driver') {

      if(carsInfo?.length ===0) {
        setIsShowCarAlert(true)
      } else {
        setShowInput(true)
        Keyboard.dismiss()
      }
    } else {
      setShowInput(true),Keyboard.dismiss()
    }
  }

  //меню
  const handleOpenModal = () => {
    setIsVisibleMenu(false)
    setIsVisibleForm(true)
  }

  const handleSendComplain = async (data,description) => {
    console.log('handleSendComplain start data',data,description?.trim())
    setIsVisibleForm(false)
    setIsLoading(true)

    try {
      const partnerInfo = await get(`users/${route.params.userInfo.userId}`)
      if (!partnerInfo.success) {
        // console.warn('Ошибка запроса:', response.error);
        setIsLoading(false)
        alert(`partnerInfo errorr: ${partnerInfo.error}`)
        return null;
      }
      console.log('partnerInfo', partnerInfo.data)
      const responseCompl = await sendComplain(data,description,userProfileInfo,partnerInfo.data,tenderState.id,'chat')
      if (responseCompl === null) {
        // console.warn('Ошибка запроса:', response.error);
        setIsLoading(false)
        alert(`responseCompl errorr: ${responseCompl.error}`)
        return null;
      }
  
      setIsLoading(false)
      setIsVisibleFormSucceed(true)
    } catch (error) {
      console.log('handleSendComplain', error)
      alert(`catch errorr: ${error}`)
      setIsLoading(false)
    }

    // try {
    //   // const opponentInfo = {fullName: 'qwe1', email: 'qwe@qwe.ww', phone: '123', userComplaintsCounter: 0}
    //   const opponentInfo = await getProfileUserInfoForComplaint(tenderState.data.userId)
    //   const allComplaintsForOpponent = await getAllComplaints(tenderState.data.userId)
    //   // console.log('opponentInfo', opponentInfo)
    //   // console.log('allComplaintsForOpponent', allComplaintsForOpponent)

    //   let obj = {
    //     createdAt: firestore.FieldValue.serverTimestamp(),
    //     description: {...data, description: description !== undefined ? description?.trim() : ''},
    //     tenderId: tenderState.id,
    //     rating: 0,
    //     status: 'open',
    //     sourceSending: 'chat',
    //     comment: [],
    //     userInfo: {
    //       fullName: userProfileInfo.fullName, 
    //       email: userProfileInfo?.email !== undefined ? userProfileInfo?.email : '', 
    //       phone: userProfileInfo?.phone
    //     },
    //     opponentInfo: {
    //       fullName: opponentInfo.fullName, 
    //       email: opponentInfo?.email !== undefined ? opponentInfo?.email : '', 
    //       phone: opponentInfo?.phone
    //     },
    //     userComplaintsCounter: userProfileInfo?.userComplaintsCounter,
    //     opponentComplaintsCounter: allComplaintsForOpponent,
    //     userId: uid,
    //     opponentId: tenderState.data.userId
    //   }

    //   //opponentComplaintsCounter - кол-во жалоб отправленное на оппонента

    //   // console.log('obj', obj)

    //   //! send obj to firebase
    //   await firestore()
    //   .collection('complaints')
    //   .add(obj)
    //   .then(res => {
    //     //!up counter in firebase profile
    //     firestore()
    //       .collection('forms')
    //       .doc(uid)
    //       .update({'profile.userComplaintsCounter': firestore.FieldValue.increment(1)})
    //       .then(documentSnapshot => {
    //         //!get new profile
    //         getDetailProfile(uid,dispatch,userProfileInfo)
    //         //!show modal
    //         setIsLoading(false)
    //         setIsVisibleFormSucceed(true)
    //         // console.log('documentSnapshot', documentSnapshot)
            
    //       }).catch(err => {
    //         setIsLoading(false)
    //         console.log('userComplaintsCounter', err)
    //       })
    //   })

      
    // } catch (error) {
    //   console.log('handleSendComplain error', error)
    //   setIsLoading(false)
    // }
  }
  const handlerSetBet = (betState,currentChatReplState) => {
    //если в роли клиента прийдет ставка новая?
    // if(betState == null) return;
    console.log('handlerSetBet betState', betState, 'currentChatReplState',currentChatReplState)
   if (currentChatReplState !== null) {
      setBetState(currentChatReplState)
      dispatch(setCurrentChatReplState(null))
   }
  }
  const addTenderActivity = (messagesArr,activities) => {
    // console.log('addTenderActivity', activities.driverTenderActivity)
    let checkArrAct = activities.driverTenderActivity.includes(tenderState.id)
    if(checkArrAct) return
    let checkArrMsg = messagesArr.find(elem => {return elem.userId === userProfileInfo.id})
    // console.log('checkArrMsg', checkArrMsg, 'checkArrAct', checkArrAct)
    if(checkArrMsg !== undefined && checkArrAct === false) {
      //есть сообщения и нет в активностях
      //обновить активности
      let obj = {'driverTenderActivity': activities.driverTenderActivity.concat([tenderState.id])}
      setUserActivities(dispatch,obj)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // console.log('onBackPress ',)
        if (true) {
          navigation.goBack()
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  //профили и стейт заявки
  useEffect(()=> {
    onRouteParamsSet(route)
  },[route])

  useEffect(()=> {
      console.log('\x1b[42m%s %s\x1b[0m','UE msgStateReady', msgStateReady)
  },[msgStateReady])

  useEffect(()=> {
    // console.log('CS useEffect ', currentChatMsgState?.length, typeof(currentChatMsgState))
    console.log('CS if  msgStateReady', msgStateReady)
    //  
    if(currentChatMsgState?.length > 0 && profileClient !== null && profileDriver !== null && msgStateReady === true) {
      console.log('CS if  currentChatMsgState?.length', currentChatMsgState?.length,'msgStateReady',msgStateReady)
      const uniqueFromArr = currentChatMsgState.filter(
        item => !messages.some(msg => msg._id === item._id)
      );
      console.log('uniqueFromArr', uniqueFromArr)
      // onSetMessagesFromState({messages: uniqueFromArr},profileClient,profileDriver,role)
      onSetMessagesFromState(uniqueFromArr,profileClient,profileDriver,role)
    }
  },[currentChatMsgState,profileClient,profileDriver,msgStateReady])
  
  // useEffect(()=> {
  //   LogBox.ignoreLogs(['Warning: Encountered two children with the same key,'])
  //   console.log('messages', messages)

  // },[])

  useEffect(()=> {
    if(informerState.length > 0 || informerActiveState.length > 0 || informerRoutesState.length > 0) {
      
      updateInformers(dispatch,route.params.userInfo.userId,informerState,informerActiveState,informerRoutesState,route.params.item.id,route.params.data.messages)
    }
  },[route])

  useEffect(()=> {
    handlerSetBet(betState,currentChatReplState)
  },[currentChatReplState])

  useEffect(()=>{
    console.log('useEffect NAV to chat', )
    if(role === 'driver') {
      // console.log('useEffect NAV to chat conditions parts', route.params.item.driverId == null, tenderState !== null, tenderState?.driverId !== null, tenderState?.driverId, driverUserId)
      // console.log('useEffect NAV to chat conditions', route.params.item.driverId == null && tenderState !== null && tenderState?.driverId !== null && tenderState?.driverId === driverUserId)
      if(route.params.item.driverId == null && tenderState !== null && tenderState.driverId !== null && tenderState.driverId === driverUserId) {
      // если  заявка отменена то cancel
        handleNavigateCurrentChat('active')
      }
    }
  },[tenderState, route])

  useEffect(()=>{
    if(validateNumberInput(betInput)) {
      setIsDisableBtn(false)
    } else {
      setIsDisableBtn(true)
    }
  },[betInput])

  useEffect(()=>{
    // console.log('betState', )
    if(betState!==null) {
      if((betState.clientBetStatus==='accept' || betState.driverBetStatus==='accept')) {
        setStatusOfBetPrice('accept')
      } else if (role ==='driver' && betState.driverBetStatus==='wait') {
        setStatusOfBetPrice('base')
      } else if (role ==='client' && betState.clientBetStatus==='wait') {
        setStatusOfBetPrice('base')
      } else {
        setStatusOfBetPrice('wait')
      }
    } 
  },[betState,role])

  
  useEffect(()=>{
    // console.log('text', tenderState !== null && renderChat==true)
    if(tenderState !== null && renderChat==false) {setRenderChat(true)}
  },[tenderState])

  useEffect(()=>{
  },[renderChat])

  useEffect(()=>{
    if(role === 'driver' && messages.length > 0 ) {
      addTenderActivity(messages,userFormsActivities)
    }
  },[messages,userFormsActivities])

  useFocusEffect(
    React.useCallback(() => {
      //
      if(currentChatId === null && isfocused) {
        console.log('use effect currentChatId ===null', currentChatId, isfocused)
        dispatch(setCurrentChatId({tenderId: route.params.item.id, userId: route.params.userInfo.userId}))
      }
    }, [currentChatId,route])
  )
  // useEffect(()=>{
  //   if(currentChatId === null && isfocused) {
  //     console.log('use effect currentChatId ===null', currentChatId, isfocused)
  //     dispatch(setCurrentChatId({tenderId: route.params.item.id, userId: route.params.userInfo.userId}))
  //   }
  // },[currentChatId,route])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      
      console.log('\x1b[47m%s %s\x1b[0m','ChatScreen blur ', currentChatId )
      dispatch(setCurrentChatId(null))
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
  const unsubscribeios = navigation.addListener('transitionEnd', (e) => {
    if (!e.data.closing) return;
    console.log('\x1b[47m%s %s\x1b[0m','ChatScreen transitionEnd ', currentChatId )
    dispatch(setCurrentChatId(null))
  });
  return unsubscribeios;
}, [navigation]);

  // useEffect(()=>{
  //   return () => {
  //     dispatch(setCurrentChatId(null))
  //   }
  // },[])

  useEffect(()=>{
    console.log('useEffect,userFormsHiddenTenders', )
    if(tenderState !== null) {
      if(role === 'driver') {
        let filterHidden = userFormsHiddenTenders.hiddenTenders && userFormsHiddenTenders.hiddenTenders.find(item=>item===tenderState.id)
        filterHidden === undefined ? setIsHidden(false) : setIsHidden(true)
        console.log('filterHidden', filterHidden)
      } else {
        let filterHidden = userFormsHiddenTenders.hiddenTendersClient && userFormsHiddenTenders.hiddenTendersClient.find(item=>item.tenderId===tenderState.id && item.userId === driverUserId)
        filterHidden === undefined ? setIsHidden(false) : setIsHidden(true)
        // console.log('filterHidden', filterHidden)
      }
    }
  },[tenderState,userFormsHiddenTenders])

  //*когда находишься в чате и приходят сообщения - они фильтруются из стейта непрочитаных в редкасе
  //!!добавить прочитку информеров
  // useEffect(()=> {
  //   if(messages.length > 0 && tenderState !== null) {
  //     //!!проверка информеров
  //     // console.log('stateOfInformersActive', stateOfInformersActive)
  //     // console.log('stateOfInformers', stateOfInformers)
  //     if(tenderState.data.driverId === null && tenderState.data.archived === false) {
  //       let result = stateOfInformers?.find(elemFind => elemFind.tenderId === tenderIdFromRoute && elemFind.userId === driverUserId)
  //       if (result !== undefined) {
  //         // console.log('CS stateOfInformers result', result)
  //         dispatch(updInformerState([{tenderId: tenderIdFromRoute, userId: driverUserId, createdAt: result?.createdAt}]))
  //       }
  //       if(role =='driver') {
  //         // информероы от маршрутов
  //         let resultRoutes = stateOfInformersRoutes?.find(elemFind => {
  //           console.log('elemFind', elemFind)
  //           console.log('tenderIdFromRoute', tenderIdFromRoute)
  //           console.log('elemFind.tenderId === tenderIdFromRoute && elemFind.userId === clientId', elemFind.tenderId === tenderIdFromRoute && elemFind.userId === clientId)
  //           if(elemFind.tenderId === tenderIdFromRoute && elemFind.userId === clientId) {
  //             console.log('return', elemFind)
  //             return elemFind
  //           }
  //         })
  //         console.log('++++resultRoutes', resultRoutes, tenderIdFromRoute, driverUserId)
  //         if (resultRoutes !== undefined) {
  //           // console.log('++++resultRoutes', resultRoutes)
  //           //!! тут по одному а надо массив
  //           dispatch(updInformerRoutesState([{tenderId: tenderIdFromRoute, userId: clientId, createdAt: resultRoutes?.createdAt}]))
  //         }
  //       }
        
  //     }
  //     console.log('tenderState.data.driverId !== null', tenderState?.data.driverId !== null)
  //     if(tenderState.data.driverId !== null){
  //       let result = stateOfInformersActive?.find(elemFind => elemFind.tenderId === tenderIdFromRoute && elemFind.userId === driverUserId)
  //       // console.log('result', result)
  //       if (result !== undefined) {
  //         // console.log('CS stateOfInformersActive result', result)
  //         dispatch(updInformerActiveState([{tenderId: tenderIdFromRoute, userId: driverUserId, createdAt: result?.createdAt}]))
  //       }        
  //     }
  //   }
  // },[messages,tenderState,])

  // console.log('!!!!!!!!!!!!!!tenderState!!!!!!!!!!!',tenderState)
  console.log('---------Render-----------')


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
    <View style={[styles.container,Platform.OS==='ios' ? {opacity: 1}: {}]}>
      <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', 
        backgroundColor: 'trnasparent', width:'100%',paddingHorizontal:10,paddingTop: safeInsets.top+5 }}>
        <TouchableOpacity onPress={()=>{handleOnPressBack('back')}} style={{backgroundColor: 'transparent',paddingRight:10, height: 36,width: '13%', justifyContent: 'center'}}>
          <BackArrow />
        </TouchableOpacity>
        {
          tenderState!==null?
          <TouchableOpacity onPress={()=>{handleOnPressBack('title')}} style={{backgroundColor: 'transparent',width: '74%', alignItems: 'center'}}>
            <Text style={{color:THEME.MAIN_COLOR, fontSize: normalize(16)}} numberOfLines={1} ellipsizeMode='tail'>{route?.params?.item?.name}</Text>
          </TouchableOpacity>
          : null
        }
        <TouchableOpacity style={styles.menuDots} onPress={()=>setIsVisibleMenu(prev => !prev)}>
          <IconMenuDots />
        </TouchableOpacity>
      </View>
      {
        tenderState!==null ?
        <>
          <View style={{backgroundColor: '#ffffff',paddingBottom: 10}}>
            {__DEV__ && <DefaultBtn title={'test'} onPress={handleNavigateCurrentChat}/>}
            <View style={[styles.row,styles.wrapper]}>
              <TouchableOpacity style={styles.imgContainer} 
                activeOpacity={1}
                onPress={()=>handleOpenProfile()} //todo профиль - точка показать транспорт если водитель, остальное передавать route.params.data.forms
                // onPress={()=>{}}
                >
                <View style={[styles.avatarWrapper,mainstyles.shadowG5r8]}>
                  {
                    route.params.userInfo.avatar ?
                      <Image source={{uri: route.params.userInfo.avatar }} style={styles.img}/>
                      :
                      <View style={[styles.img,{backgroundColor: '#ffffff'}]}>
                        <Icon name="camera" size={20} color={THEME.PRIMARY} />
                      </View>
                    }
                      <View style={[styles.starContainer]}>
                        <Text style={[mainstyles.text10R,styles.starText]}>{route.params.userInfo?.rating}</Text>
                        <IconStarSmallFill color={THEME.YELLOW}/>
                      </View>
                </View>
                </TouchableOpacity>
                <View style={[{width: '80%',justifyContent: 'center'}]}>
                  <View style={[mainstyles.rowalCjcSb, styles.content]}>
                    <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>Предложенная цена</Text>
                    {
                      betState===null ?
                        <View style={[mainstyles.bagePriceContainer,role==='driver' ? mainstyles.bagePriceWait: mainstyles.bagePriceBase]}>
                          <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{route.params.item.price} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
                        </View>
                      :
                      <View style={[{}, mainstyles.rowalCjcC]}>
                        {
                          role==='driver' ?
                          <>
                            {
                              betState.driverBetStatus==='cancel' ?
                              <>
                                {
                                    betState.driverBet !== 0 ?
                                  <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                    <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.driverBet} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12,}]}> BYN</Text></Text>
                                  </View>
                                  : null
                                }
                              
                              </>
                              :
                              <>
                                {
                                  betState.driverBetStatus !==null ?
                                  <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                    <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.clientBet} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12,}]}> BYN</Text></Text>
                                  </View>
                                  : null

                                }
                              </>
                            }
                          </>
                          :
                          <>
                          {
                            //когда водитель делает первую ставку
                            betState.clientBetStatus==='cancel'?

                            <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                              <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.clientBet} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12,}]}> BYN</Text></Text>
                            </View>
                            :
                            <>
                              {
                                betState.driverBet === 0 ?
                                null
                                :
                                <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                  <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through', }]}>{betState.driverBet} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12,}]}> BYN</Text></Text>
                                </View>
                              }
                            </>
                          }
                          </>
                        }
                        <View style={[{marginLeft: 10},mainstyles.bagePriceContainer,statusOfBetPrice==='accept'?mainstyles.bagePriceAccept:(statusOfBetPrice==='wait'?mainstyles.bagePriceWait:mainstyles.bagePriceBase)]}>
                          <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{betState.betUpdate} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
                        </View>
                      </View>
                    }
                  </View>
                  {
                    betState!==null ?
                    <View style={[mainstyles.rowalCjcSb, styles.content]}>
                      <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>Стартовая цена</Text>
                      <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                        <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{route.params.item.price} <Text style={[{color: THEME.GREY800,  fontSize: normalize(8),lineHeight: 12}]}> BYN</Text></Text>
                      </View>
                    </View>
                    : null
                  }
                </View>
            </View>
            {
              tenderState !== null && tenderState.driverId === null && tenderState?.archived === false ?
              <>
                {
                  role==='client' && betState===null ?
                  null
                  :
                  <>
                    {
                      !showInput ? 
                      <>
                        {
                          isHidden===true ? 
                          null
                          :
                          <View style={[mainstyles.rowalCjcSb,mainstyles.pH10]}>
                            {
                              role==='client' ?
                              <>
                                {
                                  betState !==null && betState.acceptedByDriverAt !== false ?
                                  <DefaultBtnOutline title={'Одобрить'} 
                                    disabled={isDisableAcceptBtn} 
                                    onPress={handleOpenDialog} 
                                    customStyle={[{borderColor:  role==='client' && betState.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN, height: 40, paddingVertical: 0, elevation: 10,shadowColor: THEME.PRIMARY,},mainstyles.shadowPr10]}
                                  />
                                  :
                                  <DefaultBtnOutline title={'Принять ставку'}
                                    disabled={role==='client' && betState.clientBetStatus==='wait'} 
                                    onPress={handleOpenDialog} 
                                    customStyle={[{height: 40, paddingVertical: 0,borderColor:  role==='client'&&betState.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
                                    />
                                }
                                <DefaultBtnOutline disabled={isLoading} title={'Предложить свою'} onPress={handleOpenBetInput} customStyle={[{height: 40, paddingVertical: 0,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}/>
                              </>
                              : 
                              <>
                                {
                                  betState !==null && betState.acceptedByDriverAt !== false ?
                                  // true ?
                                  <DefaultBtnOutline title={'Ваш отклик отправлен заказчику. После одобрения Вам станет доступен его телефон'} 
                                    disabled={true}
                                    onPress={()=>{Keyboard.dismiss(),setIsShowCancelDialog(true)}} 
                                    customStyle={[{alignSelf: 'center',width: '100%', height: 50,paddingVertical: 0, borderRadius: 60, paddingHorizontal: 10, borderColor: THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
                                    textStyles={mainstyles.text14R}
                                    />
                                  :
                                  <>
                                    <DefaultBtnOutline title={'Принять ставку'}
                                      disabled={role==='client' && betState.clientBetStatus==='wait'} 
                                      onPress={handleOpenDialog} 
                                      customStyle={[{height: 40, paddingVertical: 0,borderColor:  role==='client'&&betState.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
                                      />
                                    <DefaultBtnOutline  disabled={disableFirstBetBtn} title={'Предложить свою'} onPress={handleOpenBetInput} customStyle={[{height: 40, paddingVertical: 0,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}/>
                                  </>
                                }
                              </>
                            }
                          </View>
                        }
                      </>
                      :
                      <View style={[mainstyles.rowalCjcSb,mainstyles.pH10, styles.inputBetContainer]}>
                        <TextInput
                          ref={inputRef}
                          style={[styles.inputBet,mainstyles.shadowG5r5,]}
                          value={betInput}
                          keyboardType='number-pad'
                          onChangeText={setBetInput}
                        />
                        <DefaultBtn title={'Отправить'} disabled={isDisableBtn} onPress={handleSendBet} customStyle={styles.inputBetBtn}/>
                        <BtnIconTrs onPress={()=>{setShowInput(false)}}>
                          <Icon name='cross' size={26} color={THEME.GREY400}/>
                        </BtnIconTrs>
                      </View>
                    }
                  </>
                }
              </>
              : 
              <>
                { role ==='client' && tenderState.driverId !== null && tenderState.driverId === driverUserId ?
                  <View style={[mainstyles.pH10]}>
                    <DefaultBtnOutline title={'Позвонить перевозчику'} onPress={()=>handlerCallNumer(route.params.userInfo.phone)} customStyle={{height: 40, paddingVertical: 0,borderColor: THEME.BRIGHT_GREEN,elevation: 20,shadowColor: THEME.PRIMARY}}/>
                  </View>
                  : 
                  null
                }
                
                {
                  role ==='driver' && tenderState.driverId === userProfileInfo.id ? 
                    <View style={[mainstyles.pH10]}>
                      <DefaultBtnOutline title={'Позвонить заказчику'} onPress={()=>handlerCallNumer(route.params.userInfo.phone)} customStyle={{height: 40, paddingVertical: 0,borderColor: THEME.BRIGHT_GREEN,elevation: 20,shadowColor: THEME.PRIMARY}}/>
                    </View>
                  :
                  null
                }
                { role ==='client' && tenderState.driverId !== null && tenderState.driverId === driverUserId && tenderState.finishedAt !== null && 
                (tenderState.hasOwnProperty('archived') && tenderState.archived === false || !tenderState.hasOwnProperty('archived')) 
                ?
                  <View style={[mainstyles.pH10, {paddingTop: 10}]}>
                    <DefaultBtn title={'Подтвердить завершение выполненного заказа перевозчиком'} onPress={()=>setIsVisibleProfileWithTestim(true)} customStyle={{width: '100%', height: 50, paddingVertical: 0,elevation: 20,shadowColor: THEME.PRIMARY}}/>
                  </View>
                  :
                  null
                }
              </>
            }
          </View>

        </>
        : null
      }
    </View>
    <View style={{
      flex:1,
      backgroundColor: '#fff',
      
    }}>

    {
      renderChat ? 
        <GiftedChat
          ref={chatRef}
          disableComposer={isHidden}
          textInputProps={{ref: inputChatRef,}}
          placeholder={isHidden ? '' : 'Введите сообщение...'}
          locale='ru'
          timeFormat={'HH:mm'}
          messagesContainerStyle={[
            styles.chatContainer,
            mainstyles.shadowG5r8,
          ]}
          user={role == 'driver' ? profileDriver : profileClient}
          renderUsernameOnMessage={true}
          messages={messages}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderBubble={renderBubble}
          renderSystemMessage={renderSystemMessage}
          renderCustomView={renderCustomView}
          renderDay={renderDay}
          renderActions={(props) => !isHidden ? <Actions onSend={handleSend} setProcessing={setProcessing} setUploadProgress={setIsLoadingUpload} uid={userProfileInfo.id} setAbortController={setAbortController} {...props} /> : <></>}
          onSend={handleSend}
          alwaysShowSend
          showUserAvatar={false}
          keyboardShouldPersistTaps='never'
          isKeyboardInternallyHandled={false} //убирает расстояние между клавиатурой и инпутом
          // bottomOffset={100}
          // minInputToolbarHeight={Platform.OS==='android'  ? 60 : undefined}
          // minInputToolbarHeight={Platform.OS==='android' && isKeyboardShown ? 60 : undefined}
        />
        : null
    }
    </View>
    {
      isVisibleMenu ?
      <WrapperModalView
        stylesContainer={{}}
        stylesBg={{}}
        stylesMenu={{}}
        safeInsets={safeInsets}
        onClose={()=>setIsVisibleMenu(false)}
      > 
        <MenuListComponentChat
          isHidden={isHidden}
          onPressHidden={handleOpenModalHidden}
          onPressComplain={handleOpenModal}
        />
      </WrapperModalView>
      : null
    }
    {
      isVisibleCancalSucceed  ?
        <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'cancelTenderBet',cancelTenderBet)} onPress={()=>setIsVisibleCancalSucceed(false)}/>
        </View>
      : 
      null
    }
    {
      isShowCarAlert ?
      <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
        <InfoAskWindow
          data={findJsonObj(jsonDataPrompt,'offer_a_bid_popup', offerBid)} 
          onPress={handleNavToProfile} 
          onClose={()=>setIsShowCarAlert(false)}/>
      </View>
      : null
    }
    {
      isShowConfirmSendBet ?
      <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
        <InfoAskWindow
          disabled={isLoading}
          data={{title: 'Принять ставку', text: `Вы согласны с условиями сделки? \n Цена сделки: ${priceFromDialog} BYN`, button1:'Согласен', button2:'Отменить'}} 
          onPress={handleAcceptBet} 
          onClose={()=>setIsShowConfirmSendBet(false)}/>
      </View>
      : null
    }
    {
      isVisibleAskHideChat ?
      <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
        <InfoAskWindow
          disabled={isLoading}
          data={findJsonObj(jsonDataPrompt,'auction_popup',auctionPopup)} 
          onPress={()=>handleSetOrResetHidden(tenderState.id,'del')} 
          onClose={()=>setIsVisibleAskHideChat(false)}/> 
      </View>
      : null
    }
    {
      isVisibleAskRestoreChat ?
      <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
        <InfoAskWindow
          // disabled={isLoading}
          data={findJsonObj(jsonDataPrompt,'restoreChat',restoreChat)} 
          onPress={()=>handleSetOrResetHidden(tenderState.id,'restore')} 
          onClose={()=>setIsVisibleAskRestoreChat(false)}/>
      </View>
      : null
    }
    {
      isShowCancelDialog ?
      <View style={[mainstyles.containerModalGgBl, mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
        <InfoAskWindow
          disabled={isLoading}
          data={findJsonObj(jsonDataPrompt,'waitingAnswer',waitingAnswer)} 
          onPress={handleCancelAccept} 
          onClose={()=>setIsShowCancelDialog(false)}/>
      </View>
      : null
    }
    {
      isVisibleProfile && tenderState!==null ?
      <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top,height: height+safeInsets.top, zIndex: 99999}]}>
        <ProfileInfo role={role} userInfo={route.params.userInfo} onClose={()=>{setIsVisibleProfile(false)}}/>
      </View>
      :null
    }
    {
      isVisibleProfileWithTestim && tenderState!==null ?
      <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top,height: height+safeInsets.top, zIndex: 99999}]}>
        <ProfileInfoWithTestimonial
          partnerProfile={route.params.data.forms}
          tenderState={tenderState}
          onClose={()=>{setIsVisibleProfileWithTestim(false)}}
          onPress={()=>setIsShowSucceed(true)}
        />
         {/* переделать - как  скрине заявки водителя */}
      </View>
      :null
    }
    {
      isShowSucceed ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTender',finishTender)} onPress={handleNavToArchive}/>
        </View>
      : 
      null
    }
    {
      isVisibleFormSucceed ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'complaintSucceed',complaintSucceed)} onPress={()=>setIsVisibleFormSucceed(false)}/>            
        </View>
      : 
      null
    }
    {
      isVisibleForm ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
          <ComplaintComponent
            onPress={handleSendComplain}
            onClose={()=>{setIsVisibleForm(false)}}
          />
          
        </View>
      : 
      null
    }
    {
      isLoading ? 
      <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
        <ActivityIndicator color='#ffffff' size='large'/>
      </View>
      : null
    }
    {
      isLoadingUpload ? 
      <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
        <Text style={[mainstyles.text13R,{color: '#ffffff'}]}>Загрузка файла... </Text><ActivityIndicator color='#ffffff' size='large'/>
        {/* {processing}% */}
        {/* <DefaultBtn
          title="Отменить загрузку" 
          // color="#ff4444"
          customStyle={{backgroundColor: THEME.REDERR}}
          onPress={() => {
            abortController?.abort();
            setIsLoadingUpload(false);
            setAbortController(null);
          }} 
        /> */}
      </View>
      : null
    }
    <Modal visible={showModalCurrImage} 
      animationType='fade' 
      transparent
      onRequestClose={()=>setShowModalCurrImage(false)} >
        <ImageCustomModal 
          currImage={currImage}
          onClose={setShowModalCurrImage}
          />
    </Modal>

    <Modal visible={showVideo} 
      animationType='fade' 
      transparent
      onRequestClose={()=>setShowVideo(false)} >
      <VideoCustomModal
          custStylesPadding={safeInsets?.top}
          currImage={currImage}
          onPlayVideo={handlePlayVideo}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onClose={setShowVideo}
      />
    </Modal>

    {/* что бы не было прасстояния между клавиатурой и инпутом */}
    <KeyboardAvoidingView 
        behavior='padding'
        keyboardVerticalOffset={keyboardVerticalOffset} 
        // style={{backgroundColor:'red',}}
    />
    {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior={"padding"}
    // "padding" 
      // keyboardVerticalOffset={safeInsets?.bottom+50} 
      style={{backgroundColor:'#ffffff',
      // backgroundColor: 'red',
      opacity: 0.5}}
    />} */}

      </>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: '100%',
    backgroundColor: '#ffffff',
    // backgroundColor: 'blue',
    // paddingBottom: 20,
  },
  container11: {
    flex: 1,
    // height: '100%',
    backgroundColor: 'pink',
    // backgroundColor: 'blue',
    // paddingBottom: 20,
  },
  chatContainer: {
    // flexGrow: 1,
    // flex:1,
    // height: '95%',
    // overflow: 'hidden',
    backgroundColor: '#ffffff',
    // backgroundColor: 'pink',
    borderRadius: 20,
    elevation: 10,
    marginHorizontal: 11,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // marginBottom: 20
    // alignSelf: 'flex-end',
  },
  sendInput: {
    // position: 'relative', //не дает закрывать первое сообщение контейнера снизу
    // verticalAlign: 'top',

    // backgroundColor: 'red',
    // marginBottom: 20
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.GREY100,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: 'pink',
    padding: 10,
  },
  content: {
    // backgroundColor: 'yellow',
    paddingVertical: 5,
  },
  imgContainer: {
    width: '20%',
    // backgroundColor: '#ffffff'
  },
  inputBetContainer: {
    position: 'relative',
    width: '90%',
  },
  inputBet: {
    width: '100%',
    height: 40,
    borderRadius: 30,
    backgroundColor:'#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 4,
    elevation: 20,
    color: THEME.GREY700,
    shadowColor: THEME.PRIMARY,
  },
  inputBetBtn: {
    position: 'absolute',
    height: 40,
    paddingVertical: 5,
    top: 0,
    right: 10,
    width: '50%'
  },
  btnSend: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 100,
    borderRadius: 23,
    paddingVertical: 4,
    marginBottom: 4,
    backgroundColor: THEME.PRIMARY,
    elevation: 12,
    shadowColor: THEME.PRIMARY,
    shadowOffset:{width:1,height:2}
  },
  borderBlock: {
    borderWidth:1,
    borderRadius: 20,
    alignSelf: 'center',
    width: '90%',
    borderColor: THEME.GREY500,
  },
  borderBlockFeedback: {
    padding: 10,
    paddingHorizontal: 20    
  },
  borderBlockBet: {
    paddingVertical: 6, 
    paddingHorizontal: 8, 
    alignItems: 'flex-start'
  },
  smallavatar: {
    width:33,
    height:33,
    borderRadius: 20,
    borderColor: THEME.GREY400,
    borderWidth:1, 
  },
  starContainer: {
    position: 'absolute',
    bottom: 0,
    right: -7,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    color: '#000',
    lineHeight: 11,
    position: 'absolute',
    bottom: 7,
    // backgroundColor: 'red',
    zIndex: 2
  },
  avatarWrapper: {
    width:60,
    height:60,
    elevation: 15,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  menuDots: {
    // backgroundColor: 'red',
    width:'13%',
    paddingLeft: 10,
    height:40,    
    justifyContent: 'center',
    alignItems: 'center'
  },
});