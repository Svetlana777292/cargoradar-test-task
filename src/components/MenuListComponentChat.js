import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity,} from 'react-native';
import { THEME, mainstyles } from '../theme';
import IconComplaint from './Svg/IconComplaint';
import IconDocDel from './Svg/IconDocDel';
import IconDocRecover from './Svg/IconDocRecover';

export const MenuListComponentChat = (props) => {

  const {isHidden,onPressHidden,onPressComplain} = props;

  return (
    <View style={styles.container}>
      {
        isHidden === false ?
          <TouchableOpacity onPress={()=>onPressHidden('del')} style={[styles.item]}>
            <View style={[mainstyles.rowalC,{}]}>
              <IconDocDel color={THEME.PRIMARY}/>
              <Text style={[mainstyles.text12R,styles.textHeader]}>Прекратить торг</Text>
            </View>
          </TouchableOpacity>
        :
          <TouchableOpacity onPress={()=>onPressHidden('res')} style={[styles.item]}>
            <View style={[mainstyles.rowalC,{}]}>
              <IconDocRecover color={THEME.PRIMARY}/>
              <Text style={[mainstyles.text12R,styles.textHeader]}>Возобновить торг</Text>
            </View>
          </TouchableOpacity>
      }
      <TouchableOpacity onPress={onPressComplain} style={[styles.item]}>
        <View style={[mainstyles.rowalC,{}]}>
          <IconComplaint/>
          {/* <IconComplaint >
            <Text style={[mainstyles.text12M,{color: THEME.PRIMARY,alignSelf: 'center'}]}>!</Text>
          </IconComplaint> */}
          <Text style={[mainstyles.text12R,styles.textHeader,{}]}>Пожаловаться</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 13,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingBottom:14,
    minWidth: 160,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,    
    
  },
  item: {
    // backgroundColor: 'pink',
    paddingTop: 5,
    paddingBottom: 5,
    
  },
  textHeader: {
    color: THEME.PRIMARY,
    paddingLeft: 5,
  },
})