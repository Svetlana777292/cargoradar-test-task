import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { mainstyles } from '../../theme';

const InputBtLine = (props) => {
// console.log('props', props)
  return (
    <TextInput    
      style={[mainstyles.inputL,props?.styleInput]}
      value={props.value}
      onChangeText={props.setValue}
      placeholder={props.plctext}
      {...props?.inputProps}
    />
  )
}

const styles = StyleSheet.create({

})
export default InputBtLine;