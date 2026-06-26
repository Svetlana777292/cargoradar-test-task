import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, BackHandler } from 'react-native';

//packages
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/entypo';
import { useDispatch, useSelector } from 'react-redux';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { timest } from '../util/const';
import { checkDateOfTender, findClosestDateObject, findLargestDateFromRender, findMaxDateObject, findSmallestDateFromRender, getCurrentDate } from '../util/tools';
import { addUsersWithChatsToHidden, firebeseUpdateTender } from '../util/tenders';
import { height } from '../util/helperConst';

//components
import { AddressPointsView } from '../components/AddressPointsView';
import TopTabBarTextClientTenders from '../components/TopTabBarTextClientTenders';
import IconTrash from '../components/Svg/IconTrash';
import IconCheck from '../components/Svg/IconCheck';

//styles
import { SIZE, THEME, mainstyles } from '../theme';
import { getTenderHiddenClient } from '../util/firebase';
import { userProfileTenderHiddenClient } from '../store/features/userSlice';
import { get } from '../store/features/api/user-api';
import { normalize } from '../util/UI/fontsUI';

export const TendersScreen = ({route,navigation}) => {
  console.log('TendersScreen', )
  const isfocused = useIsFocused()
  const {role, userProfileInfo,userFormsHiddenTenders} = useSelector((state) => state.login)
  
  const uid = '2'//auth().currentUser.uid
  const safeInsets = useSafeAreaInsets();
  const informerState = useSelector((state) => state.listofchats.informerState)
  // console.log('const informerState', informerState)
  const hiddenTenderClient = useSelector((state) => state.user.hiddenTenderClient)
  const [dataTender, setDataTender] = useState([])
  const [dataTenderActive, setDataTenderActive] = useState([]);
  const [dataTenderArch, setDataTenderArch] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isActiveTab, setIsActiveTab] = useState(0)
  const [isVisibleSettings, setIsVisibleSettings] = useState(false)
  const [choseTenderArr, setChoseTenderArr] = useState([])
  const currentDateState = getCurrentDate()
  // console.log('dataTenderActive', dataTenderActive)

  const dispatch = useDispatch()
  
  const handleOnPressTopTab = (item) => {
    // console.log('item', item)
    if(item===isActiveTab) return;
    switch (item) {
      case 0:
        setIsActiveTab(0)
        // dataTenderActive?.length === 0 ? setIsVisibleSettings(false)
        break;
      case 1:
        setIsActiveTab(1)
        setIsVisibleSettings(false)
        break;
      case 2:
        setIsActiveTab(2)
        setIsVisibleSettings(false)
        break;
        
      default:
        setIsActiveTab(0)
        break;
    }
  }

  const handleGoTender = (item) => {
    // console.log('text', JSON.stringify(item, null, 2))
    navigation.navigate('TenderItemClient',{dataTender: item})
  }

  function parseDate(point,currDate) {
    // console.log('parseDate', point,currDate)
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

  //проверка даты
  function findClosestDate(startPoints, currentDateState) {
    // const currentDate =  Date.parse(currentDateState); //в милисекундах
    // console.log('currentDate', currentDate) 

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Получаем миллисекунды этой даты
    let milliseconds = currentDate.getTime();
    // console.log(milliseconds);
    
    //дата range, single
    const dates = startPoints.map((point) => parseDate(point,milliseconds));

    const closestDate = dates.reduce((prev, curr) => {
      if (curr <= milliseconds && curr > prev) {
        return curr;
      } else if (curr > milliseconds && (curr < prev || prev <= milliseconds)) {
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

  function sortTender(arrTender,arrInformer) {
    // console.log('arrInformer', arrInformer)
    // bb4PeV1ovXD7MzASR2rB - test004_0013 10:44:43
    // RHI25Zv8B1bkp8UZBM0K - test004_0012 10:45:18
    let informers = arrInformer.slice()
    let tenders = arrTender.slice()
    let idToTimeMap = {};
    informers.forEach(item => {
      idToTimeMap[item.tenderId] = new Date(item.createdAt.replace(" ", "T") + "Z").getTime();
    });
    // console.log('idToTimeMap', idToTimeMap)
    // Теперь используем этот объект для сортировки arr2.
    tenders.sort((a, b) => {
      // Получаем время для каждого элемента из arr2
      let timeA = idToTimeMap[a.id] || 0; // Если id отсутствует в arr, считаем время как 0
      let timeB = idToTimeMap[b.id] || 0;
      // Сортируем по убыванию времени
      // console.log('idToTimeMap[a.id]', idToTimeMap[a.id])
      // console.log('idToTimeMap[b.id]', idToTimeMap[b.id])
      // console.log('return res ', timeA,timeB , timeB - timeA)
      // return timeB < timeA ?  1 : -1;
      return timeB - timeA ;
    });
    // console.log('tenders', tenders)
    return tenders
    // return arrTender
  }

  const getTender = async () => {
    setIsLoading(true)

    try {
       const response = await get(`tenders`) // `?active=0` только неактивные
      //  const response = await get(`tenders/${userProfileInfo.id}`, )
      
        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          alert(response.error);
          return;
        }
        setDataTender(response.data)
        setIsLoading(false)
        // console.log('response.data', response.data)
    } catch (error) {
      setIsLoading(false)
      console.log('getTender error', error)
    }
    // // if(role === 'client') {
    //   try {
    //     await firestore().collection('tenders')
    //     .where('userId', '==', uid)
    //     // .where('createdAt', '>', timest)        
    //     .get()
    //     .then((querySnapshot) => {
          
    //       console.log('querySnapshot \n', querySnapshot.size)
    //       let odjTender = []
    //       // let odjActiveTender = []
    //       // let odjArch = []
    //       let refreshHidden = false
    //       querySnapshot.forEach(documentSnapshot => {
    //         // console.log('querySnapshot Tender: ', documentSnapshot.id, documentSnapshot.data().name, documentSnapshot.data().createdAt.toMillis())
    //         // let createdAt = documentSnapshot.data().createdAt.toMillis()
            
    //         // if(createdAt > timest) {
    //           let tenderDocument = {
    //             data: documentSnapshot.data(),
    //             id: documentSnapshot.id,
    //           }

    //           // archived === true - в архив
    //           if(documentSnapshot.data().hasOwnProperty('archived') && documentSnapshot.data().archived === false ) {
    //             // console.log('tender checkTender date', documentSnapshot.id, documentSnapshot.data().name)          
                
    //             //не в работе проверять даты
    //             if(documentSnapshot.data().driverId === null) {
    //               // odjTender.push(tenderDocument)
    //               //проверять на актуальность дат
    //               let checkTender = checkDateOfTender(documentSnapshot.data().startPoints)
    //               // console.log('checkTender', checkTender)
                  
    //               if(checkTender === false) {
    //                 try {
    //                   tenderDocument.data.archived = true
    //                   console.log('!!!', tenderDocument.data.archived)
    //                   firebeseUpdateTender(documentSnapshot.id,{'archived': true})
    //                   // odjArch.push(tenderDocument)

    //                   //usersIdWithChat - юзеров добавлять в неактивные себе и им если заявка становится архивной по времени
    //                   //в скрытые себе
    //                   let arrOfUserToHidden = documentSnapshot.data()?.usersIdWithChat?.length > 0 ? documentSnapshot.data().usersIdWithChat.map(elem => {
    //                     return {userId: elem, tenderId: documentSnapshot.id}
    //                   }) : []
    //                   console.log('arrOfUserToHidden', arrOfUserToHidden)
    //                   //есть юзері для добавления в скрытые
    //                   //проверяем есть ли они в скрытых
    //                   if(arrOfUserToHidden?.length > 0) {
    //                     addUsersWithChatsToHidden(arrOfUserToHidden,hiddenTenderClient,uid,tenderDocument)
    //                     refreshHidden = true
    //                   }

    //                 } catch (error) {
    //                   console.log('upd firebeseUpdateTender arcived', error)
    //                 }
    //               } else {
    //                 odjTender.push(tenderDocument)
    //               }

    //             } 

    //             // else if( //!!убрано 3/07/24
    //             //   // documentSnapshot.data().finishedAt === null && 
    //             //   documentSnapshot.data().driverId !== null &&
    //             //   documentSnapshot.data().replyId !== null) {
    //             //     odjTender.push(tenderDocument) //!!для теста 9/05
    //             //     // odjActiveTender.push(tenderDocument)
    //             //     // odjTender.push(tenderDocument) //11.02.24 - активные заявки дублируются во все заявки
    //             //     return
    //             //   }
    //           }
    //         // }
    //       })
    //       // console.log('odjArch:', odjArch)
    //       let sortArr = odjTender?.length > 1 ? odjTender.sort((a,b) => {return a.data.createdAt.toMillis() < b.data.createdAt.toMillis() ? 1 : -1}) : odjTender
        
    //       if(informerState?.length > 0 && sortArr?.length) {
    //        let sortArrInf = sortTender(sortArr,informerState)
    //         setDataTender(sortArrInf)
    //       } else {
    //         setDataTender(sortArr)
    //       }
            
    //       // setDataTenderArch(odjArch)
    //       // setDataTenderActive(odjActiveTender)
          
    //       if(refreshHidden === true) {
    //         getTenderHiddenClient(uid,dispatch,userProfileTenderHiddenClient)
    //       }
    //       setIsLoading(false)
    //     })
        
    //   } catch (error) {
    //     setIsLoading(false)
    //     console.log('err', error);
    //   }
  }

  const handleChoseTender =(item)=>{
    // console.log('handleChoseTender item', item)

    if(!choseTenderArr.includes(item)) {
      setChoseTenderArr([...choseTenderArr, item]) 
    } else {
      setChoseTenderArr(choseTenderArr.filter((elem)=> elem!==item))
    }
  }
  
  const handleChoseTenderRemove =(item)=>{
    // console.log('handleChoseTenderRemove item', item)
    if(choseTenderArr.includes(item)) {
      setChoseTenderArr(choseTenderArr.filter((elem)=> elem!==item))
    } else {
    }
    // if(choseTenderArr?.length === 0) {
    //   setIsVisibleSettings(false)
    // }
  }
  const handleChoseAllChats = (arrOfTenders,arrOfId,setArrOfId) => {
    console.log('handleChoseAllChats', arrOfTenders.length)

    if(arrOfTenders.length===arrOfId?.length) return // у клиента arrOfId будет с объектом
    
      let newArr = []
      arrOfTenders.forEach((elem,index)=> {
        console.log('TS  newArr elem ',)
        // newArrCl.push(elem.data.id)
        newArr.push(elem.id)
      })
      console.log('newArr', newArr)
      setArrOfId(newArr)    
  }
  const handleSetToArchive = async (arr) =>{

    // try {
    //   let arrNew = await new Promise.all(
    //     arr.map(
    //       async(item) => {
    //       let newArr = await firestore()
    //         .collection('tenders')
    //         .doc(item)
    //         .update({
    //           'archived': true
    //         })
    //         .then(res => {
              
    //           console.log('', )
    //           return true
    //         })
    //         return newArr
    //     }))
    //     let check = arrNew.filter((elem) => !!elem)
    //       console.log('check', check)
    //       console.log('newArr', check)

    //       if(check.length > 0) {
    //         getTender()
    //         setIsVisibleSettings(false)
    //         setChoseTenderArr([])
    //       }
    // } catch (error) {
    //   console.log('error', error)
    // }
  }

  const handleCloseSettings =()=>{
    setIsVisibleSettings(false)
    setChoseTenderArr([])
  }

  const renderItem = ({ item,index }) => {
    // console.log('renderItem item: ', )
    // let isActiveMyTender = false
    const itemTender = item

    // const dateCurr = findClosestDate(itemTender.startPoints,currentDateState)
    const bgWithIndex = index%2

    let isShowInformer 
    if(informerState?.length > 0) {
      // console.log('itemTender.id', itemTender.id) 
      isShowInformer = informerState.find(elemFn => itemTender.id === elemFn.tenderId) ? true : false
    }
    // console.log('isShowInformer', isShowInformer)
    // console.log('choseTenderArr', choseTenderArr)
    let isChose =  choseTenderArr.find(elem=> {return elem===itemTender.id} )
    // console.log('isChose', isChose)
    let earliestDate = findClosestDateObject(itemTender.startPoints)//findSmallestDateFromRender(itemTender.startPoints);
    let latestDate = findMaxDateObject(itemTender.endPoints);
    // console.log('itemTender.startPoints', itemTender.startPoints)

    return (
      <TouchableOpacity 
        onLongPress={()=>{setIsVisibleSettings(true),handleChoseTender(itemTender.id)}}
        onPress={()=>handleGoTender(item)} 
        style={[styles.itemContainer,           
        { overflow: 'hidden', backgroundColor: bgWithIndex ===0 ? '#fff': THEME.GREY100, paddingBottom: 0},
        // isActiveMyTender ? {borderColor: THEME.PRIMARY,borderWidth: 1, borderTopWidth: 0} : null
        
      ]}>
        {
          isChose ?
          <TouchableOpacity onPress={()=>handleChoseTenderRemove(itemTender.id)}
            style={[mainstyles.bagePriceBase,{position: 'absolute', top: 5,left: 5, justifyContent: 'center', alignItems: 'center', borderColor: THEME.PRIMARY,width: 25, height: 25, borderRadius: 25, borderWidth:2, zIndex: 999}]}>
            <IconCheck />
          </TouchableOpacity>
          : null
        }
        {
          isShowInformer === true ?
          <View style={{position: 'absolute',width: 20, height: 20, borderRadius: 30, backgroundColor: THEME.REDERR, top:-7,right:-7}}/>
          :
          null
        }
        <View style={[styles.inner, isChose?{marginTop: 5,marginLeft: 25, marginRight: 0, } : null,]}>
          {__DEV__&&<>
              <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>id: {itemTender.id} </Text>
              <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>userId: {itemTender.userId} </Text>
            </>}
          <View style={[mainstyles.row, styles.titleItemContainer]} >
            <Text style={[mainstyles.text16M,styles.textColorD,styles.titleTextTender]}>{itemTender.name}</Text>
            <View style={[styles.priceTextTender]}> 
              <Text style={[mainstyles.text16M,{color: THEME.GREY900}]}>{itemTender.price} руб.</Text>
            </View>
          </View>

          <View style={[{}]} >
            <AddressPointsView disable={true} type={'start'} data={itemTender.startPoints} length={itemTender.startPoints.length} onPress={()=>{}}/>
            <AddressPointsView disable={true} type={'end'} data={itemTender.endPoints} length={itemTender.endPoints.length} onPress={()=>{}}/>
          </View>
          <View style={[mainstyles.rowalCjcSb,{ backgroundColor: 'transparent'}]} >
            <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
            <Text style={[mainstyles.text14R]}>{earliestDate}-{latestDate}</Text>
            </View>
            {
              itemTender.route.distance?.length > 0? 
              <Text style={[mainstyles.text16M]}> {itemTender.route.distance} км.</Text>
              : <Text> - </Text>
            }
          </View>

        </View>
      </TouchableOpacity>      
    )
  }

  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      console.log('START GET useFocusEffect getTender', )
      // if(isfocused) {

      // }
      getTender()
    }, [userFormsHiddenTenders])
  )

  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      if(informerState?.length > 0 && dataTender?.length > 0) {
        
        // console.log('isfocused', isfocused)
      let sortArrInf = sortTender(dataTender,informerState)
      // console.log('sortArrInf', sortArrInf)
      setDataTender(sortArrInf)
     }
    }, [informerState])
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


  return (
  <View style={[styles.container, ]}>
    <StatusBar translucent barStyle={'dark-content'}/>
    <View style={{paddingTop: safeInsets.top, }}>
      
          {/* {
          !isVisibleSettings  ? 
            <Text style={[mainstyles.text18R,{paddingVertical: 3,color: THEME.PRIMARY, alignSelf: 'center'},]}>Мои заказы</Text>
          :
          <>
          </>
          } */}
      
      {
        isVisibleSettings ?
        <View style={[mainstyles.rowalCjcSb,mainstyles.pV10,{width: '100%'}]}>
          <TouchableOpacity style={{paddingLeft: 10}} onPress={handleCloseSettings}>
            <Icon name='cross' color={THEME.PRIMARY} size={28}/>
          </TouchableOpacity>
          <View style={[mainstyles.outlBage25]}>
            <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY600}]}>{choseTenderArr?.length}</Text>
          </View>
          <TouchableOpacity style={[mainstyles.pH5]} onPress={()=>handleChoseAllChats(dataTender,choseTenderArr,setChoseTenderArr)}>
            <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Выбрать все</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[mainstyles.rowalC,mainstyles.pH5]} onPress={()=>handleSetToArchive(choseTenderArr)}>
            <IconTrash /><Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>В Архив</Text>
          </TouchableOpacity>
        </View>
        : null
      }
      <TopTabBarTextClientTenders isActive={isActiveTab} onPress={handleOnPressTopTab} isChangeTitle={dataTenderActive.length}/>

      <FlatList
        style={{paddingBottom: 20}}
        data={dataTender}
        ListEmptyComponent={()=> (
          <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id+'weqwe'}
      />
          {/* {
            isActiveTab===0 ?
            <>
              {
                dataTenderActive?.length === 0 ?
                :
                <FlatList
                  data={dataTenderActive}
                  ListEmptyComponent={()=> (
                    <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
                  )}
                  renderItem={renderItemActive}
                  keyExtractor={item => item.id+'weqwe'}
                />
              }
            </>
            :
            null
          }
          {
             isActiveTab===1 ?
             <>
              {
                dataTenderActive?.length === 0 ?
                  <FlatList
                    data={dataTenderActive}
                    ListEmptyComponent={()=> (
                      <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
                      )}
                    renderItem={renderItemActive}
                    keyExtractor={item => item.id+'weqwe'}
                  />
                  :
                  <FlatList
                    data={dataTender}
                    ListEmptyComponent={()=> (
                      <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
                    )}
                    renderItem={renderItem}
                    keyExtractor={item => item.id+'weqwe'}
                  />
              }
             </>
             : null
          }
          {
             isActiveTab===2 ?
              <FlatList
                data={dataTenderArch}
                ListEmptyComponent={()=> (
                  <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
                )}
                renderItem={renderItemArch}
                keyExtractor={item => item.id+'weqwe'}
              />
             : null
          } */}
    </View>
    {
      isLoading ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999,}]}>
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
    backgroundColor: '#fff',
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
    position: 'relative',
    paddingBottom: 45
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
    paddingBottom: 15
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
    position: 'relative',
    backgroundColor: '#f5f5f5',
    // backgroundColor: 'lightblue',
    paddingVertical: 12,
    // paddingHorizontal: 15,
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
});