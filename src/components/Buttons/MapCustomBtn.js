import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function MapCustomBtn({
  onPress,
  children
}) {
  
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? THEME.GREY100 : '#ffffff',
        },
        styles.container,
        mainstyles.shadowG5r8,
      ]}>
        {children}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // padding: 10,
    elevation: 10,
    marginBottom: 10
  },
});