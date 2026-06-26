import React from 'react';
import  { View,Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { height } from '../../util/helperConst';
import IconNetConnection from '../Svg/IconNetConnection';
import { DefaultBtnWite } from '../Buttons/DefaultBtnWite';
import { THEME, mainstyles } from '../../theme';

const PromptNetConnection = (props) => {
  const { data, onPress } = props
  // console.log('data', data)

  return (
    <View style={[{
      flex: 1,
      position: 'relative',
      height: '100%',
      width: '100%'
    }]}>
      <LinearGradient style={[{flex:1,minHeight: height, width: '100%',justifyContent: 'center', alignContent: 'center', alignItems: 'center'}]} colors={[ THEME.GR_D, THEME.GR_L]} useAngle angle={90}>
          <View style={[mainstyles.pB25]}>
            <IconNetConnection />
          </View>
        <Text style={[mainstyles.text22M,{color: '#fff',paddingBottom: 30,textAlign: 'center'}]}>Нет подключения к интернету</Text>
        <DefaultBtnWite title={'Закрыть'} onPress={onPress}/>
      </LinearGradient>
    </View>
  )
}

export default PromptNetConnection;