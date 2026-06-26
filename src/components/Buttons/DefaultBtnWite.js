import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function DefaultBtnWite({
  onPress,
  title,
  disabled,
  color=THEME.PRIMARY,
  customStyles
}) {
  return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({pressed}) => [
          {
            backgroundColor: pressed ? THEME.DARKBLUE : (disabled ?THEME.GREY200 : "#ffffff"),
          },
          styles.container,
          {
            elevation: disabled? 0: 7
          },
          disabled ? {} : mainstyles.shadowG5r5,
          customStyles
        ]}>
          {({pressed}) => (
        <Text style={[mainstyles.text16SB, {color: pressed? "#ffffff":(disabled ? THEME.GREY500 : color), textAlign: 'center',}]}>{title}</Text>
        )}
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
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});