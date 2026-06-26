// import React, { useEffect, useState,useRef, createRef } from 'react';
// import { Text, View, StyleSheet, Animated, Dimensions, TouchableOpacity, Image, TextInput, ActivityIndicator, StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native';

// //packages
// import { useSelector, useDispatch } from 'react-redux';
// // import ImagePicker from 'react-native-image-crop-picker';
// // import { useSafeAreaInsets } from "react-native-safe-area-context";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { DefaultBtn } from '../../components/Buttons/DefaultBtn';
// import { logoutUser } from '../../store/features/loginSlice';
// import { removeToken } from '../asyncstor';
// import MapView from 'react-native-maps';
// import { formatToUts } from '../dateFormats';
// import { checkActualDateOfTender, findEarliestDate, isWithin24Hours, validateDatesAfterGiven } from '../tools';
// import { closesDatetest } from '../SearchScreen/helpersdriversearch';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import { testarrexmpl } from './tenderstestexm';
// import { sortByPrice } from '../sortHelpers';

// dayjs.extend(utc);


// export const TestScreen = ({route, navigation}) => {
//   // const videoRef = useRef(null);
//   // // console.log('TransportScreen', route.params.transportInfo.data);
//   // // console.log('TransportScreen', route.params);
//   const dispatch = useDispatch()
//   const [result,setResult]=useState()
//   // const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
//   const {userProfileInfo, role, userPhone} = useSelector((state) => state.login)
//   // console.log('userProfileInfo', userProfileInfo)
//   // const safeInsets = useSafeAreaInsets();
//   let arr1 = [
//     { "date": "26.04.2025", "dateMls": "2025-04-26 00:00:00", "dateRange": null, "rangeDateMls": null, "typeDate": "single"},
//     { "date": "26.04.2025", "dateMls": null, "dateRange": null, "rangeDateMls": ["2025-04-24 00:00:00","2025-04-26 00:00:00"], "typeDate": "range"},
//     { "date": "26.04.2025", "dateMls": null, "dateRange": null,  "rangeDateMls": ["2025-04-25 00:00:00","2025-04-26 00:00:00"], "typeDate": "range"}
//   ]
//   let arr2 = [
//     { "date": "26.04.2025", "dateMls": "2025-04-30 00:00:00", "dateRange": null, "rangeDateMls": null, "typeDate": "single"},
//     { "date": "26.04.2025", "dateMls": null, "dateRange": null, "rangeDateMls": ["2025-04-30 00:00:00","2025-04-30 00:00:00"], "typeDate": "range"},
//     { "date": "26.04.2025", "dateMls": null, "dateRange": null,  "rangeDateMls": ["2025-04-30 00:00:00","2025-04-30 00:00:00"], "typeDate": "range"}
//   ]

//   const fntest =()=> {

//       const res = validateDatesAfterGiven(arr2,'2025-04-30')
//       // const res = checkActualDateOfTender(arr2)
//       // const res = findEarliestDate(arr)
//       console.log('res', res)
//       // setResult(res)
//   }
//   const fntest1 =()=> {

//     // let qwe = "2025-05-02 11:57:52"
//     //   const res = isWithin24Hours(qwe)
//     //   console.log('res', res)
//     //   // setResult(res)


//     // Текущая дата в формате dayjs UTC
//     // const dateToMls = dayjs.utc();
//     const dateToMls = dayjs.utc("2025-05-02 12:00:00", 'YYYY-MM-DD HH:mm:ss');

//     // closesDatetest

//     testarrexmpl.sort((a, b) => {
//       const dateA = closesDatetest(a.startPoints[0], dateToMls);
//       const dateB = closesDatetest(b.startPoints[0], dateToMls);
//       // console.log('dateA', dateA)
//       // console.log('dateB', dateB)

//       // console.log('-1', dateA.isBefore(dateB))
//       // console.log('1', dateA.isAfter(dateB))
//       if (dateA.isBefore(dateB)) return -1;
//       if (dateA.isAfter(dateB)) return 1;
    
//       // Если даты совпадают — сортировка по имени
//       const nameA = a.name.toLowerCase();
//       const nameB = b.name.toLowerCase();
    
//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;
    
//       return 0;
//     });
//     setResult(testarrexmpl)
//     // console.log('testarrexmpl', testarrexmpl)
//   }

//   const fntest2 = () => {

//   // Исходные данные
//     const collection = [
//       {
//         id: 1,
//         name: "bbb",
//         price: 200,
//         startPoints: [
//           {
//             typeDate: "range",
//             dateMls: null,
//             rangeDateMls: ["2025-05-05 00:00:00","2025-05-05 00:00:00"],
//           },
//           {
//             typeDate: "single",
//             dateMls: "2025-05-05 00:00:00",
//             rangeDateMls: null,
//           }
//         ],
//       },
//       {
//         id: 2,
//         name: "ddd",
//         price: 10,
//         startPoints: [
//           {
//             typeDate: "single",
//             dateMls: "2025-05-03 00:00:00",
//             rangeDateMls: null,
//           },
//           {
//             typeDate: "single",
//             dateMls: "2025-05-03 00:00:00",
//             rangeDateMls: null,
//           },
//         ],
//       },
//       {
//         id: 3,
//         name: "aaa",
//         price: 111,
//         startPoints: [
//           {
//             typeDate: "single",
//             dateMls: "2025-05-04 00:00:00",
//             rangeDateMls: null,
//           },
//           {
//             typeDate: "single",
//             dateMls: "2025-05-0 00:00:00",
//             rangeDateMls: null,
//           },
//         ],
//       }
//     ];

//     // Задаём "сегодняшнюю" дату
//     // const dateToMls = dayjs.utc("2025-05-02 12:00:00", 'YYYY-MM-DD HH:mm:ss');
//     const dateToMls = dayjs.utc();

//     function closesDate(point, currDate) {
//       if (point.typeDate === 'single') {
//         return dayjs.utc(point.dateMls, 'YYYY-MM-DD HH:mm:ss');
//       } else if (point.typeDate === 'range' && Array.isArray(point.rangeDateMls)) {
//         const start = dayjs.utc(point.rangeDateMls[0], 'YYYY-MM-DD HH:mm:ss');
//         const end = dayjs.utc(point.rangeDateMls[1], 'YYYY-MM-DD HH:mm:ss');
//         if (currDate.isAfter(start) && currDate.isBefore(end)) {
//           return currDate;
//         } else {
//           const diffToStart = Math.abs(currDate.diff(start));
//           const diffToEnd = Math.abs(currDate.diff(end));
//           console.log('diffToStart', diffToStart)
//           console.log('diffToEnd', diffToEnd)
//           return diffToStart <= diffToEnd ? start : end;
//         }
//       }
//       return currDate;
//     }

//     collection.sort((a, b) => {
//       const dateA = closesDate(a.startPoints[0], dateToMls).valueOf();
//       const dateB = closesDate(b.startPoints[0], dateToMls).valueOf();
//       // console.log('dateA', dateA)
//       // console.log('dateB', dateB)

//       if (dateA < dateB) return -1;
//       if (dateA > dateB) return 1;

//       const nameA = a.name.toLowerCase();
//       const nameB = b.name.toLowerCase();

//       if (nameA < nameB) return -1;
//       if (nameA > nameB) return 1;

//       return 0;
//     });

//     console.log(collection);
//   }

//   const fntest3 =  ()  => {
//     arrq = 
//     sortByPrice(arr1)
//   }

//   useEffect(()=>{
//     // getData()
//   },[])
  
//   return (
//     <View style={[styles.container1,]}>
//      {/* <MapView
//       //  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//        style={styles.map}
//        region={{
//          latitude: 37.78825,
//          longitude: -122.4324,
//          latitudeDelta: 0.015,
//          longitudeDelta: 0.0121,
//        }}
//      >
//      </MapView> */}

//     <ScrollView>

//       {result&&result?.length>0 ?
//         result.map(elem => {
//           return (
//             <View key={elem.id}>

//               <Text style={{color: 'blue'}}>id: {elem.id}</Text>
//               <Text style={{color: 'blue'}}>name: {elem.name}</Text>
//               <Text style={{color: 'blue'}}>price: {elem.price}</Text>
//               <Text style={{color: 'blue'}}>date: {JSON.stringify(elem.startPoints[0],null,2)}</Text>
//             </View>
//           )
//         })
//         : 
//         <Text style={{color: 'red'}}>qwe</Text>
//       }
//     </ScrollView>
//     <DefaultBtn onPress={fntest2}
//       title="qwe" />
//     </View>
//   )
//   return (
//     <View>
//       <Text style={{color: 'red'}}>{JSON.stringify(userProfileInfo)}</Text>
//       <Text style={{color: 'blue'}}>{JSON.stringify(role)}</Text>
//       <Text style={{color: 'green'}}>{JSON.stringify(userPhone)}</Text>
//       <DefaultBtn onPress={logout}
//         title="title" />

      
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container1: {
//     flex: 1,
//     padding: 10,
//   }, 
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     // height: 400,
//     // width: 400,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//  });

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     // flexDirection: 'column',
// //     // justifyContent: 'space-between',
// //     // backgroundColor: 'orange',
// //   },
// //   backgroundVideo: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     bottom: 0,
// //     right: 0,
// //   },
// //   wrapper: {
// //     // flex:1
// //     // backgroundColor: 'orange',
// //     // paddingHorizontal: 10,
// //   },
// // });