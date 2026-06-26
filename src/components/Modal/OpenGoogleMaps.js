import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput } from 'react-native';
import { generalStyles } from '../../../styles/generalStyles';
import { SIZE, THEME } from '../../theme';
import { SecondBtn } from '../SecondBtn';
import { normalize } from '../../util/UI/fontsUI';

export const OpenGoogleMaps = ({openGM, onClose}) => {
  console.log('OpenGoogleMaps', )
  return (
    <View style={styles.modalGMWrapper}>
      <View style={styles.modalGMInner}>
        <Image source={require('../../../assets/image/googlemaps.png')} style={{width: 100, height: 100}}/>
        <Text style={styles.modalGMText}>Хотите открыть приложение Google Maps с проложенным маршрутом заявки?</Text>
        <View style={[generalStyles.rowSBetween, {width: Dimensions.get('window').width-60}]}>
          <SecondBtn title="Открыть" onPress={openGM} />
          <SecondBtn title="Отмена" onPress={onClose} color1={'#F2F2F2'} color2={'#fff'} customStyle={{borderWidth: 1, borderColor: '#cccccc'}} colorText={'#4D4D4D'}/>
        </View>
      </View>
  </View>
    
  )
}

const styles = StyleSheet.create({
  modalGMWrapper: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.4)',
  },
  modalGMInner: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 4,
    elevation: 8
  },
  modalGMText: {
    fontSize: normalize(16),
    color: '#4E4E4E',
    paddingVertical: 15,
  },
  bgcModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    
  },
  closeModal: {
    position: 'absolute',
    top: 5,
    right: 15,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#7a7a7a',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  },  
  msgModal: {
    position: 'relative',
    width: '100%',
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  textInput: {
    width: 200,
    borderBottomWidth: 1
    // backgroundColor: 'red'
  },

  //--
  containerModal: {
    flex: 1,
    backgroundColor: THEME.MAIN_COLOR,
    paddingHorizontal: 15,
    // alignItems: 'center'
  },
  wrapperModal: {
    flex: 1,
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row'
  },
  innerRound: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20
  },
  line: {
    position: 'absolute',
    top: 40,
    width: '30%',
    borderBottomColor: '#fff',
    borderBottomWidth: 4,
  },
  round: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  inputWrap: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 20,
    // backgroundColor: 'red'
  },
  close1: {
    position: 'absolute',
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
    right: 20,
    // backgroundColor: 'red',
    zIndex: 2
  },
  title: {
    fontSize: SIZE.medium,
    color: THEME.MAIN_COLOR,
    paddingVertical: 5
  },
  input: {
    width: '100%',
    borderBottomColor: THEME.MAIN_COLOR,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  button: {
    // width: '60%',
    // backgroundColor: 'red',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  backBtn: {
    width: '33%',
    // backgroundColor: 'blue',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  mainBtn: {
    width: '33%',
    // alignItems: 'center',
    // alignContent: 'center'
    
  },
  avatarContainer: {
    // backgroundColor: 'red',
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 15
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 10,
    right: '38%',
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEditText: {
    color: THEME.MAIN_COLOR,
    fontSize: normalize(30),
    lineHeight: 32
  },
  
});