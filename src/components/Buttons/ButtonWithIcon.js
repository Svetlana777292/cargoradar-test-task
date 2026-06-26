import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function ButtonWithIcon({
  title,
  onPress,
  children,
  customStyles,
  customTextStyles,
  disabled,
  color=THEME.PRIMARY,
  textColor='#fff',
  pressedColor=THEME.DARKBLUE
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? pressedColor : (disabled ? THEME.GREY200 : color),
        },
        styles.container,
        disabled ? {} : mainstyles.shadowPrBtn,
        customStyles
      ]}>
        {children}
        <Text style={[mainstyles.text10R, {paddingTop: 4,color: disabled ? THEME.GREY600 : textColor, textAlign: 'center',},customTextStyles]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    minHeight: 66,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    paddingVertical: 2,
    paddingHorizontal: 2,
    elevation: 10,
    shadowColor:THEME.PRIMARY

    // marginBottom: 10
  },
});