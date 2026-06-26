import { Image as ImageCompressor } from 'react-native-compressor';

  export const getUrlUploadImage = async (localUris) => {
    console.log('getUrlUploadImage obj',localUris);

    // console.log('\x1b[36m%s\x1b[0m',);

    if(localUris.length === 0) return null

    return localUris.map(item => {

      const filename = item.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      const data = {
        uri: item,
        name: filename,
        type: type,
      }
      console.log('localUri data', data)
      return data
    })
     

  }

  export async function compressImages(imagePaths) {
    const compressedImages = [];
  
    for (const path of imagePaths) {
      try {
        const compressed = await ImageCompressor.compress(path, {
          compressionMethod: 'manual',
          quality: 0.7,
        });
  
        // Предполагаем, что compress возвращает объект с новым URI
        compressedImages.push(compressed); // или compressed.uri, если там есть поле uri
      } catch (error) {
        console.warn(`Ошибка при сжатии изображения ${path}:`, error);
      }
    }
  
    return compressedImages;
  }
  

  // const getUrlUploadImage = async (localUris) => {
  //   console.log('getUrlUploadImage obj',localUris);

  //   // если аватар не менялся то проверять
  //   // console.log('\x1b[36m%s\x1b[0m',);

  //   if(localUris.length === 0) return null

  //   localUris.forEach(item => {

  //   })

  //   // if(localUri && localUri.includes('http://api-stage.cargogo.pro/storage/avatars')) {
  //   //   console.log('photo already in storage:', localUri);
  //   //   return localUri
  //   // } else {
  //     const token = await getToken()
  //     const filename = localUri.split('/').pop();
  //     const match = /\.(\w+)$/.exec(filename);
  //     const type = match ? `image/${match[1]}` : `image`;
  //     const data = {
  //       uri: localUri,
  //       name: filename,
  //       type: type,
  //     }
  //     console.log('localUri data', data)

  //   // }
  // }