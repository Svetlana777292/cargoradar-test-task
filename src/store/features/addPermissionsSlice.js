import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifStatus: null,
  geolocationStatus: null,
  galleryStatus: null,
  cameraStatus: null,
}

export const addPermissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setNotifStatus: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setNotifStatus action.payload:', action.payload);
      state.notifStatus = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setNotifStatus,
} = addPermissionsSlice.actions

export default addPermissionsSlice.reducer