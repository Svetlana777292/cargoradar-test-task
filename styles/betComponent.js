import { StyleSheet} from 'react-native';
import { THEME } from '../src/theme';

export const betComponent = StyleSheet.create({
  betItem: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 6,
    // padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  betInner: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  betBorder: {
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1
  },
  textBold: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold'
  }
})