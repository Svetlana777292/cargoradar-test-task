import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';

//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import Icon from '@react-native-vector-icons/entypo';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';

//components
import { RenderSearchTenderItem } from '../components/FlatlistRenderItems/RenderSearchTenderItem';
import TopTabBarActive from '../components/TopTabBarActive';

//functions && features && slice
import { timest } from '../util/const';
import { checkPositionPermiss, height } from '../util/helperConst';
import {  findClosestDateObject, findJsonObj, findLargestDateFromRender, findMaxDateObject, findSmallestDateFromRender, getCurrentDate } from '../util/tools';
import { setFirstOpen, setPositionDriverWithTime } from '../store/features/loginSlice';

//styles
import { THEME, mainstyles } from '../theme';
import { onSaveCurrPositionWithAddress, setSatatusGeolocation, setShowInfoModal, setShowStatusGps } from '../store/features/userSlice';
import { setPositionDriver } from '../util/firebase';
import { get } from '../store/features/api/user-api';

export const ActiveDriverTendersScreen = ({route,navigation}) => {
  console.log('\x1b[44m%s %s\x1b[0m', 'ActiveDriverTenders', );
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  const {userProfileInfo, userFormsInfo, role } = useSelector((state) => state.login)
  const tendersActivity = useSelector((state) => state.user.tendersActivity)

  const {informerState,informerActiveState} = useSelector((state) => state.listofchats)
  const hiddenTender = useSelector((state) => state.user.hiddenTender)

  console.log('ActiveDriverTenders: informerActiveState' , informerActiveState)
  const tenderDel = useSelector((state) => state.user.tenderDelete)
  // console.log('tenderDel', tenderDel)
  const currentPosition = useSelector(state=>state.user.currentPositionWithAddress)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const status = useSelector(state=>state.user.status)
  // console.log('!!!GEO', currentPosition,status)
  // console.log('\x1b[44m%s %s\x1b[0m','SearchScreen currentPosition', currentPosition, 'status',status)
  
  // const isConnectedInternet = useSelector(state=>state.user.isConnectedInternet)

  const [isActiveTab, setIsActiveTab] = useState(0);
  const [dataTenderActive, setDataTenderActive] = useState([]);
  const [dataTenderArchived, setDataTenderArchived] = useState([])
  const [isLoading, setIsLoading] = useState(false) //true для апк
  const [refreshing, setRefreshing] = useState(false); 
  const [isChekPositionAlert, setIsChekPositionAlert] = useState(false); 

  const onRefresh = () => {
      console.log('onRefresh: ', )
      getTender().finally(()=> setRefreshing(false))
  }
  
  const dispatch = useDispatch()

  const handleOpenTenderItem = (item) => {
    navigation.navigate('TenderItemScreen', {dataTender: item})
  }
  const handleOnPressTopTab = (item) => {
    // console.log('item', item)
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

  function sortTender(arrTender,arrInformer) {
    // console.log('arrInformer', arrInformer)
    // bb4PeV1ovXD7MzASR2rB - test004_0013 10:44:43
    // RHI25Zv8B1bkp8UZBM0K - test004_0012 10:45:18
    let informers = arrInformer.slice()
    let tenders = arrTender.slice()
    let idToTimeMap = {};
    informers.forEach(item => {
      idToTimeMap[item.tenderId] = item.createdAt;
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

  // рендер заявок
  const getTender = async () => {
    console.log('getTender start')
    setIsLoading(true)
    try {
        const response = await get(`tenders/active`)
        // const response = await get(`tenders/${100}` ) //!!TEMP
        
        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          alert(response.error);
          return;
        }
        console.log('response.data', response.data)
        setDataTenderActive(response.data)
        // setDataTenderActive([response.data]) //!!TEMP

        //!archived
        const responseArch = await get(`tenders/finished`)
      
        if (!responseArch.success) {
          console.warn('Ошибка запроса:', responseArch.error);
          //
          alert(responseArch.error);
          return;
        }
        setIsLoading(false)
        setDataTenderArchived(responseArch.data)
        // console.log('responseArch.data', responseArch.data)
    } catch (error) {
      setIsLoading(false)
      console.log('getTender error', error)
    }
    // // console.log('getTender tenderDel', tenderDel)
    // setisLoading(true)
    
    // try {
    //   // console.log('uid', uid)
    //   await firestore().collection('tenders')
    //   .where('createdAt', '>', timest)
    //   // .where('archived', '==', false)
    //   // .orderBy('createdAt', 'desc')
    //   .get()
    //   .then((querySnapshot) => {
    //     console.log('querySnapshot \n', querySnapshot.size)
    //     let odjTender = []
    //     let activeTender = []
    //     let archTender = []
    //     querySnapshot.forEach(documentSnapshot => {
    //       //ПРОВЕРКА - заявка не удалена, не в работе поля(driverId replyId их нет или они null), в будущем проверять на отмену водителем
    //       //или сделать статус - поле в котором статус заявки
    //       //заявка не редактируется
    //       // console.log('documentSnapshot.id', documentSnapshot.id)
          
    //       // !!если заявка в неактивно то в архив
    //       if(hiddenTender.includes(documentSnapshot.id)) {
    //         archTender.push({
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id
    //         })
    //       } else if(documentSnapshot.data().userId===uid) {
    //         // мои заявки - скрываются
    //         return
    //       } else if(documentSnapshot.data().hasOwnProperty('isEdit') && documentSnapshot.data().isEdit === true ) {
    //         // редактирующиеся заявки - скрываются
    //         return
    //       } else if(documentSnapshot.data().driverId===uid && documentSnapshot.data().finishedAt !== null) {
    //         // documentSnapshot.data()?.archived === true && 
    //         //все выполненные мной архивные заявки в архив
    //         // console.log('documentSnapshot.id', documentSnapshot.id)
    //         // if(documentSnapshot.data().driverId===uid && documentSnapshot.data().finishedAt !== null) {
    //           archTender.push({
    //             data: documentSnapshot.data(),
    //             id: documentSnapshot.id
    //           })
    //         // }
            
    //       } else if(documentSnapshot.data()?.archived === false && documentSnapshot.data().driverId===uid && documentSnapshot.data()?.finishedAt === null ) {
    //         //все не архивные выполняемые мной в активные 
    //         //и завершенные мной но не клиентом
    //         activeTender.push({
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id
    //         })
    //       } else if(documentSnapshot.data()?.archived === false && documentSnapshot.data().driverId===null){
    //         return
    //       }
    //   })
    //   // console.log('!!!!!!!',  )
    //   if(informerActiveState?.length > 0 && activeTender?.length) {
    //     let sortArrInf = sortTender(activeTender,informerActiveState)
    //     setDataTenderActive(sortArrInf)
    //   } else {
    //     setDataTenderActive(activeTender)
    //   }
    //   // setDataTenderArch(odjArch)
    //     setDataTenderArchived(archTender)
    //     setRefreshing(false)
    //     setisLoading(false)
    //   })
    // } catch (error) {
    //   setisLoading(false)
    //   setRefreshing(false);
    //   dispatch(setFirstOpen(true)) 
    //   // : null
    //   console.log('err', error);
    // }
  }
  
  const renderItemActive = ({ item,index }) => {
    // console.log('renderItem', item)
    const itemTender = item
    //todo - первая проверка не нужна?
    if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId !==userProfileInfo.id ) {
        //не в работе поля(driverId replyId их нет или они null)
        return 
    }
    if(tenderDel !== null && tenderDel !== undefined) {              
      if (tenderDel.includes(item.id)) return
    }

    const bgWithIndex = index%2
    let isShowInformer
    let infSt = informerState.concat(informerActiveState)
    if(infSt?.length > 0) {
      isShowInformer = infSt.find(elemFn => item.id === elemFn.tenderId) ? true : false
    }
    let dataLenght = dataTenderActive.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);//findSmallestDateFromRender
    let latestDate = findMaxDateObject(itemTender.endPoints);//findLargestDateFromRender
    // console.log('isShowInformer', isShowInformer)
    // console.log('bgWithIndex', bgWithIndex)

    return (
      <RenderSearchTenderItem
        indexItem={index}
        isActiveTab={isActiveTab}
        bgWithIndex={bgWithIndex}
        itemTender={item}
        dataLength={dataLenght}
        isShowInformer={isShowInformer}
        earliestDate={earliestDate}
        latestDate={latestDate}
        onPress={handleOpenTenderItem}      
      />     
    )
  }

  const renderItemArch = ({ item,index }) => {
    console.log('renderItem',)
    let itemTender = item

    if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId !==userProfileInfo.id ) {
        //не в работе поля(driverId replyId их нет или они null)
        return

        //TODO test next
        // if (hiddenTender.includes(item.id)) { } else {

        //   return 
        // }
    }
    //!!hiddenTender.includes - возможно связано с этой строкой в получении заявок
    //!! проверка выше скроет заявку но индекс может быть уже другой и цвет плашки может повторятся
    if(tenderDel !== null && tenderDel !== undefined) {              
      if (tenderDel.includes(item.id)) return
    }

    const bgWithIndex = index%2
    // console.log('bgWithIndex, index', bgWithIndex,index, typeof(bgWithIndex))
    let isShowInformer
    let infSt = informerState.concat(informerActiveState)
    if(infSt?.length > 0) {
      isShowInformer = infSt.find(elemFn => item.id === elemFn.tenderId) ? true : false
    }
    // if(informerActiveState?.length > 0) {
    //   isShowInformer = informerActiveState.find(elemFn => item.id === elemFn.tenderId) ? true : false
    // }
    // console.log('bgWithIndex', bgWithIndex)
    let dataLenght = dataTenderArchived.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);//findSmallestDateFromRender
    let latestDate = findMaxDateObject(itemTender.endPoints);//findLargestDateFromRender

    return (
      <RenderSearchTenderItem
        indexItem={index}
        isActiveTab={isActiveTab}
        bgWithIndex={bgWithIndex}
        itemTender={item}
        dataLength={dataLenght}
        isShowInformer={isShowInformer}
        earliestDate={earliestDate}
        latestDate={latestDate}
        onPress={() => navigation.navigate('TenderItemScreen',{dataTender: item})}
      />   
    )
  }
  
  // !!! проверять что бы было включено
  // useEffect(() => {
  //     // console.log('START', tenderDel,)
  //     getTender() 
  //   },[])
   
  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect getTender ',)
      getTender() 
    }, [route,informerActiveState])
  );

  useFocusEffect(
    // console.log('dataTender: \n', dataTender.length);
    React.useCallback(() => {
      if(informerActiveState?.length > 0 && dataTenderActive?.length > 0) {
        
        // console.log('isfocused', isfocused)
      let sortArrInf = sortTender(dataTenderActive,informerActiveState)
      // console.log('sortArrInf', sortArrInf)
      setDataTenderActive(sortArrInf)
     }
    }, [informerActiveState,route])
  )

  return (
    <View style={[styles.container,]}>
      <StatusBar translucent barStyle={'dark-content'}/>
      {
        isLoading ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{height:height+safeInsets.top,minHeight: height+safeInsets.top, zIndex: 999, paddingTop: safeInsets.top}]}>
          <ActivityIndicator color={'#fff'} size='large'/>
        </View>
        :
        null
      }
      <View style={[styles.wrapper,{ backgroundColor: 'transparent' ,paddingTop: safeInsets?.top}]}>
        {/* {
          isActiveTab === 0 ?
              <View style={{paddingTop: safeInsets.top}}>
                <Text style={[mainstyles.text18R,{paddingVertical: 3,color:THEME.PRIMARY,textAlign: 'center'}]}>Активные заказы</Text>
              </View>
          : 
          <View style={{paddingTop: safeInsets.top}}>
            <Text style={[mainstyles.text18R,{paddingVertical: 3,color:THEME.PRIMARY,textAlign: 'center'}]}>Архивные заказы</Text>
          </View>
        } */}
        
        <View style={{paddingTop: 0}}>
          <TopTabBarActive isActive={isActiveTab} onPress={handleOnPressTopTab} isChangeTitle={dataTenderActive.length}/>
        </View>
        <View style={{position: 'relative', backgroundColor: 'transparent', paddingBottom: 0}}>
          {
            isActiveTab === 0  ?
              <FlatList
                  style={{backgroundColor: 'transparent',}}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  // onRefresh={getTender}
                  data={dataTenderActive}
                  ListEmptyComponent={() => (
                    <View style={styles.listEmpty}>
                    <Text style={[mainstyles.text22SB,styles.textEmpty]}>Здесь пока нет активных заказов</Text>
                  </View>)}
                  renderItem={renderItemActive}
                  keyExtractor={item => item.id}
                  refreshing={true}
                />
            : null
          }
          {
            isActiveTab ===1 ?
            <FlatList
              style={{}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={dataTenderArchived}
              ListEmptyComponent={() => (
              <View style={styles.listEmpty}>
                {/* <IconStarBig /> */}
                <Text style={[mainstyles.text22SB,styles.textEmpty]}>Нет завершенных заказов</Text>
              </View>)}
              renderItem={renderItemArch}
              keyExtractor={item => item.id}
              refreshing={true}
            />
            :null
          }
        </View>
      </View>      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'pink',
    paddingBottom: 95
    // justifyContent: 'center',
    // alignItems: 'center'  
  },
  wrapper: {
    // backgroundColor: 'red',
    // paddingBottom: 120
    
  },

  listEmpty: {
    flex:1,paddingTop: height/4, backgroundColor: 'transparent',justifyContent: 'center', alignItems: 'center', 
  },
  textEmpty: {color: THEME.PRIMARY,textAlign: 'center',paddingTop: 25,width: '60%'},

  //-
  itemContainer: {
    backgroundColor: '#f5f5f5',
    // backgroundColor: 'lightblue',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  infoMarker: {
    position: 'absolute',
    width: 20, 
    height: 20, 
    borderRadius: 30, 
    backgroundColor: THEME.REDERR, 
    top:-10,
    right:-10
  },
  inner: {
    // backgroundColor: 'red'
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
  buttonDatail: {

  },


  qwe: {
    // backgroundColor: 'blue'
  },



  
});