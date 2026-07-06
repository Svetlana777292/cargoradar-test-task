import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tender: {
    data: {
      name: '',
      description: '',
      price: null,
      transportType: '',
    },
    startPoints: [],
    endPoints: [],
    route: {
      distance: '',
      duration: ''
    }
  },

  //old
  test: null,
  isLoading:  false,
  arrayIdFiltering: [],
  objDataFiltering: null,
  counrty: 'BY',
}

export const addTenderSlice = createSlice({
  name: 'addTender',
  initialState,
  reducers: {
    setInfoTender: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setInfoTender action.payload:', action.payload);
      if(action.payload.type==='title') {
        state.tender.data.name = action.payload.data
      } else if(action.payload.type==='description'){
        state.tender.data.description = action.payload.data
      } else if(action.payload.type==='price'){
        state.tender.data.price = action.payload.data
      } else if(action.payload.type==='transportType'){
        state.tender.data.transportType = action.payload.data
      }
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
    onResetTender: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onResetTender action.payload:', action.payload);
      state.tender = {
        data: {
          name: '',
          description: '',
          price: null,
          transportType: '',
        },
        startPoints: [],
        endPoints: [],
        route: {
          distance: '',
          duration: ''
        }
      }
    },

    //old
    test: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'test action.payload:', action.payload);
      state.test = action.payload
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload
    },
    //tender arry id(filter)
    arrayFiltering:(state, action) => {
      state.arrayIdFiltering = action.payload
    },
    objFiltering:(state, action) => {
      // console.log('SLISE objFiltering', action.payload);
      state.objDataFiltering = action.payload
    },
    changeCounrty:(state, action) => {
      // console.log('SLISE objFiltering', action.payload);
      state.counrty = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  test, 
  isLoading, arrayFiltering,
  objFiltering,changeCounrty,
  setInfoTender,savePoint,
  onChangeIndexOfPoint,
  onDeletePoint,onEditPoint,
  onResetTender,
} = addTenderSlice.actions

export default addTenderSlice.reducer