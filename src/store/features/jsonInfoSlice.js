import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  jsonDataPrompt: [],
  jsonDataPromptErr: '',
  jsonDataSlider: [],
  jsonDataSliderErr: '',
  jsonDataCheckVers: [],
  jsonDataCheckVersErr: '',
  jsonDataComplaints: [],
  jsonDataComplaintsErr: '',
}

export const jsonInfoSlice = createSlice({
  name: 'jsoninfo',
  initialState,
  reducers: {
    setJsonDataPrompt: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataPrompt action.payload:', action.payload, );
      state.jsonDataPrompt = action.payload
    },
    setJsonDataPromptErr: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataPromptErr action.payload:', action.payload, );
      state.jsonDataPromptErr = action.payload
    },
    setJsonDataSlider: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataSlider action.payload:', action.payload, );
      state.jsonDataSlider = action.payload
    },
    setJsonDataSliderErr: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataSliderErr action.payload:', action.payload, );
      state.jsonDataSliderErr = action.payload
    },
    setJsonDataCheckVers: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataCheckVers action.payload:', action.payload, );
      state.jsonDataCheckVers = action.payload
    },
    setJsonDataCheckVersErr: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataCheckVersErr action.payload:', action.payload, );
      state.jsonDataCheckVersErr = action.payload
    },
    setJsonDataComplaints: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataCheckVers action.payload:', action.payload, );
      state.jsonDataComplaints = action.payload
    },
    setJsonDataComplaintsErr: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setJsonDataCheckVersErr action.payload:', action.payload, );
      state.jsonDataComplaintsErr = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const {
  setJsonDataPrompt,
  setJsonDataPromptErr,
  setJsonDataSlider,
  setJsonDataSliderErr,
  setJsonDataCheckVers,
  setJsonDataCheckVersErr,
  setJsonDataComplaints,
  setJsonDataComplaintsErr
} = jsonInfoSlice.actions

export default jsonInfoSlice.reducer