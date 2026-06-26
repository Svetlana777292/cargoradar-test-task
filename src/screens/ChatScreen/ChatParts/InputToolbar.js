import { Composer, InputToolbar } from "react-native-gifted-chat"
import { mainstyles, THEME } from "../../../theme"
import { styles } from "../chatstyles"
import { normalize } from "../../../util/UI/fontsUI"

export  const renderInputToolbar = (props) => {
    // console.log('PROPS in renderInputToolbar',props);

    return (
      <InputToolbar {...props}
        containerStyle={[
          styles.sendInput,
          mainstyles.shadowG5r8,
          // {backgroundColor: 'red'}
        ]}
        renderComposer={()=>(<Composer {...props} textInputStyle={{color: THEME.GREY700, backgroundColor: 'transparent',paddingRight: 40,fontSize: normalize(14)}} />)}
      />
    )
  }