import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import MapView, { Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice
import { keyAPi } from '../../util/map_keys';
import { onPressZoom } from '../../util/mapZoom';
import { goTocoords, openGM } from '../../util/MapUtil/mapFn';
import { requestLocationFinePermission } from '../../util/permissions';
import { getUserCurrPositions } from '../../util/geolocation';
import { mapStyle } from '../../util/MapUtil/mapStylesConst';

//components
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { MapCustomBtn } from '../Buttons/MapCustomBtn';
import IconCurrLoc from '../Svg/IconCurrLoc';
import IconPinSmallFill from '../Svg/IconPinSmallFill';

//styles
import { THEME, mainstyles } from '../../theme';

export const TenderMapDriver = ({
  mapViewRef,
  customStyles,
  cusStMap,
  topBtnPosition,
  coordinatesArr=[],
  coordinatesFrom=[],
  coordinatesTo=[],
  isRouteVisible,
  currIndex=0,
  arrOfTenderFirstPoints,
  type,

  }) => {
  // console.log('MapAddressPoint coordinatesFrom', coordinatesFrom)
  // console.log('MapAddressPoint coordinatesTo', coordinatesTo)
  // console.log('MapAddressPoint arrOfTenderFirstPoints', arrOfTenderFirstPoints)
    // console.log('currIndex', currIndex)
    console.log('TenderMapDriver', )

  Geocoder.init(keyAPi, {language : "ru"})
  const markerRefs = useRef(Marker)
  const {statusGps,status, showInfoModal: askGps} = useSelector((state) => state.user)

  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currPosition, setCurrPosition] = useState(null)
  const [regionA, setRegion] = useState(null)
  const [mapTypeCurr, setMapTypeCurr] = useState("standard")
  const [isVisibleList, setIsVisibleList] = useState(false)


  const onChangeMapType = (type) => {
    if(type === mapTypeCurr) {
      setIsVisibleList(false)
      return
    }
    setMapTypeCurr(type)
    setIsVisibleList(false)
  }

  const onRegionChange = (region) => {
    // setCurrPosition(region)
    // console.log('onRegionChange', region);
    setRegion(region)
  }

  const curLoc = async (flag) => {
    // setIsLoadingLocation(true)
    setTimeout(async()=>{
      
      // console.log('curLoc status', status)
      if(((status == 'granted'|| status == 'limited') && currPosition == null)||flag==='go') {
        await getUserCurrPositions().then((res)=> {
          console.log('res position', res)
          const coordResult = {
            latitude: res.latitude,
            longitude: res.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.04,
          }
          // dispatch(onSaveCurrPosition(`${res.latitude},
          //   ${res.longitude}`))
          setCurrPosition(coordResult)
          // setRegion(coordResult)
          goTocoords(mapViewRef, coordinatesArr)
          // console.log('MM coordResult', coordResult);
          console.log('MM coordinatesArr', coordinatesArr);
          if(coordinatesArr?.length > 0) {
            setRegion({
              latitude: coordinatesArr[0].latitude,
              longitude: coordinatesArr[0].longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            })
            // mapViewRef.current?.animateToRegion({
            //   latitude: coordinatesArr[0].latitude,
            //   longitude: coordinatesArr[0].longitude,
            //   latitudeDelta: 0.05,
            //   longitudeDelta: 0.04,
            // }, 500)
          } else {
            setRegion({
              latitude: coordResult.latitude,
              longitude: coordResult.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            })
            mapViewRef.current?.animateToRegion({
              latitude: coordResult.latitude,
              longitude: coordResult.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.04,
            }, 500)
          }
          setIsLoadingLocation(false)
        }).catch(()=>{
          setIsLoadingLocation(false)
        })
      }
    },5000)
  }

  const goToCurrCoord = async () => {
    if((status == 'granted'|| status == 'limited')) {
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
        // setCurrPosition({latitude: 46.4125952,
        //   longitude: 30.7265536,})
        // 46.4274, 30.7461
        setCurrPosition(coordResult)
        setRegion(coordResult)
        mapViewRef.current?.animateToRegion({
          latitude: res.latitude,
          longitude: res.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.04,
        }, 500)
       })
       // console.log('position', position);
     }
  }

  // useEffect(()=> {    
  //   const locPermissons = async () => {
  //     // console.log('start locperm');
  //     const checkPremisson = Platform.OS ==='android' ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
  //       // console.log('ACCESS_FINE_LOCATION result: ', result);
  //       setPermissionRes(result)
  //     }) : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
  //       // console.log('ACCESS_FINE_LOCATION result: ', result);
  //       if(result != 'granted') {
  //         request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result)=> {
  //           setPermissionRes(result)
  //        })
  //      } else {
  //       setPermissionRes(result)
  //      }
  //     })
      
  //     if(checkPremisson !== 'granted') {
  //       requestLocationFinePermission()
  //     }
  //   }
  //   locPermissons()
  //   // return () => { 
  //   //   locPermissons()
  //   //   requestLocationFinePermission()
  //   // }
  // },[permissionRes])
  

  useEffect(() => {
    // console.log('permissionRes', permissionRes);
    // console.log('currPosition', currPosition);
    
    curLoc()
  }, [status,coordinatesArr])

  return (
    <View style={[styles.companyMap,Platform.OS === 'ios' ? {zIndex: 0}: null, customStyles]}>
      
      <MapView
        mapPadding={{top: 30,
        bottom: 10}}
        ref={mapViewRef}
        initialRegion={regionA}
        mapType={mapTypeCurr}
        showsUserLocation={true}
        style={[styles.map,cusStMap]}
        // customMapStyle={mapStyle}
        showsMyLocationButton={false}
        // onRegionChangeComplete={onChangeRegionCoords}
        onRegionChangeComplete={onRegionChange}
        googleRenderer="LEGACY"
      >
        {
        coordinatesFrom&&coordinatesFrom.map((coordinate, index) =>
        <Marker 
          style={{backgroundColor: 'transparent',justifyContent: 'center', alignItems: 'center',}}
          key={`coordinateStart_${index}`}
          coordinate={coordinate}
          // pinColor='tomato'
        >
          {
            currIndex===index?
            <View style={{position: 'relative',backgroundColor: 'transparent',}}>
              <View style={[styles.markerBg,mainstyles.shadowG5r5]}>
                <IconPinSmallOt color={'#fff'} />
              </View>
            </View>
            :
            <IconPinSmallOt />
          }
        </Marker>
        )
      }
        {
        arrOfTenderFirstPoints&&arrOfTenderFirstPoints.map((coordinate, index) =>
        <Marker 
          style={{backgroundColor: 'transparent',justifyContent: 'center', alignItems: 'center',}}
          // key={`coordinateStart_${index}`}
          // coordinate={coordinate.coords}
          // pinColor='tomato'
            ref={markerRefs[index]}
            key={index}
            identifier={`1_${index}`}
            coordinate={coordinate.coords}
            // onPress={() => openCallout(coordinate, index)}
            onPress={() => {console.log('Marker item ', coordinate),markerRefs[index]?.current.showCallout()}}
            // onCalloutPress={() => closeCallout(index)}
            onCalloutPress={() => {markerRefs[index]?.current.hideCallout()}}
           >
          <View style={{position: 'relative',backgroundColor: 'transparent',}}>
            <View style={[styles.markerBg,mainstyles.shadowG5r5,{backgroundColor: 'red'}]}>
              <IconPinSmallOt color={'#fff'} />
            </View>
          </View>
          <Callout 
              tooltip={false}
              style={{ width: 250}}
              key={`callout_1`}
              // onPress={() => console.log('text', key)}
            >
              <View style={{}}>
                <Text style={[mainstyles.text14SB,{color:THEME.PRIMARY}]}> Заявка: {coordinate.nameTender}</Text>
              </View>
          </Callout>
        </Marker>
        )
      }
      {
        coordinatesTo&&coordinatesTo.map((coordinate, index) =>
        {
          return (

        <Marker 
          key={`coordinateEnd_${index}`}
          coordinate={coordinate}
        >
          {
            currIndex-coordinatesFrom.length===index?
            <View style={{width: 25, height: 25, borderRadius: 40, backgroundColor: THEME.PRIMARY, justifyContent: 'center',alignItems: 'center', paddingHorizontal: 5}}>
              <IconPinSmallOt color={'#fff'} />
            </View>
            :
            <IconPinSmallFill />
          }
        </Marker>
          )
        }
        )
      }
      {(coordinatesArr.length >= 2) && (
        <MapViewDirections
          origin={coordinatesArr[0]}
          waypoints={ (coordinatesArr.length > 2) ? coordinatesArr.slice(1, -1): undefined}
          destination={coordinatesArr[coordinatesArr.length-1]}
          apikey={keyAPi}
          onReady={result => {
            // onCreateRouteInfo(result)
            // console.log(`Distance: ${result.distance} km`)
            // console.log(`Duration: ${result.duration} min.`)
          }}
          onError={(e)=>{console.log('MapViewDirections error in TenderMapDriver', e)}}
          strokeWidth={3}
          strokeColor={THEME.PRIMARY}
        />
      )}
      </MapView>
      {
        currPosition === null && isLoadingLocation ?

        <View style={[{position: 'absolute',left: 100, bottom: 20 ,zIndex:999,},mainstyles.rowalCjcC]}>
          <ActivityIndicator color={THEME.BLUE} />
          <Text style={[mainstyles.text12R]}>Определение локации</Text>
        </View> 
         : null
      }
      <View style={{position: 'absolute',left: 15, top: type==='main'?150:(topBtnPosition?topBtnPosition: 60), zIndex: 999}}>
        <MapCustomBtn onPress={()=>openGM(coordinatesArr,()=>{})}>
          <Image source={require('../../../assets/image/icon012.png')} style={{width: 24, height: 25}}/>
        </MapCustomBtn>
        <MapCustomBtn onPress={() => setIsVisibleList(prev => !prev)}>
          <Image source={require('../../../assets/image/icon011.png')} style={{width: 24, height: 24}}/>
        </MapCustomBtn>
        {
          isRouteVisible&&
          <MapCustomBtn onPress={()=>goTocoords(mapViewRef, coordinatesArr)}>
            <Image source={require('../../../assets/image/icon010.png')} style={{width: 24, height: 24}}/>
          </MapCustomBtn>
        }
      </View>

      <View style={{position: 'absolute',right: 15, top: type==='main'?150:(topBtnPosition?topBtnPosition: 60), zIndex: 999}}>
        <MapCustomBtn onPress={()=>goToCurrCoord()}>
          <IconCurrLoc />
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion, null, mapViewRef, 'plus' )}>
          <Icon name="plus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion, null, mapViewRef, )}>
          <Icon name="minus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>

      </View>
      {
        isVisibleList ?
            <View style={[styles.list,{top: type==='main'?150:(topBtnPosition? topBtnPosition +40 : 60)}]}>
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
    </View>
    
  )
}

const styles = StyleSheet.create({
  //map
  companyMap: {
    // backgroundColor: '#F8D26A', // светло оранж
    // flex: 1,
    position: 'relative',
    height: Dimensions.get('screen').height,
    // backgroundColor: 'red',
    zIndex: 1
  },
  map: {
    // flex: 1,
    width: '100%',
    minHeight: Dimensions.get('screen').height,
    zIndex: 1
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
    bottom: 25,
    left: 5,
  },
  list: {
    position: 'absolute',
    width: '40%',
    // height: '100%',
    // bottom: 126,
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
  },
  markerBg: {
    width: 25,
    height: 25,
    alignSelf:'center',
    borderRadius: 15,
    backgroundColor: THEME.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  }
});