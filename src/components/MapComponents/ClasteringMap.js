import React, { useEffect, useState,useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';

//packages
import { useDispatch } from 'react-redux';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import { Marker, Callout } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice
import { keyAPi } from '../../util/map_keys';
import { onPressZoom } from '../../util/mapZoom';
import { goTocoords } from '../../util/MapUtil/mapFn';
import { requestLocationFinePermission } from '../../util/permissions';
import { getUserCurrPositions } from '../../util/geolocation';
import { onSaveCurrPosition } from '../../store/features/userSlice';

//components
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { MapCustomBtn } from '../Buttons/MapCustomBtn';
import IconCurrLoc from '../Svg/IconCurrLoc';

//styles
import { THEME, mainstyles } from '../../theme';
import { mapStyle } from '../../util/MapUtil/mapStylesConst';

export const ClasteringMap = ({  
  coordinatesArr=[],
  regionState,
  setRegionState,
  topPosition,
  onPressCallout,
  isRouteVisible,
  customStyles,
  isFiltered,
  cusStMap,
  currAddressPosition,
  setCurrAddressPosition,
  type,
  }) => {
    // console.log('height', height)
    Geocoder.init(keyAPi, {language : "ru"})
    const mapViewRef = useRef()
    const markerRefs = useRef(Marker)
    const dispatch = useDispatch()
    const [permissionRes, setPermissionRes] = useState()
    const [currPosition, setCurrPosition] = useState(null)
    const [regionA, setRegion] = useState(null)
    const [mapTypeCurr, setMapTypeCurr] = useState("standard")
    const [isVisibleList, setIsVisibleList] = useState(false)
    const [filteringStateObj, setfilteringStateObj] = useState([])
    // console.log('ClasteringMap coordinatesArr', regionA)

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
    setRegionState(region)
  }
  const curLoc = async () => {

    if(permissionRes == 'granted' && currPosition == null) {
     await getUserCurrPositions().then((res)=> {
      //  console.log('res position', res)
       const coordResult = {
        latitude: res.latitude,
        longitude: res.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.04,
      }
      dispatch(onSaveCurrPosition(`${res.latitude},
        ${res.longitude}`))
      setCurrPosition(coordResult)
      setRegion(coordResult)
      setRegionState(coordResult)
      // console.log('MM coordResult', coordResult);
       
      }).catch((error) =>{
        console.log('MapAddAddress curLoc Geocoder error:', error)
      })
    }
  }
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
        // setCurrPosition({latitude: 46.4125952,
        //   longitude: 30.7265536,})
        // 46.4274, 30.7461
        setCurrPosition(coordResult)
        setRegion(coordResult)
        setRegionState(coordResult)

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

  useEffect(()=> {
    if(currPosition!==null&&currPosition!==undefined) {
      setCurrPosition(currPosition)
    }
  },[currPosition])

  useEffect(()=> {    
    const locPermissons = async () => {
      // console.log('start locperm');
      const checkPremisson = Platform.OS ==='android' ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        // console.log('ACCESS_FINE_LOCATION result: ', result);
        setPermissionRes(result)
      }) : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        // console.log('ACCESS_FINE_LOCATION result: ', result);
        if(result != 'granted') {
          request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result)=> {
            setPermissionRes(result)
         })
       } else {
        setPermissionRes(result)
       }
      })
      
      if(checkPremisson !== 'granted') {
        requestLocationFinePermission()
      }
    }
    locPermissons()
    // return () => { 
    //   locPermissons()
    //   requestLocationFinePermission()
    // }
  },[permissionRes])
  

  useEffect(() => {
    // console.log('permissionRes', permissionRes);
    // console.log('currPosition', currPosition);
    curLoc()
    // return () => curLoc()
  }, [permissionRes])

  if(regionA===null) {
    return (
      <View  style={[styles.map,mainstyles.alCjcC]}>
        <ActivityIndicator color={THEME.PRIMARY}/>
      </View>
    )
  }
  return (
    <View style={[styles.companyMap,customStyles,]}>

      <MapView
        ref={mapViewRef}
        initialRegion={regionA}
        mapPadding={{
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }}
        mapType={mapTypeCurr}
        toolbarEnabled={false}
        // showsUserLocation={true}
        style={[styles.map,]}
        showsUserLocation={true}
        showsMyLocationButton={false}
        // customMapStyle={mapStyle}
        onRegionChangeComplete={onRegionChange}
        onClusterPress={() => console.log('++++ onClusterPress +++++')}
        clusterColor={'#60C1D4'}
        googleRenderer="LEGACY"
        // onMarkerPress={(e) => console.log('--id',e.nativeEvent,) }  //openCalloutA({id})
      >
        {
          coordinatesArr?.length>0?coordinatesArr.map((coordinate, index) =>
          <Marker
            ref={markerRefs[index]}
            key={index}
            identifier={`1_${index}`}
            coordinate={coordinate.coords}
            // onPress={() => openCallout(coordinate, index)}
            onPress={() => {console.log('Marker item ', coordinate), onPressCallout(coordinate,index,'show'),markerRefs[index]?.current.showCallout()}}
            // onCalloutPress={() => closeCallout(index)}
            onCalloutPress={() => {onPressCallout(coordinate,index,'hide'),markerRefs[index]?.current.hideCallout()}}
          >
            <View style={[styles.markerView,mainstyles.shadowG5r5]}>
              <IconPinSmallOt color={'#fff'} />
            </View>
            <Callout 
              tooltip={false}
              style={{ width: 250}}
              key={`callout_${index}`}
              // onPress={() => console.log('text', key)}
            >
              <View style={{}}>
                <Text style={[mainstyles.text14SB,{color:THEME.PRIMARY}]}>{coordinate.nameTender}</Text>
                <Text style={[mainstyles.text14R,]}>{coordinate.address}</Text>
                {/* <Text style={styles.calloutTextDescr}>{coordinate.Id}</Text> */}
              </View>
            </Callout>
          </Marker>
          )
          :null
        }
      </MapView>

      <View style={{position: 'absolute',left: 15, top: topPosition ? topPosition+20 : 40, zIndex: 999}}>
        <MapCustomBtn onPress={() => setIsVisibleList(prev => !prev)}>
          <Image source={require('../../../assets/image/icon011.png')} style={{width: 24, height: 24}}/>
        </MapCustomBtn>
        {
          isRouteVisible&&
          <MapCustomBtn onPress={()=>currPosition? goTocoords(mapViewRef, coordinatesArr): console.log('no coords from currPosition')}>
            <Image source={require('../../../assets/image/icon010.png')} style={{width: 24, height: 24}}/>
          </MapCustomBtn>
        }
      </View>

      <View style={{position: 'absolute',right: 15, top: topPosition ? topPosition+20 : 40, zIndex: 999}}>
        <MapCustomBtn onPress={()=>goToCurrCoord()}>
          <IconCurrLoc />
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion,setRegionState, mapViewRef, 'plus', )}>
          <Icon name="plus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion,setRegionState, mapViewRef )}>
          <Icon name="minus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>

      </View>
      {
        isVisibleList ?
            <View style={[styles.list,{top: topPosition ? topPosition+20 : 40,}]}>
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
    // backgroundColor: 'red'
    zIndex: 1
  },
  map: {
    // flex: 1,
    width: '100%',
    minHeight: Dimensions.get('screen').height/2,
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
  markerView: {
    width: 45,
    height: 45,
    borderRadius: 40, 
    backgroundColor: THEME.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 5,
    borderWidth:1,
    borderColor: '#1750ad'
  },
});