import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ScrollView,Platform, Dimensions, KeyboardAvoidingView } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { isLogin, setIsAuth, setUserProfileInfo, userRole } from '../store/features/loginSlice';
import { writeLog } from '../util/firebase';
import { height, width } from '../util/helperConst';

//components
import TopFloatBg from '../components/Svg/TopFloatBg';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';

//styles
import { THEME, mainstyles } from '../theme';
import { ButtonWithIcon } from '../components/Buttons/ButtonWithIcon';
import { normalize } from '../util/UI/fontsUI';

export const DisableScreen = ({navigation}) => {
  console.log('DisableScreen ', )
  const safeInsets = useSafeAreaInsets();
  // const navigation = useNavigation()
  const dispatch =  useDispatch()
  const { disabledMsg } = useSelector((state) => state.login)
  const userIsLogged = useSelector((state) => state.login.isLogin)
  const version = useSelector((state) => state.user.version)
 
  const handleLink = (flag) => {
    switch (flag) {
      case 'condition':
        Linking.openURL('https://cargogo.pro/terms-of-use.html') 
        break;
      case 'privacy':
        Linking.openURL('https://cargogo.pro/privacy-policy.html')
        break;
      case 'support':
        Linking.openURL('https://cargogo.pro/support')
        break;
    
      default:
        break;
    }
  }  
  const handleGoAuth = () => {
    // dispatch(setUserDisable({flag: false, text: ''}))
    navigation.navigate('Auth')
  }
  

  console.log('-----render----', );
    
// navigation.navigate('CreateProfile')

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'padding'} 
      style={{flex:1}}
    >
    <View style={[styles.container]} scrollEnabled={false}>
      {/* {
        isLoading  ?
        <View style={[mainstyles.containerModalGgBl,{minHeight: height,flex:1,zIndex: 999,justifyContent: 'center',}]}>
          <ActivityIndicator color={'#fff'} size={'large'}/>
        </View>
        :null
      } */}
      <ScrollView contentContainerStyle={{backgroundColor: 'transparent',minHeight: height}}>
        <View style={styles.topWrapper}>
          <View style={styles.imgContainer}>
            <TopFloatBg />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={[mainstyles.text32SB,{color: '#fff',textAlign: 'center', paddingBottom: 10}]}>Добро пожаловать!</Text>
            <Text style={[mainstyles.text16R,{color: '#fff',textAlign: 'center',}]}>Вы заблокированы</Text>
          </View>
        </View>

        <View style={[styles.wrapper]}>

          <View style={[styles.midContainera,{position: 'relative', paddingBottom: 30}]}>
            <View style={{width:'80%', alignSelf: 'center'}}>
              <Text style={[mainstyles.text18R,styles.textMid]}>Ваши действия в аккаунте носят запрещенный характер,в связи с чем была выполнена его блокировка! </Text>
              <Text style={[mainstyles.text16R,{color:THEME.REDERR,textAlign: 'center'}]}>{disabledMsg}</Text>
            </View>
            <View style={{position: 'relative'}}>              
            </View>
          </View>

          <View style={[styles.bottomContainer]}>

            <View style={[styles.midBtnContainera, mainstyles.pV10,]}>
              <ButtonWithIcon title={'Поддержка'} onPress={()=>{handleLink('support')}}
               customStyles={[mainstyles.rowalCjcC,{marginBottom: 15}]}
               customTextStyles={[mainstyles.text16SB, {color: '#fff',lineHeight: 14 }]}>
                <View style={{borderRadius:25, borderWidth:1 , borderColor: '#fff', width: 20, height: 20, marginRight: 5,justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[mainstyles.text12SB,{color: '#fff',textAlign: 'center'}]}>?</Text>
                </View>
              </ButtonWithIcon>

              <DefaultBtn title={'Вход'} onPress={()=> handleGoAuth()} customStyle={{}}/>          
            </View>
            <View style={styles.botTextContainer}>
              <Text style={[mainstyles.text14R,{textAlign: 'center', lineHeight: 20}]}>Напоминаем, создавая аккаунт, вы соглашались с <Text style={mainstyles.text14B} onPress={()=>handleLink('condition')}>Условиями обслуживания</Text> 
              <Text style={mainstyles.text14R}> и </Text><Text style={mainstyles.text14B} onPress={()=>handleLink('privacy')}>Политикой конфиденциальности</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  </KeyboardAvoidingView>
  )
  




}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffffff', 
    width:width,
  },
  wrapper: {
    // height: height,
    // backgroundColor: 'orange', 
    flex: 1,
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20
  },
  topWrapper: {
    // backgroundColor: 'red', 
    position: 'relative',
    width: width,
    // flex: 1,
    height: 262,
  },
  imgContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  topTextContainer: {
    // backgroundColor: 'orange',
    position: 'absolute',
    top: 85,
    width: '73%',
    alignSelf: 'center',
    zIndex: 11,
  },
  midContainer: {
    // backgroundColor: 'pink',
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMid: {
    textAlign: 'center', 
    paddingBottom: 15, 
    lineHeight: 26, 
    // paddingTop: 15
  },
  midBtnContainer: {
    // backgroundColor: 'orange',
    flex: 0.4,
  },
  botTextContainer: {
    // backgroundColor: 'lightblue', 
    alignSelf: 'center', 
    width: '75%', 
    justifyContent: 'flex-end', 
  },
  codeFieldRoot: {
    // backgroundColor: 'purple',
    // backgroundColor: '#fff',
    backgroundColor: 'transparent'
  },
  cellWrapper: {
    width: 33,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: THEME.GREY400,
    // shadowColor: 'red',
    // shadowOffset: {width:1, height:2},
    // shadowRadius:1,
    marginHorizontal: 10,
    // backgroundColor: 'red'
    
  },
  cell: {
    height: 40,
    textAlign: 'center',
    lineHeight: 38,
    fontSize: normalize(24),
  },
  focusCell: {
    backgroundColor: THEME.GREY50
  },
  resendCodeWrapper: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1, 
    justifyContent: 'space-between',
  },
});