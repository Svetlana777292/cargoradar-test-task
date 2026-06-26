import React, { useState, useEffect,useRef } from 'react';
import { StatusBar, Text, View, StyleSheet, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, BackHandler } from 'react-native';

//packages
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice
import { checkDateOfTender, findClosestDateObject, findLargestDateFromRender, findMaxDateObject, findSmallestDateFromRender, getCurrentDate} from '../util/tools';

//components
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import TopTabBarText from '../components/TopTabBarText';
import IconRoute from '../components/Svg/IconRoute';
import { AddressPointsView } from '../components/AddressPointsView';

//styles
import { SIZE, THEME, mainstyles } from '../theme';
import { get } from '../store/features/api/user-api';
import { normalize } from '../util/UI/fontsUI';
import { getUserActivities } from '../store/features/api/userInfoForms';
import { sortRoutes, sortTender } from '../util/SearchScreen/helpersdriverfilter';

const height = Dimensions.get("window").height

export const RoutesScreen = ({route,navigation}) => {

  console.log('RoutesScreen', )
  // Geocoder.init(keyAPi, {language : "ru"})
  const mapViewRef = useRef(null)
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  const role = useSelector((state) => state.login.role)
  const tenderFaivor = useSelector((state) => state.user.tenderFaivor)
  const tenderDelete = useSelector((state) => state.user.tenderDelete)
  const msgState = useSelector((state) => state.notification.msgState)
  const informerRoutesState = useSelector((state) => state.listofchats.informerRoutesState)
  const { userProfileInfo,userFormsInfo, userFormsActivities,checkUpdFormActivities, checkUpdFormsRouteOffers } = useSelector((state) => state.login)

  const currentDateState = getCurrentDate()
  const [isLoading, setIsLoading] = useState(false)
  const [dataTender, setDataTender] = useState([])
  const [dataTenderArch, setDataTenderArch] = useState([])

  const [isActiveTab, setIsActiveTab] = useState(0)
  const [notifDotArr, setNotifDotArr] = useState([]);
  
  // const [currAddressPosition, setCurrAddressPosition] = useState(null)
  console.log('informerRoutesState', informerRoutesState)
    const dispatch = useDispatch()

  const handleOnPressTopTab = (item) => {
    console.log('item', item)
    if(item===isActiveTab) return;
    switch (item) {
      case 0:
        setIsActiveTab(0)
        break;
      case 1:
        setIsActiveTab(1)
        break;
        
      default:
        setIsActiveTab(0)
        break;
    }
  }
  const checkActiveInformers = (userActivities,informers,dataTender) => {
    // console.log('text', informers)
    // console.log('item', item)
    // let idRoutes = []

    dataTender && dataTender.forEach(elem => {
      // idRoutes.push(elem.id)
      //есть ли по этому роуту информер 
      //да - проверить стейт активные - в нем есть роут айди ? тогда ничего не делать если нет то подгрузить новый стейт
      let checkInf = informers.find(elm => {
        return elm.routeId === elem.id
      })
      // console.log('checkInf', checkInf)

      if(checkInf !== undefined) {
        //информер есть 
        //проверяем есть ли в активностях
        let checkActive = userActivities.driverRoutesOffers.find(elemAct => {
          // console.log('checkActive in', elemAct.routeId,checkInf.routeId)
          return elemAct.routeId === checkInf.routeId && elemAct.tenderId === elem.id
        })
        //нету - обновить стейт
        // console.log('checkActive', checkActive)
        if(checkActive === undefined) {
          getUserActivities(dispatch)
        }
        //есть - ничего не делать
      }
    })
    //есть роут и информер но стейт в стейте нету - обновить стейт

    // console.log('idRoutes', idRoutes)
    // let checkInformers = informers.find(elem => {
    //   // if()
    //   dataTender.includes()
    // })
  }

  const handleNavTo = (item) => {
    setIsActiveTab(0)
    navigation.navigate('RouteItem',{dataTender: item})
  }

  function parseDate(point,currDate) {    
    console.log('parseDate', point,currDate)
    if(point.typeDate === 'single') {
      return point.dateMls
    } else {
      //диапазон дат возвращать дату ближайшую к сегодняшней
      if(currDate >= point.rangeDateMls[0] && currDate <= point.rangeDateMls[1]) {
        return currDate
      } else {
        return point.rangeDateMls[0]
      }
    }
  }

  function findClosestDate(startPoints, currentDateState) {
    // const currentDate =  Date.parse(currentDateState);
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Получаем миллисекунды этой даты
    let milliseconds = currentDate.getTime();

    const dates = startPoints.map((point) => parseDate(point,milliseconds));
    console.log('dates',dates)
    // const dates = dates1.sort((a,b) => {
    //   return a.date < b.date ?  1 : -1 
    // });

    const closestDate = dates.reduce((prev, curr) => {
      // console.log('1', new Date(prev), new Date(curr), curr, currentDate, prev)
      // console.log('2', curr <= currentDate && curr > prev ? curr : prev)
      // return curr <= currentDate && curr > prev ? curr : prev;
      if (curr <= currentDate && curr > prev) {
        return curr;
      } else if (curr > currentDate && (curr < prev || prev <= currentDate)) {
        return curr;
      } else {
        return prev;
      }
    }, dates[0]);

    return formatDateInRender(closestDate);
  }

  function formatDateInRender(date) {
    const d = new Date(date)
    let formattedDate = ("0" + d.getDate()).slice(-2)  + "." + ("0"+(d.getMonth()+1)).slice(-2)  + "." + d.getFullYear()
    return formattedDate;
  }

  function sortRoutesByInformerMatch(routes, userstate, informers) {
    // Нормализуем типы, если где-то tenderId число, а где-то строка
    const norm = (x) => String(x);

    // 1) Множество всех tenderId из информеров
    const informerTenderIds = new Set(informers.map(i => norm(i.tenderId)));

    // 2) Множество routeId, у которых есть пара (routeId, tenderId),
    //    где tenderId присутствует в информерах
    const priorityRouteIds = new Set();
    for (const u of userstate) {
      if (informerTenderIds.has(norm(u.tenderId))) {
        priorityRouteIds.add(u.routeId);
      }
    }

    // 3) Сортируем: приоритетные — вперед
    return [...routes].sort((a, b) => {
      const aP = priorityRouteIds.has(a.id);
      const bP = priorityRouteIds.has(b.id);
      if (aP && !bP) return -1;
      if (!aP && bP) return 1;
      return 0; // внутри групп порядок сохраняем
    });
  }
  // const sortedRoutes = (routes,userstate,informers) => {

  //   return routes.sort((a, b) => {

  //     const isMatch = (route) => {
  //       // Находим запись в driverRoutesOffers по routeId
  //       const offer = userstate.find(
  //         (o) => o.routeId === route.id
  //       );
  //       console.log('offer', offer)
  //       if (!offer) return false;
    
  //       // Проверяем, есть ли в информерах tenderId = offer.tenderId
  //       return informers.some((inf) => inf.tenderId === offer.tenderId && offer.routeId === );
  //     };
    
  //     const aMatch = isMatch(a);
  //     const bMatch = isMatch(b);
  //     console.log('aMatch', aMatch)
  //     console.log('bMatch', bMatch)
    
  //     if (aMatch && !bMatch) return -1; // a идёт раньше
  //     if (!aMatch && bMatch) return 1;  // b идёт раньше
  //     return 0; // порядок не меняем
  //   });
  // }

  const getRoutes = async () => {
    setIsLoading(true)

    try {
        const response = await get(`routes`)
      //  const response = await get(`tenders/${userProfileInfo.id}`, )
      
        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          alert(response.error);
          return;
        }
        setIsLoading(false)
        let arch=[]
        let activ=[]
        response.data.forEach(elem => {
          elem.archived === true ? arch.push(elem): activ.push(elem)
        })
        //- добавить сортировку по информерам
        const sortRouts = sortRoutesByInformerMatch(activ,userFormsActivities.driverRoutesOffers,informerRoutesState) 
        const sortRoutesArch = sortRoutesByInformerMatch(arch,userFormsActivities.driverRoutesOffers,informerRoutesState) 
        // const sortRouts = sortRoutes(activ,informerRoutesState) 
        // const sortRoutesArch = sortRoutes(arch,informerRoutesState) 

        setDataTenderArch(sortRoutesArch)
        setDataTender(sortRouts)
        // console.log('response.data', response.data)
    } catch (error) {
      setIsLoading(false)
      console.log('getRoutes error', error)
    }
    //   try {
    //     // .where('createdAt', '>', timest) для проверки сортировки
    //     await firestore().collection('routes')
    //     .where('userId', '==', uid)
    //     // .where('createdAt', '>', timest)
    //     .get()
    //     .then((querySnapshot) => {
          
    //       console.log('querySnapshot \n', querySnapshot.size)
    //       let obj = []
    //       let objArch = []
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('querySnapshot Tender: ', documentSnapshot.data())
    //         // let createdAt = documentSnapshot.data().createdAt.toMillis()
            
    //           let tenderDocument = {
    //             data: documentSnapshot.data(),
    //             id: documentSnapshot.id,
    //           }
    //         // if(createdAt ) {
    //         //   let tenderDocument = {
    //         //     data: documentSnapshot.data(),
    //         //     id: documentSnapshot.id,
    //         //   }
    //         //   //дописать автопроставление архива
    //         //   if (documentSnapshot.data().archived===false) {
    //         //     console.log('documentSnapshot.data().archived', documentSnapshot.data().archived)
    //         //     obj.push(tenderDocument)
    //         //   } else {
    //         //     objArch.push(tenderDocument)
    //         //   }
    //         // }

    //         if(documentSnapshot.data().hasOwnProperty('archived') && documentSnapshot.data().archived===true ) {

    //           objArch.push(tenderDocument)
    //         } else {              
              
    //           //проверять на актуальность дат
    //           let checkTender = checkDateOfTender(documentSnapshot.data().startPoints)
    //           console.log('checkTender', checkTender)
              
    //           if(checkTender === false) {
    //             try {
    //               tenderDocument.data.archived = true
    //               console.log('!!!', tenderDocument)
    //               // firebeseUpdateTender(documentSnapshot.id,{'archived': true})
    //               firestore().collection('routes').doc(documentSnapshot.id).update({'archived': true})
    //               objArch.push(tenderDocument)
    //             } catch (error) {
    //               console.log('upd firebeseUpdateTender arcived', error)
    //             }
    //           } else {
    //             obj.push(tenderDocument)
    //           }
    //         }
    //       })
    //       // console.log('obj:', obj)
    //       setDataTender(obj)
    //       setDataTenderArch(objArch)
    //       setIsLoading(false)
    //     })
        
    //   } catch (error) {
    //     setIsLoading(false)
    //     console.log('err', error);
    //   }
  }


  const renderItem = ({ item,index }) => {
    // console.log('renderItem item: ', item)
    // let isActiveMyTender = false
    const itemTender = item
    
    // const dateCurr = findClosestDate(itemTender.startPoints,currentDateState)
    const bgWithIndex = index%2
    // let dataLenght = dataTender.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);
    let latestDate = findMaxDateObject(itemTender.endPoints);
    // console.log('bgWithIndex', bgWithIndex)
    let isShowInformer = informerRoutesState.find(elem => {

      // let res = userFormsActivities.driverRoutesOffers.includes()
    })
    if(informerRoutesState?.length > 0) {

      // console.log('item.',  informerRoutesState.find(elemFn => {itemTender?.offersTendersId?.includes(elemFn.tenderId)})) 
      // let tenderId = offersTendersId.includes()  
      isShowInformer = informerRoutesState.find(elemFn => {
        // console.log('elemFn informers', elemFn)
        let res = userFormsActivities.driverRoutesOffers.find(elem => {
          // console.log('elem in state', elem)
          return elemFn.tenderId === elem.tenderId && item.id === elem.routeId
        })
        // console.log('res', res)
        if(res !== undefined) return elemFn
      }) ? true : false
    }

    return (
      <TouchableOpacity onPress={()=>handleNavTo(item)} style={[styles.itemContainer, {
        overflow: 'hidden',
        backgroundColor: isActiveTab!==2 ?(bgWithIndex ===0 ? '#fff': THEME.GREY100):(bgWithIndex ===0 ? '#fff': '#FCF0E0'), marginBottom: index === dataTender.length-1 ? 60:0},
      //  isActiveMyTender ? {borderColor: THEME.PRIMARY,borderWidth: 1, borderTopWidth: 0} : null
        ]}>
          {
            isShowInformer === true ?
            <View style={{position: 'absolute',width: 20, height: 20, borderRadius: 30, backgroundColor: THEME.REDERR, top:-7,right:-7}}/>
            :
            null
          }
        <View style={[styles.inner, ]}>
          {__DEV__&&
              <Text style={[mainstyles.text16M,styles.textColorD]}>{itemTender.id}</Text>
          }
            <View style={[mainstyles.rowalCjcSb, styles.titleItemContainer,]}>
              <Text style={[mainstyles.text16M,styles.textColorD]}>{itemTender.name}</Text>
            </View>

            <View style={[{width: '100%',}]} >
              <AddressPointsView disable={true} type={'start'} data={itemTender.startPoints} length={itemTender.startPoints.length} showDots={false}/>
              <AddressPointsView disable={true} type={'end'} data={itemTender.endPoints} length={itemTender.endPoints.length} showDots={false}/>
            </View>
            {/* <View style={[mainstyles.rowalCjcSb,{paddingTop: 10}]} >
              <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
                <Text style={styles.btnMPText}>Детали</Text>
                  <Icon name="chevron-small-right" size={26} color={THEME.MAIN_COLOR} />
              </View>

              <Text style={styles.btnMPText}>{dateCurr}</Text>
            </View> */}
            <View style={[mainstyles.rowalCjcSb,{ backgroundColor: 'transparent'}]} >
              <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
              <Text style={[mainstyles.text14R]}>{earliestDate}-{latestDate}</Text>
              </View>
              <Text style={[mainstyles.text16M]}>{itemTender.route.distance} км</Text>
            </View>

        </View>     
      </TouchableOpacity>      
    )
  }

  const renderItemArchived = ({ item,index }) => {
    // console.log('renderItem item: ', item)
    // let isActiveMyTender = false
    const itemTender = item
    
    // const dateCurr = findClosestDate(itemTender.startPoints,currentDateState)
    const bgWithIndex = index%2
    // let dataLenght = dataTender.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);
    let latestDate = findMaxDateObject(itemTender.endPoints);
    // console.log('bgWithIndex', bgWithIndex)
    let isShowInformer = informerRoutesState.find(elem => {

      // let res = userFormsActivities.driverRoutesOffers.includes()
    })
    if(informerRoutesState?.length > 0) {

      // console.log('item.',  informerRoutesState.find(elemFn => {itemTender?.offersTendersId?.includes(elemFn.tenderId)})) 
      // let tenderId = offersTendersId.includes()  
      isShowInformer = informerRoutesState.find(elemFn => {
        // console.log('elemFn informers', elemFn)
        let res = userFormsActivities.driverRoutesOffers.find(elem => {
          // console.log('elem in state', elem)
          return elemFn.tenderId === elem.tenderId && item.id === elem.routeId
        })
        // console.log('res', res)
        if(res !== undefined) return elemFn
      }) ? true : false
    }

    return (
      <TouchableOpacity onPress={()=>handleNavTo(item)} style={[styles.itemContainer, {
        overflow: 'hidden',
        backgroundColor: isActiveTab!==2 ?(bgWithIndex ===0 ? '#fff': THEME.GREY100):(bgWithIndex ===0 ? '#fff': '#FCF0E0'), marginBottom: index === dataTender.length-1 ? 60:0},
      //  isActiveMyTender ? {borderColor: THEME.PRIMARY,borderWidth: 1, borderTopWidth: 0} : null
        ]}>
          {
            isShowInformer === true ?
            <View style={{position: 'absolute',width: 20, height: 20, borderRadius: 30, backgroundColor: THEME.REDERR, top:-7,right:-7}}/>
            :
            null
          }
        <View style={[styles.inner, ]}>
          {__DEV__&&
              <Text style={[mainstyles.text16M,styles.textColorD]}>{itemTender.id}</Text>
          }
            <View style={[mainstyles.rowalCjcSb, styles.titleItemContainer,]}>
              <Text style={[mainstyles.text16M,styles.textColorD]}>{itemTender.name}</Text>
            </View>

            <View style={[{width: '100%',}]} >
              <AddressPointsView disable={true} type={'start'} data={itemTender.startPoints} length={itemTender.startPoints.length} showDots={false}/>
              <AddressPointsView disable={true} type={'end'} data={itemTender.endPoints} length={itemTender.endPoints.length} showDots={false}/>
            </View>
            {/* <View style={[mainstyles.rowalCjcSb,{paddingTop: 10}]} >
              <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
                <Text style={styles.btnMPText}>Детали</Text>
                  <Icon name="chevron-small-right" size={26} color={THEME.MAIN_COLOR} />
              </View>

              <Text style={styles.btnMPText}>{dateCurr}</Text>
            </View> */}
            <View style={[mainstyles.rowalCjcSb,{ backgroundColor: 'transparent'}]} >
              <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
              <Text style={[mainstyles.text14R]}>{earliestDate}-{latestDate}</Text>
              </View>
              <Text style={[mainstyles.text16M]}>{itemTender.route.distance} км</Text>
            </View>

        </View>     
      </TouchableOpacity>      
    )
  }

  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect getRoutes', )
      getRoutes()
    }, [route,informerRoutesState,userFormsActivities])
  )
  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      if(informerRoutesState.length > 0 && dataTender!== null) {

        checkActiveInformers(userFormsActivities,informerRoutesState,dataTender)
      }
    }, [informerRoutesState,userFormsActivities,dataTender])
  )

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('onBackPress ',)
        return true;
        // if (true) {
        //   // navigation.goBack()
        //   return true;
        // } else {
        //   return false;
        // }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
    // isSelectionModeEnabled, disableSelectionMode
  );

  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect: \n', dataTender.length,dataTenderArch?.length, notifDotArr)
      if(informerRoutesState?.length > 0) {
        
          // console.log('isfocused', isfocused)
        // let sortArrInf = sortTender(dataTenderActive,informerRoutesState)
        // // console.log('sortArrInf', sortArrInf)
        // setDataTenderActive(sortArrInf)

        let activeDot = []
        let archDot = []
        informerRoutesState.forEach(elemState => {
          let res = dataTender.find(elemTender => {
            console.log('elemState', elemState) //
            console.log('elemTender', elemTender) //
            // console.log('qwe', elemState.tenderId,elemTender.id)
            return elemState.tenderId === elemTender.id
          })
          // console.log('res----', res)
          if(res !== undefined) {
            activeDot.push(elemState)
          } else {
            archDot.push(elemState)
          }
        })
        //не работает так как в elemState айди заявки а в elemTender айди маршрута
        // lemTender {"archived": false, "avatar": null, "createdAt": "2025-10-09 12:26:53", "endPoints": [{"address": "Zwaluwenburg 3, 8084 PD 't Harde, Нидерланды", "coords": [Object], "date": "09.10.2025", "dateMls": "2025-10-09 00:00:00", "dateRange": null, "id": 93, "rangeDateMls": null, "typeDate": "single"}], "finishedAt": null, "id": 38, "isEdit": null, "name": "Vnnj", "offersTendersId": [], "quantityOfFinished": null, "rating": null, "route": {"distance": "98.1", "duration": "76.63"}, "startPoints": [{"address": "Oudezijds Achterburgwal 208, 1012 DX Amsterdam, Нидерланды", "coords": [Object], "date": "09.10.2025", "dateMls": "2025-10-09 00:00:00", "dateRange": null, "id": 94, "rangeDateMls": null, "typeDate": "single"}], "userId": 8, "userName": "User8"}
        console.log('00000', activeDot, archDot)
        // setNotifDotArr([activeDot?.length,archDot?.length])
        // console.log('activeDot', activeDot)
      } else if(!informerRoutesState?.length) {
        console.log('in informerState null',)
          setNotifDotArr([])
      }
    }, [informerRoutesState])
  )

  return (
    <View style={[styles.container, {justifyContent: 'space-between'}]}>
      <StatusBar translucent barStyle={'dark-content'}/>
      <View style={{paddingTop: safeInsets.top}}>
        {/* <Text style={[mainstyles.text18R,{paddingVertical: 3,color: THEME.PRIMARY, alignSelf: 'center'},]}>Мои маршруты</Text> */}
        <TopTabBarText data={[
            {title: "Актуальные"},
            {title: "Архив"},
          ]} isActive={isActiveTab} onPress={handleOnPressTopTab} renderAction={notifDotArr}/>
          {
            isActiveTab === 0 ?
              <FlatList
                // style={{backgroundColor: 'red'}}
                data={dataTender}
                ListEmptyComponent={()=> (
                  <View style={[mainstyles.alCjcC,{paddingTop: 50}]}>
                    <IconRoute />
                    <Text style={[mainstyles.text22SB,{color: THEME.PRIMARY,textAlign: 'center',paddingTop: 25,width: '60%'}]}>У вас отсутствуют маршруты</Text>
                    <Text style={[mainstyles.text14R,{color: THEME.GREY600,textAlign: 'center',paddingTop: 0,width: '70%',lineHeight: 22}]}>Опубликовав свои маршруты, вы позволяете заказчикам быстрее найти вас и предложить свой заказ</Text>
                  </View>
                )}
                renderItem={renderItem}
                keyExtractor={item => item.id+'rts'}
              />
              :
              <FlatList
                data={dataTenderArch}
                ListEmptyComponent={()=> (
                  <View style={[mainstyles.alCjcC,{paddingTop: 50}]}>
                    <IconRoute />
                    <Text style={[mainstyles.text22SB,{color: THEME.PRIMARY,textAlign: 'center',paddingTop: 25,width: '60%'}]}>Тут будут отображаться удаленные маршруты</Text>
                  </View>
                )}
                renderItem={renderItemArchived}
                keyExtractor={item => item.id+'rtsarch'}
              />
          }
      </View>
      {
       isActiveTab===0 ?
       <>
        {
          dataTender.length === 0 ? 
          <DefaultBtn title={'Создать маршрут'} onPress={()=>navigation.navigate('CreateRoute')} customStyle={{alignSelf: 'center', marginBottom: 20}}/>
          : 
          <TouchableOpacity onPress={()=>navigation.navigate('CreateRoute')} style={styles.btnAdd}>
            <Icon name={'plus'} size={24} color={'#fff'}/>
          </TouchableOpacity>
        }
       </>
       :<></>
      }
      
      {
        isLoading ?
        <View style={[mainstyles.containerModalGgBl,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,},mainstyles.alCjcC]}>
          <ActivityIndicator color='#fff' size='large'/>
        </View>
        : 
        null
      }
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
    backgroundColor: '#fff',
    position: 'relative',
    // paddingBottom: 65
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  searchBar: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  btnAdd: {
    position: 'absolute',
    bottom: height/5,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.PRIMARY,
    opacity: 0.7,
    shadowColor: THEME.PRIMARY,
    elevation: 20,
  },

  //old
  header: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  headerText: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    color: THEME.MAIN_COLOR
  },
  inner: {
    // backgroundColor: 'red',
    // paddingTop: 20,
    paddingHorizontal: 15,
    // paddingBottom: 15
    width: '100%',
  },
  image: {
    width: '100%',
    height: height*0.45
  },
  textMenu: {
    fontSize: SIZE.normal,
    fontWeight: '700',
    color: THEME.MAIN_COLOR,
    paddingLeft: 15,
  },
  line: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.MAIN_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    paddingLeft: 15
  },
  menuItem: {
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  trtTitle: {
    fontSize: SIZE.normal_m,
    color: THEME.MAIN_COLOR,
    fontWeight: '900',
    paddingVertical: 10
  },
  trtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  iconContainer: {
    position: 'absolute',
    top: 60,
    right: 0,
    // width: 50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    paddingLeft: 15,
    paddingRight: 20,
    paddingVertical: 6,
    elevation: 7,
    zIndex: 2
  },
  counterWrap: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    minWidth: 12,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#fff',

  },
  counterText: {
    color: '#fff',
    fontSize: normalize(11),
    lineHeight: 13
  },
  bageContainer: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    paddingLeft: 5
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    // alignSelf: 'flex-start',
    paddingHorizontal: 5
  },
  itemContainer: {
    backgroundColor: '#f5f5f5',
    // backgroundColor: 'lightblue',
    paddingVertical: 12,
    // paddingHorizontal: 10,
  },
  titleItemContainer: {
    // backgroundColor: 'orange',
    paddingBottom: 14
  },
  textColorD: {
    color: THEME.GREY900
  },
});