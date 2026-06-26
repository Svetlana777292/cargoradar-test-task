import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice

//components
import IconCarSmOt from '../Svg/IconCarSmOt';

//styles
import { THEME, SIZE, mainstyles } from '../../theme';

export const CreateCar = (props) => {
  const {onPress} = props;

  return (
    <View style={styles.trtWrapper}>
      
      <TouchableOpacity style={styles.trtRow} onPress={onPress}>
        <View style={styles.trtButton}>
          <Icon name="plus" size={20} color={THEME.PRIMARY}/>
          <IconCarSmOt/>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  trtWrapper: {
    paddingRight: 10
    // backgroundColor: 'red',
    // paddingVertical: 10,
    // paddingTop: 26,
  },
  trtTitle: {
    fontSize: SIZE.normal_m,
    color: THEME.MAIN_COLOR,
    fontWeight: '900',
    paddingVertical: 10
  },
  trtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  trtButton: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trtItem: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.MAIN_COLOR,
    paddingVertical: 10
  },
  trtImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: THEME.MAIN_COLOR,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    overflow: 'hidden',
  },
  trtName: {
    paddingLeft: 15
  },
});