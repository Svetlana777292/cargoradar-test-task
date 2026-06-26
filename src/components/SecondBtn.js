import React from 'react';
import {StyleSheet, Text, Pressable, ViewStyle, TextStyle} from 'react-native';
import { THEME } from '../theme';

export function SecondBtn({
  title,
  onPress,
  color1=THEME.LIGHTBLUE_COLOR,
  color2=THEME.BLUE_COLOR,
  customStyle,
  colorText,
  disable
}) {
  // const colorPressOn = color1 ? color1 : THEME.LIGHTBLUE_COLOR
  // const colorPressOut = color2 ? color2 : THEME.BLUE_COLOR
  // console.log('customStyle', customStyle)
  // console.log('color2', color2)
  return (
    <Pressable
      // disabled={disable}
      onPress={onPress}
      style={({pressed}) => [
        {
          // backgroundColor: pressed ? 'red' : 'pink',
          backgroundColor: pressed ? color1 : color2,
          // backgroundColor: disable ? '#ccc' : color2,
        },
        styles.container,
        customStyle
      ]}>
      <Text style={[styles.text, colorText ? {color: colorText} : null]}>{title}</Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: 45,
    minWidth: '45%',
    maxWidth: '100%',
    // marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: THEME.BLUE_COLOR
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});