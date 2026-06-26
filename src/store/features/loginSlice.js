import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuth: false,
  isLogin: false,
  isDisable: false,
  disabledMsg: '',
  role: null,
  userProfileInfo: null,
  userFormsInfo: null,
  driverFavoritsTenders: [],
  driverDeleteTenders: [],
  userFormsActivities: {
    "clientActiveTender": [],
    "driverActiveTender": [],
    "driverRoutesOffers": [],
    "driverTenderActivity": [],
  },
  userFormsHiddenTenders: {
    "blackListOfDriver": [],
    "hiddenTenders": [],
    "hiddenTendersClient": [],
  },
  userPhone: null,
  showWelcomeCaurusel: true,
  dateRefreshPosition: null,
  positionDriver: null,
  firstOpen: false,
  carsInfo: [],
  isActual: null,
  isActualError: null,
  checkUpdFormActivities: null,
  checkUpdFormsRouteOffers: null,
  checkArrayFormActivities: null,
  testData: null
}

//carsInfo перенести в другой стейт - юзера
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setTestData: (state, action) => {
      state.testData = action.payload
    },
    setIsActualInfo: (state, action) => {
      state.isActual = action.payload
    },
    setIsActualInfoError: (state, action) => {
      state.isActualError = action.payload
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload
    },
    userRole: (state, action) => {
      state.role = action.payload
    },
    setUserDisable: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setUserDisable action.payload:', action.payload,);
      state.isDisable = action.payload.flag
      state.disabledMsg = action.payload.text
    },
    setUserProfileInfo: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setUserProfileInfo action.payload:', action.payload, action.type);
      state.userProfileInfo = action.payload
      state.role = action.payload.role
      state.userPhone = action.payload.phone
    },
    setUserPhone: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'userPhone action.payload:', action.payload, action.type);
      state.userPhone = action.payload
    },
    setIsAuth: (state, action) => {
      state.isAuth = action.payload
    },
    setWelcomeCaurusel: (state, action) => {
      state.showWelcomeCaurusel = action.payload
    },
    setDateRefreshPosition: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setDateRefreshPosition action.payload:', action.payload, );
      state.dateRefreshPosition = action.payload
    },
    setPositionDriverWithTime: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setPositionDriverWithTime action.payload:', action.payload, );
      state.positionDriver = action.payload
    },
    setFirstOpen: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setFirstOpen action.payload:', action.payload, );
      state.firstOpen = action.payload
    },
    setCarsInfo: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setCarsInfo action.payload:', action.payload, );
      state.carsInfo = action.payload
    },
    setUserFormsInfoAll: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setUserFormsInfoAll action.payload:', action.payload, );
      //только обновление стейтов избранное и скрыть заявок
      state.userFormsInfo = action.payload
    },
    setUserFormsInfo: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'setUserFormsInfo action.payload:', action.payload, );
      //только обновление стейтов избранное и скрыть заявок
      state.userFormsInfo = action.payload
      state.driverFavoritsTenders = action.payload.faivorTenders
      state.driverDeleteTenders = action.payload.deleteTenders
      state.userFormsHiddenTenders = {
        "blackListOfDriver": action.payload.blackListOfDriver,
        "hiddenTenders": action.payload.hiddenTenders,
        "hiddenTendersClient": action.payload.hiddenTendersClient
      }
      state.userFormsActivities = {
        "clientActiveTender": action.payload.clientActiveTender,
        "driverActiveTender": action.payload.driverActiveTender,
        "driverRoutesOffers": action.payload.driverRoutesOffers,
        "driverTenderActivity": action.payload.driverTenderActivity,
      }
    },
    setDriverFavoritsTenders: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setDriverFavoritsTenders action.payload:', action.payload, );
      state.driverFavoritsTenders = action.payload
    },
    setDriverDeleteTenders: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setDriverDeleteTenders action.payload:', action.payload, );
      state.driverDeleteTenders = action.payload
    },
    setUserFormsActivities: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setUserFormsActivities action.payload:', action.payload, );
      state.userFormsActivities = action.payload
    },
    setCheckUpdFormActivities: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setCheckUpdFormActivities action.payload:', action.payload, );
      state.checkUpdFormActivities = action.payload
    },
    setUserFormsHiddenTenders: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setUserFormsHiddenTenders action.payload:', action.payload, );
      state.userFormsHiddenTenders = {
        "blackListOfDriver": action.payload.blackListOfDriver,
        "hiddenTenders": action.payload.hiddenTenders,
        "hiddenTendersClient": action.payload.hiddenTendersClient
      }
    },
    setCheckFormActivities: (state, action) => {
      console.log('\x1b[45m%s %s\x1b[0m', 'setCheckFormActivities action.payload:', action.payload,'state:', state.checkArrayFormActivities, );
      state.checkArrayFormActivities = null
      const driverActiveTender = state.userFormsActivities.driverActiveTender.slice()
      const driverRoutesOffers = state.userFormsActivities.driverRoutesOffers.slice()

      let findActivities = []
      let findOffers = []
      if(driverActiveTender?.length > 0) {
        findActivities = action.payload.activities.filter(elem => {
          if(!driverActiveTender.includes(elem.tenderId)) {
            return elem
          }
        })
      }
      if(driverRoutesOffers?.length > 0) {
        findOffers = action.payload.offers.filter(elem => {
          if(!driverRoutesOffers.includes(elem.tenderId)) {
            return elem
          }
        })
      }
      console.log('findActivities', findActivities,'findOffers',findOffers)
      if(findActivities?.length > 0 || findOffers?.length > 0) {

        state.userFormsActivities = {
          "clientActiveTender": state.userFormsActivities.clientActiveTender,
          "driverActiveTender": driverActiveTender.concat(findActivities),
          "driverRoutesOffers": driverRoutesOffers.concat(findOffers),
          "driverTenderActivity": state.userFormsActivities.driverTenderActivity,
        }
      }
    },
    logoutUser: (state, action) => {
      // console.log('\x1b[45m%s %s\x1b[0m', 'logoutUser action.payload:', action.payload, );
      state.isAuth = false
      state.isLogin = false
      state.isDisable = false
      state.disabledMsg = ''
      state.role = null
      state.userProfileInfo = null
      state.userFormsInfo = null
      state.driverFavoritsTenders = []
      state.driverDeleteTenders = []
      state.userFormsActivities = {
        "clientActiveTender": [],
        "driverActiveTender": [],
        "driverRoutesOffers": [],
        "driverTenderActivity": [],
      }
      state.userFormsHiddenTenders = {
        "blackListOfDriver": [],
        "hiddenTenders": [],
        "hiddenTendersClient": [],
      }
      state.userPhone = null
      state.showWelcomeCaurusel = true
      state.dateRefreshPosition = null
      state.positionDriver = null
      state.firstOpen = false
      state.carsInfo = []
      state.isActual = null
      state.isActualError = null
      state.checkUpdFormActivities = null
      state.checkUpdFormsRouteOffers = null
      state.checkArrayFormActivities = null
    },
  }
})

// Action creators are generated for each case reducer function
export const { 
  setTestData,
  setIsLogin,
  userRole,
  setUserProfileInfo,
  setUserPhone,
  setIsAuth,
  setWelcomeCaurusel,
  setDateRefreshPosition,
  setPositionDriverWithTime,
  setFirstOpen,
  setCarsInfo,
  setUserDisable,
  setIsActualInfo,
  setIsActualInfoError,
  setUserFormsInfoAll,
  setUserFormsInfo,
  setDriverFavoritsTenders,
  setDriverDeleteTenders,
  setUserFormsActivities,
  setCheckUpdFormActivities,
  setUserFormsHiddenTenders,
  setCheckFormActivities,
  logoutUser
} = loginSlice.actions

export default loginSlice.reducer