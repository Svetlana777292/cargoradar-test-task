import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
import { THEME } from '../theme';

export const CloseBtn = ({nameBtn, sizeBtn, colorBtn, onPress, styleBtn}) => {

  return (
    <TouchableOpacity style={styleBtn} onPress={onPress}>
      <Icon name={nameBtn} size={sizeBtn} color={colorBtn ? colorBtn : THEME.MAIN_COLOR}/>
    </TouchableOpacity>
    
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
// });