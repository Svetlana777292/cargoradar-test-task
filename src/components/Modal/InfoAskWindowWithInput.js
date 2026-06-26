import React, { useRef }  from 'react';
import  { View,Text, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { DefaultBtn } from '../Buttons/DefaultBtn';
import { DefaultBtnOutline } from '../Buttons/DefaultBtnOutline';
import { THEME, mainstyles } from '../../theme';

const InfoAskWindowWithInput = (props) => {
  const { disabled, data, onPress, onClose, customStyleBtn1, customStyleBtn2, value, setValue } = props
  const { img, title, text, button1, button2 } = data
  const input = useRef()
  // console.log('props', props)

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
          style={[{flex:1,width: '100%'},
          mainstyles.alCjcC,
          ]}>
      <View style={[mainstyles.promptContainer,{marginBottom: 0,}]} onPointerEnter={()=>console.log('text', )}>

        <View style={{width: '100%'}} >
          <Text style={[mainstyles.text22M,{color: THEME.PRIMARY,paddingBottom: 15,textAlign: 'center'}]}>{title}</Text>
          <Text style={[mainstyles.text14R,{paddingBottom: 15, textAlign: 'center'}]}>{text}</Text>
          <View style={{width: '100%',paddingBottom: 10}}>

            <TextInput 
              ref={input}
              value={value}
              onChangeText={(v)=>setValue(v)}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
              textAlignVertical='top'
              style={[mainstyles.inputBG,{width: '100%',},Platform.OS==='ios'?{minHeight: 130}: null]}
              // onBlur={()=>Keyboard.dismiss()}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%',}}>
            <DefaultBtnOutline title={button1} onPress={onPress}
            disabled={value?.trim()?.length === 0 || disabled} 
            customStyle={[{ width:'40%', minWidth: null, maxWidth: null, elevation: 10, shadowColor: THEME.PRIMARY},customStyleBtn1,]}/>
            <DefaultBtn title={button2} onPress={onClose} 
            customStyle={[{width:'40%', minWidth: null, maxWidth: null, elevation: 10, shadowColor: THEME.PRIMARY},customStyleBtn2]}/>
          </View> 

        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default InfoAskWindowWithInput;