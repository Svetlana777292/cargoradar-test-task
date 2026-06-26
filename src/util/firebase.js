
// import firestore from '@react-native-firebase/firestore';

const firestore = () =>{}
//не используется
export async function getVresion(dispatch,fn,errfn,setAppCheck) {
// console.log('text', dispatch, fn)
try {
    let result = null
    await firestore()
    .collection('appinfo')
    .doc('appindosystemdoc')
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);

        if(documentSnapshot.exists) {
          // console.log('getVresion data:',documentSnapshot?.data())
          dispatch(fn(documentSnapshot.data()))
          dispatch(errfn(null))
          result =  documentSnapshot.data()
          setAppCheck(true)
        } else {
          dispatch(errfn('error'))
          result =  'error'
          setAppCheck(true)
        }
      // console.log('getReplies arr: ', arr)
    })
    console.log('getVresion result', result)
    return result
  } catch (error) {
    console.log('TN getVresion не получены, error result:',result )
      dispatch(errfn(error?.code))
      setAppCheck(true)
      return result = error?.code
      // console.log(`code`, error.code);
      // console.log(`message`, error.message);
      // console.log(`name`, error.name);
      // console.log(`stack`, error.stack);
  }
  
}

export async function getTenderInfo(tenderId) {
  // setIsLoading(true)
  // if(role === 'client') {
    try {
      return await firestore().collection('tenders')
      .doc(tenderId)  
      .get()
      .then((documentSnapshot) => {
        console.log('querySnapshot \n', documentSnapshot.exists)
        if(documentSnapshot.exists){

          return {data: documentSnapshot.data(), id: documentSnapshot.id}
        } {
          return null
        }
      })
      
    } catch (error) {
      // setIsLoading(false)
      console.log('err', error);
      return null
    }
}

export async function getReplies(uid,dispatch,fn,time) {
// console.log('text', dispatch, fn)
  // console.log('uid', uid)
  try {
    let arr = []
    await firestore()
    .collection('replies')
    .where('userId', '==', uid)
    .get()
    .then(querySnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
      querySnapshot.forEach(documentSnapshot => {

        if(documentSnapshot.data().rejectedAt == null && documentSnapshot.data().rejectedByDriverAt == null && 
        documentSnapshot.data().createdAt.toMillis() > time
        ) {
          // console.log('getReplies data:',)
          // console.log('tof', typeof(documentSnapshot.get('tenderReply')))
          arr.push({
            data:documentSnapshot.data(),
            id: documentSnapshot.id
          })
        }
      })
      // console.log('getReplies arr: ', arr)
      dispatch(fn(arr))
  
    })
  } catch (error) {
    console.log('TN getReplies не получены, error', error)
  }
}

export async function getTenderDelete(uid,dispatch,fn) {
// console.log('text', dispatch, fn)
  // console.log('uid', uid)
  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        // console.log('deleteTenders data:', documentSnapshot.get('deleteTenders'))
        // console.log('tof', typeof(documentSnapshot.get('deleteTenders')))
        if(documentSnapshot.get('deleteTenders')!==undefined&&documentSnapshot.get('deleteTenders')!==null) {
          dispatch(fn(documentSnapshot.get('deleteTenders')))
        }
      }
    })
  } catch (error) {
    console.log('TN deleteTenders не получены, error', error)
  }
}
export async function getTenderHidden(uid,dispatch,fn) {
console.log('getTenderHidden START',)
  // console.log('uid', uid)
  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        // console.log('deleteTenders data:', documentSnapshot.get('deleteTenders'))
        // console.log('tof', typeof(documentSnapshot.get('deleteTenders')))
        if(documentSnapshot.get('hiddenTenders')!==undefined&&documentSnapshot.get('hiddenTenders')!==null) {
          console.log('getTenderHidden', documentSnapshot.get('hiddenTenders'))
          dispatch(fn(documentSnapshot.get('hiddenTenders')))
        }
      }
    })
  } catch (error) {
    console.log('TN hiddenTenders не получены, error', error)
  }
}
export async function getTenderHiddenClient(uid,dispatch,fn) {
console.log('getTenderHiddenClient START', )
  // console.log('uid', uid)
  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        // console.log('deleteTenders data:', documentSnapshot.get('deleteTenders'))
        // console.log('tof', typeof(documentSnapshot.get('deleteTenders')))
        if(documentSnapshot.get('hiddenTendersClient')!==undefined&&documentSnapshot.get('hiddenTendersClient')!==null) {
          // console.log('getTenderHiddenClient', documentSnapshot.get('hiddenTendersClient'))
          dispatch(fn(documentSnapshot.get('hiddenTendersClient')))
        }
      }
    })
  } catch (error) {
    console.log('TN hiddenTendersClient не получены, error', error)
  }
}
export async function getTenderFaivor(uid,dispatch,fn) {
// console.log('text', dispatch, fn)
  // console.log('uid', uid)
  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        // console.log('getTenderFaivor data:', documentSnapshot.get('faivorTenders'))
        // console.log('tof', typeof(documentSnapshot.get('faivorTenders')))
        if(documentSnapshot.get('faivorTenders')!==undefined&&documentSnapshot.get('faivorTenders')!==null){

          dispatch(fn(documentSnapshot.get('faivorTenders')))
        }
      }
    })
  } catch (error) {
    console.log('TN faivorTenders не получены, error', error)
  }
}

export async function getBlackList(uid,dispatch,fn) {
// console.log('getBlackList:', uid,dispatch,fn)
  // console.log('uid', uid)
  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .get()
    .then(documentSnapshot => {
      // console.log(' exists: ', documentSnapshot.exists);
  
      if (documentSnapshot.exists) {
        // console.log('GET blackListOfDriver', documentSnapshot.get('blackListOfDriver'))
        // console.log('getTenderFaivor data:', documentSnapshot.get('blackListOfDriver'))
        // console.log('tof', typeof(documentSnapshot.get('blackListOfDriver')))
        if(documentSnapshot.get('blackListOfDriver')!==undefined&&documentSnapshot.get('blackListOfDriver')!==null){

          dispatch(fn(documentSnapshot.get('blackListOfDriver')))
        }
      }
    })
  } catch (error) {
    console.log('TN getBlackList не получены, error', error)
  }
}

export async function getDriverTndActv(uid,dispatch,fn) {
  // console.log('getDriverTndActv:', uid,dispatch,fn)
    // console.log('uid', uid)
    try {
      await firestore()
      .collection('forms')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        // console.log(' exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {
          // console.log('GET blackListOfDriver', documentSnapshot.get('blackListOfDriver'))
          // console.log('getTenderFaivor data:', documentSnapshot.get('blackListOfDriver'))
          // console.log('tof', typeof(documentSnapshot.get('blackListOfDriver')))
          if(documentSnapshot.get('driverTenderActivity') !==undefined && documentSnapshot.get('driverTenderActivity') !==null){
            dispatch(fn(documentSnapshot.get('driverTenderActivity')))
          }
  
        }
      })
    } catch (error) {
      console.log('TN driverTenderActivity не получены, error', error)
    }
}
export async function getClientActiveTender(uid,dispatch,fn) {
  // console.log('getClientActiveTender:', uid,dispatch,fn)
    // console.log('uid', uid)
    try {
      await firestore()
      .collection('forms')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        // console.log(' exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {
          // console.log('GET blackListOfDriver', documentSnapshot.get('blackListOfDriver'))
          // console.log('getTenderFaivor data:', documentSnapshot.get('blackListOfDriver'))
          // console.log('tof', typeof(documentSnapshot.get('blackListOfDriver')))
          if(documentSnapshot.get('clientActiveTender') !==undefined && documentSnapshot.get('clientActiveTender') !==null){
            dispatch(fn(documentSnapshot.get('clientActiveTender')))
          }
  
        }
      })
    } catch (error) {
      console.log('TN getClientActiveTender не получены, error', error)
    }
}

export async function getDriverActiveTenderState(uid,dispatch,fn) {
  // console.log('getDriverActiveTenderState:', uid,dispatch,fn)
    // console.log('uid', uid)
    try {
      await firestore()
      .collection('forms')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        // console.log(' exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {
          if(documentSnapshot.get('driverActiveTender') !==undefined && documentSnapshot.get('driverActiveTender') !==null){
            dispatch(fn(documentSnapshot.get('driverActiveTender')))
          }
        }
      })
    } catch (error) {
      console.log('TN getDriverActiveTenderState не получены, error', error)
    }
}
export async function getDriverRoutesOffers(uid,dispatch,fn) {
  // console.log('getDriverRoutesOffers:', uid,dispatch,fn)
    // console.log('uid', uid)
    try {
      await firestore()
      .collection('forms')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        // console.log(' exists: ', documentSnapshot.exists);
    
        if (documentSnapshot.exists) {
          if(documentSnapshot.get('driverRoutesOffers') !==undefined && documentSnapshot.get('driverRoutesOffers') !==null){
            dispatch(fn(documentSnapshot.get('driverRoutesOffers')))
          }
        }
      })
    } catch (error) {
      console.log('TN getDriverRoutesOffers не получены, error', error)
    }
}

export async function getCarsInfo(uid,dispatch,fn) {
  // console.log('getCarsInfo start', uid)
    // console.log('uid', uid)
    try {
      await firestore().collection('cars')
      .where('userId', '==', uid)
      .get()
      .then((querySnapshot) => {
        // console.log('querySnapshot \n', querySnapshot.size)
        let odjTransport = []
        if(querySnapshot.size > 0) {

          querySnapshot.forEach(documentSnapshot => {
            // console.log('querySnapshot Tender: ', documentSnapshot.data())
            let transportDocument = {
              data: documentSnapshot.data(),
              id: documentSnapshot.id
            }
            odjTransport.push(transportDocument)
          })
          dispatch(fn(odjTransport))
        }
      })  
    } catch (error) {
      console.log('TN getCarsInfo error', error)
    }
}

export async function getUserRatingInfo(uid) {
  // console.log('getUserRatingInfo start', uid)
    // console.log('uid', uid)
    try {
      let rating = 4.5
      await firestore().collection('forms')
        .doc(uid) //uid юзера
        .get()
        .then(documentSnapshot=>{
          // console.log('documentSnapshot.exists', documentSnapshot.exists,)
          if(documentSnapshot.exists && documentSnapshot.get('profile')) {
            // finishTenders =  documentSnapshot.get('profile')?.quantityOfFinished
            return rating = documentSnapshot.get('profile')?.rating
          }
        })
        // console.log('123 rating', rating)
        // return rating
        // item.finishTenders = finishTenders
        // rating = rating
    } catch (error) {
      console.log('TN getUserRatingInfo error', error)
    }
}

export async function getCarsInfoFromUser(uid) {
  // console.log('getCarsInfoFromUser start', uid)
    // console.log('uid', uid)
    let odjTransport = []
    try {
      await firestore().collection('cars')
      .where('userId', '==', uid)
      .get()
      .then((querySnapshot) => {
        // console.log('querySnapshot \n', querySnapshot.size)
        
        if(querySnapshot.size > 0) {

          querySnapshot.forEach(documentSnapshot => {
            let transportDocument = {
              data: documentSnapshot.data(),
              id: documentSnapshot.id
            }
            odjTransport.push(transportDocument)
          })
        }
        // console.log(' getCarsInfoFromUser odjTransport: ', odjTransport)
      })
      return odjTransport
    } catch (error) {
      console.log('TN getCarsInfo error', error)
    }
}

//общая инфа по профилю
export async function getProfileInfo(uid,dispatch,fn,userProfileTenderDelete,userProfileTenderHidden,
  userProfileTenderHiddenClient,userProfileTenderFaivor,userProfileBlackList,setDriverTenderAvtivity,
  setClientActiveTenderState,setDriverRoutesOffersState,setDriverActiveTenderState,setIsReady) {
console.log('\x1b[43m%s %s\x1b[0m','getProfileInfo:', uid)
  
  try {
    //профиль
    let profileObj = await firestore().collection('forms')
    .doc(uid) //uid юзера
    .get()
    .then(documentSnapshot=>{
      // console.log('documentSnapshot.exists', documentSnapshot.exists,)
      //скрытые, избранное и тд
      // userProfileTenderDelete,userProfileTenderHidden,userProfileTenderHiddenClient,userProfileTenderFaivor,userProfileBlackList
      if(documentSnapshot.exists) {

        if(documentSnapshot.get('deleteTenders')!==undefined&&documentSnapshot.get('deleteTenders')!==null) {
          dispatch(userProfileTenderDelete(documentSnapshot.get('deleteTenders')))
        }
        if(documentSnapshot.get('hiddenTenders')!==undefined&&documentSnapshot.get('hiddenTenders')!==null) {
          // console.log('getTenderHidden', documentSnapshot.get('hiddenTenders'))
          dispatch(userProfileTenderHidden(documentSnapshot.get('hiddenTenders')))
        }
        if(documentSnapshot.get('hiddenTendersClient')!==undefined&&documentSnapshot.get('hiddenTendersClient')!==null) {
          // console.log('getTenderHiddenClient', documentSnapshot.get('hiddenTendersClient'))
          dispatch(userProfileTenderHiddenClient(documentSnapshot.get('hiddenTendersClient')))
        }
        if(documentSnapshot.get('faivorTenders')!==undefined&&documentSnapshot.get('faivorTenders')!==null){
          dispatch(userProfileTenderFaivor(documentSnapshot.get('faivorTenders')))
        }
        if(documentSnapshot.get('blackListOfDriver')!==undefined&&documentSnapshot.get('blackListOfDriver')!==null){
          dispatch(userProfileBlackList(documentSnapshot.get('blackListOfDriver')))
        }
        if(documentSnapshot.get('driverTenderActivity') !==undefined && documentSnapshot.get('driverTenderActivity') !==null){
          dispatch(setDriverTenderAvtivity(documentSnapshot.get('driverTenderActivity')))
        }
        if(documentSnapshot.get('clientActiveTender') !==undefined && documentSnapshot.get('clientActiveTender') !==null){
          dispatch(setClientActiveTenderState(documentSnapshot.get('clientActiveTender')))
        }
        if(documentSnapshot.get('driverRoutesOffers') !==undefined && documentSnapshot.get('driverRoutesOffers') !==null){
          dispatch(setDriverRoutesOffersState(documentSnapshot.get('driverRoutesOffers')))
        }
        if(documentSnapshot.get('driverActiveTender') !==undefined && documentSnapshot.get('driverActiveTender') !==null){
          dispatch(setDriverActiveTenderState(documentSnapshot.get('driverActiveTender')))
        }

        //данные по профилю
        if(documentSnapshot.get('profile') !== undefined) {
          const profile = documentSnapshot.get('profile')  
          console.log('getProfileInfo profObj.role:', profile.role);  
          setIsReady(true)      
          return {
            fullName: profile.fullName,
            email: profile?.email,
            role: profile.role,
            unp: profile.unp ?  profile.unp : '',
            driverAvatar: profile.hasOwnProperty('driverAvatar') ? profile.driverAvatar : null,
            clientAvatar: profile.hasOwnProperty('clientAvatar') ? profile.clientAvatar : null,
            phone: profile?.phone,
            rating: profile?.rating,
            userComplaintsCounter: profile?.userComplaintsCounter,
            quantityOfFinished: profile?.quantityOfFinished,
            quantityTenders: profile?.quantityTenders,
          }   
          // quantityTenders   & quantityOfFinished - добавляются ниже 
        }
      }
    }).catch(errfr => {
      console.log('getProfileInfo errortenders error:', errfr)
      setIsReady(true)
    })
    
    //все свои заявки
    // let tenders = await firestore().collection('tenders')
    // .where('userId','==',uid) //uid юзера
    // .get()
    // .then(querySnapshot=>{
    //   // console.log('tenders querySnapshot.size', querySnapshot.size)
    //   // profile.quantityTenders = querySnapshot.size
    //   // tenders = querySnapshot.size
    //   return querySnapshot.size

      
    // }).catch((errortenders)=>{
    //   console.log('getProfileInfo errortenders error:', errortenders)
    // })

    // //все свои выполненные заявки
    // let finished = await firestore().collection('tenders')
    // .where('driverId','==',uid) //uid юзера
    // .where('finishedAt','!=',null) //завершены
    // .get()
    // .then(querySnapshot=>{
    //   // console.log('finishedAt querySnapshot.size', querySnapshot.size)
    //   // profObj.quantityOfFinished = querySnapshot.size
    //   return querySnapshot.size
      
    // }).catch((errorfinished)=>{
    //   console.log('getProfileInfo errorfinished error:', errorfinished)
    // })
    // // console.log('>*>*>*>*>*', tenders,finished,profileObj)

    // firestore().collection('forms')
    // .doc(uid).update({'profile.quantityTenders': tenders ? tenders : 0,'profile.quantityOfFinished': finished ? finished : 0,})
    // dispatch(fn({...profileObj,quantityTenders: tenders ? tenders : 0, quantityOfFinished: finished ? finished : 0 }))

  } catch (error) {
    setIsReady(true) 
    console.log('getProfileInfo error:', error)
  }
}

//детали профиля
export async function getDetailProfile(uid,dispatch,fn,) {
  console.log('\x1b[43m%s %s\x1b[0m','getDetailProfile:', uid)
    // console.log('uid', uid)
    
  try {
    //профиль
    let profileObj = await firestore().collection('forms')
    .doc(uid) //uid юзера
    .get()
    .then(documentSnapshot=>{
      // console.log('documentSnapshot.exists', documentSnapshot.exists,)
      if(documentSnapshot.exists) {

        //данные по профилю
        if(documentSnapshot.get('profile') !== undefined) {
          const profile = documentSnapshot.get('profile')  
          // console.log('getDetailProfile profObj.role:', profile);        
          return {
            fullName: profile.fullName,
            email: profile?.email,
            role: profile.role,
            unp: profile.unp ?  profile.unp : '',
            driverAvatar: profile.hasOwnProperty('driverAvatar') ? profile.driverAvatar : null,
            clientAvatar: profile.hasOwnProperty('clientAvatar') ? profile.clientAvatar : null,
            phone: profile?.phone,
            rating: profile?.rating,
            quantityTenders: profile?.quantityTenders ? profile?.quantityTenders : 0,
            quantityOfFinished: profile?.quantityOfFinished ? profile?.quantityOfFinished : 0,
            userComplaintsCounter: profile?.userComplaintsCounter,
          }   
          // quantityTenders   & quantityOfFinished - добавляются ниже 
        }
      }
    }).catch(errfr => {
      console.log('getDetailProfile errortenders error:', errfr)
    })
    dispatch(fn(profileObj))

  } catch (error) {
    console.log('getDetailProfile error:', error)
  }
}

export async function createNotification(data) {
  // console.log('\x1b[43m%s %s\x1b[0m', 'createNotification data:', data);

  //объект формируется в функции которая вызывает эту фун-ю 
  try {    
    await firestore().collection('push-messages').add(data)
    .catch((error)=>{
      console.log('\x1b[33m%s %s\x1b[0m', 'firestore createNotification error:', error);
    })
  } catch (error) {
    console.log('\x1b[33m%s %s\x1b[0m', 'trycatch createNotification error:', error);
  }
}

export async function createNotificationAll(data) {
  console.log('\x1b[45m%s %s\x1b[0m', 'createNotificationAll data:', data);

  //объект формируется в функции которая вызывает эту фун-ю 
  try {    
    await firestore().collection('pushAll').add(data)
    .catch((error)=>{
      console.log('\x1b[35m%s %s\x1b[0m', 'firestore createNotificationAll error:', error);
    })
  } catch (error) {
    console.log('\x1b[35m%s %s\x1b[0m', 'trycatch createNotificationAll error:', error);
  }
}

export async function writeLog(uid,obj) {
  console.log('\x1b[33m%s %s\x1b[0m ','writeLog uid + obj', uid, '+',obj)
  obj.createdAt = new Date()
  try {
    await firestore().collection('forms').doc(uid).update({
      'profile.log': firestore.FieldValue.arrayUnion(obj)
    })
    .catch((err)=>{
      console.log('\x1b[33m%s %s\x1b[0m', 'firestore writeLog error:', err);
    })
  } catch (error) {
    console.log('\x1b[33m%s %s\x1b[0m', 'trycatch writeLog error:', error);
  }
}

export async function navToTenderItem(tenderId,route,navigation) {
  console.log('\x1b[46m%s %s\x1b[0m ','navToTenderItem tenderId + route', tenderId, '+',route)
  try {    
    await firestore()
    .collection('tenders')
    .doc(tenderId)
    .get()
    .then(documentSnapshot => {
      // console.log('documentSnapshot', documentSnapshot.data(),documentSnapshot.id)
      let obj = {
        data: documentSnapshot.data(), id: documentSnapshot.id
      }
      // console.log('obj', obj)
      navigation.navigate(route,{dataTender: obj})
    })
    .catch((err)=>{
      console.log('\x1b[46m%s %s\x1b[0m', 'firestore navToTenderItem error:', err);
    })
  } catch (error) {
    console.log('\x1b[46m%s %s\x1b[0m', 'trycatch navToTenderItem error:', error);
  }
}

export async function navToChat(obj,role,route,navigation,setIsLoading,uid) {
  // let obj = {"clientId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", "data": {"clientId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", "dataExist": "yes", "driverAvatar": "", "receiverRole": "driver", "tenderId": "RwWazDDLScm9ipusxban", "tenderName": "Test002_1607", "type": "chat", "userId": "FuliDRDN57XK7uRrMTzt287ynGv1", "userName": "Test user11"}, "docId": "RwWazDDLScm9ipusxban", "title": "Test002_1607", "user": "FuliDRDN57XK7uRrMTzt287ynGv1"}
  console.log('\x1b[46m%s %s\x1b[0m ','navToChat obj', obj, route)
    // navObj {
    //   "clientId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", 
    //   "data": {
    //     "clientId": "QZxmEyYgylTbVZHp8CSgjYsA5hr2", 
    //     "dataExist": "yes", 
    //     "tenderId": "XHKMVUBV1sb8Vj8dlFlm",
    //     "tenderName": "Test373", 
    //     "type": "chat", 
    //     "userId": "FuliDRDN57XK7uRrMTzt287ynGv1"
    // driverName: data.data.driverName,
    //   driverAvatar: driverAvatar
    //   }, 
    //   "docId": "XHKMVUBV1sb8Vj8dlFlm", 
    //   "title": "Test373", 
    //   "user": "FuliDRDN57XK7uRrMTzt287ynGv1"
    // }
  try {    
    await firestore()
    .collection('tenders')
    .doc(obj.data.tenderId)
    .get()
    .then(documentSnapshot => {
      // console.log('documentSnapshot', documentSnapshot.data(),documentSnapshot.id)
      let item = {
        data: {
          data: documentSnapshot.data(), id: documentSnapshot.id
        }
      }
      role==='client' ? item.userInfo = obj.data : null
      // setTimeout(()=>{
      // },1000)
      

      if(role==='driver') {
        // navigation.navigate('Chat',{item: item.data})
        if(item.data.data.driverId !== null && item.data.data.driverId == uid && item.data.data.archived === false) {

          navigation.reset({
            index: 0,
            routes: [{
              name: 'SearchTab', 
              state: {
                routes: [{
                  name: 'Chat',
                  params: {item: item.data,}
                }]
              }
            }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{
              // name: 'Tenders', 
              name: 'ActiveDriverTendersTab', 
              state: {
                routes: [{
                  name: 'Chat',
                  params: {item: item.data,}
                }]
              }
            }],
          })

        }
        
      } else {
        if(item.data.data.driverId !== null && item.data.data.archived === false) { 

          navigation.reset({
            index: 0,
            routes: [{
              name: 'TendersTab', 
              state: {
                routes: [{
                  name: 'Chat',
                  params: {item: item.data, userInfo: item.userInfo}
                }]
              }
            }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{
              name: 'ActiveTendersTab', 
              state: {
                routes: [{
                  name: 'Chat',
                  params: {item: item.data, userInfo: item.userInfo}
                }]
              }
            }],
          })

        }
        // navigation.navigate('Chat',{item: item.data, userInfo: item.userInfo})
      }
      setIsLoading(false)
    })
    .catch((err)=>{
      setIsLoading(false)
      console.log('\x1b[46m%s %s\x1b[0m', 'firestore navToChat error:', err);
    })
  } catch (error) {
    setIsLoading(false)
    console.log('\x1b[46m%s %s\x1b[0m', 'trycatch navToChat error:', error);
  }
}

export async function getUserRating(id) {
  // console.log('getUserRating', )
  try {
    await firestore()
    .collection('feedback')
    .where('partnerId', '==', id)
    .get()
    .then(querySnapshot=>{
      // console.log('getUserRating', querySnapshot.size)
      let scoreSum = []
      querySnapshot.forEach(documentSnapshot => {
        // console.log('UserRating documentSnapshot item:', documentSnapshot.data())
        if(documentSnapshot.data().partnerRole == 'driver') {
          scoreSum.push(documentSnapshot.data().score)
        }
      })
      
      if(scoreSum.length > 0) {
        const sum = scoreSum.reduce((prev, cur) => prev+cur)
        // console.log('sum', typeof(sum), sum, scoreSum.length)
        let rating = (sum/scoreSum.length).toFixed(1)
        firestore()
        .collection('forms')
        .doc(id)
        .update({'profile.rating':rating })
        .catch(e => {console.log('getUserRating err update rating e:',e)})
      } 
      
    })
  } catch (error) {
    console.log('getUserRating error', error)
  }
}

//add to faivorites
export async function addToFaivor(tenderFaivor,tenderId,uid) {
  console.log('addToFaivor tenderId', tenderId)
  // const uid = auth().currentUser.uid
  let faivorToggle
  tenderFaivor.forEach(elem => {
    if(elem !== tenderId) {
      faivorToggle = {
        'faivorTenders': firestore.FieldValue.arrayUnion(tenderId)
      }
    } else {
      faivorToggle = {
        'faivorTenders': firestore.FieldValue.arrayRemove(tenderId)
      }
    }
  })
  // console.log('faivorToggle', faivorToggle)

  try {
    await firestore()
    .collection('forms')
    .doc(uid)
    .update(faivorToggle)
    .then(res => {
      console.log('forms update faivorTenders res: ', res);
      // getTenderFaivor(uid, dispatch, userProfileTenderFaivor)
    })
  } catch (error) {
    console.log('error', error)
  }
}

//фун-я из модалки профиля и модалки отзывов
export async function getProfileUserInfo(uid) {
  console.log('\x1b[43m%s %s\x1b[0m','getProfileUserInfo:', uid)
    // console.log('uid', uid)
    try {
      let profObj = null
      await firestore().collection('forms')
      .doc(uid) //uid юзера
      .get()
      .then(documentSnapshot=>{
        // console.log('documentSnapshot.exists', documentSnapshot.exists,)
        if(documentSnapshot.exists&&documentSnapshot.get('profile') !== undefined) {
          const profile = documentSnapshot.get('profile')

          profObj = {
            fullName: profile.fullName,
            role: profile.role,
            email: profile?.email,
            unp: profile.unp ?  profile.unp : '',
            driverAvatar: profile.hasOwnProperty('driverAvatar') ? profile.driverAvatar : null,
            clientAvatar: profile.hasOwnProperty('clientAvatar') ? profile.clientAvatar : null,
            phone: profile?.phone,
            rating: profile?.rating,
            quantityTenders: profile?.quantityTenders ? profile?.quantityTenders : 0,
            quantityOfFinished: profile?.quantityOfFinished ? profile?.quantityOfFinished : 0,
            userComplaintsCounter: profile?.userComplaintsCounter,
          }
          // console.log('getProfileInfo profObj:', profObj);
          // dispatch()
        }
      }).catch(errfr => {
        console.log('firestore getProfileUserInfo  errfr:', errfr)
      })
      return profObj
    } catch (error) {
      console.log('getProfileUserInfo  error:', error)
    }
}

//получение инфы юзера для жалобы
export async function getProfileUserInfoForComplaint(uid) {
  console.log('\x1b[43m%s %s\x1b[0m','getProfileUserInfoForComplaint:', uid)
    // console.log('uid', uid)
    try {
      // let profObj = null
      return await firestore().collection('forms')
      .doc(uid) //uid юзера
      .get()
      .then(documentSnapshot=>{
        // console.log('documentSnapshot.exists', documentSnapshot.exists,)
        if(documentSnapshot.exists&&documentSnapshot.get('profile') !== undefined) {
          const profile = documentSnapshot.get('profile')

          return {
            fullName: profile.fullName,
            phone: profile?.phone,
            email: profile?.email,
            userComplaintsCounter: profile?.userComplaintsCounter,
          }
          // console.log('getProfileInfo profObj:', profObj);
        }
      }).catch(errfr => {
        console.log('firestore getProfileUserInfoForComplaint  errfr:', errfr)
      })
      // return profObj
    } catch (error) {
      console.log('getProfileUserInfoForComplaint  error:', error)
    }
}

//колличество жалоб на пользователя
export async function getAllComplaints(uid) {
  console.log('\x1b[43m%s %s\x1b[0m','getAllComplaints:', uid)
    // console.log('uid', uid)
    try {
      // let obj = null
      return await firestore().collection('complaints')
      .where('opponentId', '==', uid)
      .get()
      .then((querySnapshot) => {
        console.log('getAllComplaints querySnapshot \n', querySnapshot.size)
        return querySnapshot.size
        // if(!querySnapshot.empty) {
        //   // querySnapshot.forEach(documentSnapshot => {
        //   //     const profile = documentSnapshot.get('profile')
        //   //     // console.log('getProfileInfo profObj:', profObj);
        //   // })

        // } else return querySnapshot.size
      }).catch(errfr => {
        console.log('firestore getAllComplaints  errfr:', errfr)
        return 0
      })
    } catch (error) {
      console.log('getAllComplaints  error:', error)
    }
}

export async function setPositionDriver(uid,position) {
  console.log('\x1b[33m%s %s\x1b[0m ','setPositionDriver')
  
  try {
    let obj = {'timestamp': firestore.FieldValue.serverTimestamp()}
    if(position !==null && position !== undefined) {
      obj.coords = position
    }
    await firestore().collection('positions').doc(uid).update(obj)
    .catch((err)=>{
      console.log('\x1b[33m%s %s\x1b[0m', 'setPositionDriver error:', err.code ==='firestore/not-found');
      if( err.code ==='firestore/not-found') {
        firestore().collection('positions').doc(uid).set(obj).catch((error => {
          console.log('firestore set position err', error)
        }))
      }
    })
  } catch (error) {
    console.log('\x1b[33m%s %s\x1b[0m', 'trycatch setPositionDriver error:', error);
  }
}

export async function getPositionDriver(uid) {
  console.log('\x1b[33m%s %s\x1b[0m ','getPositionDriver start')
  let timestamp = false
  try {
    await firestore().collection('positions').doc(uid).get()
    .then(documentSnapshot => {
      if(documentSnapshot.exists && documentSnapshot.data().hasOwnProperty('timestamp')) {
        // console.log('documentSnapshot.data().timestamp', documentSnapshot.data().timestamp)
          
        timestamp = documentSnapshot.data().timestamp
      } 
    })
    .catch((err)=>{
      console.log('\x1b[33m%s %s\x1b[0m', 'getPositionDriver error:', err);
    })
    return timestamp
  } catch (error) {
    console.log('\x1b[33m%s %s\x1b[0m', 'trycatch getPositionDriver error:', error);
  }
}

export async function getJsonData(dispatch,fn,fnErr) {
  try {
    const response = await fetch(
      'https://cargogo.pro/json/date_popup.json',
    );
    // { method: 'GET', headers: {
    //   'Content-type': 'application/json'
    // }}
    const json = await response.json();
    // console.log('json', json)
    dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.error('getJsonData fetch',error);
  }
  
}

export async function getJsonDataComplaints(dispatch,fn,fnErr) {
  try {
    const response = await fetch(
      'https://cargogo.pro/json/complaints_list.json',
    );
    const json = await response.json();
    // console.log('json', json)
    dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.error('getJsonDataComplaints fetch error',error);
  }
}

export async function getJsonDataSlider(dispatch,fn,fnErr) {
  try {
    const response = await fetch(
      'https://cargogo.pro/json/slider.json',

    );
    const json = await response.json()
    console.log('json', json)

    dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.error('getJsonDataSlider fetch error',error);
  }
}
export async function getJsonDataCheckVersion(dispatch,fn,fnErr) {
  try {
    const response = await fetch(
      'https://cargogo.pro/json/package.json',
    );
    const json = await response.json();
    // console.log('json', json)
    dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.error('fetch',error);
  }
}

//инфа по тендерам созд/завершен
export async function getGetTenderCountInfo(uid,role) {
  // console.log('\x1b[43m%s %s\x1b[0m','getGetTenderCountInfo:', uid, role)
    // console.log('uid', uid)
    
  try {
    //профиль
    let profile = await firestore().collection('forms')
    .doc(uid) //uid юзера
    .get()
    .then(documentSnapshot=>{
      // console.log('documentSnapshot.exists', documentSnapshot.exists,)
      //скрытые, избранное и тд
      // userProfileTenderDelete,userProfileTenderHidden,userProfileTenderHiddenClient,userProfileTenderFaivor,userProfileBlackList
      if(documentSnapshot.exists) {

        //данные по профилю
        if(documentSnapshot.get('profile') !== undefined) {
          const profile = documentSnapshot.get('profile')  
          if(role === 'client') {
            return profile?.quantityOfFinished
          } else {              
            return {sizeTender: profile?.quantityTenders, fullName: profile?.fullName} 
          }       
        }
      }
    }).catch(errfr => {
      console.log('getGetTenderCountInfo  errortenders error:', errfr)
    })
    // console.log('getGetTenderCountInfo profile ', profile)
    return profile
    
  } catch (error) {
    console.log('getGetTenderCountInfo  error:', error)
  }
}