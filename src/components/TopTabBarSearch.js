import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME, mainstyles } from '../theme';
import IconSettings from './Svg/IconSettings';
import IconArch from './Svg/IconArch';
import IconStarTab from './Svg/IconStarTab';

export default TopTabBarSearch = (props) => {
  const {
    isActive,
    onPress,
    isChangeTitle,
    renderAction
  } = props;
  // console.log('TopTabBar renderAction:',isChangeTitle, renderAction)


  return (
    <View style={[styles.container,{minHeight: 44,}]}>

      <TouchableOpacity style={[{width: '32%',},styles.itemInner,]} onPress={()=>onPress(0)} >

        {
          isChangeTitle===0 ?
          <>
          <View style={[styles.dotContainer]}>
            {
              renderAction && renderAction?.length > 0?
              <>
                {
                  renderAction[1] > 0 ?
                  <>
                    {
                      isActive===0 ? 
                      <View style={[styles.dot,styles.dotActive]}/>
                      :
                      <View style={[styles.dot,]}/>
                    }

                  </>
                  :
                  null
                  // <Text>1</Text>
                }
              </>
              : null
              // <Text>2</Text>
            }
          </View>
            <Text style={[isActive===0? mainstyles.text16M : mainstyles.text16R,{color: isActive===0? THEME.GREY900 : THEME.GREY500,paddingHorizontal: 15, textAlign: 'center'}]}>Все заказы</Text>
            {
              isActive===0?
              <View style={[styles.line]} />
              : null
            }
          </>
          : 
          <>
          <View style={[styles.dotContainer]}>
            {
              renderAction && renderAction?.length > 0 ?
              <>
                {
                  renderAction[0] > 0 ?
                  <>
                    {
                      isActive===0 ? 
                      <View style={[styles.dot,styles.dotActive]}/>
                      :
                      <View style={[styles.dot,]}/>
                    }

                  </>
                  :
                  null
                  // <Text>1</Text>
                }
              </>
              : null
              // <Text>2</Text>
            }
          </View>
            <Text style={[isActive===0? mainstyles.text16M : mainstyles.text16R,{color: isActive===0? THEME.GREY900 : THEME.GREY500,paddingHorizontal: 15}]}>Отклики</Text>
            {
              isActive===0?
              <View style={[styles.line]} />
              : null
            }
          </>          
        }
      </TouchableOpacity>

      <TouchableOpacity style={[{width: '32%',},styles.itemInner, ]} onPress={()=>onPress(1)}>

        {
          isChangeTitle===0 ?
          <>
          <View style={[styles.dotContainer]}>
            {
                renderAction && renderAction?.length > 0 ?
                <>
                  {
                    renderAction[0] > 0 && isChangeTitle > 0 ?
                    <>
                      {
                        isActive===1 ? 
                        <View style={[styles.dot,styles.dotActive]}/>
                        :
                        <View style={[styles.dot,]}/>
                      }

                    </>
                    :
                    null
                    // <Text>1</Text>
                  }
                </>
                : null
                // <Text>2</Text>
              }
          </View>
           <Text style={[isActive===1? mainstyles.text16M : mainstyles.text16R,{color: isActive===1? THEME.GREY900 : THEME.GREY500,paddingHorizontal: 15}]}>Отклики</Text>
            {
              isActive===1?
              <View style={[styles.line]} />
              : null
            }
          </>
          :
          <>
          <View style={[styles.dotContainer]}>
            {
              renderAction && renderAction?.length > 0 ?
              <>
                {
                  renderAction[1] > 0 ?
                  <>
                    {
                      isActive===1 ? 
                      <View style={[styles.dot,styles.dotActive]}/>
                      :
                      <View style={[styles.dot,]}/>
                    }

                  </>
                  :
                  null
                  // <Text>1</Text>
                }
              </>
              : null
              // <Text>2</Text>
            }
          </View>
            <Text style={[isActive===1? mainstyles.text16M : mainstyles.text16R,styles.textP,{color: isActive===1? THEME.GREY900 : THEME.GREY500, textAlign: 'center'}]}>Все заказы</Text>
            {
              isActive===1?
              <View style={[styles.line]} />
              : null
            }
          </>
        }
      </TouchableOpacity>

      
      <TouchableOpacity style={[{width: '18%',},styles.itemInner, {backgroundColor: 'transparent'}]} onPress={()=>onPress(2)}>
        {/* <View style={styles.textP}> */}
          {/* <IconStarSmall color={isActive===2?THEME.GREY900:THEME.GREY500} /> */}
          <IconStarTab color={isActive===2?THEME.GREY900:THEME.GREY500} />
        {/* </View> */}
          {
            isActive===2?
            <View style={[styles.line]} />
            : null
          }
      </TouchableOpacity>

      {/* <TouchableOpacity style={[{width: '12%',},styles.itemInner,{backgroundColor: 'transparent'} ]} onPress={()=>onPress(4)}>
          <IconArch color={isActive===4?THEME.GREY900:THEME.GREY500} />
          {
            isActive===4?
            <View style={[styles.line]} />
            : null
          }
      </TouchableOpacity> */}

      <TouchableOpacity style={[{width: '18%',},styles.itemInner, isActive===3 ?  styles.active : null,{backgroundColor: 'transparent'} ]} onPress={()=>onPress(3)}>
        {/* <View style={[styles.textP,]}>
        </View> */}
          <IconSettings color={isActive===3?THEME.GREY900:THEME.GREY500}/>
      </TouchableOpacity>
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: THEME.GREY400,
    borderBottomWidth: 1,
    // backgroundColor: 'green'
  },
  itemInner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'pink'
  },
  textP: {
    // paddingVertical: 8,
    // paddingHorizontal: 10,
    // backgroundColor: 'orange'
  },
  line: {
    // backgroundColor: 'green',
    borderBottomColor: THEME.PRIMARY,
    borderBottomWidth: 3,
    alignSelf: 'center',
    width: '90%',
    position: 'absolute',
    bottom:-1,
    zIndex:2,
    height: '100%'
  },
  dotContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
    // backgroundColor: 'red'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    borderWidth:1,
    borderColor: '#fff',
    backgroundColor: THEME.GREY400,
  },
  dotActive: {
    backgroundColor: THEME.REDERR
  },
})