// src/features/someFeature/someThunks.js


import { get, put } from './user-api';
import { setCarsInfo, setDriverDeleteTenders, setDriverFavoritsTenders, setUserFormsActivities, setUserFormsHiddenTenders, setUserFormsInfo } from '../loginSlice';
import { updateProfile } from '../../../util/userprofile';

export const getUserFormDataFromDB = async (dispatch,flag) => {
  // console.log('getUserFormDataFromDB startfn',flag)
  try {

    const response = await get('forms')
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserFormDataFromDB', response.error);
        //
        alert(response.error);
        return;
    } else {
      // console.log('response.data', response.data)
      dispatch(setUserFormsInfo(response.data))
    }
  } catch (error) {
    // alert(error);
    // dispatch(setError(error.message));
   } 
};

export const setUserFormDataFromDB = async (dispatch,obj) => {
  // console.log('setUserFormDataFromDB  startfn')
  try {
    // dispatch(setLoading(true));
    
    const response = await put('forms',obj)
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserFormDataFromDB', response.error);
        //
        alert(response.error);
        return;
    } else {
      console.log('response.data', response.data)
      dispatch(setUserFormsInfo(response.data))
    }
  } catch (error) {
    alert(error);
    // dispatch(setError(error.message));
   } 
};
export const setDriverFormUpd = async (dispatch,obj,flag) => {
  // console.log('setUserFormDataFromDB  startfn',obj)
  try {
    // dispatch(setLoading(true));
    
    const response = await put('forms',obj)
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserFormDataFromDB', response.error);
        //
        alert(response.error);
        return;
    } else {
      // console.log('response.data', response.data)
      if(flag === 'faivorTenders') {
        dispatch(setDriverFavoritsTenders(response.data.faivorTenders))
      } else {
        dispatch(setDriverDeleteTenders(response.data.deleteTenders))
        if(obj.hasOwnProperty('driverTenderActivity')) {
          // console.log('upd active', obj.hasOwnProperty('driverTenderActivity'))
          dispatch(setUserFormsActivities({
            "clientActiveTender": response.data.clientActiveTender,
            "driverActiveTender": response.data.driverActiveTender,
            "driverRoutesOffers": response.data.driverRoutesOffers,
            "driverTenderActivity": response.data.driverTenderActivity
          }))
        }
      }
        
    }
  } catch (error) {
    alert(error);
    // dispatch(setError(error.message));
   } 
};

export const getUserTransportInfo = async (dispatch) => {
  // console.log('getTransportInfo START', )
    // const token = await getToken()
    
    // const response = await getRequest(token, 'cars')
    const response = await get('cars')
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      alert('error');
      return;
    }
    dispatch(setCarsInfo(response.data))
    // console.log('getTransportInfo response', response, typeof(response))
}

//только отдельные поля формы - для обновления информеров
export const getUserActivities = async (dispatch) => {
  // console.log('getUserActivities startfn')
  try {

    const response = await get('forms')
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserActivities', response.error);
        //
        alert(response.error);
        return;
    } else {
      // console.log('getUserActivities response.data', response.data)
      dispatch(setUserFormsActivities({
        "clientActiveTender": response.data.clientActiveTender,
        "driverActiveTender": response.data.driverActiveTender,
        "driverRoutesOffers": response.data.driverRoutesOffers,
        "driverTenderActivity": response.data.driverTenderActivity
      }))
      return response.data
    }
  } catch (error) {
    alert(error);
   } 
};

//только отдельные поля формы - для обновления информеров
export const setUserActivities = async (dispatch,obj) => {
  // console.log('setUserActivities startfn',obj)
  try {

    const response = await put('forms',obj)
      
    if (!response.success) {
        console.warn('Ошибка запроса: setUserActivities', response.error);
        //
        alert(response.error);
        return;
    } else {
      console.log('setUserActivities response.data', response.data)
      dispatch(setUserFormsActivities({
        "clientActiveTender": response.data.clientActiveTender,
        "driverActiveTender": response.data.driverActiveTender,
        "driverRoutesOffers": response.data.driverRoutesOffers,
        "driverTenderActivity": response.data.driverTenderActivity
      }))
    }
  } catch (error) {
    alert(error);
   } 
};

export const getUserHiddenTenders = async (dispatch) => {
  // console.log('getUserHiddenTenders  startfn')
  try {
    // dispatch(setLoading(true));
    
    const response = await get('forms')
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserHiddenTenders', response.error);
        //
        alert(response.error);
        return null
    } else {
      console.log('getUserHiddenTenders response.data', response.data)
      dispatch(setUserFormsHiddenTenders(response.data))
      return response.data
    }
  } catch (error) {
    alert(error);
   } 
};

export const setUserHiddenTenders = async (dispatch,obj) => {
  // console.log('setUserFormsHiddenTenders  startfn')
  try {
    
    const response = await put('forms',obj)
      
    if (!response.success) {
        console.warn('Ошибка запроса: setUserHiddenTenders', response.error);
        //
        alert(response.error);
        return null
    } else {
      console.log('response.data', response.data)
      dispatch(setUserFormsHiddenTenders(response.data))
      return response.data
    }
  } catch (error) {
    alert(error);
    // dispatch(setError(error.message));
   } 
};


//в таб нав - пока не используется
export const getUserInfoDataFromDB = async (dispatch) => {
  // console.log('getUserInfoDataFromDB startfn')
  try {
    // dispatch(setLoading(true));

    const response = await get('forms')
      
    if (!response.success) {
        console.warn('Ошибка запроса: getUserInfoDataFromDB', response.error);
        //
        alert(response.error);
        return;
    } else {
      console.log('qwe response.data', response.data)
      updateProfile(dispatch,response.data)
      
    }
  } catch (error) {
    alert(error);
    // dispatch(setError(error.message));
   } 
};


export async function getUserRatingFdback(id,dispatch) {
  // console.log('getUserRatingFdback fn', )
  try {
    // const response = await get(`feedback/${id}`)
    const response = await get(`feedback/partner`)
      
    if (!response.success) {
        console.log('Ошибка запроса: getUserFormDataFromDB', response.error);
        //
        // alert(response.error);
        return;
    } else {
      // console.log('response.data', response.data)
      // dispatch(setUserFormsInfo(response.data))
      // let arr = response.data.filter(elem => elem.partnerId === id && elem.partnerRole === role)
      let arr = response.data.filter(elem => elem.partnerId === id)
      // console.log('arr rt', arr)
      if(arr.length > 0) {
        const sum = arr.reduce((prev, cur) => prev+cur.score,0)
        // console.log('sum', typeof(sum), sum, scoreSum.length)
        let rating = (sum/arr.length).toFixed(1)
        // console.log('rating', rating, typeof(rating))
        if(rating !== undefined && parseInt(rating)) {

          const responseFrm = await put('forms',{profile: {rating: rating}})
      
          if (!responseFrm.success) {
              console.warn('Ошибка запроса: put forms', responseFrm.error);
              //
              // alert(response.error);
              return;
          } else {
            // console.log('responseFrm.data', responseFrm.data)
            dispatch(setUserFormsInfo(responseFrm.data))
          }
        }
      }
    }
    // await firestore()
    // .collection('feedback')
    // .where('partnerId', '==', id)
    // .get()
    // .then(querySnapshot=>{
    //   // console.log('getUserRating', querySnapshot.size)
    //   let scoreSum = []
    //   querySnapshot.forEach(documentSnapshot => {
    //     // console.log('UserRating documentSnapshot item:', documentSnapshot.data())
    //     if(documentSnapshot.data().partnerRole == 'driver') {
    //       scoreSum.push(documentSnapshot.data().score)
    //     }
    //   })
      
    //   if(scoreSum.length > 0) {
    //     const sum = scoreSum.reduce((prev, cur) => prev+cur)
    //     // console.log('sum', typeof(sum), sum, scoreSum.length)
    //     let rating = (sum/scoreSum.length).toFixed(1)
    //     firestore()
    //     .collection('forms')
    //     .doc(id)
    //     .update({'profile.rating':rating })
    //     .catch(e => {console.log('getUserRating err update rating e:',e)})
    //   } 
      
    // })
  } catch (error) {
    console.log('getUserRating error', error)
  }
}
