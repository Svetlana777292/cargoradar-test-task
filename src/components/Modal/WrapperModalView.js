import React from 'react';
import { View,TouchableOpacity } from "react-native";
import { THEME, mainstyles } from '../../theme';
import { height } from '../../util/helperConst';

export const WrapperModalView = (props) => {
  const {stylesContainer, stylesBg, stylesMenu, children,safeInsets,onClose} = props;

  return (
    <View style={[mainstyles.containerModalGgBl,
      {width: '100%',flex:1,height: height+safeInsets.top+65,zIndex: 999,backgroundColor: 'transparent',},
      stylesContainer,
      ]}>
        <TouchableOpacity 
          style={[{position: 'absolute',top: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',height: height+safeInsets.top, width: '100%'},stylesBg]}
        onPress={onClose}>
        </TouchableOpacity>
        
        <View style={[{position: 'absolute',top:safeInsets.top+40,right: 12, backgroundColor: 'transparent',
          elevation: 10,
          shadowColor: THEME.GREY500, borderRadius: 15}, mainstyles.shadowG5r5, stylesMenu]}>
          {children}
        </View>
      </View>  
  )
}