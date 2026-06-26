import { Alert, Keyboard, PermissionsAndroid, Platform, View } from "react-native";

// packages
import { Actions } from 'react-native-gifted-chat'
// import DocumentPicker from 'react-native-document-picker'
import { errorCodes, isErrorWithCode, keepLocalCopy, pick, types } from '@react-native-documents/picker'
import Icon from '@react-native-vector-icons/entypo';
import {check, PERMISSIONS, RESULTS,openSettings} from 'react-native-permissions';
import { createVideoThumbnail, clearCache, Video, Image } from 'react-native-compressor';
import ImagePicker from 'react-native-image-crop-picker';

// Utils
// import { SERVERURICARGO } from "../../../../util/apiVars";
// import { askLibraryPermission } from "../../../../util/permissions";
import { launchImageLibrary } from "react-native-image-picker";
import { askLibraryPermission, checkCameraPermisson, requestCameraPermisson, requestStoragePermisson, requestStorageReadPermisson } from "../../util/permissions";
import { uploadFile } from "../../util/firebaseStorage";
import { THEME } from "../../theme";
import { getUrlUploadImage } from "../../util/uploadFilesHelper";
import { uploadChatsMedia } from "../../store/features/Upload/uploadfiles";

export default ({onSend, setProcessing,setUploadProgress, uid,setAbortController, ...props}) => {
// console.log('props', props)

  let selectFile = async () => {
    Keyboard.dismiss()
    try {
      setUploadProgress(true)

      const [pickResult] = await pick({
        type: [
          types.csv,
          types.doc,
          types.docx,
          types.pdf,
          types.plainText,
          types.ppt,
          types.pptx,
          types.xls,
          types.xlsx,
          types.zip
         ]
      }).catch((error)=> {
        console.log('error.code', error.code)
        switch (error.code) {
          case errorCodes.IN_PROGRESS:
            console.warn('user attempted to present a picker, but a previous one was already presented')
            break
          case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
            alert(`Данный тип файла не поддерживается` );
            break
          case errorCodes.OPERATION_CANCELED:
            // ignore
            console.log(' error.code.OPERATION_CANCELED', error.code)
            break
          default:
            console.error('pick error', error)
        }
        setUploadProgress(false)
      })
      let androidFile = null

      if(Platform.OS === 'android') {
        const [copyResult] = await keepLocalCopy({
          files: [
            {
              uri: pickResult.uri,
              fileName: pickResult.name ?? 'fallback-name',
            },
          ],
          destination: 'documentDirectory',
        })
        if (copyResult.status === 'success') {
          // do something with the local copy:
          androidFile = copyResult.localUri
          // console.log(copyResult.localUri)
        }
      }
      // console.log('androidFile', androidFile)
      // console.log('pickResult', pickResult)

      if(pickResult.size > 50000000) {
          Alert.alert('', "Размер файла не должен привышать 50Mб ", [

            {
              text: "Закрыть",
              onPress: () => null,
            },
          ])
          setUploadProgress(false)
          return
        }
        let typeFile = pickResult.type.split('/').shift();
        // console.log('typeFile', typeFile)
        
        const objToUpload = {
          uri: Platform.OS === 'android' ? androidFile : pickResult.uri,
          name: pickResult.name, //todo - сгенерить короткое имя?
          type: Platform.OS === 'android' ? pickResult.type : typeFile
        }
        // const objToUpload = await getUrlUploadImage(res.fileCopyUri)
        // console.log('objToUpload', objToUpload,'uri,name,type')
        //!! загрузка файла
        const controller = new AbortController()
        setAbortController(controller)
        // const timeoutId = setTimeout(() => {
        //   controller.abort(); // прерываем загрузку
        // }, 60000); // например, через 30 секунд
        // clearTimeout(timeoutId);

        let fileUri = await uploadChatsMedia(objToUpload,"doc[]",controller.signal)
        console.log('\x1b[91m fileUri \x1b[0m', fileUri)
        // clearTimeout(timeoutId);

        if(!fileUri.success) {
          setUploadProgress(false)
          alert(`Ошибка загрузки файла: ${fileUri.error}` );
        }
        let objSend = {
          size: pickResult.size,
          url: fileUri.data[0],
          file_type: typeFile,
          name: pickResult.name,
          text: null //pickResult.name,
        }      
        console.log('objSend', objSend)
        
        onSend([objSend]);
        setUploadProgress(false)
        setAbortController(null);

    } catch (error) {
      setUploadProgress(false)
      // clearTimeout(timeoutId);
      setAbortController(null);
      // Alert.alert("Ошибка загрузки файла", `Загрузка прервана, попробуйте ещё раз `);

      // console.log('file catch error ', error.message, )
      if(error.message.includes('Invalid attempt to destructure non-iterable instance.')) {
        return
      } else {
        alert('Ошибка отправки файла: ' + error?.message);
      }
      // if (error.name === 'AbortError') {
      //   Alert.alert("Ошибка", "Загрузка прервана по таймауту, попробуйте ещё раз");
      // }
    }
  };

  const handlePicker = async(flag) => {
    Keyboard.dismiss()
    setUploadProgress(true)

    console.log('\x1b[96m61\x1b[0m','handlePicker')
    const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
    const resultCheck = Platform.OS==='ios' ? await askLibraryPermission(Platform,Alert) : 'granted'
    // await requestStorageReadPermisson(Platform)
    // console.log('resultCheck',resultCheck, resultCheck !== 'granted' && resultCheck !== 'limited');
    
    
    if(resultCheck !== 'granted' && resultCheck !== 'limited') {
      //показывать алерт с отправкой в настройки
      Alert.alert('', "Вы не разрешили доступ к галерее", [
        {
          text: "В настройки",
          onPress: () => {
            openSettings().catch(() => console.warn('cannot open settings'))
          },
        },
        {
          text: "Закрыть",
          onPress: () => null,
        },
      ])
      return
    }
    
    try {

      const res = await launchImageLibrary({mediaType:'mixed',quality: 0.3,videoQuality: 'low',assetRepresentationMode: 'current'})
      if ( res?.didCancel ) {
        setUploadProgress(false)
        return
      }
      
      // console.log('res assets[0]', res.assets[0])
      // !! Проверка размера файла
      if(res.assets[0].fileSize > 50000000) {
        Alert.alert('', "Размер файла не должен привышать 50Mб ", [

          {
            text: "Закрыть",
            onPress: () => null,
          },
        ])
        setUploadProgress(false)
        return
      }
      let typeFile = res.assets[0].type.split('/').shift();
      console.log('typeFile', typeFile)
      let comperssRes = res.assets[0].uri
      if(typeFile === 'video') {

         comperssRes = await Video.compress(
            res.assets[0].uri,
            { 
              compressionMethod: 'auto', // default is 'manual'
              // minimumFileSizeForCompress: 4048,
              // bitrate: bitrate,
            },
        )
      } else if(typeFile === 'image') {
        comperssRes = await Image.compress(
            res.assets[0].uri,
            { 
              compressionMethod: 'manual', // default is 'manual'
              // maxWidth: 1000,
              // quality: 0.8,
              // minimumFileSizeForCompress: 4048,
              // bitrate: bitrate,
            },
        )
      }

      const objToUpload = {
        uri: comperssRes,
        name: res.assets[0].fileName,
        type: res.assets[0].type
      }
      //await getUrlUploadImage(res.fileCopyUri)
      console.log('objToUpload', objToUpload,'uri,name,type')

      //!! загрузка файла
      const controller = new AbortController();
      setAbortController(controller)
      // const timeoutId = setTimeout(() => {
      //   controller.abort(); // прерываем загрузку
      // }, 60000); // например, через 30 секунд
      // clearTimeout(timeoutId);
      let fileUri = await uploadChatsMedia(objToUpload,typeFile === 'video' ? "video[]":"image[]",controller.signal)
      // "image[]" - type
      // "video[]" - type
      //await uploadFile(res.assets[0].uri,uid,setProcessing)
      // clearTimeout(timeoutId);
      if(!fileUri.success) {
          setUploadProgress(false)
          alert(`Ошибка загрузки файла: ${fileUri.error}` );
        }
      
      console.log('\x1b[91m fileUri \x1b[0m', fileUri)
      
      let objSend = {
        size: res.assets[0].fileSize,
        url: fileUri.data[0],
        file_type: typeFile,
        name: res.assets[0].fileName,
        text: res.assets[0].fileName
      }
      //!! если видео - делать превью и тоже заливать
      // if(videoTypes.includes(typeFile)) {
      //   let resTumb = await createVideoThumbnail(res.assets[0].uri);
      //   let fileUriTumb = await uploadFile(resTumb.path,uid,setProcessing)
      //   console.log('\x1b[91m resTumb & fileUriTumb \x1b[0m', resTumb,fileUriTumb)
      //   objSend.thumbnail = fileUriTumb
      // }
        
      console.log('objSend', objSend)

      onSend([objSend]);
      setUploadProgress(false)
      setAbortController(null);
      // await clearCache()

    } catch (err) {
      //For Unknown Error
      setUploadProgress(false)
      setAbortController(null);
      // clearTimeout(timeoutId);
      // setProcessing(0)
      // await clearCache()
      alert('Ошибка отправки медиа: ' + err?.message);
      // throw err;
    }
  };

  
  return (
    <Actions
      {...props}
      options={{
        ["Галерея"]: () => handlePicker(),
        ["Файлы"]: () => selectFile(),
        ["Закрыть"]: () => {}
      }}
      icon={() => (
        <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center',width: 40, height: 40}}>
          
            <Icon
              name={'attachment'}
              size={18}
              color={THEME.PRIMARY}
              style={{right:0, bottom:0}}
            />
        </View>
      )}
      onSend={onSend}
      // onSend={()=>{}}
      wrapperStyle={{padding: 5, backgroundColor: 'red'}}
      // iconTextStyle={{color:'red'}}
      containerStyle={{position: 'absolute', right: 110, backgroundColor: 'transparent', zIndex: 2, bottom: -6, width: 40, height: 40}}
      // {position: 'absolute', right: 122, backgroundColor: 'green', zIndex: 2, bottom: 7, }

    />
  )
};

  // const handlePicker = async(flag) => {
  //   console.log('\x1b[96m61\x1b[0m','handlePicker')
  //   const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
  //   const resultCheck = Platform.OS==='ios' ? await askLibraryPermission(Platform,Alert) : await requestStorageReadPermisson(Platform)
  //   // await requestStorageReadPermisson(Platform)
  //   // 'granted'
  //   console.log('resultCheck',resultCheck, resultCheck !== 'granted' || resultCheck !== 'limited');
    
    
  //   if(resultCheck !== 'granted' || resultCheck !== 'limited') {
  //     //показывать алерт с отправкой в настройки
  //     Alert.alert('', "Вы не разрешили доступ к галерее", [
  //       {
  //         text: "В настройки",
  //         onPress: () => {
  //           openSettings().catch(() => console.warn('cannot open settings'))
  //         },
  //       },
  //       {
  //         text: "Закрыть",
  //         onPress: () => null,
  //       },
  //     ])
  //     return
  //   }
    
  //   try {      
  //     setUploadProgress(true)
  //     if( Platform.OS === 'android') {

  //       await DocumentPicker.pickSingle({
  //         copyTo: 'cachesDirectory',
  //         type: [
  //           DocumentPicker.types.images,
  //           DocumentPicker.types.video,
  //         ],
  //       }).then(async (res) => {
  //         console.log('res', res)
        
  //       // !! Проверка размера файла
  //       if(res.size > 50000000) {
  //         Alert.alert('', "Размер файла не должен привышать 50Mб ", [
    
  //           {
  //             text: "Закрыть",
  //             onPress: () => null,
  //           },
  //         ])
  //         return
  //       }
  //       let typeFile = res.type.split('/').pop();
  //       console.log('typeFile', typeFile)
    
  //       //!! загрузка файла
  //       let fileUri = await uploadFile(res.fileCopyUri,uid,setProcessing)
  //       console.log('\x1b[91m fileUri \x1b[0m', fileUri)
        
  //       let objSend = {
  //         size: res.size,
  //         uri: fileUri,
  //         file_type: typeFile,
  //         name: res.name,
  //         text: res.name,
  //       }
  //       //!! если видео - делать превью и тоже заливать
  //         if(videoTypes.includes(typeFile)) {
  //           let resTumb = await createVideoThumbnail(res.fileCopyUri);
  //           let fileUriTumb = await uploadFile(resTumb.path,uid,setProcessing)
  //           console.log('\x1b[91m resTumb & fileUriTumb \x1b[0m', resTumb,fileUriTumb)
  //           objSend.thumbnail = fileUriTumb
  //         }
          
  //         console.log('objSend', objSend)
    
  //         // onSend(objSend);
  //         await clearCache()
  //       }) 
  //       if ( DocumentPicker.isCancel()) {
  //         setUploadProgress(false)
  //         return
  //       };
  //     } else {

  //       const res = await launchImageLibrary({mediaType:'mixed',quality: 0.3,videoQuality: 'low',})
  //       if ( res?.didCancel ) {
  //         return
  //       }
        
  //       console.log('res assets[0]', res.assets[0])
  //       // !! Проверка размера файла
  //       if(res.assets[0].fileSize > 50000000) {
  //         Alert.alert('', "Размер файла не должен привышать 50Mб ", [

  //           {
  //             text: "Закрыть",
  //             onPress: () => null,
  //           },
  //         ])
  //         return
  //       }
  //       let typeFile = res.assets[0].type.split('/').pop();
  //       console.log('typeFile', typeFile)

  //       //!! загрузка файла
  //       let fileUri = await uploadFile(res.assets[0].uri,uid,setProcessing)
  //       console.log('\x1b[91m fileUri \x1b[0m', fileUri)
        
  //       let objSend = {
  //         size: res.assets[0].fileSize,
  //         uri: fileUri,
  //         file_type: typeFile,
  //         name: res.assets[0].fileName,
  //         text: res.assets[0].fileName,
  //       }
  //       //!! если видео - делать превью и тоже заливать
  //       if(videoTypes.includes(typeFile)) {
  //         let resTumb = await createVideoThumbnail(res.assets[0].uri);
  //         let fileUriTumb = await uploadFile(resTumb.path,uid,setProcessing)
  //         console.log('\x1b[91m resTumb & fileUriTumb \x1b[0m', resTumb,fileUriTumb)
  //         objSend.thumbnail = fileUriTumb
  //       }
        
  //       console.log('objSend', objSend)

  //       // onSend(objSend);
  //       await clearCache()
  //     }
  //   } catch (err) {
  //     //For Unknown Error
  //     setUploadProgress(false)
  //     setProcessing(0)
  //     await clearCache()
  //     alert('Unknown Error: ' + err.message);
  //     throw err;
  //   }
  // };


  //click
  // let selectFileCL = async () => {
  //   //Opening Document Picker to select one file
    
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       //Provide which type of file you want user to pick
  //       // type: [types.pdf,types.doc,types.docx,types.xls,types.xlsx,types.images,types.video],
  //       type: [DocumentPicker.types.allFiles, DocumentPicker.types.images, DocumentPicker.types.video],
  //       //There can me more options as well
  //       // DocumentPicker.types.allFiles
  //       // DocumentPicker.types.images
  //       // DocumentPicker.types.plainText
  //       // DocumentPicker.types.audio
  //       // DocumentPicker.types.pdf
  //     });
  //     // {"fileCopyUri":null,"size":13264,"name":"dummy.pdf","type":"application/pdf","uri":"content://com.android.providers.downloads.documents/document/msf%3A1000000039"}
  //     setIsLoading(true)
  //     let typeMedia = res.type.split("/")
  //     console.log('typeMedia', typeMedia)
  //     let assetUri //res.assets[0].uri
  //     if('image' === typeMedia[0] || imageTypes.includes(typeMedia.type)) {
  //       assetUri = await Image.compress(res.uri);
  //       //  = await getImageMetaData(compressResultUri);
  //       console.log('image assetUri', assetUri)

  //     } else if ('video' === typeMedia[0] || videoTypes.includes(typeMedia.type)) {
  //       assetUri = await Video.compress(
  //         res.uri,
  //         { 
  //           compressionMethod: 'auto', // default is 'manual'
  //           maxSize: 1920,
  //           // minimumFileSizeForCompress: 4048,
  //           // bitrate: bitrate,
  //         },
  //       )
  //       // assetUri= await getVideoMetaData(assetUri)
  //       // console.log('video assetUri', assetUri)
  //     } else {
  //       assetUri = res?.uri
  //     }

  //     let typeFile = res.name.slice(res.name.lastIndexOf('.') + 1)
  //     console.log('typeFile', typeFile)
  //     //Printing the log realted to the file
  //     console.log('res : ' + JSON.stringify(res));
  //     try {
  //       const fileData = await sendFile(res,'doc',assetUri)
  
  //       console.log('\x1b[91m fileData \x1b[0m', fileData)
  
  //       if(fileData?.code == 500 || fileData.status == 500) return Alert.alert('', t("errfileupload"), [
  //         {
  //           text: t("ok"),
  //           onPress: () => null,
  //         },
  //       ]) 
        
  //       const fileUri = `${SERVERURL}${fileData?.path}`
  //       console.log('\x1b[91m fileUri \x1b[0m', fileUri)
        
  //       onSend({ size: res.size, uri: fileUri, file_type: typeFile, name: res.name, text: fileData.name });
  //     } catch (error) {
  //       Alert.alert('', t("errfileupload"), [
  //         {
  //           text: t("ok"),
  //           onPress: () => null,
  //         },
  //       ])
  //       return;
  //     }
  //     setIsLoading(false)
  //   } catch (err) {
  //     if ( DocumentPicker.isCancel(err) ) return; //If user canceled the document selection
  //     setIsLoading(false)
  //     //For Unknown Error
  //     alert('Unknown Error: ' + err.message);
  //     throw err;
  //   }
  // };



//selectFile old
      // await DocumentPicker.pickSingle({
      //   copyTo: 'cachesDirectory',
      //   type: [
      //     DocumentPicker.types.csv,
      //     DocumentPicker.types.doc,
      //     DocumentPicker.types.docx,
      //     DocumentPicker.types.pdf,
      //     DocumentPicker.types.plainText,
      //     DocumentPicker.types.ppt,
      //     DocumentPicker.types.pptx,
      //     DocumentPicker.types.xls,
      //     DocumentPicker.types.xlsx,
      //     DocumentPicker.types.zip
      //    ],
      // }).then(async (res) => {
      //   console.log('DocumentPicker.pickSingle', DocumentPicker.pickSingle)
      //   // !! Проверка размера файла
      //   // if(res.size > 50000000) {
      //   //   Alert.alert('', "Размер файла не должен привышать 50Mб ", [

      //   //     {
      //   //       text: "Закрыть",
      //   //       onPress: () => null,
      //   //     },
      //   //   ])
      //   //   setUploadProgress(false)
      //   //   return
      //   // }
      //   // let typeFile = res.type.split('/').shift();
      //   // console.log('typeFile', typeFile)
        
      //   // const objToUpload = {
      //   //   uri: res.uri,
      //   //   name: res.name,
      //   //   type: typeFile
      //   // }
      //   // // const objToUpload = await getUrlUploadImage(res.fileCopyUri)
      //   // console.log('objToUpload', objToUpload,'uri,name,type')
      //   // //!! загрузка файла

      //   // let fileUri = await uploadChatsMedia(objToUpload,"doc[]")
      //   // console.log('\x1b[91m fileUri \x1b[0m', fileUri)
        
      //   // if(fileUri == null) {
      //   //   setUploadProgress(false)
      //   //   alert('Ошибка загрузки файла' );
      //   // }
      //   // let objSend = {
      //   //   size: res.size,
      //   //   url: fileUri[0],
      //   //   file_type: typeFile,
      //   //   name: res.name,
      //   //   text: res.name,
      //   // }      
      //   // console.log('objSend', objSend)
      //   // onSend([objSend]);
      // }).catch(err => {
      //   setUploadProgress(false)
      //   alert('DocumentPicker' + err)
      // })
      // console.log('res', res)
      // if ( DocumentPicker.isCancel()) {
      //   setUploadProgress(false)
      //   return
      // };




    //Opening Document Picker to select one file
    // const resultCheck = await requestStoragePermisson(Platform,Alert)
    // const resultCheck = await requestStorageReadPermisson(Platform,Alert)
    // const resultCheck = await PermissionsAndroid.request('android.permission.READ_EXTERNAL_STORAGE')
    // const resultCheck = await requestCameraPermisson()
    // console.log('resultCheck', resultCheck)
    // if(resultCheck !== 'granted') {
    //   //показывать алерт с отправкой в настройки
    //   Alert.alert('', "Вы не разрешили доступ к харнилищу", [
    //     {
    //       text: "В настройки",
    //       onPress: () => {
            
    //         openSettings().catch(() => console.warn('cannot open settings'))
    //       },
    //     },
    //     {
    //       text: "Закрыть",
    //       onPress: () => null,
    //     },
    //   ])
    //   return
    // }