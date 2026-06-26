import {StyleSheet} from "react-native";
import { THEME } from "../../theme";

export const styles = StyleSheet.create({

  borderBlock: {
    borderWidth:1,
    borderRadius: 20,
    alignSelf: 'center',
    width: '90%',
    borderColor: THEME.GREY500,
  },
    borderBlockFeedback: {
    padding: 10,
    paddingHorizontal: 20    
  },
    borderBlockBet: {
    paddingVertical: 6, 
    paddingHorizontal: 8, 
    alignItems: 'flex-start'
  },
  sendInput: {    
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 10,
    marginHorizontal: 11,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 15
  },
})
