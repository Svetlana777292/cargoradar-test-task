import React from 'react';
import { Text, View,  StyleSheet } from 'react-native';

//packages
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice

//components
import BackArrow from '../Svg/BackArrow';
import { BtnIconTrs } from '../Buttons/BtnIconTrs';

//styles
import { THEME, mainstyles } from '../../theme';

export const HeaderTitleComponent = (props) => {
  const {
    onPress,
    customStyle,
    title,
    titleStyles,
    colors,
    titleWrapStyles,
    btnWrapStyles
    } = props
    // console.log('colors', colors)
  // const [val, setVal] = useState('')
  // const dispatch = useDispatch()
  const safeInsets = useSafeAreaInsets();

  const handlePress = () => {
    onPress()
    // navigation.navigate('Auth')
    // carousel.current?.next()
  }
  // ['rgba(255,25,245,1)','rgba(55,255,255,1)']
  return (
    <LinearGradient colors={colors?colors:['rgba(255,255,255,1)','rgba(255,255,255,0)']} style={[styles.container,customStyle,]} useAngle angle={180}>
      <View style={styles.row}>
        <BtnIconTrs onPress={handlePress} customStyles={[styles.btn,btnWrapStyles]}>
          <BackArrow />
        </BtnIconTrs>
        <View style={[styles.title,titleWrapStyles]}>
          <Text style={[mainstyles.text17R,{color:THEME.GREY900},titleStyles]}>{title}</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
    // paddingVertical: 5,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  row: {
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    // justifyContent: 'center',
    alignItems: 'center',
    
  },
  title: {
    // backgroundColor: 'orange',
    alignItems: 'center',
    width: '60%',
  },
  btn: {
    // backgroundColor: 'blue',
    width: '20%',
    alignItems: 'flex-start'
  }
});