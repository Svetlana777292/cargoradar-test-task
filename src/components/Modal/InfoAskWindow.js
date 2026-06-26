import React from 'react';
import  { View, Text, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { DefaultBtn } from '../Buttons/DefaultBtn';
import { DefaultBtnOutline } from '../Buttons/DefaultBtnOutline';
import { SERVERURICARGO } from '../../util/const';
import { THEME, mainstyles } from '../../theme';

const InfoAskWindow = (props) => {
  const { data, onPress, onClose, customStyleBtn1, customStyleBtn2, disabled=false } = props
  const { img, title, text, button1, button2 } = data
  let imageurl = img != "" && img !=undefined ? SERVERURICARGO+img.toString() : null
  // console.log('imageurl', typeof(imageurl) )
  // console.log('props', props)
  let isSvg

  if(imageurl) {
    isSvg = img.split('.').pop()
  }

  return (
    <View style={[mainstyles.promptContainer]}>
      { 
        imageurl ?
        <>
          {
            isSvg == 'svg' ?
            <SvgUri
              width={50}
              height={50}
              uri={`${imageurl}`}
              style={{alignSelf: 'center'}}
              // onError={(error) => {
              //   console.log('!!!!!!!!!!!!!', error.stack, error.name, error.message)
              //   }}
            />
          :
            <Image source={{uri: imageurl}} style={{width: 50, height: 50, alignSelf: 'center',aspectRatio:1.5}}/>
          }
        </> 
        : null
      }
      <Text style={[mainstyles.text22M,{color: THEME.PRIMARY,paddingBottom: 15,textAlign: 'center'}]}>{title}</Text>
      <Text style={[mainstyles.text14R,{paddingBottom: 15, textAlign: 'center'}]}>{text}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%',}}>
        <DefaultBtnOutline title={button1} onPress={onPress} disabled={disabled}
        customStyle={[{ width:'40%', minWidth: null, maxWidth: null, elevation: 10, shadowColor: THEME.PRIMARY},customStyleBtn1,]}/>
        <DefaultBtn title={button2} onPress={onClose} 
        customStyle={[{width:'40%', minWidth: null, maxWidth: null, elevation: 10, shadowColor: THEME.PRIMARY},customStyleBtn2]}/>
      </View> 
    </View>
  )
}

export default InfoAskWindow;