import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TextInput, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';

//packages
// import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';

//functions && features && slice
import { getProfileUserInfo, getTenderHiddenClient } from '../../util/firebase';
import { firebeseUpdateTender, sendTestimonials } from '../../util/tenders';
import { finishTenderErr, height } from '../../util/helperConst';
import { messageIdGenerator } from '../../util/msgGenerator';
import { userProfileTenderHiddenClient } from '../../store/features/userSlice';
import { findJsonObj } from '../../util/tools';

//components
import { CloseBtn } from '../CloseBtn';
import IconUserAvatar from '../Svg/IconUserAvatar';
import IconStarSmallF from '../Svg/IconStarSmallF';
import { DefaultBtnWite } from '../Buttons/DefaultBtnWite';
import { DefaultBtnOutline } from '../Buttons/DefaultBtnOutline';
import { SetUserRating } from '../SetUserRating';
import PromptComponent from '../Modal/PromptComponent';

//styles

import { THEME, mainstyles } from '../../theme';

export const ProfileInfoWithTestimonial = (props) => {
  const { partnerProfile,tenderState, onClose, onPress } = props

  // const {role, partnerId,userProfile, data, onClose, onPress, driverInfo } = props
  const scrollRef = useRef()
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const { userFormsInfo, userProfileInfo, role } = useSelector((state) => state.login) //hiddenTenderClient
  const [userInfo, setUserInfo] = useState(null)
  const [userRating, setUserRating] = useState(0);
  const [isDisableBtn, setIsDisableBtn] = useState(true)
  const [description, setDiscription] = useState('')
  const [onError, setOnError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const text = role ==='driver' ? 'Созданные заказы':'Выполненные заказы'
  const counter = role ==='driver' ?  partnerProfile?.profile.quantityTenders: partnerProfile.profile?.quantityOfFinished
  const dispatch = useDispatch()

  // console.log('userProfile', userProfile, 'partnerId',partnerId)
  // console.log('data', data)

  const handleGetData = async () => {
    setIsLoading(true)
    try {
      const userData = await getProfileUserInfo(partnerId)
      // console.log('userData', userData)
      if(userData) {
        setUserInfo(userData)
      }
      setIsLoading(false)
      
    } catch (error) {
      console.log('error', error)
      setIsLoading(false)
    }
  }

  const handleSendTestim = async () => {
    //отзыв от водителя - 
    try {
      setIsLoading(true)
      if(role==='driver') {
        // console.log('role driver', role)
        const respTestim = await sendTestimonials(
          partnerProfile,
          userFormsInfo,
          tenderState,
          role,
          description,
          userRating,
          setOnError,
          onPress,
          onClose

          // data.id, 
          // userProfile.userId, 
          // role, 
          // partnerId, 
          // description, 
          // userRating, 
          // firebeseUpdateTender, 
          // onClose,
          // setOnError,
          // messageIdGenerator,
          // onPress,
          // setIsLoading,
          // data,
          // userProfile?.userInfo?.driverAvatar
        )
        if(respTestim !== null && respTestim !== undefined) {
          // setTender(respTestim)
          onPress()
        }
        onClose()
        // .then((res) => {
        //   // firestore().collection('forms')
        //   // .doc(userProfile.userId)
        //   // .update({'profile.quantityOfFinished': firestore.FieldValue.increment(1)})
        //   // .catch((err) => {setIsLoading(false),console.log('increment err', err)})
        // })
      } else {
        // console.log('role', role)
        const respTestim = await sendTestimonials(
          partnerProfile,
          userFormsInfo,
          tenderState,
          role,
          description,
          userRating,
          setOnError,
          onPress,
          onClose


          // data.id, 
          // userProfile.userId, 
          // role, 
          // partnerId, 
          // description, 
          // firebeseUpdateTender, 
          // onClose,
          // setOnError,
          // messageIdGenerator,
          // onPress,
          // setIsLoading,
          // data,
          // null,
          // hiddenTenderClient,
          // getTenderHiddenClient,
          // dispatch,
          // userProfileTenderHiddenClient,
        )
        if(respTestim !== null && respTestim !== undefined) {
          // setTender(respTestim)
          onPress()
        }
        onClose()
        // .then((res)=>{
          
        //   // firestore().collection('forms')
        //   // .doc(userProfile.userId)
        //   // .update({'profile.quantityTenders': firestore.FieldValue.increment(1)})
        //   // .catch((err) => {setIsLoading(false),console.log('increment err', err)})
        // })
      }
      
    } catch (error) {      
      setIsLoading(false)
    }
  }

  // useEffect(()=>{
  //   handleGetData()
  // },[props])

  useEffect(()=>{
    if(description&&description?.trim()?.length>0) {
      setIsDisableBtn(false)
    } else {
      setIsDisableBtn(true)
    }
  },[description])

  return (
    <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} useAngle angle={-90} 
      style={[styles.wrapper,{height: height+safeInsets.top,paddingTop: safeInsets.top}]}>
        <CloseBtn nameBtn={'cross'} onPress={onClose} sizeBtn={30} colorBtn={'#fff'} styleBtn={[styles.close,{top: safeInsets.top}]}/>
        {
          isLoading ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height+safeInsets.top,zIndex: 99999}]}>
              <ActivityIndicator color='#fff' size='large'/>
            </View>
          : 
          null
        }
        {
          onError ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, minHeight: height+safeInsets.top,zIndex: 99999}]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'finishTenderErr',finishTenderErr)} onPress={()=>setOnError(false)}/>
            </View>
          : 
          null
        }
        {
          partnerProfile!==null&&partnerProfile!==undefined ?
          <View style={[mainstyles.pH25,{paddingTop: safeInsets.top+15,flex:1,paddingBottom: Platform.OS==='ios'? 0 : 65}]}>
            <ScrollView style={[{backgroundColor: 'transparent'}]} ref={scrollRef} showsVerticalScrollIndicator={false}>

              <View style={[{alignItems: 'center'}]}>
                {
                  role === 'client' ?
                  <View style={[mainstyles.pB15]}>
                    {
                      partnerProfile.profile.driverAvatar?.length > 0 ?
                      <Image source={{uri: partnerProfile.profile.driverAvatar }} style={[styles.avatar]}/>
                      :
                      <IconUserAvatar />
                    }
                  </View>
                  :
                  <View style={[mainstyles.pB15]}>
                    {
                      partnerProfile.profile.clientAvatar?.length > 0 ?
                      <Image source={{uri: partnerProfile.profile.clientAvatar}} style={[styles.avatar]}/>
                      :
                      <IconUserAvatar />
                    }
                  </View>
                }
                <View>
                  <Text style={[mainstyles.text22SB,{color: '#fff', paddingBottom: 20}]}>{partnerProfile?.profile.name}</Text>
                </View>
                <View style={[mainstyles.rowalC,mainstyles.pB15]}>
                  <Text style={[mainstyles.text15R,{color: '#fff',paddingRight: 10,}]}>Рейтинг: {partnerProfile?.profile.rating}</Text>
                  <IconStarSmallF />
                </View>
                <View style={[mainstyles.btnWhite,]}>
                  <Text style={[mainstyles.text14M,]}>{partnerProfile?.profile.phone}</Text>
                </View>
                <Text style={[mainstyles.text16M,{color: '#fff',paddingTop: 25}]}>{text}: {counter}</Text>
                
              </View>
              <KeyboardAvoidingView behavior={Platform.OS==='android'? 'padding': 'height'}>
                <View style={[{paddingTop: 15, paddingBottom: 35}]}>
                  <View style={[styles.titleDisct,styles.whiteComponent,{paddingTop: 2}]}>
                    <View style={[mainstyles.botLineGr]}>
                      <SetUserRating value={userRating} onPress={setUserRating}/>
                    </View>
                    <TextInput 
                      blurOnSubmit={true}
                      style={[mainstyles.text14R,{paddingTop: 10}, Platform.OS==='ios'? {minHeight: 130}: null]}
                      textAlignVertical='top'
                      placeholder='Кратко опишите условия сотрудничества...'
                      placeholderTextColor={THEME.GREY700}
                      value={description}
                      onChangeText={setDiscription}
                      // onFocus={()=> scrollRef?.current.scrollToEnd({animated: false})}
                      multiline={true}
                      numberOfLines={5}
                    />
                    <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{description?.length >0? description?.length: 0} | 300</Text>

                  </View>

                  <View style={[mainstyles.rowalCjcSb,{paddingTop: 15,}]}>
                    <View style={[styles.qwe,{width: '45%'}]}>
                      <DefaultBtnWite title={'Сохранить'} disabled={isDisableBtn} onPress={handleSendTestim} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
                    </View>
                    <View style={[styles.qwe,{width: '45%'}]}>
                      <DefaultBtnOutline title={'Отменить'} onPress={onClose} color='#fff' customStyle={[styles.btnCustomStyle,{width: '100%',height: 58, backgroundColor: 'transparent', borderColor: '#fff',elevation: 0, shadowColor: 'transparent' }]}/>
                    </View>
                  </View>
                </View>

              </KeyboardAvoidingView>
            </ScrollView>
          </View>
          : null
        }<KeyboardAvoidingView behavior={Platform.OS==='ios'? 'padding': 'height'}/>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'relative',
    height: height,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex:1,
    width: '100%',
  },
  close: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 998
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: THEME.GREY400
  },
  titleDisct: {
    position: 'relative',
    // backgroundColor: 'blue',
    // paddingVertical: 20
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    bottom: 15,
    right: 15
  },
  whiteComponent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 7,
    padding: 15,
  },
  btnCustomStyle: {
    height: 55, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
  },
})