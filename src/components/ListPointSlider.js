import React,{ useState, useEffect,useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, FlatList, Pressable, Platform,Animated, TouchableWithoutFeedback, } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel,{Pagination} from 'react-native-reanimated-carousel';
import { LogBox } from 'react-native';
import PinSvg from './PinSvg';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

//functions && features && slice
import IconPinSmallOt from './Svg/IconPinSmallOt';
import IconPinSmallFill from './Svg/IconPinSmallFill';
import { HeaderTitleComponent } from './Headers/HeaderTitleComponent';
import { TenderMapDriver } from './MapComponents/TenderMapDriver';
import { StartCarouselPoints } from './CarouselPoints/StartCarouselPoints';
import { EndCarouselPoints } from './CarouselPoints/EndCarouselPoints';
import { RouteCarouselPoints } from './CarouselPoints/RouteCarouselPoints';
import { CarouselImages } from './CarouselImages';

//components
import { height, width } from '../util/helperConst';

//styles
import { THEME, mainstyles } from '../theme';
import { CarouselImagesView } from './CarouselImagesView';
import { requestStoragePermisson } from '../util/permissions';
import LinearGradient from 'react-native-linear-gradient';
import { DefaultBtn } from './Buttons/DefaultBtn';
import { normalize } from '../util/UI/fontsUI';


const ListPointSlider = (props) => {
  const {
    data,
    mapViewRef,
    isRoutes,
    setEnScr,
    // coordinates,
    // coordinatesFrom,
    // coordinatesTo,
    onClose,
  } = props

  // console.log('ListPointSlider props', data)
  // console.log('ListPointSlider height', height)
  
  const carousel = useRef();
  const carouselImages = useRef();
  const safeInsets = useSafeAreaInsets();
  const [anim] = useState(new Animated.Value(0));
  // const [dataCarousel, setDataCarousel] = useState([
  //   { address: 'address point',description: 'qwe qweqw qweqwe qwe qwe qweqw qweqwe qwe qwe qweqw qweq',
  //   price: 25, weight: 30, volume:2},
  //   { address: 'address point',description: '',price: 21, weight: 2, volume:21},
  //   { address: 'address point',description: 'qwe qwqweqwe we qweqwe qqwe qwe',price: 1251, weight: '', volume:''},
  //   { address: 'address point',description: 'qwe qweqqwrww w qweqwe qwe',price: 489, weight: 30, volume:''},
  //   { address: 'address point',description: 'qqwwe wq qwrweree qweqrwe e qwe',price: 678, weight: '', volume:12},
  //   { address: 'address point',description: '',price: 41, weight: 44, volume:2},
  //   { address: 'address point',description: 'qfdhwe qw qweeqwerrw qweqwe qwe',price: 1, weight: 1, volume:2},
  // ])
  const [currIndex, setCurrIndex] = useState(0)
  const [initialDataPoints, setInitialDatapoints] = useState([])
  const [dataPoints, setDatapoints] = useState([])
  console.log('\x1b[41m%s %s\x1b[0m', 'dataPoints :', dataPoints.length );
  const [activeTab, setActiveTab] = useState({
    start: true,
    end: true
  })
  const [currentItem, setCurrentItem] = useState()
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [isShowCarousel, setIsShowCarousel] = useState(false)
  const [imageState, setImageState] = useState([])
  const [currIndexImag, setCurrIndexImag] = useState(0)
  const [disableDownload, setDisableDownload] = useState(false)
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isDownloadSucceed, setIsDownloadSucceed ] = useState(false);
  const [downloadedUrl, setDownloadedUrl ] = useState([]);

  const customHeight = 250//isRoutes ? height/4.3 : (height < 700 ? height-height/3.5 : height-height/2.5)
  // const customHeight = isRoutes ? height/4.3 : (height < 700 ? height-height/2.6 : 21+35+52+15+39+20+102+50)
  // 21+35+52+15+39+20+102
  const top = safeInsets?.top+10
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, top] // Начальное значение и значение после анимации
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1] // Начальное значение и значение после анимации
  });
  
  const animateIn = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500, // Продолжительность анимации
      useNativeDriver: true
    }).start();
  };

  const animateOut = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 600, // Продолжительность анимации
      useNativeDriver: true
    }).start();
  };

  const handleOnOpenFile = async (uri) =>{
    console.log('handleOnOpenFile uri', uri)
    await FileViewer.open(uri) // absolute-path-to-my-local-file.
    .then(() => {
      // success
      console.log('success', )
      setIsDownloadSucceed(false)
    })
    .catch((error) => {
      // error
      console.log('handleOnOpenFile error', error)
    });
  }

  const handleOpenCaruselImages = (images) => {
    // console.log('images', images)
    setImageState(images)
    // setEnScr(false)
  }

  const handleCloseSettings = () => {
    setIsShowCarousel(false)
    setCurrIndexImag(0)
    setImageState([])
    // setEnScr(true)
  }

  const handleChangeList = (flag) => {
    console.log('activeTab', activeTab)
    if(flag==='start') {

      if(activeTab.start === true&&activeTab.end===true) {
        setActiveTab({...activeTab,start: false})
        let newArr = initialDataPoints.filter((item,index)=>{
          return item.type==='end'
        })
        // console.log('1 newArr', newArr.length)
        setDatapoints(newArr)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(newArr[0])

      } else if(activeTab.start===false&&activeTab.end===true) {
        setActiveTab({...activeTab,start: true})
        setDatapoints(initialDataPoints)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(initialDataPoints[0])
        console.log('2 initialDataPoints', initialDataPoints)
      } else if(activeTab.start===true&&activeTab.end===false) {
        return
      } 
    } else {
      if(activeTab.start === true&&activeTab.end===true) {
        setActiveTab({...activeTab,end: false})
        let newArr = initialDataPoints.filter((item,index)=>{
          return item.type==='start'
        })
        setDatapoints(newArr)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(newArr[0])
        console.log('3 newArr', newArr)
      } else if(activeTab.start===true&&activeTab.end===false) {
        setActiveTab({...activeTab,end: true})
        setDatapoints(initialDataPoints)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(initialDataPoints[0])
        console.log('4 initialDataPoints', initialDataPoints)
      } 
      // else if(activeTab.start===false&&activeTab.end===true) {
      //   console.log('5', initialDataPoints)
      //   return
      // }
    }
    carousel?.current.scrollTo({ index: 0 })
  }

  const changeDataPointsStructure = (data) => {
    // let newArr = []
    let start = data.startPoints.map((item, index)=> {
      // console.log('item', item) 
      let newItem = {...item, type: 'start'}
      // item.type='start'
      // return item
      return newItem
    })
    // console.log('start', start[0].type)
    let end = data.endPoints.map((item, index)=> {
      // console.log('item', item) 
      let newItem = {...item, type: 'end'}
      // item.type='end'
      // return item
      return newItem
    })
    let newArr = start.concat(end)
    // console.log('newArr', newArr)
    setInitialDatapoints(newArr)
    setDatapoints(newArr)
    setCurrentItem(newArr[0])
  }

  const handlePressDot = (index,item)=> {
    // console.log('handlePressDot', index,item)
    setCurrIndex(index)
    setCurrentItem(item)
    // console.log('dt dp item', index,item.address)
    carousel?.current.scrollTo({ index: index })
  }

  const renderItemCarousel = ({ item, index }) => {
    // console.log('renderItemCarousel index', index)
    let isShowElem = true
    let dots = true
    if (dataPoints.length > 7) {

          if(currIndex < 6) {
            if(index >= 7  ) {
              // console.log('2 index', index, 'currIndex', currIndex,)
              isShowElem = false
            }
          } else if(currIndex === 6) {
            if (index < 5 && currIndex - 3 === index ) {
              dots = false
            } else if(index < 5 && index <= currIndex - 3 ) {
              // console.log('2 index', index, 'currIndex', currIndex,)
              isShowElem = false
            } else if( index > 5 && currIndex + 2 < index){
              // console.log('4 index', index, 'currIndex', currIndex,)
              dots = false
            }
          } else if (currIndex === 7) {
            if (index < 5 && currIndex - 4 === index ) {
              dots = false
            } else if(index < 5 && index <= currIndex - 4 ) {
              // console.log('2 index', index, 'currIndex', currIndex,)
              isShowElem = false
            } else if( index > 5 && currIndex + 2 < index){
              // console.log('4 index', index, 'currIndex', currIndex,)
              dots = false
            }
          } else if (currIndex === 8) {
            if (index < 5 && currIndex - 5 === index ) {
              dots = false
            } else if(index < 5 && index <= currIndex - 5 ) {
              // console.log('2 index', index, 'currIndex', currIndex,)
              isShowElem = false
            }
            //  else if( index > 5 && currIndex + 2 < index){
            //   // console.log('4 index', index, 'currIndex', currIndex,)
            //   dots = false
            // }
          } else if (currIndex === 9) {
            if (index < 5 && currIndex - 6 === index ) {
              // console.log('1 currIndex === 9 index', index, )
              dots = false
            } else if(index < 5 && index <= currIndex - 6 ) {
              // console.log('2 currIndex === 9 index', index, )
              isShowElem = false
            }
            //  else if( index > 5 && currIndex + 2 < index){
            //   // console.log('4 index', index, 'currIndex', currIndex,)
            //   dots = false
            // }
          }
    }
  
    if(isShowElem === false) {
      return null
    } else {

      return (
        <TouchableOpacity
          onPress={() => {
            handlePressDot(index, item);
          }}
          style={[
            styles.dotBtn,
            mainstyles.alCjcC,
            { borderColor: currIndex === index ? THEME.PRIMARY : "#fff" },
          ]}
        >
          {
            dots === true ?
            // <View style={[{position: 'relative', width: 27, height: 27}]}>

            // </View>
              <PinSvg type={item?.type} indexPin={index} color={'red'} 
              children={(<Text style={[{alignSelf: 'center',paddingTop: 1}, mainstyles.text14M, { color: item?.type === 'end' ? "#fff" : THEME.PRIMARY }]}>
                {index + 1}
              </Text>)} />
            :<Text style={[mainstyles.text14M, { color: currIndex === index ? "#fff" : THEME.PRIMARY }]}>
              ...
            </Text>

          }
        </TouchableOpacity>
      )
    }
    
  };

  const renderItemCarouselDots = ({item,index}) => {
    // console.log('renderItemCarouselDots', item,index)
    return (<View
    style={[styles.dotBtnSmall,mainstyles.alCjcC, {backgroundColor: currIndex === index ? THEME.GREY500 : THEME.GREY300 }]}>
     {/* <Text style={[mainstyles.text14M,{color: currIndex === index ?'#fff' : THEME.PRIMARY }]}>{index+1}</Text> */}
   </View>)
  }

  const handleDownloadFile = async (fileData) => {
    console.log('fileData', fileData)
    let status = await requestStoragePermisson(Platform)
    console.log('status', status)
    setDisableDownload(true)

    try {
      // if(status === 'granted') {      
        
      // }
      const parts = fileData.split("/");
      let filenameWithExtension = parts[parts.length - 1];
      // Удаляем часть запроса после имени файла
      filenameWithExtension = filenameWithExtension.split("?")[0];
      console.log('filenameWithExtension', filenameWithExtension)
  
      // Удаляем префикс "image/"
      filenameWithExtension = decodeURIComponent(filenameWithExtension).replace("images/", "")
      let path = Date.now()+filenameWithExtension
      console.log(path);
  
      //ios  LibraryDirectoryPath (String) The absolute path to the NSLibraryDirectory (iOS only) //или DocumentDirectoryPath 
      //android DownloadDirectoryPath
      const localFile =  Platform.OS==='android' ? `${RNFS.DownloadDirectoryPath}/${path}` : `${RNFS.DocumentDirectoryPath}/${path}`
      console.log('localFile', localFile)
      // Download the file
      await RNFS.downloadFile({
        fromUrl: fileData,
        toFile: localFile,
        progressInterval: 100,
        progressDivider: 10,
        connectionTimeout: 60 * 1000,
        readTimeout: 120 * 1000,
        begin: (res) => { 
          console.log('begin :- ', res);
       },
       progress: (res) => {
          console.log('res :- ', res);
          
          let percentage = (res.bytesWritten * 100) / res.contentLength;
          percentage = Math.round(percentage);
          console.log('percentage', percentage)
          setProgress(percentage);
      },
      }).promise.then((res) => {
        console.log('res', res)
        setProgress(0)
        // setProgressStatus('Файл скачан')
        setDownloadedUrl([localFile,path])
        setIsDownloadSucceed(true)
        setDisableDownload(false)
        setTimeout(()=>{
          setIsDownloadSucceed(false)
        },5000)
        // Open the file
      }).catch((error) => {
        setProgress(0)
        setProgressStatus('Ошибка загрузки')
        setDisableDownload(false)
        setTimeout(()=>{
          setProgressStatus('')
        },3000)
        console.error('Download error', error);
      });
      
    } catch (error) {
      console.error('Download error trycatch', error);
      setProgress(0)
      setDisableDownload(false)
      setProgressStatus('')
      alert('Ошибка загрузки. Попробуйте позже')
    }
  }

  useEffect(()=>{
    // console.log('useEffect changeDataPointsStructure data', data)
    if(data!==null&&data!==undefined) {
      changeDataPointsStructure(data)
    }
  },[data])
  
  useEffect(()=>{
    // console.log('useEffect imageState ', imageState)
    if(imageState!==null&&imageState!==undefined&&imageState.length> 0) {
      setIsShowCarousel(true)
    }
  },[imageState])

  useEffect(() => {
    //заявка контент
    const onTenderState = () => {
      const tenderData = data
      // console.log('LPS tenderData \n', tenderData);

      const coordsFrom = tenderData.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = tenderData.endPoints.map((item,index)=>{return item.coords})
      setCoordinatesFrom(coordsFrom)
      setCoordinatesTo(coordsTo)
      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)
      
      //координаты в один массив
      const coordsRoute = coordsFrom.concat(coordsTo)
      // console.log('onCreateRoutePoints coordsRoute: ', coordsRoute);
      setCoordinates(coordsRoute)
    }  
    onTenderState()
  },[data])

  useEffect(() => {
    if (isDownloadSucceed) {
      animateIn();
    } else {
      animateOut();
    }
  }, [isDownloadSucceed]);

  useEffect(() => {
    // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    console.log('\x1b[42m%s %s\x1b[0m', 'dataPoints&&item&index :', dataPoints, currentItem?.address,  currIndex);
  }, [dataPoints,currentItem,currIndex])

  // useEffect(() => {
  //   setTimeout(()=>{
  //     setIsDownloadSucceed(false)
  //   },2000)
  // }, [])
  
  // console.log('currentItem', currentItem?.address)
  // console.log('currind', currIndex)

  return ( 
    
      <>
      {
        !isShowCarousel ?
        <ScrollView 
        // style={[styles.container,{minHeight: height+safeInsets.top}]}
        >
          <View style={{position: 'absolute',top: 0, width: '100%',zIndex: 997,paddingTop: safeInsets.top}}>
            <HeaderTitleComponent title={'Точки маршрута'} onPress={onClose} customStyle={{paddingTop:0,paddingHorizontal:10}} 
            colors={['rgba(255,255,255,0)','rgba(255,255,255,0)']}
            // colors={['red','red']}
            />
          </View>
          <TenderMapDriver 
            mapViewRef={mapViewRef} 
            customStyles={{height:height/2.2}} 
            cusStMap={{ minHeight: height/2.2}}
            topBtnPosition={safeInsets.top+40}
            coordinatesArr={coordinates}
            coordinatesFrom={coordinatesFrom}
            coordinatesTo={coordinatesTo}
            isRouteVisible={true}
            currIndex={currIndex}
          />
                
          <View style={[]}>
            <View style={[mainstyles.rowalCjcC,mainstyles.pV10,{paddingHorizontal: 15}]}>
              <TouchableOpacity
              onPress={()=>handleChangeList('start')} 
              style={[mainstyles.rowalCjcC,styles.btnPoints,styles.btnLeft,{borderColor: activeTab.start===true? THEME.PRIMARY:THEME.GREY400}]}>
                <IconPinSmallOt />
                <Text style={[mainstyles.text16R,styles.textBtn]}>Загрузки</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={()=>handleChangeList('end')} 
              style={[mainstyles.rowalCjcC,styles.btnPoints,styles.btnRight,{borderColor: activeTab.end===true? THEME.PRIMARY:THEME.GREY400}]}>
                <IconPinSmallFill/>
                <Text style={[mainstyles.text16R,styles.textBtn]}>Разгрузки</Text>
              </TouchableOpacity>
            </View>
            <View style={[mainstyles.rowalC,{paddingTop:5, paddingBottom:10, paddingHorizontal: 15}]}>
              {
                currentItem && currentItem?.type === 'end'?
                <Text style={[mainstyles.text16B,{color: THEME.GREY900,width: 90,}]}>Разгрузка:</Text>
                :<Text style={[mainstyles.text16B,{color: THEME.GREY900,width: 90}]}>Загрузка:</Text>
              }
              <FlatList
                data={dataPoints}
                keyExtractor={(item, index) => index+1+'aw'}
                renderItem={(item, index)=>renderItemCarousel(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Carousel
              ref={carousel}
              loop={false}
              defaultIndex={currIndex}
              width={width}
              height={customHeight}
              autoPlay={false}
              data={dataPoints}
              // data={dataCarousel}
              // vertical={true}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
              // onProgressChange={currIndex}
              style={{width: '100%',backgroundColor: 'transparent'}}
              onSnapToItem={(index,item) => {setCurrIndex(index),setCurrentItem(dataPoints[index])}}
              renderItem={({ item, index }) => (
                <View style={{backgroundColor: 'transparent'}}>
                  {/* <Text>{item?.type}</Text> */}
                {
                  isRoutes === true ?
                  <>
                    <RouteCarouselPoints type={item?.type} item={item}/>
                  </>
                  :
                  <>
                    {
                      item?.type==='start'?
                      <>
                        <StartCarouselPoints item={item} onPress={handleOpenCaruselImages} />
                      </>
                      :
                      <EndCarouselPoints item={item}/>
                    }
                  </>
                }
                </View>

              )}
              
            />
            
            <View style={[{alignItems: 'center',marginBottom: 25,  backgroundColor: 'transparent'}]}>
              <FlatList
                data={dataPoints}
                keyExtractor={(item, index) => index+1+'ad'}
                renderItem={(item, index)=>renderItemCarouselDots(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // scrollEnabled={true}
              />
            </View>
            {/* <Pagination.Basic
              progress={currIndex}
              data={dataPoints}
              dotStyle={{ backgroundColor: "#262626" }}
              activeDotStyle={{ backgroundColor: "#f1f1f1" }}
              containerStyle={{ gap: 5, marginBottom: 10 }}
              // onPress={onPressPagination}
            /> */}
          </View>
        </ScrollView>
        :
        <View style={[{ backgroundColor: THEME.GREY600,alignSelf: 'center', position: 'relative'}
        ]}>
          <View style={{position: 'absolute',top: 0,zIndex: 997,width: '100%'}} >
            <View style={{ paddingTop: safeInsets?.top+30, paddingHorizontal: 10,paddingBottom: 10,alignItems: 'center',width: '100%',flexDirection: 'row', justifyContent: 'space-between'}}> 
              <View style={{width: '85%',backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
                <Pressable
                  disabled={disableDownload}
                  onPress={()=>handleDownloadFile(imageState[currIndexImag])}
                  // onPress={()=>{console.log('qwe')}}
                  style={({pressed}) => [
                    {
                      backgroundColor: pressed ? 'rgba(143, 241, 17,0.4)' : 'rgba(255,255,255,0.3)',
                    },
                    {width: '30%',padding: 10,zIndex: 996, borderRadius: 4,borderWidth:1, borderColor: THEME.GREY500 }, mainstyles.alCjcC
                  ]}
                  // style={[{width: '25%',padding: 10,zIndex: 999, borderRadius: 4 }, mainstyles.alCjcC]}
                  >
                  <Text style={{color: '#fff'}}>Скачать</Text>
                </Pressable>
                <View style={{width: '70%',backgroundColor: 'transparent',paddingLeft: 15}}>
                  {
                    progress > 0 ?
                    <Text style={{color: THEME.BRIGHT_GREEN,fontSize: normalize(14)}}> Загрузка: {progress}%</Text>
                    : <Text style={{color: THEME.BRIGHT_GREEN,fontSize: normalize(14)}}>{progressStatus}</Text>
                  }
                </View>
              </View>
              <TouchableOpacity style={[styles.close,{zIndex: 996,borderWidth:1, borderColor: THEME.GREY500}]} onPress={handleCloseSettings}>
                <Icon name='cross' color={'#fff'} size={28} style={{}}/>
              </TouchableOpacity>
            </View>
          </View>
          {/* backgroundColor: 'transparent',position: 'absolute',top: safeInsets?.top,zIndex: 999, */}
          {/* <TouchableOpacity style={[styles.close,{zIndex: 998,top: safeInsets?.top}]} onPress={onClose}>
            <Icon name='cross' color={'#fff'} size={30} style={{}}/>
          </TouchableOpacity> */}
          {
            isDownloadSucceed && (
              // <View style={[{zIndex: 998,position: 'absolute',top: safeInsets?.top, backgroundColor: 'red'}]} >
              //   <Icon name='cross' color={'#fff'} size={30} style={{}}/>
              // </View>

            <TouchableWithoutFeedback >
              <Animated.View style={[
                {position: 'absolute',transform: [{ translateY }], zIndex: 998,width: '95%', padding: 15,alignSelf: 'center',opacity: opacity},
                {backgroundColor: '#fff',borderRadius: 3,},
              ]}
              // top: translateY
                // onAnimationEnd={animateOut}
              >
                <View style={[ mainstyles.rowalCjcSb]}>
                  <View style={{width: '74%'}}>
                    <Text style={[mainstyles.text14R,]}>Скачан 1 файл</Text>
                    <Text style={[mainstyles.text10R,]}>{downloadedUrl[1]}</Text>
                  </View>
                  <DefaultBtn 
                    title={"Открыть"}
                    customStyle={{height: 40, width: '25%',minWidth: null, paddingVertical: 0}}
                    color='#fff'
                    onPress={()=>handleOnOpenFile(downloadedUrl[0])}/>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
            )
          }
          <CarouselImagesView imageState={imageState} safeInsets={safeInsets} setIndex={setCurrIndexImag}/>
        </View>
      }
      
      </>
                 
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'orange',
    position: 'relative'
  },
  btnPoints: {
    width: '50%',
    paddingVertical:6,
    paddingHorizontal: 15,
    borderColor: THEME.PRIMARY,
    borderWidth: 2,
  },
  btnLeft: {
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  btnRight: {
    borderLeftWidth:0,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30
  },
  textBtn: {
    paddingLeft: 15,
    color: THEME.GREY900
    // color: THEME.GREY900
  },
  rowItem: {
    // maxWidth: 64,
    position: 'relative',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    borderRadius: 10,
    height: width/4,
    width:  width/4-15,
  },
  //inputs
  desctWrapper: {
    marginBottom: 20
  },
  desctInput: {
    color: THEME.GREY800,
    // alignItems: 'center',
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    top: 20,
    right: 30
  },
  infoContainer: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    width: '100%',
  },
  infoInputBox: {
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
  }, 
  imgContainer: {
    width: '45%',
    // backgroundColor: 'red',
    alignItems: 'flex-start',
    paddingLeft: 10
  }, 
  inputWeight: {
    width: '55%',
    // backgroundColor: 'pink',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  tooltip: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: -7,
    zIndex: 1
  },
  tooltiptext: {
    color: '#fff',
    position: 'absolute',
    top: 0,
    left: 8,
    zIndex: 2
  },
  inputPrice: {
    width: '100%',
    textAlign: 'center',
    // backgroundColor: 'orange',
  },
  photoWrapper: {
    marginBottom: 20
  },
  close: {
    // position: 'absolute',
    // right: 20,
    // top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  dotBtn: {
    backgroundColor: '#fff',
    width: 35,
    height: 35,
    borderRadius: 30,
    borderWidth:1 ,
    borderColor: THEME.PRIMARY,
    marginHorizontal: 3

  },
  dotBtnSmall: {
    backgroundColor: THEME.GREY400,
    width: 10,
    height: 10,
    borderRadius: 30,
    marginHorizontal: 4
  },


  //!!!!!!
})
export default ListPointSlider