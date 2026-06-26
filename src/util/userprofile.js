import { setUserFormsActivities, setUserProfileInfo } from "../store/features/loginSlice"

export const updateProfile = (dispatch, user) => {
  console.log('user', user)
  let avatarD = user?.forms?.profile.hasOwnProperty('driverAvatar') && user.forms.profile.driverAvatar !== null && user.forms.profile.driverAvatar?.length > 0 ? user.forms.profile.driverAvatar : ''
  let avatarC = user?.forms?.profile.hasOwnProperty('clientAvatar') && user.forms.profile.clientAvatar !== null && user.forms.profile.clientAvatar?.length > 0 ? user.forms.profile.clientAvatar : ''
  console.log('avatarD',avatarD);
  console.log('avatarC',avatarC);
  // console.log('user.forms.profile.driverAvatar?.length > 0',user.forms.profile.driverAvatar?.length > 0);
  
  dispatch(setUserProfileInfo({
      id: user.id,
      name: user.name,
      role: user.role !== null ? user.role : (user.forms.profile.role ? user.forms.profile.role : user.roles[0]),
      unp: user?.unp,
      organization: user?.organization,
      driverAvatar: avatarD,
      clientAvatar: avatarC,
      rating: user?.forms?.rating,
      phone: user?.phone,
      email: user?.email
  //     quantityTenders: userInfo?.quantityTenders,
  //     quantityOfFinished: userInfo?.quantityOfFinished,
  //     userComplaintsCounter: userInfo?.userComplaintsCounter
      
    }))
}