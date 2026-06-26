import React from 'react';
import {  Text, View, StyleSheet, Platform, } from 'react-native';

//packages
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';

//functions && features && slice

//components
import BackArrow from '../Svg/BackArrow';
import { BtnIconTrs } from '../Buttons/BtnIconTrs';

//styles
import { THEME, mainstyles } from '../../theme';

export const HeaderTitleComponentNoBg = (props) => {
  const {
    onPress,
    customStyle,
    title,
    titleStyles,
    titleWrapStyles,
    icon=true
    } = props
  const safeInsets = useSafeAreaInsets();

  const handlePress = () => {
    onPress()
  }
  // safeInsets?.top
  return (
      <LinearGradient colors={['rgba(255,255,255,1)','rgba(255,255,255,0.7)','rgba(255,255,255,0)']} 
        style={[styles.container, Platform.OS ==='ios' ? {minHeight: safeInsets?.top+20}: null, customStyle,]}
        useAngle angle={180}>
        <View style={styles.row}>
          {
            icon ?
            <BtnIconTrs onPress={handlePress} customStyles={[styles.btn,styles.btnGoback]}>
              <BackArrow />
            </BtnIconTrs>
            : 
            null
          }
          <View style={[styles.title,titleWrapStyles]}>
            <Text style={[mainstyles.text17R,{color:THEME.GREY900},titleStyles]}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    // height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 5,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  row: {
    // backgroundColor: 'pink',
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  title: {
    // backgroundColor: 'orange',
    alignItems: 'center',
    // width: '85%',
    // paddingLeft: 40
  },
  btn: {
    // backgroundColor: 'blue',
    // width: '20%',
    // alignItems: 'flex-start'
  },
  btnGoback: {
    // backgroundColor: 'green',
    position: 'absolute',
    left: 15,
    width: '20%',
    width: 40,
    height: 40,
    alignItems: 'flex-start'
  }
});