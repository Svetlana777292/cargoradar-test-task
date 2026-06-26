import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoadingUpdatae:  false,
  updateDataTransport: false,
  photosUrl: [],
}

export const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    isLoadingUpdatae: (state, action) => {
      state.isLoadingUpdatae = action.payload
    },
    updateDataTransport: (state, action) => {
      state.updateDataTransport = action.payload
      // console.log('SLISE updateDataTransport action.payload:', action.payload);
    },
    photosUrlUpdate: (state, action) => {
      // console.log('SLISE: transportSlice', 'action.payload: ', action.payload );
      if(action.payload === 'reset') {
        state.photosUrl = []
      } else state.photosUrl = [...state.photosUrl, action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const { isLoadingUpdatae, updateDataTransport, photosUrlUpdate } = transportSlice.actions

export default transportSlice.reducer