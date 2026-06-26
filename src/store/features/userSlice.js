import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userProfile: null, //!не используется удалить
  userPhoto: null, //!не используется удалить
  isLoadingUpdProf: false,
  tenderDelete: [],
  hiddenTender: [],
  hiddenTenderClient: [],
  tenderFaivor: [],
  blacklist: [],
  tendersActivity: [],
  clientActiveTender: [],
  driverRoutesOffers: [],
  driverActiveTender: [],
  navigationObjTo: null,
  currentPosition: null,
  currentPositionWithAddress: null,
  status: null,
  currentDate: null,
  isConnectedInternet: null,
  showInfoModal: false,
  statusGps: '',
  version: '1.0.8',
  ios: '55'
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onSaveCurrPosition: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onSaveCurrPosition action.payload:', action.payload);
      state.currentPosition = action.payload
    },
    onSaveCurrPositionWithAddress: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'onSaveCurrPositionWithAddress action.payload:', action.payload);
      state.currentPositionWithAddress = action.payload
    },
    userProfile: (state, action) => {
      state.userProfile = action.payload
    },
    userPhoto: (state, action) => {
      state.userPhoto = action.payload
    },
    isLoadingUpdProf: (state, action) => {
      state.isLoadingUpdProf = action.payload
    },
    userProfileTenderDelete: (state, action) => {
      state.tenderDelete = action.payload
    },
    userProfileTenderHidden: (state, action) => {
      console.log('userProfileTenderHidden action.payload:', action.payload)
      state.hiddenTender = action.payload
    },
    userProfileTenderHiddenClient: (state, action) => {
      console.log('userProfileTenderHiddenClient action.payload:', action.payload)
      state.hiddenTenderClient = action.payload
    },
    userProfileTenderFaivor: (state, action) => {
      state.tenderFaivor = action.payload
    },
    userProfileBlackList: (state, action) => {
      // console.log('userProfileBlackList action.payload:', action.payload)
      state.blacklist = action.payload
    },
    setNavigationObjTo: (state, action) => {
      console.log('setNavigationObjTo action.payload:', action.payload)
      state.navigationObjTo = action.payload
    },
    setCurrentDate: (state, action) => {
      // console.log('setCurrentDate action.payload:', action.payload)
      state.currentDate = action.payload
    },
    setConnectedInternet: (state, action) => {
      // console.log('setConnectedInternet action.payload:', action.payload)
      state.isConnectedInternet = action.payload
    },
    setSatatusGeolocation: (state, action) => {
      // console.log('setSatatusGeolocation action.payload:', action.payload)
      state.status = action.payload
    },    
    setShowInfoModal: (state, action) => {
      // console.log('setShowInfoModal action.payload:', action.payload)
      state.showInfoModal = action.payload
    },    
    setShowStatusGps: (state, action) => {
      // console.log('setShowStatusGps action.payload:', action.payload)
      state.statusGps = action.payload
    },    
    setDriverTenderAvtivity: (state, action) => {
      // console.log('setDriverTenderAvtivity action.payload:', action.payload, 'state.tendersActivity:',state.tendersActivity)
      state.tendersActivity = action.payload
    },    
    setClientActiveTenderState: (state, action) => {
      // console.log('setClientActiveTenderState action.payload:', action.payload, 'state.clientActiveTender:',state.clientActiveTender)
      state.clientActiveTender = action.payload
    },    
    setDriverRoutesOffersState: (state, action) => {
      // console.log('setDriverRoutesOffersState action.payload:', action.payload, 'state.driverRoutesOffers:',state.driverRoutesOffers)
      state.driverRoutesOffers = action.payload
    },    
    setDriverActiveTenderState: (state, action) => {
      // console.log('setDriverActiveTenderState action.payload:', action.payload, 'state.driverActiveTender:',state.driverActiveTender)
      state.driverActiveTender = action.payload
    },    
  },
})

export const { 
  onSaveCurrPosition,
  userProfile, 
  userPhoto, 
  isLoadingUpdProf,
  userProfileTenderDelete,
  userProfileTenderHidden,
  userProfileTenderHiddenClient,
  userProfileTenderFaivor, 
  userProfileBlackList,
  setNavigationObjTo,
  setCurrentDate,
  onSaveCurrPositionWithAddress,
  setConnectedInternet,
  setSatatusGeolocation,
  setShowInfoModal,
  setShowStatusGps,
  setDriverTenderAvtivity,
  setClientActiveTenderState,
  setDriverRoutesOffersState,
  setDriverActiveTenderState
} = userSlice.actions

export default userSlice.reducer