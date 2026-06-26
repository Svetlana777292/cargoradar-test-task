import { createSlice } from '@reduxjs/toolkit'
import { mergeUniqueArrObjId } from '../../util/arrayHelpers'

const initialState = {
  //сообщения
  listOfChats: [],
  listOfChatsHidden: [],
  listOfChatsTenderClient: [],
  firstOpenChats: true,
  refreshHiddenTenders: false,
  arrHidTend: [],
  currentChatId: null,
  currentChatReplState: null,
  currentChatMsgState: [],
  tenderInformersState: [], //для скрина заявки чекать нвые информеры
  tenderNeedUpdate: false,
  arrOfInformers: [],
  informerState: [], //стейт информеров не в работе
  informerActiveState: [], //стейт информеров активных или архивных заявок
  informerRoutesState: [], //стейт информеров из маршрутов (только общие информеры)
  checkUnreadMsgInformers: true,
  wsErr: '-',
  wsStatus: '-'
}

export const listOfChatsSlice = createSlice({
  name: 'listofchats',
  initialState,
  reducers: {
    setListOfChats: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','setListOfChats', )
      state.listOfChats = action.payload
    },
    setListOfChatsHidden: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','setListOfChatsHidden', )
      state.listOfChatsHidden = action.payload
    },
    setFirstOpenChats: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','setFirstOpenChats', )
      state.firstOpenChats = false
    },
    setChatsStateReset: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','setChatsStateReset', )
      state.listOfChats = []
      state.listOfChatsHidden = []
      state.firstOpenChats = true
    },
    setNewTendersInHidden: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','setNewTendersInHidden', action.payload)
      let intArr = Array.from(action.payload)
      let objState = state.arrHidTend.slice()
      let newobjState = objState.filter(elem => !intArr.includes(elem))
      // console.log('newobjState', newobjState)
      state.arrHidTend = newobjState
    },
    setListOfChatsTenderClient: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setListOfChatsTenderClient', action.payload)
      // {data: sortArr, tenderId: tenderId,}
      //action.payload
      let stateArr = state.listOfChatsTenderClient.slice()
      // console.log('stateArr', stateArr)

      if (stateArr.length === 0) {
          stateArr.push(action.payload)
          state.listOfChatsTenderClient = stateArr
          // console.log('info log ', stateArr?.length === 0)
      } else {
          let found = false;
          for (let i = 0; i < stateArr.length; i++) {
              if (stateArr[i].tenderId === action.payload.tenderId) {
                  // console.log('info log 3')
                  stateArr[i] = action.payload;
                  found = true;
                  break;
              }
          }
          if (!found) {
            stateArr.push(action.payload);
          }
          // console.log('res splice stateArr', JSON.stringify(stateArr,null,2))
          state.listOfChatsTenderClient = stateArr
      }
    },
    resetList: (state, action) => {
      state.listOfChatsTenderClient = []
      console.log('start resetList', )
    },
    setCurrentChatId: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setCurrentChatId', action.payload)
      state.currentChatId = action.payload
    },
    setCurrentChatMsgState: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setCurrentChatMsgState', action.payload)

      let stateArr = state.currentChatMsgState.slice()
      if(stateArr?.length === 0 ){
        stateArr.push(action.payload)
        
        state.currentChatMsgState = stateArr
        console.log('1 stateArr', stateArr)
        // console.log('1 Object isFrozen', Object.isFrozen(action.payload))
      } else {
        stateArr.forEach(elem => {
          console.log('elem', elem)
          if(elem !== action.payload._id) {
            stateArr.push(action.payload)
          }
        })
        console.log('2 stateArr', stateArr)
        state.currentChatMsgState = stateArr

        //проверять и убирать лишние или добавлять
      }
    },
    delCurrentChatMsgStateDel: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','delCurrentChatMsgStateDel', action.payload)

      let stateArr = state.currentChatMsgState.slice()
      const updatedMsgArr = stateArr.filter(item => item._id === action.payload._id);
      console.log('2 updatedMsgArr', updatedMsgArr)
      
      state.currentChatMsgState = updatedMsgArr
    },
    setCurrentChatReplState: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setCurrentChatReplState', action.payload)
      state.currentChatReplState = action.payload
    },
    setTenderInformersState: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setTenderInformersState', action.payload)
      //стейт информеров по разным заявкам
      //проверить есть ли такой 
      let stateArr = state.tenderInformersState.slice()
      let stateArrInf = state.arrOfInformers.slice()
      let routeid = null
        if(action.payload.textSystem === 'offerFromClient' && action.payload?.size !== null) {
          // .size - лежит айди маршрута если offerFromClient
            routeid = action.payload?.size
        }
      let newObj = {
          _id: action.payload._id, 
          read: action.payload.read, 
          tenderId: action.payload.tenderId, 
          userId: action.payload.userId, 
          textSystem: action.payload.textSystem,
          routeId: routeid,
          createdAt: action.payload.createdAt
        }
          
      // state.tenderInformersState = stateArr.concat([newObj])
      // {"_id": 372, "createdAt": "2025-08-13 14:46:48", "driverAvatar": null, "file_type": null, "name": null, "partnerId": 10, "partnerRole": "client", "priceBet": 0, "read": false, "replyId": 53, "size": null, "system": true, "tenderId": 134, "text": "Ee", "textSystem": "orderCanceled", "thumbnail": null, "typeMsg": null, "url": null, "userId": 8, "userName": "User8", "userRole": "driver"}

      if(stateArr.length > 0) {

        let res = stateArr.filter(elem =>  {
          console.log('1 elem._id !== newObj._id', elem._id !== newObj._id)
          console.log('2', elem._id, newObj._id)
          if(elem._id !== newObj._id) return elem
        })
        // console.log('1 res', res)
  
        state.tenderInformersState = res.concat([newObj])
      } else {
        console.log('2 stateArr', stateArr.concat([newObj]))
        state.tenderInformersState = stateArr.concat([newObj])
      }

      if(stateArrInf.length > 0) {

        let res2 = stateArrInf.filter(elem =>  {
          // console.log('2 elem._id !== newObj._id', elem._id !== newObj._id)
          if(elem._id !== newObj._id) return elem
        }) 
        // console.log('res2', res2)
        state.arrOfInformers = res2
  
      } else {
        state.arrOfInformers = stateArrInf.concat([newObj])
      }

      //еще добавлять добавлять время для рендера по убыванию в списке заявок
     
    },
    setTenderInformersStateArray: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','setTenderInformersStateArray', action.payload)
      //стейт информеров по разным заявкам
      //проверить есть ли такой 
      let stateArr = state.tenderInformersState.slice()
      let stateArrInf = state.arrOfInformers.slice()
      
      //будет приходить массив в отличии от setTenderInformersState

      const newArray = action.payload.map(elem => {
        let routeid = null
        if(elem.textSystem === 'offerFromClient' && elem?.size !== null) {
          //elem?.size - лежит айди маршрута если offerFromClient
            routeid = elem?.size
        }
        return {
          _id: elem._id, 
          read: elem.read,
          tenderId: elem.tenderId, 
          userId: elem.userId, 
          textSystem: elem.textSystem, 
          routeId: routeid, 
          createdAt: elem.createdAt
        }
      })
      
      console.log('TISA newArray', newArray)
      let uniqueElemArr = mergeUniqueArrObjId(newArray,stateArr)
      let uniqueElemArrInf = mergeUniqueArrObjId(newArray,stateArrInf)

      state.tenderInformersState = stateArr.concat(uniqueElemArr)

      //еще добавлять добавлять время для рендера по убыванию в списке заявок
      state.arrOfInformers = stateArrInf.concat(uniqueElemArrInf)
    },
    delTenderInformersState: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','delTenderInformersState', action.payload)
      let stateArr = state.tenderInformersState.slice()
      // let stateArrInf = state.informerState.slice()
      // let stateArrInfActive = state.informerActiveState.slice()

      const updatedMsgArr = stateArr.filter(item => {item.tenderId !== action.payload.tenderId});
      console.log('del tn stateArr', stateArr)
      // const updatedMsgArrActive = stateArr.filter(item => {item.tenderId !== action.payload.tenderId});
      
      state.tenderInformersState = updatedMsgArr

    },
    delArrOfInformers: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','delArrOfInformers', action.payload)
      state.arrOfInformers = []
    },
    delTenderNeedUpdate: (state,action) => {
      console.log('\x1b[35m%s %s\x1b[35m','delTenderNeedUpdate', action.payload)
      state.tenderNeedUpdate = false
    },
    //todo informers
    setInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerState: ', state.informerState, '\n', 'action.payload', action.payload)
      let stateArr = state.informerState.slice()
      let uniqueElemArr = mergeUniqueArrObjId(action.payload,stateArr)
      state.informerState = state.informerState.concat(uniqueElemArr)
    },
    setInformerActiveState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerActiveState: ', state.informerActiveState, '\n', 'action.payload', action.payload)
      // state.informerActiveState = state.informerActiveState.concat(action.payload)
      let stateArr = state.informerActiveState.slice()
      let uniqueElemArr = mergeUniqueArrObjId(action.payload,stateArr)
      state.informerActiveState = state.informerActiveState.concat(uniqueElemArr)
    },
    setInformerRoutesState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerRoutesState: ', state.informerRoutesState, '\n', 'action.payload', action.payload)
      // state.informerRoutesState = state.informerRoutesState.concat(action.payload)
      let stateArr = state.informerRoutesState.slice()
      let uniqueElemArr = mergeUniqueArrObjId(action.payload,stateArr)
      state.informerRoutesState = state.informerRoutesState.concat(uniqueElemArr)
    },  
    updInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerState ', state.informerState, '\n', action.payload)
      state.informerState = action.payload
    },
    updInformerActiveState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerActiveState ', state.informerActiveState, '\n', action.payload)
      state.informerActiveState = action.payload
    },
    updInformerRoutesState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerActiveState ', state.informerRoutesState, '\n', action.payload)
      state.informerRoutesState = action.payload
    },
    setCheckUnreadMsgInformers: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setCheckUnreadMsgInformers ', state.checkUnreadMsgInformers, '\n', action.payload)
      state.checkUnreadMsgInformers = action.payload
    },
    setwsErr: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setwsErr ', action.payload)
      state.wsErr = action.payload
    },
    setwsStatus: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setwsStatus ', action.payload)
      state.wsStatus = action.payload
    },
    logoutResetListOfChats: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: logoutResetListOfChats ', action.payload)
      state.listOfChats = []
      state.listOfChatsHidden = []
      state.listOfChatsTenderClient = []
      state.firstOpenChats = true
      state.refreshHiddenTenders = false
      state.arrHidTend = [],
      state.currentChatId = null
      state.currentChatReplState = null
      state.currentChatMsgState = []
      state.tenderInformersState = []
      state.tenderNeedUpdate = false
      state.arrOfInformers = []
      state.informerState = []
      state.informerActiveState = []
      state.informerRoutesState = []
      state.checkUnreadMsgInformers = true
    },
    changeRoleResetListOfChats: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: logoutResetListOfChats ', action.payload)
      state.listOfChats = []
      state.listOfChatsHidden = []
      state.listOfChatsTenderClient = []
      state.currentChatId = null
      state.currentChatReplState = null
      state.currentChatMsgState = []
      state.tenderInformersState = []
      state.tenderNeedUpdate = false
      state.arrOfInformers = []
      state.informerState = []
      state.informerActiveState = []
      state.informerRoutesState = []
      state.checkUnreadMsgInformers = true
    },

  }
})

// Action creators are generated for each case reducer function
export const {
  setListOfChats,
  setListOfChatsHidden,
  setFirstOpenChats,
  setChatsStateReset,
  setNewTendersInHidden,
  setListOfChatsTenderClient,
  resetList,
  setCurrentChatId,
  setCurrentChatMsgState,
  delCurrentChatMsgStateDel,
  setCurrentChatReplState,
  setTenderInformersState,
  setTenderInformersStateArray,
  delTenderInformersState,
  delTenderNeedUpdate,
  setInformerState,
  setInformerActiveState,
  setInformerRoutesState,
  delArrOfInformers,
  updInformerState,
  updInformerActiveState,
  updInformerRoutesState,
  setCheckUnreadMsgInformers,
  logoutResetListOfChats,
  setwsErr,
  setwsStatus,
  changeRoleResetListOfChats

} = listOfChatsSlice.actions

export default listOfChatsSlice.reducer