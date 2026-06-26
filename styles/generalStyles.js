import { StyleSheet} from 'react-native';
import { THEME } from '../src/theme';

export const generalStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowsdfgsfdsdf: {
    flexDirection: 'row',
  },
  rowSBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowSAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  rowC: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  //padding
  padV5: {
    paddingVertical: 5
  },
  padH5: {
    paddingHorizontal: 5
  },
  padV10: {
    paddingVertical: 10
  },
  padH10: {
    paddingHorizontal: 10
  },
  padV15:  {
    paddingVertical: 15
  },
  padH15:  {
    paddingHorizontal: 15
  },
  padV10: {
    paddingVertical: 10
  },
  padB5: {
    paddingBottom: 5
  },
  padB10: {
    paddingBottom: 10
  },
  padB15: {
    paddingBottom: 15
  },
  padB20: {
    paddingBottom: 20
  },
  padL10: {
    paddingLeft: 10
  },
  padL15: {
    paddingLeft: 15
  },
  //font
  textDefault: {
    color: THEME.MAIN_COLOR,
    fontSize: 14,
  },
  textBageRed: {
    color: 'red',
    fontSize: 12,
    fontWeight: '900'
  },
  titleSB: {
    fontSize: 14,
    color: THEME.MAIN_COLOR,
    fontWeight: '900',
  },
  title16B: {
    fontSize: 16,
    color: THEME.MAIN_COLOR,
    fontWeight: '900',
  },
  title18B: {
    fontSize: 18,
    color: THEME.MAIN_COLOR,
    fontWeight: '900',
  },

  //info block
  infoWrapper: {
    width: '100%',
    marginVertical: 5,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },

  //testblock
  testInput: {
    backgroundColor: '#ffe4e1',
    padding: 10,
    width: '100%'
  }
  /* ********************************************** */
  
})