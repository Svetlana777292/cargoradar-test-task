import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput, Platform } from 'react-native';

//packages
import { useDispatch } from 'react-redux';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice
import { keyAPi } from '../../util/map_keys';
import { onPressZoom } from '../../util/mapZoom';
import { goTocoords } from '../../util/MapUtil/mapFn';
import { requestLocationFinePermission } from '../../util/permissions';
import { getUserCurrPositions } from '../../util/geolocation';
import { mapStyle } from '../../util/MapUtil/mapStylesConst';
import { onSaveCurrPosition } from '../../store/features/userSlice';

//components
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import IconCurrLoc from '../Svg/IconCurrLoc';
import IconPinSmallFill from '../Svg/IconPinSmallFill';
import { MapCustomBtn } from '../Buttons/MapCustomBtn';

//styles
import { THEME } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const MainMap = ({
  mapViewRef,
  customStyles,
  custMap,
  customBtnPosition,
  coordinatesArr=[],
  coordinatesFrom=[],
  coordinatesTo=[],
  isRouteVisible,
  onCreateRouteInfo
  }) => {
  // console.log('MapAddressPoint coordinatesArr', coordinatesArr)
    // console.log('height', height)
  Geocoder.init(keyAPi, {language : "ru"})
  const safeInsets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const [permissionRes, setPermissionRes] = useState()
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

    if((permissionRes == 'granted' && currPosition == null)||flag==='go') {
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
      // console.log('MM coordResult', coordResult);
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
        dispatch(onSaveCurrPosition(`${res.latitude},
        ${res.longitude}`))

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
  //   if(currAddressPosition!==null&&currAddressPosition!==undefined) {
  //     setCurrPosition(currAddressPosition)
  //     // console.log('currAddressPosition', currAddressPosition)
  //   }
  // },[currAddressPosition])

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

  return (
    <View style={[styles.companyMap,customStyles]}>
      <MapView
        // mapPadding={{top: Platform.OS==='ios'? 30 : 80,
        // bottom: Platform.OS==='ios'? 10 : 10}}
        ref={mapViewRef}
        initialRegion={regionA}
        mapType={mapTypeCurr}
        showsUserLocation={true}
        style={[styles.map,custMap,
          // {height:50,minHeight: 50}
        ]}
        // tracksViewChanges={false} //!!remove glitch test
        googleRenderer="LEGACY" //!!remove glitch test
        // customMapStyle={mapStyle}
        showsMyLocationButton={false}
        
        // onRegionChangeComplete={onChangeRegionCoords}
        onRegionChangeComplete={onRegionChange}
      >
        {
        coordinatesFrom&&coordinatesFrom.map((coordinate, index) =>
        <Marker 
          key={`coordinateStart_${index}`}
          coordinate={coordinate}
        >
          <IconPinSmallOt />
        </Marker>
        )
      }
      {
        coordinatesTo&&coordinatesTo.map((coordinate, index) =>
        <Marker 
          key={`coordinateEnd_${index}`}
          coordinate={coordinate}
        >
          <IconPinSmallFill />
        </Marker>
        )
      }
      {(coordinatesArr.length >= 2) && (
        <MapViewDirections
          origin={coordinatesArr[0]}
          waypoints={ (coordinatesArr.length > 2) ? coordinatesArr.slice(1, -1): undefined}
          destination={coordinatesArr[coordinatesArr.length-1]}
          apikey={keyAPi}
          onReady={result => {
            onCreateRouteInfo(result)
            // console.log(`Distance: ${result.distance} km`)
            // console.log(`Duration: ${result.duration} min.`)
          }}
          strokeWidth={3}
          strokeColor={THEME.PRIMARY}
        />
      )}
      </MapView>
      <View style={{position: 'absolute',left: 15, 
        top: customBtnPosition, 
        // top: Platform.OS==='ios'? 75 : 50, 
        
        zIndex: 999}
        }>
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

      <View style={{position: 'absolute',right: 15, 
        top: customBtnPosition,
        // top: Platform.OS==='ios'? 75: 50,
         zIndex: 999}}>
        <MapCustomBtn onPress={()=>goToCurrCoord()}>
          <IconCurrLoc />
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion,null, mapViewRef, 'plus' )}>
          <Icon name="plus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
        <MapCustomBtn onPress={()=>onPressZoom(regionA, setRegion,null, mapViewRef, )}>
          <Icon name="minus" size={20} color={THEME.PRIMARY}/>
        </MapCustomBtn>
        
      </View>
      {
        isVisibleList ?
          <View style={[styles.list,{top: customBtnPosition}]}>
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
    backgroundColor: '#F8D26A', // светло оранж
    // flex: 1, //11,02- андроид -убирает полосу
    position: 'relative',
    height: Dimensions.get('screen').height-100,
    // backgroundColor: 'pink',
    zIndex: 1,
    // opacity: 0.2
    // paddingTop: 100
  },
  map: {
    // opacity: 0.2,
    // flex: 1, //11,02- андроид -убирает полосу
    width: '100%',
    minHeight: Dimensions.get('screen').height-100,
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
  }
});