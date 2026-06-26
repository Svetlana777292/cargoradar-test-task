import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet,Keyboard, Platform,TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '@react-native-vector-icons/entypo';
import { THEME, mainstyles } from '../../theme';
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { keyAPi } from '../../util/map_keys';
import {height, width} from '../../util/helperConst'
import { TextInput } from 'react-native-gesture-handler';

export const SearchBarAddress = (props) => {
  const {
    address,
    setAddressObj,
    blurInput,
    setBlurInput
  } = props;
  // console.log('SearchBarAddress props:', props)
  const refInputFrom = useRef(null);
  const [styleChange, setStyleChange] = useState(false)
  const [inputText, setInputText] = useState('11')
  const curPosState = useSelector(state=>state.user.currentPosition)
  // const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // console.log('inputText', inputText, typeof(inputText))
  // console.log('SearchBarAddress styleChange', styleChange)

  const onClearBtn = ()=>{
    console.log('onClearBtn', inputText)
    refInputFrom?.current.setAddressText('')
    // setInputText('')
    refInputFrom?.current.blur()
    setStyleChange(false)
    setBlurInput(false)
  }

  const handleOnFocus = () => {
    // console.log('handleTexChange',)
    setBlurInput(false)
    setStyleChange(true)
  }

  const rightBtn = () => {
    return (
      <View onPress={onClearBtn} style={{backgroundColor: 'transparent', width: 30, height: 40, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name='cross' size={26} color={'#ccc'} onPress={onClearBtn} />
        {/* <Text onPress={onClearBtn}>123</Text> */}
      </View>
    )
  } 

  useEffect(()=>{
    if(address !== null) {
      // console.log('useEffect address', address)
      // setInputText(address?.address)
      refInputFrom?.current.setAddressText(address?.address)
    }
  },[props])


  useEffect(()=>{
    // console.log('inputText 1', inputText,inputText!==null&&inputText!==undefined&&inputText?.length>0)
    // console.log('UE refInputFrom isFocused', refInputFrom?.current?.isFocused())
    if(refInputFrom?.current?.isFocused() && styleChange === false) {
      console.log('useeffect setStyleChange ', refInputFrom?.current?.isFocused())
      setStyleChange(true)
    } else {
      // console.log('inputText 3', inputText)
    //  styleChange === true ? setStyleChange(false) : null
    }
  },[refInputFrom, styleChange])

  useEffect(()=>{
    // console.log('useEffect blurInput:', blurInput)
    if(blurInput === true) {
      // setKeyboardVisible(false)
      refInputFrom?.current.blur()
    }
  },[blurInput,props])

  useEffect(()=>{
    console.log('styleChange', styleChange)
  },[styleChange])

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//         'keyboardDidShow',
//         () => {
//             setKeyboardVisible(true);
//         },
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//         'keyboardDidHide',
//         () => {
//             setKeyboardVisible(false);
//         },
//     );

//     return () => {
//         keyboardDidHideListener.remove();
//         keyboardDidShowListener.remove();
//     };
// }, []);

// const CustomInput = () => {
//   return (
//     <TextInput 
//     ref={refInputFrom}
//       value={inputText}
//       style={{backgroundColor: 'red',width: '80%',color:'#000'}}
//       onChangeText={(v)=>handleTexChange(v)}
//     />
//   )
// }

  return (
    <View style={styles.container} >

      <GooglePlacesAutocomplete
        ref={refInputFrom}
        enablePoweredByContainer={false}
        
        textInputProps={{
          
          // InputComp: CustomInput,
          clearButtonMode: 'never', 
          // value: inputText,
          // style: {backgroundColor: 'red'},
          // onChangeText: (v)=>handleTexChange(v),
          onFocus: handleOnFocus,
          onBlur: ()=>setStyleChange(false),
        }}
        renderLeftButton={()=>(
          <View style={{ backgroundColor: 'transparent',justifyContent: 'center',alignItems: 'center',width: '12%'}}>
            <IconPinSmallOt />
          </View>
          )}
        renderRow={(data, index)=>(
            <View 
              style={{flexDirection: 'row',backgroundColor: 'transparent', width: '100%',alignItems: 'center',height: 36}}>
              <View style={{width: '12%', backgroundColor: 'transparent', alignItems: 'center'}}>
                <IconPinSmallOt />
              </View>
              <Text style={[mainstyles.text14R,{width: '88%', backgroundColor: 'transparent'}]}>{data.description}</Text>
            </View>
        )}
        renderRightButton={rightBtn}
        keepResultsAfterBlur={false}
        placeholder={'Поиск'}
        fetchDetails={true}
        onClear
        onPress={(data, details=null) => {
          console.log('GooglePlacesAutocomplete: ', data.description,details.geometry)
          setAddressObj({address: data.description, latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
        }}
        query={{
          key: keyAPi,
          language: 'ru',
          location: curPosState,
          radius: 50000
          // components: 'latlang:46.427385,30.7460967'
          // components: `country:${country}`,
        }}
        onFail={(err) => console.log('onFail google autocomplite package',err)}

        // listUnderlayColor={THEME.GREY100}
        styles = {{
          textInput: 
          {
            paddingLeft: 0,
            // backgroundColor: 'pink',
            marginBottom: 0,
            color: THEME.GREY800,
          },
          container: [!styleChange ? styles.input:styles.inputActive, mainstyles.shadowG5r5,],         
          description: {
            // backgroundColor: 'lightblue',
            // padding: 0
          },
          textInputContainer: {
            // backgroundColor: 'purple'
          },
          loader: {
            // backgroundColor: 'green'
          },
          listView: [{
            width: width-20,
            backgroundColor: '#fff',
            // backgroundColor: 'orange',
            position: 'absolute',
            top: 60,
            borderRadius: 27,            
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            zIndex: 999,
            elevation: 7,
          },mainstyles.shadowG5r8,],
          predefinedPlacesDescription: {
            // backgroundColor: 'grey'
          },
          poweredContainer: {
            // backgroundColor: 'yellow'
          },
          powered: {
            // backgroundColor: 'lightblue'
          },
          separator: {
            // backgroundColor: THEME.GREY300
            // backgroundColor: 'red'
          },
          row: {           
            backgroundColor: 'transparent',
            // backgroundColor: 'lightblue',
            width: width-20,
            borderBottomColor: THEME.GREY300,
            paddingRight: 5,
            margin: 0,            
            borderRadius: 27,            
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
          },
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 60,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  input: {    
    // backgroundColor: 'red',
    width: width-20,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10    
  },
  inputActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: THEME.GREY300,
    borderBottomWidth:1,
    width: width-20,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10 ,
    // backgroundColor: 'red',
  },
});