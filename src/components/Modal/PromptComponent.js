import React from 'react';
import  { View, Text, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { DefaultBtn } from '../Buttons/DefaultBtn';
import { SERVERURICARGO } from '../../util/const';
import { THEME, mainstyles } from '../../theme';
import { SERVERURL } from '../../util/apiVars';

const PromptComponent = (props) => {
  const { data, onPress, children } = props
  const { img, title, text, button } = data
  // console.log('props', props)
  let imageurl = img != "" && img !=undefined ? SERVERURL+img.toString() : null
  // console.log('imageurl', typeof(imageurl) )
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
            />
          :
            <Image source={{uri: imageurl}} style={{width: 50, height: 50, alignSelf: 'center',aspectRatio:1.5}}/>
          }
        </> 
        : null
      }
      {children}
      <Text style={[mainstyles.text22M,{color: THEME.PRIMARY,paddingBottom: 15,textAlign: 'center'}]}>{title}</Text>
      <Text style={[mainstyles.text14R,{paddingBottom: 20,textAlign: 'center',lineHeight: 20}]}>{text}</Text>
      <DefaultBtn title={button} onPress={onPress}/>
    </View>
  )
}

export default PromptComponent;