import React from 'react';
import {View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import { THEME, mainstyles } from '../theme';

export default TopTabBarText = (props) => {
  const {
    data,
    isActive,
    renderAction,
    onPress
  } = props;
  // console.log('TopTabBar props:', props)

  return (
    <View style={[styles.container,{height: 44}]}>
      {
        data&&data?.length>0?data.map((item,index)=>{
          return (
            <TouchableOpacity style={[styles.itemInner, ]} onPress={()=>onPress(index)} key={'qwe'+index}>
              <View style={[styles.dotContainer]}>
                {
                  renderAction && renderAction?.length > 0 ?
                  <>
                    {
                      renderAction[index] > 0 ?
                      <>
                        {
                          isActive===index ? 
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
              <Text style={[isActive===index? mainstyles.text16M : mainstyles.text16R,
                {color: isActive===index? THEME.GREY900: THEME.GREY500, paddingHorizontal: 15,}
                ]}>{item.title}</Text>
                {
                  isActive===index ?
                  <View style={[styles.line]} />
                  :null
                }
          </TouchableOpacity>
          )})
        :null
      }
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: THEME.GREY400,
    borderBottomWidth: 1,
    // backgroundColor: 'red'
  },
  itemInner: {
    position: 'relative',
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    // backgroundColor: 'green',
    borderBottomColor: THEME.PRIMARY,
    borderBottomWidth: 3,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom:-1,
    zIndex:2,
    height: '100%',
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