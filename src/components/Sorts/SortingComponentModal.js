import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
import { THEME, mainstyles } from '../../theme'
import IconDate from '../Svg/IconDate';
import IconWallet from '../Svg/IconWallet';
import IconDistance from '../Svg/IconDistance';
import IconNearPosition from '../Svg/IconNearPosition';


export const SortingComponentModal = (props) => {
  const { currentSort, setIsShowList, onPressSort, } = props
  const data= [
    {title: 'Дате загрузки',value:'date'},
    {title: 'Стоимости',value:'price'},
    {title: 'Пробегу по маршруту',value:'distance'},
    {title: 'Ближайшие ко мне',value:'position'},
  ]
  const icons = [
    {value: 'date', icon: ()=>(<IconDate />)},
    {value: 'price', icon: ()=>(<IconWallet />)},
    {value: 'distance', icon: ()=>(<IconDistance />)},
    {value: 'position', icon: ()=>(<IconNearPosition />)},
  ]

  // console.log('text', )
  let currVal = data.find(elem => elem.value === currentSort)
  // console.log('currVal', currVal)

  return (
    <View style={[styles.input,mainstyles.shadowG5r8,]}>
      <View style={[styles.listContainer,]}>
        {data&&data.map((item,index)=> {
          // console.log('item', item, icons[index]['icon'])
          // const iconObj = icons.find(icon => icon.value === item.value);
          return (
            <TouchableOpacity key={index+'drl'}  style={[styles.listItem, mainstyles.rowalC, index===0 ?{paddingTop: 0}: {},index===data?.length-1 ? {paddingBottom: 0}: {}]}
            onPress={()=>{onPressSort(item.value),setIsShowList(false)}}
            >
              {/* {iconObj && iconObj.icon()} */}
              {icons[index]["icon"]()}
              <Text style={[mainstyles.text14R,{paddingLeft: 10,color: THEME.GREY900}]}>{item.title}</Text>
            </TouchableOpacity>
          )
        }
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    position: 'absolute',
    top: 0,
    right: 15,
    zIndex: 999,
    borderRadius: 19,
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // minHeight: 45,
    // borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    elevation: 14,
    // backgroundColor: 'blue',
  },
  btnFlag: {
    // backgroundColor: 'red',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
  },
  listContainer: {
    // position: 'absolute',
    // top: 0,
    // right: 20,
    // backgroundColor: 'lightblue',
    // width: 150,
    // height: 300,
    // zIndex: 999
  },
  listItem: {
    paddingVertical: 10,
  },
})