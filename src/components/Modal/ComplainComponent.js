import React, { useEffect, useState } from 'react';
import  { View, Text, Image, TouchableOpacity, Platform,StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { DefaultBtn } from '../Buttons/DefaultBtn';
import { SERVERURICARGO } from '../../util/const';
import { THEME, mainstyles } from '../../theme';
import BackArrow from '../Svg/BackArrow';
import { DropDownListCustom } from '../DropDownListCustom';
import { dataComplainPrompt, height } from '../../util/helperConst';
import { useDispatch, useSelector } from 'react-redux';
import { setJsonDataComplaints, setJsonDataComplaintsErr } from '../../store/features/jsonInfoSlice';
import { getJsonDataComplaints } from '../../util/firebase';

const ComplaintComponent = (props) => {
  const { onPress,onClose, } = props
  const dispatch = useDispatch();
  const data = dataComplainPrompt //getJsonDataComplaints - дописать
  // let arr =  useSelector(state=>state.jsoninfo.jsonDataComplaints) 
  // console.log('arr', arr)

  const [description, setDescription] = useState('')
  const [value, setValue] = useState(null)
  const [valueTitle, setValueTitle] = useState(null)
  const [errReason, setErrReason] = useState(false)
  const [errDiscr, setErrDiscr] = useState(false)
  const [disableBtn, setDisableBtn] = useState(true)

  // console.log('props', props)

  const handleSetValue = (data) => {
    setValue(data)
    setValueTitle(data.title)
  }

  // useEffect(()=>{

  //     getJsonDataComplaints(dispatch,setJsonDataComplaints,setJsonDataComplaintsErr) 
    
  // },[])

  // useEffect(()=>{
  //   if(value ===false && description?.trim().length == 0) {
  //     setDisableBtn(true)
  //   } else {
  //     setDisableBtn(false)
  //   }
  //   console.log('value', value == null, )
  //   console.log('description', description?.length !== 0,description?.length)
  //   console.log('dis', value == null && description?.length === 0, )
  // },[value,description])
  // console.log('disableBtn', disableBtn )

  const handlePrees = () => {
    
    if( value == null && description?.trim()?.length === 0) {
      setErrReason(true)
      setErrDiscr(true)
      return
    } else {
      setErrDiscr(false)
      setErrReason(false)
    }
    if( value == null) {
      setErrReason(true)
      return
    } else {
      setErrReason(false)
    }
    if( description?.trim()?.length === 0) {
      setErrDiscr(true)
      return
    } else {
      setErrDiscr(false)
    }
    try {
      onPress(value,description)
      
    } catch (error) {
      console.log('error', error)
    }
  }
  
  return (
    <KeyboardAvoidingView style={{flex:1,width: '100%',alignItems: 'center', justifyContent: 'center'}} behavior={Platform.OS==='ios'? 'height': 'padding'}>
      <View style={[styles.container]}>
        <TouchableOpacity onPress={onClose}style={styles.titleNav}>
          <BackArrow />
          <Text style={[mainstyles.text16R, {color: THEME.GREY800,paddingLeft: 15}]}>Жалоба</Text>
        </TouchableOpacity>
        <View style={[mainstyles.botLineGr,{width: '90%',marginBottom: 20,alignSelf: 'center'}]}/>

        {/*value может быть в две строки - тогда лист нужно ниже - проверить  */}
          <DropDownListCustom 
            text={'Выберите причину*'}
            data={data}
            value={valueTitle}
            setValue={handleSetValue}
            baseStylesValue={styles.baseTitle}
            activeStylesValue={styles.activeTitle}
            stylesContainer={{zIndex: 998}}
            stylesItems={{borderBottomWidth:0, paddingVertical:8,}}
            stylesListContainer={styles.list}
            // stylesValue={{}}
          />
          <View style={{marginBottom: 20}}>
            {
              errReason ?
              <Text style={[mainstyles.text12R, {color: THEME.REDERR,marginTop: 6, paddingLeft: 15}]}>Заполните обязательное поле</Text>
              : null
            }
          </View>
          <TextInput
            // ref={titleRef}
            style={[mainstyles.text14M,styles.inputTitle,mainstyles.shadowG5r5,Platform.OS === 'ios'? {paddingVertical: 15}: null]}
            placeholder='Описание проблемы*'
            blurOnSubmit={true}
            placeholderTextColor={THEME.GREY500}
            value={description}
            onChangeText={setDescription}
            maxLength={50}
            multiline={true}
          />
          <View style={{marginBottom: 20}}>
            {
              errDiscr ?
              <Text style={[mainstyles.text12R, {color: THEME.REDERR,marginTop: 6, paddingLeft: 15}]}>Заполните обязательное поле</Text>
              : null
            }
          </View>

        <DefaultBtn onPress={() => handlePrees()} title={'Отправить'} customStyle={{alignSelf: 'center',marginBottom: 20}}/> 
        <Text style={[mainstyles.text14R,{paddingBottom: height > 720 ? 20 : 5,textAlign: 'center',lineHeight: height > 720 ? 20 : 16}]}>Если мы обнаружим нарушение правил ресурса, то можем принять меры в отношении аккаунта, а в случае серьезных или многократных нарушений – заблокировать его.</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  titleNav: {
    // backgroundColor: 'transparent', 
    flexDirection: 'row',
    paddingVertical: 10,
    paddingTop: 15,
    marginBottom: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  inputTitle: {
    width: '100%',
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    minHeight: height > 720 ? 150 : 100,
    verticalAlign: 'top',
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    shadowColor:THEME.GREY500,
    zIndex: 1,
    // marginBottom: 20
  },
  baseTitle: {
    borderWidth:1,
    borderColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5, 
    backgroundColor: '#fff', 
    elevation:4,
    shadowColor:THEME.GREY500
  },
  activeTitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation:0,
    borderWidth:1, borderColor:THEME.GREY100,
  },
  list: {
    position: 'absolute',
    top:50,
    zIndex: 999,
    width: '100%', 
    backgroundColor: '#fff',
    paddingBottom:10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth:1, 
    borderColor:THEME.GREY100,
    borderTopColor: '#fff' 
}
});

export default ComplaintComponent;

