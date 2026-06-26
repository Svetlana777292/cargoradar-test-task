import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
import { THEME, mainstyles } from '../../theme'
import IconDate from '../Svg/IconDate';
import IconWallet from '../Svg/IconWallet';
import IconDistance from '../Svg/IconDistance';
import IconNearPosition from '../Svg/IconNearPosition';
import IconSortArrowDown from '../Svg/IconSortArrowDown';


export const SortingComponent = (props) => {
  const { currentFlag, currentSort,isShowList,setIsShowList, onChangeFlag, } = props;
  const [data,setData] = useState([
    {title: 'Дате загрузки',value:'date'},
    {title: 'Стоимости',value:'price'},
    {title: 'Пробегу по маршруту',value:'distance'},
    {title: 'Ближайшие ко мне',value:'position'},
  ])
  const icons = [
    {value: 'date', icon: ()=>(<IconDate color={THEME.GREY600}/>)},
    {value: 'price', icon: ()=>(<IconWallet color={THEME.GREY600}/>)},
    {value: 'distance', icon: ()=>(<IconDistance color={THEME.GREY600}/>)},
    {value: 'position', icon: ()=>(<IconNearPosition color={THEME.GREY600}/>)},
  ]

  let currVal = data.find(elem => elem.value === currentSort)
  let iconObj = icons.find(icon => icon.value === currentSort);
  // console.log('data', data.find(elem => elem.value === currentSort))

  const handlePressSortDirection = ()=> {
    isShowList === true ? setIsShowList(false) : null
    onChangeFlag(currentFlag)
  }
  
  return (
    <View style={[styles.input,mainstyles.shadowG5r8,]}>
      <TouchableOpacity style={[styles.titleWrap,mainstyles.rowalCjcSb]} activeOpacity={1} onPress={()=>setIsShowList(prev=> !prev)}>
        <Text style={[mainstyles.text14R, styles.title]}>Сортировка по:</Text>
          <View style={[mainstyles.rowalC,styles.titleChoosen,]}>
            {iconObj && iconObj.icon()}
            <Text style={[mainstyles.text14R,{color: THEME.GREY600, paddingLeft: 7,}]}>{currVal.title}</Text>
          </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btnFlag,]} onPress={handlePressSortDirection}>
        <View style={[mainstyles.rowalCjcSb]}>
          <View style={{transform: [{ rotate: currentFlag? '0deg' : '180deg'}]}}>
            <IconSortArrowDown />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 2,
    // backgroundColor: 'pink',
  },
  titleWrap: {
    // backgroundColor: 'blue',
    width: '87%',
    minHeight: 40,
  },
  btnFlag: {
    // backgroundColor: 'red',
    width: '13%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  title: {
    color: THEME.GREY600,
    paddingRight: 10,
    width: '40%',
    // backgroundColor: 'orange'
  },
  titleChoosen: {
    justifyContent: 'flex-end',
    width: '60%',
    // backgroundColor: 'lightgreen'
  },
})