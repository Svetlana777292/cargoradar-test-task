import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable,} from 'react-native';
import { THEME, mainstyles } from '../theme';
import Icon from '@react-native-vector-icons/entypo';
import IconPinSmallOt from './Svg/IconPinSmallOt';
import IconPinSmallFill from './Svg/IconPinSmallFill';

export const AddressPointsView = (props) => {
  const {
    type,
    data,
    length,
    disable,
    onPress,
    showDots=true
  } = props;
  // console.log('props', props)

  let typeText = type==='start'? 'загрузки' : 'разгрузки'
  let icon = type==='start'? <IconPinSmallOt/> : <IconPinSmallFill/>

  return (
    <Pressable onPress={onPress} disabled={disable}
      style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '100%',justifyContent: 'space-between',paddingBottom: 5}]}>
      <View style={{backgroundColor: 'transparent',paddingRight: 10}}>
        {icon}
      </View>
      <View style={{backgroundColor: 'transparent',width: showDots ? '80%':'95%',}}>
        {length===1?
        <View style={[mainstyles.rowalC, styles.textBlock]} >
          <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>{data[0].address}</Text>
        </View>
          :
          <View style={[mainstyles.rowalC, styles.textBlock]}>
            <Text style={[mainstyles.text14R,styles.textAddressWithNum]}>{length} </Text>
              {
                length === 1 ?
                <Text numberOfLines={1}  style={[mainstyles.text14R,styles.textAddressWithNum]}>точка {typeText}</Text>
                :
                <>
                  {
                    length >1&&length <=4 ?
                    <Text numberOfLines={1}  style={[mainstyles.text14R,styles.textAddressWithNum]}>точки {typeText}</Text>
                    :
                    <>
                      {
                        length > 4?
                        <Text numberOfLines={1}  style={[mainstyles.text14R,styles.textAddressWithNum]}>точек {typeText}</Text>
                        :
                        null
                      }
                    </>

                  }
                </>

              }
          </View>
        }
      </View>
      {
        showDots ?
        <View style={{backgroundColor: 'transparent',width: '10%',alignItems: 'flex-end'}}>
          <Icon name='dots-three-horizontal' color={THEME.GREY400} size={20} style={{ }}/>
        </View>
        : null
      }

    </Pressable>
  )
} 

const styles = StyleSheet.create({
  textAddressWithNum: {
    color: THEME.GREY700, 
    // backgroundColor: 'pink'
  },
  textAddressWithNum: {
    color: THEME.GREY700, 
  },
  textBlock: {
    // backgroundColor: 'red',
    minHeight: 36,
    color: THEME.GREY700,
  },
})