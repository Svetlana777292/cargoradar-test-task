import { StyleSheet } from 'react-native';
import { THEME } from '../src/theme';

export const renderItemsStyles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#f5f5f5',
    // backgroundColor: 'lightblue',
    paddingVertical: 12,
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  infoMarker: {
    position: 'absolute',
    width: 20, 
    height: 20, 
    borderRadius: 30, 
    backgroundColor: THEME.REDERR, 
    top:-10,
    right:-10
  },
  inner: {
    // backgroundColor: 'red'
  },
  titleItemContainer: {
    // backgroundColor: 'orange',
    width: '100%',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 7
  },
  titleTextTender: {
    // backgroundColor: 'blue',
    width: '75%',
  },
  priceTextTender: {
    // backgroundColor: 'pink',
    width: '25%',
    alignItems: 'flex-end'
  },
  textColorD: {
    color: THEME.PRIMARY
  },
  buttonDatail: {

  },

})