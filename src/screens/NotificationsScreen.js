import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { notificationOpenSettings } from '../util/permissions';
import { height, notifSettings, testObjAsk } from '../util/helperConst';
import { findJsonObj } from '../util/tools';

//components
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import InfoAskWindow from '../components/Modal/InfoAskWindow';

//styles
import { mainstyles } from '../theme';
import { requestNotifications } from 'react-native-permissions';
import { getFCMToken, requestUserPermissionNotif } from '../util/notificationhelpers';
import { put } from '../store/features/api/user-api';
import { setNotifStatus } from '../store/features/addPermissionsSlice';
import { updateProfile } from '../util/userprofile';
import { getUserFormDataFromDB } from '../store/features/api/userInfoForms';

//modal
export const NotificationsScreen = ({ navigation }) => {
  console.log('NotificationsScreen', );
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const { notifStatus } = useSelector(state=>state.permissions) 
  const { userFormsInfo,userProfileInfo } = useSelector(state=>state.login) 
  const [isShowDialog, setIsShowDialog] = useState(true)
  const dispatch =  useDispatch()

  const askNotifications = async () => {
    const status = await requestUserPermissionNotif()
    // alert(status)
    console.log('status',status)
    dispatch(setNotifStatus(status))
    
  }

  const onFCMTokenCreate = async () => {
    console.log('onFCMTokenCreate start', userFormsInfo.profile )
    try {
      if(userFormsInfo?.profile?.fcm_token === null || userFormsInfo?.profile?.fcm_token === undefined) {
        const token = await getFCMToken()
  
        let objForm = {
          name: userProfileInfo.name,
          role:  userProfileInfo.role,
          email:  userProfileInfo.email,
          phone: userProfileInfo.phone,
          fcm_token: token
        }
        console.log('objForm', objForm)
        const respFormFcm = await put('users/me',objForm)
        if (!respFormFcm.success) {
          console.warn('Ошибка запроса respFormFcm:', respFormFcm.error);
        }
        console.log('respFormFcm', respFormFcm.data)
        await getUserFormDataFromDB(dispatch)
        // updateProfile(dispatch,respFormFcm.data)

        // let objForm = {
        //   'profile': {
        //     fcm_token: token
        //   }
        // }
        // const respFormFcm = await put('forms',objForm)
        // if (!respFormFcm.success) {
        //   console.warn('Ошибка запроса respFormFcm:', respFormFcm.error);
        //   alert(`Ошибка запроса respFormFcm ${respFormFcm.error}`)
        // }
        // console.log('respFormFcm', respFormFcm.data)
      }
    } catch (error) {
      alert(`Ошибка onFCMTokenCreate ${error}`)
    }
    

  }
  useEffect(() => {
    askNotifications()
  },[])

  useEffect(() => {
    console.log('notifStatus', notifStatus)
    if(notifStatus === 'granted') {
      onFCMTokenCreate()
    }
  },[notifStatus])

  console.log('notifStatus', notifStatus)
  // console.log('jsonDataPrompt', jsonDataPrompt)
  
  return (
    <View style={styles.container}>
      {
        isShowDialog && notifStatus !== null ?
          <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
            <InfoAskWindow data={findJsonObj(jsonDataPrompt,'notifSettings',notifSettings)}
            customStyleBtn1={{width: '50%'}} 
            customStyleBtn2={{}}
            onClose={()=>navigation.goBack()} 
            onPress={()=>{notificationOpenSettings(),setIsShowDialog(false)}}/>
          </View>
        : 
        // null
      <DefaultBtn title={'Назад'} onPress={()=>navigation.goBack()}/>
    }
    {
      (notifStatus === null || notifStatus === undefined) &&
      <DefaultBtn title={'Разрешить отправку нотификаций'} onPress={askNotifications}/>
    }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
});