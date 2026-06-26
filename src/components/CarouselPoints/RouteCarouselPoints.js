import React from 'react'
import { Text, View, StyleSheet, } from 'react-native';
import { THEME, mainstyles } from '../../theme';
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { width } from '../../util/helperConst';

export const RouteCarouselPoints = (props) => {
  const {
    type,
    item,
    onPress
  } = props
  // console.log('item', item)
  return (
    <View style={{paddingVertical: 5,paddingHorizontal: 15}}>
      <View style={[mainstyles.rowalCjcSb,mainstyles.pB10]}>
        <View>
          {
            item?.typeDate === 'single' ?
            <Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>{type==='start'? 'Загрузка' : 'Разгрузка'}: {item?.date}</Text>
            :<Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>{type==='start'? 'Загрузка' : 'Разгрузка'}: {item?.dateRange[0]} - {item?.dateRange[1]}</Text>
          }
        </View>
      </View>

      <View style={[mainstyles.rowalC,{paddingBottom: 15}]}>        
          <IconPinSmallOt />
        <Text style={[mainstyles.text14R,{color: THEME.GREY700,paddingLeft: 15}]}>{item?.address}</Text>
      </View>
    </View>
    )
} 
const styles = StyleSheet.create({
  
})