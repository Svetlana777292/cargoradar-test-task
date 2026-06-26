import Geolocation from 'react-native-geolocation-service';
import {requestNotifications, check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import { keyAPi } from './map_keys';
import { Platform } from 'react-native';
import { get, post, put } from '../store/features/api/user-api';
import { checkPositionDriver } from './geolocationTools';
import { isWithin24Hours } from './tools';
Geocoder.init(keyAPi, {language : "ru"})

export const getUserCurrPositions = () =>
  new Promise((resolve, reject) => {
    Geocoder.init(keyAPi, {language : "ru"})
    Geolocation.getCurrentPosition(
      position => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        // console.log('cords', cords);
        resolve(cords)
      },
      error => {
        reject(console.log('getCurrentPosition  error.message:', error.message));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  })


// export const getCurrentPositionAdressAndCoords = async(dispatch,fn,fnStatus,setShowInfoModal,setStatusGps)=>{
//   Geocoder.init(keyAPi, {language : "ru"})
//   let currAddress = null
//   const checkPremisson = Platform.OS === 'android' ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
//     // console.log('ACCESS_FINE_LOCATION result: ', result);
//     dispatch(fnStatus(result))
//     return result
//   }) : await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result)=> {
//     if(result != 'granted') {
//        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result)=> {

//         dispatch(fnStatus(result))
//         return result
//       })
//     } else {

//       dispatch(fnStatus(result))
//       return result
//     }
//   })


//   // console.log('checkPremisson', checkPremisson)
//   if(checkPremisson == 'granted') {
//     try {

//       new Promise((resolve, reject) => {    
//         Geolocation.getCurrentPosition(
//           position => {
//             const cords = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             };
//             // console.log('Promise cords', cords);
//             dispatch(setStatusGps(''))
//             resolve(cords)
//           },
//           error => {
//             if (error.message === 'No location provider available.') {
//               //Show alert or something here that GPS need to turned on.
//               setShowInfoModal ? dispatch(setShowInfoModal(true)) : ''
//               dispatch(setStatusGps(error.message))
//               // alert('GPS не включен, чтобы использовать все функции приложения, включите GPS в настройках телефона')
//            }
//             reject(console.log('Promise Geolocation error.message:', error.message));
//           },
//           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000,showLocationDialog: true,forceRequestLocation: true },
//         )
//       }).then((result)=>{
//         // console.log('getCurrentPositionAdressAndCoords result', result)

//         Geocoder.from(result.latitude, result.longitude).then(json => {
//           const addressComponent = json.results[0].formatted_address
//           // const addressComponent = json.results[0].address_components[0];
//           // console.log('-------json.results[0]: ', json.results[0]);
//           // console.log('Geocoder addressComponent:', addressComponent);

//           currAddress= {
//               address: addressComponent,
//               latitude: result.latitude,
//               longitude: result.longitude,
//             }
//           dispatch(fn(currAddress))
          
//         }).catch(error => {
//           console.log('Geocoder catch error getCurrentPositionAdressAndCoords:', error)
//         });
//       })
//       // return currAddress
      
//       // console.log('currAddress', currAddress)
//     } catch (error) {
//       console.log('geolocation.js err', error)
//     }
//     // console.log('position', position);
//   } else {
//     // dispatch()
//   }

// }

export const getCurPositionAdressAndCoordsForse = async(dispatch,fn,fnStatus,setShowInfoModal,setStatusGps)=>{
  Geocoder.init(keyAPi, {language : "ru"})
  let currAddress = null
  const checkPremisson = Platform.OS === 'android' ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
    // console.log('ACCESS_FINE_LOCATION result: ', result);
    dispatch(fnStatus(result))
    return result
  }) : await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result)=> {
    if(result != 'granted') {
       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result)=> {

        dispatch(fnStatus(result))
        return result
      })
    } else {

      dispatch(fnStatus(result))
      return result
    }
  })


  // console.log('checkPremisson', checkPremisson)
  if(checkPremisson == 'granted') {
    try {

      new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const cords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            // console.log('Promise cords', cords);
            resolve(cords)
            dispatch(setStatusGps(''))
          },
          error => {
            if (error.message === 'No location provider available.') {
              //Show alert or something here that GPS need to turned on.
              setShowInfoModal ? dispatch(setShowInfoModal(true)) : ''
              dispatch(setStatusGps(error.message))
              // alert('GPS не включен, чтобы использовать все функции приложения, включите GPS в настройках телефона')
           }
            reject(console.log('Promise Geolocation error.message:', error.message));
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000,showLocationDialog: true,forceRequestLocation: true },
        )
      }).then((result)=>{
        // console.log('getCurrentPositionAdressAndCoords result', result)

        Geocoder.from(result.latitude, result.longitude).then(json => {
          const addressComponent = json.results[0].formatted_address
          // const addressComponent = json.results[0].address_components[0];
          // console.log('-------json.results[0]: ', json.results[0]);
          // console.log('Geocoder addressComponent:', addressComponent);

          currAddress= {
              address: addressComponent,
              latitude: result.latitude,
              longitude: result.longitude,
            }
          dispatch(fn(currAddress))
    
        }).catch(error => {
          console.log('Geocoder catch error getCurPositionAdressAndCoordsForse:', error)
        });
      })
      // return currAddress
      
      // console.log('currAddress', currAddress)
    } catch (error) {
      console.log('geolocation.js err', error)
    }
    // console.log('position', position);
  } else {
  }

}

//----- new curposdriver
export async function checkDriverPositionDoc(id) {
  console.log('checkDriverPositionDoc id', id)
  //получить позицию
  const response = await get(`positions/users/${id}`)
  // console.log('checkDriverPositionDoc response', response)
  //нет позиции - создать или ошибка 
  if (!response.success) {
    // console.warn('Ошибка запроса get:', response.error);

    return response.error;
  }
  return response.data
}

export const getCurrentPositionAdressAndCoords = async (
  dispatch,
  fn,
  fnStatus,
  setShowInfoModal,
  setStatusGps
) => {
  Geocoder.init(keyAPi, { language: 'ru' });

  let permissionResult;

  if (Platform.OS === 'android') {
    permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  } else {
    permissionResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    if (permissionResult !== 'granted') {
      permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
  }

  dispatch(fnStatus(permissionResult));

  if (permissionResult !== 'granted') {
    return null;
  }

  try {
    const coords = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          dispatch(setStatusGps(''));
          resolve({ latitude, longitude });
        },
        error => {
          if (error.message === 'No location provider available.') {
            if (setShowInfoModal) dispatch(setShowInfoModal(true));
            dispatch(setStatusGps(error.message));
          }
          reject(new Error(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          showLocationDialog: true,
          forceRequestLocation: true,
        }
      );
    });

    const geoResult = await Geocoder.from(coords.latitude, coords.longitude);
    const address = geoResult.results[0].formatted_address;

    const result = {
      address,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    dispatch(fn(result));

    return result;
  } catch (error) {
    console.log('Ошибка в getCurrentPositionAdressAndCoords:', error.message);
    return null;
  }
};

export const checkTimeAndPosition = async (positionDriver,dispatch,userId,currentPositionWithAddress,setPositionDriverWithTime,) => {
  
  console.log('\x1b[42m%s %s\x1b[0m', 'start fn checkTimeAndPosition:', positionDriver,currentPositionWithAddress );
  //positionDriver - позиция с сервера
  //получить текущую геопозицию и записать в стейт
  const positionDoc = await checkDriverPositionDoc(userId)
  console.log('--positionDoc',positionDoc)

  // console.log('positionDriver === null || positionDriver === undefined', positionDriver === null || positionDriver === undefined)
  if(positionDriver === null || positionDriver === undefined) {
    console.log('нет позиции', )
    //*1 нету
    if (positionDoc === "Position not created") {
      // console.warn('--positionDoc === Position not created');
      if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
      }
      //!! запись новой позиции если не создана и диспатч
      console.log('\x1b[46m%s %s\x1b[0m', 'checkTimeAndPosition: запись новой позиции если не создана и диспатч', );
      return
      // const responsePosition = await post('positions',{coords: currentPositionWithAddress})
      // console.log('responsePosition', responsePosition.data)

      // if (!responsePosition.success) {
      //   console.warn('Ошибка запроса:', responsePosition.error);
      //   alert(responsePosition.error);
      //   return;
      // } else {
      //   //отправляем в стейт если ок
      //   // console.log(' в стейт responsePosition.data)',responsePosition.data) 
      //   dispatch(setPositionDriverWithTime(responsePosition.data))
      //   return;
      // }
    }
    //*2 есть
    const checkDrPos = isWithin24Hours(positionDoc.timestamp)
    console.log('--checkDrPos', checkDrPos)
    if(checkDrPos === true) {
      //> 24h or <24h && coords changed
      //обновить и отправить в стейт
      if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
      }
      //!!разница больше обновить документ и диспатч
      console.log('\x1b[46m%s %s\x1b[0m', 'checkTimeAndPosition: разница больше обновить документ и диспатч', );
      return
      // const newResponse = await put(`positions/${positionDoc.id}`, {coords: currentPositionWithAddress})
      // console.log('newResponse', newResponse)
      // if (!newResponse.success) {
      //   console.warn('Ошибка запроса:', newResponse.error);
      // } else {
        
      //   dispatch(setPositionDriverWithTime(newResponse.data))
      // }
    } else {
      //отправить в стейт
      console.log('1 отправить в стейт', positionDoc)
      // dispatch(setPositionDriverWithTime(positionDoc))
    }
    
  } else {
    console.log("есть позиция")
    const checkDrPos = isWithin24Hours(positionDoc.timestamp)
    console.log('--checkDrPos', checkDrPos)
    if(checkDrPos === true) {
      //> 24h or <24h && coords changed
      //обновить и отправить в стейт
      if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
      }
      //!!обновить позицию и диспатч
      console.log('\x1b[46m%s %s\x1b[0m', 'checkTimeAndPosition: разница больше обновить документ и диспатч', );
      return
      // const newResponse = await put(`positions/${positionDoc.id}`, {coords: currentPositionWithAddress})
      // // console.log('newResponse', newResponse)
      // if (!newResponse.success) {
      //   console.warn('Ошибка запроса:', newResponse.error);
      // } else {
        
      //   dispatch(setPositionDriverWithTime(newResponse.data))
      // }
    } else {
      //отправить в стейт
      console.log('отправить в стейт', positionDoc)
      // dispatch(setPositionDriverWithTime(positionDoc))
    }
  }
}

export const check24hPosition = async (positionDriver,dispatch,currentPositionWithAddress,setPositionDriverWithTime,) => {
  console.log('\x1b[43m%s %s\x1b[0m', 'start fn check24hPosition:', positionDriver,currentPositionWithAddress );

  const positionDoc = positionDriver
  console.log('--positionDoc', positionDoc)

  if(positionDriver !== null && positionDriver !== undefined) {
    console.log('есть позиция', )
    const checkDrPos = isWithin24Hours(positionDoc.timestamp)
    console.log('--checkDrPos', checkDrPos)
    if(checkDrPos === true) {
      //> 24h or <24h && coords changed
      //обновить и отправить в стейт
      if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
      }
      //!!есть позиция - обновление и диспатч
      console.log('\x1b[46m%s %s\x1b[0m', 'check24hPosition: разница больше обновить документ и диспатч', );
      return
      // const newResponse = await put(`positions/${positionDoc.id}`, {coords: currentPositionWithAddress})
      // console.log('newResponse', newResponse)
      // if (!newResponse.success) {
      //   console.warn('Ошибка запроса:', newResponse.error);
      // } else {
        
      //   dispatch(setPositionDriverWithTime(newResponse.data))
      // }
    } else {
      //отправить в стейт
      console.log('2отправить в стейт', positionDoc)
      // dispatch(setPositionDriverWithTime(positionDoc))
    }

    //*1 нету
    if (positionDoc === "Position not created") {
      console.warn('--positionDoc === Position not created');
      if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
      }
      const responsePosition = await post('positions',{coords: currentPositionWithAddress})
      console.log('responsePosition', responsePosition)

      if (!responsePosition.success) {
        console.warn('Ошибка запроса:', responsePosition.error);
        alert(responsePosition.error);
        return;
      } else {
        //отправляем в стейт если ок
        console.log(' в стейт responsePosition.data)',responsePosition.data) 
        dispatch(setPositionDriverWithTime(responsePosition.data))
        return;
      }
    }
    
  }
}


//new position
export const positionDriverCheckAndSet = async (positionDriver,dispatch,userId,currentPositionWithAddress,setPositionDriverWithTime) => {
  // console.log('\x1b[43m%s %s\x1b[0m', 'start fn positionDriverCheckAndSet:', positionDriver,currentPositionWithAddress );
  const positionDoc = await checkDriverPositionDoc(userId)
  // console.log('--positionDoc',positionDoc)

  if(positionDoc === "Position not created") {
    // проверить геопозицию currentPositionWithAddress
    //создать позицию и записать
    if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
    }
    const positionResp = await post('positions',{coords: currentPositionWithAddress})
    console.log('positionResp', positionResp)
    if (!positionResp.success) {
      console.warn('Ошибка запроса positions:', positionResp.error);
    } else {
      
      dispatch(setPositionDriverWithTime(positionResp.data))
    }

  } else {
    if(currentPositionWithAddress === null) {
        alert('Что бы пользоваться всеми функциями приложения, разрешите доступ к геолокации') 
        return;
    }
    //!!разница больше обновить документ и диспатч
    // console.log('\x1b[46m%s %s\x1b[0m', 'checkTimeAndPosition: разница больше обновить документ и диспатч', );
    // return
    const positionResp = await put(`positions/${positionDoc.id}`, {coords: currentPositionWithAddress})
    // console.log('positionResp', positionResp)
    if (!positionResp.success) {
      console.warn('Ошибка запроса positions:', positionResp.error);
    } else {
      
      dispatch(setPositionDriverWithTime(positionResp.data))
    }
  }
}