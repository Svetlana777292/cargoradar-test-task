import ImagePicker from 'react-native-image-crop-picker';
// import storage from '@react-native-firebase/storage';

export default function takePhotoFromLibrary(arr) {
  if(photosTender.length == 10) {      
    return alert('Максимальное количество фото 10 шт')
  }  
  ImagePicker.openPicker({
    mediaType: "photo",
    compressImageQuality: 0.2,
    multiple: true
  }).then(images => {
    // console.log('images :', images);
    let imagesArr = []
    images&&images.map(({path}) => {
      console.log(path)
      imagesArr.push(path)
    })
    let newArr = arr.concat(imagesArr)
    // console.log('newArr', newArr, '\n', 'imagesArr', imagesArr)
    // setPhotosTender(newArr)
    return newArr
  });
}

export async function deletePhotosFromStorage(array) {
  // try {
  //   await array.map(item => {
  //       let imageRef =  storage().refFromURL(item)
  //       imageRef.delete().then(() => {
  //         console.log("Deleted uri item", item)
  //       }).catch(err => {
  //         console.log(err)
  //       })
  //     })
  // } catch (error) {
  //   console.log('err Deleted:', error);
  // }
}