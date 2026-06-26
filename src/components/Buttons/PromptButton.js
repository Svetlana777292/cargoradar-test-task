import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { THEME, mainstyles } from '../../theme';

export function PromptButton({
  onPress,
  customStyles,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        customStyles
      ]}>
        <View style={styles.inner}>
          <Text style={[mainstyles.text14R,{color: '#fff'}]}>?</Text>
        </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.GREY400,
    justifyContent: 'center',
    alignItems: 'center',
  },
});