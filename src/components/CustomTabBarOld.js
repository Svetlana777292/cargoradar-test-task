import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { THEME, mainstyles } from '../theme';
import LinearGradient from 'react-native-linear-gradient';
import IconHome from './Svg/IconHomeDriver';
import IconMessage from './Svg/IconMessage';
import IconBurgerMenu from './Svg/IconBurgerMenu';
import Icon from '@react-native-vector-icons/entypo';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActiveTab } from '../store/features/filtersSlice';
import { useNavigation } from '@react-navigation/native';
import IconChats from './Svg/IconChats';
import IconHomeDriver from './Svg/IconHomeDriver';
import IconHomeClient from './Svg/IconHomeClient';
import { CommonActions } from '@react-navigation/native';
import IconClientTnd from './Svg/IconClientTnd';
import IconRoutes from './Svg/IconRoutes';
import IconChatsTab from './Svg/IconChatsTab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { height } from '../util/helperConst';

export const CustomTabBarOld = (props) => {
  const {state, navigation, descriptors, insets, style} = props;
  const safeInsets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const role = useSelector((state) => state.login.role)
  const showWelcomeCaurusel = useSelector((state) => state.login.showWelcomeCaurusel)
  const firstOpen = useSelector((state) => state.login.firstOpen)
  // console.log('CustomTabBar showWelcomeCaurusel', showWelcomeCaurusel)
  const dispatch = useDispatch()

  // console.log('props', props)
  // console.log('focusedRoute', focusedRoute)
  // console.log('descriptors',' JSON.stringify(descriptors,null,2)',descriptors)
  // console.log('focusedDescriptor', focusedDescriptor)
  // console.log('focusedOptions', focusedOptions)
  
  function getBage(data, name) {
    // console.log('data', data.options?.tabBarBadge)
    const chatTabRegex = name == 'TendersTab' ?  /^TendersTab-.*/ : /^SearchTab-.*/
    for (const key in data) {
      if (key.match(chatTabRegex)) {
        // Найден объект, ключ которого начинается с "ChatTab-"
        const chatTabObject = data[key];
        // console.log(chatTabObject);
        return chatTabObject
      }
    }
  }

  // const bage = role=='client' ? getBage(descriptors, 'TendersTab') : getBage(descriptors, 'SearchTab')

  // console.log('bage', bage?.options?.tabBarBadge)

  const {
    tabBarShowLabel,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarStyle, //<-- this is get from options,which we set from sub screens 
    tabBarBadge,
    tabBarBadgeStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
  } = focusedOptions;

  
  // console.log('focusedOptions', focusedOptions)
  // console.log('tabBarStyle', tabBarStyle)
  // console.log('focusedRoute', focusedRoute)
  // console.log('focusedRoute', focusedRoute?.name)
  // ( focusedRoute?.name !=='ProfileTab')
  return (
    <>
      {
        showWelcomeCaurusel === true ?
        null
        :
        <>
          {
            //!!пока не настроим вход о слайдером firstOpen === false && role === 'driver'?
            firstOpen === true && role === 'driver'?
              null
            :
              <>
                {/* {
                (focusedRoute?.name !=='ProfileTab') ? //focusedRoute?.name !=='CreateTab'&&
                  // <LinearGradient colors={['red', 'blue']} useAngle angle={-135} 
                  // <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} useAngle angle={-135}  {height: 90},
                  // style={[styles.container, {...tabBarStyle}]}>
                  : null
                } */}
                    <View 
                    style={[styles.container, {...tabBarStyle},{paddingBottom: safeInsets?.bottom}]}
                    // style={
                    //   [styles.container, {...tabBarStyle}, tabBarStyle.display =='none' ? {height: 0} : {height: 65+safeInsets?.bottom}, 
                    // // Platform.OS === 'ios' ? {height: 65+safeInsets?.bottom,paddingBottom: safeInsets?.bottom}: {height: 65, paddingBottom: 5}
                    // ]}
                    >

                      {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                          options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;
                        // const icon = options?.tabBarIcon() //options?.tabBarIcon()
                        // console.log('icon ', icon)
                        // console.log('options ', options)
                        // console.log('\x1b[43m%s %s\x1b[0m','options?.tabBarBadge ', options?.tabBarBadge)
                        const isFocused = state.index === index;
                        // const widthItemBar = (route.name ==='TendersTab' || route.name ==='RoutesTab') ? '37%' : '21%'
                        const widthItemBar ='25%'
                        
                        const onPress = () => navigation.navigate(route.name);
                        
                        // const onPress = () => {
                        //   const event = navigation.emit({
                        //     type: 'tabPress',
                        //     target: route.key,
                        //     canPreventDefault: true,
                        //   });
                        //   // console.log('event', event)
                        //   // console.log('focusedRoute?.name', focusedRoute?.name)
                          
                        //   if (!isFocused && !event.defaultPrevented) {
                        //     // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        //     // merge: true
                        //     // console.log('\x1b[41m%s %s\x1b[0m', ' route.name, !isFocused ', route.name,isFocused);
                            
                        //     if(route.name==='ProfileTab'&& focusedRoute?.name !=='ProfileTab') {
                        //       console.log('!!!!!!!!!! ----GO TO 1',route.name)
                        //       // const { index, routes} = navigation.getState()
                        //       // console.log('routes', routes)
                        //       // console.log('profile route.name ', route.name)
                        //       // navigation.reset({ name: 'ChatTab',  });
                        //       role === 'client' ?
                        //         navigation.reset({
                        //           index: 0,
                        //           routes: [
                        //             { name: route.name,  },                                    
                        //             {
                        //               name: 'CreateTab',
                        //               state: {
                        //                 routes: [{
                        //                   name: 'CreateTender',
                        //                 }]
                        //               }
                        //             },
                        //             {
                        //               name: 'ProfileTab',
                        //               state: {
                        //                 routes: [{
                        //                   name: 'Profile',
                        //                 }]
                        //               }
                        //             },
                        //           ],
                        //         })
                        //         :
                        //         navigation.reset({
                        //           index: 0,
                        //           routes: [
                        //             { name: route.name, },                                    
                        //             {
                        //               name: 'ProfileTab',
                        //               state: {
                        //                 routes: [{
                        //                   name: 'Profile',
                        //                 }]
                        //               }
                        //             },
                        //             {
                        //               name: 'SearchTab',
                        //               state: {
                        //                 routes: [{
                        //                   name: 'Search',
                        //                 }]
                        //               }
                        //             },
                        //           ],
                        //         })
                              
                        //       // navigation.navigate({ name: route.name,  });
                        //       // console.log('111111', route.name,focusedRoute?.name)
                            
                        //     } else {
                        //       console.log('!!!!!!!!!! ----GO TO 2',route.name,focusedRoute?.name)
                        //       // navigation.dispatch(state => {
                        //       //   // Remove the home route from the stack
                        //       //   let routes = state.routes.filter(r => r.name !== focusedRoute?.name);
                        //       //   console.log('routes', routes)
                        //       //   // routes = [{name: route.name,}, ...routes]
                        //       //   return CommonActions.reset({
                        //       //     ...state,
                        //       //     routes,
                        //       //     index: 0,
                        //       //   });
                        //       // });
                        //       // navigation.jumpTo(route.name)
                        //       role === 'client' ?
                        //       navigation.reset({
                        //         index: 0,
                        //         routes: [
                        //           { name: route.name,},                                  
                        //           {
                        //             name: 'TendersTab',
                        //             state: {
                        //               routes: [{
                        //                 name: 'TenderItemClient',
                        //               },]
                        //             }
                        //           },
                        //         ],
                        //       })
                        //       :
                        //       navigation.reset({
                        //         index: 0,
                        //         routes: [
                        //           { name: route.name},
                        //           {
                        //             name: 'SearchTab',
                        //             state: {
                        //               routes: [{
                        //                 name: 'Search',
                        //               },
                        //               // {
                        //               //   name: 'SearchTenderItemScreen',
                        //               // },
                        //               {
                        //                 name: 'TenderItemScreen',
                        //               }
                        //               ]}
                        //           },
                        //           {
                        //             name: 'ProfileTab',
                        //             state: {
                        //               routes: [{
                        //                 name: 'Profile',
                        //               }]
                        //             }
                        //           },
                        //           // {
                        //           //   name: 'TendersTab',
                        //           //   state: {
                        //           //     routes: [
                        //           //     {
                        //           //       name: 'TenderItemScreen',
                        //           //     }
                        //           //     ]}
                        //           // },
                        //         ],
                        //       })
                        //       // console.log('navigation.getState()', navigation.getState())
                        //       // navigation.navigate({ name: route.name,  });
                        //     }
                              
                        //     // navigation.navigate({ name: route.name});
                        //   } else if (!event.defaultPrevented && isFocused){
                        //     console.log('!!!!!!!!!! ----GO TO 3',route.name)
                        //     navigation.navigate({ name: route.name,});
                        //     // if(route.name==='SearchTab') {
                        //     //   // console.log('\x1b[42m%s %s\x1b[0m', ' route.name ===SearchTab, isFocused ', route.name,isFocused);
                            
                        //     //   dispatch(setIsActiveTab(0))
                        //     //   navigation.navigate({ name: 'Search',});
                        //     // }
                        //     // if(route.name==='CreateTab') {
                        //     //   // console.log('\x1b[42m%s %s\x1b[0m', ' route.name ===SearchTab, isFocused ', route.name,isFocused);
                            
                        //     //   // dispatch(setIsActiveTab(0))
                        //     //   navigation.navigate({ name: 'CreateTender',});
                        //     // }
                        //     // if(route.name==='TendersTab') {
                        //     //   // console.log('\x1b[42m%s %s\x1b[0m', ' route.name ===SearchTab, isFocused ', route.name,isFocused);
                            
                        //     //   // dispatch(setIsActiveTab(0))
                        //     //   navigation.navigate({ name: 'Tenders',});
                        //     // }
                        //     // if(route.name==='RoutesTab') {
                        //     //   // console.log('\x1b[42m%s %s\x1b[0m', ' route.name ===SearchTab, isFocused ', route.name,isFocused);
                            
                        //     //   dispatch(setIsActiveTab(0))
                        //     //   navigation.navigate({ name: 'Routes',});
                        //     // }
                        //     // if(route.name==='ChatTab') {
                        //     //   // console.log('\x1b[42m%s %s\x1b[0m', ' route.name ===SearchTab, isFocused ', route.name,isFocused);
                            
                        //     //   dispatch(setIsActiveTab(0))
                        //     //   navigation.navigate({ name: 'ChatsList',});
                        //     // }
                        //   }
                        // };
                        // console.log('state', state)
                        
                        return (
                          <TouchableOpacity
                            key={index+'tab'}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={[styles.barItems, {width: widthItemBar,}]}
                          > 
                            {
                              role == 'client' && route.name === 'TendersTab'&& options?.tabBarBadge ?
                                <View style={[mainstyles.alCjcC, styles.bageIcon,]}>
                                  <Text style={[mainstyles.text12R,{color: '#fff',lineHeight: 14,}]}>{options?.tabBarBadge}</Text>
                                </View>
                              : null
                            }
                            {
                              role == 'client' && route.name === 'ActiveTendersTab'&& options?.tabBarBadge ?
                                <View style={[mainstyles.alCjcC, styles.bageIcon,]}>
                                  <Text style={[mainstyles.text12R,{color: '#fff',lineHeight: 14,}]}>{options?.tabBarBadge}</Text>
                                </View>
                              : null
                            }
                            {
                              role == 'driver' && route.name === 'SearchTab'&& options?.tabBarBadge ?
                                <View style={[mainstyles.alCjcC, styles.bageIcon,]}>
                                  <Text style={[mainstyles.text12R,{color: '#fff',lineHeight: 14,}]}>{options?.tabBarBadge}</Text>
                                </View>
                              : null
                            }
                            {
                              role == 'driver' && route.name === 'ActiveDriverTendersTab'&& options?.tabBarBadge ?
                                <View style={[mainstyles.alCjcC, styles.bageIcon,]}>
                                  <Text style={[mainstyles.text12R,{color: '#fff',lineHeight: 14,}]}>{options?.tabBarBadge}</Text>
                                </View>
                              : null
                            }
                            {
                              role == 'driver' && route.name === 'RoutesTab'&& options?.tabBarBadge ?
                                <View style={[mainstyles.alCjcC, styles.bageIcon,]}>
                                  <Text style={[mainstyles.text12R,{color: '#fff',lineHeight: 14,}]}>{options?.tabBarBadge}</Text>
                                </View>
                              : null
                            }

                            {route.name ==='SearchTab'?
                              <View style={[styles.itemFirst,styles.item]}>
                                <IconHomeDriver color={isFocused ? THEME.PRIMARY:THEME.GREY400}/>
                              </View>
                            :
                            <>
                              {route.name ==='CreateTab'?
                              <View style={[role === 'client' ?styles.itemFirst: styles.itemSearch,styles.item]}>
                                <IconHomeClient color={isFocused ? THEME.PRIMARY:THEME.GREY400}/>
                              </View>
                                : 
                                <>
                                  {
                                    route.name === 'ActiveDriverTendersTab' ||  route.name === "ActiveTendersTab"?
                                    <View style={[styles.itemFour,styles.item]}>
                                      <Icon name="direction" size={20} color={isFocused ? THEME.PRIMARY:THEME.GREY400} />
                                    </View>
                                    : 
                                    <>
                                      {
                                        route.name ==='TendersTab'?
                                        <View style={[styles.itemThird,styles.item]}>
                                          <IconClientTnd color={isFocused ? THEME.PRIMARY:THEME.GREY400}/>
                                        </View>
                                        : <>
                                        {
                                          route.name ==='RoutesTab' ?
                                            <View style={[styles.itemThird,styles.item]}>
                                              <IconRoutes color={isFocused ? THEME.PRIMARY:THEME.GREY400}/>
                                            </View>
                                          : <>
                                            {
                                              route.name ==='ProfileTab'? 
                                              <View style={[styles.itemFour,styles.item]}>
                                                <IconBurgerMenu color={isFocused ? THEME.PRIMARY:THEME.GREY400}/>
                                              </View>
                                              : 
                                              <>
                                                
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
                            <Text style={[mainstyles.text12R,{color: isFocused ? THEME.PRIMARY : THEME.GREY400, fontWeight: '400', backgroundColor: 'transparent'}]}>{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
              </>
          }
        </>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    borderTopColor: '#EEEEEE',
    borderTopWidth: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink',
  },
  barItems: {
    // backgroundColor: 'pink',
    width: '25%',
    paddingTop: 5,
    // paddingBottom: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    // backgroundColor: 'orange',
    // height: '65%',
    height: 30,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemSearch: {
    // backgroundColor: 'red',
  },
  itemFirst: {
    // backgroundColor: 'red',
    // alignSelf: 'flex-end',
    // paddingRight: 15,
  },
  itemSecond: {
    // backgroundColor: 'pink',
  },
  itemThird: {
    // backgroundColor: 'purple',
  },
  itemFour: {
    // backgroundColor: 'lightgreen',
  },
  bageIcon: {
    position: 'absolute',
    top: 5,
    right: '30%',
    alignSelf: 'center',
    minWidth: 18,
    height: 18,
    borderRadius: 40,
    zIndex: 999,
    padding: 1,
    backgroundColor: 'rgba(231, 54, 37, 0.8)',
  }
})