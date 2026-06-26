// import { createStore, combineReducers, applyMiddleware } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistCombineReducers,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Middleware
// import thunk from 'redux-thunk'
// import logger from 'redux-logger';

// Reducers
import userSlice from './features/userSlice'
import loginSlice from './features/loginSlice'
import addTenderSlice from './features/addTenderSlice';
import transportSlice from './features/transportSlice';
import tenderSlice from './features/tenderSlice';
import notificationSlice from './features/notificationSlice';
import filtersSlice from './features/filtersSlice';
import chatsSlice from './features/chatsSlice';
import editTenderSlice from './features/editTenderSlice';
import addRouteSlice from './features/addRouteSlice';
import editRouteSlice from './features/editRouteSlice';
import listOfChatsSlice from './features/listOfChatsSlice';
import jsonInfoSlice from './features/jsonInfoSlice';
import addPermissionsSlice from './features/addPermissionsSlice';


const persistConfig = {
  key: 'root', 
  storage: AsyncStorage,
  whitelist: ['login', 'notification','chats','permissions'],
  // whitelist: ['login'],
  debug: true,
  stateReconciler: autoMergeLevel2
  // blacklist: ['cities']
}

const rootReducer = persistCombineReducers(persistConfig, {
  jsoninfo: jsonInfoSlice,
  user: userSlice,
  login: loginSlice,
  addTender: addTenderSlice,
  transport: transportSlice,
  tender: tenderSlice,
  notification: notificationSlice,
  filters: filtersSlice,
  chats: chatsSlice,
  editTender: editTenderSlice,
  addRoute: addRouteSlice,
  editRoute: editRouteSlice,
  listofchats: listOfChatsSlice,
  permissions: addPermissionsSlice,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    // serializableCheck: {
    //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    // },
  }),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})
// export const store = createStore(rootReducer, applyMiddleware(thunk))
// export const store = createStore(rootReducer, applyMiddleware(thunk, logger))

export const persistor = persistStore(store)