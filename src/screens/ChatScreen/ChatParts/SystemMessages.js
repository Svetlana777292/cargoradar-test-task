import { Text, View } from "react-native"
import { mainstyles, THEME } from "../../../theme"

import { styles } from './../chatstyles'
import IconStarSmallF from "../../../components/Svg/IconStarSmallF"

  export const renderSystemMessage = (props) => {
    // console.log('renderSystemMessage props.currentMessage', props.currentMessage.priceBet)
    const msgType = props.currentMessage?.textSystem
    {/* {
      props.currentMessage.user.avatar !== null ?
      <Image source={{uri: props.currentMessage.user.avatar}} style={{width:33, height:33, borderRadius: 20,}}/>
      :<View style={[mainstyles.alCjcC, styles.smallavatar]}>
        <Icon name="camera" color={THEME.GREY400} size={18}  />
      </View>
    } */}

    // return (
    //   <View style={[{ width: '100%',alignSelf: 'center', marginVertical: 8,}]}>
    //     <View style={[styles.borderBlock,styles.borderBlockFeedback]}>
    //       {
    //         props.currentMessage.user._id === 1 ?
    //         <Text style={[mainstyles.text13R]}>Вы выбрали другого исполнителя. Чат добавлен в неактивные.</Text>
    //         : <Text style={[mainstyles.text13R]}>Клиент выбрал другого исполнителя. Заявка закрыта. Чат добавлен в неактивные.</Text>
    //       }
    //     </View>
    //   </View>
    // )
    return (
      <View style={[{ width: '100%',alignSelf: 'center', marginVertical: 8,}]}>
        {
          msgType==='feedback' ?
          <View style={[styles.borderBlock,styles.borderBlockFeedback]}>
            <View style={[mainstyles.pB5, mainstyles.rowalC]}>
              {
                props.currentMessage.user._id === 1?
                <Text style={[mainstyles.text13R,{paddingRight: 5}]}>Вы оставлили оценку <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>{props.currentMessage?.priceBet}</Text></Text>
                :<Text style={[mainstyles.text13R,{paddingRight: 5}]}>Вам оставлена оценка <Text style={[mainstyles.text16R,{color: THEME.GREY800}]}>{props.currentMessage?.priceBet}</Text></Text>
              }
              <IconStarSmallF />
            </View>
            <Text style={[mainstyles.text13R]}>{props.currentMessage.text}</Text>
          </View>
          :
          <>
            {
              msgType === 'notifyAllDriver' ?
              <>
              <View style={[styles.borderBlock,styles.borderBlockBet]}>
                <View style={[mainstyles.rowalC,]}>
                  {
                    props.currentMessage.user._id === 1 ?
                    <Text style={[mainstyles.text13M]}>Вы выбрали другого исполнителя. Чат добавлен в неактивные.</Text>
                    : <Text style={[mainstyles.text13M]}>Клиент выбрал другого исполнителя. Заявка закрыта. Чат добавлен в неактивные.</Text>
                  }
                </View>
              </View>
              </>
              :
              <>
                {
                  (msgType==='newBetByDriver' || msgType==='newBetByClient' || msgType==='offerFromClient') ?
                  <View style={[styles.borderBlock,styles.borderBlockBet]}>
                    <View style={[mainstyles.rowalC,]}>
                      {
                        props.currentMessage.user._id === 1 ?
                        <Text style={[mainstyles.text13R,{ lineHeight: 18,paddingLeft: 10}]}>Вы предложили цену: {props.currentMessage.priceBet} BYN</Text>
                        : 
                        <Text style={[mainstyles.text13R,{ lineHeight: 18,paddingLeft: 10}]}>{props.currentMessage.user.name} предложил цену: {props.currentMessage.priceBet} BYN</Text>
                      }
                    </View>
                  </View>
                  :
                  <>
                  {
                    (msgType==='acceptTenderByDriver'||msgType==='acceptTenderByClient') ?
                    <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                      <View style={[mainstyles.rowalC,]}>
                        {
                          props.currentMessage.user._id === 1 ?
                          <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>Вы приняли цену: {props.currentMessage.priceBet} BYN</Text>
                          :
                          <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} принял цену: {props.currentMessage.priceBet} BYN</Text>
                        }
                      </View>
                    </View>
                    :
                    <>
                      {
                        (msgType==='addToHidden') ?
                        <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                          <View style={[mainstyles.rowalC,]}>
                            {
                              props.currentMessage.user._id === 1 ?
                              <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы добавили чат в неактивные </Text>
                              :
                              <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} добавил чат в неактивные</Text>
                            }
                          </View>
                        </View>
                        : <>
                          {
                            (msgType==='removeFromHidden') ?
                            <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                              <View style={[mainstyles.rowalC,]}>
                                {
                                  props.currentMessage.user._id === 1 ?
                                  <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>Вы восстановили чат </Text>
                                  :
                                  <Text style={[mainstyles.text13R,{lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} восстановил чат</Text>
                                }
                              </View>
                            </View>
                          : <>
                            {
                              (msgType==='cancelAcceptedBet') ?
                              <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                                <View style={[mainstyles.rowalC,]}>
                                  {
                                    props.currentMessage.user._id === 1 ?
                                    <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы отменили ставку {props.currentMessage.priceBet} BYN </Text>
                                    :
                                    <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} отменил ставку {props.currentMessage.priceBet} BYN</Text>
                                  }
                                </View>
                              </View>
                              : <>
                                {
                                (msgType==='orderCanceled') ?
                                <View style={[styles.borderBlock,styles.borderBlockBet,{borderColor: THEME.BRIGHT_GREEN}]}>
                                  <View style={[mainstyles.rowalC,]}>
                                    {
                                      props.currentMessage.user._id === 1 ?
                                      <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>Вы отменили выполнение заказа: {props.currentMessage.text}</Text>
                                      :
                                      <Text style={[mainstyles.text13R,{ lineHeight: 18, paddingLeft: 10}]}>{props.currentMessage.user.name} отменил выполнение заказа: {props.currentMessage.text}</Text>
                                    }
                                  </View>
                                </View>
                                :<>
                                </>
                                }
                              </>
                            }
                            </>
                          }
                        </>
                      }
                    </>
                  }
                  </>
                }
              </>
            }
          </>
        }
      </View>
    )
  }