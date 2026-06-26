import { Platform } from 'react-native';
import RNPermissions, {NotificationOption,checkNotifications,requestNotifications,openSettings, check, request, PERMISSIONS, RESULTS, checkMultiple, requestMultiple} from 'react-native-permissions';

export const requestLocationFinePermission = async() =>  {
    try {
      let res = ''
      Platform.OS === 'android' ?
      await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        // console.log('ACCESS_FINE_LOCATION', result);
        res = result
        switch (result) {
          case RESULTS.DENIED:
            // console.log('The permission has not been requested / is denied but requestable');
            return 'denied'
            break;
          case RESULTS.GRANTED:
            // console.log('The permission is granted');
            return 'granted'
            break;
          case RESULTS.BLOCKED:
            // console.log('The permission is denied and not requestable anymore');
            return 'blocked'
            break;
        }
      })
      .catch((err) => {
        console.log('ACCESS_FINE_LOCATION err', err);
        // alert('Error')
      }) :
      await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        // console.log('ACCESS_FINE_LOCATION', result);
        res = result
        switch (result) {
          case RESULTS.DENIED:
            // console.log('The permission has not been requested / is denied but requestable');
            return 'denied'
            break;
          case RESULTS.GRANTED:
            // console.log('The permission is granted');
            return 'granted'
            break;
          case RESULTS.BLOCKED:
            // console.log('The permission is denied and not requestable anymore');
            return 'blocked'
            break;
        }
      })
      .catch((err) => {
        console.log('ACCESS_FINE_LOCATION err', err);
        // alert('Error')
      })
      return res
    } catch (err) {
      console.log('requestLocationFinePermission err', err);
      // alert('Error')
    }
  };

export const checkLocationPermission = async () => {
    // try {
    //   await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
    //     console.log('result', result);
    //     switch (result) {
    //       case RESULTS.DENIED:
    //         console.log('The permission has not been requested / is denied but requestable');
    //         return 'denied'
    //       case RESULTS.GRANTED:
    //         console.log('The permission is granted');
    //         return 'granted'
    //       case RESULTS.BLOCKED:
    //         console.log('The permission is denied and not requestable anymore');
    //         return 'blocked'
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('ACCESS_FINE_LOCATION err', err);
    //     alert('Error')
    //   })
    // } catch (err) {
    //   console.log(err);
    //   alert('Error')
    // }
  };

export const notificationAsk = async (value,fn) => {
  // todo проверка на токен ?
  try {
    // RNPermissions.checkNotifications()
    // .then((response) => {
    //   console.log('checkNotifications()', response);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    // const options = ['alert', 'badge', 'sound'];
    // RNPermissions.requestNotifications(options)
    // .then((response) => {
    //   console.log('requestNotifications()', response);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    await checkNotifications().then(({status, settings}) => {
      // console.log('checkNotifications----status', status)
      // console.log('checkNotifications----settings', settings)
      // requestNotifications([]).then(({status, settings}) => {
      //   console.log('requestNotifications---status', status)
      //   console.log('requestNotifications---settings', settings)
      // });
      if(status !== 'granted') {
        fn(false)
        // openSettings().catch(() => console.warn('cannot open settings'));
      } else {
        fn(true)
      }
    })
    .catch((err) => {
      console.log('notificationAsk', err);
    })
  } catch (err) {
    console.log(err);
  }
};

export const notificationOpenSettings = async () => {
  try {
    // RNPermissions.checkNotifications()
    // .then((response) => {
    //   console.log('checkNotifications()', response);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    // const options = ['alert', 'badge', 'sound'];
    // RNPermissions.requestNotifications(options)
    // .then((response) => {
    //   console.log('requestNotifications()', response);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
    await checkNotifications().then(({status, settings}) => {
      // console.log('checkNotifications----status', status)
      // console.log('checkNotifications----settings', settings)
      // requestNotifications([]).then(({status, settings}) => {
      //   console.log('requestNotifications---status', status)
      //   console.log('requestNotifications---settings', settings)
      // });
      openSettings().catch(() => console.warn('cannot open settings'));
      // if(status !== 'granted') {
      // }
    })
    .catch((err) => {
      console.log('notificationAsk', err);
    })
  } catch (err) {
    console.log(err);
  }
};

export const checkCameraPermisson = async (Platform) => {
  // try {
  //   // Platform.OS==='android' ?
  //   let res = ''
  //   await check(PERMISSIONS.ANDROID.CAMERA).then((result) => {
  //     console.log('result', result);
  //     res = result
  //     // switch (result) {
  //     //   case RESULTS.DENIED:
  //     //     console.log('The permission has not been requested / is denied but requestable');
  //     //     return 'denied'
  //     //   case RESULTS.GRANTED:
  //     //     console.log('The permission is granted');
  //     //     return 'granted'
  //     //   case RESULTS.BLOCKED:
  //     //     console.log('The permission is denied and not requestable anymore');
  //     //     return 'blocked'
  //     // }
  //   }).catch((err) => {
  //     console.log('checkCameraPermisson err', err);
  //     // alert('Error')
  //   })
  //   return res

  //   // : await check([PERMISSIONS.IOS.CAMERA,PERMISSIONS.IOS.PHOTO_LIBRARY]).then((result) => {
  //   //   console.log('result', result);
  //   //   switch (result) {
  //   //     case RESULTS.DENIED:
  //   //       console.log('The permission has not been requested / is denied but requestable');
  //   //       return 'denied'
  //   //     case RESULTS.GRANTED:
  //   //       console.log('The permission is granted');
  //   //       return 'granted'
  //   //     case RESULTS.BLOCKED:
  //   //       console.log('The permission is denied and not requestable anymore');
  //   //       return 'blocked'
  //   //   }
  //   // })
    
  // } catch (err) {
  //   console.log(err);
  //   // alert('Error')
  // }
};
export const requestCameraPermisson = async (Platform) => {
  // try {
  //   // Platform.OS==='android' ?
  //   let res = ''
  //   await request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
  //     console.log('result', result);
  //     res = result
  //     // switch (result) {
  //     //   case RESULTS.DENIED:
  //     //     console.log('The permission has not been requested / is denied but requestable');
  //     //     return 'denied'
  //     //   case RESULTS.GRANTED:
  //     //     console.log('The permission is granted');
  //     //     return 'granted'
  //     //   case RESULTS.BLOCKED:
  //     //     console.log('The permission is denied and not requestable anymore');
  //     //     return 'blocked'
  //     // }
  //   }).catch((err) => {
  //     console.log('checkCameraPermisson err', err);
  //     // alert('Error')
  //   })
  //   return res

  //   // : await check([PERMISSIONS.IOS.CAMERA,PERMISSIONS.IOS.PHOTO_LIBRARY]).then((result) => {
  //   //   console.log('result', result);
  //   //   switch (result) {
  //   //     case RESULTS.DENIED:
  //   //       console.log('The permission has not been requested / is denied but requestable');
  //   //       return 'denied'
  //   //     case RESULTS.GRANTED:
  //   //       console.log('The permission is granted');
  //   //       return 'granted'
  //   //     case RESULTS.BLOCKED:
  //   //       console.log('The permission is denied and not requestable anymore');
  //   //       return 'blocked'
  //   //   }
  //   // })
    
  // } catch (err) {
  //   console.log(err);
  //   // alert('Error')
  // }
};

export const onOpenModalSource = async (Platform,openChooseSource,openGoSettings) => {

  // let res = ''

  if(Platform.OS ==='android') {
    check(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      console.log('check PERMISSIONS result', result);
      if(result !== 'granted') {
        request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
          console.log('result', result);
          // res = result
          if(result !== 'granted') {
            openGoSettings(true)
          } else {
            openChooseSource(true)
          }
        }).catch((err) => {
          console.log('request CameraPermisson err', err);
        })
      } else {      
        // res = result
        openChooseSource(true)
      }
    }).catch((err) => {
      console.log('check CameraPermisson err', err);
      // alert('Error')
    })
  } else {
    await checkMultiple([PERMISSIONS.IOS.CAMERA,PERMISSIONS.IOS.PHOTO_LIBRARY]).then((result) => {
      console.log('check PERMISSIONS result', result, result["ios.permission.CAMERA"]);
      if(result["ios.permission.CAMERA"] !== 'granted' || result["ios.permission.CAMERA"] !== 'limited' && result["ios.permission.PHOTO_LIBRARY"] !== 'granted'|| result["ios.permission.PHOTO_LIBRARY"] !== 'limited') {

      // if(result["ios.permission.CAMERA"] !== 'granted' && result["ios.permission.PHOTO_LIBRARY"] !== 'granted') {
        requestMultiple([PERMISSIONS.IOS.CAMERA,PERMISSIONS.IOS.PHOTO_LIBRARY]).then((result) => {
          console.log('requestMultiple result', result);
          // res = result

          if(result["ios.permission.CAMERA"] !== 'granted' && (result["ios.permission.PHOTO_LIBRARY"] !== 'granted'|| result["ios.permission.PHOTO_LIBRARY"] !== 'limited')) {
            console.log('11', result["ios.permission.CAMERA"] !== 'granted' && (result["ios.permission.PHOTO_LIBRARY"] !== 'granted'|| result["ios.permission.PHOTO_LIBRARY"] !== 'limited'))
            openGoSettings(true)
          } else {
            openChooseSource(true)
          }
        }).catch((err) => {
          console.log('request CameraPermisson err', err);
        })
      } else {      
        // res = result
        openChooseSource(true)
      }
    }).catch((err) => {
      console.log('check CameraPermisson err', err);
      // alert('Error')
    })

  }
  // console.log('res', res)

}

export const requestStoragePermisson = async (Platform) => {
  try {
    // Platform.OS==='android' ?
    let res = ''
    if(Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
        console.log('result', result);
        res = result
      }).catch((err) => {
        console.log('checkCameraPermisson err', err);
        // alert('Error')
      })
    } else {
      await request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        console.log('result', result);
        res = result
      }).catch((err) => {
        console.log('checkCameraPermisson err', err);
        // alert('Error')
      })
    }
    return res
    
  } catch (err) {
    console.log(err);
    // alert('Error')
  }
};
export const requestStorageReadPermisson = async (Platform) => {
  try {
    // Platform.OS==='android' ?
    let res = ''
    if(Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
        console.log('result', result);
        res = result
      }).catch((err) => {
        console.log('checkCameraPermisson err', err);
        // alert('Error')
      })
    } else {
      await request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        console.log('result', result);
        res = result
      }).catch((err) => {
        console.log('checkCameraPermisson err', err);
        // alert('Error')
      })
    }
    return res
    
  } catch (err) {
    console.log(err);
    // alert('Error')
  }
};

export const askLibraryPermission = async (Platform,Alert) => {

  try {
    // let res = null
    // if(Platform.OS ==='android') {
    // await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
    //     console.log('check PERMISSIONS result', result);
    //     if(result !== 'granted') {
    //       request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result) => {
    //         console.log('request result', result);
    //         res = result
    //         if(result !== 'granted') {
    //           Alert.alert('', t("librarypermission"), [
    //             {
    //               // text: `${t("gosettings")}`,
    //               text: 'go',
    //               onPress: () => {
    //                 openSettings().catch(() => console.warn('cannot open settings'))
    //               },
    //             },
    //             {
    //               text: 'no',
    //               onPress: () => null,
    //             },
    //           ])
    //           res = result
    //         } else {
    //           res = result
    //         }
    //       }).catch((err) => {
    //         console.log('request CameraPermisson err', err);
    //       })
    //     } else {
    //       res = result
    //     }
    //   }).catch((err) => {
    //     console.log('check CameraPermisson err', err);
    //     // alert('Error')
    //   })
    // } else {
      // }
      // await check(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
      //   console.log('check PERMISSIONS result', result,);
      //   if(result !== 'granted') {
      //     request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
      //       console.log('requestMultiple result', result);
      //       res = result
      //       if(result !== 'granted') {
      //         // res = result
      //         // openGoSettings(true)
      //         // openSettings().catch(() => console.warn('cannot open settings'))
      //       } else {
      //         // openChooseSource(true)
      //       }
      //     }).catch((err) => {
      //       console.log('request CameraPermisson err', err);
      //     })
      //   } else {      
      //     // res = result
      //     // openChooseSource(true)
      //   }
      // }).catch((err) => {
      //   console.log('check CameraPermisson err', err);
      //   // alert('Error')
      // })
      return request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        console.log('requestMultiple result', result);
        return result
        // if(result !== 'granted') {
        //   // res = result
        //   // openGoSettings(true)
        //   // openSettings().catch(() => console.warn('cannot open settings'))
        // } else {
        //   // openChooseSource(true)
        // }
      }).catch((err) => {
        console.log('request CameraPermisson err', err);
      })

    // console.log('return res:', res)
    // return res
    
  } catch (error) {
    console.log('error onOpenModalSource', error)
  }
}