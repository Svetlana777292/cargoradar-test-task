import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

//packages
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice

//components
import BackArrow from '../Svg/BackArrow';
import { BtnIconTrs } from '../Buttons/BtnIconTrs';

//styles
import { THEME, mainstyles } from '../../theme';


export const HeaderTitleComponentWithIcon = (props) => {
  const {
    onPress,
    customStyle,
    title,
    titleStyles,
    colors,
    children
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
  // 
  return (
    <LinearGradient colors={colors?colors:['rgba(255,255,255,1)','rgba(255,255,255,0)']} style={[styles.container,{paddingTop: safeInsets?.top},customStyle,]} useAngle angle={180}>
        <View style={styles.row}>
          <BtnIconTrs onPress={handlePress} customStyles={styles.btn}>
            <BackArrow />
          </BtnIconTrs>
          <View style={styles.title}>
            <Text style={[mainstyles.text18R,{color:THEME.GREY900},titleStyles]}>{title}</Text>
          </View>
          {
            children?
            <View style={styles.children}>
              {children}
            </View>
            :null
          }
        </View>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    // height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 5,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
  },
  row: {
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 0,
    // justifyContent: 'center',
    alignItems: 'center',
    
  },
  title: {
    // backgroundColor: 'orange',
    alignItems: 'center',
    width: '60%',
  },
  children: {
    // backgroundColor: 'purple',
    alignItems: 'flex-end',
    width: '20%',
    justifyContent: 'center'
    // paddingVertical: 10,
  },
  btn: {
    // backgroundColor: 'blue',
    width: '20%',
    alignItems: 'flex-start'
  }
});