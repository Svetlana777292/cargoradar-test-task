import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //сообщения
  msgState: [],
  informerState: [], //стейт информеров
  informerActiveState: [], //стейт информеров активных или архивных заявок
  informerRoutesState: [], //стейт информеров из маршрутов (только общие информеры)
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    onResetMsg: (state, action) => {
      // console.log('\x1b[35m%s %s\x1b[35m','Redux: RESET', action.payload)
      state.msgState = []
      state.informerState = []
      state.informerActiveState = []
      state.informerRoutesState = []
    },    
    resetInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: resetInformerState ', state.informerState, '\n', action.payload)      
      state.informerState = []
      state.informerActiveState = []
      state.informerRoutesState = []
    },
    onMsgState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: onMsgState: ', state.msgState, '\n', 'action.payload', action.payload)
      state.msgState = state.msgState.concat(action.payload)
    },
    setInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerState: ', state.informerState, '\n', 'action.payload', action.payload)
      state.informerState = state.informerState.concat(action.payload)
    },
    setInformerActiveState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerActiveState: ', state.informerActiveState, '\n', 'action.payload', action.payload)
      state.informerActiveState = state.informerActiveState.concat(action.payload)
    },    
    setInformerRoutesState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: setInformerRoutesState: ', state.informerRoutesState, '\n', 'action.payload', action.payload)
      state.informerRoutesState = state.informerRoutesState.concat(action.payload)
    },    
    updMsg: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updMsg ', state.msgState, '\n', action.payload)      
      let objState = state.msgState.slice()
      let newobjState = objState.filter(elem => !action.payload.includes(elem))
      state.msgState = newobjState
    },    
    updInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerState ', state.informerState, '\n', action.payload)
      
      let objState = state.informerState.slice()
      let newobjState = objState.filter((item1) => { 
        return !action.payload.some((item2) => {
          return item1.userId === item2.userId && item1.tenderId === item2.tenderId && item1.createdAt === item2.createdAt})
      })
      // console.log('newobjState', newobjState)
      state.informerState = newobjState
    },
    updInformerActiveState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerActiveState ', state.informerActiveState, '\n', action.payload)
      
      let objState = state.informerActiveState.slice()
      let newobjState = objState.filter((item1) => { 
        return !action.payload.some((item2) => {
          return item1.userId === item2.userId && item1.tenderId === item2.tenderId && item1.createdAt === item2.createdAt})
      })
      console.log('newobjState', newobjState)
      state.informerActiveState = newobjState
    },
    updInformerRoutesState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updInformerRoutesState ', state.informerRoutesState, '\n', action.payload)
      
      let objState = state.informerRoutesState.slice()
      let newobjState = objState.filter((item1) => { 
        return !action.payload.some((item2) => {
          return item1.userId === item2.userId && item1.tenderId === item2.tenderId && item1.createdAt === item2.createdAt})
      })
      console.log('newobjState', newobjState)
      state.informerRoutesState = newobjState
    },
    updateTimeInformerState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updateTimeInformerState: ', state.informerState, '\n', 'action.payload', action.payload)
      let arr2 = state.informerState.slice()
      let arr = action.payload
      arr2.forEach(item2 => {
        // Находим элемент в arr с тем же tenderId
        let matchingItem = arr.find(item => item.tenderId === item2.tenderId);
        if (matchingItem) {
          // Если элемент найден, и его createdAt отличается,
          // обновляем значение createdAt в arr
          if (matchingItem.createdAt !== item2.createdAt) {
            matchingItem.createdAt = item2.createdAt;
          }
        } else {
          // Если элемента нет в arr, добавляем его в arr
          arr.push(item2);
        }
      });
      // console.log('arr', arr)
      state.informerState = arr
    },
    updateTimeInformerActiveState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updateTimeInformerActiveState: ', state.informerActiveState, '\n', 'action.payload', action.payload)
      let arr2 = state.informerActiveState.slice()
      let arr = action.payload
      arr2.forEach(item2 => {
        // Находим элемент в arr с тем же tenderId
        let matchingItem = arr.find(item => item.tenderId === item2.tenderId);
        if (matchingItem) {
          // Если элемент найден, и его createdAt отличается,
          // обновляем значение createdAt в arr
          if (matchingItem.createdAt !== item2.createdAt) {
            matchingItem.createdAt = item2.createdAt;
          }
        } else {
          // Если элемента нет в arr, добавляем его в arr
          arr.push(item2);
        }
      });
      // console.log('arr', arr)
      state.informerActiveState = arr
    },
    updateTimeInformerRoutesState: (state, action) => {
      console.log('\x1b[35m%s %s\x1b[35m','Redux: updateTimeInformerRoutesState: ', state.informerRoutesState, '\n', 'action.payload', action.payload)
      let arr2 = state.informerRoutesState.slice()
      let arr = action.payload
      arr2.forEach(item2 => {
        // Находим элемент в arr с тем же tenderId
        let matchingItem = arr.find(item => item.tenderId === item2.tenderId);
        if (matchingItem) {
          // Если элемент найден, и его createdAt отличается,
          // обновляем значение createdAt в arr
          if (matchingItem.createdAt !== item2.createdAt) {
            matchingItem.createdAt = item2.createdAt;
          }
        } else {
          // Если элемента нет в arr, добавляем его в arr
          arr.push(item2);
        }
      });
      // console.log('arr', arr)
      state.informerRoutesState = arr
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  // onResetMsg,
  // resetInformerState,
  // onMsgState,
  // setInformerState,
  // setInformerActiveState,
  // setInformerRoutesState,
  // updMsg,
  // updInformerState,
  // updInformerActiveState,
  // updInformerRoutesState,
  // updateTimeInformerState,
  // updateTimeInformerActiveState,
  // updateTimeInformerRoutesState,
  // updMsgCounter
  // onMsgCounter,
  } = chatsSlice.actions

export default chatsSlice.reducer