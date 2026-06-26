import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
import { THEME, mainstyles } from '../theme';

export const DropDownListCustom = (props) => {
  const { text,data,value, setValue,baseStylesValue,activeStylesValue,stylesContainer,stylesItems,stylesListContainer} = props
  // console.log('value', value)
  // const [data,setData] = useState([
  //   {value: 'Легковой',},
  //   {value: 'Микроавтобус',},
  //   {value: 'Грузовой',},
  // ])

  const [isShowList,setIsShowList] = useState(false)

  return (
    // error?{elevation: 8,shadowColor: '#D32030'}: null
    <View style={[styles.input,stylesContainer]}>
      <TouchableOpacity style={[baseStylesValue,mainstyles.shadowG5r5, isShowList ? activeStylesValue : {}]} onPress={()=>{Keyboard.dismiss(), setIsShowList(prev=> !prev)}}>
        <View style={[mainstyles.rowalCjcSb,{height: 40}]}>
          {
            value === null ?
            <Text style={[mainstyles.text14R,{color: THEME.GREY700}]}>{text}</Text>
            :<Text style={[mainstyles.text14R,{color: THEME.GREY900}]}>{value}</Text>
          }
          <Icon name={!isShowList?'chevron-down':'chevron-up'} size={26} color={THEME.GREY600} />
        </View>
      </TouchableOpacity>
      {
        isShowList? 
          <View style={[styles.listContainer,stylesListContainer]}>
            <FlatList 
              data={data}
              keyExtractor={(item,index)=>index+'q'}
              renderItem={({item,index}) => ( <TouchableOpacity style={[styles.listItem,stylesItems]}
              onPress={()=>{setValue(item),setIsShowList(false)}}
              >
                <Text style={[mainstyles.text14R,{color: THEME.GREY900}]}>{item?.title}</Text>
              </TouchableOpacity>)}
            />
            {/* {data&&data.map((item,index)=>(
              <TouchableOpacity key={index+'drl'}  style={[styles.listItem,stylesItems]}
              onPress={()=>{setValue(item.value),setIsShowList(false)}}
              >
                <Text style={[mainstyles.text14R,{color: THEME.GREY900}]}>{item?.title}</Text>
              </TouchableOpacity>
            ))} */}
          </View>
        : null
        }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    justifyContent: 'center',
    minHeight: 40,
    zIndex: 1,
    // borderRadius: 30,
    // paddingVertical: 7,
    // paddingLeft: 15
    // paddingHorizontal: 15,
    // backgroundColor: '#fff',
    // elevation: 15,
  },
  base: {
    // backgroundColor: 'pink',
  },
  active: {
  },
  listContainer: {

  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth:1,
    borderBottomColor: THEME.GREY300,
    paddingLeft: 15
  },
})