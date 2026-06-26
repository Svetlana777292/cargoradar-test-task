import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //от водителя -ставки
  betState: null,
  betCounter: {newNotif: 0},
  rejectedByDriverState: null,
  rejectedByDriverCounter: {newNotif: 0},
  acceptedByDriverState: null,
  acceptedByDriverCounter: {newNotif: 0},
  //от водителя -заявки
  finishedState: null,
  finishedCounter: {newNotif: 0},
  canceledByState: null,
  canceledByCounter: {newNotif: 0},

  //от клиента -ставки
  pickCandidateState: null,
  pickCandidateCounter: {newNotif: 0},
  rejectedAtClientState: null,
  rejectedAtClientCounter: {newNotif: 0},
  //счетчики - общие
  repliesCounter: {notifSize: 0},
  tendersCounter: {notifSize: 0},
  //сообщения
  msgState: null,
  msgCounter:  {newNotif: 0}
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    onReset: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: RESET', action.payload)
      state.msgState = null
      state.msgCounter= {newNotif: 0}
    },
    onCounterRepliesCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onCounterRepliesState', action.payload);
      state.repliesCounter = action.payload
    },
    onCounterTendersCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onCounterTendersState', action.payload);
      state.tendersCounter = action.payload
    },
    onBetState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: betState', state.betState, action.payload);
      if(state.betState == null) {
        console.log('1 if state.betState', state.betState)
        state.betState = action.payload
      } else {
        console.log('2 if state.betState', state.betState)
        state.betState = state.betState.concat(action.payload)
      }
    },
    onBetCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: betCounter', state.betCounter, action.payload);
      state.betCounter = action.payload
    },
    updBetState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updBetState ', action.payload)
      //находить id(action.payload) и ставить флаг read: true 
      let objState = state.betState.slice()
      let newobjState = objState.map((elem) => {
        if(elem.docId == action.payload) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length)
      state.betState = newobjState
      // ----
      // отнимаем счетчик
      let newCount =  {...state.betCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updBetState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.betCounter = newCount
      } else if(newCount.newNotif <= 0) {
        state.betCounter = 0
      }
    },
    onRejectByDr: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onRejectByDr', action.payload)
      if(state.rejectedByDriverState == null) {
        console.log('1 if state.rejectedByDriverState', state.rejectedByDriverState)
        state.rejectedByDriverState = action.payload
      } else {
        console.log('2 if state.rejectedByDriverState', state.rejectedByDriverState)
        state.rejectedByDriverState = state.rejectedByDriverState.concat(action.payload)
      }
    },
    onRejectByDrCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onRejectByDrCounter', action.payload)
      state.rejectedByDriverCounter = action.payload
    },
    updRejectByDrState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updRejectByDrState ', action.payload)
      //находить id(action.payload) и ставить флаг read: true 
      let objState = state.rejectedByDriverState.slice()
      let newobjState = objState.map((elem) => {
        if(elem.tenderId == action.payload) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.rejectedByDriverState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.rejectedByDriverCounter', state.rejectedByDriverCounter)
      let newCount = {...state.rejectedByDriverCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updRejectByDrState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.rejectedByDriverCounter = newCount
      } else if(newCount.newNotif <= 0) {
        state.rejectedByDriverCounter = 0
      }
    },
    onAcceptedByDr: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onAcceptedByDr', action.payload)
      if(state.acceptedByDriverState == null) {
        console.log('1 if state.acceptedByDriverState', state.acceptedByDriverState)
        state.acceptedByDriverState = action.payload
      } else {
        console.log('2 if state.acceptedByDriverState', state.acceptedByDriverState)
        state.acceptedByDriverState = state.acceptedByDriverState.concat(action.payload)
      }
    },
    onAcceptedByDrCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onAcceptedByDrCounter', action.payload)
      state.acceptedByDriverCounter = action.payload
    },
    updAcceptedByDrState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updAcceptedByDrState ', action.payload)
      let objState = state.acceptedByDriverState.slice()
      let newobjState = objState.map((elem) => {
        if(elem.tenderId == action.payload) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.acceptedByDriverState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.acceptedByDriverCounter', state.acceptedByDriverCounter)
      let newCount = {...state.acceptedByDriverCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updAcceptedByDrState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.acceptedByDriverCounter = newCount
      } else if(newCount.newNotif <= 0) {
        state.acceptedByDriverCounter = 0
      }
    },
    onFinishedState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onFinishedState ', action.payload)
      if(state.finishedState == null) {
        console.log('1 if state.finishedState', state.finishedState)
        state.finishedState = action.payload
        state.finishedCounter = {newNotif: action.payload.length}
      } else {
        console.log('2 if state.finishedState', state.finishedState)
        // state.finishedState = state.finishedState.concat(action.payload)
        let arr = []
        let arrSerch = state.finishedState.slice()
        action.payload.forEach(elem => {
          if(elem == undefined || elem == null) return 
          let filteredObj = arrSerch.find(elemFind => elemFind.tenderId == elem.tenderId && 
          elemFind.driverId == elem.driverId && elemFind.docId == elem.docId)
          console.log('Redux filteredObj', filteredObj)
          if(filteredObj == undefined) {
            console.log('Redux найден новый эл-т, добавляем его, filteredObj == undefined', 'elem:', elem)
            arr.push(elem)
          }
        })
        state.finishedState = state.finishedState.concat(arr)
        state.finishedCounter = {newNotif: arr.length+state.finishedCounter.newNotif}
      }
    },
    onFinishedCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onFinishedCounter ', action.payload)
      // state.finishedCounter = action.payload
    },
    updFinishedState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updFinishedState ', state.finishedCounter, action.payload)
      let objState = state.finishedState.slice()
      let newobjState = objState.map((elem) => {
        console.log('updFinishedState elem', elem)
        if(elem.tenderId == action.payload.tenderId && elem.replyId == action.payload.replyId) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.finishedState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.finishedCounter', state.finishedCounter)
      let newCount = {...state.finishedCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updFinishedState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.finishedCounter = newCount
      } else if(newCount.newNotif <= 0) {
        state.finishedCounter = 0
      }
    },
    onCanceledByState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onCanceledByState ', action.payload)
      if(state.canceledByState == null) {
        console.log('1 if state.canceledByState', state.canceledByState)
        state.canceledByState = action.payload
      } else {
        console.log('2 if state.canceledByState', state.canceledByState)
        state.canceledByState = state.canceledByState.concat(action.payload)
      }
    },
    onCanceledByCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onCanceledByCounter ', action.payload)
      state.canceledByCounter = action.payload
    },
    updCanceledByState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updCanceledByState ', state.canceledByCounter, action.payload)
      let objState = state.canceledByState.slice()
      let newobjState = objState.map((elem) => {
        console.log('updCanceledByState elem', elem)
        if(elem.tenderId == action.payload.tenderId) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.canceledByState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.canceledByCounter', state.canceledByCounter)
      let newCount = {...state.canceledByCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updCanceledByState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.canceledByCounter = newCount
      } else if(newCount.newNotif <= 0) {
        state.canceledByCounter = 0
      }
    },
    onPickCandidateState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onPickCandidateState ', state.pickCandidateState, action.payload)
      if(state.pickCandidateState == null) {
        console.log('1 if state.pickCandidateState', state.pickCandidateState)
        state.pickCandidateState = action.payload
        state.pickCandidateCounter = {newNotif: action.payload.length}
      } else {
        console.log('2 if state.pickCandidateState', state.pickCandidateState)
        let arr = []
        let arrSerch = state.pickCandidateState.slice()
        action.payload.forEach(elem => {
          if(elem == undefined || elem == null) return 
          let filteredObj = arrSerch.find(elemFind => elemFind.tenderId == elem.tenderId && 
          elemFind.driverId == elem.driverId && elemFind.docId == elem.docId)
          console.log('Redux filteredObj', filteredObj)
          if(filteredObj == undefined) {
            console.log('Redux найден новый эл-т, добавляем его, filteredObj == undefined', 'elem:', elem)
            arr.push(elem)
          }
        })
        state.pickCandidateState = state.pickCandidateState.concat(arr)
        state.pickCandidateCounter = {newNotif: arr.length+state.pickCandidateCounter.newNotif}
      }
    },
    onPickCandidateCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onPickCandidateCounter ', state.pickCandidateCounter, action.payload)
      // state.pickCandidateCounter = action.payload
    },
    updPickCandidateState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updPickCandidateState ', state.pickCandidateState, action.payload)
      let objState = state.pickCandidateState.slice()
      let newobjState = objState.map((elem) => {
        if(elem.docId == action.payload.docId) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.pickCandidateState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.pickCandidateCounter', state.pickCandidateCounter)
      let newCount = {...state.pickCandidateCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updPickCandidateState newCount', newCount)
      if(newCount.newNotif >= 0) {
        console.log('if newCount', newCount)
        state.pickCandidateCounter = newCount
      } else if(newCount.newNotif <= 0) {
        console.log('else newCount', newCount)
        state.pickCandidateCounter = 0
      }
    },
    onRejectedAtClientState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onRejectedAtClientState ', state.rejectedAtClientState, action.payload)
      if(state.rejectedAtClientState == null) {
        console.log('1 if state.rejectedAtClientState', state.rejectedAtClientState)
        state.rejectedAtClientState = action.payload
      } else {
        console.log('2 if state.rejectedAtClientState', state.rejectedAtClientState)
        state.rejectedAtClientState = state.rejectedAtClientState.concat(action.payload)
      }
    },
    onRejectedAtClientCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onRejectedAtClientCounter ', state.rejectedAtClientCounter, action.payload)
      state.rejectedAtClientCounter = action.payload
    },
    updRejectedAtClientState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updRejectedAtClientState ', state.rejectedAtClientState, action.payload)
      let objState = state.rejectedAtClientState.slice()
      let newobjState = objState.map((elem) => {
        if(elem.docId == action.payload.docId) elem.read = true
        return elem
      })
      console.log('Redux objState', objState.length, '\n', newobjState.length, newobjState)
      state.rejectedAtClientState = newobjState
      // ----
      // отнимаем счетчик
      console.log('state.rejectedAtClientCounter', state.rejectedAtClientCounter)
      let newCount = {...state.rejectedAtClientCounter}
      newCount.newNotif = newCount.newNotif-1
      console.log('updRejectedAtClientState newCount', newCount)
      if(newCount.newNotif >= 0) {
        state.rejectedAtClientCounter = newCount
      } else if (newCount.newNotif < 0) {
        state.rejectedAtClientCounter = 0
      }
    },
    onMsgState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onMsgState ', state.msgState, '\n', action.payload)
      if(state.msgState == null) {
        console.log('1 if state.msgState', state.msgState)
        state.msgState = action.payload

      } else {
        console.log('2 if state.msgState', state.msgState)
        state.msgState = state.msgState.concat(action.payload)
      }
    },
    onMsgCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onMsgCounter ', state.msgCounter, action.payload)
      state.msgCounter = action.payload
      
    },
    updMsg: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updMsg ', state.msgState, '\n', action.payload)
      //получим массив с id документа сообщения, менять флаг read = true, отнимать счетчик
      //для сообщений полученных в ChatScreen read уже true 
      //проверить момент что первее приходит из тап навигатора диспатч или из чат скрина, будет ли задержка
      //можно продумать вариант что будет приходить флаг если с чат скрина и тогда отдельный код и ли из чат скрина делать отдельный 
      //диспатч фун-ю updMsgChat 
      if(state.msgState !== null) {
        let objState = state.msgState.slice()
        let newobjState = []
        objState.forEach((elem) => {
          let findItem = action.payload.find(fItem =>fItem == elem.docId)
          console.log('elem.docId',elem.docId)

          console.log('findItem', findItem)
          if(findItem === undefined) {
            newobjState.push(elem)
          }           
        })
        console.log('newobjState', newobjState)
        state.msgState = newobjState
        //counter
        // let initialValue = 0
        // let result = newobjState.reduce(function (x, y) {
        //   console.log('result: newobjState reduce', x, y)
        //   return x + y.msg;
        // }, initialValue)
        // console.log('updMsg result', result)
        // if(result >= 0) {
        //   state.msgCounter = {"newNotif": result}
        // } else if(result <= 0) {
        //   state.msgCounter = {"newNotif": 0}
        // }

      }
      // if(state.msgState !== null) {
      //   let objState = state.msgState.slice()
      //   let newobjState = objState.map((elem) => {
      //     let findItem = action.payload.find(fItem => fItem == elem.docId)
      //     console.log('findItem', findItem)
      //     if(findItem !== undefined) {
      //       elem.read = true
      //       elem.msg = 0
      //     }
      //     return elem
      //   })
      //   console.log('newobjState', newobjState)
      //   state.msgState = newobjState
      //   //counter
      //   let initialValue = 0
      //   let result = newobjState.reduce(function (accumulator, currentValue) {
      //     console.log('result: newobjState reduce', accumulator, currentValue)
      //     return accumulator + currentValue.msg;
      //   }, initialValue)
      //   console.log('updMsg result', result)
      //   if(result >= 0) {
      //     state.msgCounter = {"newNotif": result}
      //   } else if(result <= 0) {
      //     state.msgCounter = {"newNotif": 0}
      //   }

      // }
    },
    updMsgCounter: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updMsgCounter ', state.msgState, '\n', action.payload)
      // let objState = state.msgState.slice()
      // let newobjState = objState.map((elem) => {
      //   if(elem.docId == action.payload) elem.read = true
      //   return elem
      // })
      // console.log('newobjState', newobjState)
      // state.msgState = newobjState
      // отнимаем счетчик
      // console.log('state.msgCounter', state.msgCounter)
      // let newCount = {...state.msgCounter}
      // newCount.newNotif = newCount.newNotif-1
      // console.log('updMsgCounter newCount', newCount)
      // state.msgCounter = newCount
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  onReset,
  onCounterRepliesCounter,
  onCounterTendersCounter,
  onBetState,
  onBetCounter, 
  updBetState,
  onRejectByDr, 
  onRejectByDrCounter, 
  updRejectByDrState,
  onAcceptedByDr,
  onAcceptedByDrCounter,
  updAcceptedByDrState,
  onFinishedState,
  onFinishedCounter,
  updFinishedState,
  onCanceledByState,
  onCanceledByCounter,
  updCanceledByState,
  onPickCandidateState,
  onPickCandidateCounter,
  updPickCandidateState,
  onRejectedAtClientState,
  onRejectedAtClientCounter,
  updRejectedAtClientState,
  onMsgState,
  onMsgCounter,
  updMsg,
  updMsgCounter
  } = notificationSlice.actions

export default notificationSlice.reducer