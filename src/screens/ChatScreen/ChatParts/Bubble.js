import { Bubble } from "react-native-gifted-chat"
import { THEME } from "../../../theme"
import { normalize } from "../../../util/UI/fontsUI"

  export const renderBubble = (props) => {
    // console.log('renderBubble props',props.currentMessage);
    return (
      <Bubble
        {...props}
        containerStyle={{
          left: {
            // backgroundColor: 'red',            
          },          
          right: {
            // backgroundColor: 'pink',
          },          
        }}
        
        wrapperStyle={{
          left: {
            backgroundColor: THEME.GREY200,
            borderRadius: 15,
          },
          right: {
            borderRadius: 15,
            backgroundColor: 'rgba(94, 173, 255, 0.4)',
            // backgroundColor: props.currentMessage?.file_type ? 'pink': 'red',
          },
        }}
        containerToNextStyle={{
          left: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomLeftRadius: 0
          },
          right: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomRightRadius: 0
          },
        }}
        containerToPreviousStyle={{
          left: {
            borderTopLeftRadius: 15,
            borderTopRigthRadius: 15,
            borderBottomLeftRadius: 0,
          },
          right: {
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomRightRadius: 0,
          },
        }}
        textStyle={{
          right: {
            fontSize: normalize(14),
            lineHeight: normalize(16),
            color: THEME.GREY700
          },
          left: {
            fontSize: normalize(14),
            color: THEME.GREY700
          }
        }} 
        usernameStyle={{
          fontSize: normalize(14),
          color: THEME.GREY700
        }}      
        timeTextStyle={{
          right: {
            color: THEME.GREY700,
          },
          left: {
            color: THEME.GREY700,
          }
        }}
      >
      </Bubble>
    )
  }