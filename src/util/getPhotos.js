import ImagePicker from 'react-native-image-crop-picker';

export const takePhotoFromLibrary = (arr, setArr) => {
    if(arr.length == 10) {      
      return alert('Максимальное количество фото 10 шт')
    }
    
    ImagePicker.openPicker({
      mediaType: "photo",
      compressImageQuality: 0.7,
      multiple: true,
    }).then(images => {
      console.log('takePhotoFromLibrary images :', images);
      // images.map(({path}) => {
      //   console.log(path)
      //   setArr([...arr, path])
      // })
      let imagesArr = []
      images&&images.map(({path,size}) => {
        // console.log(path)
        // console.log(size)
        const maxSize = 4 * 1024 * 1024;
        console.log('maxSize', maxSize, 'size',size, size>maxSize)
        if(size  >= maxSize) {
          alert('Размер файла не должен быть более 4 Мб')
        } else {
          imagesArr.push(path)
        }
      })
      let newArr = arr.concat(imagesArr)
      setArr(newArr)
    });
}

export  const takePhotoFromCamera = (arr, setArr) => {
  ImagePicker.openCamera({
    mediaType: "photo",
    compressImageQuality: 0.7,
  }).then(image => {
    console.log('takePhotoFromCamera image :', image);
    // console.log(image.path);
    // let sizecheck = image.size / 1048576
    const maxSize = 4 * 1024 * 1024;
    if(size  >= maxSize) {
      alert('Размер файла не должен быть более 4 Мб')
    } else {
      setArr([...arr, image.path])
    }

  });
}

export const takeSinglePhotoFromLibrary = (arr, setArr) => {
    
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      mediaType: "photo",
      compressImageQuality: 0.4,
      multiple: false
    }).then(images => {
      console.log('takeSinglePhotoFromLibrary images :', images);
      images?.path ? setArr(images?.path) : alert("takeSinglePhotoFromLibrary error images path")
      // let imagesArr = []
      // images&&images.map(({path}) => {
      //   // console.log(path)
      //   imagesArr.push(path)
      // })
      // let newArr = arr.concat(imagesArr)
      // setArr(newArr)
    });
}
  
export  const takeSinglePhotoFromCamera = (arr, setArr) => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: "photo",
      compressImageQuality: 0.4,
    }).then(image => {
      console.log('takeSinglePhotoFromCamera image :', image);
      // console.log(image.path);      
      setArr(image?.path)

    });
}

export function deletePhoto(currIndex, arr, setArr,item,flag,setDelUrl) {
    console.log('deletePhoto arr.length', arr.length);

    const filteredData = arr.filter((item, index) => index !== currIndex);
    setArr(filteredData);
    if(flag === true) {
      setDelUrl(item)
    }
}