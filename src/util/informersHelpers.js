import { get } from "../store/features/api/user-api"
import { getUserActivities, getUserHiddenTenders, setUserActivities } from "../store/features/api/userInfoForms"
import { delArrOfInformers, setInformerActiveState, setInformerRoutesState, setInformerState, updInformerActiveState, updInformerRoutesState, updInformerState } from "../store/features/listOfChatsSlice"
import { mergeUniqueArrObj } from "./arrayHelpers"

export async function setInformersStates(dispatch,role,stateOfInformers,userFormsInfo) {
  // console.log('\x1b[42m%s %s\x1b[0m','fn setInformersStates userActivities:',userActivities,'\n','userFormsHiddenTenders:',userFormsHiddenTenders,'\n','driverDeleteTenders:',driverDeleteTenders)
  console.log('\x1b[45m%s %s\x1b[0m','fn setInformersStates stateOfInformers arrOfInformers:',stateOfInformers)
  console.log('\x1b[45m%s %s\x1b[0m','fn setInformersStates stateOfInformers userFormsInfo:',userFormsInfo)
  //!!должны быть актуальные стейты в userActivities ( зависимость в юз эфекте)
  //!!проверка если заявка в черном листе то убирать ее из стейта информеров  - пока не делать ( нет листа чатов с блокировкой водителей)
  //?если юзер в чате то информеры в стейт по этому чату не будут отправлятся будет срабатывать setCurrentChatMsgState
  // объект информера
  // {
  //   _id: action.payload._id, 
  //   tenderId: action.payload.tenderId, 
  //   userId: action.payload.userId, 
  //   textSystem: action.payload.textSystem,
  //   routeId: routeid,
  //   createdAt: action.payload.createdAt
  //    read:  action.payload.read
  // }

  //informerState - для скрина поиска/мои заявки 
  //informerActiveState - для скрина в работе 
  //сортировка в работе или нет
  
  if(stateOfInformers.length === 0) return
  const arrOfInformers = []
  const arrOfActiveInformers = []
  const arrOfRoutesInformers = []
  
  //!!TODO добавить проверку на скрытые

  let userForms = null
  const forms = await get('forms')
  if (!forms.success) {
    console.warn('Ошибка запроса: setInformersStates forms', forms.error);
    userForms = userFormsInfo //заменить на форму (импортировать)
  }
  userForms = forms.data
  console.log('userForms', userForms)
  
  const userActiveArr = role === 'client' ? userForms.clientActiveTender : userForms.driverActiveTender
  // userActivities.driverRoutesOffers - 
  // hiddenDriver,hiddenClient
  //если драйвер - сначала проверить на офер
  // let newOffers = [] //если в конце не пустой то обновить setUserActivities
  const clientCheck = (msg,arrHidden) => {
    let checkId = arrHidden.find(elemfn => { 
      if(elemfn.hasOwnProperty('tender_id')) {
        return elemfn?.user_id === msg.userId && elemfn?.tender_id === msg.tenderId

      } else if(elemfn.hasOwnProperty('tenderId')) {

        return elemfn?.userId === msg.userId  && elemfn?.tenderId === msg.tenderId 
      }
      // return elemfn.tenderId == msg.tenderId && elemfn.userId === msg.userId 
    })
    return checkId !== undefined ? true : false
  }

  stateOfInformers.forEach(elem => {
    
    //проверка на неактивные
    let driverHidden = userForms.hiddenTenders.concat(userForms.driverDeleteTenders)
    let check = role === 'driver' ? driverHidden.includes(elem.tenderId) : clientCheck(elem,userForms.hiddenTendersClient)
    console.log('check hid', check)
    if(check === true) return;

    //todo если пришло сообщение что отменил драйвер.клиент то возвращать и обновлять стейт неактивнх
    console.log('elem.textSystem: ', elem.textSystem)
    //elem.textSystem === 'feedback' - тоде обновить неактивные

    if(elem.textSystem === 'orderCanceled') {
      //todo тут просто диспач в из userForms ( при условии что это было  userForms = await get('forms') а не userFormsInfo)
      getUserHiddenTenders(dispatch)
      return;
    }

    let isActive = userActiveArr.includes(elem.tenderId)
    console.log('isActive', isActive)
    
    if(isActive === true) {
      console.log('\x1b[44m%s %s\x1b[0m','isActive:',isActive)
      console.log('1 push arrOfActiveInformers', )
      arrOfActiveInformers.push(elem) 
      
    } else {
      //driver
      if(role === 'driver') {
        //если пришел информер что заявка в работе то обновить стейт и добавить в активные
        

        if(elem.textSystem === 'acceptTenderByClient' && elem.read === false) {
          console.log('driver new accept', elem.textSystem === 'acceptTenderByClient' && elem.read === false, isActive)
          //todo тут просто диспач в из userForms ( при условии что это было  userForms = await get('forms') а не userFormsInfo)
          getUserActivities(dispatch)
          arrOfActiveInformers.push(elem) //
        }
        

        //----
        //!! как разделять информеры которые по маршруту и обычные - ?
        //!! проверять есть ли айди заявки в driverRoutesOffers - если есть то в роут если нет то в обычный
        //todo - если с офером пришло еще несколько сообщений по заявке то они запишутся в отдельный стейт arrOfInformers
        //придумать как все сообщения отправлять вже в роут так как userActivities.driverRoutesOffers.includes(elem.tenderId)
        //не сработает на след сообщение после офера (по той же заявке)

        //если есть офер и сообщение не прочитано и в стйте оферов нет айди тендера - то обновить профиль активностей
        let checkItemInstate = userForms.driverRoutesOffers.find(item => {return item.tenderId === elem.tenderId && item.routeId !== null})
        console.log('checkItemInstate', checkItemInstate)
        console.log('elem', elem)
        if(elem.textSystem === 'offerFromClient' && elem.read === false && checkItemInstate === undefined && elem.routeId !== null ) {
          //!!elem.routeId !== null - то предложение по маршруту - если пустое то по позиции и тогда в обычные информеры
          //обновить стейт активностей( get form )
          console.log('driver new offerFromClient', elem.textSystem === 'offerFromClient' && elem.read === false && checkItemInstate === undefined, checkItemInstate)
          //todo тут просто диспач в из userForms ( при условии что это было  userForms = await get('forms') а не userFormsInfo)

          getUserActivities(dispatch)
          arrOfRoutesInformers.push(elem)
        } else if(checkItemInstate){
          // } else if(userActivities.driverRoutesOffers.find(item => {return item.tenderId === elem.tenderId})){
          //в driverRoutesOffers есть еще поле routeId
          // if(userActivities.driverRoutesOffers.includes(elem.tenderId)){
          //заявка не выполняется и был офер 
          console.log('1 push arrOfRoutesInformers', )
          arrOfRoutesInformers.push(elem)
        } else {
          console.log('2 push arrOfInformers', )
          arrOfInformers.push(elem)
        }
      } else {
        //client
        console.log('3 push arrOfInformers', )
        arrOfInformers.push(elem)
      }
    }
  })
  console.log('arrOfInformers', arrOfInformers.length)
  console.log('arrOfActiveInformers', arrOfActiveInformers.length)
  console.log('arrOfRoutesInformers', arrOfRoutesInformers.length, arrOfRoutesInformers)

  arrOfInformers?.length !== 0 ? dispatch(setInformerState(arrOfInformers)) : null
  arrOfRoutesInformers?.length !== 0 ? dispatch(setInformerRoutesState(arrOfRoutesInformers)) : null
  arrOfActiveInformers?.length !== 0 ? dispatch(setInformerActiveState(arrOfActiveInformers)) : null




  // 2 по позиции просто добавить driverRoutesOffers с routeId null
  // if(!userActivities.driverRoutesOffers.includes(elem.tenderId)) {
  //   console.log('\x1b[44m%s %s\x1b[0m','не в стейте driverRoutesOffers - добавить:',!userActivities.driverRoutesOffers.includes(elem.tenderId),elem)
  //   //добавить в стейт
  //   let check = userActivities.driverRoutesOffers.find(item => item === elem.tenderId)
  //   console.log('check', check)
  //   if(check === undefined) {
  //     setUserActivities(dispatch,{'driverRoutesOffers': userActivities.driverRoutesOffers.concat([elem.tenderId])})
  //   }
  // }

  //если есть getUserActivities то функция не перезапустится так как delArrOfInformers сотрет информеры - пока пушу сообщение
  dispatch(delArrOfInformers())
}

export function updateInformers(dispatch,userId,informerState,informerActiveState,informerRoutesState,tenderId,messages,routeState) {
  // console.log('\x1b[45m%s %s\x1b[0m','updateInformers  ',userId,informerState,informerActiveState,informerRoutesState,tenderId,messages)
  // console.log('\x1b[45m%s %s\x1b[0m','updateInformers  ',userId,tenderId,informerState,informerActiveState,informerRoutesState,)
  try {
    
    //todo прочитал сообщение - удалить информер по заявке
    
    const arrOfActiveInformers = informerActiveState.filter(elem => {
      let res = messages.find(elemfn => {
        return elem._id === elemfn._id
      })
      if(res === undefined) return elem
    })

    const arrOfInformers = informerState.filter(elem => {
      let res = messages.find(elemfn => {
        return elem._id === elemfn._id
      })
      if(res === undefined) return elem
    })
    
    const arrOfRoutesInformers = informerRoutesState.filter(elem => {
      let res = messages.find(elemfn => {
        return elem._id === elemfn._id
      })
      if(res === undefined) return elem
    })

  
    // console.log('upd arrOfInformers', arrOfInformers)
    // console.log('upd arrOfActiveInformers', arrOfActiveInformers)
    // console.log('upd informerRoutesState', arrOfRoutesInformers)
    
    dispatch(updInformerState(arrOfInformers))
    dispatch(updInformerActiveState(arrOfActiveInformers))
    dispatch(updInformerRoutesState(arrOfRoutesInformers))
  } catch (error) {
    console.log('updateInformers error', error)
  }
}


// export async function setInformersStates(dispatch,userActivities,role,stateOfInformers, userFormsHiddenTenders,driverDeleteTenders) {
//   console.log('\x1b[42m%s %s\x1b[0m','fn setInformersStates userActivities:',userActivities,'\n','userFormsHiddenTenders:',userFormsHiddenTenders,'\n','driverDeleteTenders:',driverDeleteTenders)
//   console.log('\x1b[45m%s %s\x1b[0m','fn setInformersStates stateOfInformers arrOfInformers:',stateOfInformers)
//   //!!должны быть актуальные стейты в userActivities ( зависимость в юз эфекте)
//   //!!проверка если заявка в черном листе то убирать ее из стейта информеров  - пока не делать ( нет листа чатов с блокировкой водителей)
//   //?если юзер в чате то информеры в стейт по этому чату не будут отправлятся будет срабатывать setCurrentChatMsgState
//   // объект информера
//   // {
//   //   _id: action.payload._id, 
//   //   tenderId: action.payload.tenderId, 
//   //   userId: action.payload.userId, 
//   //   textSystem: action.payload.textSystem,
//   //   routeId: routeid,
//   //   createdAt: action.payload.createdAt
//   //    read:  action.payload.read
//   // }

//   //informerState - для скрина поиска/мои заявки 
//   //informerActiveState - для скрина в работе 
//   //сортировка в работе или нет
  
//   if(stateOfInformers.length === 0) return
//   const arrOfInformers = []
//   const arrOfActiveInformers = []
//   const arrOfRoutesInformers = []
  
//   //!!TODO добавить проверку на скрытые
  
//   const userActiveArr = role === 'client' ? userActivities.clientActiveTender : userActivities.driverActiveTender
//   // userActivities.driverRoutesOffers - 
//   // hiddenDriver,hiddenClient
//   //если драйвер - сначала проверить на офер
//   // let newOffers = [] //если в конце не пустой то обновить setUserActivities
//   const clientCheck = (msg,arrHidden) => {
//     let checkId = arrHidden.find(elemfn => { 
//       if(elemfn.hasOwnProperty('tender_id')) {
//         return elemfn?.user_id === msg.userId && elemfn?.tender_id === msg.tenderId

//       } else if(elemfn.hasOwnProperty('tenderId')) {

//         return elemfn?.userId === msg.userId  && elemfn?.tenderId === msg.tenderId 
//       }
//       // return elemfn.tenderId == msg.tenderId && elemfn.userId === msg.userId 
//     })
//     return checkId !== undefined ? true : false
//   }

//   const formResp = await get('forms')
//   if (!formResp.success) {
//       console.warn('Ошибка запроса: setInformersStates forms', formResp.error);
//   }




//   stateOfInformers.forEach(elem => {
    
//     //проверка на неактивные
//     let driverHidden = userFormsHiddenTenders.hiddenTenders.concat(driverDeleteTenders)
//     let check = role === 'driver' ? driverHidden.includes(elem.tenderId) : clientCheck(elem,userFormsHiddenTenders.hiddenTendersClient)
//     console.log('check hid', check)
//     if(check === true) return;

//     //todo если пришло сообщение что отменил драйвер.клиент то возвращать и обновлять стейт неактивнх
//     console.log('elem.textSystem: ', elem.textSystem)
//     //elem.textSystem === 'feedback' - тоде обновить неактивные
//     if(elem.textSystem === 'orderCanceled') {
//       getUserHiddenTenders(dispatch)
//       return;
//     }

//     let isActive = userActiveArr.includes(elem.tenderId)
//     console.log('isActive', isActive)
    
//     if(isActive === true) {
//       console.log('\x1b[44m%s %s\x1b[0m','isActive:',isActive)
//       console.log('1 push arrOfActiveInformers', )
//       arrOfActiveInformers.push(elem) 
      

//     } else {
//       //driver
//       if(role === 'driver') {
//         //если пришел информер что заявка в работе то обновить стейт и добавить в активные
        

//         if(elem.textSystem === 'acceptTenderByClient' && elem.read === false) {
//           console.log('driver new accept', elem.textSystem === 'acceptTenderByClient' && elem.read === false, isActive)
//           //TODO обновить стейт активностей( get form )
//           getUserActivities(dispatch)
//           arrOfActiveInformers.push(elem) //
//         }
        

//         //----
//         //!! как разделять информеры которые по маршруту и обычные - ?
//         //!! проверять есть ли айди заявки в driverRoutesOffers - если есть то в роут если нет то в обычный
//         //todo - если с офером пришло еще несколько сообщений по заявке то они запишутся в отдельный стейт arrOfInformers
//         //придумать как все сообщения отправлять вже в роут так как userActivities.driverRoutesOffers.includes(elem.tenderId)
//         //не сработает на след сообщение после офера (по той же заявке)

//         //если есть офер и сообщение не прочитано и в стйте оферов нет айди тендера - то обновить профиль активностей
//         let checkItemInstate = userActivities.driverRoutesOffers.find(item => {return item.tenderId === elem.tenderId && item.routeId !== null})
//         console.log('checkItemInstate', checkItemInstate)
//         console.log('elem', elem)
//         if(elem.textSystem === 'offerFromClient' && elem.read === false && checkItemInstate === undefined && elem.routeId !== null ) {
//           //!!elem.routeId !== null - то предложение по маршруту - если пустое то по позиции и тогда в обычные информеры
//           //обновить стейт активностей( get form )
//           console.log('driver new offerFromClient', elem.textSystem === 'offerFromClient' && elem.read === false && checkItemInstate === undefined, checkItemInstate)

//           getUserActivities(dispatch)
//           arrOfRoutesInformers.push(elem)
//         } else if(checkItemInstate){
//         // } else if(userActivities.driverRoutesOffers.find(item => {return item.tenderId === elem.tenderId})){
//           //в driverRoutesOffers есть еще поле routeId
//         // if(userActivities.driverRoutesOffers.includes(elem.tenderId)){
//           //заявка не выполняется и был офер 
//           console.log('1 push arrOfRoutesInformers', )
//           arrOfRoutesInformers.push(elem)
//         } else {
//           console.log('2 push arrOfInformers', )
//           arrOfInformers.push(elem)
//         }
//       } else {
//         //client
//         console.log('3 push arrOfInformers', )
//         arrOfInformers.push(elem)
//       }
//     }
//   })
//   console.log('arrOfInformers', arrOfInformers.length)
//   console.log('arrOfActiveInformers', arrOfActiveInformers.length)
//   console.log('arrOfRoutesInformers', arrOfRoutesInformers.length, arrOfRoutesInformers)
  
//   // const resRoutes = []
//   // const resInformers = []
//   // if(newOffers?.length > 0) {
//   //   let newArr = mergeUniqueArrObj(newOffers,userActivities.driverRoutesOffers)
//   //   //newArr в стейт
//   //   console.log('stinf newArr', newArr)
//   //   if(newArr.length > 0) {
//   //     let obj = userActivities.driverRoutesOffers.concat(newArr)
//   //     console.log('obj', obj)
//   //     setUserActivities(dispatch,{'driverRoutesOffers': obj})
//   //   }
//   //   //если было несколько сообщений подряд по заявке с офером то проверить arrOfInformers
    
//   //   //arrOfInformers - проверить на newOffers 
//   //   arrOfInformers.forEach(element => {
//   //     let res = newOffers.find(elem => {
//   //       return elem.tenderId === element.tenderId
//   //     })
//   //     if(res !== undefined) {
//   //       resRoutes.push(res)
//   //     } else {
//   //       resInformers.push(res)
//   //     }
//   //   });
//   //   if(resRoutes.length > 0) {
//   //     arrOfRoutesInformers.concat(resRoutes)
//   //   }
//   // }
//   // console.log('resRoutes', resRoutes)
//   // console.log('resInformers', resInformers)

//   // if(newOffers?.length > 0) {
//   //   resInformers.length > 0 ? dispatch(setInformerState(resInformers)) : null
//   //   resRoutes.concat(arrOfRoutesInformers).length > 0? dispatch(setInformerRoutesState(arrOfRoutesInformers)) : null

//   // } else {
//   //   arrOfInformers?.length !== 0 ? dispatch(setInformerState(arrOfInformers)) : null
//   //   arrOfRoutesInformers?.length !== 0 ? dispatch(setInformerRoutesState(arrOfRoutesInformers)) : null
//   // }
//   arrOfInformers?.length !== 0 ? dispatch(setInformerState(arrOfInformers)) : null
//   arrOfRoutesInformers?.length !== 0 ? dispatch(setInformerRoutesState(arrOfRoutesInformers)) : null
//   arrOfActiveInformers?.length !== 0 ? dispatch(setInformerActiveState(arrOfActiveInformers)) : null




//   // 2 по позиции просто добавить driverRoutesOffers с routeId null
//   // if(!userActivities.driverRoutesOffers.includes(elem.tenderId)) {
//   //   console.log('\x1b[44m%s %s\x1b[0m','не в стейте driverRoutesOffers - добавить:',!userActivities.driverRoutesOffers.includes(elem.tenderId),elem)
//   //   //добавить в стейт
//   //   let check = userActivities.driverRoutesOffers.find(item => item === elem.tenderId)
//   //   console.log('check', check)
//   //   if(check === undefined) {
//   //     setUserActivities(dispatch,{'driverRoutesOffers': userActivities.driverRoutesOffers.concat([elem.tenderId])})
//   //   }
//   // }

//   //если есть getUserActivities то функция не перезапустится так как delArrOfInformers сотрет информеры - пока пушу сообщение
//   dispatch(delArrOfInformers())
// }