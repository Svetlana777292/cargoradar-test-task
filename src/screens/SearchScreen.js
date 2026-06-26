import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';

//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import Icon from '@react-native-vector-icons/entypo';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isPointWithinRadius, isPointInPolygon } from 'geolib'
import { useFocusEffect } from '@react-navigation/native';

//components
import { AddressPointsView } from '../components/AddressPointsView';
import TopTabBar from '../components/TopTabBar';
import IconStarBig from '../components/Svg/IconStarBig';
import { ClasteringMap } from '../components/MapComponents/ClasteringMap';

//functions && features && slice
import { timest } from '../util/const';
import { setIsActiveTab } from '../store/features/filtersSlice';
import { checkPositionPermiss, height } from '../util/helperConst';
import { currDateToMls, currentDateInMlsZeroHours, findClosestDateObject, findEarliestAndLatestDates, findJsonObj, findLargestDateFromRender, findMaxDateObject, findMinMaxDates, findSmallestDateFromRender, getCurrentDate } from '../util/tools';
import { setFirstOpen, setPositionDriverWithTime } from '../store/features/loginSlice';

//styles
import { THEME, mainstyles } from '../theme';
import { SortingComponent } from '../components/Sorts/SortingComponent';
import { SortingComponentModal } from '../components/Sorts/SortingComponentModal';
import { sortByDistance, sortByNearestDate, sortByPosition, sortByPrice } from '../util/sortHelpers';
import { getCurrentPositionAdressAndCoords, getUserCurrPositions } from '../util/geolocation';
import { onSaveCurrPositionWithAddress, setSatatusGeolocation, setShowInfoModal, setShowStatusGps } from '../store/features/userSlice';
import { setPositionDriver } from '../util/firebase';
import { RenderSearchTenderItem } from '../components/FlatlistRenderItems/RenderSearchTenderItem';
import TopTabBarSearch from '../components/TopTabBarSearch';
import { updInformerState } from '../store/features/chatsSlice';
import { get } from '../store/features/api/user-api';
import { getMarkerCoords, sortDocuments } from '../util/SearchScreen/helpersdriversearch';
import { filterDocuments, moveObjectToStartById, sortTender } from '../util/SearchScreen/helpersdriverfilter';
import InfoAskWindow from '../components/Modal/InfoAskWindow';

export const SearchScreen = ({navigation}) => {
  console.log('\x1b[44m%s %s\x1b[0m', 'SearchScreen', );
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  // const mapViewRef = useRef()
  const firstOpen = true //useSelector((state) => state.login.firstOpen)
  // const askGps = useSelector((state) => state.user.showInfoModal)
  const {role, userProfileInfo, userFormsInfo,userFormsActivities, userPhone, carsInfo, driverFavoritsTenders,driverDeleteTenders,userFormsHiddenTenders} = useSelector((state) => state.login)
  const { currentChatId, arrOfInformers, informerState, informerActiveState,checkUnreadMsgInformers } = useSelector((state) => state.listofchats)
  
  // const informerState = useSelector((state) => state.chats.informerState)
  // const informerActiveState = useSelector((state) => state.chats.informerActiveState)
  // console.log('informerState', informerState)
  // console.log('informerActiveState', informerActiveState)
  // const tendersActivity = useSelector((state) => state.user.tendersActivity)
  // const hiddenTender = useSelector((state) => state.user.hiddenTender)

  // console.log('tendersActivity' , tendersActivity)
  // console.log('SearchScreen firstOpen' , firstOpen)
  // console.log('SearchScreen: tendersActivity' , tendersActivity)
  // const tenderFaivor = useSelector((state) => state.user.tenderFaivor)
  // const tenderDel = useSelector((state) => state.user.tenderDelete)
  // console.log('tenderDel', tenderDel)
  const currentPosition = useSelector(state=>state.user.currentPositionWithAddress)
  const status = useSelector(state=>state.user.status)
  // console.log('!!!GEO', currentPosition,status)
  // console.log('\x1b[44m%s %s\x1b[0m','SearchScreen userFormsHiddenTenders', userFormsHiddenTenders?.hiddenTenders, )
  // console.log('\x1b[44m%s %s\x1b[0m','SearchScreen userFormsActivities', userFormsActivities?.driverTenderActivity, )
  // console.log('\x1b[44m%s %s\x1b[0m','SearchScreen userFormsInfo', userFormsInfo, )
  // console.log('\x1b[44m%s %s\x1b[0m','SearchScreen currentPosition', currentPosition, 'status',status)
  // console.log('\x1b[44m%s %s\x1b[0m',' userFormsInfo', userFormsInfo)
  const {objDataFiltering, mapVisible:isVisibleMap, showTnWithMyActv, isActiveTab } = useSelector(state => state.filters)
  // const isConnectedInternet = useSelector(state=>state.user.isConnectedInternet)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  // console.log('\x1b[36m%s %s\x1b[0m', 'SearchScreen objDataFiltering:', objDataFiltering);
  // const currentDateState = getCurrentDate()

  const [dataTender, setDataTender] = useState([])
  const [filteredDataTender, setFilteredDataTender] = useState([])
  const [dataTenderActive, setDataTenderActive] = useState([]);
  const [dataTenderFavorits, setDataTenderFavorits] = useState([])
  // const [dataTenderArchived, setDataTenderArchived] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [isLoading, setisLoading] = useState(false) //true для апк
  const [refreshing, setRefreshing] = useState(false);
  const [region, setRegion] = useState(null);
  const [isShowList,setIsShowList] = useState(false)
  const [currentFlag, setCurrentFlag] = useState(true); 
  const [isChekPositionAlert, setIsChekPositionAlert] = useState(false); 
  const [currentSort, setCurrentSort] = useState('position');
  const [notifDotArr, setNotifDotArr] = useState([]);
  const [topStyle, setTopStyle] = useState(0);
  // console.log('topStyle:', topStyle)
  // console.log('123', dataTender.length)
  // console.log('isVisibleMap', isVisibleMap)
  // console.log('objDataFiltering', objDataFiltering)
  // console.log('status currentPosition', status,currentPosition)
  // console.log('isLoading', isLoading)
  // console.log('dataTenderFavorits', dataTenderFavorits)

  const onSetTopStyle = () => {
    // !isVisibleMap ? setTopStyle(safeInsets?.top) : setTopStyle(0)
    // console.log('isActiveTab', isActiveTab, 'dataTenderActive.length',dataTenderActive.length, 'isVisibleMap',isVisibleMap)
    if(isActiveTab === 0) {
      // находясь на 1 табе
      
      if(isVisibleMap && dataTenderActive.length === 0) {
        //таб Все заказы - карта + нет откликов = 0
        topStyle !== 0 ? setTopStyle(0) : null
        // setTopStyle(0)
      } else {
        // таб Отклики -
        //карта + отклики  = safeInsets.top
        //нет карты + отклики = safeInsets.top
        topStyle === 0 ? setTopStyle(safeInsets.top) : null
        // setTopStyle(safeInsets.top)
      }
    } else if(isActiveTab === 1){
      // находясь на 2 табе
      // if(isVisibleMap && dataTenderActive.length === 0) {
      //   // карта + нет откликов = 0
      //   setTopStyle(safeInsets.top)
      // } else if(!isVisibleMap && dataTenderActive.length !== 0){
      //   //таб Все заказы -  нет карты + отклики = safeInsets.top
      //   setTopStyle(safeInsets.top)
      // } else 
        if(isVisibleMap && dataTenderActive.length !== 0){
        //таб Все заказы -  карта + отклики  = safeInsets.top
        setTopStyle(0)
      } else {
        setTopStyle(safeInsets.top)
      }
      // if(isVisibleMap && dataTenderActive.length !== 0){
      //   //таб Все заказы -  карта + отклики  = safeInsets.top
      //   topStyle !== 0 ? setTopStyle(0) : null
      // } else {
      //   topStyle === 0 ? setTopStyle(safeInsets.top) : null
      // }

    }
  }

  const onRefresh = ()=> {

    console.log('onRefresh: status currentPosition', status,currentPosition)
    if(status!==null&&status==='granted'&&currentPosition!==null) {
      setRefreshing(true);
      getTender()
    } else if(status!==null&&status!=='granted') {
      setRefreshing(true);
      getTender()
    } else {
      setRefreshing(true);
      getTender()
    }
  }
  
  // React.useCallback(() => {

  // }, [status,currentPosition]);
  
  const dispatch = useDispatch()

  const handleOpenTenderItem = (item) => {
    isShowList === true ? setIsShowList(false) : null
    navigation.navigate('TenderItemScreen', {dataTender: item})
  }
  const handleOnPressTopTab = (item) => {
    // console.log('item', item)

    isShowList === true ? setIsShowList(false) : null

    if(item===isActiveTab) return;
    switch (item) {
      case 0:
        dispatch(setIsActiveTab(0))
        break;
      case 1:
        dispatch(setIsActiveTab(1))
        break;
      case 2:
        dispatch(setIsActiveTab(2))
        break;
      case 3:
        dispatch(setIsActiveTab(0))
        navigation.navigate('SearchFilter')
        break;
      case 4:
        dispatch(setIsActiveTab(4))
        break;
    
      default:
        dispatch(setIsActiveTab(0))
        break;
    }
  }

  // const getTenderFaivor =  (data,faivor) => {
  //   console.log('getTenderFaivor start')
  //   if(data && data?.length === 0) return []
  //   return data.filter(item => faivor.includes(item.id))
  //   // console.log('arr', arr)
  //   // setDataTenderFavorits(arr)
  // }
  const setTenderFiltered =  (data,state) => {
    console.log('setTenderFiltered start')
    if(data && data?.length === 0) return []
    return data.filter(item => state.includes(item.id))
    // console.log('arr', arr)
    // setDataTenderFavorits(arr)
  }

  // рендер заявок
  const getTender = async () => {
    // console.log('getTender start')
    // console.log('getTender tenderDel', tenderDel)
    setisLoading(true)
    
    const response = await get('tenders')
    // {aсtive: true}
    
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      alert(response.error);
      setisLoading(false)
      setRefreshing(false);
      return;
    }

    //!! включить sortDocuments и в фитрации по параметрам что бы тоже работало

    const compareArr = sortDocuments(response.data,currentPosition)
    // console.log('response.data', JSON.stringify(response.data,null,2))
    // console.log('compareArr', compareArr, compareArr?.length)
    console.log('compareArr', compareArr, compareArr?.length)

    //!! фильтровать скрытые
    console.log('_gt userFormsHiddenTenders.hiddenTenders', userFormsHiddenTenders.hiddenTenders)
    console.log('_gt 1',  userFormsHiddenTenders.hiddenTenders?.length > 0)
    let filterHidden = userFormsHiddenTenders.hiddenTenders?.length > 0 ? compareArr.filter(elem => {
      if(!userFormsHiddenTenders.hiddenTenders.includes(elem.id)) {
        console.log('elem', elem)
        return elem
      }
    }) : compareArr
    // console.log('response.data', response.data.length)
    console.log('_gt filterHidden', filterHidden)
    setDataTender(filterHidden) // setDataTender(compareArr)

    console.log('_gt userFormsActivities.driverTenderActivity', userFormsActivities.driverTenderActivity)
    let favorTn = setTenderFiltered(response.data,driverFavoritsTenders)
    let activTn = setTenderFiltered(filterHidden,userFormsActivities.driverTenderActivity)
    console.log('activTn', activTn)
    setDataTenderFavorits(favorTn)
    // setDataTenderActive(activTn)
    // setDataTenderActive(response.data)
    // console.log('favorTn', favorTn)

    const getMarkersData = getMarkerCoords(filterHidden) //(compareArr)
    setCoordinates(getMarkersData)

    //если есть нотификации по откликам
    if(informerState?.length > 0 && activTn?.length) {
      console.log('_gt if informerState 1', informerState?.length > 0 && activTn?.length)
      let sortArrInf = sortTender(activTn,informerState)
      setDataTenderActive(sortArrInf)
    } else {
      console.log('_gt if informerState 2 activTn', activTn)
      setDataTenderActive(activTn)
    }

    firstOpen === false ? dispatch(setFirstOpen(true)) : null
    setCurrentFlag(true)
    setCurrentSort('position')
    setisLoading(false)
    setRefreshing(false);
    // refreshing ? setRefreshing(false) : null
    
    // !! odl code - delete after check all fn
    try {
      // console.log('uid', uid)
      // await firestore().collection('tenders')
      // .where('status', '==', 'publish')
      // // .where('archived', '==', false)
      // // .orderBy('createdAt', 'desc')
      // .get()
      // .then((querySnapshot) => {
      //   console.log('querySnapshot \n', querySnapshot.size)
      //   let odjTender = []
      //   let activeTender = []
      //   let archTender = []
      //   querySnapshot.forEach(documentSnapshot => {
      //     //ПРОВЕРКА - заявка не удалена, не в работе поля(driverId replyId их нет или они null), в будущем проверять на отмену водителем
      //     //или сделать статус - поле в котором статус заявки
      //     //заявка не редактируется
      //     // console.log('documentSnapshot.id', documentSnapshot.id)

      //     //!если заявка в неактивном то она уходит в архив

      //     if(hiddenTender.includes(documentSnapshot.id)) {
      //       return
      //     } else if(documentSnapshot.data().userId===uid) {
      //       // мои заявки - скрываются
      //       return
      //     } else if(documentSnapshot.data().hasOwnProperty('isEdit') && documentSnapshot.data().isEdit === true ) {
      //       // редактирующиеся заявки - скрываются
      //       return
      //     } else if(documentSnapshot.data().driverId===uid && documentSnapshot.data().finishedAt !== null) {
      //       // documentSnapshot.data()?.archived === true && 
      //       //все выполненные мной архивные заявки в архив
      //       // console.log('documentSnapshot.id', documentSnapshot.id)
      //       // if(documentSnapshot.data().driverId===uid && documentSnapshot.data().finishedAt !== null) {
      //         // archTender.push({
      //         //   data: documentSnapshot.data(),
      //         //   id: documentSnapshot.id
      //         // })
      //       // }
      //       return
            
      //     } else if(documentSnapshot.data()?.archived === false && documentSnapshot.data().driverId===null &&  tendersActivity?.includes(documentSnapshot.id)) {
      //       //заявки с активностью но не вработе
      //       activeTender.push({
      //         data: documentSnapshot.data(),
      //         id: documentSnapshot.id
      //       })
      //     } else if(documentSnapshot.data()?.archived === false && documentSnapshot.data().driverId===null){
      //       //все заявки не архивные и не выполняются
      //       // console.log('!!!!!!!',  documentSnapshot.id)
      //       let tenderDocument = {
      //         data: documentSnapshot.data(),
      //         id: documentSnapshot.id
      //       }
      //       odjTender.push(tenderDocument)
      //   }
      // })
      // // console.log('!!!!!!!',  odjTender)
      //   // const compareArr = compareTenderDateAndPrice(odjTender)  
      //   const compareArr = sortDocuments(odjTender,currentPosition)
      //   // console.log('odjTender', JSON.stringify(odjTender,null,2))
      //   // console.log('compareArr', compareArr, compareArr?.length)
      //   // let concatarr= activeTender.concat(compareArr)

      //   // console.log('activeTender', activeTender)
      //   // console.log('concatarr', concatarr)
      //   getMarkerCoords(compareArr)
      //   setDataTender(compareArr)
      //   if(informerState?.length > 0 && activeTender?.length) {
      //     let sortArrInf = sortTender(activeTender,informerState)
      //     setDataTenderActive(sortArrInf)
      //   } else {
      //     setDataTenderActive(activeTender)
      //   }

      //   // setDataTenderActive(activeTender)
      //   // setDataTenderArchived(archTender)
      //   firstOpen === false ? dispatch(setFirstOpen(true)) : null
      //   setCurrentFlag(true)
      //   setCurrentSort('position')
      //   setRefreshing(false)
      //   setisLoading(false)
      // })
    } catch (error) {
      // setisLoading(false)
      // setRefreshing(false);
      // setCurrentFlag(true)
      // setCurrentSort('position')
      // // firstOpen === false ? 
      // dispatch(setFirstOpen(true)) 
      // // : null
      // console.log('err', error);
    }
  }

  const renderItem = ({ item,index }) => {
    // console.log('renderItem', item.startPoints[0])
    // let isActiveMyTender = false
    const itemTender = item
    if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId !==uid ) {
        //не в работе поля(driverId replyId их нет или они null)
        return 
    }    
    // if(
    //   (tenderDel !== null && tenderDel !== undefined&& objDataFiltering===null)||
    //   (tenderDel !== null && tenderDel !== undefined && objDataFiltering===null && objDataFiltering?.showHidTender===false)
    // ) {              
    //   if (tenderDel.includes(item.id)) return
    // }
    if(objDataFiltering === null || (objDataFiltering===null && objDataFiltering?.showHidTender===false)){              
      if (driverDeleteTenders.includes(item.id)) return
    }

    if(isVisibleMap===true && region !== null) {
      const startpoint = itemTender.startPoints[0]
      const poinyInPoly = isPointInPolygon({ latitude: startpoint.coords.latitude, longitude: startpoint.coords.longitude }, [
        {
          latitude:  region.latitude + region.latitudeDelta/2,
          longitude: region.longitude - region.longitudeDelta/2,
        },
        {
          latitude:  region.latitude - region.latitudeDelta/2,
          longitude: region.longitude - region.longitudeDelta/2,
        },
        {
          latitude:  region.latitude - region.latitudeDelta/2,
          longitude: region.longitude + region.longitudeDelta/2,
        },
        {
          latitude:  region.latitude + region.latitudeDelta/2,
          longitude: region.longitude + region.longitudeDelta/2,
        },
      ]);
      // console.log('poinyInPoly', poinyInPoly)
      // console.log('startpoint', startpoint)
      if(poinyInPoly === false) return
    }
    // const curDate = currentDateInMlsZeroHours()
    // const dateCurr = findClosestDate(itemTender.startPoints,curDate)

    let bgWithIndex = index%2
    let isShowInformer
    if(informerState?.length > 0) {
      isShowInformer = informerState.find(elemFn => item.id === elemFn.tenderId) ? true : false
    }
    // console.log('isShowInformer', isShowInformer)

    let dataLength = dataTender.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);//findSmallestDateFromRender
    let latestDate = findMaxDateObject(itemTender.endPoints);//findLargestDateFromRender
    // console.log('itemT', itemTender.name, 's', earliestDate,'e', latestDate)
        
    
    return (
      <RenderSearchTenderItem
        indexItem={index}
        isActiveTab={isActiveTab}
        bgWithIndex={bgWithIndex}
        itemTender={item}
        dataLength={dataLength}
        isShowInformer={isShowInformer}
        earliestDate={earliestDate}
        latestDate={latestDate}
        onPress={handleOpenTenderItem}      
      />   
    )
  }
  
  const renderItemActive = ({ item,index }) => {
    // console.log('renderItem', item.data)
    const itemTender = item
    if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId !==uid ) {
        //не в работе поля(driverId replyId их нет или они null)
        return 
    }    
    // if(
    //   (tenderDel !== null && tenderDel !== undefined&& objDataFiltering===null)||
    //   (tenderDel !== null && tenderDel !== undefined && objDataFiltering===null && objDataFiltering?.showHidTender===false)
    // ) {              
    //   if (tenderDel.includes(item.id)) return
    // }
    if(objDataFiltering === null || (objDataFiltering===null && objDataFiltering?.showHidTender===false)){              
      if (driverDeleteTenders.includes(item.id)) return
    }
    // const dateCurr = findClosestDate(itemTender.startPoints,currentDateState)

    const bgWithIndex = index%2
    let isShowInformer
    if(informerState?.length > 0) {
      isShowInformer = informerState.find(elemFn => item.id === elemFn.tenderId) ? true : false
    }
    // console.log('informerState', informerState)
    // console.log('isShowInformer', isShowInformer)
    let dataLength = dataTenderActive.length
    let earliestDate = findClosestDateObject(itemTender.startPoints);//findSmallestDateFromRender
    let latestDate = findMaxDateObject(itemTender.endPoints);//findLargestDateFromRender
    // console.log('bgWithIndex', bgWithIndex)

    return (
      <RenderSearchTenderItem
        indexItem={index}
        isActiveTab={isActiveTab}
        bgWithIndex={bgWithIndex}
        itemTender={item}
        dataLength={dataLength}
        isShowInformer={isShowInformer}
        earliestDate={earliestDate}
        latestDate={latestDate}
        onPress={handleOpenTenderItem}      
      />  
    )
  }

  const handleGetPosition = async () => {
    if(currentPosition == null) {
      
      // TODO: переделать как в таб скрине 
      // запрашиваем позицию если она null

      getCurrentPositionAdressAndCoords(dispatch,onSaveCurrPositionWithAddress, setSatatusGeolocation,setShowInfoModal,setShowStatusGps).then(()=> {
        // console.log('2 useEffect positionDriver === null', currentPositionWithAddress)
        // let dateTimestamp = Date.now()
        // setPositionDriver(uid, currentPosition)
        // dispatch(setPositionDriverWithTime({coords: currentPosition, timestamp: dateTimestamp}))
        // alert('позиция определена')
      })

    } else {
      console.log('??????', )
    }
  }

  const handlePressCallOut = (marker, index, flag) => {
    console.log('handlePressCallOut args', marker, index, flag)
    
    if (flag === 'show') {
      
      if(objDataFiltering!==null && dataTender?.length > 0 && filteredDataTender?.length > 0) {
        //если заявки отфильтрованы и есть подходящие заявки
        let arr = moveObjectToStartById(filteredDataTender,marker.itemId)
          // console.log('arr', arr, )
          setFilteredDataTender(arr)
        
        
      } else if(objDataFiltering == null && dataTender?.length > 0) {
        let arr = moveObjectToStartById(dataTender,marker.itemId)
          // console.log('arr', arr, )
          setDataTender(arr)
      }
    }
  }

  const handlePressSort = (data) => {
    // console.log('handlePressSort data', data)
    // console.log('handlePressSort currentPosition', currentPosition)
    //если выбранное совпадает с текушим не сортировать
    let collection = objDataFiltering!==null && filteredDataTender.length>0? filteredDataTender : dataTender
    if(collection?.length === 0) return
    if(data === currentSort) return
    if(currentPosition == null) {
      
      setIsChekPositionAlert(true)
      return
    }
    setisLoading(true)
    setCurrentSort(data)
    // console.log('handlePressSort sorting', )

    let result = []
    if(data ==='position') {
      //!position
      //TODO проверять текуюую геопозицию и что бы было разрешение геопозиции
      
      result = sortByPosition(collection,currentFlag)
      objDataFiltering!==null && filteredDataTender.length>0? setFilteredDataTender(result): setDataTender(result)
      setisLoading(false)

    } else if(data ==='date') {
      //!date
      result = sortByNearestDate(collection,currentFlag);
      objDataFiltering!==null && filteredDataTender.length>0? setFilteredDataTender(result): setDataTender(result)
      setisLoading(false)
      
    } else if(data ==='distance') {
      //!distance
      result = sortByDistance(collection,currentFlag)
      objDataFiltering!==null && filteredDataTender.length>0? setFilteredDataTender(result): setDataTender(result)
      setisLoading(false)

    } else if(data ==='price') {
      //!price
      result = sortByPrice(collection,currentFlag)

      objDataFiltering!==null && filteredDataTender.length>0? setFilteredDataTender(result): setDataTender(result)
      setisLoading(false)
    }
  }

  const handleChangeFlag = (flag) => {
    console.log('handleChangeFlag flag', flag,currentFlag)
    let collection = objDataFiltering!==null && filteredDataTender.length>0? filteredDataTender : dataTender
    if(collection?.length === 0) return
      setisLoading(true)
      setCurrentFlag(flag => !flag)
      console.log('handleChangeFlag sorting', )
      let result = collection.reverse()    
      objDataFiltering!==null && filteredDataTender.length>0? setFilteredDataTender(result): setDataTender(result)
      setisLoading(false)
  }
  
  // !! get tenders
  useFocusEffect(
    React.useCallback(() => {
      // console.log('START', tenderDel,status,currentPosition)
      if(status !==null && status==='granted' && currentPosition!==null) {
        // console.log('SS useFocusEffect 1 status:', status)
        getTender()
      } else if(status!==null) {
        // console.log('SS useFocusEffect 2 status:', status)
        getTender()
      } else {
        getTender()
      }

      // else {
      //   firstOpen === false ? dispatch(setFirstOpen(true)) : null
      //   console.log('SS useFocusEffect 3 firstOpen:', status)
      // }

    }, [driverFavoritsTenders,status,currentPosition,informerState,userFormsActivities,userFormsHiddenTenders])
  );

    // TODO sort tenders after notif
  useFocusEffect(
    React.useCallback(() => {
      // console.log('useFocusEffect: \n', dataTender.length,dataTenderActive?.length, notifDotArr)
      if(informerState?.length > 0 && dataTenderActive?.length > 0) {
        
          // console.log('isfocused', isfocused)
        let sortArrInf = sortTender(dataTenderActive,informerState)
        // console.log('sortArrInf', sortArrInf)
        setDataTenderActive(sortArrInf)

        let activeDot = []
        let allDot = []
        informerState.forEach(elemState => {
          let res = dataTenderActive.find(elemTender => {return elemState.tenderId === elemTender.id})
          if(res !== undefined) {
            activeDot.push(elemState)
          } else {
            allDot.push(elemState)
          }
        })
        setNotifDotArr([activeDot?.length,allDot?.length])
        // console.log('activeDot', activeDot)
      } else if(!informerState?.length) {
        // console.log('in informerState null',)
          setNotifDotArr([])
      }
      // if(dataTenderActive?.length > 0) {

      // }
      //точки на отклики и точки на все заявки

      //setNotifDotArr
    }, [informerState])
  )
  useEffect(()=>{
    // console.log('notifDotArr ---', notifDotArr)
  },[notifDotArr])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('dataTender: \n', dataTender.length)
  //     if(informerState?.length > 0) {

  //       //если есть информер и нет заявки удалять информер
  //       let delInformers = []
  //       informerState.forEach(elemState => {
  //         let res = dataTender.find(elemTender => elemState.tenderId === elemTender.id)
  //         if(res == undefined) {
  //           delInformers.push(elemState)
  //         }
  //       })
  //       console.log('delInformers', delInformers)
  //       if(delInformers?.length > 0 ) {

  //         dispatch(updInformerState(delInformers))
  //       }
  //     }
  //   }, [informerState,dataTender])
  // )
  
  //!! filter tenders
  useEffect(()=>{
    // console.log('\x1b[33m%s %s\x1b[0m', 'SearchScreen filteredDocuments:', JSON.stringify(dataTender,null,2));
    // console.log('\x1b[33m%s %s\x1b[0m', 'useEffect objDataFiltering',objDataFiltering,filteredDataTender.length);
    if(objDataFiltering!==null && dataTender?.length > 0) {
      // console.log('useEffect objDataFiltering !=', )
      const filteredDocuments = filterDocuments(dataTender, objDataFiltering);
      // console.log('\x1b[33m%s %s\x1b[0m','filteredDocuments', filteredDocuments?.length)
      if(filteredDocuments?.length> 0) {
        getMarkerCoords(filteredDocuments)        
        setFilteredDataTender(filteredDocuments)      
      } else {
        // console.log('filteredDocuments undefined', filteredDocuments)
        setFilteredDataTender([])
        setCoordinates([])
      }
      // console.log('\x1b[33m%s %s\x1b[0m', 'SearchScreen filteredDocuments:', filteredDocuments?.length, filteredDocuments);
      // console.log('\x1b[35m%s %s\x1b[0m', 'SearchScreen objDataFiltering:',objDataFiltering);
    } else if(objDataFiltering===null&&filteredDataTender?.length>0) {
      setFilteredDataTender([])
      getTender()
      // console.log('123123', objDataFiltering===null&&filteredDataTender?.length>0)
    } 

  },[objDataFiltering,dataTender])

  useEffect(()=>{
    // console.log('\x1b[33m%s %s\x1b[0m', 'useEffect objDataFiltering',objDataFiltering,filteredDataTender.length);
    // console.log('\x1b[33m%s %s\x1b[0m', 'SearchScreen filteredDocuments:', filteredDataTender);
  },[filteredDataTender,objDataFiltering])
  
  useEffect(()=>{
    onSetTopStyle()
  },[isActiveTab,dataTenderActive,userFormsHiddenTenders,isVisibleMap,userFormsActivities])


  if(firstOpen === false) {
    return (
      <View style={[mainstyles.alCjcC,{flex: 1,height:height+safeInsets.top,minHeight: height+safeInsets.top, paddingTop: safeInsets.top, backgroundColor: 'rgba(0,0,0,0.5)'}]}>
        <ActivityIndicator color={'#fff'} size='large'/>
      </View>
    )
  } else {

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
        {
          isChekPositionAlert ? 
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{height:height+safeInsets.top,minHeight: height+safeInsets.top, zIndex: 999, paddingTop: safeInsets.top}]}>
            <InfoAskWindow data={findJsonObj(jsonDataPrompt,'checkPositionPermiss',checkPositionPermiss)} onPress={handleGetPosition} onClose={()=>setIsChekPositionAlert(false)}/>
          </View>
          :
          null
        } 
        <View style={[styles.wrapper,{ backgroundColor: 'transparent' }]}>
          {
            isVisibleMap ?
            <>
              {
                isActiveTab === 0 && dataTenderActive.length === 0 ?
                <ClasteringMap 
                  coordinatesArr={coordinates} 
                  isFiltered={objDataFiltering} 
                  regionState={region} 
                  setRegionState={setRegion} 
                  topPosition={safeInsets.top}
                  onPressCallout={handlePressCallOut}
                />
                : 
                <>
                  {
                    isActiveTab === 1 && dataTenderActive.length > 0 ?
                    <ClasteringMap 
                      coordinatesArr={coordinates} 
                      isFiltered={objDataFiltering} 
                      regionState={region} 
                      setRegionState={setRegion} 
                      topPosition={safeInsets.top}
                      onPressCallout={handlePressCallOut}
                    />
                    : null
                    // <>
                    // {
                    //   isActiveTab === 0 ?
                    //   <View style={{paddingTop: safeInsets.top}}>
                    //     <Text style={[mainstyles.text18R,{paddingVertical: 3,color:THEME.PRIMARY,textAlign: 'center'}]}>Активные заказы</Text>
                    //   </View>
                    //   : null
                    // }
                    // </>
                  }
                </>
              }
            </>
            : null
          } 
          {/* <View style={{paddingTop: !isVisibleMap ? safeInsets?.top : 0}}> */}
          <View style={{
            paddingTop: topStyle,
            // backgroundColor: 'orange'
            }}>
            <TopTabBarSearch isActive={isActiveTab} onPress={handleOnPressTopTab} isChangeTitle={dataTenderActive.length} customStyles={{}} renderAction={notifDotArr}/>
          </View>
          {
            dataTenderActive?.length === 0 &&  isActiveTab === 0 || 
            dataTenderActive?.length !== 0 &&  isActiveTab === 1  ?
            <View style={[{position: 'relative'}]}>
              <SortingComponent
                currentFlag={currentFlag}
                currentSort={currentSort}
                onChangeFlag={handleChangeFlag}
                isShowList={isShowList}
                setIsShowList={setIsShowList}
              />
            </View>
            : null
          }
          <View style={{position: 'relative', paddingBottom: 95+safeInsets?.bottom,backgroundColor: 'transparent'}}>
            {
              isShowList?
                <SortingComponentModal 
                  currentSort={currentSort}
                  setIsShowList={setIsShowList}
                  onPressSort={handlePressSort}
                />
              // </View> 
              : null
            }
            {
              isActiveTab === 0  ?
                <>
                  {
                    dataTenderActive?.length === 0 ? 
                    <FlatList
                      style={[{backgroundColor: 'transparent',},isVisibleMap ? {height: height/2-140,paddingBottom: safeInsets?.bottom}: null]}                    
                      data={objDataFiltering!==null && filteredDataTender.length>0? filteredDataTender : dataTender}
                      ListHeaderComponent={()=>(
                        <>
                        {
                          objDataFiltering!==null&&filteredDataTender?.length===0 ?
                          <View style={{justifyContent: 'center', paddingVertical: 20}}>
                            <Text style={[mainstyles.text15R,{textAlign: 'center',color:'#000'}]}>Поиск по вашим параметрам не дал результатов</Text>
                            <Text style={[mainstyles.text15R,{textAlign: 'center',color:'#000'}]}>Возможно вас заинтересуют:</Text>
                            </View>
                          : null
                        }
                        </>
                      )}
                      ListEmptyComponent={() => (
                      <View style={[styles.listEmpty,{height: 300}]}>
                        {
                          isLoading ?
                          <Text style={[mainstyles.text22SB,styles.textEmpty]}>Поиск заказов...</Text>
                          : <Text style={[mainstyles.text22SB,styles.textEmpty]}>Тут пока нет заказов</Text>
                        }
                        </View>)}
                      // renderItem={null}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                      refreshing={true}
                      refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                    />
                    :
                    <FlatList
                      // style={{backgroundColor: 'green',}}
                      data={dataTenderActive}
                      ListEmptyComponent={() => (
                        <View style={[styles.listEmpty,{height: 300}]}>
                        <Text style={[mainstyles.text22SB,styles.textEmpty]}>Здесь пока нет активных заказов</Text>
                      </View>)}
                      renderItem={renderItemActive}
                      keyExtractor={item => item.id}
                      refreshing={true}
                      refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                    />
                    
                  }
                </>
              : null
            }
            {
              isActiveTab === 1 ?
              <>
              {
                dataTenderActive.length === 0 ?
                <FlatList
                  style={{backgroundColor: 'transparent'}}
                  data={dataTenderActive}
                  ListEmptyComponent={() => (
                    <View style={[styles.listEmpty,{height: 300}]}>
                    
                    <Text style={[mainstyles.text22SB,styles.textEmpty]}>Здесь пока нет активных заказов</Text>
                  </View>)}
                  renderItem={renderItemActive}
                  keyExtractor={item => item.id}
                  refreshing={true}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                />
                  : 
                  <FlatList
                  style={[{backgroundColor: 'transparent'},isVisibleMap ? {height: height/2-140, }: null]}
                  data={objDataFiltering!==null && filteredDataTender.length>0? filteredDataTender : dataTender}
                  ListHeaderComponent={()=>(
                    <>
                    {
                      objDataFiltering!==null&&filteredDataTender?.length===0 ?
                      <View style={{justifyContent: 'center', paddingVertical: 20}}>
                        <Text style={[mainstyles.text15R,{textAlign: 'center',color:'#000'}]}>Поиск по вашим параметрам не дал результатов</Text>
                        <Text style={[mainstyles.text15R,{textAlign: 'center',color:'#000'}]}>Возможно вас заинтересуют:</Text>
                        </View>
                      : null
                    }
                    </>
                  )}
                  ListEmptyComponent={() => (
                  <View style={[styles.listEmpty,{height: 300}]}>
                    {
                      isLoading ?
                      <Text style={[mainstyles.text22SB,styles.textEmpty]}>Поиск заказов...</Text>
                      : <Text style={[mainstyles.text22SB,styles.textEmpty]}>Тут пока нет заказов</Text>
                    }
                    </View>)}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  refreshing={true}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                />
    
              }
              </>
              : null
            }
            {
              isActiveTab ===2 ?
              <FlatList
                style={{}}
                data={dataTenderFavorits}
                ListEmptyComponent={() => (
                <View style={[styles.listEmpty,{height: 300}]}>
                  <IconStarBig />
                  <Text style={[mainstyles.text22SB,styles.textEmpty]}>Нет избранных заказов</Text>
                </View>)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                refreshing={true}
              />
              :null
            }
            {/* {
              isActiveTab ===4 ?
              <FlatList
                style={{}}
                data={dataTenderArchived}
                ListEmptyComponent={() => (
                <View style={[styles.listEmpty,{}]}>
                  <Text style={[mainstyles.text22SB,styles.textEmpty]}>Нет завершенных заказов</Text>
                </View>)}
                renderItem={renderItemArch}
                keyExtractor={item => item.id}
                refreshing={true}
              />
              :null
            } */}
          </View>
        </View>      
      </View>
    )
  }
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
    // flex:1,
    // paddingTop: height/4,
     backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', 
    // backgroundColor: 'yellow',
  },
  textEmpty: {
    color: THEME.PRIMARY,textAlign: 'center',paddingTop: 25,width: '60%'
  },

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



// function parseDate(dateStr) {    
//   const [day, month, year] = dateStr.split('.').map((str) => parseInt(str));
//   return new Date(year, month - 1, day).getTime(); // Возвращает миллисекунды
// }


// function parseDateToMilliseconds(dateStr) {
//   const parts = dateStr.split('.');
//   const day = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1;
//   const year = parseInt(parts[2], 10); // Преобразуем двузначный год в четырехзначный
  
//   const dateObject = new Date(year, month, day);
//   // console.log('dateObject', dateObject)
//   return dateObject.getTime();
// }