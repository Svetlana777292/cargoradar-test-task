import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  inAllStartPoints: true,
  mapVisible: false,
  hiddenTenderVisible: false,
  showTnWithMyActv: false,
  objDataFiltering: null,
  isActiveTab: 0,
}

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setInAllStartPoints: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setInAllStartPoints action.payload:', action.payload);
      state.inAllStartPoints = action.payload
    },
    setMapVisible: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setMapVisible action.payload:', action.payload);
      state.mapVisible = action.payload
    },
    setHiddenTenderVisible: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setHiddenTenderVisible action.payload:', action.payload);
      state.hiddenTenderVisible = action.payload
    },
    setShowTnWtMyActv: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setShowTnWtMyActv action.payload:', action.payload);
      state.showTnWithMyActv = action.payload
    },
    setIsActiveTab: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setActiveTab action.payload:', action.payload);
      state.isActiveTab = action.payload
    },
    objFiltering:(state, action) => {
      // console.log('SLISE objFiltering', action.payload);
      state.objDataFiltering = action.payload
    },
    resetObjFiltering:(state, action) => {
      console.log('SLISE resetObjFiltering', action.payload);
      state.objDataFiltering = null
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setInAllStartPoints,
  setMapVisible,
  setHiddenTenderVisible,
  objFiltering,
  resetObjFiltering,
  setIsActiveTab,
  setShowTnWtMyActv

} = filtersSlice.actions

export default filtersSlice.reducer