import { get, post } from "../store/features/api/user-api";


//obj to nav to active tenders
export async function getUserDataChatRouteClient(tenderId,userId,myId) {
  console.log('getUserDataChatRouteClient', tenderId,userId,myId)
  try {

    //!! get tender
    const response = await get(`tenders/${tenderId}`)
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      alert(response.error);
      return;
    }
    //!! get users
    const respData = await get(`tenders/${tenderId}/replies`)
    if (!respData.success) {
      console.warn('Ошибка запроса:', respData.error);
      //
      alert(respData.error);
      return;
    }
    console.log('GUDC respData.data',respData.data)
    // console.log('GUDC respData.data',respData.data)
    const currUser = respData.data.find(elem => {
      // console.log('1elem', elem)
      if(elem.form.profile.id === userId) {
        // console.log('2elem', elem)
        return elem
      }
    })
    
    // console.log('GUDC respData.data',respData.data)
    const messagesFiltered = currUser.messages.filter(elemfl => (elemfl.userId === myId && elemfl.partnerId === userId) || (elemfl.userId === userId && elemfl.partnerId === myId))

    //todo создать объект
    let objUser = {
      tender: response.data,
      data: {
        messages: messagesFiltered,
        reply: currUser.reply,
        forms: currUser.form
      }
    }

    console.log('objUser', objUser)
    return objUser
    
  } catch (error) {
    
    console.log('getUserDataChatRouteClient',error)
  }
}

export async function getUserDataChatRouteDriver(tenderId,userId,myId) {
  try {

    //!! get tender
    const response = await get(`tenders/${tenderId}`)
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
      //
      alert(response.error);
      return;
    }
    //!! get users
    const respData = await get(`tenders/${tenderId}/replies/drivers/${myId}`)
    if (!respData.success) {
      console.warn('Ошибка запроса:', respData.error);
      //
      alert(respData.error);
      return;
    }
    const currUser = respData.data
    console.log('GUDC currUser',currUser)
    const messagesFiltered = currUser.messages.filter(elemfl => (elemfl.userId === myId && elemfl.partnerId === userId) || (elemfl.userId === userId && elemfl.partnerId === myId))

    //todo создать объект
    let objUser = {
      tender: response.data,
      data: {
        messages: messagesFiltered,
        reply: currUser.reply,
        forms: currUser.forms
      }
    }

    console.log('objUser', objUser)
    return objUser
    
  } catch (error) {
    console.log('getUserDataChatRouteDriver',error)
  }
}

export async function sendComplain(data,description,user,partner,tenderId,src) {
  // console.log('sendComplain start data',data,description?.trim())



    try {
      // const opponentInfo = {fullName: 'qwe1', email: 'qwe@qwe.ww', phone: '123', userComplaintsCounter: 0}
      // const opponentInfo = await getProfileUserInfoForComplaint(tenderState.data.userId)
      // const allComplaintsForOpponent = await getAllComplaints(tenderState.data.userId)
      // console.log('opponentInfo', opponentInfo)
      // console.log('allComplaintsForOpponent', allComplaintsForOpponent)

      let obj = {
        description: {...data, description: description !== undefined ? description?.trim() : ''},
        tenderId: tenderId,
        rating: 0,
        status: 'open',
        sourceSending: src,//'chat','tender'
        comment: [],
        userInfo: {
          fullName: user.name, 
          email: user?.email !== undefined ? user?.email : '', 
          phone: user?.phone
        },
        opponentInfo: {
          fullName: partner.name, 
          email: partner?.email !== undefined ? partner?.email : '', 
          phone: partner?.phone
        },
        // userComplaintsCounter: userProfileInfo?.userComplaintsCounter,
        // opponentComplaintsCounter: allComplaintsForOpponent,
        userId: user.id,
        opponentId: partner.id
      }
      //opponentComplaintsCounter - кол-во жалоб отправленное на оппонента
      console.log('obj', obj)
      const response = await post('complaints',obj)
      if (!response.success) {
        // console.warn('Ошибка запроса:', response.error);
        alert(response.error);
        return null
        
      }
      console.log('response', response.data)
      return response.data

      // await firestore()
      // .collection('complaints')
      // .add(obj)
      // .then(res => {
      //   //!up counter in firebase profile
      //   firestore()
      //     .collection('forms')
      //     .doc(uid)
      //     .update({'profile.userComplaintsCounter': firestore.FieldValue.increment(1)})
      //     .then(documentSnapshot => {
      //       //!get new profile
      //       getDetailProfile(uid,dispatch,userProfileInfo)
      //       //!show modal
      //       setIsLoading(false)
      //       setIsVisibleFormSucceed(true)
      //       // console.log('documentSnapshot', documentSnapshot)
            
      //     }).catch(err => {
      //       setIsLoading(false)
      //       console.log('userComplaintsCounter', err)
      //     })
      // })

      
    } catch (error) {
      console.log('sendComplain error', error)
      // setIsLoading(false)
      return null;
    }
  // }
}