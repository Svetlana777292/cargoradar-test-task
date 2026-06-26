import React from 'react';
import {View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import { THEME, mainstyles } from '../theme';

export default TopTabBarTextClientTendersActive = (props) => {
  const {
    isActive,
    onPress,
    isChangeTitle
  } = props;
  // console.log('TopTabBarTextClientTenders props:', props)

  return (
    <View style={[styles.container,{height: 44}]}>

      <TouchableOpacity style={[{width: '33%',},styles.itemInner,]} onPress={()=>onPress(0)} >
        {/* {
          isChangeTitle===0 ?
          <>
            <Text style={[isActive===0? mainstyles.text16M : mainstyles.text16R,{color: isActive===0? THEME.GREY900 : THEME.GREY500,paddingHorizontal: 5, textAlign: 'center'}]}>Все заказы</Text>
            {
              isActive===0?
              <View style={[styles.line]} />
              : null
            }
          </>
          : 
          <>
          </>          
        } */}
        <Text style={[isActive===0? mainstyles.text16M : mainstyles.text16R,{color: isActive===0? THEME.GREY900 : THEME.GREY500,paddingHorizontal: 5,textAlign: 'center'}]}>Активные</Text>
        {
          isActive===0?
          <View style={[styles.line]} />
          : null
        }
      </TouchableOpacity>

      
      <TouchableOpacity style={[{width: '33%',},styles.itemInner, ]} onPress={()=>onPress(1)}>
        <Text style={[isActive===1? mainstyles.text16M : mainstyles.text16R,styles.textP,{color: isActive===1? THEME.GREY900 : THEME.GREY500, textAlign: 'center',}]}>Архив</Text>
        {
          isActive===1?
          <View style={[styles.line]} />
          : null
        }
      </TouchableOpacity>
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: THEME.GREY400,
    borderBottomWidth: 1,
    // backgroundColor: 'pink'
  },
  itemInner: {
    // backgroundColor: 'green',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textP: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  line: {
    // backgroundColor: 'green',
    borderBottomColor: THEME.PRIMARY,
    borderBottomWidth: 3,
    alignSelf: 'center',
    width: '90%',
    position: 'absolute',
    bottom:-1,
    zIndex:2,
    height: '100%'
  }
})