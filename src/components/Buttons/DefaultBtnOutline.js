import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function DefaultBtnOutline({
  onPress,
  title,
  disabled,
  customStyle,
  disColor=THEME.GREY200,
  disTextStyle=THEME.GREY500,
  color=THEME.PRIMARY,
  textStyles
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? THEME.PRIMARY : (disabled===true ? disColor : '#fff'),
        },
        styles.container,
        disabled ? {} : mainstyles.shadowPrBtn,
        customStyle
      ]}>
          {({pressed}) => (
      <Text style={[mainstyles.text16SB, {color:  pressed? "#ffffff":(disabled===true ? disTextStyle : color), textAlign: 'center',},textStyles]}>{title}</Text>
          )}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    borderColor: THEME.PRIMARY,
    borderWidth:2,
    // backgroundColor: '#fff',
    height: 45,
    // width: '100%',
    minWidth: '45%',
    maxWidth: '100%',
    borderRadius: 23,
    paddingVertical: 10,
    shadowColor: 'rgba(62, 76, 185,0.8)',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    // color: ,
  },
});