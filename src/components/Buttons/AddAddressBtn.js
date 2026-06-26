import React from 'react';
import { Text, View, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

//packages

//functions && features && slice

//components
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import IconPinSmallFill from '../Svg/IconPinSmallFill';

//styles
import { THEME, mainstyles } from '../../theme';

export const AddAddressBtn = (props) => {
  // console.log('AddAddressBtn', )
  const {
    data,
    onPressAddress,
    point
  } = props;

  return (
    <Pressable style={[styles.input,mainstyles.shadowG5r5,{flexDirection: 'row', justifyContent: 'space-between',}]} onPress={onPressAddress}>
      <View style={{width: '10%', backgroundColor: 'transparent',justifyContent: 'center',alignItems: 'flex-end', paddingHorizontal: 5}}>
        {
          point==='start'?
          <IconPinSmallOt />
          :
          <IconPinSmallFill />
        }
      </View>
      {
        data===null?
        <Text style={[mainstyles.text14R,{ width: '70%',color: THEME.GREY800,textAlign: 'left', backgroundColor: 'transparent'}]}>Выберите адрес...</Text>
        :
        <Text style={[mainstyles.text14R,{ width: '70%',color: THEME.GREY800,textAlign: 'left', backgroundColor: 'transparent'}]}>{data.address}</Text>
      }
        <View style={{width: '20%',justifyContent: 'center', paddingHorizontal: 5}}>
        
        <View style={{
          alignItems: 'center'
          }}>
          <Image source={require('./../../../assets/image/icon013.png')} style={{width:30,height:30}}/>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: height > 730 ? 30 : 15,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  input: {    
    width: '93%',
    height: 60,
    // flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    // paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
    
  },
});