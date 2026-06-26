import React from 'react';
import {  Text, View } from 'react-native';
import { THEME, mainstyles } from "../theme"
import IconPinSmallOt from "./Svg/IconPinSmallOt"


const MarkerCustom = (props) => {
  return (
    <View style={[{width: 45, height: 45, borderRadius: 40, backgroundColor: THEME.PRIMARY, justifyContent: 'center',alignItems: 'center', paddingHorizontal: 5,
    elevation:7, borderWidth:1, borderColor: THEME.DARKBLUE,
    },mainstyles.shadowPrBtn]}>
      <IconPinSmallOt color={'#fff'} />
    </View>
  )
}
export default MarkerCustom;