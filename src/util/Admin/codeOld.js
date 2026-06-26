//!!!!!!!!!!!!! //* TABNAVIGATION */
    // //клиент прослушка ставок
    // useEffect(()=>{
    //   const unsubscribe = role == 'client' ? repliesRef.where('clientId', '==', uid).where('createdAt', '>', timestMonth).onSnapshot((querySnapshot) => {
    //     //createdAt > timest - поставить больше недели, так как будет прослушка не только ставки но и принятия ставки отказа и тд
    //     console.log('\x1b[42m%s %s\x1b[0m', 'client TN repliesRef прослушка', querySnapshot.size)
    //     let betsArr = []
    //     let rejectByDrArr = []
    //     let acceptByDrArr = []
    //     let pickCandidateAtArr = []
    //     let rejectByClientArr = []
    //     querySnapshot.docChanges().forEach((change) => {
    //       if(change.type === "added") {
    //         // console.log("New : ", change.doc.id)
    //         //---------------получение ставок----------------
    //         if(
    //           change.doc.data().createdAt.toMillis() > timest && 
    //           change.doc.data().rejectedAt == null &&
    //           change.doc.data().rejectedByDriverAt == null &&
    //           change.doc.data().pickCandidateAt == null &&
    //           change.doc.data().acceptedByDriverAt == null
    //         ) {
    //           if(betStateNotif !== null) {
    //             //проверять уже имеющиеся ставки и добавлять новые
    //             //ищем элемент в стейте и пушим в массив если его нету - тоесть вернул undefined
    //             let objElem = betStateNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //             elemFind.docId == change.doc.id)
    //             console.log('objElem', objElem)
    //             if(objElem == undefined) {
    //               console.log('стейт не пустой - найден новый эл-т, добавляем его, objElem == undefined')
    //               let obj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               betsArr.push(obj)
    //             }
    //           } else if(betStateNotif == null) {
    //             console.log('стейт пустой - добавляем эл-ты, betStateNotif и betCountNotif  == null')
    //             //надо проверяь что бы заявки были не отклоненные не принятые и тд
    //             //так как если стейт пустой и поле допустим rejectedAt не пустое то заявка пройдет проверку
    //             // if(
    //             //   change.doc.data().rejectedAt == null &&
    //             //   change.doc.data().rejectedByDriverAt == null &&
    //             //   change.doc.data().pickCandidateAt == null &&
    //             //   change.doc.data().acceptedByDriverAt == null
    //             // ) {

    //               let obj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               betsArr.push(obj)
    //             // }
    //           }
    //         }
    //       }
    //       //----------------------------------------------
    //       if (change.type === "modified") {
    //         //водитель может делать повторно ставку на заявку/ после отмены 
    //         console.log("Modified клиент: ", change.doc.data(), change.doc.id)
    //         //1 modified---------------водитель отклонил предложение выполнять заказ----------------
    //         if(change.doc.data().rejectedByDriverAt !== null && change.doc.data().rejectedAt == null) {
    //           if(rejectedByDrNotif !== null) {
    //             let filteredRejObj = rejectedByDrNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //             elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //             console.log('filteredRejObj', filteredRejObj)
    //             if(filteredRejObj == undefined) {
    //               console.log('1 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredRejObj == undefined')
    //               let rejObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               rejectByDrArr.push(rejObj)
    //             }
    //             //стейт пустой добавляем все отмененные ставки
    //           } else if(rejectedByDrNotif == null){
    //             console.log('1 modified- стейт пустой - добавляем все эл-ты, rejectedByDriverNotif == null')
    //             let rejObj = {
    //               tenderId: change.doc.data().tenderId,
    //               driverId: change.doc.data().userId,
    //               name: change.doc.data().name,
    //               docId: change.doc.id,
    //               read: false
    //             }
    //             rejectByDrArr.push(rejObj)
    //           }
    //         }
    //         //2 modified---------------заказ принят к выполнению водителем---------------- 
    //         if(
    //           change.doc.data().acceptedByDriverAt !== null &&
    //           change.doc.data().rejectedByDriverAt == null &&
    //           change.doc.data().rejectedAt == null
    //         ) {
    //           if(acceptedByDrNotif !== null) {
    //             let filteredAcceptObj = acceptedByDrNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //             elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //             console.log('filteredAcceptObj', filteredAcceptObj)
    //             if(filteredAcceptObj == undefined) {
    //               console.log('2 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredAcceptObj == undefined')
    //               let acceptObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 name: change.doc.data().name,
    //                 driverId: change.doc.data().userId,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               acceptByDrArr.push(acceptObj)
    //             }
    //           } else if(acceptedByDrNotif == null){
    //             console.log('2 modified- стейт пустой - добавляем все эл-ты, acceptedByDrNotif == null')
    //             let acceptObj = {
    //               tenderId: change.doc.data().tenderId,
    //               name: change.doc.data().name,
    //               driverId: change.doc.data().userId,
    //               docId: change.doc.id,
    //               read: false
    //             }
    //             acceptByDrArr.push(acceptObj)
    //           }
    //         }
    //         //----------------------------------------------

    //         //______________прослушка своих ставок____________________
    //         //для получения оповещаний на свои ставки при сменe роли 
    //         if(change.doc.data().userId == uid && change.doc.data().clientId == uid) {
    //           console.log('****клиент прослушка - Модификация своей ставки****' )
    //           //3 modified---------------клиент предложил выполнить заказ----------------
    //           if(
    //             change.doc.data().pickCandidateAt !== null && 
    //             change.doc.data().acceptedByDriverAt == null && 
    //             change.doc.data().rejectedAt == null && 
    //             change.doc.data().rejectedByDriverAt == null
              
    //           ) {
    //             if(pickCandidateNotif !== null) {
    //               let filteredPickObj = pickCandidateNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //               elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //               console.log('filteredPickObj', filteredPickObj)
    //               if(filteredPickObj == undefined) {
    //                 console.log('3 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredPickObj == undefined')
    //                 let pickObj = {
    //                   tenderId: change.doc.data().tenderId,
    //                   driverId: change.doc.data().userId,
    //                   name: change.doc.data().name,
    //                   docId: change.doc.id,
    //                   read: false
    //                 }
    //                 pickCandidateAtArr.push(pickObj)
    //               }
    //               //стейт пустой добавляем все отмененные ставки
    //             } else if(pickCandidateNotif == null){
    //               console.log('3 modified- стейт пустой - добавляем все эл-ты, pickCandidateNotif == null')
    //               let pickObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               pickCandidateAtArr.push(pickObj)
    //             }
    //           }
    //           //4 modified---------------клиент отклонил вашу ставку---------------- 
    //           if(change.doc.data().rejectedAt !== null && change.doc.data().rejectedByDriverAt == null) {
    //             if(rejectedAtClientNotif !== null) {
    //               let filteredRejObj = rejectedAtClientNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //               elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //               console.log('filteredRejObj', filteredRejObj)
    //               if(filteredRejObj == undefined) {
    //                 console.log('4 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredRejObj == undefined')
    //                 let rejObj = {
    //                   tenderId: change.doc.data().tenderId,
    //                   driverId: change.doc.data().userId,
    //                   name: change.doc.data().name,
    //                   docId: change.doc.id,
    //                   read: false
    //                 }
    //                 rejectByClientArr.push(rejObj)
    //               }
    //               //стейт пустой добавляем все отмененные ставки
    //             } else if(rejectedAtClientNotif == null){
    //               console.log('4 modified- стейт пустой - добавляем все эл-ты, rejectedAtClientNotif == null')
    //               let rejObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               rejectByClientArr.push(rejObj)
    //             }
    //           }
    //           //----------------------------------------------
    //         }
    //       }
    //     })
    //     //общий счетчик для ставок
    //     console.log('счетчик для ставок', querySnapshot.size)
    //     if(repliesCounterNotif && querySnapshot.size > repliesCounterNotif.notifSize) {
    //       dispatch(onCounterRepliesCounter(querySnapshot.size))
    //     }

    //     console.log('добавленные ставки betsArr', betsArr)
    //     if(betsArr.length > 0) {
    //       dispatch(onBetState(betsArr))
    //       dispatch(onBetCounter({newNotif: betsArr.length+betCountNotif.newNotif}))
    //     }

    //     console.log('отмененные ставкиrejectByDrArr', rejectByDrArr)
    //     if(rejectByDrArr.length > 0) {
    //       dispatch(onRejectByDr(rejectByDrArr))
    //       dispatch(onRejectByDrCounter({newNotif: rejectByDrArr.length+rejectedByDrCounterNotif.newNotif}))
    //     }

    //     console.log('принятые ставки acceptByDrArr', acceptByDrArr)
    //     if(acceptByDrArr.length > 0) {
    //       dispatch(onAcceptedByDr(acceptByDrArr))
    //       dispatch(onAcceptedByDrCounter({newNotif: acceptByDrArr.length+acceptedByDrCounterNotif.newNotif}))
    //     }

    //     // клиент прослушка - только для своих ставок на которые есть действия
    //     console.log('**клиент прослушка: только для своих ставок на которые есть действия - ставка принята клиентом pickCandidateAtArr', pickCandidateAtArr)
    //     if(pickCandidateAtArr.length > 0) {
    //       console.log('диспатч pickCandidateAtArr ', pickCandidateAtArr)
    //       dispatch(onPickCandidateState(pickCandidateAtArr))
    //       dispatch(onPickCandidateCounter({newNotif: pickCandidateAtArr.length+pickCandidateCounterNotif.newNotif}))
    //     }
        
    //     console.log('**клиент прослушка: только для своих ставок на которые есть действия - ставка отменена клиентом rejectByClientArr', rejectByClientArr)
    //     if(rejectByClientArr.length > 0) {
    //       console.log('диспатч rejectByClientArr ', rejectByClientArr)
    //       dispatch(onRejectedAtClientState(rejectByClientArr))
    //       dispatch(onRejectedAtClientCounter({newNotif: rejectByClientArr.length+rejectedAtClientCounterNotif.newNotif}))
    //     }
    //   })
    //   :
    //   () => {}
    //   return () => {
    //     console.log('\x1b[42m%s %s\x1b[0m', 'repliesRef client return unsubscribe')
    //     unsubscribe()
    //   }
    // },[role])

    // //клиент прослушка заявок
    // useEffect(()=>{
    //   // role == 'client' ?
    //   const unsubscribe = tendersRef.where('userId', '==', uid).where('createdAt', '>', timestMonth).onSnapshot((querySnapshot) => {
    //     console.log('\x1b[46m%s %s\x1b[0m','client TN tendersRef прослушка', querySnapshot.size)
    //     let tenderFinish = []
    //     let tenderCancel = []
    //     querySnapshot.docChanges().forEach((change) => {
    //       if (change.type === "modified") {
    //         console.log("!!!!Modified : ", change.doc.data(), change.doc.id)
    //         //---------------заказ выполнен водителем----------------
    //         if(change.doc.data().driverId !== null && change.doc.data().replyId !== null &&
    //          change.doc.data().orderStartedAt !== null &&
    //          change.doc.data().hasOwnProperty('endExecuteDelivery') && change.doc.data().endExecuteDelivery.driver == true
    //          ) {
    //           // change.doc.data().finishedAt == null && - убираем так как важно что водитель нажал кнопку подтверждения выполнения заказа
    //           //дальше подтверждения со стороны клиента и обмен отзывами
    //           //canceledAt - может быть не пустым так как заявку можно взять повторно после отмены выполнения
    //           //любая модификация заявки будет тригирить прослушку - начало движения(start: true) 
    //           //или трекинг isTraking будут проходить проверку в ифах
    //           // if(change.doc.data().isTraking == false && change.doc.data().start == true) return
    //           if(finishedStateNotif !== null) {
    //             let finObj = finishedStateNotif.find(elemFind => elemFind.tenderId == change.doc.id && 
    //             elemFind.replyId == change.doc.data().replyId)
    //             console.log('finObj', finObj)
    //             if(finObj == undefined) {
    //               console.log('1 modified- стейт не пустой - найден новый эл-т, добавляем его, finObj == undefined')
    //               let fObj = {
    //                 tenderId: change.doc.id,
    //                 driverId: change.doc.data().driverId,
    //                 replyId: change.doc.data().replyId,
    //                 name: change.doc.data().name,
    //                 read: false
    //               }
    //               tenderFinish.push(fObj)
    //             }
    //           } else if(finishedStateNotif == null) {
    //               console.log('1 modified- стейт пустой - найден новый эл-т, добавляем его, finObj == undefined')
    //               let fObj = {
    //                 tenderId: change.doc.id,
    //                 driverId: change.doc.data().driverId,
    //                 replyId: change.doc.data().replyId,
    //                 name: change.doc.data().name,
    //                 read: false
    //               }
    //               tenderFinish.push(fObj)
    //           }
    //         }

    //         //---------------водитель отменил выполнение заказа----------------
    //         if(
    //           change.doc.data().driverId == null &&
    //           change.doc.data().replyId == null &&
    //           change.doc.data().orderStartedAt == null &&
    //           change.doc.data().finishedAt == null &&
    //           change.doc.data().hasOwnProperty('canceledAt') &&
    //           change.doc.data().canceledAt !== null &&
    //           change.doc.data().hasOwnProperty('canceledBy') &&
    //           change.doc.data().canceledBy !== null
    //         ) {
    //           //если заявку взяли и отменили - останется canceledAt canceledBy заполненными - пройдет ли проверку? проверить полный цикл если повторно брать и отказываться
    //           if(canceledByStateNotif !== null) {
    //             let cnscObj = canceledByStateNotif.find(elemFind => elemFind.tenderId == change.doc.id && 
    //             elemFind.createdAt == change.doc.data().createdAt.toMillis())
    //             console.log('cnscObj', cnscObj)
    //             if(cnscObj == undefined) {
    //               console.log('1 modified- стейт не пустой - найден новый эл-т, добавляем его, cnscObj == undefined')
    //               let cObj = {
    //                 tenderId: change.doc.id,
    //                 createdAt: change.doc.data().createdAt.toMillis(),
    //                 driverId: change.doc.data().driverId, //будет пустой так как чистится поле при отмене заявки
    //                 replyId: change.doc.data().replyId, //будет пустой так как чистится поле при отмене заявки
    //                 name: change.doc.data().name,
    //                 read: false
    //               }
    //               tenderCancel.push(cObj)
    //             }
    //           } else if(canceledByStateNotif == null) {
    //               console.log('1 modified- стейт не пустой - найден новый эл-т, добавляем его, cnscObj == undefined')
    //               let cObj = {
    //                 tenderId: change.doc.id,
    //                 createdAt: change.doc.data().createdAt.toMillis(),
    //                 driverId: change.doc.data().driverId, //будет пустой так как чистится поле при отмене заявки
    //                 replyId: change.doc.data().replyId, //будет пустой так как чистится поле при отмене заявки
    //                 name: change.doc.data().name,
    //                 read: false
    //               }
    //               tenderCancel.push(cObj)
    //           }
    //         }

    //         console.log('tenderFinish', tenderFinish)
    //         if(tenderFinish.length > 0) {
    //           dispatch(onFinishedState(tenderFinish))
    //           dispatch(onFinishedCounter({newNotif: tenderFinish.length+finishedCounterNotif.newNotif}))
    //         }

    //         console.log('tenderCancel', tenderCancel)
    //         if(tenderCancel.length > 0) {
    //           dispatch(onCanceledByState(tenderCancel)) //finishedCounterNotif finishedStateNotif
    //           dispatch(onCanceledByCounter({newNotif: tenderCancel.length+canceledByCounterNotif.newNotif}))
    //         }
    //         //количество модификаций(в тендерах скорее всего нигде не понадобится)
    //         if(tendersCounterNotif && querySnapshot.size > tendersCounterNotif.notifSize) {
    //           dispatch(onCounterTendersCounter(querySnapshot.size))
    //         }
    //       }
    //     })
    //   })
    //   // :
    //   // () => {}
    //   return () => {
    //     console.log('\x1b[46m%s %s\x1b[0m', 'tendersRef client return unsubscribe')
    //     unsubscribe()
    //   }
    // },[role])

    // //водитель прослушка ставок
    // useEffect(() => {
    //   const unsubscribe = role == 'driver' ? repliesRef.where('userId', '==', uid).where('createdAt', '>', timestMonth).onSnapshot((querySnapshot) => {
    //     console.log('\x1b[44m%s %s\x1b[0m', 'driver TN repliesRef прослушка',)
    //     let pickCandidateAtArr = []
    //     let rejectByClientArr = []
    //     let rejectByDrArr = []
    //     let acceptByDrArr = []
    //     querySnapshot.docChanges().forEach((change) => {
    //         // console.log("New : ", change.doc.id)
    //         // rejectedAt pickCandidateAt
    //       if (change.type === "modified") {
    //         console.log("Modified водитель: ", change.doc.data(), change.doc.id, change.doc.metadata.hasPendingWrites)
    //         console.log('change.doc.metadata', change.doc.metadata)

    //         //1 modified---------------клиент предложил выполнить заказ----------------
    //         if(
    //           change.doc.data().pickCandidateAt !== null && 
    //           change.doc.data().acceptedByDriverAt == null && 
    //           change.doc.data().rejectedAt == null && 
    //           change.doc.data().rejectedByDriverAt == null
    //         ) {
    //           console.log('pickCandidateNotif state', pickCandidateNotif)
    //           if(pickCandidateNotif !== null) {
    //             let filteredPickObj = pickCandidateNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //             elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //             console.log('filteredPickObj', filteredPickObj)
    //             if(filteredPickObj == undefined) {
    //               console.log('1 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredPickObj == undefined')
    //               let pickObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               pickCandidateAtArr.push(pickObj)
    //             }
    //             //стейт пустой добавляем все отмененные ставки
    //           } else if(pickCandidateNotif == null){
    //             console.log('1 modified- стейт пустой - добавляем все эл-ты, pickCandidateNotif == null')
    //             let pickObj = {
    //               tenderId: change.doc.data().tenderId,
    //               driverId: change.doc.data().userId,
    //               name: change.doc.data().name,
    //               docId: change.doc.id,
    //               read: false
    //             }
    //             pickCandidateAtArr.push(pickObj)
    //           }
    //         }
    //         //2 modified---------------клиент отклонил вашу ставку---------------- 
    //         if(change.doc.data().rejectedAt !== null && change.doc.data().rejectedByDriverAt == null) {
    //           console.log('rejectedAtClientNotif state', rejectedAtClientNotif)
    //           if(rejectedAtClientNotif !== null) {
    //             let filteredRejObj = rejectedAtClientNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //             elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //             console.log('filteredRejObj', filteredRejObj)
    //             if(filteredRejObj == undefined) {
    //               console.log('2 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredRejObj == undefined')
    //               let rejObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               rejectByClientArr.push(rejObj)
    //             }
    //             //стейт пустой добавляем все отмененные ставки
    //           } else if(rejectedAtClientNotif == null){
    //             console.log('2 modified- стейт пустой - добавляем все эл-ты, rejectedAtClientNotif == null')
    //             let rejObj = {
    //               tenderId: change.doc.data().tenderId,
    //               driverId: change.doc.data().userId,
    //               name: change.doc.data().name,
    //               docId: change.doc.id,
    //               read: false
    //             }
    //             rejectByClientArr.push(rejObj)
    //           }
    //         }
    //         //----------------------------------------------
    //         //______________прослушка своих ставок____________________
    //         //для получения оповещаний на свои ставки при сменe роли 
    //         if(change.doc.data().userId == uid && change.doc.data().clientId == uid) {
    //           //3 modified---------------водитель отклонил предложение выполнять заказ----------------
    //           if(change.doc.data().rejectedByDriverAt !== null && change.doc.data().rejectedAt == null) {
    //             if(rejectedByDrNotif !== null) {
    //               let filteredRejObj = rejectedByDrNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //               elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //               console.log('filteredRejObj', filteredRejObj)
    //               if(filteredRejObj == undefined) {
    //                 console.log('3 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredRejObj == undefined')
    //                 let rejObj = {
    //                   tenderId: change.doc.data().tenderId,
    //                   driverId: change.doc.data().userId,
    //                   name: change.doc.data().name,
    //                   docId: change.doc.id,
    //                   read: false
    //                 }
    //                 rejectByDrArr.push(rejObj)
    //               }
    //               //стейт пустой добавляем все отмененные ставки
    //             } else if(rejectedByDrNotif == null){
    //               console.log('3 modified- стейт пустой - добавляем все эл-ты, rejectedByDriverNotif == null')
    //               let rejObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 driverId: change.doc.data().userId,
    //                 name: change.doc.data().name,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               rejectByDrArr.push(rejObj)
    //             }
    //           }
    //           //4 modified---------------заказ принят к выполнению водителем---------------- 
    //           if(change.doc.data().acceptedByDriverAt !== null && change.doc.data().rejectedByDriverAt == null && change.doc.data().rejectedAt == null) {
    //             if(acceptedByDrNotif !== null) {
    //               let filteredAcceptObj = acceptedByDrNotif.find(elemFind => elemFind.tenderId == change.doc.data().tenderId && 
    //               elemFind.userId == change.doc.data().userId && elemFind.docId == change.doc.id)
    //               console.log('filteredAcceptObj', filteredAcceptObj)
    //               if(filteredAcceptObj == undefined) {
    //                 console.log('4 modified- стейт не пустой - найден новый эл-т, добавляем его, filteredAcceptObj == undefined')
    //                 let acceptObj = {
    //                   tenderId: change.doc.data().tenderId,
    //                   name: change.doc.data().name,
    //                   driverId: change.doc.data().userId,
    //                   docId: change.doc.id,
    //                   read: false
    //                 }
    //                 acceptByDrArr.push(acceptObj)
    //               }
    //             } else if(acceptedByDrNotif == null){
    //               console.log('4 modified- стейт пустой - добавляем все эл-ты, acceptedByDrNotif == null')
    //               let acceptObj = {
    //                 tenderId: change.doc.data().tenderId,
    //                 name: change.doc.data().name,
    //                 driverId: change.doc.data().userId,
    //                 docId: change.doc.id,
    //                 read: false
    //               }
    //               acceptByDrArr.push(acceptObj)
    //             }
    //           }
    //         }
    //       }
    //     })

    //     console.log('ставка принята клиентом pickCandidateAtArr', pickCandidateAtArr)
    //     if(pickCandidateAtArr.length > 0) {
    //       dispatch(onPickCandidateState(pickCandidateAtArr))
    //       dispatch(onPickCandidateCounter({newNotif: pickCandidateAtArr.length+pickCandidateCounterNotif.newNotif}))
    //     }
  
    //     console.log('ставка отменена клиентом rejectByClientArr', rejectByClientArr)
    //     if(rejectByClientArr.length > 0) {
    //       dispatch(onRejectedAtClientState(rejectByClientArr))
    //       dispatch(onRejectedAtClientCounter({newNotif: rejectByClientArr.length+rejectedAtClientCounterNotif.newNotif}))
    //     }

    //     //водитель прослушка - только для своих ставок на которые есть действия
    //     console.log('**водитель прослушка - только для своих ставок на которые есть действия - отмененные ставкиrejectByDrArr', rejectByDrArr)
    //     if(rejectByDrArr.length > 0) {
    //       dispatch(onRejectByDr(rejectByDrArr))
    //       dispatch(onRejectByDrCounter({newNotif: rejectByDrArr.length+rejectedByDrCounterNotif.newNotif}))
    //     }

    //     console.log('**водитель прослушка - только1 для своих ставок на которые есть действия - принятые ставки acceptByDrArr', acceptByDrArr)
    //     if(acceptByDrArr.length > 0) {
    //       dispatch(onAcceptedByDr(acceptByDrArr))
    //       dispatch(onAcceptedByDrCounter({newNotif: acceptByDrArr.length+acceptedByDrCounterNotif.newNotif}))
    //     }
    //   })
    //   : 
    //   () => {}
    //   return () => {
    //     console.log('\x1b[44m%s %s\x1b[0m', 'driver TN repliesRef return unsubscribe',)
    //     unsubscribe()
    //   }
    // },[role])

    //!!!!!!!!!!!!!!!!!! /*TendersScreen*/
    
  // const getTendersFromDriver = async (elem,flag) => {
  //   console.log('elem', elem)
  //   let tenderId = null
  //   await firestore().collection('tenders')
  //   .doc(elem)
  //   .get()
  //   .then(documentSnapshot => {
  //     console.log('getTendersFromDriver: documentSnapshot.id', documentSnapshot.id, 'elem', elem)
  //     if(flag=='work' && documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId !== null 
  //     && documentSnapshot.data().hasOwnProperty('finishedAt') && documentSnapshot.data().finishedAt === null) {
  //       tenderId = documentSnapshot.id
  //     } else if(flag=='waitTn' && documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId === null 
  //     && documentSnapshot.data().hasOwnProperty('finishedAt') && documentSnapshot.data().finishedAt === null) {
  //       tenderId = documentSnapshot.id
  //     }
  //   })
  //   return {tenderId}
  //   // .then((querySnapshot) => {
            
  //   //   console.log('uniqueIdMsgTender Promise querySnapshot \n', querySnapshot.size)
  //   //   let odjWorkTender = null
  //   //   querySnapshot.forEach(documentSnapshot => {
  //   //     // console.log('querySnapshot Tender: ', documentSnapshot.id)
        
  //   //       //потом включить
  //   //       if(documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId !== null && documentSnapshot.data().hasOwnProperty('finishedAt') && documentSnapshot.data().finishedAt === null) {
  //   //         // console.log('!!!!!!!!', documentSnapshot.data())
  //   //         //значек заявок в работе для водителя
  //   //         odjWorkTender=documentSnapshot.id
  //   //       }
  //   //   })
  //   //   console.log('odjWorkTender:', odjWorkTender)
  //   //   return odjWorkTender

  //   //   console.log('arrayWork', arrayWork)
  //   // })

  // }
// const getDriverCountTender = async() => {
//   const arrayWork = await Promise.all(uniqueIdMsgTender.map(elem => getTendersFromDriver(elem,'work')))
//   const arrayWaitTender = await Promise.all(uniqueIdMsgTender.map(elem => getTendersFromDriver(elem,'waitTn')))
//   // console.log('arrayWork', arrayWork)
//   let newArrWorkT = arrayWork.filter(elem => elem.tenderId !== null)
//   let newArrWaitT = arrayWaitTender.filter(elem => elem.tenderId !== null)
//   console.log('newArrWorkT', newArrWorkT)
//   // let arrMsgCountWorkTen = sortArrMsg(msgState,newArrWorkT)
//   // let arrMsgCountWaitTen = sortArrMsg(msgState,newArrWaitT)

//   // console.log('arrMsgCountWorkTen', arrMsgCountWorkTen)
//   // console.log('arrMsgCountWaitTen', arrMsgCountWaitTen)
//   // setWorkTenderMsg(arrMsgCountWorkTen)
//   // setMyTenderMsg(arrMsgCountWaitTen)
//   setWorkTenderCount(newArrWorkT)
//   setMyTenderCount(newArrWaitT)
// }


// const searchAdress = (value) => {
//   // console.log('searchAdress text', text,input,isEdit,isEditItem);
//   // if(!text) alert('Нажмите на поле ввода, введие адрес и выберите из списка')
//   // // console.log('1111', coordinatesTo.length, coordinatesFrom.length)
//   // if(coordinatesTo.length + coordinatesFrom.length == 10) {
//   //   alert('Можно добавить не более 10 адресов')
//   //   return
//   // }
//   // if(input === 'addressFrom' && coordinatesTo.length < 1 && coordinatesTo.length + coordinatesFrom.length == 9) {
//   //   alert('Введите минимум по одному адресу загрузки и выгрузки')
//   //   return
//   // }
//   // if(input === 'addressTo' && coordinatesFrom.length < 1 && coordinatesTo.length + coordinatesFrom.length == 9) {
//   //   alert('Введите минимум по одному адресу загрузки и выгрузки')
//   //   return
//   // }
//   setCurrAddressPosition(value)
//   mapViewRef.current?.animateToRegion({
//     latitude: value.latitude,
//     longitude: value.longitude,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.04,
//   }, 500)
//   // if(text && text !== undefined) {

//   //   Geocoder.from(text).then(json => {
//   //     const addressComponent = json.results[0].geometry.location
//   //     // console.log('searchAdress results, json', addressComponent);

//   //     const newMarkerItem = {
//   //       latitude: addressComponent.lat,
//   //       longitude: addressComponent.lng,
//   //       address: text
//   //     }
//   //     setCurrAddressPosition(newMarkerItem)
//   //     goTocoords(mapViewRef,[{latitude: addressComponent.lat,longitude:addressComponent.lng}])

//   //     console.log('addressComponent', addressComponent);
//   //   }).catch(error => {
//   //       console.log(error)
//   //   });
//   // }
// }

// // const getTender = async () => {
// //   setIsLoading(true)
  
// //   try {
// //     if(role == 'driver') {
// //     firestore().collection('messages')
// //       .where('createdAt', '>' , timestMonth)
// //       .where('userId', '==' , uid) //и роль должна быть водитель
// //       .where('userRole', '==' , 'driver')
// //       .get()
// //       .then(querySnapshot => {
// //         console.log('querySnapshot getChatTender size:', querySnapshot.size)
// //         let arrOfUid = []
// //         if(querySnapshot.size>0){

// //           querySnapshot.forEach(documentSnapshot => {
// //             // console.log('documentSnapshot', documentSnapshot.data())
            
// //             arrOfUid.push(documentSnapshot.data().tenderId)
// //             // if(documentSnapshot.data()?.userRole == 'driver') {
// //             //   // console.log('arrOfUid push',  documentSnapshot.id, documentSnapshot.data().text)
// //             // }
// //           })
// //         }
// //         const uniqueUid = unique(arrOfUid)
// //         console.log('uniqueUid', uniqueUid)
// //         setUniqueIdMsgTender(uniqueUid)
// //       })
// //       // console.log('getTender driver-role uniqueUid:', uniqueUid)
// //       // // setMyTenderCount(uniqueUid)
// //       // //для в работе
// //       // // setWorkTenderCount()

// //       //для заявок в работе
// //       // firestore().collection('tenders')
// //       // .where('driverId', '==', uid)
// //       // .where('createdAt', '>', timestMonth)
// //       // .get()
// //       // .then((querySnapshot) => {
        
// //       //   console.log('querySnapshot \n', querySnapshot.size)
// //       //   let odjWorkTender = []
// //       //   querySnapshot.forEach(documentSnapshot => {
// //       //     // console.log('querySnapshot Tender: ', documentSnapshot.id)
// //       //     let createdAt = documentSnapshot.data().createdAt.toMillis()
          
// //       //     if(createdAt > timest) {
// //       //       //потом включить
// //       //       if(documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId !== null && documentSnapshot.data().finishedAt === null) {
// //       //         // console.log('!!!!!!!!', documentSnapshot.data())
// //       //         //значек заявок в работе для водителя
// //       //         odjWorkTender.push(documentSnapshot.id)
// //       //       }
// //       //     }
// //       //   })
// //       //   console.log('odjWorkTender:', odjWorkTender)
// //       //   setWorkTenderCount(odjWorkTender)
// //       //   setIsLoading(false)
// //       // })

// //     } else {
// //       //роль клиент
// //       // .where('createdAt', '>', timest) для проверки сортировки
// //       firestore().collection('tenders')
// //       .where('userId', '==', uid)
// //       .get()
// //       .then((querySnapshot) => {
        
// //         // console.log('querySnapshot \n', querySnapshot.size)
// //         let odjTender = []
// //         let odjWorkTender = []
// //         querySnapshot.forEach(documentSnapshot => {
// //           // console.log('querySnapshot Tender: ', documentSnapshot.id)
// //           let createdAt = documentSnapshot.data().createdAt.toMillis()
          
// //           if(createdAt > timest) {
// //             //потом включить
// //             if(documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId !== null && documentSnapshot.data().finishedAt === null) {
// //               // console.log('!!!!!!!!', documentSnapshot.data())
// //               //значек заявок в работе для клиента
// //               odjWorkTender.push(documentSnapshot.id)
// //             }

// //             if(documentSnapshot.data().hasOwnProperty('driverId') && documentSnapshot.data().driverId !== null) {
// //               //если есть поле driverId и оно не null то не добавляем  заявку
// //               // console.log('id 1', documentSnapshot.data().driverId)
// //               return
// //             } else if(documentSnapshot.data().hasOwnProperty('finishedAt') && documentSnapshot.data().finishedAt !== null) {
// //               // console.log('id 2', documentSnapshot.data().finishedAt)
// //               return 
// //             }  else {
// //               console.log('tender: ', documentSnapshot.id)            
// //               // let tenderDocument = {
// //               //   data: documentSnapshot.data(),
// //               //   id: documentSnapshot.id,
// //               // }
// //               odjTender.push(documentSnapshot.id)
// //             }
// //           }
// //         })
// //         // console.log('odjTender:', odjTender)
// //         // console.log('odjWorkTender:', odjWorkTender)

// //         setMyTenderCount(odjTender)
// //         setWorkTenderCount(odjWorkTender)
// //         setIsLoading(null)
// //         // odjTender.length === 0 ? setIsLoading(false) : null
// //       })
// //     }
    
// //   } catch (error) {
// //     setIsLoading(false)
// //     console.log('err', error);
// //   }
// // }
// const sortMsg = () => {
//   console.log('sortMsg started', )
//   if(role==='client') {
//     let arrMyTenderMsg = []
//     let arrWorkTenderMsg = []

//     // console.log('mytenderCount', mytenderCount)
//     // console.log('workTenderCount', workTenderCount)
//     msgState!==null&&msgState.forEach((elem)=>{
//       // console.log('elem', elem)
//       //mytenderCount - id тендеров
//       let mitem = mytenderCount&&mytenderCount.find(item=>item == elem.tenderId)
//       let witem = workTenderCount&&workTenderCount.find(item=>item == elem.tenderId)
//       // console.log('mitem', mitem)
//       // console.log('witem', witem)
//       if(mitem!==undefined) {
//         arrMyTenderMsg.push(elem)
//       }
//       if(witem!==undefined) {
//         arrWorkTenderMsg.push(elem)
//       }
//       // console.log('arrMyTenderMsg', arrMyTenderMsg)
//       // console.log('arrWorkTenderMsg', arrWorkTenderMsg)
//     })

//     setMyTenderMsg(arrMyTenderMsg.length)
//     setWorkTenderMsg(arrWorkTenderMsg.length)

//   } else {
//     let arrMsgCountWorkTen = sortArrMsg(msgState,workTenderCount)
//     let arrMsgCountWaitTen = sortArrMsg(msgState,mytenderCount)
//     setWorkTenderMsg(arrMsgCountWorkTen)
//     setMyTenderMsg(arrMsgCountWaitTen)
//   }
// }

      {/* {
        role == 'client' ?
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Notification')}>
          <Icon name="bell" size={26} color={notifColor} style={styles.qwe}/>
            {
              counter > 0 ?
              <View style={styles.counterWrap}>
                {
                  counter > 99 ?
                  <>
                    <Text style={styles.counterText}>99</Text><Text style={styles.counterText}>+</Text>
                  </>
                  :
                  <Text style={styles.counterText}>{counter}</Text>
                }
              </View>
              :
              null
          }
        </TouchableOpacity>
        : null
      } */}

  // useEffect(()=>{
  //   getMsg()
  // },[mytenderCount,workTenderCount])

  // useEffect(()=>{
  //   console.log('mytenderMsg', mytenderMsg)
  //   console.log('workTenderMsg', workTenderMsg)
  // },[workTenderMsg,mytenderMsg])

  //только обновление при ререндере экрана
  // const searchMsg = async (elem) => {
  //   let allmsg = 0
  //   try {
  //     await firestore().collection('messages')
  //     .where('tenderId','==', elem)
  //     .where('read','==', false)
  //     .where('partnerRole','==', 'client')
  //     .where('partnerId','==', uid)
  //     .get()
  //     .then(querySnapshot => { 
  //       // let repl = {}
  //       // console.log('searchMsg querySnapshot:', querySnapshot.empty, querySnapshot.size)
  //       // if(querySnapshot.empty) {

  //       // }
  //       if(querySnapshot.size > 0) {
  //         allmsg = querySnapshot.size
  //         // let querySnCount = querySnapshot.size
  //         // repl = {
  //         //   replCount: querySnapshot.size,
  //         //   tenderId: elem.id
  //         // }
  //         // console.log('repl', repl)
  //         //  repl = {replCount: querySnapshot.size, tenderId: elem.id}
  //         // querySnapshot.forEach(documentSnapshot => {
  //         //   // console.log('documentSnapshot.id:', documentSnapshot.id)
  //         //   //в ставке проверяем id водителя и заявки
  //         //   if(blackListArr?.length > 0) {
  //         //     // console.log('1', )
  //         //     blackListArr.find(findItem => {
  //         //       // console.log('2 ', findItem.tenderId === documentSnapshot.data().tenderId)
  //         //       if(findItem.tenderId === documentSnapshot.data().tenderId&&findItem.userId===documentSnapshot.data().userId) {
  //         //         // console.log('repl.replCount', repl.replCount)
  //         //         repl.replCount = repl.replCount-1
  //         //       }
  //         //       // console.log('blackListUser findItem:', findItem, findItem.tenderId === documentSnapshot.id && findItem.userId === documentSnapshot.data().userId)
  //         //     })

  //         //   }
  //         // })
  //       }
  //       // console.log('repl:', repl)
  //       // allRepl.push(repl)
  //       // const newArr = dataTender.map(elem => {
  //         //   let fnItem = repl.find(item => elem.id === item.tenderId)
  //         //   fnItem === true ? elem.repl = 
  //         // })
  //         // setIsLoading(false)

  //       })
  //       return allmsg
      
  //   } catch (error) {
  //     console.log('err', error);
  //   }
  // }
  // const getMsg = async() => {
  //   if(mytenderCount!==null){
  //     const myTenderArray = await Promise.all(mytenderCount.map(elem => searchMsg(elem)))
  //     // console.log('myTenderArray', myTenderArray)
  //     if(mytenderMsg!=myTenderArray){
  //       let newMsMyTnd = myTenderArray.reduce((x,y) => x+y, 0)
  //       setMyTenderMsg(newMsMyTnd)
  //     }
  //   }
  //   if(workTenderCount!==null) {
  //     const workTenderArray = await Promise.all(workTenderCount.map(elem => searchMsg(elem)))
  //     // console.log('workTenderArray', workTenderArray)
  //     //новое значение не равно старому
  //     if(workTenderMsg!=workTenderArray){
  //       let newMsWorkTnd = workTenderArray.reduce((x,y) => x+y, 0)
  //       setWorkTenderMsg(newMsWorkTnd)
  //     }
  //   }
  // }

// !!!! tenders.js

  //отклонить предложение выполнить заказ - ФУН-Я УБРАНА
  // export async function onRejectTender(screen, currBetInfo, setCurrBetsArr, setCurrBetInfo, setCurrBet){
  //   // очистить: инфо ставки currBetInfo(null), массив ставок currBetsArr([]), currBet(false)
  //   console.log('onRejectTender', currBetInfo, screen)
  //   let notifObj = {
  //     createdAtServer: firestore.FieldValue.serverTimestamp(),
  //     type: "rejectByDriverOffer",
  //     tenderName: currBetInfo.data.name,
  //     tenderId: currBetInfo.data.tenderId,
  //     // userName: currBetInfo.data.clientName,
  //     toUser: currBetInfo.data.clientId,
  //     fromUserName: currBetInfo.data.driverName,
  //     fromUser: currBetInfo.data.userId,
  //     userId: currBetInfo.data.userId,
  //     data: {
  //       dataExist: 'yes',
  //       type: 'chat',
  //       tenderName: currBetInfo.data.name,
  //       tenderId: currBetInfo.data.tenderId,
  //       clientId: currBetInfo.data.clientId,
  //       userId: currBetInfo.data.userId,
  //     }
  //   }
  //   try {
  //     await firestore()
  //     .collection('replies')
  //     .doc(currBetInfo.id)
  //     .update({
  //       'rejectedByDriverAt': firestore.FieldValue.serverTimestamp()
  //     }).then(() => {
  //       //свой id в заявку для рассылки массового пуша
  //       firestore()
  //       .collection('tenders')
  //       .doc(currBetInfo.data.tenderId)
  //       .update({
  //         'usersIdWithBet': firestore.FieldValue.arrayRemove(currBetInfo.data.userId)
  //       })
  //       createNotification(notifObj)
  //       alert(`Вы отказались от предложения выполнить заказ`)
  //       if(screen == 'tender') {
  //         setCurrBetsArr([])
  //         setCurrBetInfo(null)
  //         setCurrBet(false)
  //       }
  //     })
  //   } catch (error) {
  //     console.log('Ошибка', error)
  //     alert(`Ошибка \n${JSON.stringify(error)}`)
  //   }
  // }

  //---клиент---
  //выбрать исполнителем - ФУН-Я УБРАНА
  // export async function onSelectBetDriver(screen, item, betState, driverInfo, setAwaitPickBet, setDriverInfo){
  //   console.log('onSelectBetDriver item', screen, item,)
  //   const id = screen == 'tender' ? item.item.bet.id : item
  //   console.log('\x1b[44m%s %s\x1b[0m', 'id', id)

  //   const notifObj = {
  //     // createdAt: dateCreare,
  //     createdAtServer: firestore.FieldValue.serverTimestamp(),
  //     type: "pickCandidate",
  //     tenderName: betState.data.name,
  //     tenderId: betState.data.tenderId,
  //     userName: betState.data.driverName,
  //     toUser: betState.data.userId,
  //     fromUserName: betState.data.clientName,
  //     fromUser: betState.data.clientId,
  //     userId: betState.data.clientId,
  //     data: {
  //       dataExist: 'yes',
  //       type: 'tender',
  //       fn: 'onSelectBetDriver',
  //       navTo: 'TenderItem',
  //       tenderId: betState.data.tenderId
  //     }
  //   }
  //   console.log('notifObj', notifObj)

  //   try {
  //     await firestore()
  //     .collection('replies')
  //     .doc(id)
  //     .update({
  //       'pickCandidateAt': firestore.FieldValue.serverTimestamp()
  //     })
  //     .then((res) => {
  //       alert('Кандидат выбран, ожидайте ответа от кандидата')
  //       console.log('res', res)

  //       //Пуш
  //       createNotification(notifObj)

  //       // if(screen == 'tender') {
  //       //   const res = driverInfo.filter(elem => elem.bet.id == id)
  //       //   // console.log('293 res', res, 'driverInfo', driverInfo)
  //       //   setAwaitPickBet(true)
  //       //   setDriverInfo(res)
  //       // }
  //     })
  //   } catch (error) {
  //     console.log('onSelectBetDriver err', error)
  //     alert(JSON.parse(error))
  //   }
  // }

  //отклонить ставку водителя - ФУН-Я УБРАНА
  // export async function onRejectBetDriver(screen, item, driverInfo, setDriverInfo, onCloseDriverInfo) {
  //   console.log('onRejectBetDriver item', screen, item)
  //   const id = screen == 'tender' ? item.item.bet.id : item
  //   console.log( 'id', id)

  //   try {
  //     await firestore()
  //     .collection('replies')
  //     .doc(id)
  //     .update({
  //       'rejectedAt': firestore.FieldValue.serverTimestamp()
  //     })
  //     .then(() => {
  //       if(screen == 'tender') {
  //         alert('Ставка отклонена')
  //         //убираем ставку этого кандидата из массива(проверить все в апк новом)
  //         const res = driverInfo.filter(elem => elem.bet.id !== item.item.bet.id)
  //         console.log('res', res)
  //         setDriverInfo(res)
  //         //закрывать окно этой ставки
  //         onCloseDriverInfo()
  //       }
  //     })
  //   } catch (error) {
  //     console.log('onRejectBetDriver', error)
  //     alert(toString(error))
  //   }
  // } 



  //------------------------
  //заявка в работе

  //водитель: прибыл на место - ФУН-Я УБРАНА
  // export async function sendingPosition(
  //   toggleCheckBox, 
  //   firebeseUpdateTender, 
  //   tenderId, 
  //   setTreckPosition, 
  //   dispatch, 
  //   setTenderRefresh, 
  //   onSendPosition, 
  //   watchId,
  //   Geolocation, 
  //   uid, 
  //   tnRefresh,
  //   tenderName,
  //   clientId,
  //   clientName,
  //   driverName
  //   ) {
  //   console.log('sendingPosition', "Прибыл для выполнения заказа",
  //     tenderName,
  //     clientId,
  //     clientName,
  //     driverName
  //   )
  //   const sd = new Date()
  //   const dateCreare = sd.getDate() + '.' + (sd.getDate()<=9? sd.getMonth()+1:'0'+(sd.getMonth()+1)) + '.' + sd.getFullYear() + ' ' + sd.getHours() +':'+sd.getMinutes()

  //   let notifObj = {
  //     createdAt: dateCreare,
  //     createdAtServer: firestore.FieldValue.serverTimestamp(),
  //     type: "orderStarted",
  //     tenderName: tenderName,
  //     tenderId: tenderId,
  //     userName: clientName,
  //     toUser: clientId,
  //     fromUserName: driverName,
  //     fromUser: uid,
  //     userId: uid,
  //     data: {
  //       dataExist: 'yes',
  //       type: 'work',
  //       fn: 'sendingPosition',
  //       navTo: 'TenderWorkItem',
  //       tenderId: tenderId
  //     }
  //   }
  //   let orderObj = {
  //     orderStartedAt: firestore.FieldValue.serverTimestamp(),
  //     isTracking: true
  //   }
  //   if(toggleCheckBox == false) {
  //     orderObj.isTracking = false
  //   }
  //   console.log('orderObj', orderObj)
  //   console.log('notifObj', notifObj)

  //   firebeseUpdateTender(tenderId, orderObj)
  //   //Пуш
  //   createNotification(notifObj)
  //   //меняем treckPosition на false - что бы показать кнопку 2
  //   setTreckPosition(true)

  //   if(toggleCheckBox == true) {
  //     //в стейт переменную - если будет выход из приложения то отображать кнопку возобновить движение
  //     dispatch(setTenderRefresh(true))
  //     onSendPosition('', watchId, Geolocation, uid, dispatch, setTenderRefresh, tnRefresh)
  //     // setIsTrackDr(true)
  //   }
  // }

  //водитель: начать выполнение заказа - ФУН-Я УБРАНА
  // export async function startingExecuteDelivery(tenderId, firebeseUpdateTender, setStartExecute,tenderName,clientId,driverName,uid) {
  //   console.log('startingExecuteDelivery', "Начать выполнение заказа")
  //   let objSt = {start: true}
  //   const sd = new Date()
  //   const dateCreare = sd.getDate() + '.' + (sd.getDate()<=9? sd.getMonth()+1:'0'+(sd.getMonth()+1)) + '.' + sd.getFullYear() + ' ' + sd.getHours() +':'+sd.getMinutes()

  //   let notifObj = {
  //     createdAt: dateCreare,
  //     createdAtServer: firestore.FieldValue.serverTimestamp(),
  //     type: "orderStartedMoving",
  //     tenderName: tenderName,
  //     fromUserName: driverName,
  //     toUser: clientId,
  //     fromUser: uid,
  //     userId: uid,
  //     data: {
  //       dataExist: 'yes',
  //       type: 'work',
  //       fn: 'startingExecuteDelivery',
  //       navTo: 'TenderWorkItem',
  //       tenderId: tenderId
  //     }
  //     // userName: clientName,
  //     // tenderId: tenderId,
  //   }
      
  //   firebeseUpdateTender(tenderId, objSt)
  //   setStartExecute(true)
  //   createNotification(notifObj)
  //   //меняем startExecute на true что бы показать что заказ уже выполняется(доступна кнопка Завершить выполнение заказа)
  // }

  //водитель: запуск записи координат(если был релог, по кнопке) - ФУН-Я УБРАНА
  // export async function onSendPosition(needRefresh, watchId, Geolocation, uid, dispatch, setTenderRefresh, tnRefresh) {
  //   console.log('sendPosition start', needRefresh, watchId, uid, tnRefresh)
  //   if(tnRefresh === false) {
  //     if(needRefresh == 'refresh') {
  //       dispatch(setTenderRefresh(true))
  //     }
  //     watchId.current = await Geolocation.watchPosition(
  //       (position) => {
  //         console.log('position', position);
  //         firestore().collection('positions').doc(uid).set(position)
  //         // .then((result) => {
  //           // console.log('result', result)
  //         // })
  //       },
  //       (error) => {
  //         console.log('watchPosition  error.message:', error)
  //       },
  //       {enableHighAccuracy: true, distanceFilter: 0, interval: 60000, fastestInterval: 60000},
  //     )
  //   }
  // }

  //водитель и клиент: завершить выполнение заказа - ФУН-Я УБРАНА
  // export async function endExecuteDelivery(
  //   role, 
  //   dispatch, 
  //   setTenderRefresh, 
  //   setIsFinish, 
  //   stopWatch, 
  //   firebeseUpdateTender, 
  //   tenderId,
  //   setShowClientBtn,
  //   setDisableBtn,
  //   setIsDriverStart,
  //   setIsVisibleModalFeedBack,
  //   uid,
  //   clientId,
  //   tenderName,
  //   driverName,
  //   clientName
  //   ) {
  //   console.log('endExecuteDelivery', 'Завершить выполнение')

  //   //только водитель
  //   const sd = new Date()
  //   const dateCreare = sd.getDate() + '.' + (sd.getDate()<=9? sd.getMonth()+1:'0'+(sd.getMonth()+1)) + '.' + sd.getFullYear() + ' ' + sd.getHours() +':'+sd.getMinutes()

  //   let objSend = {}
  //   if(role == 'driver') {
  //     //проверять если был tracking true то чистить стейт отключать фун-ию геопозиции
      
  //     dispatch(setTenderRefresh(false))
  //     // setIsTrackDr(false)
  //     setIsFinish(true)
  //     stopWatch()
  //     //ждем пока клиент подтвердит( в заявку пишем допусим {'endExecuteDelivery.driver': true})
  //     //клиент в ответ {'endExecuteDelivery.client': true}
  //     objSend = {'endExecuteDelivery.driver': true} //- при отправке отзыва записывать в базу
  //     firebeseUpdateTender(tenderId, objSend) //- при отправке отзыва записывать в базу

  //     // Пуш
  //     const notifObj = {
  //       createdAt: dateCreare,
  //       createdAtServer: firestore.FieldValue.serverTimestamp(),
  //       type: "orderCompleted",
  //       tenderName: tenderName,
  //       tenderId: tenderId,
  //       userName: "",
  //       toUser: clientId,
  //       fromUserName: driverName,
  //       fromUser: uid,
  //       userId: uid,
  //       data: {
  //         dataExist: 'yes',
  //         type: 'work',
  //         fn: 'endExecuteDelivery',
  //         navTo: 'TenderWorkItem',
  //         tenderId: tenderId
  //       }
  //     }
  //     console.log('notifObj', notifObj)
  //     createNotification(notifObj)
  //   } else {
  //     // console.log('endExecuteDelivery')
  //     objSend = {'endExecuteDelivery.client': true}
  //     const res = firebeseUpdateTender(tenderId, objSend)
      
  //     // Пуш
  //     let notif = {
  //       createdAt: dateCreare,
  //       createdAtServer: firestore.FieldValue.serverTimestamp(),
  //       type: "orderCompletedClient",
  //       tenderName: tenderName,
  //       tenderId: tenderId,
  //       userName: "",
  //       toUser: uid,
  //       // fromUserName: driverName,
  //       fromUser: clientId,
  //       userId: clientId,
  //       data: {
  //         dataExist: 'yes',
  //         type: 'work',
  //         fn: 'endExecuteDelivery',
  //         navTo: 'TenderWorkItem',
  //         tenderId: tenderId
  //       }
  //     }
  //     createNotification(notif)

  //     // обрабатывать ошибку firebeseUpdateTender
  //     setShowClientBtn(false)
  //     setDisableBtn(false)
  //     setIsDriverStart(false)
  //     if (res == 'error') {
  //       console.log('error res endExecuteDelivery', res)
  //     } else setIsVisibleModalFeedBack(true)

  //   }
  // }

  // - ФУН-Я УБРАНА
  // export async function sendMessageHello(role, tenderId, tenderName, uid, uid2, messageIdGenerator,clientName,driverName){
  //   console.log('sendMessage start', role, tenderId, tenderName, uid, uid2,)

  //   const partnerRole = role == 'driver' ? 'client' : 'driver'
  //   let notifObj
  //   const msgObj = {
  //     _id: messageIdGenerator(),//рандомный id
  //     createdAt: firestore.FieldValue.serverTimestamp(),
  //     id: null, //id документа - 
  //     partnerId: uid2, //id клиента/водителя
  //     read: false,
  //     replyId: null, //заполнять если сделана ставка и есть сообщение в ставке
  //     tenderId: tenderId,
  //     text: "Привет!",
  //     userId: uid, // id отправителя сообщения
  //     userRole: role,
  //     partnerRole: partnerRole,
  //   }
  //   console.log('msgObj', msgObj)
  //   if(role == 'client') {
  //     //проверяем есть ли сообщ от клиента водителю
  //     //проверяем есть ли сообщ от водителя клиенту
  //     //отправляем 
  //     try {
  //       await firestore()
  //       .collection('messages')
  //       .where('tenderId', '==', tenderId)
  //       .where('userId', '==', uid)
  //       .where('partnerId', '==', uid2)
  //       .where('userRole', '==', 'client')
  //       .get()
  //       .then(querySnapshot=>{
  //         if(querySnapshot.empty) {
  //             console.log('1 sendMessageHello client querySnapshot.empty', querySnapshot.empty)
  //             firestore()
  //             .collection('messages')
  //             .where('tenderId', '==', tenderId)
  //             .where('partnerId', '==', uid)
  //             .where('userId', '==', uid2)
  //             .where('userRole', '==', 'driver')
  //             .get()
  //             .then(querySnapshot=>{
  //               if(querySnapshot.empty) {
  //                 console.log('2 sendMessageHello client querySnapshot.empty', querySnapshot.empty)
  //                 //пуш
  //                 notifObj = {
  //                   // createdAt: dateCreare,
  //                   createdAtServer: firestore.FieldValue.serverTimestamp(),
  //                   type: "newMessageInChat",
  //                   tenderName: tenderName,
  //                   tenderId: tenderId,
  //                   userName: driverName,
  //                   toUser: uid2,
  //                   fromUserName: clientName,
  //                   fromUser: uid,
  //                   userId: uid,
  //                   message:  'Привет',
  //                   data: {
  //                     dataExist: 'yes',
  //                     type: 'chat',
  //                     tenderName: tenderName,
  //                     tenderId: tenderId,
  //                     clientId: uid,
  //                     userId: uid2,
  //                   }
  //                 }
  //                 createNotification(notifObj)
  //                 firestore()
  //                 .collection('messages')
  //                 .add(msgObj).then(() => {
  //                   console.log('messages Hello send successfully!');
                    
  //                 }).catch(e => console.log('messages Hello error:', e))
  //               }
  //             })
  //           }
  //         })
  //     } catch (error) {
  //       console.log('messages Hello send err:', error)
  //     }
  //   } else if(role == 'driver') {
  //     try {
  //       await firestore()
  //       .collection('messages')
  //       .where('tenderId', '==', tenderId)
  //       .where('userId', '==', uid)
  //       .where('partnerId', '==', uid2)
  //       .where('userRole', '==', 'driver')
  //       .get()
  //       .then(querySnapshot=>{
  //         if(querySnapshot.empty) {
  //             console.log('1 sendMessageHello driver querySnapshot.empty', querySnapshot.empty)
  //             firestore()
  //             .collection('messages')
  //             .where('tenderId', '==', tenderId)
  //             .where('partnerId', '==', uid)
  //             .where('userId', '==', uid2)
  //             .where('userRole', '==', 'client')
  //             .get()
  //             .then(querySnapshot=>{
  //               if(querySnapshot.empty) {
  //                 console.log('2 sendMessageHello driver querySnapshot.empty', querySnapshot.empty)
  //                 firestore()
  //                 .collection('messages')
  //                 .add(msgObj).then(() => {
  //                   console.log('messages Hello send successfully!');
  //                   //пуш
  //                   notifObj = {
  //                     // createdAt: dateCreare,
  //                     createdAtServer: firestore.FieldValue.serverTimestamp(),
  //                     type: "newMessageInChat",
  //                     tenderName: tenderName,
  //                     tenderId: tenderId,
  //                     userName: clientName,
  //                     toUser: uid2,
  //                     fromUserName: driverName,
  //                     fromUser: uid,
  //                     userId: uid,
  //                     message:  'Привет',
  //                     data: {
  //                       dataExist: 'yes',
  //                       type: 'chat',
  //                       tenderName: tenderName,
  //                       tenderId: tenderId,
  //                       clientId: uid2,
  //                       userId: uid,
  //                     }
  //                   }
  //                   createNotification(notifObj)
  //                 }).catch(e => console.log('messages Hello error:', e))
  //                 }
  //             })
  //           }
  //         })
  //     } catch (error) {
  //       console.log('messages Hello send err:', error)
  //     }
  //   }
  // }


  //!transport screen

  
// const deletePhotoUrl = async () => {
//   const firbaseRef = firestore().collection('cars').doc(route.params.transportInfo.id)
//   if(checkStorePhotoUrl === false) return
  //перебор массива и удаление каждой ссылки из хранилища, если элемент удален то флаг checkDelUrl - true
  //если элемент не удален/ошибка - checkDelUrl - false, return
  //checkDelUrl === true - удаляем ссылки из photos, док-та транспорта
  //удаляем ссылки на фото из redux слайса
  //флаг checkStorePhotoUrl в false  -нет фото для удаления

//   console.log('0+');
//   let codeErr = []
//   //массив с удаленными из хранилища файлами
  
//   const promise1 = new Promise((resolve, reject) => {
//     let newArr = []
//     photosStateUrl.forEach((elem) => {
//       let imageRef =  storage().refFromURL(elem)
//       imageRef.delete().then(() => {
//         console.log("Deleted!")
//         newArr.push(elem)
//         let qwe1 = []
//         qwe1.push(elem)
//         // console.log('qwe1', qwe1);
//         firbaseRef.update({
//           photos: firestore.FieldValue.arrayRemove(...qwe1)
//         })
//       }).catch(error => {
//         //если ошибка удаления фото  -
//         if(error.code == 'storage/object-not-found') {
//           //файл уже удален из хранилица - просто чистить ссылку в документе
//           // checkDelUrl = true
//           let qwe2 = []
//           qwe2.push(elem)
//           newArr.push(elem)
//           console.log('qwe2', qwe2);
//           firbaseRef.update({
//             photos: firestore.FieldValue.arrayRemove(...qwe2)
//           })
//           console.log('1 imageRef.delete().catch err', error.code)
//         } else {
//           //другая ошибка
//           // checkDelUrl = false
//           codeErr.push(error.code)
//           console.log('2 imageRef.delete().catch err', error.code)
//         }
//         // alert('Не удалось удалить фото, попробуйте еще раз', JSON.stringify(error.code))
//       })

//     })
//     console.log('newArr', );
//     resolve(newArr);
//   });
  
//   promise1.then((value) => {
//     console.log('value', value);
//     // expected output: "foo"
//   })
  
//   console.log(promise1);
//   // expected output: [object Promise]
  
    
//   console.log('1+');
  // console.log('newArr.length', newArr.length);
  // console.log('photosStateUrl.length', photosStateUrl.length);
  // if(newArr.length == photosStateUrl.length) {
  //   setCheckStorePhotoUrl(false)
  //   //для перерендера компонента
  //   setChangeInfo(true)
  //   dispatch(updateDataTransport(true))
  //   dispatch(photosUrlUpdate('reset'))
  //   //сбрасываем кнопки сохр/удалить, сбрасываем имун с кнопки сохрн, сбрасываем спинер
  //   setDisable(true)
  //   handleEditTransport(false)
  //   setisLoading(false)
  // }
  // if(newArr.length !== photosStateUrl.length) {
  //   console.log('3+');
  //   //если ошибка то: 1.спинер останавливаем,
  //   setisLoading(false)
  //   // для перерендера компонента  2.перерендер не делаем
  //   // setChangeInfo(true)
  //   //3. флаг для удаления фото ставим в false - что бы пользователь повторно нажал сохранить
  //   setCheckStorePhotoUrl(false)
  //   //4.обновление транспорта не делаем
  //   // dispatch(updateDataTransport(true))
  //   //5.сброс массива с сылками из редакса не делаем
  //   // dispatch(photosUrlUpdate('reset'))        
  //   console.log('newArr.length !== photosStateUrl.length', newArr.length, photosStateUrl.length);
  //   alert('Не удалось удалить фото, возникла непредвиденная ошибка, попробуйте еще раз',)
  // }

  //удаление ссылки из photos, док-та транспорта, на удаленные фото
  //если хоть одно фото из массива не удалилолсь то не 
  // try {
  //   console.log('2+');
  //   // No object exists at the desired reference.
  //   if(newArr && newArr.length > 0) {
  //   // if(checkDelUrl === true) {
  //     //удаление ссылок работает, решить проблему с ошибкой удаления из базы
  //     console.log('newArr.length', newArr.length);
  //     // console.log('checkDelUrl === true', checkDelUrl);
  //     firbaseRef.update({
  //       photos: firestore.FieldValue.arrayRemove(...photosStateUrl)
  //     })
  //     setCheckStorePhotoUrl(false)
  //     //для перерендера компонента
  //     setChangeInfo(true)
  //     dispatch(updateDataTransport(true))
  //     dispatch(photosUrlUpdate('reset'))
  //     //сбрасываем кнопки сохр/удалить, сбрасываем имун с кнопки сохрн, сбрасываем спинер
  //     setDisable(true)
  //     handleEditTransport(false)
  //     setisLoading(false)
  //   } 
  // } catch (error) {
  //   console.log('3+');
  //   //если ошибка то: 1.спинер останавливаем,
  //   setisLoading(false)
  //   // для перерендера компонента  2.перерендер не делаем
  //   // setChangeInfo(true)
  //   //3. флаг для удаления фото ставим в false - что бы пользователь повторно нажал сохранить
  //   setCheckStorePhotoUrl(false)
  //   //4.обновление транспорта не делаем
  //   // dispatch(updateDataTransport(true))
  //   //5.сброс массива с сылками из редакса не делаем
  //   // dispatch(photosUrlUpdate('reset'))        
  //   console.log('error firestore.FieldValue.arrayRemove', codeErr);
  //   alert('Не удалось удалить фото, возникла непредвиденная ошибка, попробуйте еще раз',)
  // }
// }


//renderItem SearchScreen

{/* 
<Text style={styles.btnMPText}>Детали</Text>
<Icon name="chevron-small-right" size={26} color={THEME.MAIN_COLOR} /> */}
  {/* {itemTender.startPoints?.map((stelem, index)=>{
    return (
      <View style={{backgroundColor: 'orange'}} key={index+'erq'}>
      {stelem.typeDate==='range' ?
      <Text style={[styles.btnMPText,{paddingRight: 3}]}>{stelem.dateRange[0]} - {stelem.dateRange[1]}, </Text>
      :<Text style={[styles.btnMPText, {paddingRight: 3}]}>{stelem.date}, </Text>
      
    }
      </View>
    )
  })}
  {itemTender.endPoints?.map((stelem, index)=>{
    return (
      <View style={{backgroundColor: 'lightblue'}} key={index+'erq'}>
      {stelem.typeDate==='range' ?
      <Text style={[styles.btnMPText,{paddingRight: 3}]}>{stelem.dateRange[0]} - {stelem.dateRange[1]}, </Text>
      :<Text style={[styles.btnMPText, {paddingRight: 3}]}>{stelem.date}, </Text>
      
    }
      </View>
    )
  })} */}