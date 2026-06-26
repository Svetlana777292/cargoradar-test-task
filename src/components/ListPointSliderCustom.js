import React,{ useState, useEffect,useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Carousel from 'react-native-reanimated-carousel';
import Carousel from "pinar";
import { LogBox } from 'react-native';
import PinSvg from './PinSvg';

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


const ListPointSliderCustom = (props) => {
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

  const customHeight = isRoutes ? height/4.3 : (height < 700 ? height-height/2.6 : height-height/2.4)
  
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
    if(flag==='start') {

      if(activeTab.start === true&&activeTab.end===true) {
        setActiveTab({...activeTab,start: false})
        let newArr = initialDataPoints.filter((item,index)=>{
          return item.type==='end'           
        })
        // console.log('1 newArr', newArr)
        setDatapoints(newArr)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(newArr[0])
      } else if(activeTab.start===false&&activeTab.end===true) {
        setActiveTab({...activeTab,start: true})
        setDatapoints(initialDataPoints)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(initialDataPoints[0])
        // console.log('2 newArr', newArr)
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
        // console.log('3 newArr', newArr)
      } else if(activeTab.start===true&&activeTab.end===false) {
        setActiveTab({...activeTab,end: true})
        setDatapoints(initialDataPoints)
        currIndex!==0 ? setCurrIndex(0) :null
        setCurrentItem(initialDataPoints[0])
        // console.log('4 newArr', newArr)
      } else if(activeTab.start===false&&activeTab.end===true) {
        return
      }
    }
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
    // console.log('handlePressDot', index)
    setCurrIndex(index)
    setCurrentItem(item)
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
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])

  // console.log('currentItem', currentItem)
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
            customStyles={{height:height/2}} 
            cusStMap={{ minHeight: height/2}}
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
              mergeStyles={true}
              showsControls={false}
              showsDots
              autoPlay={false}
              onIndexChanged={(index) => {setCurrIndex(index),setCurrentItem(dataPoints[index])}}
              activeDotStyle={{
                backgroundColor: THEME.GREY300
              }}
              dotStyle={{
                backgroundColor: THEME.GREY500
              }}

              // loop={false}
              // defaultIndex={currIndex}
              // width={width}
              // // height={customHeight}
              // // height={21+35+52}
              // data={dataPoints}
              // // data={dataCarousel}
              // // vertical={true}
              // panGestureHandlerProps={{
              //   activeOffsetX: [-10, 10],
              // }}
              // style={{width: '100%',}}
              // // onSnapToItem={handlePressDot}
              // onSnapToItem={(index,item) => {setCurrIndex(index),setCurrentItem(dataPoints[index])}}
              
              // renderItem={({ item, index }) => (
              //   <>
              //   {
              //     isRoutes === true ?
              //     <>
              //       <RouteCarouselPoints type={item?.type} item={item}/>
              //     </>
              //     :
              //     <>
              //       {
              //         item?.type==='start'?
              //         <>
              //           <StartCarouselPoints item={item} onPress={handleOpenCaruselImages} />
              //         </>
              //         :
              //         <EndCarouselPoints item={item}/>
              //       }
              //     </>
              //   }
              //   </>

              // )}
              
            >
              {/* {
            imageState&&imageState.map((item,index)=>(
              <View style={{backgroundColor: 'transparent',alignItems: 'center',justifyContent:'center' }} key={index+'yu'}>

                <Image source={{uri: item}} style={{width: '95%', height: height < 700 ? '90%': '100%',}} resizeMode='contain'/>
              </View>
            ))
          } */}
            </Carousel>
            <View style={[{alignItems: 'center',marginBottom: 25,  }]}>
              <FlatList
                data={dataPoints}
                keyExtractor={(item, index) => index+1+'ad'}
                renderItem={(item, index)=>renderItemCarouselDots(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // scrollEnabled={true}
              />
            </View>

          </View>
        </ScrollView>
        :
        <View style={[{ backgroundColor: THEME.GREY600,alignSelf: 'center', justifyContent: 'center', position: 'relative', paddingTop: safeInsets?.top}
        ]}>
          <TouchableOpacity style={[styles.close,{zIndex: 998,top: safeInsets?.top}]} onPress={onClose}>
            <Icon name='cross' color={'#fff'} size={30} style={{}}/>
          </TouchableOpacity>
          <CarouselImages imageState={imageState} carouselImages={carouselImages} currIndexImag={currIndexImag} setCurrIndexImag={setCurrIndexImag} onClose={handleCloseSettings}/>
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
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    right: 15,
    top: 15,
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
export default ListPointSliderCustom