// import firestore from '@react-native-firebase/firestore';
const firestore = () =>{}
import { createNotification, createNotificationAll, getDriverTndActv } from './firebase';
import { setDriverTenderAvtivity } from '../store/features/userSlice';

export async function firebeseUpdateTender(tenderId, obj) {
  console.log('firebeseUpdateTender start:',tenderId, obj )
  try {
    await firestore()
    .collection('tenders')
    .doc(tenderId)
    .update(obj)
    .then(result => console.log('result', result))
  } catch (error) {
    console.log('firebeseUpdateTender error', error)
    return 'error'
  }
}

export async function addMsg(obj) {
  console.log('addMsg start:',obj )
  try {
  await firestore()
    .collection('messages')
    .add(obj).then(() => {
    console.log('messages send successfully!');

    }).catch(e => console.log('messages  error:', e))
  } catch (error) {
    console.log('addMsg error', error)
    return 'error'
  }
}

//---водитель---
//сделать ставку
  export async function sendBet(
    setIsLoading,
    messageIdGenerator, 
    priceBet, 
    tenderId,
    tenderName, 
    userId,
    tenderPrice,
    uid,
    dispatch,
    setQuickBet,
    clientName,
    driverName,
    driverAvatar,
    rating,
    ){
    //может добавить остальные поля которые пустые?
    console.log('sendBet variable:', priceBet, tenderId,)
    // setIsLoading(true)
    
    // let priceBet = textMsg.price.length > 0 ? textMsg.price : tenderPrice
    // console.log( tenderPrice, setQuickBet)

    //разделение на ставку в чате(со своей ценой - цену клиента отклонять и ставку быструю - 
    //принимать цену клиента и ставить в своем поле цену клиента)
    let avatar = driverAvatar !== null ? driverAvatar : ''
    let notifObj = {
      // createdAt: dateCreare,
      createdAtServer: firestore.FieldValue.serverTimestamp(),
      type: setQuickBet === true ? "acceptedByDriver" : "newBid", //!! проверить пуши
      newPrice: setQuickBet === true ? tenderPrice : priceBet,
      tenderName: tenderName,
      tenderId: tenderId,
      userName: clientName,
      toUser: userId,
      fromUserName: driverName,
      fromUser: uid,
      userId: uid,
      data: {
        dataExist: 'yes',
        type: 'chat',
        tenderName: tenderName,
        tenderId: tenderId,
        clientId: userId,
        userId: uid,        
        driverAvatar: avatar,
        userName: driverName,
        receiverRole: 'client'
      }
    }
    setQuickBet === true ? notifObj.data.typeNotif = "acceptedByDriver" : null
    
    console.log('notifObj', notifObj)

    let objBet
    if(setQuickBet === true) {
      objBet = {
        updateBetAt: firestore.FieldValue.serverTimestamp(),
        acceptedByDriverAt: firestore.FieldValue.serverTimestamp(),
        pickCandidateAt: null,
        rejectedAt: null,
        rejectedByDriverAt: null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        clientId: userId,//route.params.dataTender.data.userId,
        clientName: clientName,
        driverName: driverName,
        // message: '',
        price: tenderPrice,
        tenderPrice: tenderPrice,
        tenderId: tenderId, //route.params.dataTender.id,
        name: tenderName, //route.params.dataTender.data.name,
        userId: uid,
        driverBet: null,
        driverBetStatus: null,
        driverAvatar: driverAvatar,
        clientBet: tenderPrice,
        clientBetStatus: 'accept',
        betUpdate: tenderPrice,
        finalBet: tenderPrice,
        cancelByDriver: false,
        rating: rating
      }
    } else {
      objBet = {
        updateBetAt: firestore.FieldValue.serverTimestamp(),
        acceptedByDriverAt: null,
        pickCandidateAt: null,
        rejectedAt: null,
        rejectedByDriverAt: null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        clientId: userId,//route.params.dataTender.data.userId,
        clientName: clientName,
        driverName: driverName,
        // message: '',
        price: priceBet,
        tenderPrice: tenderPrice,
        tenderId: tenderId, //route.params.dataTender.id,
        name: tenderName, //route.params.dataTender.data.name,
        userId: uid,
        driverBet: priceBet,
        driverBetStatus: 'wait',
        driverAvatar: driverAvatar,
        clientBet: tenderPrice,
        clientBetStatus: 'cancel',
        betUpdate: priceBet,
        finalBet: null,
        cancelByDriver: false,
        rating: rating
      }
    }

    console.log('objBet', objBet)
     
    try {
      await firestore()
      .collection('tenders')
      .doc(tenderId)
      .get()
      .then(documentSnapshot => {
        // documentSnapshot.data().isEdit === true
        if(documentSnapshot.data().isEdit === true) {
          alert('Заявка редактируется! Попробуйте сделать ставку позже!')
          //если флаг isEdit true то нельзя сделать ставку
        } else if(documentSnapshot.data().driverId!==null&&documentSnapshot.data().driverId!==uid) {
          alert('Заявку уже выполняет другой водитель.')
          
        } else {
          try {
            firestore()
            .collection('replies')
            .add(objBet)
            .then(documentSnapshot => {
              console.log('replies documentSnapshot id: ', documentSnapshot.id);

              //"Этап чаты" - запись  driverId&replyId поставить условие
              //свой id в заявку для рассылки массового пуша
              //быстрая ставка - когда сразу принимаешь предложение водителя
              if(setQuickBet===true) {

                //10,10 - записть в тендер driverId и replyId уже не нужна - это будет делакть клиент
                firestore()
                .collection('tenders')
                .doc(tenderId)
                .update({
                  'usersIdWithBet': firestore.FieldValue.arrayUnion(uid),
                  'usersIdWithChat': firestore.FieldValue.arrayUnion(uid),
                }).then((res)=>{
                  //если чат начался с принятия ставки водителем - то данные профиля будут браться из этого сообщения
                  const msgObjBet = {
                    _id: messageIdGenerator(),//рандомный id
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    id: null, //id документа - 
                    partnerId: userId, //id клиента
                    read: false,
                    replyId: documentSnapshot.id, //заполнять если сделана ставка и есть сообщение в ставке
                    tenderId: tenderId,
                    typeMsg: 'acceptTenderByDriver',
                    textSystem: 'systemMsg15978461238',
                    system: true,
                    driverAvatar: driverAvatar,
                    userName: driverName,
                    priceBet: tenderPrice,
                    userId: uid, // id отправителя сообщения(только водитель - делает ставку)
                    userRole: 'driver',
                    partnerRole: 'client',
                  }
                  //системное сообщение
                  console.log('setQuickBet msgObjBet', msgObjBet)
                  firestore()
                  .collection('messages')
                  .add(msgObjBet)
                  .then(documentSnapshot => {
                    console.log('messages documentSnapshot id: ', documentSnapshot.id);                
                  })

                })
              } else {

                //новый документ ставки - запись ставки -> системное сообщение -> в профиль запись ставки -> создание пуша
                const msgObj = {
                  _id: messageIdGenerator(),//рандомный id
                  createdAt: firestore.FieldValue.serverTimestamp(),
                  id: null, //id документа - 
                  partnerId: userId, //id клиента
                  read: false,
                  replyId: documentSnapshot.id, //заполнять если сделана ставка и есть сообщение в ставке
                  tenderId: tenderId,
                  textSystem: 'systemMsg15978461238',
                  typeMsg: 'newBetByDriver',
                  system: true,
                  priceBet: priceBet,
                  driverAvatar: driverAvatar,
                  userName: driverName,
                  // text: textMsg.message.length > 0 ? textMsg.message : 'Вы сделали ставку '+ priceBet + ' руб.',
                  userId: uid, // id отправителя сообщения(только водитель - делает ставку)
                  userRole: 'driver',
                  partnerRole: 'client',
                }
                //системное сообщение
                console.log('msgObj', msgObj)
                firestore()
                .collection('tenders')
                .doc(tenderId)
                .update({
                  'usersIdWithBet': firestore.FieldValue.arrayUnion(uid),
                  'usersIdWithChat': firestore.FieldValue.arrayUnion(uid),
                }).then((res)=>{
                  firestore()
                  .collection('messages')
                  .add(msgObj)
                  .then(documentSnapshot => {
                    console.log('messages documentSnapshot id: ', documentSnapshot.id);                
                  })
                })
              }
              //пуш
              createNotification(notifObj)
              //добавить айди заявки в driverTenderActivity
              let obj = {'driverTenderActivity': firestore.FieldValue.arrayUnion(tenderId) }

              firestore()
                .collection('forms')
                .doc(uid)
                .update(obj)
                .then(res => {
                  getDriverTndActv(uid,dispatch,setDriverTenderAvtivity)
                })
                .catch(e=>console.log('e', e))
            })
          } catch (error) {
            console.log('Ошибка создания ставки', error)
          }
        }
        setIsLoading(false)
      })
    } catch (error) {
      setIsLoading(false)
      console.log('sendBet error', error)
    }
  }

  //обновить ставку 
  export async function updateBet(
    setIsLoading,
    messageIdGenerator,
    value,
    role,
    betState,
    setBetInput,
    flag,
    clientName,
    driverName,
    driverAvatar
  ) {
    console.log('updateBet', value,role)
    let objChange;
    let notifObj;

    let msgObjBet = {
      _id: messageIdGenerator(),//рандомный id
      createdAt: firestore.FieldValue.serverTimestamp(),
      id: null, //id документа - 
      partnerId: role==='driver'? betState.data.clientId : betState.data.userId, //id клиента
      read: false,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      tenderId: betState.data.tenderId,
      typeMsg: role==='driver'?'newBetByDriver': 'newBetByClient',
      system: true,
      userName: role==='driver'? betState.data.driverName : betState.data.clientName,
      priceBet: value,
      userId: role==='driver'? betState.data.userId : betState.data.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      partnerRole: role==='driver'? 'client' : 'driver',
    }    
    console.log('updateBet msgObjBet', msgObjBet)

    let avatar = driverAvatar !== null ? driverAvatar : ''
    
    if(role === 'client') {
        objChange = {
          updateBetAt: firestore.FieldValue.serverTimestamp(),
          driverBetStatus: "cancel",
          clientBet: value,
          clientBetStatus: "wait",
          betUpdate: value,
        }
        if(betState.data.acceptedByDriverAt !== null) {
          objChange.acceptedByDriverAt = null
          objChange.driverBet = null
          objChange.driverBetStatus = null
        }
        
        notifObj={
          createdAtServer: firestore.FieldValue.serverTimestamp(),
          type: "newBid",
          newPrice: value,
          tenderName: betState.data.name,
          tenderId: betState.data.tenderId,
          userName: driverName,
          toUser: betState.data.userId,
          fromUserName: clientName,
          fromUser: betState.data.clientId,
          userId: betState.data.clientId,
          data: {
            dataExist: 'yes',
            type: 'chat',
            tenderName: betState.data.name,
            tenderId: betState.data.tenderId,
            clientId: betState.data.clientId,
            userId: betState.data.userId,
            receiverRole: 'driver'
          }
        }
    } else {
      objChange = {
        updateBetAt: firestore.FieldValue.serverTimestamp(),
        driverBet: value,
        driverBetStatus: "wait",
        clientBetStatus: "cancel",
        betUpdate: value,
        price: value,
      }
        notifObj={
          createdAtServer: firestore.FieldValue.serverTimestamp(),
          type: "newBid",
          newPrice: value,
          tenderName: betState.data.name,
          tenderId: betState.data.tenderId,
          userName: clientName,
          toUser: betState.data.clientId,
          fromUserName: driverName,
          fromUser: betState.data.clientId,
          userId: betState.data.userId,
          data: {
            dataExist: 'yes',
            type: 'chat',
            tenderName: betState.data.name,
            tenderId: betState.data.tenderId,
            clientId: betState.data.clientId,
            userId: betState.data.userId,
            driverAvatar: avatar,
            userName: driverName,
            receiverRole: 'client'
          }
        }
        
    }
    // console.log('notifObj', notifObj)
    console.log('objChange', objChange)

    try {
      await firestore().collection('replies')
      .doc(betState.id)
      .update(objChange)
      .then(documentSnapshot => {
        setBetInput('')

        //системное сообщение
        firestore()
        .collection('messages')
        .add(msgObjBet)
        .then(documentSnapshot => {
          console.log('messages documentSnapshot id: ', documentSnapshot.id);
        })

        //пуш
        createNotification(notifObj)
        setIsLoading(false)
          console.log('handlerChangeBet doc', documentSnapshot)
      })
    } catch (error) {
      setBetInput('')
      setIsLoading(false)
      console.log('handlerChangeBet error', error)
    }
  }

  //принять предложение выполнить заказ - клиент
  export async function onAcceprCurrTender(
    setIsLoading,
    messageIdGenerator,
    role,
    priceTender,
    betState,
    onCloseDialog,
    tenderStateData,
    driverAvatar,
    hiddenState,
    getTenderHiddenClient,
    dispatch,
    userProfileTenderHiddenClient,
    getClientActiveTender,
    setClientActiveTenderState
  ){
    console.log('onAcceprCurrTender priceTender:',priceTender, '\n', 'betState:', betState, '\n', 'tenderStateData: ', tenderStateData)

    let obj = {
      'acceptedByDriverAt': firestore.FieldValue.serverTimestamp(),
      'finalBet': priceTender,
      'betUpdate': priceTender,
    }
    if(role==='driver') {
      obj.clientBetStatus='accept'
    
    } else {
      obj.driverBetStatus='accept'
    }

    let msgObjBet = {
      _id: messageIdGenerator(),//рандомный id
      createdAt: firestore.FieldValue.serverTimestamp(),
      id: null, //id документа - 
      partnerId: role==='driver'? betState.data.clientId : betState.data.userId, //id клиента
      read: false,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      tenderId: betState.data.tenderId,
      typeMsg: role==='driver'?'acceptTenderByDriver': 'acceptTenderByClient',
      system: true,
      userName: role==='driver'? betState.data.driverName : betState.data.clientName,
      priceBet: priceTender,
      userId: role==='driver'? betState.data.userId : betState.data.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      partnerRole: role==='driver'? 'client' : 'driver',
    }
    let avatar = driverAvatar !== null ? driverAvatar : ''

    let notifObj={
      createdAtServer: firestore.FieldValue.serverTimestamp(),
      type: "acceptBet",
      newPrice: priceTender,
      tenderName: betState.data.name,
      tenderId: betState.data.tenderId,
      userName: betState.data.driverName,
      toUser: betState.data.userId,
      fromUserName: betState.data.clientName,
      fromUser: betState.data.clientId,
      userId: betState.data.clientId,
      data: {
        dataExist: 'yes',
        typeNotif: "acceptBet",
        type: 'chat',
        tenderName: betState.data.name,
        tenderId: betState.data.tenderId,
        clientId: betState.data.clientId,
        userId: betState.data.userId,
        userName: betState.data.driverName,
        driverAvatar: avatar,
        receiverRole: 'driver',
      }
    }

    // console.log('notifObj', notifObj)
    // console.log('onAcceprCurrTender msgObjBet', msgObjBet)

    // console.log('priceTender', priceTender)

    
    try {
      await firestore()
      .collection('replies')
      .doc(betState.id)
      .update(obj).then(() => {

        //добавлять в заявку driverId, replyId
        firestore()
        .collection('tenders')
        .doc(betState.data.tenderId)
        .update({
          'driverName': betState.data.driverName,
          'driverId': betState.data.userId,
          'replyId': betState.id,
          'newPrice': priceTender
        })
        .then(res => {
          // console.log('res tender upd', res)
        //системное сообщение
          firestore()
          .collection('messages')
          .add(msgObjBet)
          .then(documentSnapshot => {
            // console.log('messages documentSnapshot id: ', documentSnapshot.id);

            //добавлять заявку в активные себе
            firestore().collection('forms').doc(betState.data.clientId).update({
              'clientActiveTender': firestore.FieldValue.arrayUnion(betState.data.tenderId)
            }).then((res)=> {
              console.log('forms update &&  getTenderHiddenClient', )
              getClientActiveTender(betState.data.clientId,dispatch,setClientActiveTenderState)
            })
            //добавлять заявку в активные водителю
            firestore().collection('forms').doc(betState.data.userId).update({
              'driverActiveTender': firestore.FieldValue.arrayUnion(betState.data.tenderId),
              'driverRoutesOffers': firestore.FieldValue.arrayRemove(betState.data.tenderId) // что бы информеры были только по активным
            })

            //добавлять всех невыбранных водителей в неактивные
            //записывать себе и в их профили
            if(tenderStateData.hasOwnProperty('usersIdWithChat') && tenderStateData.usersIdWithChat.length > 0) {
              //массив с не выбранными водителями
              let ids = tenderStateData?.usersIdWithChat.filter(item => item!==betState.data.userId)
              // console.log('ids', ids, ids!== undefined && ids.length > 0)
              if(ids!== undefined && ids.length > 0) {
                  // console.log('ids other drivers', ids)
                  //проверить и записать себе их в неактивные
                  
                  let filterHidden = ids.map(elemFn => {
                    // console.log('elemFn', elemFn)
                    let res = hiddenState !==null && hiddenState.find(elemHid => elemFn === elemHid.userId && betState.data.tenderId === elemHid.tenderId)
                    // console.log('filterHidden res', res)
                    if(res == undefined) {
                      return {userId: elemFn, tenderId: betState.data.tenderId}
                    }
                  })

                  // console.log('filterHidden', filterHidden)
                  let filterHiddenCheck = filterHidden.filter(elemfl => !!elemfl)
                  // console.log('filterHiddenCheck', filterHiddenCheck)

                  function filterUniqueElements(inputArray) {
                    const seenElements = new Set();
                    const uniqueArray = [];
                    console.log('1--uniqueArray', uniqueArray)

                    for (const element of inputArray) {
                      const key = `${element.userId}-${element.tenderId}`;
                      console.log('key', key)
                      if (!seenElements.has(key)) {
                        console.log('!seenElements.has(key)', !seenElements.has(key))
                        seenElements.add(key);
                        uniqueArray.push(element);
                      }
                    }

                    return uniqueArray;
                  }
                  
                  let uniqueArray = filterUniqueElements(filterHiddenCheck)
                  // console.log('uniqueArray', uniqueArray)

                  if(uniqueArray && uniqueArray?.length > 0) {

                      let objProfile = {
                        'hiddenTendersClient': hiddenState.concat(uniqueArray),
                      }

                    // console.log('objProfile', objProfile)

                    firestore().collection('forms').doc(betState.data.clientId).update(objProfile).then((res)=> {
                      // console.log('forms update &&  getTenderHiddenClient', )
                      getTenderHiddenClient(betState.data.clientId,dispatch,userProfileTenderHiddenClient)
                    })
                  }

                  const sendAllMsg = Promise.all(ids.map(elem => {
                    firestore()
                    .collection('messages')
                    .add({
                      _id: messageIdGenerator(),//рандомный id
                      createdAt: firestore.FieldValue.serverTimestamp(),
                      id: null, //id документа - 
                      partnerId: elem, //id клиента
                      read: false,
                      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
                      tenderId: betState.data.tenderId,
                      typeMsg:'rejectDriver',
                      system: true,
                      userName: betState.data.clientName,
                      priceBet: priceTender,
                      userId: betState.data.clientId, // id отправителя сообщения
                      userRole: 'client',
                      partnerRole: 'driver',
                    })
                    firestore()
                    .collection('forms')
                    .doc(elem)
                    .update({'hiddenTenders': firestore.FieldValue.arrayUnion(betState.data.tenderId)})
                  }))
                  createNotificationAll({
                    createdAtServer: firestore.FieldValue.serverTimestamp(),
                    type: "notifyAllDriver",
                    ids: ids,
                    tenderName: betState.data.name,
                    tenderId: betState.data.tenderId,
                    fromUser: betState.data.clientId,
                    userId: betState.data.clientId,
                    data: {
                      dataExist: 'yes',
                      typeNotif: "notifyAllDriverReject",
                      type: 'chat',
                      tenderName: betState.data.name,
                      tenderId: betState.data.tenderId,
                      clientId: betState.data.clientId,
                      userId: betState.data.userId,
                      driverAvatar: avatar,
                      userName: betState.data.driverName,
                      receiverRole: 'driver'
                    }
                  })
              }
            }
            createNotification(notifObj)
            onCloseDialog(false)
            setIsLoading(false)
          })
        })

      })
    } catch (error) {
      onCloseDialog(false)
      setIsLoading(false)
      console.log('Ошибка onAcceprCurrTender', error)
      // alert('Ошибка')
    }
  }

  //принять предложение выполнить заказ водитель апдейт поля acceptedByDriverAt
  export async function onAcceprCurrBetByDriver(setIsLoading,messageIdGenerator,role,priceTender, betState, onCloseDialog, driverAvatar){
    console.log('onAcceprCurrBetByDriver',priceTender, betState, )

    let obj = {
      'acceptedByDriverAt': firestore.FieldValue.serverTimestamp(),
      'finalBet': priceTender,
      'betUpdate': priceTender,
    }
    if(role==='driver') {
      obj.clientBetStatus='accept'
    
    } else {
      obj.driverBetStatus='accept'
    }

    let msgObjBet = {
      _id: messageIdGenerator(),//рандомный id
      createdAt: firestore.FieldValue.serverTimestamp(),
      id: null, //id документа - 
      partnerId: role==='driver'? betState.data.clientId : betState.data.userId, //id клиента
      read: false,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      tenderId: betState.data.tenderId,
      typeMsg: role==='driver'?'acceptTenderByDriver': 'acceptTenderByClient',
      system: true,
      userName: role==='driver'? betState.data.driverName : betState.data.clientName,
      priceBet: priceTender,
      userId: role==='driver'? betState.data.userId : betState.data.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      partnerRole: role==='driver'? 'client' : 'driver',
    }   
    let avatar = driverAvatar !== null ? driverAvatar : ''
    let notifObj = {
      createdAtServer: firestore.FieldValue.serverTimestamp(),
      type: "acceptedByDriver",
      tenderName: betState.data.name,
      tenderId: betState.data.tenderId,
      userName: betState.data.clientName,
      toUser: betState.data.clientId,
      fromUserName: betState.data.driverName,
      fromUser: betState.data.userId,
      userId: betState.data.userId,
      data: {
        dataExist: 'yes',
        typeNotif: "acceptedByDriver",
        type: 'chat',
        tenderName: betState.data.name,
        tenderId: betState.data.tenderId,
        clientId: betState.data.clientId,
        userId: betState.data.userId,
        driverAvatar: avatar,
        userName: betState.data.driverName,
        receiverRole: 'client'
      }
    }
    console.log('onAcceprCurrBetByDriver msgObjBet', msgObjBet)


    console.log('priceTender', priceTender)
    try {
      await firestore()
      .collection('replies')
      .doc(betState.id)
      .update(obj).then(() => {
        firestore()
          .collection('messages')
          .add(msgObjBet)
          .then(documentSnapshot => {
            console.log('messages documentSnapshot id: ', documentSnapshot.id);            
            
            createNotification(notifObj)
            onCloseDialog(false)
            setIsLoading(false)
          })
      })
    } catch (error) {
      onCloseDialog(false)
      setIsLoading(false)
      console.log('Ошибка onAcceprCurrTender', error)
      // alert('Ошибка')
    }
  }

  //отзывы
  export async function sendTestimonials(
    tenderId, 
    userId, 
    role, 
    partnerId, 
    userMsg, 
    userRating, 
    firebeseUpdateTender, 
    onClose,
    onError,
    messageIdGenerator,
    onPress,
    setIsLoading,
    data,
    driverAvatar,
    hiddenState,
    getTenderHiddenClient,
    dispatch,
    userProfileTenderHiddenClient,
  ) {
    //userId - 
    console.log('sendTestimonials', tenderId, userId, role, partnerId, userMsg, userRating, firebeseUpdateTender,data, driverAvatar)
    //добавлять кому адресован отзыв 
    const partnerRole = role == 'driver' ? 'client' : 'driver'
    //если роль водитель то userId  и partnerId будут моим id посмотреть почему так, это ошибка или нет -//18.08.23 - ошибка, исправлено
    const obj1 = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      message: userMsg,
      score: userRating,
      tenderId: tenderId,
      userId: userId,
      userRole: role,
      partnerId: partnerId,
      partnerRole: partnerRole
    }
    const obj2 = {
      finishedAt: firestore.FieldValue.serverTimestamp()
      } //- при отправке отзыва записывать в базу.

    const obj3 = {
      archived: true,
    } //- при отправке отзыва записывать в базу.

    let avatar = driverAvatar !== null ? driverAvatar : ''
    const notifObj = {
      createdAtServer: firestore.FieldValue.serverTimestamp(),
      type: "newTestimonial",
      tenderName: data.data.name,
      tenderId: tenderId,
      userName: role === 'driver' ? data.data.userName : data.data.driverName,
      toUser: partnerId,
      fromUserName: role === 'driver' ? data.data.driverName : data.data.userName,
      fromUser: userId,
      userId: userId,
      message: userMsg,
      data: {
        dataExist: 'yes',
        type: 'chat',
        tenderId: tenderId,
        tenderName: data.data.name,
        clientId: data.data.userId,
        userId:  data.data.driverId,
        userName: data.data.driverName,
        driverAvatar: role === 'driver' ? avatar : '',
        receiverRole: role === 'driver' ? 'client' : 'driver'
      }
    }

    try {
      await firestore()
      .collection('feedback')
      .add(obj1)
      .then(result => {
        // console.log('result', result)
        if(role == 'driver') {
          firebeseUpdateTender(tenderId, obj2) //- при отправке отзыва водителем записывать в базу
          //!!! проверить  эту строку
          // firestore().collection('forms').doc(userId).update({'profile.quantityTenders': firestore.FieldValue.increment(1)})
        } else {
          firebeseUpdateTender(tenderId, obj3)
        }
        //создание сообщения в чате
        const msg = {
          _id: messageIdGenerator(),
          createdAt: firestore.FieldValue.serverTimestamp(),
          read: false,
          text: userMsg,
          score: userRating,
          typeMsg: 'feedback',
          system: true,
          tenderId: tenderId,
          userId: userId,
          userRole: role,
          partnerId: partnerId,
          partnerRole: partnerRole
        }
        firestore().collection('messages').add(msg).then((res)=> {
          
          //добавление исполнителя в неактивные себе и в его профиль
          
          if(role==='client') {
            console.log('client hiddenState', hiddenState)
            let driverObj = {'hiddenTenders': firestore.FieldValue.arrayUnion(tenderId)}

            console.log('driverObj', driverObj)
            //водителю добавлять чат в неактивные
            firestore().collection('forms').doc(partnerId).update(driverObj).then((res)=> {
              console.log('driverObj add res', res)
            })

            let filterHidden = hiddenState !== null ? hiddenState.find(item=>item.tenderId===tenderId && item.userId === partnerId) : undefined
            console.log('filterHidden', filterHidden)

            let objProfile = {'profile.quantityTenders': firestore.FieldValue.increment(1)}

            if(filterHidden === undefined) {
              objProfile.hiddenTendersClient = hiddenState !== null ? hiddenState.concat([{userId: partnerId, tenderId: tenderId}]) : [{userId: partnerId, tenderId: tenderId}]
              
            } else {
              console.log('driver already in hidden', )
            }
            console.log('objProfile', objProfile)

            firestore().collection('forms').doc(userId).update(objProfile).then((res)=> {
              console.log('forms update &&  getTenderHiddenClient', )
              //в прослушке профиля будет браться данные
              // getTenderHiddenClient(userId,dispatch,userProfileTenderHiddenClient)

              firestore().collection('messages').add({
                _id: messageIdGenerator(),
                createdAt: firestore.FieldValue.serverTimestamp(),
                read: false,
                text: 'Чат добавлен в неактивные',
                tenderId: tenderId,
                system: true,
                typeMsg: 'addToArchFromDriver',
                userId: userId,
                userRole: 'client',
                partnerId: partnerId,
                partnerRole: 'driver'
              }).then((res)=> {})
            })
            
          } else {
            console.log('driver do nothing', )
          }

          createNotification(notifObj)
          
        }).finally(result => {
          console.log('finally result', result)
          setIsLoading(false)
          onClose()
          onPress()
        })

      }).catch(errorfb => {
        setIsLoading(false)
        onError(true)
        console.log('firestore sendTestimonials errorfb', errorfb)

      })
    } catch (error) {
      setIsLoading(false)
      onError(true)
      console.log('sendTestimonials error', error)
    }
  }

  // отменить выполнение заказа 
  export async function cancelDelivery(
    role,
    betState,
    tenderState,
    firebeseUpdateTender,    
    userMsg, 
    messageIdGenerator,
    onClose,
  ) {
    console.log('cancelDelivery: ', 'Отменить заказ', betState,tenderState,)

    let idUser = role === 'driver' ? betState.data.userId : betState.data.clientId
    let avatar = tenderState.data.avatar !== null ? tenderState.data.avatar : ''
    
    const notifObj = {
      // createdAt: dateCreare,
      createdAtServer: firestore.FieldValue.serverTimestamp(),
      type: "orderCanceled",
      tenderName: betState.data.name,
      tenderId: betState.data.tenderId,
      userName: role === 'driver'? betState.data.clientName : betState.data.driverName,
      toUser: role === 'driver'? betState.data.clientId : betState.data.userId,
      fromUserName: role === 'driver'? betState.data.driverName : betState.data.clientName,
      fromUser: role === 'driver'? betState.data.userId : betState.data.clientId,
      userId: role === 'driver'? betState.data.userId : betState.data.clientId,
      data: {
        dataExist: 'yes',
        message: userMsg,
        typeNotif: "orderCanceled",
        type: 'chat',
        tenderName: betState.data.name,
        tenderId: betState.data.tenderId,
        clientId: betState.data.clientId,
        userId: betState.data.userId,
        userName: betState.data.driverName,
        driverAvatar: role === 'driver' ? avatar : '',
        receiverRole: role === 'driver' ? 'client' : 'driver'
      }
    }
    console.log('notifObj', notifObj)

    //чистить объект заявки 
    const objCancel = {
      driverId: null,
      driverName: null,
      replyId: null,
      canceledAt: firestore.FieldValue.serverTimestamp(),
      canceledBy: idUser,
      canceledMessage: userMsg,
      finishedAt: null
    }

    console.log('objCancel', objCancel)

    //заявка 
    firebeseUpdateTender(betState.data.tenderId, objCancel)

    //чистить объект ставки 
    //
    const ojReplUpdate = {
      acceptedByDriverAt: null,
      pickCandidateAt: null,
      rejectedAt: null,
      rejectedByDriverAt: null,
      // message: '',
      driverBet: betState.data.tenderPrice,
      driverBetStatus: 'cancel',
      clientBet: betState.data.tenderPrice,
      clientBetStatus: 'wait',
      price: betState.data.tenderPrice,
      betUpdate: betState.data.tenderPrice,
      updateBetAt: null,
      finalBet: null,
    }
    console.log('ojReplUpdate', ojReplUpdate)
    // console.log('betState.id', betState.id)

    if(role === 'driver') ojReplUpdate.cancelByDriver = true

    let msgObjCancel = {
      _id: messageIdGenerator(),//рандомный id
      createdAt: firestore.FieldValue.serverTimestamp(),
      id: null, //id документа - 
      partnerId: role==='driver'? betState.data.clientId : betState.data.userId, //id клиента
      read: false,
      text: userMsg,
      replyId: betState.id, //заполнять если сделана ставка и есть сообщение в ставке
      tenderId: betState.data.tenderId,
      typeMsg: role==='driver'?'orderCanceled': 'orderCanceled',
      system: true,
      userName: role==='driver'? betState.data.driverName : betState.data.clientName,
      userId: role==='driver'? betState.data.userId : betState.data.clientId, // id отправителя сообщения
      userRole: role==='driver'? 'driver' : 'client',
      partnerRole: role==='driver'? 'client' : 'driver',
    }
    
    try {
      await firestore()
      .collection('messages')
      .add(msgObjCancel)
      .then(documentSnapshot => {
        console.log('messages documentSnapshot id: ', documentSnapshot.id);
      })

      await firestore().collection('replies')
      .doc(betState.id)
      .update(ojReplUpdate).then((result) => {
        //в зависимости от скрина(заявка или чат) переход на скрин
        console.log('result', result)
        
        //пуш
        createNotification(notifObj)

        onClose(false)
      }).catch(err => {
        onClose(false)
        console.log('cancelDelivery firebase', err)
      })
    } catch (error) {
      onClose(false)
      console.log('cancelDelivery error', error)
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
  export async function handlerCallNumer(uidtoCall, Linking) {
    console.log('CALL', uidtoCall)
    await firestore().collection('forms').doc(uidtoCall).get().then(documentSnapshot => {
      console.log('handlerCallNumer documentSnapshot', documentSnapshot.exists, documentSnapshot.get('profile.phone'))

      if(documentSnapshot.exists && documentSnapshot.get('profile.phone')) {
        let phone = documentSnapshot.get('profile.phone')
        Linking.openURL(`tel:${phone}`)
      }
    })
  }

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
