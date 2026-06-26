import React, { useEffect, useRef, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { keyAPi } from '../../util/map_keys';
import { Text, TouchableOpacity } from 'react-native';

const GooglePlacesInput = () => {
  const ref = useRef();
  const [inputText, setInputText] = useState('')

  // useEffect(() => {
  //   ref.current?.setAddressText('Some Text');
  // }, []);

  // useEffect(() => {
  //   ref.current?.setAddressText('Some Text');
  // }, []);

  const clearInput = () => {
    ref.current?.setAddressText('clear input fn')
  } 
  const renderBtn = () => {
    return (
      <TouchableOpacity onPress={()=>{clearInput()}} style={{backgroundColor: 'orange'}}>
        <Text>clear</Text>
      </TouchableOpacity>
    )
  } 
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder='Search'
      // textInputProps={{
        
      //   value:inputText,
      //   onChangeText:(v)=>setInputText(v),
      // }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      renderRightButton={renderBtn}
      query={{
        key: keyAPi,
        language: 'en',
      }}
      styles = {{
        textInput: 
        {
          paddingLeft: 0,
          backgroundColor: 'pink',
          marginBottom: 0,
        },
        container: {
          backgroundColor: 'lightblue'
        },         
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
          // backgroundColor: 'orange',
          // width: width-20,
          // backgroundColor: '#fff',
          // position: 'absolute',
          // top: 60,
          // borderRadius: 27,            
          // borderTopLeftRadius:0,
          // borderTopRightRadius:0,
          // zIndex: 999,
          // elevation: 7,
        }],
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
          // width: width-20,
          // borderBottomColor: THEME.GREY300,
          // paddingHorizontal: 0,
          // margin: 0,            
          // borderRadius: 27,            
          // borderTopLeftRadius:0,
          // borderTopRightRadius:0,
        },
      }}
    />
  );
};

export default GooglePlacesInput;