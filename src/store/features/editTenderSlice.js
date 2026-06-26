import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tender: {
    data: {
      name: '',
      description: '',
      price: null,        
    },
    startPoints: [],
    endPoints: [],
    route: {
      distance: '',
      duration: ''
    }
  },
  tenderState: null,

  //old
  test: null,
  isLoading:  false,
  arrayIdFiltering: [],
  objDataFiltering: null,
  counrty: 'BY',
}

export const editTenderSlice = createSlice({
  name: 'editTender',
  initialState,
  reducers: {
    setDataTender: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setDataTender action.payload:', action.payload);
      state.tender.data.name = action.payload.name
      state.tender.data.description = action.payload.description !== undefined && action.payload.description?.length > 0 ? action.payload.description : ''
      state.tender.data.price = action.payload.price
      state.tender.startPoints = action.payload.startPoints
      state.tender.endPoints = action.payload.endPoints
      state.tender.route.distance = action.payload.route.distance
      state.tender.route.duration = action.payload.route.duration

    },
    setDataTenderWithChats: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setDataTender action.payload:', action.payload);
      state.tenderState = action.payload

    },
    setInfoTender: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setInfoTender action.payload:', action.payload);
      if(action.payload.type==='title') {
        state.tender.data.name = action.payload.data
      } else if(action.payload.type==='description'){
        state.tender.data.description = action.payload.data
      } else if(action.payload.type==='price'){
        state.tender.data.price = action.payload.data
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
        },
        startPoints: [],
        endPoints: [],
        route: {
          distance: '',
          duration: ''
        }
      }
      state.tenderState = null
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setInfoTender,
  savePoint,
  onChangeIndexOfPoint,
  onDeletePoint,
  onEditPoint,
  onResetTender,
  setDataTender,
  setDataTenderWithChats
} = editTenderSlice.actions

export default editTenderSlice.reducer