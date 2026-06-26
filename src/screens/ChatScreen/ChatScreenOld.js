import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions,Modal, Text, TouchableOpacity, Keyboard,TextInput, Alert, Linking, Image, KeyboardAvoidingView, LogBox, BackHandler, StatusBar, Platform, ActivityIndicator, TouchableWithoutFeedback, SafeAreaView } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { GiftedChat, Send, Bubble, Day,InputToolbar, Avatar, Composer } from 'react-native-gifted-chat';
import { useSelector, useDispatch } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";


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
import { userProfileInfo } from '../../store/features/loginSlice';
import Actions from '../../components/ChatComponents/Actions';
import { ImageCustomView } from '../../components/ChatComponents/customMedia/ImageCustomView';
import { VideoCustomView } from '../../components/ChatComponents/customMedia/VideoCustomView';
import { VideoCustomModal } from '../../components/ChatComponents/customMedia/Modals/VideoCustomModal';
import { ImageCustomModal } from '../../components/ChatComponents/customMedia/Modals/ImageCustomModal';

export const ChatScreenOld = ({route, navigation}) => {
  console.log('ChatScreen ---render start getstate---','navigation.getState()')
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid  
  const chatRef=useRef()
  const inputChatRef=useRef(null)
  const inputRef=useRef(null)
  const role = useSelector(state => state.login.role)
  const driverRoutesOffers = useSelector((state) => state.user.driverRoutesOffers)
  const myProfileInfo = useSelector(state => state.login.userProfileInfo)
  const hiddenTender = useSelector((state) => state.user.hiddenTender)
  const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient)
  const stateOfMsg = useSelector((state) => state.chats.msgState)
  const stateOfInformers = useSelector((state) => state.chats.informerState)
  const stateOfInformersActive = useSelector((state) => state.chats.informerActiveState)
  const stateOfInformersRoutes = useSelector((state) => state.chats.informerRoutesState)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const carsInfo = useSelector(state=>state.login.carsInfo)
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen stateOfInformers ', stateOfInformers)
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen stateOfInformersActive ', stateOfInformersActive)
  // console.log('\x1b[42m%s %s\x1b[0m','ChatScreen stateOfInformersRoutes ', stateOfInformersRoutes)
  
  // console.log('ChatScreen hiddenTenderClient ', hiddenTenderClient)
  const tenderIdFromRoute = route.params?.item.id
  const chatsRef = ()=>{}//().collection('messages')
  
  const [tenderState, setTendeState] = useState(null)
  const [routeState, setRouteState] = useState(null)
  console.log('----tenderState-----', tenderState)
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
  const [IsLoadingUpload, setIsLoadingUpload] = useState(false)
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
  const [isKeyboardShown, setIsKeyboardShown] = useState(false)
  const [disableFirstBetBtn, setDisableFirstBetBtn] = useState(false)
  const [renderChat, setRenderChat] = useState(false)
  const [isVisibleMenu,setIsVisibleMenu] = useState(false)
  const [isVisibleForm,setIsVisibleForm] = useState(false)
  const [isVisibleFormSucceed,setIsVisibleFormSucceed] = useState(false)

  const [isPaused, setIsPaused] = useState(false);
  const [currImage, setCurrImage] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [showModalCurrImage, setShowModalCurrImage] = useState(false);
  // console.log('profileDriver', profileDriver)
  // console.log('betState', betState)
  console.log('----betState----', betState)
  // console.log('\x1b[42m%s %s\x1b[0m','isHidden', isHidden)
  const dispatch = useDispatch()

  const handlePlayVideo = () => {
    console.log('handlePlayVideo: ', isPaused)
    isPaused ? setIsPaused(false) :  setIsPaused(true) 
  }

  const handleNavigateCurrentChat = async(flag) => {

    let result = await getTenderInfo(tenderIdFromRoute)
    console.log('result', result)
    console.log('handleNavigateCurrentChat flag', flag)

    if(flag ==='cancel') {
      if(role ==='client') {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'TendersTab', 
            state: {
              routes: [
              {
                name: 'Tenders',
              },
              {
                name: 'Chat',
                params: {item: result, userInfo: route.params?.userInfo,}
              },
              
            ]
            }
          }],
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'SearchTab', 
            state: {
              routes: [
              {
                name: 'Search',
              },
              {
                name: 'Chat',
                params: {item: result,}
              },
              
            ]
            }
          }],
        })
      }

    } else {

      if(role ==='client') {
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
                params: {item: result, userInfo: route.params?.userInfo,}
              },
              
            ]
            }
          }],
        })
      } else {
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
                params: {item: result,}
              },
              
            ]
            }
          }],
        })
      }
    }
  }

  const handleNavToProfile = () => {
    setIsShowCarAlert(false),
    // navigation.reset('Profile')
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

  const onRouteParamsSet = (routeState) => {
    // const routeParams = routeState.params
    
    //можно проверять роль и если роль клиент а нету userInfo то не рендерит ничего
    // console.log('routeState.params.hasOwnProperty(userInfo)', routeState.params)
    if(routeState.params !== undefined && routeState.params !== null && tenderState===null) {
      if( role === 'client' && !routeState.params.hasOwnProperty('userInfo')) {
        return
      } else {
        if(routeState.params?.from === 'routes') {
          //если с маршрута то сохранять айди маршрута
          setRouteState(routeState.params?.routeData)
        }
        setTendeState(routeState.params?.item)
        role==='driver'? setDriverUserId(uid) : setDriverUserId(routeState.params?.userInfo.userId)
        setClientId(routeState.params?.item.data.userId)
      }
      setProfiles(routeState.params)
    }
  }

  const setProfiles = async (data) => {
    console.log('data.userInfo.driverAvatar', )
    if( role ==='client') {
      setProfileDriver({
        _id: 2,
        avatar: data.userInfo.driverAvatar !==null && data.userInfo.driverAvatar !== undefined  ?  data.userInfo.driverAvatar  : 'https://firebasestorage.googleapis.com/v0/b/cargo-radar.appspot.com/o/images%2Fuser_profile_dont_delete.png?alt=media&token=ae7030f4-6877-49c6-af6d-37881271a432',
        name: data.userInfo.userName,
      })
      setProfileClient({
        _id: 1,
        avatar: myProfileInfo.clientAvatar !==null && myProfileInfo.clientAvatar !== undefined ? myProfileInfo.clientAvatar : 'https://firebasestorage.googleapis.com/v0/b/cargo-radar.appspot.com/o/images%2Fuser_profile_dont_delete.png?alt=media&token=ae7030f4-6877-49c6-af6d-37881271a432',
        name: myProfileInfo.fullName,
      })

    } else {
      //driver      
      setProfileClient({
        _id: 2,
        avatar: data.item.data.avatar ?  data.item.data.avatar  : 'https://firebasestorage.googleapis.com/v0/b/cargo-radar.appspot.com/o/images%2Fuser_profile_dont_delete.png?alt=media&token=ae7030f4-6877-49c6-af6d-37881271a432',
        name: data.item.data.userName,
      })
      setProfileDriver({
        _id: 1,
        avatar: myProfileInfo.driverAvatar ? myProfileInfo.driverAvatar : 'https://firebasestorage.googleapis.com/v0/b/cargo-radar.appspot.com/o/images%2Fuser_profile_dont_delete.png?alt=media&token=ae7030f4-6877-49c6-af6d-37881271a432',
        name: myProfileInfo.fullName,
      })
    }
  }

  const appendMessages = useCallback(
    (messagesArr) => {
      let newarr = messagesArr?.filter(elem => {
        let res = messages?.find(item => item._id !== elem._id)
        if(res === undefined) {
          return elem
        }
      })
      let checkRes = newarr.filter((elem) => !!elem)
      setMessages((previousMessages) => GiftedChat.append(previousMessages, checkRes))
    },
    [messages]
  )

  const handleOnPressBack = (flag) => {
    // console.log('navigation.getState()', navigation.getState())
    // navigation.goBack()
    console.log('handleOnPressBack flag', flag)
    if(flag === 'title') {

      if(role==='driver') {
        // navigation.navigate('SearchTenderItemScreen',{dataTender: tenderState})
        navigation.navigate('TenderItemScreen',{dataTender: tenderState})  
        
      } else {
        // navigation.navigate('TenderItemClient',{dataTender: tenderState,})
        navigation.reset({
          index: 0,
          routes: [{
            name: 'TendersTab', 
            state: {
              routes: [
              {
                name: 'TenderItemClient',
                params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
                // params: {dataTender: tenderState, userInfo: route.params?.userInfo, from: 'chat'}
              },
            ]
            }
          }],
        })
      }
    } else {
      //если заявка перешла в работу то navigation.goBack() не сработает
      if(role==='driver') { 
        try {
          if(route?.params?.from == 'list') {
            navigation.goBack()
          } else if(route?.params?.from == 'routes'){
            navigation.navigate('RouteItem',{dataTender: routeState, form: 'chat'})
          } else {
            navigation.navigate('TenderItemScreen',{dataTender: tenderState})
          }

        } catch (error) {
          console.log('handleOnPressBack error driver nav', error)
          navigation.navigate('TenderItemScreen',{dataTender: tenderState})
        }
      } else {
        try {
          // navigation.goBack()
          if(route?.params?.from == 'list') {
            navigation.goBack()

          } else {
            navigation.navigate('TenderItemClient',{dataTender: tenderState, userInfo: route.params?.userInfo,})
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

  async function handleSend(messages) {
    console.log('\x1b[43m%s %s\x1b[0m', 'handleSend messages:', messages)
    // console.log('handleSend messages:', messages, 'clientId:', clientId, 'driverUserId:', driverUserId, 'role:', role)
    // console.log('handleSend profiles:', 'profileClient:', profileClient, 'profileDriver:', profileDriver,)
    
    // setMsgLoader(true)
    // // partnerId должен меняться в зависимости от роли
    // const notifObj = {
    //   // createdAt: dateCreare,
    //   createdAtServer: firestore.FieldValue.serverTimestamp(),
    //   type: "newMessageInChat",
    //   tenderName: route?.params?.item.data?.name,
    //   tenderId: tenderState.id,
    //   userName: role==='driver'? profileClient.name : profileDriver.name,
    //   toUser: role==='driver'? clientId : driverUserId,
    //   fromUserName: role==='driver'? profileDriver.name : profileClient.name,
    //   fromUser: role==='driver'? uid : clientId,
    //   userId: role==='driver'? uid : clientId,
    //   message: messages[0].text,
    //   data: {
    //     dataExist: 'yes',
    //     type: 'chat',
    //     tenderName: route?.params?.item.data?.name,
    //     tenderId: tenderState.id,
    //     clientId: clientId,
    //     userId: role==='driver'? uid : driverUserId,  
    //     driverAvatar: profileDriver.avatar,
    //     userName: profileDriver.name,
    //     receiverRole: role === 'driver' ? 'client' : 'driver'
    //   }
    // }
    // // console.log('handleSend notifObj', notifObj)

    const msg = {
      _id: messageIdGenerator(),
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      text: messages[0].text,      
      tenderId: tenderState.id,
      userId: uid,
      userRole: role,
      partnerId: role === 'driver' ? clientId : driverUserId,
      partnerRole: role === 'driver' ? 'client' : 'driver'
    }
    // //если есть файл
    // if(messages[0]?.file_type) {
    //   msg.size = messages[0]?.size
    //   msg.uri = messages[0]?.uri
    //   msg.file_type = messages[0]?.file_type
    //   msg.name = messages[0]?.name
    //   msg.thumbnail = messages[0]?.thumbnail ? messages[0]?.thumbnail : ''
    // }
    // // console.log('!!!!!!!!!', messages.length,myProfileInfo)
    // if(messages.length===1&& role==='driver') {
    //   //первое сообщение - вкладываем аватарку и имя
    //   msg.userName = profileDriver?.name
    //   msg.driverAvatar = profileDriver?.avatar
    //   msg.rating = myProfileInfo?.rating ? myProfileInfo?.rating : 4.5
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
    
    // console.log('msg', msg)
    // // console.log('notifObj', notifObj)

    // const writes = messages.map((m) => chatsRef.add(msg))
    // await Promise.all(writes)
    // try {
    //   createNotification(notifObj)
    //   setMsgLoader(false)
    //   setIsLoadingUpload(false)
    //   setProcessing(0)
      
    // } catch (error) {
    //   setMsgLoader(false)
    //   setIsLoadingUpload(false)
    //   setProcessing(0)
    //   console.log('chatscreen fn handleSend -> createNotification error', error)
    // }
  }

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

  const renderInputToolbar = (props) => {
    // console.log('PROPS in renderInputToolbar',props);

    return (
      <InputToolbar {...props}
        containerStyle={[
          styles.sendInput,mainstyles.shadowG5r8,
        ]}
        renderComposer={()=>(<Composer {...props} textInputStyle={{color: THEME.GREY700, backgroundColor: 'transparent',paddingRight: 40}} />)}
      />
    )
  }

  const renderBubble = (props) => {
    // console.log('renderBubble props',props.currentMessage);
    return (
      <Bubble
        {...props}
        containerStyle={{
          left: {
            // backgroundColor: 'red',            
          },          
          right: {
            // backgroundColor: 'pink',
          },          
        }}
        
        wrapperStyle={{
          left: {
            backgroundColor: THEME.GREY200,
            borderRadius: 15,
          },
          right: {
            borderRadius: 15,
            backgroundColor: 'rgba(94, 173, 255, 0.4)',
            // backgroundColor: props.currentMessage?.file_type ? 'pink': 'red',
          },
        }}
        containerToNextStyle={{
          left: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomLeftRadius: 0
          },
          right: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomRightRadius: 0
          },
        }}
        containerToPreviousStyle={{
          left: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomLeftRadius: 0,
          },
          right: {
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomRightRadius: 0,
          },
        }}
        textStyle={{
          right: {
            color: THEME.GREY700
          },
          left: {
            color: THEME.GREY700
          }
        }}       
        timeTextStyle={{
          right: {
            color: THEME.GREY700,
          },
          left: {
            color: THEME.GREY700,
          }
        }}
      >
      </Bubble>
    )
  }

  const renderCustomView = (props) => {
    

    let name = props?.currentMessage?.name
    let size = props?.currentMessage?.size/1000 + ' Kb'

    const handleOpenFile = async (fileData) => {
      // Create a path for the downloaded file
      const localFile = `${RNFS.DocumentDirectoryPath}/${fileData.name}`;

      try {
        
        // Download the file
        RNFS.downloadFile({
          fromUrl: fileData.uri,
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

    
    if (commonFileTypes.includes(props?.currentMessage?.file_type)) {

      console.log('\x1b[91m props.currentMessage.uri \x1b[0m', props?.currentMessage?.uri)

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
            <Text style={{fontSize: 10, color: THEME.PRIMARY}}>{name}</Text>
            <Text style={{fontSize: 10, color: THEME.PRIMARY}}>{size}</Text>
          </View>
      </TouchableOpacity>
      )
    } else if (videoTypes.includes(props?.currentMessage?.file_type)) {
      // console.log('renderCustomView props.currentMessage', props.currentMessage)
      // console.log('renderCustomView prop isPaused:', isPaused)
      return(
        <VideoCustomView src={props.currentMessage.uri} thumb={props.currentMessage?.thumbnail} setSrc={setCurrImage} onOpenModal={setShowVideo}/>
      )
    } else if (imageTypes.includes(props?.currentMessage?.file_type)) {
      return(
        <ImageCustomView src={props.currentMessage.uri} setSrc={setCurrImage} onOpenModal={setShowModalCurrImage}/>
      )
    } 
  }

  const renderDay = (props) => {
    return(
      <Day 
       {...props}
        dateFormat='DD.MM.YYYY'
         textStyle={{color: THEME.GREY500, }}
       />
    )
  }
  const renderSystemMessage = (props) => {
    // console.log('renderSystemMessage props.currentMessage', props.currentMessage)
    
    {/* {
      props.currentMessage.user.avatar !== null ?
      <Image source={{uri: props.currentMessage.user.avatar}} style={{width:33, height:33, borderRadius: 20,}}/>
      :<View style={[mainstyles.alCjcC, styles.smallavatar]}>
        <Icon name="camera" color={THEME.GREY400} size={18}  />
      </View>
    } */}

    return (
      <View style={[{ width: '100%',alignSelf: 'center', marginVertical: 8,}]}>
        {
          props.currentMessage?.typeMsg==='feedback' ?
          <View style={[styles.borderBlock,styles.borderBlockFeedback]}>
            <View style={[mainstyles.pB5, mainstyles.rowalC]}>
              {
                props.currentMessage.textInfo ==='from'?
                <Text style={[mainstyles.text13R,{paddingRight: 5}]}>Вы оставлили оценку <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>{props.currentMessage?.score}</Text></Text>
                :<Text style={[mainstyles.text13R,{paddingRight: 5}]}>Вам оставлена оценка <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>{props.currentMessage?.score}</Text></Text>
              }
              <IconStarSmallF />
            </View>
            <Text style={[mainstyles.text13R]}>{props.currentMessage.text}</Text>
          </View>
          :
          <>
            {
              props.currentMessage?.typeMsg === 'rejectDriver' ?
              <>
              <View style={[styles.borderBlock,styles.borderBlockBet]}>
                <View style={[mainstyles.rowalC,]}>
                  {
                    props.currentMessage.user._id === 1 ?
                    <Text style={[mainstyles.text13R]}>Вы выбрали другого исполнителя. Чат добавлен в неактивные.</Text>
                    : <Text style={[mainstyles.text13R]}>Клиент выбрал другого исполнителя. Заявка закрыта. Чат добавлен в неактивные.</Text>
                  }
                </View>
              </View>
              </>
              :
              <>
                {
                  (props.currentMessage?.typeMsg==='newBetByDriver' || props.currentMessage?.typeMsg==='newBetByClient' || props.currentMessage?.typeMsg==='offerFromClient') ?
                  <View style={[styles.borderBlock,styles.borderBlockBet]}>
                    <View style={[mainstyles.rowalC,]}>
                      {
                        props.currentMessage.user._id === 1 ?
                        <Text style={[mainstyles.text13R,{ lineHeight: 18,paddingLeft: 10}]}>Вы предложили цену: {props.currentMessage.priceBet} BYN</Text>
                        : 
                        <Text style={[mainstyles.text13R,{ lineHeight: 18,paddingLeft: 10}]}>{props.currentMessage.user.name} предложил цену: {props.currentMessage.priceBet} BYN</Text>
                      }
                    </View>
                  </View>
                  :
                  <>
                  {
                    (props.currentMessage?.typeMsg==='acceptTenderByDriver'||props.currentMessage?.typeMsg==='acceptTenderByClient') ?
                    <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                      <View style={[mainstyles.rowalC,]}>
                        {
                          props.currentMessage.user._id === 1 ?
                          <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>Вы приняли цену: {props.currentMessage.priceBet} BYN</Text>
                          :
                          <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} принял цену: {props.currentMessage.priceBet} BYN</Text>
                        }
                      </View>
                    </View>
                    :
                    <>
                      {
                        (props.currentMessage?.typeMsg==='addToArchFromClient'||props.currentMessage?.typeMsg==='addToArchFromDriver') ?
                        <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                          <View style={[mainstyles.rowalC,]}>
                            {
                              props.currentMessage.user._id === 1 ?
                              <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы добавили чат в неактивные </Text>
                              :
                              <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} добавил чат в неактивные</Text>
                            }
                          </View>
                        </View>
                        : <>
                          {
                            (props.currentMessage?.typeMsg==='removeFromArchFromDriver'||props.currentMessage?.typeMsg==='removeFromArchFromClient') ?
                            <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                              <View style={[mainstyles.rowalC,]}>
                                {
                                  props.currentMessage.user._id === 1 ?
                                  <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>Вы восстановили чат </Text>
                                  :
                                  <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} восстановил чат</Text>
                                }
                              </View>
                            </View>
                          : <>
                            {
                              (props.currentMessage?.typeMsg==='cancelAcceptedBet') ?
                              <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                                <View style={[mainstyles.rowalC,]}>
                                  {
                                    props.currentMessage.user._id === 1 ?
                                    <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы отменили ставку {props.currentMessage.priceBet} BYN </Text>
                                    :
                                    <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} отменил ставку {props.currentMessage.priceBet} BYN</Text>
                                  }
                                </View>
                              </View>
                              : <>
                                {
                                (props.currentMessage?.typeMsg==='orderCanceled') ?
                                <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                                  <View style={[mainstyles.rowalC,]}>
                                    {
                                      props.currentMessage.user._id === 1 ?
                                      <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы отменили выполнение заказа: {props.currentMessage.text}</Text>
                                      :
                                      <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} отменил выполнение заказа: {props.currentMessage.text}</Text>
                                    }
                                  </View>
                                </View>
                                :<>
                                </>
                                }
                              </>
                            }
                            </>
                          }
                        </>
                      }
                    </>
                  }
                  </>
                }
              </>
            }
          </>
        }
      </View>

    )
  }

  const handleOpenDialog = ()=> {
    Keyboard.dismiss()
    if(role==='driver') {
      
      if(carsInfo?.length === 0) {
        setIsShowCarAlert(true)
      } else {

        if(betState===null) {
          //нет ставки
          // console.log('handleOpenDialog 1', )
          setPriceFromDialog(route.params.item.data.price)
        } else if(betState.data.clientBetStatus==='wait'&& betState.data.driverBetStatus==='cancel') {
          // console.log('handleOpenDialog 2', )
          // есть ставка и принимаем предложение клиента
          setPriceFromDialog(betState.data.betUpdate)
        } else if(betState.data.driverBetStatus==='wait') {
          // console.log('handleOpenDialog 3', )
          // есть ставка, ставка также отправлена клиенту и принимаем предложение клиента из передыдущей цены //(старое)изначальное из цены заказа 
          setPriceFromDialog(betState?.data?.clientBet)
        } else if(betState.data.driverBetStatus=== null) {
          console.log('handleOpenDialog 4', betState?.data?.betUpdate, betState.data.clientBetStatus)
          if(betState?.data?.betUpdate !== null && betState.data.clientBetStatus==='wait') {
            
            // когда клиент перебил уже принятую ставку водителем
            setPriceFromDialog(betState?.data?.betUpdate)
          } else {
            // когда водитель отменял принятую ставку
            setPriceFromDialog(tenderState?.data?.price)
          }

          //!!
          // console.log('tenderState?.data?.price', tenderState?.data?.price)
        }
        setIsShowConfirmSendBet(true)
      }
    } else if(role==='client' && betState !==null ) {
      console.log('betState.data', betState.data)
      if(betState.data.driverBetStatus==='wait') { 
        console.log('1 betState.data', betState.data.betUpdate)
        setPriceFromDialog(betState.data.betUpdate)
      } else {
        console.log('2 betState.data', betState.data.betUpdate)
        setPriceFromDialog(betState.data.betUpdate)
      }
      setIsShowConfirmSendBet(true)
    }
    
  }

  const handleAcceptBet = async(flag) => {
    // console.log('handleAcceptBet', betInput, betInput.length, betState !== null, '123',role === 'client' && betState !== null)
    setIsLoading(true)
    if(role === 'driver') {
      if(betState===null) {
        setDisableFirstBetBtn(true)
        
        //нет ставки, создание ставки и запись в тендер в работе
        // console.log('!!!!!priceFromDialog',priceFromDialog, 'betState===null', 'создаем ставку и принимаем заявку в работу')
        await sendBet(
          setIsLoading,          
          messageIdGenerator,
          betInput,
          tenderState.id, 
          tenderState.data.name, 
          tenderState.data.userId, 
          tenderState.data.price, 
          uid,
          dispatch, 
          true, // быстрая ставка 
          profileClient.name,
          profileDriver.name,
          profileDriver.avatar,
          myProfileInfo?.rating ? myProfileInfo?.rating : 5.0,
        )
        setIsShowConfirmSendBet(false)
      } else if(betState.data.clientBetStatus==='wait'&&betState.data.driverBetStatus==='cancel') {
        // есть ставка и принимаем предложение клиента и заказ уходит в работу
        // console.log('!!!!!priceFromDialog',priceFromDialog, 'есть ставка и принимаем предложение клиента и заказ уходит в работу')
        //!!10,10 - делать апдейт поле ставки acceptedByDriverAt, решение о принятии заказа в работу принимает клиент
        onAcceprCurrBetByDriver(setIsLoading,messageIdGenerator,role,betState.data.betUpdate,betState,setIsShowConfirmSendBet, profileDriver.avatar)
        
      } else if(betState.data.driverBetStatus==='wait') {
        // есть ставка, ставка также отправлена клиенту и принимаем ставку( будет взята ставка клиента которая была отклонена//25.11.23//(старое)принимаем предложение клиента изначальное из цены заказа 
        //!!10,10 - делать апдейт поле ставки acceptedByDriverAt, решение о принятии заказа в работу принимает клиент
        onAcceprCurrBetByDriver(setIsLoading,messageIdGenerator,role,betState.data.clientBet,betState,setIsShowConfirmSendBet, profileDriver.avatar)
        
      } else if(betState.data.driverBetStatus=== null && betState.data.clientBetStatus==='wait') {
        //когда водитель принял и отменил ставку 
        onAcceprCurrBetByDriver(setIsLoading,messageIdGenerator,role,betState.data.betUpdate,betState,setIsShowConfirmSendBet, profileDriver.avatar)

      }
      // betState === null ? 
      // : updateBet(betInput,role,betState,setBetInput,flag,profileClient.name,profileDriver.name)
    } else if(role === 'client' && betState !== null) {
      // console.log('!!!!!', betState.data.driverBetStatus,betState.data.clientBetStatus)
      // если ставки нет то блокировать кнопку пока не появится ставка+
      // есть ставка от водителя и клиент не отправлял свою
      setDisableAcceptBtn(true)
      await onAcceprCurrTender(
        setIsLoading,
        messageIdGenerator,
        role,
        betState.data.betUpdate,
        betState,
        setIsShowConfirmSendBet,
        tenderState.data,
        profileDriver.avatar,
        hiddenTenderClient,
        getTenderHiddenClient,
        dispatch,
        userProfileTenderHiddenClient,
        getClientActiveTender,
        setClientActiveTenderState
      ).then(res => {
        //переход в таб активные чаты
        handleNavigateCurrentChat('active')
      })
    }
  }

  const handleCancelAccept = async() => {
    // setIsLoading(true)
    // try {
    //   let bet = betState.data.driverBet !== null ? betState.data.driverBet : betState.data.price
    //   let obj = {
    //     'driverBetStatus' : null,
    //     'driverBet': null,
    //     // 'clientBet' : value,
    //     // 'betUpdate' : value,
    //     'clientBetStatus' : "wait",
    //     'acceptedByDriverAt': null,
    //     'price': route.params.item.data.price,
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
  
  const handleSendBet = async(flag) => {
    console.log('handleSendBet', betInput, )
    setIsLoading(true)

    if(role === 'driver') {
      if(betState===null) {
        setDisableFirstBetBtn(true)
        //нет ставки, создание ставки и запись в тендер в работе
        // console.log('!!!!!priceFromDialog',priceFromDialog, 'betState===null', 'создаем ставку, без принятия тендера в работу ')
        await sendBet(
          setIsLoading,
          messageIdGenerator,
          betInput,
          tenderState.id, 
          tenderState.data.name, 
          tenderState.data.userId, 
          tenderState.data.price, 
          uid,
          dispatch,
          false, // ставка без принятия тендера в работу 
          profileClient.name,
          profileDriver.name,
          profileDriver.avatar,
          myProfileInfo?.rating ? myProfileInfo?.rating : 5.0
        )
        setBetInput('')
        setShowInput(false)
      } else {
        // есть ставка и водитель хочет отправить новую цену
        // console.log('!!!!!', 'есть ставка, обновляем цену',betState, )
        updateBet(setIsLoading,messageIdGenerator,betInput,role,betState,setBetInput,flag,profileClient.name,profileDriver.name,profileDriver.avatar)
        
        setShowInput(false)
      }
    }
    if(role === 'client' && betState !== null) {
      updateBet(setIsLoading,messageIdGenerator,betInput,role,betState,setBetInput,flag,profileClient.name,profileDriver.name,profileDriver.avatar)
      setShowInput(false)
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
  
  // const handleSetOrResetHidden = async(tenderId,flag,onCloseFn) => {
  //   //водитель восстановить или скрыть
  //   console.log('handleSetOrResetHidden start', tenderId,flag,)
  //   setIsLoading(true)
  //   if(role === 'driver') {
  //     try {
  //       let obj = flag ==='restore' ? {'hiddenTenders': firestore.FieldValue.arrayRemove(tenderId)} : {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}
  //       // console.log('handleSetOrResetHidden obj', obj)

  //       await firestore()
  //         .collection('forms')
  //         .doc(uid)
  //         .update(obj)
  //         .then(res => {
  //           console.log('res', res)
  //           let msg = {
  //             _id: messageIdGenerator(),
  //             createdAt: firestore.FieldValue.serverTimestamp(),
  //             read: false,
  //             text: flag ==='restore' ? 'Чат восстановлен': 'Чат добавлен в неактивные',
  //             tenderId: tenderId,
  //             system: true,
  //             typeMsg: flag ==='restore' ? 'removeFromArchFromDriver': 'addToArchFromDriver',
  //             userId: uid,
  //             userRole: role,
  //             partnerId: role === 'driver' ? clientId : driverUserId,
  //             partnerRole: role === 'driver' ? 'client' : 'driver'
  //           }
  //           //если сообщение будет первым - что бы корректно отображались аватар и имя водителя
  //           if(messages?.length === 0) {
  //             msg.userName = profileDriver?.name
  //             msg.driverAvatar = profileDriver?.avatar
  //             msg.rating = myProfileInfo?.rating ? myProfileInfo?.rating : 4.5
  //             msg.textSystem='systemMsg15978461238'
  //           }
  //           // console.log('msg', msg)
  //           addMsg(msg)
  //           getTenderHidden(uid,dispatch,userProfileTenderHidden).catch((er) =>console.log('er', er))
  //           onCloseFn()
  //           setIsLoading(false)
  //         }).catch((e) => {
  //           setIsLoading(false)
  //           onCloseFn()
  //           console.log('handleSetOrResetHidden driver firebase  err', e)
  //         })
  //       } catch (error) {
  //         setIsLoading(false)
  //         onCloseFn()
  //         console.log('handleSetOrResetHidden driver  err', error)
  //       }
  //       onCloseFn()
  //     } else {
  //     //клиент восстановить или скрыть
  //     try {
  //       if(flag==='del') {
  //         let arrupdate =  hiddenTenderClient !== null ? hiddenTenderClient.concat([{userId: driverUserId, tenderId: tenderId}]) : [{userId: driverUserId, tenderId: tenderId}]
  //         // console.log('arrupdate del', arrupdate)
  //         await firestore()
  //           .collection('forms')
  //           .doc(uid)
  //           .update({'hiddenTendersClient': arrupdate})
  //           .then(res => {
  //             let msg = {
  //               _id: messageIdGenerator(),
  //               createdAt: firestore.FieldValue.serverTimestamp(),
  //               read: false,
  //               tenderId: tenderId,
  //               system: true,
  //               text: 'Чат добавлен в неактивные',
  //               typeMsg: 'addToArchFromClient',
  //               userId: uid,
  //               userRole: role,
  //               partnerId: role === 'driver' ? clientId : driverUserId,
  //               partnerRole: role === 'driver' ? 'client' : 'driver'
  //             }
  //             addMsg(msg)
  //             // console.log('res', res)
  //             getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
  //             setIsLoading(false)
  //             onCloseFn()
  //           }).catch((e) => {
  //             setIsLoading(false)
  //             onCloseFn()
  //             console.log('handleSetOrResetHidden driver firebase  err', e)
  //           })
  //         } else {
  //           //восстановить чат
  //           let arrupdate =  hiddenTenderClient !== null ? removeDuplicates(hiddenTenderClient,[{userId: driverUserId, tenderId: tenderId}]) : []
  //           // {userId: driverUserId, tenderId: tenderId}
  //           console.log('arrupdate restore', arrupdate)
  //           await firestore()
  //             .collection('forms')
  //             .doc(uid)
  //             .update({'hiddenTendersClient': arrupdate})
  //             .then(res => {
  //               let msg = {
  //                 _id: messageIdGenerator(),
  //                 createdAt: firestore.FieldValue.serverTimestamp(),
  //                 read: false,
  //                 tenderId: tenderId,
  //                 system: true,
  //                 text: 'Чат восстановлен',
  //                 typeMsg: 'removeFromArchFromClient',
  //                 userId: uid,
  //                 userRole: role,
  //                 partnerId: role === 'driver' ? clientId : driverUserId,
  //                 partnerRole: role === 'driver' ? 'client' : 'driver'
  //               }
  //               addMsg(msg)
  //               // console.log('res', res)
  //               getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
  //               setIsLoading(false)
  //               onCloseFn()
  //             }).catch((e)=>{
  //               setIsLoading(false)
  //               onCloseFn()
  //               console.log('handleSetOrResetHidden driver firebase  err', e)
  //             })
  //         }
  //       } catch (error) {
  //         setIsLoading(false)
  //         onCloseFn()
  //         console.log('handleSetOrResetHidden driver  err', error)
  //       }
  //   }
  // }

  const handleSetOrResetHidden = async(tenderId,flag,onCloseFn) => {
    //водитель восстановить или скрыть
    console.log('handleSetOrResetHidden start', tenderId,flag,)
    setIsLoading(true)

    // try {
    //   let obj = ''
    //   if(role === 'driver') {
    //     obj = flag ==='restore' ? {'hiddenTenders': firestore.FieldValue.arrayRemove(tenderId)} : {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}
    //   } else {
    //     obj = flag ==='restore' ? {'hiddenTenders': firestore.FieldValue.arrayRemove(tenderId)} : {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}

    //   }

    //   // console.log('handleSetOrResetHidden obj', obj)

    //   await firestore()
    //     .collection('forms')
    //     .doc(uid)
    //     .update(obj)
    //     .then(res => {
    //       console.log('res', res)
    //       let msg = {
    //         _id: messageIdGenerator(),
    //         createdAt: firestore.FieldValue.serverTimestamp(),
    //         read: false,
    //         text: flag ==='restore' ? 'Чат восстановлен': 'Чат добавлен в неактивные',
    //         tenderId: tenderId,
    //         system: true,
    //         typeMsg: flag ==='restore' ? 'removeFromArchFromDriver': 'addToArchFromDriver',
    //         userId: uid,
    //         userRole: role,
    //         partnerId: role === 'driver' ? clientId : driverUserId,
    //         partnerRole: role === 'driver' ? 'client' : 'driver'
    //       }
    //       //если сообщение будет первым - что бы корректно отображались аватар и имя водителя
    //       if(messages?.length === 0) {
    //         msg.userName = profileDriver?.name
    //         msg.driverAvatar = profileDriver?.avatar
    //         msg.rating = myProfileInfo?.rating ? myProfileInfo?.rating : 4.5
    //         msg.textSystem='systemMsg15978461238'
    //       }
    //       // console.log('msg', msg)
    //       addMsg(msg)

    //       getTenderHidden(uid,dispatch,userProfileTenderHidden).catch((er) =>console.log('er', er))
    //       onCloseFn()
    //       setIsLoading(false)
    //     }).catch((e) => {
    //       setIsLoading(false)
    //       onCloseFn()
    //       console.log('handleSetOrResetHidden driver firebase  err', e)
    //     })
    //   } catch (error) {
    //     setIsLoading(false)
    //     onCloseFn()
    //     console.log('handleSetOrResetHidden driver  err', error)
    //   }
    //   onCloseFn()



    // if(role === 'driver') {
    //   try {
    //     let obj = flag ==='restore' ? {'hiddenTenders': firestore.FieldValue.arrayRemove(tenderId)} : {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}
    //     // console.log('handleSetOrResetHidden obj', obj)

    //     await firestore()
    //       .collection('forms')
    //       .doc(uid)
    //       .update(obj)
    //       .then(res => {
    //         console.log('res', res)
    //         let msg = {
    //           _id: messageIdGenerator(),
    //           createdAt: firestore.FieldValue.serverTimestamp(),
    //           read: false,
    //           text: flag ==='restore' ? 'Чат восстановлен': 'Чат добавлен в неактивные',
    //           tenderId: tenderId,
    //           system: true,
    //           typeMsg: flag ==='restore' ? 'removeFromArchFromDriver': 'addToArchFromDriver',
    //           userId: uid,
    //           userRole: role,
    //           partnerId: role === 'driver' ? clientId : driverUserId,
    //           partnerRole: role === 'driver' ? 'client' : 'driver'
    //         }
    //         //если сообщение будет первым - что бы корректно отображались аватар и имя водителя
    //         if(messages?.length === 0) {
    //           msg.userName = profileDriver?.name
    //           msg.driverAvatar = profileDriver?.avatar
    //           msg.rating = myProfileInfo?.rating ? myProfileInfo?.rating : 4.5
    //           msg.textSystem='systemMsg15978461238'
    //         }
    //         // console.log('msg', msg)
    //         addMsg(msg)
    //         // getTenderHidden(uid,dispatch,userProfileTenderHidden).catch((er) =>console.log('er', er))

    //         // !! добавляем клиенту чат в неактивные
    //         // получить скрытые чаты клиента, проверять их на наличие добавленных в скрытые и юлокировать/восстанавливать
    //         firestore()
    //         .collection('forms')
    //         .doc(clientId)
    //         .get()
    //         .then(documentSnapshot=>{
    //           let hiddArr = documentSnapshot.data().hiddenTendersClient
    //           let res
    //           if(hiddArr?.length > 0) {
    //             res = hiddArr.find(elemfnd => elemfnd.userId === driverUserId && elemfnd.tenderId === tenderId)
    //             console.log('проверяем есть ли они в скрытых res', res)
    //           } 
    //           // else {
    //           //   res = {userId: driverUserId, tenderId: tenderId}
    //           // }
    //           let newArr = []
    //           if(flag ==='del' ) {
    //             if(res == undefined) {
    //               newArr = hiddArr.concat([{userId: driverUserId, tenderId: tenderId}])
    //             }
    //           } else {
    //             //если восстановить то убираем
    //             if(res !== undefined) {
    //               newArr = removeDuplicates(hiddArr,[{userId: driverUserId, tenderId: tenderId}])
    //             }
    //           }
    //           //запись в неактивные
    //           firestore()
    //           .collection('forms')
    //           .doc(clientId)
    //           .update({'hiddenTendersClient': newArr})
    //           .then(res => {
    //           }).catch((e) => {
    //             console.log('handleSetOrResetHidden driver firebase  err', e)
    //           })
    //         })

    //         onCloseFn()
    //         setIsLoading(false)
    //       }).catch((e) => {
    //         setIsLoading(false)
    //         onCloseFn()
    //         console.log('handleSetOrResetHidden driver firebase  err', e)
    //       })
    //     } catch (error) {
    //       setIsLoading(false)
    //       onCloseFn()
    //       console.log('handleSetOrResetHidden driver  err', error)
    //     }
    //     onCloseFn()
    //   } else {
    //   //клиент восстановить или скрыть
    //   try {
    //     if(flag==='del') {
    //       let arrupdate =  hiddenTenderClient !== null ? hiddenTenderClient.concat([{userId: driverUserId, tenderId: tenderId}]) : [{userId: driverUserId, tenderId: tenderId}]
    //       // console.log('arrupdate del', arrupdate)
    //       let objDriver =   {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}

    //       await firestore()
    //         .collection('forms')
    //         .doc(uid)
    //         .update({'hiddenTendersClient': arrupdate})
    //         .then(res => {
    //           let msg = {
    //             _id: messageIdGenerator(),
    //             createdAt: firestore.FieldValue.serverTimestamp(),
    //             read: false,
    //             tenderId: tenderId,
    //             system: true,
    //             text: 'Чат добавлен в неактивные',
    //             typeMsg: 'addToArchFromClient',
    //             userId: uid,
    //             userRole: role,
    //             partnerId: role === 'driver' ? clientId : driverUserId,
    //             partnerRole: role === 'driver' ? 'client' : 'driver'
    //           }
    //           addMsg(msg)
    //           // console.log('res', res)
    //           getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)

    //           //!! водитель скрыть или восстановить чаты
    //           firestore()
    //           .collection('forms')
    //           .doc(driverUserId)
    //           .update(objDriver)
    //           .then(res => {
    //             console.log('objDriver res', res)
    //           })
    //           setIsLoading(false)
    //           onCloseFn()
    //         }).catch((e) => {
    //           setIsLoading(false)
    //           onCloseFn()
    //           console.log('handleSetOrResetHidden driver firebase  err', e)
    //         })
    //       } else {
    //         //восстановить чат
    //         let arrupdate =  hiddenTenderClient !== null ? removeDuplicates(hiddenTenderClient,[{userId: driverUserId, tenderId: tenderId}]) : []
    //         // {userId: driverUserId, tenderId: tenderId}
    //         let driverObj = {'hiddenTenders': firestore.FieldValue.arrayRemove(tenderId)}
    //         console.log('arrupdate restore', arrupdate)

    //         await firestore()
    //           .collection('forms')
    //           .doc(uid)
    //           .update({'hiddenTendersClient': arrupdate})
    //           .then(res => {
    //             let msg = {
    //               _id: messageIdGenerator(),
    //               createdAt: firestore.FieldValue.serverTimestamp(),
    //               read: false,
    //               tenderId: tenderId,
    //               system: true,
    //               text: 'Чат восстановлен',
    //               typeMsg: 'removeFromArchFromClient',
    //               userId: uid,
    //               userRole: role,
    //               partnerId: role === 'driver' ? clientId : driverUserId,
    //               partnerRole: role === 'driver' ? 'client' : 'driver'
    //             }
    //             addMsg(msg)
    //             // console.log('res', res)
    //             getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)

    //             //!! водитель скрыть или восстановить чаты
    //             firestore()
    //             .collection('forms')
    //             .doc(driverUserId)
    //             .update(driverObj)
    //             .then(res => {
    //               console.log('objDriver res', res)
    //             })

    //             setIsLoading(false)
    //             onCloseFn()
    //           }).catch((e)=>{
    //             setIsLoading(false)
    //             onCloseFn()
    //             console.log('handleSetOrResetHidden driver firebase  err', e)
    //           })
    //       }
    //     } catch (error) {
    //       setIsLoading(false)
    //       onCloseFn()
    //       console.log('handleSetOrResetHidden driver  err', error)
    //     }
    // }
  }

  const handleOpenProfile = () => {
    Keyboard.dismiss()
    //убрать проверку на archived
    if(role==='client' && tenderState.data.finishedAt !== null ) {
      if(tenderState.data.hasOwnProperty('archived') ) {
        tenderState.data.archived === false ?  setIsVisibleProfileWithTestim(true) : setIsVisibleProfile(true)
        
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
    // console.log('handleSendComplain start data',data,description?.trim())
    // setIsLoading(true)
    // setIsVisibleForm(false)
    setTimeout(()=>{

      setIsVisibleForm(false)
    },1500)

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
    //       fullName: myProfileInfo.fullName, 
    //       email: myProfileInfo?.email !== undefined ? myProfileInfo?.email : '', 
    //       phone: myProfileInfo?.phone
    //     },
    //     opponentInfo: {
    //       fullName: opponentInfo.fullName, 
    //       email: opponentInfo?.email !== undefined ? opponentInfo?.email : '', 
    //       phone: opponentInfo?.phone
    //     },
    //     userComplaintsCounter: myProfileInfo?.userComplaintsCounter,
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
    LogBox.ignoreLogs(['Warning: Encountered two children with the same key,'])
  },[])

  // !! получение сообщений
  // useEffect(() => {
  //   // !!!!!!!!!!!!!! messagesFirestore - массив сообщений согласно параметрам
  //   //перебирать
  //   // console.log('before useEffect tenderIdFromRoute', tenderIdFromRoute)

  //   if(profileClient !== null && profileDriver !== null && tenderIdFromRoute) {
  //     // console.log('after useEffect tenderIdFromRoute', tenderIdFromRoute)

  //     const unsubscribe = chatsRef.where('tenderId', '==', tenderIdFromRoute).onSnapshot((querySnapshot) => {
  //       let arrMsgRead = []
  //       let arrInformerRead = []
  //       let arrInformerRouteRead = []
  //       let navToScreen = null
  //       let isRoute = driverRoutesOffers.includes(tenderIdFromRoute)
  //       console.log('isRoute', isRoute)
  //       const messagesFirestore = querySnapshot
  //       .docChanges()
  //       .filter(({ type }) => type === 'added')
  //       .map(({ doc }) => {
  //           // console.log('\x1b[43m%s %s\x1b[0m','useEffect получение сообщений', )
  //           // console.log('doc', doc.data(), tenderState.id, clientId)
  //           // console.log('doc', doc.data(), )
  //           //вместо ифов функция которая выбирает сообщения я-собеседник и собеседник-я ( сейчас быбирает все сообщения по заявке)
            
  //           let message
  //           let dt = querySnapshot.metadata.hasPendingWrites ? Date.now() : doc.data().createdAt.toMillis()
  //           // console.log('!!!!!!!!dt', dt)
  //           if(role == 'driver') {
  //             if(uid == doc.data().userId && clientId == doc.data().partnerId && uid !== clientId) {
  //               // console.log('***1 сообщ от водителя клиенту***')
  //               message = {
  //                 _id: doc.data()._id,
  //                 text: doc.data().text,
  //                 createdAt: dt,
  //                 // createdAt: doc.data().createdAt.toMillis(),
  //                 user: profileDriver,
  //                 docId: doc.id
  //               }
  //               if(doc.data()?.file_type) {
  //                 message.size = doc.data()?.size
  //                 message.uri = doc.data()?.uri
  //                 message.file_type = doc.data()?.file_type
  //                 message.name = doc.data()?.name
  //                 message.thumbnail = doc.data()?.thumbnail
  //               }
  //               //для видео превью
  //               // if(videoTypes.includes(doc.data()?.file_type)) {
  //               //   message.thumbnail = doc.data()?.thumbnail
  //               // }
  //               if(doc.data().hasOwnProperty('typeMsg')) {
  //                 if(doc.data()?.typeMsg==='feedback') {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.score =  doc.data()?.score
  //                   message.textInfo = 'from' //текст что я оставила отзыв
  //                 } else {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.priceBet = doc.data()?.priceBet
  //                   message.textInfo = 'from' //моя ставка/принятие ставки мной
  //                 }
  //               }

  //             } else if(clientId == doc.data().userId && uid == doc.data().partnerId && uid !== clientId){
  //               // console.log('***2 сообщ от клиента водителю***')
  //               message = {
  //                 _id: doc.data()._id,
  //                 text: doc.data().text,
  //                 createdAt: dt,
  //                 // createdAt: doc.data().createdAt.toMillis(),
  //                 user: profileClient,
  //                 docId: doc.id
  //               }
  //               if(doc.data()?.file_type) {
  //                 message.size = doc.data()?.size
  //                 message.uri = doc.data()?.uri
  //                 message.file_type = doc.data()?.file_type
  //                 message.name = doc.data()?.name
  //                 message.thumbnail = doc.data()?.thumbnail
  //               }
  //               //для видео превью
  //               // if(videoTypes.includes(doc.data()?.file_type)) {
  //               //   message.thumbnail = doc.data()?.thumbnail
  //               // }
  //               if(doc.data().hasOwnProperty('typeMsg')) {
  //                 if(doc.data()?.typeMsg==='feedback') {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.score =  doc.data()?.score
  //                   message.textInfo = 'to' //текст что мне оставили отзыв
  //                 } else if(doc.data()?.typeMsg==='rejectDriver'){
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                 } else {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.priceBet = doc.data()?.priceBet
  //                   message.textInfo = 'to' //мне прислали ставку / принятие ставки моей
  //                 }
  //               }

  //             }
  //           } else if(role == 'client') {
  //             // console.log('driverUserId', driverUserId, 'doc.data().partnerId', doc.data().partnerId, )
  //             if(uid == doc.data().userId && driverUserId == doc.data().partnerId && uid !== driverUserId) {
  //               // console.log('***1 сообщ от клиента водителю***')
  //               message = {
  //                 _id: doc.data()._id,
  //                 text: doc.data().text,
  //                 createdAt: dt,
  //                 // createdAt: doc.data().createdAt.toMillis(),
  //                 user: profileClient,
  //                 docId: doc.id
  //               }
  //               if(doc.data()?.file_type) {
  //                 message.size = doc.data()?.size
  //                 message.uri = doc.data()?.uri
  //                 message.file_type = doc.data()?.file_type
  //                 message.name = doc.data()?.name
  //                 message.thumbnail = doc.data()?.thumbnail
  //               }
  //               if(doc.data().hasOwnProperty('typeMsg')) {
  //                 if(doc.data()?.typeMsg==='feedback') {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.score =  doc.data()?.score
  //                   message.textInfo = 'from' //текст что я оставила отзыв
  //                 } else {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.priceBet = doc.data()?.priceBet
  //                   message.textInfo = 'from'  //моя ставка/принятие ставки мной
  //                 }
  //               }
  //             } else if(uid !== driverUserId && driverUserId == doc.data().userId && uid == doc.data().partnerId) {
  //               // if(clientId == doc.data().partnerId)
  //               // console.log('***2 сообщ от водителя клиенту***')
  //               message = {
  //                 _id: doc.data()._id,
  //                 text: doc.data().text,
  //                 createdAt: dt,
  //                 // createdAt: doc.data().createdAt.toMillis(),
  //                 user: profileDriver,
  //                 docId: doc.id
  //               }
  //               if(doc.data()?.file_type) {
  //                 message.size = doc.data()?.size
  //                 message.uri = doc.data()?.uri
  //                 message.file_type = doc.data()?.file_type
  //                 message.name = doc.data()?.name
  //                 message.thumbnail = doc.data()?.thumbnail
  //               }
  //               if(doc.data().hasOwnProperty('typeMsg')) {
  //                 if(doc.data()?.typeMsg==='feedback') {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.score =  doc.data()?.score
  //                   message.textInfo = 'to' //текст что мне оставили отзыв
  //                 } else {
  //                   message.typeMsg = doc.data()?.typeMsg
  //                   message.system = true
  //                   message.priceBet = doc.data()?.priceBet
  //                   message.textInfo = 'to' //мне прислали ставку / принятие ставки моей
  //                 }
  //               }
  //             }
  //           }
  //           // если сообщение получено
  //           //если прислали сообщение мне,
  //           // console.log('перед Прочиткой сообщений', doc.data())
  //           if(message !== undefined &&
  //             doc.data().read === false &&
  //             doc.data().partnerId == uid &&
  //             doc.data().userId !== uid) {
  //             console.log('Прочитка сообщений', doc.data(), doc.id)
  //             // console.log('Прочитка сообщений', message)
  //             chatsRef.doc(doc.id).update({read: firestore.FieldValue.serverTimestamp()})
  //             if(message?.typeMsg == 'feedback') {
  //               console.log('message feedback', message)
  //               //новый фидбек - нужно обновить неактивные чаты
  //               role === 'driver' ? getTenderHidden(uid, dispatch, userProfileTenderHidden) : getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
  //             } 
  //             if(message?.typeMsg == 'orderCanceled') {
  //               console.log('message orderCanceled', message)
  //               //!!переход в чат не активный (отменить может клиент или водитель) 
  //               //!! ставить флаг перехода после диспатча не прочитанных
  //               navToScreen = 'cancel' 
  //               // role === 'driver' ? getTenderHidden(uid, dispatch, userProfileTenderHidden) : getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
  //             }
  //             if(message?.typeMsg == 'orderCanceled') {
  //               console.log('message orderCanceled', message)
  //               //!!переход в чат активный
  //               //!! ставить флаг перехода после диспатча не прочитанных
  //               navToScreen = 'cancel' 
  //               // role === 'driver' ? getTenderHidden(uid, dispatch, userProfileTenderHidden) : getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
  //             }
  //             // arrMsgRead.push(doc.id)
  //             if(role === 'driver') {
  //               if(isRoute && tenderState.data.driverId === null) {
  //                 arrInformerRouteRead.push({tenderId: doc.data().tenderId, userId: doc.data().userId, createdAt: doc.data().createdAt.toMillis()})
  //               } else {
  //                 arrInformerRead.push({tenderId: doc.data().tenderId, userId: doc.data().userId, createdAt: doc.data().createdAt.toMillis()}) 
  //               }
  //             } else {

  //               arrInformerRead.push({tenderId: doc.data().tenderId, userId: doc.data().userId, createdAt: doc.data().createdAt.toMillis()}) 
  //             }
  //             // console.log('\x1b[45m%s %s\x1b[0m', 'doc.data() ', doc.data(),doc.data()?.typeMsg, doc.data()?.typeMsg === 'orderCanceled')
  //           }
  //           // console.log('message', message)
  //           // console.log('arrMsgRead', arrMsgRead)
  //           return message
  //         })
  //       .sort((a, b) => b.createdAt - a.createdAt)
  //       .filter(elem => elem !== undefined)
  //       // console.log('1 messagesFirestore', messagesFirestore)
  //         // console.log('arrMsgRead', arrMsgRead)

  //       // if(arrMsgRead && arrMsgRead.length > 0) {
  //       //   // console.log('\x1b[32m%s %s\x1b[32m', 'arrMsgRead.length', arrMsgRead.length, arrMsgRead)
  //       //   dispatch(updMsg(arrMsgRead))
  //       // }
  //       if(arrInformerRead && arrInformerRead.length > 0) {
  //         console.log('\x1b[32m%s %s\x1b[32m', 'arrInformerRead.length', arrInformerRead.length, arrInformerRead)

  //         //!тут условие проверить нужно ли tenderState.data.driverId === null && tenderState.data.archived === false
  //         if(tenderState.data.driverId === null && tenderState.data.archived === false) { 
  //           console.log('условие проверить', tenderState.data.driverId === null && tenderState.data.archived === false)
  //           if(isRoute && role ===' driver') {
  //             console.log('isRoute && role === driver', isRoute && role ===' driver')
  //             //если сообщение из маршрутов в неактивной заявке
  //             dispatch(updInformerRoutesState(arrInformerRouteRead))
  //           } else {
  //             dispatch(updInformerState(arrInformerRead))
  //           }
  //         } else {
  //           dispatch(updInformerActiveState(arrInformerRead))
  //         }
  //       }
  //        if(navToScreen !== null) {
  //         handleNavigateCurrentChat('cancel')
  //        }
  //       // if(stateOfMsg.includes(change.doc.id) && change.doc.data().read !== false) {
  //       //   dispatch(updMsg([change.doc.id]))
  //       // }
  //       // let arrEmptyMsg = []
  //       // if(messagesFirestore && messagesFirestore.length == 0) {
  //       //   // setHelloMsg(true)
  //       // }
  //       // console.log('2 messagesFirestore', messagesFirestore)
  //       appendMessages(messagesFirestore)
  //     }) 
  //     // console.log('unsubscribe', unsubscribe)
  //     return () => unsubscribe()
  //   }
  //   // }
  // },[profileClient, profileDriver, tenderIdFromRoute,route])

  //!!проверка скрытой заявки для отображения кнопок)
  // useEffect(()=>{
  //   console.log('useEffect hiddenTender,hiddenTenderClient', hiddenTender)
  //   if(tenderState !== null) {
  //     if(role === 'driver') {
  //       let filterHidden = hiddenTender !== null ? hiddenTender.find(item=>item===tenderState.id) : undefined
  //       filterHidden === undefined ? setIsHidden(false) : setIsHidden(true)
  //       console.log('filterHidden', filterHidden)
  //     } else {
  //       let filterHidden = hiddenTenderClient !== null ? hiddenTenderClient.find(item=>item.tenderId===tenderState.id && item.userId === driverUserId) : undefined
  //       filterHidden === undefined ? setIsHidden(false) : setIsHidden(true)
  //       // console.log('filterHidden', filterHidden)
  //     }
  //   }
  // },[hiddenTender,tenderState,hiddenTenderClient])
  
  useEffect(()=>{
    console.log('useEffect NAV to chat', tenderState?.data)
    if(role === 'driver') {
      if(route.params.item.data.driverId == null && tenderState !== null && tenderState.data.driverId !== null && tenderState.data.driverId === driverUserId) {
      // если  заявка отменена то
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
      if((betState.data.clientBetStatus==='accept' || betState.data.driverBetStatus==='accept')) {
        setStatusOfBetPrice('accept')
      } else if (role ==='driver' && betState.data.driverBetStatus==='wait') {
        setStatusOfBetPrice('base')
      } else if (role ==='client' && betState.data.clientBetStatus==='wait') {
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

  // !! прослушка ставки  
  // useEffect(() => {
  //   console.log('useEffect betState  прослушка ставки  ', betState)
  //   const unubscribeBetState = tenderState!==null&&driverUserId!==null ? firestore()
  //   .collection('replies')
  //   .where('tenderId', '==', tenderState.id)
  //   .where('userId', '==', driverUserId)
  //   .onSnapshot((querySnapshot) => {
  //     console.log('\x1b[43m%s %s\x1b[0m', 'unubscribeBetState', )
  //     // console.log('unubscribeBetState ----onSnap---', querySnapshot.size, querySnapshot.empty)
  //     let bet
  //     querySnapshot.docChanges().forEach((change) => { 
  //       if(change.type === "added") {
  //         // console.log('unubscribeBetState change.type added', change.type, change.doc.data())
  //         // console.log('querySnapshot', querySnapshot.size)
  //         // if(querySnapshot.size > 1 && change.doc.data().rejectedByDriverAt,  change.doc.data().rejectedAt)
  //         //если были ставки и они отклонены но есть ставка активная - нужно продумать
  //         // if(route.params.repl !== undefined route.params.repl.id)
  //         if(change.doc.data().rejectedByDriverAt == null && change.doc.data().rejectedAt == null) {            
  //          bet = {
  //             data: change.doc.data(),
  //             id: change.doc.id
  //           }
  //         }
  //       }
  //       if(change.type === "modified") {
  //         bet = {
  //           data: change.doc.data(),
  //           id: change.doc.id
  //         }
  //       }
  //       // setIsRefreshTender(true)
  //     })
  //     if(bet !== undefined) {
  //       // console.log('setBetState from listener:', bet)
  //       setBetState(bet)
  //       disableFirstBetBtn === true ? setDisableFirstBetBtn(false) : null
  //     }
  //   })
  //   :
  //   ()=>{}
  //   return () => unubscribeBetState()
  // },[route,tenderState,driverUserId])

  //!!прослушка заявки
  // useEffect(() => {
  //   console.log('\x1b[43m%s %s\x1b[0m','useEffect прослушка заявки', tenderState)
  //   const unubscribeTender = tenderState!==null && clientId!==null ? firestore()
  //     .collection('tenders')
  //     .where('userId', '==', clientId)
  //     .onSnapshot((querySnapshot) => {
  //     // console.log('\x1b[43m%s %s\x1b[0m', 'unubscribeTender', )
  //     // console.log('unubscribeTender ----onSnap---', querySnapshot.size, querySnapshot.empty)
  //     querySnapshot.docChanges().forEach((change) => { 
  //       if(change.type === "modified") {
  //         // &&change.doc() ===tenderState.id
  //         // console.log('\x1b[42m%s %s\x1b[0m', ' прослушка заявки tenderState.id', tenderState.id)
  //         if(change.doc.id===tenderState.id) {
  //           // console.log('\x1b[42m%s %s\x1b[0m', 'прослушка заявки data()', change.doc.data())
  //           setTendeState({
  //             data: change.doc.data(),
  //             id: change.doc.id
  //           })

  //           //можно прослушивать заявку и обновлять данные - если заявку отменили(исполнитель/заказчик) - то мой чат может быть восстановлен
  //           // if() {
  //           //   getTenderHidden(uid, dispatch, userProfileTenderHidden)
  //           // }
  //         }
  //       }
  //       // console.log('tenders ----onSnap---', documentSnapshot.data())
  //       // setIsRefreshTender(false)
  //     })
  //   })
  //     : 
  //     () => {}
  //     return () => unubscribeTender()
  // },[route,tenderState,clientId])

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

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => {
          if(Platform.OS==='ios' ) {
            setIsKeyboardShown(true)
          }
        },
    );
    const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          if(Platform.OS==='ios' ) {
            setIsKeyboardShown(false)
          }
        },
    );

    return () => {
        keyboardWillHideListener.remove();
        keyboardWillShowListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
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
              <Text style={{color:THEME.MAIN_COLOR, fontSize: 16}} numberOfLines={1} ellipsizeMode='tail'>{route?.params?.item.data?.name}</Text>
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
                  onPress={()=>handleOpenProfile()}
                  >
                  {
                    (role==='driver' && route.params.item.data?.avatar!== null&& route.params.item.data?.avatar.length > 0 ) ||
                    (role==='client' && route.params.userInfo.driverAvatar!== null&& route.params.userInfo.driverAvatar?.length > 0 ) ?
                      <View style={[styles.avatarWrapper,mainstyles.shadowG5r8]}>
                          {
                            role==='driver' ?
                            <Image source={{uri: route.params.item.data?.avatar }} style={styles.img}/>
                            : 
                            <Image source={{uri: route.params.userInfo.driverAvatar }} style={styles.img}/>
                          }
                        <View style={[styles.starContainer]}>
                          <Text style={[mainstyles.text10R,styles.starText]}>{role === 'driver' ? route.params.item.data?.rating : route.params.userInfo?.rating }</Text>
                          <IconStarSmallFill color={THEME.YELLOW}/>
                        </View>
                      </View>
                      :
                      <View style={[styles.avatarWrapper,mainstyles.shadowG5r8]}>
                        <View style={[styles.img,{backgroundColor: '#ffffff'}]}>
                          <Icon name="camera" size={20} color={THEME.PRIMARY} />
                        </View>
                        <View style={[styles.starContainer]}>
                          <Text style={[mainstyles.text10R,styles.starText]}>{role === 'driver' ? route.params.item.data?.rating : route.params.userInfo?.rating }</Text>
                          <IconStarSmallFill color={THEME.YELLOW}/>
                        </View>
                      </View>
                  }
                  </TouchableOpacity>
                  <View style={[{width: '80%',justifyContent: 'center'}]}>
                    <View style={[mainstyles.rowalCjcSb, styles.content]}>
                      <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>Предложенная цена</Text>
                      {
                        betState===null ?
                          <View style={[mainstyles.bagePriceContainer,role==='driver' ? mainstyles.bagePriceWait: mainstyles.bagePriceBase]}>
                            <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{route.params.item.data.price} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12}]}> BYN</Text></Text>
                          </View>
                        :
                        <View style={[{}, mainstyles.rowalCjcC]}>
                          {
                            role==='driver' ?
                            <>
                              {
                                betState.data.driverBetStatus==='cancel' ?
                                <>
                                  {
                                     betState.data.driverBet !== null ?
                                    <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                      <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.data.driverBet} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12,}]}> BYN</Text></Text>
                                    </View>
                                    : null
                                  }
                                
                                </>
                                :
                                <>
                                  {
                                    betState.data.driverBetStatus !==null ?
                                    <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                      <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.data.clientBet} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12,}]}> BYN</Text></Text>
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
                              betState.data.clientBetStatus==='cancel'?

                              <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through'}]}>{betState.data.clientBet} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12,}]}> BYN</Text></Text>
                              </View>
                              :
                              <>
                                {
                                  betState.data.driverBet === null ?
                                  null
                                  :
                                  <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                                    <Text style={[mainstyles.text12R,{color: THEME.GREY800, textDecorationLine: 'line-through', }]}>{betState.data.driverBet} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12,}]}> BYN</Text></Text>
                                  </View>
                                }
                              </>
                            }
                            </>
                          }
                          <View style={[{marginLeft: 10},mainstyles.bagePriceContainer,statusOfBetPrice==='accept'?mainstyles.bagePriceAccept:(statusOfBetPrice==='wait'?mainstyles.bagePriceWait:mainstyles.bagePriceBase)]}>
                            <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{betState.data.betUpdate} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12}]}> BYN</Text></Text>
                          </View>
                        </View>
                      }
                    </View>
                    {
                      betState!==null ?
                      <View style={[mainstyles.rowalCjcSb, styles.content]}>
                        <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>Стартовая цена</Text>
                        <View style={[mainstyles.bagePriceContainer,mainstyles.bagePriceBase]}>
                          <Text style={[mainstyles.text12R,{color: THEME.GREY800}]}>{route.params.item.data.price} <Text style={[{color: THEME.GREY800,  fontSize: 8,lineHeight: 12}]}> BYN</Text></Text>
                        </View>
                      </View>
                      : null
                    }
                  </View>
              </View>
              {
                tenderState !== null && tenderState.data.driverId === null && tenderState.data?.archived === false ?
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
                                    betState !==null && betState.data.acceptedByDriverAt !== null ?
                                    <DefaultBtnOutline title={'Одобрить'} 
                                      disabled={isDisableAcceptBtn} 
                                      onPress={handleOpenDialog} 
                                      customStyle={[{borderColor:  role==='client' && betState.data.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN, height: 40, paddingVertical: 0, elevation: 10,shadowColor: THEME.PRIMARY,},mainstyles.shadowPr10]}
                                    />
                                    :
                                    <DefaultBtnOutline title={'Принять ставку'}
                                      disabled={role==='client' && betState.data.clientBetStatus==='wait'} 
                                      onPress={handleOpenDialog} 
                                      customStyle={[{height: 40, paddingVertical: 0,borderColor:  role==='client'&&betState.data.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
                                      />
                                  }
                                  <DefaultBtnOutline disabled={isLoading} title={'Предложить свою'} onPress={handleOpenBetInput} customStyle={[{height: 40, paddingVertical: 0,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}/>
                                </>
                                : 
                                <>
                                  {
                                    betState !==null && betState.data.acceptedByDriverAt !== null ?
                                    // true ?
                                    <DefaultBtnOutline title={'Ваш отклик отправлен заказчику. После одобрения Вам станет доступен его телефон'} 
                                      onPress={()=>{Keyboard.dismiss(),setIsShowCancelDialog(true)}} 
                                      customStyle={[{alignSelf: 'center',width: '100%', height: 50,paddingVertical: 0, borderRadius: 60, paddingHorizontal: 10, borderColor: THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
                                      textStyles={mainstyles.text14R}
                                      />
                                    :
                                    <>
                                      <DefaultBtnOutline title={'Принять ставку'}
                                        disabled={role==='client' && betState.data.clientBetStatus==='wait'} 
                                        onPress={handleOpenDialog} 
                                        customStyle={[{height: 40, paddingVertical: 0,borderColor:  role==='client'&&betState.data.clientBetStatus==='wait' ? THEME.GREY300 : THEME.BRIGHT_GREEN,elevation: 10,shadowColor: THEME.PRIMARY},mainstyles.shadowPr10]}
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
                  { role ==='client' && tenderState.data.driverId !== null && tenderState.data.driverId === driverUserId ?
                    <View style={[mainstyles.pH10]}>
                      <DefaultBtnOutline title={'Позвонить'} onPress={()=>handlerCallNumer(driverUserId,Linking)} customStyle={{height: 40, paddingVertical: 0,borderColor: THEME.BRIGHT_GREEN,elevation: 20,shadowColor: THEME.PRIMARY}}/>
                    </View>
                    : 
                    null
                  }
                  
                  {
                    role ==='driver' && tenderState.data.driverId === uid ? 
                      <View style={[mainstyles.pH10]}>
                        <DefaultBtnOutline title={'Позвонить'} onPress={()=>handlerCallNumer(clientId,Linking)} customStyle={{height: 40, paddingVertical: 0,borderColor: THEME.BRIGHT_GREEN,elevation: 20,shadowColor: THEME.PRIMARY}}/>
                      </View>
                    :
                    null
                  }
                  { role ==='client' && tenderState.data.driverId !== null && tenderState.data.driverId === driverUserId && tenderState.data.finishedAt !== null && 
                  (tenderState.data.hasOwnProperty('archived') && tenderState.data.archived === false || !tenderState.data.hasOwnProperty('archived')) 
                  ?
                    <View style={[mainstyles.pH10, {paddingTop: 10}]}>
                      <DefaultBtn title={'Завершить'} onPress={()=>setIsVisibleProfileWithTestim(true)} customStyle={{width: '100%', height: 40, paddingVertical: 0,elevation: 20,shadowColor: THEME.PRIMARY}}/>
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
        backgroundColor: '#ffffff',
        flex:1,
        paddingBottom: 15
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
            messages={messages}
            renderInputToolbar={renderInputToolbar}
            renderUsernameOnMessage={true}
            renderBubble={renderBubble}
            renderCustomView={renderCustomView}
            renderSend={renderSend}
            renderSystemMessage={renderSystemMessage}
            renderActions={(props) => !isHidden ? <Actions onSend={handleSend} setProcessing={setProcessing} setUploadProgress={setIsLoadingUpload} uid={uid} {...props} /> : <></>}
            onSend={handleSend}
            renderDay={renderDay}
            alwaysShowSend
            showUserAvatar={false}
            user={role == 'driver' ? profileDriver : profileClient}
            keyboardShouldPersistTaps='never'
            bottomOffset={Platform.OS==='ios' ? safeInsets?.bottom+45 : undefined}
            minInputToolbarHeight={Platform.OS==='android' && isKeyboardShown ? 60 : undefined}
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
            onPress={()=>handleSetOrResetHidden(tenderState.id,'del',()=>setIsVisibleAskHideChat(false))} 
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
            onPress={()=>handleSetOrResetHidden(tenderState.id,'restore',()=>setIsVisibleAskRestoreChat(false))} 
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
          <ProfileInfo role={role} userId={role === 'driver'? clientId: driverUserId} onClose={()=>{setIsVisibleProfile(false)}}/>
        </View>
        :null
      }
      {
        isVisibleProfileWithTestim && tenderState!==null ?
        <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top,height: height+safeInsets.top, zIndex: 99999}]}>
          <ProfileInfoWithTestimonial 
            role={role}
            partnerId={driverUserId}
            userProfile={{userId: uid}}
            data={tenderState}
            onClose={()=>{setIsVisibleProfileWithTestim(false)}}
            onPress={()=>setIsShowSucceed(true)}
          />
        </View>
        :null
      }
      {
        isShowSucceed ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTender',finishTender)} onPress={()=>setIsShowSucceed(false)}/>
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
        IsLoadingUpload ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
          <Text style={[mainstyles.text13R,{color: '#ffffff'}]}>Загрузка файла...{processing}% </Text><ActivityIndicator color='#ffffff' size='large'/>
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
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior={"padding"}
      // "padding" 
        // keyboardVerticalOffset={safeInsets?.bottom+50} 
        style={{backgroundColor:'#ffffff',
        // backgroundColor: 'red',
        opacity: 0.5}}
      />}
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 10,
    marginHorizontal: 11,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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