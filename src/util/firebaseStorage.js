
// import storage from '@react-native-firebase/storage';

export const uploadFile = async (fileUri,uid,setProcessing=()=>{}) => {
  // console.log('uploadFile fileUri',fileUri);

  // // console.log('\x1b[36m%s\x1b[0m',);
  // if(fileUri === null) return null

  // // if(fileUri && fileUri.includes('firebasestorage.googleapis.com')) {
  // //   console.log('photo already in storage:', fileUri);
  // //   return fileUri
  // // }

  // const uploadUri = fileUri
  // console.log('uploadUri', uploadUri);

  // let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1);

  // const extension = filename.split('.').pop();
  // const name = filename.split('.').slice(0, -1).join('.');
  // filename = name + Date.now() + '.' + extension;

  // // setUploading(true);
  // // setTransferred(0);

  // const storageRef = storage().ref(`users/${uid}/${filename}`)
  // const task = storageRef.putFile(uploadUri)

  // task.on('state_changed', (taskSnapshot) => {
  //   console.log(taskSnapshot.state);
  //   console.log(
  //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
  //   );
    
  //   setProcessing(
  //     Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
  //       100,
  //   );
  // })

  // try {
  //   await task

  //   const url = await storageRef.getDownloadURL()
  //   console.log('getDownloadURL url:', url);

  //   // setUploading(false);
  //   // setImageNeedsUpload(false)
  //   // setAvatarUser(url)
  //   //user
  //   // if(user.role === 'driver') {
  //   //   setUser({ ...user, driverAvatar: url })
  //   // } 
  //   // if(user.role === 'client') {
  //   //   setUser({ ...user, clientAvatar: url })
  //   // }

  //   // Alert.alert(
  //   //   'Image uploaded',
  //   // );
  //   return url;

  // } catch (error) {
  //   console.log('await task error', error);
  //   return null;
  // }
}