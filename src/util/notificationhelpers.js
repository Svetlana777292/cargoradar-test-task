import messaging, { getInitialNotification, getMessaging, getToken, onNotificationOpenedApp, requestPermission } from '@react-native-firebase/messaging';
import { get } from '../store/features/api/user-api';
import { setNavigationObjTo } from '../store/features/userSlice';
import { setTestData } from '../store/features/loginSlice';

const messagingInstance = getMessaging();

export async function requestUserPermissionNotif() {
  const authorizationStatus = await requestPermission(messagingInstance);
  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
    return 'granted'
  } else return 'decline'
}

export async function getFCMToken() {
  
  // await registerDeviceForRemoteMessages(messaging);
  const token = await getToken(messagingInstance);
  // const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

export async function onOpenChatWithPush(obj,userProfile,navigation,setIsLoading,dispatch) {
  // obj,role,navigation,setIsLoading,uid
  console.log('\x1b[46m%s %s\x1b[0m ','navToChat obj', obj,userProfile)
  // setIsLoading(true)
  
    //todo 
    //1 получить заявку по точке
    //2 получить чаты по точке клиент/водитель
    //перейти в чат

    //1 tender
    const responseTender = await get(`tenders/${obj.tenderId}`)

    if(!responseTender.success){
      setIsLoading(false)
      dispatch(setNavigationObjTo(null))
      alert(`Ошибка перехода в заявку ${responseTender.error}`)
      return
    }
    
    //!!client
    if(userProfile.role === 'client') {
      //2 chat
      const responseChat = await get(`tenders/${obj.tenderId}/drivers/${obj.partnerId}/messages`)

      if(!responseChat.success){
        setIsLoading(false)
        dispatch(setNavigationObjTo(null))
        alert(`Ошибка перехода в чат ${responseChat.error} 'obj:' ${JSON.stringify(obj,null,2)}`)
        return
      }
      console.log('responseChat.data', responseChat.data)

      const userInfo = {
        name: responseChat.data.forms.profile.name, 
        avatar: responseChat.data.forms.profile.clientAvatar, 
        userId: responseChat.data.forms.profile.id,
        rating: responseChat.data.forms.profile.rating,
        quantityTenders: responseChat.data.forms.profile.quantityTenders,
        phone: responseChat.data.forms.profile.phone
      }
      const data = {
        forms: responseChat.data.forms,
        messages: responseChat.data.messages,
        repl: responseChat.data.reply,
      }

      // console.log('userInfo', userInfo)
      // console.log('data', JSON.stringify(data,null,2))
      setIsLoading(false)

      try {

        //todo проверить все условия
        if(responseTender.data.driverId === null && responseTender.data.archived === false) {

            navigation.navigate('TendersTab',{
              state: {
                routes: [{
                  name: 'Tenders'
                },
                {
                  name: 'TenderItemClient',
                  params: {dataTender: responseTender.data}
                },
                {
                  name: 'Chat',
                  params: {item: responseTender.data, userInfo: userInfo, data: data}
                }]
              }
            })
        } else {
          navigation.navigate('ActiveTendersTab',{
            name: 'ActiveTendersTab', 
            state: {
              routes: [{
                  name: 'ActiveTenders'
                },
                {
                  name: 'TenderItemClient',
                  params: {dataTender: responseTender.data}
                },
                {
                name: 'Chat',
                params: {item: responseTender.data, userInfo: userInfo, data: data}
              }]
            }
          })
        }

      } catch (error) {
        setIsLoading(false)
        dispatch(setNavigationObjTo(null))
        console.log('\x1b[46m%s %s\x1b[0m', 'trycatch navToChat error:', error);
        alert(`onOpenChatWithPush error ${error} 'obj:' ${JSON.stringify(obj,null,2)}`)
      }
      
    } else {
      //!!driver
      //2 chat
      const responseChat = await get(`tenders/${obj.tenderId}/replies/drivers/${userProfile.id}`)

      if(!responseChat.success){
        setIsLoading(false)
        dispatch(setNavigationObjTo(null))
        alert(`Ошибка перехода в чат ${responseChat.error} 'obj:' ${JSON.stringify(obj,null,2)}`)
        return
      }
      // console.log('responseChat.data', responseChat.data)
      try {
        const userInfo = {
          name: responseChat.data.forms.profile.name, 
          avatar: responseChat.data.forms.profile.clientAvatar, 
          userId: responseChat.data.forms.profile.id,
          rating: responseChat.data.forms.profile.rating,
          quantityTenders: responseChat.data.forms.profile.quantityTenders,
          phone: responseChat.data.forms.profile.phone
        }
        const data = {
          forms: responseChat.data.forms,
          messages: responseChat.data.messages,
          repl: responseChat.data?.reply,
        }
        
        // console.log('userInfo', userInfo)
        // console.log('data', JSON.stringify(data,null,2))
  
        setIsLoading(false)
        if(responseTender.data.driverId !== null && responseTender.data.driverId == userProfile.id) {
          //  && responseTender.data.archived === false - так ка может быть в архиве
  
          navigation.navigate('ActiveDriverTendersTab',{ 
            state: {
              routes: [{
                  name: 'ActiveDriverTenders'
                },
                {
                  name: 'TenderItemScreen',
                  params: {dataTender: responseTender.data}
                },
                {
                  name: 'Chat',
                  params: {item: responseTender.data, userInfo: userInfo, data: data}
                }]
            }
          })
        } else {
          navigation.navigate('SearchTab',{
            state: {
              routes: [{
                  name: 'Search'
                },
                {
                  name: 'TenderItemScreen',
                  params: {dataTender: responseTender.data}
                },
                {
                name: 'Chat',
                params: {item: responseTender.data, userInfo: userInfo, data: data}
              }]
            }
          })
        }
      } catch (error) {
        setIsLoading(false)
        dispatch(setNavigationObjTo(null))
        // dispatch(setTestData({ responseChat:responseChat.data,responseTender: responseTender.data, userId: userProfile.id, userRole: userProfile.role}))
        console.log('\x1b[46m%s %s\x1b[0m', 'trycatch navToChat error:', error);
        alert(`onOpenChatWithPush error ${error} 'obj:' ${JSON.stringify(obj,null,2)}, `)
      }
    }
}



    // await firestore()
    // .collection('tenders')
    // .doc(obj.data.tenderId)
    // .get()
    // .then(documentSnapshot => {
    //   // console.log('documentSnapshot', documentSnapshot.data(),documentSnapshot.id)
    //   let item = {
    //     data: {
    //       data: documentSnapshot.data(), id: documentSnapshot.id
    //     }
    //   }
    //   role==='client' ? item.userInfo = obj.data : null
    //   // setTimeout(()=>{
    //   // },1000)
      

    //   if(role==='driver') {
    //     // navigation.navigate('Chat',{item: item.data})
    //     if(item.data.data.driverId !== null && item.data.data.driverId == uid && item.data.data.archived === false) {

    //       navigation.reset({
    //         index: 0,
    //         routes: [{
    //           name: 'SearchTab', 
    //           state: {
    //             routes: [{
    //               name: 'Chat',
    //               params: {item: item.data,}
    //             }]
    //           }
    //         }],
    //       })
    //     } else {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{
    //           // name: 'Tenders', 
    //           name: 'ActiveDriverTendersTab', 
    //           state: {
    //             routes: [{
    //               name: 'Chat',
    //               params: {item: item.data,}
    //             }]
    //           }
    //         }],
    //       })

    //     }
        
    //   } else {
    //     if(item.data.data.driverId !== null && item.data.data.archived === false) { 

    //       navigation.reset({
    //         index: 0,
    //         routes: [{
    //           name: 'TendersTab', 
    //           state: {
    //             routes: [{
    //               name: 'Chat',
    //               params: {item: item.data, userInfo: item.userInfo}
    //             }]
    //           }
    //         }],
    //       })
    //     } else {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{
    //           name: 'ActiveTendersTab', 
    //           state: {
    //             routes: [{
    //               name: 'Chat',
    //               params: {item: item.data, userInfo: item.userInfo}
    //             }]
    //           }
    //         }],
    //       })

    //     }
    //     // navigation.navigate('Chat',{item: item.data, userInfo: item.userInfo})
    //   }
    //   setIsLoading(false)
    // })
    // .catch((err)=>{
    //   setIsLoading(false)
    //   console.log('\x1b[46m%s %s\x1b[0m', 'firestore navToChat error:', err);
    // })