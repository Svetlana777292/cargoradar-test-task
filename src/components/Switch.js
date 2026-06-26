import React, { useRef,useEffect } from 'react';
import { Animated, Text, TouchableOpacity, TouchableWithoutFeedback,View } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../theme';


export const Switch = ({customStyle,disabled,value,setValue,color1=THEME.PRIMARY,gradient=[THEME.GREY200,THEME.GREY200]}) => {
  // console.log('Switch', value)

  const moveItem = useRef(new Animated.Value(value?0:1)).current;
  
  const moveRight = () => {
    Animated.timing(moveItem, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const moveLeft = () => {
    Animated.timing(moveItem, {
      toValue: +!value,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const xVal = moveItem.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 22],
  });

  const animStyle = {
    transform: [
      {
        translateX: xVal,
      },
    ],
  };
  // let valueMove= value?2:22
  const move= () => {
    // value?moveLeft():moveRight()
    // moveLeft()
    setValue(!value)
    // if(value===true) {
    //   valueMove=2
    // } else {
    //   valueMove=22
    // }

  }

  return (
    <TouchableWithoutFeedback onPress={()=>move()} disabled={disabled}>

      <LinearGradient colors={gradient} 
        style={[{width: 60,height: 27,borderRadius: 30,justifyContent: 'center',padding:0,borderWidth:1,borderColor: THEME.GREY200},customStyle]}>
          <View style={[{
            position: 'absolute',
            top: 3,
            left: 0,
            width:19,height:19,backgroundColor: value ?color1:'#fff',borderRadius: 30
            },{transform:[{translateX: value?35:3}]}]}></View>
        </LinearGradient>
    </TouchableWithoutFeedback>
  )
}
