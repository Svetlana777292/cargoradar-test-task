import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Image, ScrollView, SafeAreaView, Modal, Linking, TextInput, FlatList, Pressable, ActivityIndicator, BackHandler, KeyboardAvoidingView } from 'react-native';
import { THEME, mainstyles } from '../theme';
// import Icon from '@react-native-vector-icons/entypo';
import Icon from '@react-native-vector-icons/fontawesome';
import IconStarSmall from './Svg/IconStarSmall';
import IconStarSmallFill from './Svg/IconStarSmallFill';
import IconComplaint from './Svg/IconComplaint';

export const MenuListComponent = (props) => {

  const {isFaivor,isHidden,onPressToggle,onPressComplain, showHideButton} = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPressToggle('faivorTenders')} style={[styles.item,{paddingTop: 0}]}>
        {
          isFaivor === false ?
          <View style={[mainstyles.rowalC,{}]}>
            <IconStarSmall color={THEME.PRIMARY} width={22} height={21}/>
            <Text style={[mainstyles.text12R,styles.textHeader]}>В избранное</Text>
          </View>
          :
          <View style={[mainstyles.rowalC,{}]}>
            <IconStarSmallFill width={22} height={21}/>
            <Text style={[mainstyles.text12R,styles.textHeader]}>Убрать</Text>
          </View>
        }
      </TouchableOpacity>
      {
        showHideButton ?
        <TouchableOpacity onPress={()=> onPressToggle('deleteTenders')} style={[styles.item]}>
          {
            isHidden === false ?
            <View style={[mainstyles.rowalC,{}]}>
              <Icon name='eye-slash' size={26} color={THEME.PRIMARY}/>
              <Text style={[mainstyles.text12R,styles.textHeader]}>Скрыть</Text>
            </View>
            :
            <View style={[mainstyles.rowalC,{}]}>
              <Icon name='eye' size={26} color={THEME.PRIMARY}/>
              <Text style={[mainstyles.text12R,styles.textHeader]}>Показывать</Text>
            </View>
          }
        </TouchableOpacity>
        : null
      }
      <TouchableOpacity onPress={onPressComplain} style={[styles.item]}>
        <View style={[mainstyles.rowalC,{}]}>
          <IconComplaint/>
            {/* <Text style={[mainstyles.text12M,{color: THEME.PRIMARY,alignSelf: 'center'}]}>!</Text>
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