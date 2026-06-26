import React from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { THEME, mainstyles } from '../../theme';
import IconPinSmallFill from '../Svg/IconPinSmallFill';

export const EndCarouselPoints = (props) => {
  const {
    item
  } = props
  console.log('props', props)
  return (
    <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
      
      {
        item?.typeDate === 'single' ?
        <Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>Разгрузка: {item?.date}</Text>
        :<Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>Разгрузка: {item?.dateRange[0]} - {item?.dateRange[1]}</Text>
      }

      <View style={[mainstyles.rowalC,{backgroundColor: '#fff', paddingBottom: 20,paddingTop: 10}]}>        
          <IconPinSmallFill />
        <Text style={[mainstyles.text14R,{color: THEME.GREY700,paddingLeft: 15}]}>{item?.address}</Text>
      </View>
        {
          item?.description!==undefined && item?.description?.trim()?.length > 0 ?
            <View style={[styles.desctWrapper,styles.whiteBlock,mainstyles.shadowG5r5, {alignItems: 'flex-start'}]}>
              <Text style={[mainstyles.text14R,styles.desctInput,]}>{item?.description}</Text>
            </View> 
          : null
        // <Text style={[mainstyles.text14R]}>Информация о грузе...</Text>
      }
    </View>
    )
} 
const styles = StyleSheet.create({ 
  //
  whiteBlock: {
    borderRadius: 27,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
  },
  //inputs
  desctWrapper: {
    marginBottom: 20
  },
  desctInput: {
    color: THEME.GREY800,
    // alignItems: 'center',
  },
})