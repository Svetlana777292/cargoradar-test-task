import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput, ActivityIndicator, Platform, Keyboard } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
import {requestNotifications, check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import MapView  from 'react-native-maps';
import Icon from '@react-native-vector-icons/entypo';
import { useSafeAreaInsets } from "react-native-safe-area-context";

//functions && features && slice
import { keyAPi } from '../../util/map_keys';
import { onPressZoom } from '../../util/mapZoom';
import { requestLocationFinePermission } from '../../util/permissions';
import { getCurPositionAdressAndCoordsForse, getUserCurrPositions } from '../../util/geolocation';
import { onSaveCurrPosition, onSaveCurrPositionWithAddress, setSatatusGeolocation, setShowInfoModal, setShowStatusGps } from '../../store/features/userSlice';

//components
import { SearchBarAddress } from '../SearchBar/SearchBarAddress';
import { HeaderTitleComponent } from '../Headers/HeaderTitleComponent';
import IconCurrLoc from '../Svg/IconCurrLoc';
import { MapCustomBtn } from '../Buttons/MapCustomBtn';
import MarkerCustom from '../MarkerCustom';
import { DefaultBtn } from '../Buttons/DefaultBtn';

//styles
import { SIZE, THEME, mainstyles } from '../../theme';
import GooglePlacesInput from '../SearchBar/GooglePlacesInput';

export const MapAddAddress = ({
  addressFromMap,
  title,
  setAddressFromMap,
  onClose,
  type
  }) => {
  // console.log('MapAddAddress addressFromMap:', addressFromMap)
  Geocoder.init(keyAPi, {language : "ru"})
  
  // const currentPosition = useSelector((state) => state.user.currentPosition)
  // console.log('currentPosition', currentPosition)
  const dispatch = useDispatch();
  // const askGps = useSelector((state) => state.user.showInfoModal)
  const {statusGps,status, showInfoModal: askGps} = useSelector((state) => state.user)
  const safeInsets = useSafeAreaInsets();
  const mapViewRef = React.useRef(MapView)
  const marker = React.useRef(null)
  const [mapTypeCurr, setMapTypeCurr] = useState("standard")
  const [isVisibleList, setIsVisibleList] = useState(false)
  const [region, setRegion] = useState()
  const [permissionRes, setPermissionRes] = useState()
  const [currPosition, setCurrPosition] = useState(null)
  const [addressObj, setAddressObj] = useState(null)
  const [isBlurAddress, setIsBlurAddress] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)


  const curLoc = async () => {
    // console.log('curLoc addressFromMap: ',currPosition, addressFromMap,status)
    // if(permissionRes !== 'granted' && currPosition !== null) return
    if((status === 'granted' || status==='limited' )&& currPosition == null) {
      try {
        await getUserCurrPositions().then((res)=> {
          // console.log('MapAddAddress res position', res)
          const coordResult = {
            latitude: res.latitude,
            longitude: res.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.04,
          }
          // console.log('coordResult', coordResult)

          setCurrPosition(coordResult)
          if(addressFromMap === null) {
            //нет адреса- находить через геокодер координаты и текст
            // onRegionChange(coordResult)

            setRegion(coordResult)
            try {
              Geocoder.from(coordResult.latitude, coordResult.longitude).then(json => {
                const addressComponent = json.results[0].formatted_address
                // const addressComponent = json.results[0].address_components[0];
                // console.log('-------json.results[0]: ', json.results[0]);
                console.log('curLoc addressComponent:', addressComponent);
                // setAddressFromMap({
                //   address: addressComponent,
                //   latitude: coordResult.latitude,
                //   longitude: coordResult.longitude,
                // })
                setAddressObj({
                  address: addressComponent,
                  latitude: coordResult.latitude,
                  longitude: coordResult.longitude,
                })
          
              }).catch(error => {
                console.log('280 Geocoder error:', error)
              });
              
            } catch (error) {
              console.log('MapAddAddress curLoc Geocoder error:', error)
            }
            
          } else {
            // console.log('else addressFromMap', addressFromMap)
            setCurrPosition(coordResult)
            setRegion({
              latitude: addressFromMap.latitude,
              longitude: addressFromMap.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            })
            setAddressObj(addressFromMap)

            mapViewRef.current?.animateToRegion({
              latitude: addressFromMap.latitude,
              longitude: addressFromMap.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            }, 500)

          }

        })
        
      } catch (error) {
        console.log('curLoc err', error)
        getCurPositionAdressAndCoordsForse(dispatch, onSaveCurrPositionWithAddress,setSatatusGeolocation, setShowInfoModal,setShowStatusGps)
      }
      // console.log('position', position);
    } else {
      // await getUserCurrPositions()
    }
  }

  // const locPermissons = async () => {
  //   console.log('start locperm');
  //   try {
      
  //     let res = ''
  //     const checkPremisson = Platform.OS ==='android' ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
  //       // console.log('ACCESS_FINE_LOCATION result: ', result);
  //       res = result
  //       setPermissionRes(result)
  //     }) : await check().then((result) => {
  //       // console.log('ACCESS_FINE_LOCATION result: ', result);
  //       if(result != 'granted') {
  //         request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result)=> {
   
  //           res = result
  //           setPermissionRes(result)
  //        })
  //      } else {
   
  //       res = result
  //       setPermissionRes(result)
  //      }
  //     }) 
  //     //checkPremisson возвращает undefined ?
  //     // console.log('locperm checkPremisson', checkPremisson,res);
      
  //     if(res !== 'granted') {
  //       let resultRequ = await requestLocationFinePermission()
  //       console.log('1 checkPremisson', checkPremisson,res,resultRequ)
  //       curLoc()
  //     }
  //   } catch (error) {
  //       console.log('locPermissons', error)
  //   }
  // }

  const onChangeMapType = (type) => {
    if(type === mapTypeCurr) return
    setMapTypeCurr(type)
    setIsVisibleList(false)
  }

  const onRegionChange = (region,details) => {
    console.log('onRegionChange',region,details); 
    // setCurrPosition(region)
    // console.log('onRegionChange', region);
    // Keyboard.dismiss()
    if(details?.isGesture === true || Platform.OS === 'ios') {
      try {
        Geocoder.from(region.latitude, region.longitude).then(json => {
          const addressComponent = json.results[0].formatted_address
          // const addressComponent = json.results[0].address_components[0];
          // console.log('-------json.results[0]: ', json.results[0]);
          console.log('onRegionChange addressComponent:', addressComponent);
          // setAddressFromMap({
          //   address: addressComponent,
          //   latitude: region.latitude,
          //   longitude: region.longitude,
          // })
          
          setAddressObj({
            address: addressComponent,
            latitude: region.latitude,
            longitude: region.longitude,
          })
    
        }).catch(error => {
            console.warn(error)
        });
        
      } catch (error) {
        console.log('MapAddAddress onRegionChange Geocoder error:', error)
      }

    }

    setRegion(region)

  }
// console.log('permissionRes', permissionRes)
  const goToCurrCoord = async () => {
    if((permissionRes == 'granted')) {
      await getUserCurrPositions().then((res)=> {
        //  console.log('res position', res)
        const coordResult = {
        //  latitude: 46.4125952,
        //  longitude: 30.7265536,
          latitude: res.latitude,
          longitude: res.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.04,
        }
        dispatch(onSaveCurrPosition(`${res.latitude},
        ${res.longitude}`))
        // setCurrPosition(coordResult)
        // setRegion(coordResult)
        // mapViewRef.current?.animateToRegion({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   latitudeDelta: 0.05,
        //   longitudeDelta: 0.04,
        // }, 500)
        Geocoder.from(coordResult.latitude, coordResult.longitude).then(json => {
          const addressComponent = json.results[0].formatted_address
          // const addressComponent = json.results[0].address_components[0];
          // console.log('-------json.results[0]: ', json.results[0]);
          console.log('curLoc addressComponent:', addressComponent);
          // setAddressFromMap({
          //   address: addressComponent,
          //   latitude: coordResult.latitude,
          //   longitude: coordResult.longitude,
          // })
          setAddressObj({
            address: addressComponent,
            latitude: coordResult.latitude,
            longitude: coordResult.longitude,
          })
          mapViewRef.current?.animateToRegion({
            latitude: res.latitude,
            longitude: res.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.04,
          }, 500)
    
        }).catch(error => {
          console.log('163 Geocoder error:', error)
        });
       })
       // console.log('position', position);
     } 
  }

  const handlePositionOnMarker = (obj) =>{
    console.log('handlePositionOnMarker obj', obj)
    setAddressObj(obj)

    mapViewRef.current?.animateToRegion({
      latitude: obj.latitude,
      longitude: obj.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.04,
    }, 500)
  } 

  const handleSaveAddress = (obj) =>{
    console.log('handleSaveAddress obj', obj)
    setAddressFromMap(obj)
    onClose()
    
  } 
  const onBlurAddress = () => {
    console.log('onBlurAddress Tap', )
    setIsBlurAddress(true)
  }
  
  // useEffect(()=> {
  //   console.log('Map new coord after change region  useEffect', 'addressObj:',addressObj)
  // },[region, addressObj,])

  // useEffect(()=> {
  //   // console.log('MapAddressPoint coordinatesArr useEffect', coordinatesArr)
  // },[isVisibleList, mapTypeCurr])

  //переделать запрос на геопозицию
  // useEffect(()=> {    

  //   if(permissionRes != 'granted') {
  //     console.log('!!!!!!', permissionRes)
  //     locPermissons()
  //   }
  //   // return () => { 
  //   //   locPermissons()
  //   //   requestLocationFinePermission()
  //   //   // getUserCurrPositions()
  //   //   // checkLocationPermission()
  //   // }
  // },[permissionRes])
  
  useEffect(() => {
    // console.log('permissionRes', permissionRes);
    // console.log('currPosition', currPosition);

    curLoc()
  }, [status])


  if (region == null) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#fff'}}>
      {
        statusGps != '' ?
        <Text style={[mainstyles.text14R,mainstyles.pV15,{textAlign: 'center'}]}>GPS не включен, чтобы использовать все функции приложения, включите GPS в настройках телефона</Text>
        : null
      }
      <ActivityIndicator size={'large'}
        color={THEME.PRIMARY}
      />
    </View>


  return (
    <View style={[styles.companyMap,]} > 
      <View style={{position: 'relative',
      paddingTop: Platform.OS ==='android'? (type==='filter' ? safeInsets?.top : 0) : safeInsets?.top,
      backgroundColor: '#fff',}}> 
        <HeaderTitleComponent title={title} onPress={onClose}/>
      </View>
      <View style={{position: 'absolute',
      top: Platform.OS ==='android'? (type==='filter' ? safeInsets?.top+40 : 40) : safeInsets?.top+40,
      backgroundColor: '#fff',width: '100%',zIndex: 999}} >
        <SearchBarAddress setAddressObj={handlePositionOnMarker} address={addressObj} blurInput={isBlurAddress} setBlurInput={setIsBlurAddress}/>
      {/* <GooglePlacesInput /> */}
      </View>
      {
        !keyboardVisible ?
        <View style={[{
          position: 'absolute',
          left: Dimensions.get('window').width/2-22,
          top: Dimensions.get('window').height/2,
          width:1,
          height: 1,
          zIndex: 990,
          // backgroundColor: 'rgba(0,0,0,0.5)'
        },]}>
          <MarkerCustom />
        </View>
        : <></>

      }

      <MapView
        mapPadding={{}}
        ref={mapViewRef}
        initialRegion={region}
        mapType={mapTypeCurr}
        // showsUserLocation={true}
        style={styles.map}
        onPress={onBlurAddress}
        onRegionChangeComplete={(region,details)=>onRegionChange(region,details)}
        // onRegionChangeComplete={onChangeRegionCoords}
      >

      </MapView>
      <View style={{position: 'absolute',left: 15, top: Platform.OS==='android' ? 160 : 180, zIndex: 990}}>
        <MapCustomBtn onPress={() => setIsVisibleList(prev => !prev)}>
          <Image source={require('../../../assets/image/icon011.png')} style={{width: 24, height: 24}}/>
        </MapCustomBtn>
      </View>

      <View style={{position: 'absolute',right: 15, top: Platform.OS==='android' ? 160 : 180, zIndex: 990}}>
        <MapCustomBtn onPress={()=>goToCurrCoord()}>
          <IconCurrLoc />
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(region, setRegion,null, mapViewRef, 'plus' )}>
          <Icon name="plus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(region, setRegion,null, mapViewRef, )}>
          <Icon name="minus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
      </View>
      {
        isVisibleList ?
          <View style={[styles.list,{top: Platform.OS==='android' ? 160 : 180,}]}>
            <TouchableOpacity onPress={() => onChangeMapType("standard")} style={[styles.listItem, mapTypeCurr == "standard" ? {backgroundColor: '#F3F3F3'}: null]}>
              <Text style={styles.textList}>Стандартный</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeMapType("satellite")} style={[styles.listItem, mapTypeCurr == "satellite" ? {backgroundColor: '#F3F3F3'}: null]}>
              <Text style={styles.textList}>Спутник</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeMapType("hybrid")} style={[styles.listItem,  mapTypeCurr == "hybrid" ? {backgroundColor: '#F3F3F3'}: null]}>
              <Text style={styles.textList}>Гибридный</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeMapType("terrain")} style={[styles.listItem,  mapTypeCurr == "terrain" ? {backgroundColor: '#F3F3F3'}: null, {borderBottomWidth: 0}]}>
              <Text style={styles.textList}>Pельеф</Text>
            </TouchableOpacity>
          </View>
        :
          null
      }
      <View style={{position: 'absolute', bottom: type==='filter' ? (Platform.OS==='android' ? 45+safeInsets?.bottom : 120+safeInsets?.bottom) : (Platform.OS==='android' ? safeInsets?.bottom+20: safeInsets?.bottom), alignItems: 'center', width: '100%',zIndex: 980}}>
        <DefaultBtn title='Сохранить' onPress={()=>handleSaveAddress(addressObj)} customStyle={{width: 136,minWidth: null}}/>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  //map
  companyMap: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    // backgroundColor: '#F8D26A', // светло оранж
    zIndex: 1,
    // height: Dim
  },
  map: {
    flex: 1,
    width: '100%',
    // minHeight: Dimensions.get('screen').height/3,
    zIndex: 1
  },
  wrapCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 8,
    zIndex: 90,

  },
  closeBtn: {
  },
  btn: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 4,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    zIndex: 50
  },
  btn1: {
    top: 220,
    right: 8,
  },
  btn2: {
    bottom: 80,
    left: 5,
  },
  list: {
    position: 'absolute',
    width: '40%',
    // height: '100%',
    
    left: 50,
    zIndex: 999,
    backgroundColor: '#fff',
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CACACA',
    justifyContent: 'center',
    // paddingVertical: 15,
    elevation: 3,
  },
  listItem: {
    borderBottomColor: '#DBDBDB',
    borderBottomWidth:1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // borderRadius: 10,
  },
  textList: {
    color: '#7A7A7A'
  }
});