import React, { useEffect, useRef } from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';

//packages
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFormDataFromDB } from '../store/features/api/userInfoForms';

export const GetData = () => {
  const {isLogin, userFormsInfo} = useSelector((state) => state.login)
  const dispatch = useDispatch()
  // console.log('\x1b[45m%s %s\x1b[0m',' GetData isLogin', isLogin, 'userFormsInfo',userFormsInfo)
  
  useEffect(() =>{
    // console.log('\x1b[46m%s %s\x1b[0m',' useEffect GetData 1',)
    
    if(!isLogin) {
      return
    }
    // console.log('\x1b[46m%s %s\x1b[0m',' useEffect GetData 2',)
    getUserFormDataFromDB(dispatch,'FLAG GetData')
  },[])

  return null;

}