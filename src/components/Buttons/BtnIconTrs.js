import React from 'react';
import { StyleSheet,  Pressable } from 'react-native';

export function BtnIconTrs({
  onPress,
  children,
  customStyles,
  pressedColor='transparent'
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? pressedColor : 'transparent',
        },
        
        styles.container,
        customStyles
      ]}>
        {children}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});