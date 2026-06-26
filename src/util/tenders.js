// import firestore from '@react-native-firebase/firestore';
const firestore = () =>{}
import { createNotification, createNotificationAll, getDriverTndActv } from './firebase';
import { setDriverTenderAvtivity } from '../store/features/userSlice';
import dayjs from 'dayjs';
import { post, put } from '../store/features/api/user-api';
import { Linking } from 'react-native';
import { messageIdGenerator } from './msgGenerator';

// let 111222 = {
//   partnerId: role==='driver'? betState.clientId : betState.userId, //id клиента
//   partnerRole: role==='driver'? 'client' : 'driver',
//   read: false,
//   tenderId: betState.tenderId,
//   text: userMsg,
//   textSystem: null,
//   typeMsg: 'orderCanceled',
//   system: true,
//   priceBet: null,
//   replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
//   userId: role==='driver'? betState.userId : betState.clientId, // id отправителя сообщения
//   userRole: role==='driver'? 'driver' : 'client',
//   size: null,
//   uri: null,
//   file_type: null,
//   name: null,
//   thumbnail: null
// }


  export async function addMsg(msgObj) {
    console.log('addMsg start:',msgObj )
    try {
      const respCancelMsg = await post("messages",msgObj)
                      
      if (!respCancelMsg.success) {
        console.warn('Ошибка запроса post messages:', respCancelMsg.error);
        //возврат ошибки функцией
        // alert(respCancelMsg.error);
        return 'error';
      }
      return null

    } catch(error) {
      console.log('addMsg error', error)
      return 'error';
    }

  }

//--- sendBet send only driver водитель---
//!!сделать ставку
//todo test
//* - ready && tested driver
  export async function sendBet(
      priceBet,
      tenderState,
      userProfileInfo,
      profileClient,
      setQuickBet
    ){
    //может добавить остальные поля которые пустые?
    console.log('sendBet :', priceBet, tenderState.id,)

    let objBet
    const deteNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    if(setQuickBet === true) {
      objBet = {
        updateBetAt: deteNow,
        acceptedByDriverAt: true,
        pickCandidateAt: null,
        rejectedAt: null,
        rejectedByDriverAt: null,
        clientId: tenderState.userId,
        clientName: profileClient.name,
        driverName: userProfileInfo.name,
        price: tenderState.price,
        tenderPrice: tenderState.price,
        tenderId: tenderState.id,
        name: tenderState.name,
        userId: userProfileInfo.id,
        driverBet: 0,
        driverBetStatus: null,
        // driverAvatar: userProfileInfo.driverAvatar,
        clientBet: tenderState.price,
        clientBetStatus: 'accept',
        betUpdate: tenderState.price,
        finalBet: tenderState.price,
        cancelByDriver: false
      }
    } else {
      objBet = {
        updateBetAt: deteNow,
        acceptedByDriverAt: false,
        pickCandidateAt: null,
        rejectedAt: null,
        rejectedByDriverAt: null,
        clientId: tenderState.userId,
        clientName: profileClient.name,
        driverName: userProfileInfo.name,
        price: priceBet,
        tenderPrice: tenderState.price,
        tenderId: tenderState.id,
        name: tenderState.name,
        userId: userProfileInfo.id,
        driverBet: priceBet,
        driverBetStatus: 'wait',
        // driverAvatar: userProfileInfo.driverAvatar,
        clientBet: tenderState.price,
        clientBetStatus: 'cancel',
        betUpdate: priceBet,
        finalBet: null,
        cancelByDriver: false
      }
    }

    // console.log('objBet', objBet)
    //!! quick bet
    const msgObjBet = {
      _id: messageIdGenerator(),
      createdAt: Date.now(),
      partnerId: tenderState.userId, //id клиента
      partnerRole: 'client',
      read: false,
      tenderId: tenderState.id,
      text: null, //!!todo проверить как будет отображаться в чате
      textSystem: setQuickBet === true ? 'acceptTenderByDriver': 'newBetByDriver',
      userId: userProfileInfo.id,
      userRole: 'driver',
      typeMsg: setQuickBet === true ? 'acceptTenderByDriver': 'newBetByDriver',
      system: true,
      replyId: null,
      priceBet: setQuickBet === true ?   tenderState.price : priceBet,
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }
      
    try {

      //todo post request
      const response = await post(`replies`,objBet)
                  
      if (!response.success) {
        console.warn('Ошибка запроса post replies:', response.error);
        //
        alert(`sendBet post replies ${response.error}`);
        return null;
      }
      // console.log('response.data', response.data)
      msgObjBet.replyId = response.data?.id ? response.data?.id : null

      // console.log('sendBet msgObjBet', msgObjBet)

      return { data: response.data, message: msgObjBet } //new docs 'quiqbet'
      // return { data: response.data } //new docs 'quiqbet'

      // let obj = {'driverTenderActivity': firestore.FieldValue.arrayUnion(tenderId) }

    } catch (error) {
      console.log('sendBet error', error)
      alert(error)
      return null;
    }
  }

  //!! обновить ставку 
  //* ready and tested driver & client
  export async function updateBet(value,betState,role) {
    console.log('updateBet', value,role)
    let objChange;

    const deteNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    if(role === 'client') {
        objChange = {
          updateBetAt: deteNow,
          driverBetStatus: "cancel",
          clientBet: value,
          clientBetStatus: "wait",
          betUpdate: value
        }
        //!! для чего driverBet = 0 ?
        if(betState.acceptedByDriverAt === true) {
          objChange.acceptedByDriverAt = false
          objChange.driverBet = 0
          objChange.driverBetStatus = null
        }

    } else {
      objChange = {
        updateBetAt: deteNow,
        driverBet: value,
        driverBetStatus: "wait",
        clientBetStatus: "cancel",
        betUpdate: value,
        price: value
      }
    }
    console.log('objChange', objChange)

    let msgObjBet = {
      _id: messageIdGenerator(),
      createdAt: Date.now(),
      partnerId: role==='driver'? betState.clientId : betState.userId, //id клиента
      partnerRole: role==='driver'? 'client' : 'driver',
      read: false,
      tenderId: betState.tenderId,
      text: null,
      textSystem: role==='driver' ? 'newBetByDriver': 'newBetByClient',
      typeMsg: role==='driver' ? 'newBetByDriver': 'newBetByClient',
      system: true,
      priceBet: value,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      userId: role==='driver'? betState.userId : betState.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }
    // console.log('updateBet msgObjBet', msgObjBet)

    try {

      const response = await put(`replies/${betState.id}`,objChange)
                  
      if (!response.success) {
        console.warn('Ошибка запроса replies/id upd:', response.error);
        //
        alert(response.error);
        return null;
      }
      console.log('response.data', response.data)

      //TODO убрать сообщение и в месте обработки результата функции 
      return { data: response.data, message: msgObjBet } //new docs 'updbet'

    } catch (error) {

      console.log('updateBet error', error)
      alert(error)
      return null;
    }
  }

  //!! принять предложение выполнить заказ - клиент
  //* - ready and tested client
  export async function onAcceprCurrTender(
    betState,
    tenderStateData
  ){
    console.log('onAcceprCurrTender :',)
    // console.log('onAcceprCurrTender :',betState.betUpdate, '\n', 'betState:', betState, '\n', 'tenderStateData: ', tenderStateData)

    let obj = {
      'acceptedByDriverAt': true,
      'finalBet': betState.betUpdate,
      'betUpdate': betState.betUpdate,
      'driverBetStatus': 'accept'
    }

    let msgObjBet = {
      partnerId:  betState.userId,
      partnerRole: 'driver',
      read: false,
      tenderId: betState.tenderId,
      text: null,
      textSystem: 'acceptTenderByClient',
      typeMsg: 'acceptTenderByClient',
      system: true,
      priceBet: betState.betUpdate,
      replyId: betState.id,
      userId: betState.clientId,
      userRole: 'client',
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }

    // console.log('onAcceprCurrTender msgObjBet', msgObjBet)
    try {
      //todo запрос комплексный - replies изменение, tenders - изменение, всем водителям кроме исполнителя разослать сообщение что выбран другой исполнитель
      //!! пока не будет одной точки

      // const responseBet = await put(`replies/${betState.id}`,obj)
                  
      // if (!responseBet.success) {
      //   console.warn('Ошибка запроса replies/id upd:', responseBet.error);
      //   //
      //   alert(responseBet.error);
      //   return null;
      // }
      // console.log('responseBet.data', responseBet.data)

      // const objTender = {
      //   'driverId': betState.userId,
      //   'replyId': betState.id,
      //   'newPrice': betState.betUpdate
      // }

      // const responseTender = await put(`tenders/${betState.tenderId}`,objTender)
                  
      // if (!responseTender.success) {
      //   console.warn('Ошибка запроса tenders/id upd:', responseTender.error);
      //   //
      //   alert(responseTender.error);
      //   return null;
      // }
      // console.log('responseTender.data', responseTender.data)

      // await addMsg(msgObjBet)
      
      // return {
      //   repl: responseBet.data,
      //   tender: responseTender.data
      // }

      //? new endpoint
      //tenders/${tenderStateData.id}/replies/${betState.id}/apply/
      const respAccept = await post(`tenders/${tenderStateData.id}/replies/${betState.id}/apply`,obj)
                  
      if (!respAccept.success) {
        console.warn('Ошибка запроса respAccept:', respAccept.error);
        //
        alert(respAccept.error);
        return null;
      }
      console.log('respAccept.data', respAccept.data)
      if(respAccept.data?.message == "Applied to tender successfully") {

        //todo - добавлять заявку в форме активные заявки у водителя (driverActiveTender) по новой точке PUT /api/forms/users/4
        // await addMsg(msgObjBet)

        //!!возвращать сообщение не надо так как будет получение сообщений с точки по переходу заявки в работу
        return respAccept // {data , message: msgObjBet}
      } else {
        return respAccept //{data , message: msgObjBet}
      }

    } catch (error) {
      console.log('Ошибка onAcceprCurrTender', error)
    }
  }

  //!!принять предложение выполнить заказ водитель апдейт поля acceptedByDriverAt
  //*  ready and tested driver 
  export async function onAcceprCurrBetByDriver(
    role,priceTender,betState,
    // setIsLoading,messageIdGenerator,role,priceTender, betState, onCloseDialog, driverAvatar
  ){
    console.log('onAcceprCurrBetByDriver','priceTender, betState,' )

    // const deteNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let objChange = {
      'acceptedByDriverAt': true,
      'finalBet': priceTender,
      'betUpdate': priceTender,
    }
    if(role==='driver') {
      objChange.clientBetStatus='accept'
    
    } else {
      objChange.driverBetStatus='accept'
    }

    console.log('objChange',objChange)

    let msgObjBet = {
      _id: messageIdGenerator(),
      createdAt: Date.now(),
      partnerId: betState.clientId, //id клиента
      partnerRole: 'client',
      read: false,
      tenderId: betState.tenderId,
      text: null,
      textSystem: 'acceptTenderByDriver',
      typeMsg: 'acceptTenderByDriver',
      system: true,
      priceBet: priceTender,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      userId: betState.userId, // id отправителя сообщения
      userRole: 'driver',
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }
    // console.log('onAcceprCurrBetByDriver msgObjBet', msgObjBet)

    try {
      //todo put upd replies
      const response = await put(`replies/${betState.id}`,objChange)
                  
      if (!response.success) {
        console.warn('Ошибка запроса put replies/id upd:', response.error);
        //
        alert(response.error);
        return null;
      }
      console.log('response.data', response.data)

      // await addMsg(msgObjBet)
      return {data: response.data, message: msgObjBet} //new doc

    } catch (error) {
      console.log('Ошибка onAcceprCurrTender', error)
      alert(response.error);
      return null;
    }
  }

  //!!отзывы
  //*  ready and tested driver & -
  export async function sendTestimonials(
    partnerProfile,
    userFormsInfo,
    tenderState,
    role,
    userMsg,
    userRating,
    setOnError,
    onPress,
    onClose
  ) {
    //userId - 
    console.log('sendTestimonials', partnerProfile,userFormsInfo, tenderState.id)
    //добавлять кому адресован отзыв 
    const partnerRole = role === 'driver' ? 'client' : 'driver'
    const deteNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const objFb = {
      // createdAt: deteNow,
      message: userMsg,
      score: userRating,
      tenderId: tenderState.id,
      userId: userFormsInfo.profile.id,
      userRole: role,
      partnerId: partnerProfile.profile.id,
      partnerRole: partnerRole
    }
    const objDr = {
      finishedAt: deteNow
    }
    const objCl = {
      archived: true
    }

    const msgObjFeedback = {
      partnerId: partnerProfile.profile.id,
      partnerRole: partnerRole,
      read: false,
      tenderId: tenderState.id,
      text: userMsg,
      textSystem: 'feedback',
      userId: userFormsInfo.profile.id,
      userRole: role,
      typeMsg: 'feedback',
      system: true,
      priceBet: userRating, //!! тут лежит рейтинг
      replyId: null,
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }

    // console.log('sendTestimonials msgObjFeedback', msgObjFeedback)
    console.log('objFb', objFb)
    try {
      
      //setOnError если ошибка
      
      //создать feedback
      
      //* если водитель то finishedAt если клиент archived
      if(role === 'driver') {
        const responseFb = await post(`feedback`,objFb)
  
        if (!responseFb.success) {
          console.warn('Ошибка запроса feedback :', responseFb.error);
          //
          setOnError(responseFb.error);
          return null; //todo вернуть ошибку
        }

        console.log('responseFb.data', responseFb.data)

        const responseTenderDr = await put(`tenders/${tenderState.id}`,objDr)
                    
        if (!responseTenderDr.success) {
          console.warn('Ошибка запроса tenders/id upd:', responseTenderDr.error);

          //
          setOnError(responseTenderDr.error);
          return null; //todo вернуть ошибку
        }
        // await addMsg(msgObjFeedback)

        // console.log('responseTenderDr.data', responseTenderDr.data)
        return responseTenderDr.data 

      } else {
        //old 
        // const responseTender = await put(`tenders/${tenderState.id}`,objCl)
                    
        // if (!responseTender.success) {
        //   console.warn('Ошибка запроса tenders/id upd:', responseTender.error);
        //   //
        //   setOnError(responseTender.error);
        //   return null; //todo вернуть ошибку
        // }
        // // console.log('responseTender.data', responseTender.data)

        // await addMsg(msgObjFeedback)

        // return responseTender.data

        const finishFeedbackObj = {
          testimonial: userMsg,
          score: userRating
        }
        //? new endpoint
        // /api/tenders/{tenderId}/finish
        // !! ошибка Tender already finished - надо написать
        const responseTender = await post(`tenders/${tenderState.id}/finish`,finishFeedbackObj)
                    
        if (!responseTender.success) {
          console.warn('Ошибка запроса post finish:', responseTender.error);
          //
          setOnError(responseTender.error);
          return null; //todo вернуть ошибку
        }
        console.log('responseTender.data', responseTender.data)

        // await addMsg(msgObjFeedback)

        return responseTender.data //!! {data: responseTender.data, message: msgObjFeedback }
        // return {data: responseTender.data, message: msgObjFeedback }


      }
    } catch (error) {
      // onError(true)
      console.log('sendTestimonials error', error)
    }
  }

  //!! отменить выполнение заказа 
  export async function cancelDelivery(
    role,
    betState,
    tenderState,
    userMsg, 
    onClose
  ) {
    console.log('cancelDelivery: ', 'Отменить заказ', betState,tenderState,)

    let idUser = role === 'driver' ? betState.userId : betState.clientId
    const deteNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    
    const objCancel = {
      driverId: null,
      driverName: null,
      replyId: null,
      canceledAt: deteNow,
      canceledBy: idUser,
      canceledMessage: userMsg,
      finishedAt: null
    }
    console.log('objCancel', objCancel)

    //чистить объект ставки 
    const ojReplUpdate = {
      acceptedByDriverAt: false,
      pickCandidateAt: null,
      rejectedAt: null,
      rejectedByDriverAt: null,
      driverBet: betState.tenderPrice,
      driverBetStatus: 'cancel',
      clientBet: betState.tenderPrice,
      clientBetStatus: 'wait',
      price: betState.tenderPrice,
      betUpdate: betState.tenderPrice,
      updateBetAt: null,
      finalBet: null
    }
    // console.log('betState.id', betState.id)
    
    if(role === 'driver') ojReplUpdate.cancelByDriver = true
    console.log('ojReplUpdate', ojReplUpdate)
    
    let msgObjCancel = {
      partnerId: role==='driver'? betState.clientId : betState.userId, //id клиента
      partnerRole: role==='driver'? 'client' : 'driver',
      read: false,
      tenderId: betState.tenderId,
      text: userMsg,
      textSystem: 'orderCanceled',
      typeMsg: 'orderCanceled',
      system: true,
      priceBet: null,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      userId: role==='driver'? betState.userId : betState.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      size: null,
      uri: null,
      file_type: null,
      name: null,
      thumbnail: null
    }
    // console.log('msgObjCancel', msgObjCancel)
    
    try {
      
      // const responseBet = await put(`replies/${betState.id}`,ojReplUpdate)
      // if (!responseBet.success) {
      //   console.warn('Ошибка запроса replies/id upd:', responseBet.error);
      //   //
      //   alert(responseBet.error);
      //   return null;
      // }
      // // console.log('responseBet.data', responseBet.data)

      // const responseTender = await put(`tenders/${betState.tenderId}`,objCancel)
      // if (!responseTender.success) {
      //   console.warn('Ошибка запроса tenders/id upd:', responseTender.error);
      //   //
      //   alert(responseTender.error);
      //   return null;
      // }
      // // console.log('responseTender.data', responseTender.data)
      // return {
      //   repl: responseBet.data,
      //   tender: responseTender.data,
      // }
      
      //? new endpoint cancel
      // POST /api/tenders/{tenderId}/cancel
      let objMsgCancel = {message: userMsg}
      const responseCancel = await post(`tenders/${tenderState.id}/cancel`,objMsgCancel)
      if (!responseCancel.success) {
        console.warn('Ошибка запроса tenders/id/cancel :', responseCancel.error);
        //
        alert(responseCancel.error);
        return null;
      }
      console.log('responseCancel.data', responseCancel.data)

      // отправка сообщения об отмене заявки
      // await addMsg(msgObjCancel)

      return responseCancel.data
      

    } catch (error) {
      // onClose(false)
      console.log('cancelDelivery error', error)
      return null
    }
  }

  export function onCloseModal(setTextMessage, setIsVisibleModalBet, setIsVisibleModalMessage) {
    setTextMessage({
      message: '',
      price: ''
    })
    // setIsVisibleModalMessage(false)
    setIsVisibleModalBet(false)
  }

  //звонок
  export async function handlerCallNumer(phone) {
    // console.log('CALL', uidtoCall)
    Linking.openURL(`tel:${phone}`)
  }

  //!! пока эти фун-и не нужны
  //чаты в неактивные
  export async function handleAddChatToHiddenBothRole(
    driverId,
    clientId,
    tenderId,
    role,
    dispatch,
    getTenderHidden,
    userProfileTenderHidden,
    hiddenStateClient=[],
    getTenderHiddenClient,
    userProfileTenderHiddenClient,
    // onCloseNav,
  ) {
      //добавление чата в неактивные
      if(role==='client') {
        let driverObj = {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}
        console.log('driverObj', driverObj)

        try {
          //upd profile driver
          await firestore().collection('forms').doc(driverId).update(driverObj)
  
          //find obj in hidden
          let filterHidden = hiddenStateClient !== null ? hiddenStateClient.find(item=>item.tenderId===tenderId && item.userId === driverId) : undefined
          console.log('filterHidden', filterHidden)
          if(filterHidden === undefined) {
  
            let objProfile = {
              'hiddenTendersClient': hiddenStateClient !== null ? hiddenStateClient.concat([{userId: driverId, tenderId: tenderId}]) : [{userId: driverId, tenderId: tenderId}],
            }
  
            console.log('objProfile', objProfile)
            //upd profile client
  
            await firestore().collection('forms').doc(clientId).update(objProfile).then((res)=> {
              console.log('forms update &&  getTenderHiddenClient', )
              getTenderHiddenClient(clientId,dispatch,userProfileTenderHiddenClient)
            })
            // .finally((res)=> {onCloseNav()})
          } else {
            console.log('obj already in profile', )
            // onCloseNav()
          }          
        } catch (error) {          
          console.log('handleAddChatToHiddenBoth client  error ', error)
        }
        
      } else {
        //driver
        let driverObj = {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}
        console.log('driverObj', driverObj)

        try {
          //upd profile driver
          await firestore().collection('forms').doc(driverId).update(driverObj).then((res)=> {
            console.log('driverObj add res', res)
            getTenderHidden(driverId,dispatch,userProfileTenderHidden)
          })
  
          //recieve client hidden state
          await firestore().collection('forms').doc(clientId).get().then((documentSnapshot) => {
            if(documentSnapshot.get('hiddenTendersClient') !== undefined && 
            documentSnapshot.get('hiddenTendersClient') !== null) {
              let filterHidden = documentSnapshot.data().hiddenTendersClient !== null ? documentSnapshot.data().hiddenTendersClient?.find(item=>item.tenderId===tenderId && item.userId === driverId) : undefined
              console.log('filterHidden', filterHidden)
              if(filterHidden === undefined) {
  
                let objProfile = {
                  'hiddenTendersClient': documentSnapshot.data().hiddenTendersClient !== null ? documentSnapshot.data().hiddenTendersClient?.concat([{userId: driverId, tenderId: tenderId}]) : [{userId: driverId, tenderId: tenderId}],
                }
                console.log('objProfile', objProfile)
  
                firestore().collection('forms').doc(clientId).update(objProfile)
              }
            }
          })
          
        } catch (error) {
          console.log('handleAddChatToHiddenBoth driver  error ', error)
        }
      }

  }

  export async function addUsersWithChatsToHidden(arrOfUserToHidden,hiddenTenderClient,uid,tenderDocument) {
    console.log('addUsersWithChatsToHidden start arrOfUserToHidden', arrOfUserToHidden,'hiddenTenderClient',hiddenTenderClient)
    //usersIdWithChat - юзеров добавлять в неактивные себе и им
    //в скрытые себе
    try {
      //есть юзеры для добавления в скрытые
      //проверяем есть ли они в скрытых
        let isHiddenFrr = arrOfUserToHidden.filter(elemfl => {
          let res = hiddenTenderClient.find(elemfnd => elemfnd.userId === elemfl.userId && elemfnd.tenderId === elemfl.tenderId)
          console.log('проверяем есть ли они в скрытых res', res)
          if(res === undefined) {
            return elemfl
          }
        })
        console.log('isHiddenFrr', isHiddenFrr)
        //
        if(isHiddenFrr?.length > 0) {
          firestore()
            .collection('forms')
            .doc(uid)
            .update({
              'hiddenTendersClient': hiddenTenderClient.concat(isHiddenFrr)
            })
            .then(res => {
              console.log('add to hiddenTendersClient succeed', )
              
              //после добавления к себе в скрытые добавлаем в скрытые всем из usersIdWithChat
              tenderDocument.data?.usersIdWithChat.forEach(elemId => {
                firestore()
                .collection('forms')
                .doc(elemId)
                .update({
                  'hiddenTenders': firestore.FieldValue.arrayUnion(tenderDocument.id)
                })
                .then(res => { 
                  console.log('add to hiddenTenders succeed', )
                })
              })
              //обновлять стейт скрытых после загрузки всех заявок            
            })
          
        } else {
          tenderDocument.data?.usersIdWithChat.forEach(elemId => {
            firestore()
            .collection('forms')
            .doc(elemId)
            .update({
              'hiddenTenders': firestore.FieldValue.arrayUnion(tenderDocument.id)
            })
            .then(res => { 
              console.log('add to hiddenTenders succeed', )
            })
          })
        }

        
    } catch (error) {
      console.log('addUsersWithChatsToHidden error', error)
    }
  }

  export async function restoreUsersWithChatsFromHidden(hiddenTenderClient,uid,tenderDocument,role,partnerId) {
    console.log('\x1b[44m%s %s\x1b[0m','restoreUsersWithChatsFromHidden start')
    console.log('data:', hiddenTenderClient,uid,tenderDocument,role,partnerId)
    //hiddenTenderClient - стейт клиента с неактивными юзерами (но без водителя)
    // uid- uid
    //tenderDocument - заявка
     
    let ids = tenderDocument.data?.usersIdWithChat
    // let ids = tenderDocument.data?.usersIdWithChat?.length > 0 ? tenderDocument.data?.usersIdWithChat.filter(item => item!== partnerId) : []
    console.log('ids', ids)
    
    if(ids?.length > 0) {

      if(role==='client') {
        try {
          //isHiddenFrr - массив с юзерами для восстановления
          let arrToCheck = ids?.length > 0 ? ids.map(elem => {
            return {userId: elem, tenderId: tenderDocument.id}
          }) : []

          let isHiddenFrr = hiddenTenderClient.filter(elemfl => {
            let res = arrToCheck.find(elemfnd => elemfnd.userId === elemfl.userId && elemfnd.tenderId === elemfl.tenderId)
            console.log('проверяем есть ли они в скрытых res: res ', res)
            if(res === undefined) {
              console.log('elemfl: ', elemfl)
              return elemfl
            }
          })
          //исполнителя в неактивные добавляем себе
          //проверяем что бы в массиве был водитель
          let checkDriverInArr = isHiddenFrr.find(elefnuser => elefnuser.userId === partnerId && elefnuser.tenderId === tenderDocument.id)
          console.log('checkDriverInArr', checkDriverInArr)
          
          if(checkDriverInArr === undefined) {
            isHiddenFrr.push({userId: partnerId, tenderId: tenderDocument.id})
          }
          console.log('isHiddenFrr', isHiddenFrr)

          //!! и водителю
          try {
            let driverObj = {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderDocument.id)}
            console.log('driverObj', driverObj)
            //upd profile driver
            await firestore().collection('forms').doc(partnerId).update(driverObj)
          } catch (errorf) {
            console.log('restoreUsersWithChatsFromHidden client update driverObj firestoreerror', errorf)
          }
          
          let idsWithoutDriver = tenderDocument.data?.usersIdWithChat.filter(item => item!== partnerId)
          console.log('idsWithoutDriver', idsWithoutDriver)
          if(isHiddenFrr?.length > 0) {
            firestore()
              .collection('forms')
              .doc(uid)
              .update({
                'hiddenTendersClient': isHiddenFrr
              })
              .then(res => {
                console.log('add to hiddenTendersClient succeed', )                
                //после добавления к себе в скрытые добавлаем в скрытые всем из ids (все чаты кроме водителя)
                
                idsWithoutDriver?.length > 0 && idsWithoutDriver.forEach(elemId => {
                  firestore()
                  .collection('forms')
                  .doc(elemId)
                  .update({
                    'hiddenTenders': firestore.FieldValue.arrayRemove(tenderDocument.id)
                  })
                  .then(res => { 
                    console.log('add to hiddenTenders succeed', )
                    })
                })
                //обновлять стейт скрытых после загрузки всех заявок            
              })
            
          } else {
            idsWithoutDriver?.length > 0 && idsWithoutDriver.forEach(elemId => {
              firestore()
              .collection('forms')
              .doc(elemId)
              .update({
                'hiddenTenders': firestore.FieldValue.arrayRemove(tenderDocument.id)
              })
              .then(res => { 
                console.log('add to hiddenTenders succeed', )
                })
            })
          }
            
        } catch (error) {
          console.log('restoreUsersWithChatsFromHidden client error', error)
        }  
      } else {
        //driver
        console.log('\x1b[44m%s %s\x1b[0m','restoreUsersWithChatsFromHidden driver part')
        try {

          //1.добавить в неактивные себе
          try {
            let driverObj = {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderDocument.id)}
            console.log('driverObj', driverObj)
            //upd profile driver
            await firestore().collection('forms').doc(partnerId).update(driverObj)
          } catch (errorf) {
            console.log('restoreUsersWithChatsFromHidden driver update driverObj firestoreerror', errorf)
          }

          // 2.получить стейт неактивных клиента 
          //isHiddenArr - массив с юзерами для восстановления
          let arrToCheck = ids?.length > 0 ? ids.map(elem => {
            return {userId: elem, tenderId: tenderDocument.id}
          }) : []

          await firestore().collection('forms').doc(partnerId).get().then((documentSnapshot) => {
            if(documentSnapshot.get('hiddenTendersClient') !== undefined && 
            documentSnapshot.get('hiddenTendersClient') !== null) {

              //2.1. и убрать тех кто в arrToCheck
              let hiddenTenderClient = documentSnapshot.data().hiddenTendersClient

              let isHiddenArr = hiddenTenderClient.filter(elemfl => {
                let res = arrToCheck.find(elemfnd => elemfnd.userId === elemfl.userId && elemfnd.tenderId === elemfl.tenderId)
                console.log('проверяем есть ли они в скрытых res: ', res)
                if(res === undefined) {
                  console.log('elemfl: ', elemfl)
                  return elemfl
                }
              })
              //2.2.добавить в неактивные себя
               //проверяем что бы в массиве был водитель
              let checkDriverInArr = isHiddenArr.find(elefnuser => elefnuser.userId === partnerId && elefnuser.tenderId === tenderDocument.id)
              if(checkDriverInArr === undefined) {
                isHiddenArr.push({userId: partnerId, tenderId: tenderDocument.id})
              }
              console.log('isHiddenArr', isHiddenArr)

              let idsWithoutDriver = tenderDocument.data?.usersIdWithChat.filter(item => item!== partnerId)
              if(isHiddenArr?.length > 0) {
                firestore()
                  .collection('forms')
                  .doc(uid)
                  .update({
                    'hiddenTendersClient': isHiddenArr
                  })
                  .then(res => {
                    console.log('add to hiddenTendersClient succeed', )                
                    //после добавления к себе в скрытые добавлаем в скрытые всем из ids (все чаты кроме водителя)
                    idsWithoutDriver?.length > 0 && idsWithoutDriver.forEach(elemId => {
                      firestore()
                      .collection('forms')
                      .doc(elemId)
                      .update({
                        'hiddenTenders': firestore.FieldValue.arrayRemove(tenderDocument.id)
                      })
                      .then(res => { 
                        console.log('add to hiddenTenders succeed', )
                        })
                    })
                    //обновлять стейт скрытых после загрузки всех заявок            
                  })
                
              } else return false    
            }
          })
        } catch (error) {
          console.log('restoreUsersWithChatsFromHidden client error', error)
        } 
      }
    }
  }

  export async function restoreAllChats(hiddenTenderClient,uid,tenderDocument) {
    console.log('\x1b[44m%s %s\x1b[0m','restoreAllChats start')
    console.log('data:', hiddenTenderClient,uid,tenderDocument,)
    //hiddenTenderClient - стейт клиента с неактивными юзерами
    // uid- uid
    //tenderDocument - заявка
     
    let ids = tenderDocument.data?.usersIdWithChat
    // let ids = tenderDocument.data?.usersIdWithChat?.length > 0 ? tenderDocument.data?.usersIdWithChat.filter(item => item!== partnerId) : []
    console.log('ids', ids)
    
    if(ids?.length > 0) {

      try {
        //isHiddenFrr - массив с юзерами для восстановления
        let arrToCheck = ids?.length > 0 ? ids.map(elem => {
          return {userId: elem, tenderId: tenderDocument.id}
        }) : []

        let isHiddenFrr = hiddenTenderClient.filter(elemfl => {
          let res = arrToCheck.find(elemfnd => elemfnd.userId === elemfl.userId && elemfnd.tenderId === elemfl.tenderId)
          console.log('проверяем есть ли они в скрытых res: res ', res)
          if(res === undefined) {
            console.log('elemfl: ', elemfl)
            return elemfl
          }
        })
        console.log('isHiddenFrr', isHiddenFrr)

        if(isHiddenFrr?.length > 0) {
          firestore()
            .collection('forms')
            .doc(uid)
            .update({
              'hiddenTendersClient': isHiddenFrr
            })
            .then(res => {
              console.log('add to hiddenTendersClient succeed', )                
              //после добавления к себе в скрытые добавлаем в скрытые всем из ids (все чаты кроме водителя)
              
              ids?.length > 0 && ids.forEach(elemId => {
                firestore()
                .collection('forms')
                .doc(elemId)
                .update({
                  'hiddenTenders': firestore.FieldValue.arrayRemove(tenderDocument.id)
                })
                .then(res => { 
                  console.log('add to hiddenTenders succeed', )
                  })
              })
              //обновлять стейт скрытых после загрузки всех заявок            
            })
          
        } else {
          ids?.length > 0 && ids.forEach(elemId => {
            firestore()
            .collection('forms')
            .doc(elemId)
            .update({
              'hiddenTenders': firestore.FieldValue.arrayRemove(tenderDocument.id)
            })
            .then(res => { 
              console.log('add to hiddenTenders succeed', )
              })
          })
        }
          
      } catch (error) {
        console.log('restoreUsersWithChatsFromHidden client error', error)
      }
    }
  }
