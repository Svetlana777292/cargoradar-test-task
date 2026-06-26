import { mergeUnique } from "../../../util/arrayHelpers";
import { setCheckUnreadMsgInformers, setTenderInformersStateArray } from "../listOfChatsSlice";
import { setCheckFormActivities } from "../loginSlice";
import { get, put } from "./user-api";


export async function getAllUnreadMsg(dispatch,role) {
  console.log('\x1b[43m%s %s\x1b[0m', 'getAllUnreadMsg get unread' );

  try {
    const response = await get('messages/unread')
          // console.log('getAllUnreadMsg response', response)
      if (!response.success) {
          console.warn('Ошибка запроса: getAllUnreadMsg response', response.error);
          // alert(response.error);
          return;
      } else {

        const responseForms = await get('forms')
        if(!responseForms.success) {
          alert(`${responseForms.error}`)
        }
        // console.log('getAllUnreadMsg response.data', JSON.stringify(response.data,null,2))
        if(response.data?.length > 0) {

          // console.log('getAllUnreadMsg', response.data.map(elem => console.log('messages',elem.messages)))
          // [{"messages": [[Object], [Object]], "tenderId": 91}, {"messages": [[Object]], "tenderId": 102}, {"messages": [[Object]], "tenderId": 88}, {"messages": [[Object]], "tenderId": 87}, {"messages": [[Object], [Object], [Object]], "tenderId": 112}]
          //todo 1 - в messages могут быть сообщения для роли клиент

          if(role === 'driver') {

            const activities = []
            const offers = []
            const arrTendersInformers = []

            response.data.forEach(item => {
              // console.log('item', item.archived, item.tenderId)
              // console.log('item', JSON.stringify(item,null,2))
              //информеры только для не архивных - если архивные то пока пропускать ( потом надо дополнить полем архивных и )
              if(item.archived === false ) {
                // console.log('item.archived === false', item.archived === false)
                item.messages.forEach(elem => {
                  if(elem.partnerRole === 'driver' && elem.partnerId === responseForms.data?.profile?.id) {
                    // console.log('elem', elem)
                    arrTendersInformers.push(elem)
                    
                    // if(elem.textSystem ==='acceptTenderByClient') {
                    //   activities.push(elem)
                    // } else if(elem.textSystem ==='offerFromClient') {
                    //   //todo - проверить если по роуту - то офер если по позиции то нет
                    //   //elem.size !== null
                    //   offers.push(elem)
                    // }
                  }
                })
              }
            })
            // //todo проверять id в activities offers и если есть новые то обновить профиль формы
            // //проверка профиля на активные заказы и оферы
            
            // let newActivities = []
            // let newOffers = []

            // let objFormUpd = {}

            // if(activities?.length > 0) {
            //   // проверять если уже ид в активностях
            //   let arrToAdd = []
            //   activities.forEach(elem => {
            //     let res = responseForms.data.driverActiveTender.includes(elem.tenderId)
            //     if(res === false) {
            //       arrToAdd.push(elem)
            //     }
            //   })
            //   console.log('arrToAdd', arrToAdd)
            //   if(arrToAdd.length > 0) {

            //     newActivities = mergeUnique(arrToAdd,responseForms.data.driverActiveTender)
            //     objFormUpd.driverActiveTender = newActivities
            //   }
            // }
            // console.log('newActivities', newActivities)
            // console.log('objFormUpd', objFormUpd)
            // //тут не делать - будет обновляться в setInformersStates(срабатывает на сокет и на апи)
            // // if(offers?.length > 0) {
            // //   newOffers = mergeUnique(offers,responseForms.driverRoutesOffers)
            // //   objFormUpd.driverRoutesOffers = newOffers
            // // }
            // // console.log('objFormUpd', objFormUpd)
            // //!! setTenderInformersStateArray вызывает ререндер в табе функции setInformersStates в таб навигаторе ( починено, но может быть баг)
            dispatch(setTenderInformersStateArray(arrTendersInformers))
            // dispatch(setCheckFormActivities({activities: activities, offers: offers}))
            dispatch(setCheckUnreadMsgInformers(false))

            // if(objFormUpd !== null && objFormUpd.hasOwnProperty('driverActiveTender')) {

            //   const respForm = await put('forms',objFormUpd)
            //   if (!respForm.success) {
            //     console.warn('Ошибка запроса: getAllUnreadMsg respForm', respForm.error);
            //   }
            //   console.log('add activity to driver form respForm.data', respForm.data)
            // }
          } else {
            //для клиента 
            const arrTendersInformers = []
            response.data.forEach(item => {
              //информеры только для не архивных - если архивные то пока пропускать ( потом надо дополнить полем архивных и )
              if(item.archived === false ) {
                item.messages.forEach(elem => {
                  if(elem.partnerRole === 'client' && elem.partnerId === responseForms.data?.profile?.id) {
                    arrTendersInformers.push(elem)
                  }
                })
              }
            })
            console.log('arrTendersInformers length', arrTendersInformers.length)
            dispatch(setTenderInformersStateArray(arrTendersInformers))
            dispatch(setCheckUnreadMsgInformers(false))
          }
        }
      }
    
  } catch (error) {
    console.log('getAllUnreadMsg error',error)
  }
  
}

// export async function getAllUnreadMsg(dispatch,role) {
//   console.log('\x1b[43m%s %s\x1b[0m', 'getAllUnreadMsg get unread' );

//   try {
//     const response = await get('messages/unread')
//           console.log('response', response)
//       if (!response.success) {
//           console.warn('Ошибка запроса: getAllUnreadMsg response', response.error);
//           //
//           // alert(response.error);
//           return;
//       } else {

//         const responseForms = await get('forms')
//         if(!responseForms.success) {
//           alert(`${responseForms.error}`)
//         }
//         console.log('getAllUnreadMsg response.data', JSON.stringify(response.data,null,2))
//         if(response.data?.length > 0) {

//           // console.log('getAllUnreadMsg', response.data.map(elem => console.log('messages',elem.messages)))
//           // [{"messages": [[Object], [Object]], "tenderId": 91}, {"messages": [[Object]], "tenderId": 102}, {"messages": [[Object]], "tenderId": 88}, {"messages": [[Object]], "tenderId": 87}, {"messages": [[Object], [Object], [Object]], "tenderId": 112}]
//           //todo 1 - в messages могут быть сообщения для роли клиент

//           if(role === 'driver') {

//             const activities = []
//             const offers = []
//             const arrTendersInformers = []

//             response.data.forEach(item => {
//               // console.log('item', item.archived, item.tenderId)
//               // console.log('item', JSON.stringify(item,null,2))
//               //информеры только для не архивных - если архивные то пока пропускать ( потом надо дополнить полем архивных и )
//               if(item.archived === false ) {
//                 // console.log('item.archived === false', item.archived === false)
//                 item.messages.forEach(elem => {
//                   if(elem.partnerRole === 'driver' && elem.partnerId === responseForms.data?.profile?.id) {
//                     // console.log('elem', elem)
//                     arrTendersInformers.push(elem)
                    
//                     if(elem.textSystem ==='acceptTenderByClient') {
//                       activities.push(elem)
//                     } else if(elem.textSystem ==='offerFromClient') {
//                       //todo - проверить если по роуту - то офер если по позиции то нет
//                       //elem.size !== null
//                       offers.push(elem)
//                     }
//                   }
//                 })
//               }
//             })
//             //todo проверять id в activities offers и если есть новые то обновить профиль формы
//             //проверка профиля на активные заказы и оферы
            
//             let newActivities = []
//             let newOffers = []

//             let objFormUpd = {}

//             if(activities?.length > 0) {
//               // проверять если уже ид в активностях
//               let arrToAdd = []
//               activities.forEach(elem => {
//                 let res = responseForms.data.driverActiveTender.includes(elem.tenderId)
//                 if(res === false) {
//                   arrToAdd.push(elem)
//                 }
//               })
//               console.log('arrToAdd', arrToAdd)
//               if(arrToAdd.length > 0) {

//                 newActivities = mergeUnique(arrToAdd,responseForms.data.driverActiveTender)
//                 objFormUpd.driverActiveTender = newActivities
//               }
//             }
//             console.log('newActivities', newActivities)
//             console.log('objFormUpd', objFormUpd)
//             //тут не делать - будет обновляться в setInformersStates(срабатывает на сокет и на апи)
//             // if(offers?.length > 0) {
//             //   newOffers = mergeUnique(offers,responseForms.driverRoutesOffers)
//             //   objFormUpd.driverRoutesOffers = newOffers
//             // }
//             // console.log('objFormUpd', objFormUpd)
//             //!! setTenderInformersStateArray вызывает ререндер в табе функции setInformersStates в таб навигаторе ( починено, но может быть баг)
//             dispatch(setTenderInformersStateArray(arrTendersInformers))
//             dispatch(setCheckFormActivities({activities: activities, offers: offers}))
//             dispatch(setCheckUnreadMsgInformers(false))

//             if(objFormUpd !== null && objFormUpd.hasOwnProperty('driverActiveTender')) {

//               const respForm = await put('forms',objFormUpd)
//               if (!respForm.success) {
//                 console.warn('Ошибка запроса: getAllUnreadMsg respForm', respForm.error);
//               }
//               console.log('add activity to driver form respForm.data', respForm.data)
//             }
//           } else {
//             //для клиента 
//             const arrTendersInformers = []
//             response.data.forEach(item => {
//               //информеры только для не архивных - если архивные то пока пропускать ( потом надо дополнить полем архивных и )
//               if(item.archived === false ) {
//                 item.messages.forEach(elem => {
//                   if(elem.partnerRole === 'client' && elem.partnerId === responseForms.data?.profile?.id) {
//                     arrTendersInformers.push(elem)
//                   }
//                 })
//               }
//             })
//             console.log('arrTendersInformers length', arrTendersInformers.length)
//             dispatch(setTenderInformersStateArray(arrTendersInformers))
//             dispatch(setCheckUnreadMsgInformers(false))
//           }
//         }
//       }
    
//   } catch (error) {
//     console.log('getAllUnreadMsg error',error)
//   }
  
// }