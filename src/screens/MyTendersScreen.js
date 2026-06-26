import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { getCurrentDate } from '../util/tools';
import { timest } from '../util/const';
import { height } from '../util/helperConst';

//components
import TopTabBarText from '../components/TopTabBarText';
import { HeaderTitleComponent } from '../components/Headers/HeaderTitleComponent';
import { AddressPointsView } from '../components/AddressPointsView';

//styles
import {THEME, mainstyles} from '../theme'
import { get } from '../store/features/api/user-api';

//где используется скрин?
export const MyTendersScreen = ({route, navigation}) => {
  // console.log('route')
  const safeInsets = useSafeAreaInsets();
  const uid = '2'//auth().currentUser.uid
  
  const tenderDel = useSelector((state) => state.user.tenderDelete)
  const blackListArr = useSelector((state) => state.user.blacklist)
  const msgState = useSelector((state) => state.notification.msgState)

  const role = useSelector((state) => state.login.role)
  console.log('role', role)
  const [dataTender, setDataTender] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [dataReplsAndTenders, setDataReplsAndTenders] = useState([])
  const [sortName, setSortName] = useState('desc')
  const [sortDate, setSortDate] = useState('desc')
  const [isActiveTab, setIsActiveTab] = useState(0)
  const currentDateState = getCurrentDate()

  const handlePress = (item) => {
    // navigation.navigate('TenderItem', {dataTender: item})
  }
  const sortTenders = (flag, by) => {
    if(flag === 'name') {
      let newArrN = dataReplsAndTenders
      // console.log('newArrN', newArrN)
      let sortByName
      if(by === 'desc') {
        sortByName = newArrN.sort((a, b) => {
          return a.data.name > b.data.name ? 1 : -1
        })
        setSortName('asc')
      }
      if(by === 'asc') {
        sortByName = newArrN.sort((a, b) =>{ return a.data.name < b.data.name ? 1 : -1})
        setSortName('desc')
      }
      console.log(' sortByName', sortByName,)
      // console.log(' newArrN', newArrN)
      setDataReplsAndTenders(sortByName)
      
    }

    if(flag == 'date') {
      let newArrD = dataReplsAndTenders
      let sortByCreatedAt
      if(by == 'desc') {
        sortByCreatedAt = newArrD.sort((a, b) => a.data.startDate.toMillis() > b.data.startDate.toMillis() ? 1 : -1)
        setSortDate('asc')
      }
      if(by == 'asc') {
        sortByCreatedAt = newArrD.sort((a, b) => a.data.startDate.toMillis() < b.data.startDate.toMillis() ? 1 : -1)
        setSortDate('desc')
      }
      // console.log('sortByCreatedAt', sortByCreatedAt)
      setDataReplsAndTenders(sortByCreatedAt)
    }
  }
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

  function parseDate(dateStr) {    
    const [day, month, year] = dateStr.split('.').map((str) => parseInt(str));
    return new Date(year, month - 1, day).getTime(); // Возвращает миллисекунды
  }
  
  function formatDateInRender(date) {
    const d = new Date(date)
    let formattedDate = ("0" + d.getDate()).slice(-2)  + "." + ("0"+(d.getMonth()+1)).slice(-2)  + "." + d.getFullYear()
    return formattedDate;
  }

  function findClosestDate(startPoints, currentDateState) {
    const currentDate =  Date.parse(currentDateState);
    const dates = startPoints.map((point) => parseDate(point.date));
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

  const getTender = async () => {
    // setIsLoading(true)
    if(role==='client') {
      try {

        // const response = await get('tenders', )

        // if (!response.success) {
        //   console.warn('Ошибка запроса:', response.error);
        //   //
        //   alert(response.error);
        //   return;
        // }
        // console.log('response.data', response.data)
        // setDataTender(response.data)
        // setIsLoading(false)


        // // .where('createdAt', '>', timest) для проверки сортировки
        //   await firestore().collection('tenders')
        // .where('userId', '==', uid)
        // .where('createdAt', '>', timest)
        // .get()
        // .then((querySnapshot) => {
          
        //   console.log('querySnapshot \n', querySnapshot.size)
        //   let odjTender = []
        //   querySnapshot.forEach(documentSnapshot => {
        //     // console.log('querySnapshot Tender: ', documentSnapshot.data())
        //     let createdAt = documentSnapshot.data().createdAt.toMillis()
            
        //     if(createdAt > timest) {
        //         let tenderDocument = {
        //           data: documentSnapshot.data(),
        //           id: documentSnapshot.id,
        //         }
        //         odjTender.push(tenderDocument)
              
        //     }
        //   })
        //   // console.log('odjTender:', odjTender)
        //   setDataTender(odjTender)
        //   setIsLoading(false)
        // })
        
      } catch (error) {
        setIsLoading(false)
        console.log('err', error);
      }

    } else {
      alert('111')
      // try {
        // .where('createdAt', '>', timest) для проверки сортировки
      // await firestore().collection('tenders')
      //   .where('driverId', '==', uid)
      //   .where('createdAt', '>', timest)
      //   .get()
      //   .then((querySnapshot) => {
          
      //     console.log('querySnapshot \n', querySnapshot.size)
      //     let odjTender = []
      //     querySnapshot.forEach(documentSnapshot => {
      //       // console.log('querySnapshot Tender: ', documentSnapshot.data())
      //       let createdAt = documentSnapshot.data().createdAt.toMillis()
            
      //       if(createdAt > timest) {
      //           let tenderDocument = {
      //             data: documentSnapshot.data(),
      //             id: documentSnapshot.id,
      //           }
      //           odjTender.push(tenderDocument)
              
      //       }
      //     })
      //     // console.log('odjTender:', odjTender)
      //     setDataTender(odjTender)
      //     setIsLoading(false)
      //   })
        
      // } catch (error) {
      //   setIsLoading(false)
      //   console.log('err', error);
      // }

    }
  }


  useEffect(() => {
    // console.log('dataTender: \n', dataTender.length);
    getTender()
  },[route])

  
  const renderItem = ({ item,index }) => {
    // console.log('renderItem item: ', item.msgCounter)
    let isActiveMyTender = false
    const itemTender = item.data
    if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId !==uid ) {
        //не в работе поля(driverId replyId их нет или они null)
        return 
    } else if( itemTender.driverId !== null && itemTender.replyId !== null && itemTender.driverId ===uid){
      isActiveMyTender = true 
    }
    
    // if((tenderDel !== null && tenderDel !== undefined&& objDataFiltering===null)||
    // (tenderDel !== null && tenderDel !== undefined&& objDataFiltering===null&&objDataFiltering.showHidTender===false)) {              
    //   if (tenderDel.includes(item.id)) return
    // }

    const dateCurr = findClosestDate(itemTender.startPoints,currentDateState)
    const bgWithIndex = index%2
    // console.log('bgWithIndex', bgWithIndex)

    return (
      <TouchableOpacity onPress={()=>alert('в разработке...')} style={[styles.itemContainer, {backgroundColor: isActiveTab!==2 ?(bgWithIndex ===0 ? '#fff': THEME.GREY100):(bgWithIndex ===0 ? '#fff': '#FCF0E0'), marginBottom: index === dataTender.length-1 ? 60:0},
       isActiveMyTender ? {borderColor: THEME.PRIMARY,borderWidth: 1, borderTopWidth: 0} : null
        ]}>
        <View style={[styles.inner, ]}>

            <TouchableOpacity style={[mainstyles.rowalCjcSb, styles.titleItemContainer,]} disabled={true}>
            {/* <TouchableOpacity style={[mainstyles.rowalCjcSb, styles.titleItemContainer,]} onPress={() => handleOpenTenderItem(item)}> */}
              <Text style={[mainstyles.text16M,styles.textColorD]}>{itemTender.name}</Text>
              <View style={[mainstyles.text16M,styles.textColorD]}>
                <Text style={styles.price}>{itemTender.price} руб.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[mainstyles.botLineGr,{}]} disabled={true}>
            {/* <TouchableOpacity style={[mainstyles.botLineGr,{}]} onPress={()=>handleOpenListPoints(itemTender)}> */}
              <AddressPointsView disable={true} type={'start'} data={itemTender.startPoints} length={itemTender.startPoints.length} onPress={()=>{}}/>
              <AddressPointsView disable={true} type={'end'} data={itemTender.endPoints} length={itemTender.endPoints.length} onPress={()=>{}}/>
            </TouchableOpacity>
            <TouchableOpacity style={[mainstyles.rowalCjcSb,{paddingTop: 10}]} disabled={true}>
            {/* <TouchableOpacity style={[mainstyles.rowalCjcSb,{paddingTop: 10}]} onPress={() => handleOpenTenderItem(item)}> */}
              <View style={[styles.buttonDatail, mainstyles.rowalCjcC]} >
                <Text style={styles.btnMPText}>Детали</Text>
                  <Icon name="chevron-small-right" size={26} color={THEME.MAIN_COLOR} />
              </View>

              <Text style={styles.btnMPText}>{dateCurr}</Text>
            </TouchableOpacity>

        </View>     
      </TouchableOpacity>      
    )
  }

  return (
    <View style={[styles.container, {paddingTop: safeInsets.top}]}>
      <HeaderTitleComponent title={'Мои заказы'} titleStyles={[mainstyles.text22SB,{color: THEME.PRIMARY}]} onPress={()=>navigation.goBack()}/>

      <TopTabBarText data={[
          {title: "Актуальные"},
          {title: "Архив"},
        ]} isActive={isActiveTab} onPress={handleOnPressTopTab}/>

      {/* {
        dataReplsAndTenders.length > 0 ? 
            <View style={styles.sortWrapper}>
              <TouchableOpacity style={[rowSBetween, styles.btnSort]} onPress={() => sortTenders('name', sortName)}>
                <Text style={{paddingRight: 10}}>По алфавиту</Text>
                {
                  sortName == 'desc' ? 
                    <Icon name="chevron-small-down" size={26} color="#000"/>
                  :
                    <Icon name="chevron-small-up" size={26} color="#000"/>
                }
              </TouchableOpacity>
              <TouchableOpacity style={[rowSBetween, styles.btnSort]} onPress={() => sortTenders('date', sortDate)}>
                <Text style={{paddingRight: 10}}>По дате</Text>
                {
                  sortDate == 'desc' ? 
                    <Icon name="chevron-small-down" size={26} color="#000"/>
                  :
                    <Icon name="chevron-small-up" size={26} color="#000"/>
                }
              </TouchableOpacity>
            </View>
          :
            null
      } */}
       {
        isActiveTab===0 ?
          <FlatList
            data={dataTender}
            ListEmptyComponent={()=> (
              <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>Нет заявок</Text></View>
            )}
            renderItem={renderItem}
            keyExtractor={item => item.id+'weqwe'}
          />
          :
          <View style={mainstyles.pV15}>
            <Text style={{textAlign: 'center'}}>В разработке</Text>
          </View>
        }

        
      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,{height: height,minHeight: height,},mainstyles.alCjcC]}>
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
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'pink',
    paddingBottom: 0
    // justifyContent: 'center',
    // alignItems: 'center'  
  },
  itemContainer: {
    backgroundColor: '#f5f5f5',
    // backgroundColor: 'lightblue',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  titleItemContainer: {
    // backgroundColor: 'orange',
    paddingBottom: 14
  },
  textColorD: {
    color: THEME.GREY900
  },
});


  // const getRepl = async (elem) => {
  //   // console.log('getRepl elem', elem)
  //   let allRepl = []
  //   // await dataTender.forEach(elem => {
  //     await firestore().collection('replies')
  //     .where('tenderId','==', elem.id)
  //     .where('rejectedAt','==', null)
  //     .where('rejectedByDriverAt','==', null)
  //     .get()
  //     .then(querySnapshot => { 
  //       let repl = {}
  //       // console.log('replies querySnapshot:', querySnapshot.empty, querySnapshot.size)
  //       if(querySnapshot.empty) return
        
  //       if(querySnapshot.size > 0) {
  //         // let querySnCount = querySnapshot.size
  //         repl = {
  //           replCount: querySnapshot.size,
  //           tenderId: elem.id
  //         }
  //         // console.log('repl', repl)
  //         //  repl = {replCount: querySnapshot.size, tenderId: elem.id}
  //         querySnapshot.forEach(documentSnapshot => {
  //           // console.log('documentSnapshot.id:', documentSnapshot.id)
  //           //в ставке проверяем id водителя и заявки
  //           if(blackListArr?.length > 0) {
  //             // console.log('1', )
  //             blackListArr.find(findItem => {
  //               // console.log('2 ', findItem.tenderId === documentSnapshot.data().tenderId)
  //               if(findItem.tenderId === documentSnapshot.data().tenderId&&findItem.userId===documentSnapshot.data().userId) {
  //                 // console.log('repl.replCount', repl.replCount)
  //                 repl.replCount = repl.replCount-1
  //               }
  //               // console.log('blackListUser findItem:', findItem, findItem.tenderId === documentSnapshot.id && findItem.userId === documentSnapshot.data().userId)
  //             })

  //           }
  //         })
  //       }
  //       // console.log('repl:', repl)
  //       allRepl.push(repl)
  //       //!!проверка заявки на отмененную и тд?

  //       // const newArr = dataTender.map(elem => {
  //         //   let fnItem = repl.find(item => elem.id === item.tenderId)
  //         //   fnItem === true ? elem.repl = 
  //         // })
  //         // setIsLoading(false)

  //       })
  //       return {data: elem.data, id: elem.id, repl: allRepl, msgCounter: elem.msgCounter}
  //       // msgCounter: elem.msgCounter
  //       // return {elem: elem, repl: repl}
  //       // return allRepl
  //     // })
  //   // console.log('repl:', repl)
  //   // setDataRepl(repl)
  // }



  // const searchRepl = async() => {
  //   const array = await Promise.all(dataTender.map(elem => getRepl(elem)))
  //   // console.log('array', 'array[2].repl','array')
  //   setDataReplsAndTenders(array)
  //   setIsLoading(false)
  // }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('my tender screen focus eff 1')
  //     getTender()

  //     // return () => getTender()
  //   }, [])
  // );

  // useEffect(() => {
  //   if(dataTender !== null && dataTender.length > 0) {
  //     searchRepl()
  //   }
  //   //  getTender()
  //   //  return () => getTender()
  // },[dataTender])