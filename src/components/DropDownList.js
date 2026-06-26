import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/entypo';
import { THEME, mainstyles } from '../theme';

export const DropDownList = (props) => {
  const { value, setValue,error } = props
  const [data,setData] = useState([
    {value: 'Легковой',},
    {value: 'Микроавтобус',},
    {value: 'Грузовой',},
  ])
  const [isShowList,setIsShowList] = useState(false)

  return (
    <View style={[styles.input,mainstyles.shadowG5r8,error?{elevation: 8,shadowColor: '#D32030'}: null]}>
      <TouchableOpacity style={[isShowList ? styles.active : styles.base,]} onPress={()=>setIsShowList(prev=> !prev)}>
        <View style={[mainstyles.rowalCjcSb]}>
          {
            !value?
            <Text style={[mainstyles.text14R,{color: THEME.GREY600}]}>Тип авто *</Text>
            :<Text style={[mainstyles.text14R,{color: THEME.GREY900}]}>{value}</Text>
          }
          <Icon name={!isShowList?'chevron-down':'chevron-up'} size={26} color={THEME.GREY600} />
        </View>
      </TouchableOpacity>
      {
        isShowList? 
          <View style={styles.listContainer}>
            {data.map((item,index)=>(
              <TouchableOpacity key={index+'drl'}  style={[styles.listItem]}
              onPress={()=>{setValue(item.value),setIsShowList(false)}}
              >
                <Text style={[mainstyles.text14R,{color: THEME.GREY900}]}>{item.value}</Text>
              </TouchableOpacity>
            ))}
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
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 15,
  },
  base: {
    // backgroundColor: 'pink',
  },
  active: {
  },
  listContainer: {

  },
  listItem: {
    paddingVertical: 10,
  },
})