import { Day } from "react-native-gifted-chat"
import { THEME } from "../../../theme"

export const renderDay = (props) => {
  return(
    <Day 
      {...props}
      dateFormat='DD.MM.YYYY'
        textStyle={{color: THEME.GREY500, }}
      />
  )
}