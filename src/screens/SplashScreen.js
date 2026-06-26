import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Text, View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

//packages
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
// import Carousel from "pinar";
import { SvgUri } from 'react-native-svg';

//functions && features && slice
import { setJsonDataSlider, setJsonDataSliderErr } from '../store/features/jsonInfoSlice';
import { setWelcomeCaurusel } from '../store/features/loginSlice';
import { height, jsonSlider, width } from '../util/helperConst';
import { getJsonDataSlider } from '../util/firebase';
import { SERVERURICARGO } from '../util/const';

//components
import DotsImage from '../components/Svg/DotsImage';
import { DefaultBtnWite } from '../components/Buttons/DefaultBtnWite';

//styles
import { THEME, mainstyles } from '../theme';
import { getJsonDataSliderData } from '../store/features/api/api-json';
import { SERVERURL } from '../util/apiVars';

export const SplashScreen = ({route, navigation  }) => {
  console.log('SplashScreen', )
  const width = Dimensions.get('window').width;
  const height = Dimensions.get("window").height
  const jsonDataSliderState = useSelector((state) => state.jsoninfo.jsonDataSlider)
  // [{"registered": "0", "slidebtn": "Далее", "slideimg": "/json/img/connection_lost.png", "slidetext": "Описание демо текст для слайдера 1", "slidetitle": "Слайдер 0"}, {"registered": "0", "slidebtn": "Далее", "slideimg": "/json/img/connection_lost.svg", "slidetext": "Описание демо текст для слайдера 2", "slidetitle": "Слайдер 2"}, {"registered": "0", "slidebtn": "Приступить", "slideimg": "/img/connection_lost.png", "slidetext": "Описание демо текст для слайдера 3", "slidetitle": "Слайдер 13"}]//
  const jsonDataSliderErr = useSelector((state) => state.jsoninfo.jsonDataSliderErr)
  const carousel = useRef(null)

  const [jsonDataSlider, setJsonDataSlider] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [val, setVal] = useState(0)
  const dispatch = useDispatch()

  // console.log('jsonDataSlider', jsonDataSlider)

  const handlePress = (index) => {
    // console.log('handlePress', index,)
    dispatch(setWelcomeCaurusel(false))
    if(index == jsonDataSlider?.length-1) {
      // console.log('end', index)
      dispatch(setWelcomeCaurusel(false))
    } else {
      // console.log('set next', index)
      setVal(index+1)
    }
  }


  function dots(item,index){
    // console.log('item', item,index)
    return (
      <View style={{width: 10, height: 10, borderRadius: 10, backgroundColor: index == val ? '#ffffff': 'rgba(255,255,255,0.3)',
        margin: 5
        }} key={index+'q'}>
      </View>
    )
  }

  const renderItem = (item,index) => {
  // console.log('item', item) 
    let imageurl = null//item?.slideimg != "" && item?.slideimg !=undefined ? SERVERURL+item?.slideimg.toString() : null
    // console.log('imageurl', typeof(imageurl) )
    let isSvg

    if(imageurl) {
      isSvg = item?.slideimg.split('.').pop()
    }

    return (
      <View style={[styles.carouselInner,{height:height}]}>
        <View style={styles.imageContainer}>
          { 
            imageurl ?
            <>
              {
                isSvg == 'svg' ?
                <SvgUri
                  width={'50%'}
                  height={'50%'}
                  uri={`${imageurl}`}
                  style={{alignSelf: 'center'}}
                />
              :
                <Image source={{uri: imageurl}} style={{width: '50%', height: '50%', alignSelf: 'center',aspectRatio:1.5}}/>
              }
            </> 
            : null
          }
        </View>
        <View style={styles.midContainer}>
          <Text style={[mainstyles.text28SB,{color: 'white',paddingBottom: 15,textAlign: 'center'}]}>{item?.slidetitle}</Text>
          <Text style={[mainstyles.text16R,{color: 'white',textAlign: 'center', paddingBottom: 20}]}>{item?.slidetext}</Text>
        </View>
        <View style={styles.btnWrapper}>
          <DefaultBtnWite title={item?.slidebtn} onPress={()=>handlePress(index)}/>
        </View>
      </View>
    )
  }
  const renderItemT = (item,index) => {
  console.log('item', item) 
// {"registered": "0", "slidebtn": "Далее", "slideimg": "/json/img/connection_lost.svg", "slidetext": "Описание демо текст для слайдера 2", "slidetitle": "Слайдер 2"}
    return (
      <View style={[{backgroundColor: 'blue',height:500}]}>
          <Text style={[mainstyles.text28SB,{color: 'white',paddingBottom: 15,textAlign: 'center'}]}>1231231231</Text>

          <DefaultBtnWite title={item?.slidebtn} onPress={()=>handlePress(index)}/>
      </View>
    )
  }

  const  getSlids = async () => {
    setIsLoading(true) 
    try {
      
      const res = await getJsonDataSliderData(dispatch,setJsonDataSlider,setJsonDataSliderErr)
      if(res) {
        setJsonDataSlider(res)
      } else {
        setJsonDataSlider(jsonSlider)
      }
      setIsLoading(false) 
    } catch (error) {
      setIsLoading(false) 
      alert(`SliderJson error ${error}`)
    }
  }

  useEffect(()=>{
    getSlids()
  },[])


  // useEffect(()=>{
  //   if(jsonDataSliderState?.length > 0 ) {
  //     setJsonDataSlider(jsonDataSliderState)
  //   } else {
      
  //     setJsonDataSlider(jsonSlider)
  //   }
  // },[jsonDataSliderState])

  return (
    <View style={styles.container}>
      {
        isLoading ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1, zIndex:999,backgroundColor: '#fff'}]}>
          <ActivityIndicator color='#205CBE' size='large'/>
        </View>
        :
        null
      }
      <StatusBar barStyle='dark-content' transluent={true} backgroundColor={'transparent'}/>
      <LinearGradient style={[styles.wrapper,{flex:1,height: height}]} colors={[ THEME.GR_D, THEME.GR_L]} useAngle angle={90}>
      {/* <View style={[styles.btnWrapper,{paddingTop: 30}]}>
          <DefaultBtnWite title={'qwe'} onPress={()=>handlePress()}/>
      </View> */}
      <View style={{backgroundColor: 'tran',flex:1,position: 'relative'}}>

      <Carousel
        ref={carousel}
        mergeStyles={true}
        loop={false}
        // index={currIndexImag}
        showsControls={false}
        showsDots
        // width={width}
        // height={height+safeInsets.top}
        autoPlay={false}
        // data={imageState}
        data={jsonDataSlider}
        width={width}
        height={height}
        // vertical={true}
        // style={{paddingTop: safeInsets?.top,width: '100%',backgroundColor: 'blue', }}
        onIndexChanged={(index) => { console.log('index', index)}}
        activeDotStyle={{
          backgroundColor: THEME.GREY300
        }}
        dotStyle={{
          backgroundColor: THEME.GREY500
        }}
        renderItem={({ item, index }) => renderItem(item,index)}
        >
      </Carousel>
        {/* <Carousel
          ref={carousel}
          loop={false}
          defaultIndex={0}
          width={400}
          height={500}
          autoPlay={false}
          data={jsonDataSlider}
          style={{width: '100%', height: '100%', flex: 0.8,}}
          onSnapToItem={(index) => { setVal(index)}}
          // console.log('current index:', index)
          // renderItem={({ item, index }) => renderItem(item,index)}
          // renderItem={({ item, index }) => renderItemT(item,index)}
          renderItem={() => (
            <View style={{backgroundColor: 'blue', width: 200, height:200}}>
              <Text>123</Text>
            </View>
          )}
        /> */}
      </View>
        <View style={styles.bottom}>         
          <View style={styles.dotsContainer}>
            {
              jsonDataSlider.length > 0?
                jsonDataSlider.map((item, index)=>dots(item,index))
              : null
            }
          </View>
          <View style={{position: 'absolute', bottom: 0, width: '100%', alignItems: 'center'}}>
            <DotsImage/>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor: 'red',
    height: '100%'
    // backgroundColor: THEME.LIGHTBLUE_COLOR,
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },
  bottom: {
    // backgroundColor: 'red',
    width: '100%',
    flex: 0.2,
    alignItems: 'center',
  },
  carouselInner: {
    // backgroundColor: 'pink',
    
    width: '100%',
    // justifyContent: 'center',
  },
  imageContainer: {
    // backgroundColor: 'green',
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  midContainer: {
    // backgroundColor: 'orange',
    flex: 0.8,
    width: '85%',
    alignSelf: 'center', 
    paddingBottom: 10,
  },
  btnWrapper: {
    // backgroundColor: 'grey',
    flex: 0.9,
    alignItems: 'center',
    paddingVertical: 10,
  },
  wrapper: {
    height: height,
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    width: '100%', 
    backgroundColor: 'transparent', 
    position: 'absolute',
    flexDirection: 'row', 
    justifyContent: 'center', 
    top: 10, 
    zIndex: 99,
  },
  containerBtn: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 294,
    minWidth: '45%',
    maxWidth: '100%',
    borderRadius: 23,
    paddingVertical: 10,
  },
  textBtn: {
    textAlign: 'center',
    color: 'white',
  },
});