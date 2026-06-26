import { Linking } from "react-native";

export const goTocoords = (mapViewRef, tenderRoute) => {
  // console.log('tenderRoute', tenderRoute)
  if(tenderRoute && tenderRoute.length > 0) {
    try {
      mapViewRef.current?.fitToCoordinates(tenderRoute, {
        edgePadding: {
          top: 30,
          right: 40,
          bottom: 40,
          left: 30,
        },
      })
    } catch (error) {
      console.log('goTocoords error', error)
    }
  }
}

export const openGM = async(tenderRoute,onClose) => {
  //проверить на телефоне 
  //кнопка только в заявках
  // const url = 'https://www.google.com/maps/@?api=1&map_action=map' //приложение google maps открывается
  let url = 'https://www.google.com/maps/dir/?api=1' //путь с точками
  // const origin = `&origin=${currPosition.latitude},${currPosition.longitude}`
  // уточнить - начальная точка от текущего местоположения или стартовая точка - проверить с текущем местоположением и сколько можно добавить 
  // точек
  // const origin = `&origin=${46.40144},${30.73202}`
  // const destination = `&destination=${46.48493},${30.74108}`
  // const waypoints = `&waypoints=${46.47933},${30.75031}|${46.48318},${30.72996}|${46.4952},${30.72022}`

  const origin = `&origin=${tenderRoute[0].latitude},${tenderRoute[0].longitude}`
  const destination = `&destination=${tenderRoute[tenderRoute.length-1].latitude},${tenderRoute[tenderRoute.length-1].longitude}`
  let waypoints = `&waypoints=`
  tenderRoute.forEach((item, index) => {
    if(index > 0 && index < tenderRoute.length-1)
    waypoints += `${item.latitude},${item.longitude}|`
  })
  console.log('waypoints', waypoints)
  const travelmode = `&travelmode=driving`
  url+=origin+destination+waypoints+travelmode
  // Linking.openURL(url)
  //посмотреть возможность выбора открытия других карт
  Linking.canOpenURL(url).then(supported => { // проверка может ли открыть
    if (supported) {
      Linking.openURL(url);
      onClose()
    } else {
      alert('error open google maps. Try again')
      console.log('Don\'t know how to open URI: ' + url);
    }
  })
  
  // openExternalApp(url) {
  // }
//   return await fetch(url)
//   .then(res => console.log('res', res)).catch(e => {console.log('err fetch map', e)})
}