import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function DefaultBtn({
  onPress,
  title,
  disabled,
  customStyle,
  color="#ffffff"
}) {
  // console.log('disabled', disabled)

  return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? THEME.DARKBLUE : (disabled ?THEME.GREY200 : THEME.PRIMARY),
          },
          
          styles.container,
          disabled ? {} : mainstyles.shadowPrBtn,
          customStyle
        ]}>
        <Text style={[mainstyles.text16SB, {color: disabled ? THEME.GREY500 : color, textAlign: 'center',}]}>{title}</Text>
      </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 294,
    minWidth: '45%',
    maxWidth: '100%',
    borderRadius: 23,
    paddingVertical: 10,
    // shadowColor: 'rgba(62, 76, 185, 0.3)',
    elevation: 7
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});