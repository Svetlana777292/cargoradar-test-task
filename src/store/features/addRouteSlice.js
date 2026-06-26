import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tender: {
    data: {
      name: '',      
    },
    startPoints: [],
    endPoints: [],
    route: {
      distance: '',
      duration: ''
    }
  },
}

export const addRouteSlice = createSlice({
  name: 'addRoute',
  initialState,
  reducers: {
    setInfoRoute: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setInfoRoute action.payload:', action.payload);
      state.tender.data.name = action.payload.data
    },
    savePoint: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'savePoint action.payload:', action.payload);
      if(action.payload.type==='start') {
        let arr =  state.tender.startPoints.slice()
        arr.push(action.payload.data)
        console.log('arr start', arr)

        state.tender.startPoints = arr
      } else {
        let arr =  state.tender.endPoints.slice()
        arr.push(action.payload.data)
        
        state.tender.endPoints = arr
      }
    },
    onEditPoint: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onEditPoint action.payload:', action.payload);
      if(action.payload.type==='start') {
        let arr =  state.tender.startPoints.slice()
        arr.splice(action.payload.index,1,action.payload.item)
        console.log('arr', arr)
        state.tender.startPoints = arr
      } else {
        let arr =  state.tender.endPoints.slice()
        arr.splice(action.payload.index,1,action.payload.item)
        console.log('arr', arr)
        state.tender.endPoints = arr
        // state.tender.endPoints = action.payload.data
      }
    },
    onChangeIndexOfPoint: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onChangeIndexOfPoint action.payload:', action.payload);
      if(action.payload.type==='start') {
        state.tender.startPoints = action.payload.data
      } else {
        state.tender.endPoints = action.payload.data
      }
    },
    onDeletePoint: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onDeletePoint action.payload:', action.payload);
      if(action.payload.type==='start') {
        let arr =  state.tender.startPoints.slice()
        arr.splice(action.payload.data,1)
        state.tender.startPoints = arr
        
      } else {
        let arr =  state.tender.endPoints.slice()
        arr.splice(action.payload.data,1)
        state.tender.endPoints = arr

      }
    },
    onResetRoute: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onResetRoute action.payload:', action.payload);
      state.tender = {
        data: {
          name: '',    
        },
        startPoints: [],
        endPoints: [],
        route: {
          distance: '',
          duration: ''
        }
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setInfoRoute,
  savePoint,
  onEditPoint,
  onChangeIndexOfPoint,
  onDeletePoint,
  onResetRoute,
} = addRouteSlice.actions

export default addRouteSlice.reducer