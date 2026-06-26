import React, { useRef } from 'react';
import { StatusBar, View, Image, StyleSheet } from 'react-native';

//packages
import Carousel from "pinar";

//functions && features && slice
import { height, width } from '../util/helperConst';

//components

//styles
import { THEME, mainstyles } from '../theme';
import ImageComponentGesture from './ImageComponentGesture';
import { normalize } from '../util/UI/fontsUI';


export const CarouselImagesView = (props) => {

  const {imageState, safeInsets,setIndex} = props
  // console.log('CarouselImages', imageState)
  // const width = Dimensions.get('window').width;
  // const height = Dimensions.get("window").height
  const carousel = useRef(null)

  return (
    <View style={[styles.container,{paddingTop: safeInsets?.top}]}>
      <StatusBar barStyle='dark-content' transluent={true} backgroundColor={'transparent'}/>
      <Carousel
        ref={carousel}
        mergeStyles={true}
        loop={false}
        showsControls={false}
        showsDots
        autoPlay={false}
        onIndexChanged={(index) => { setIndex(index?.index)}}
        // dotsContainerStyle={{backgroundColor: 'red'}}
        activeDotStyle={{
          backgroundColor: THEME.GREY300
        }}
        dotStyle={{
          backgroundColor: THEME.GREY500
          
        }}        
      >
          {
            imageState&&imageState.map((item,index)=>(
              
              <ImageComponentGesture key={index+'1a'} path={item} index={index} stylesImage={{width: '96%', height: height < 700 ? '95%': '100%',}} safeInsets={safeInsets}/>
              ))
            }
        </Carousel>
    </View>
  )
}
// <View style={{backgroundColor: 'transparent',alignItems: 'center',justifyContent:'center' }} key={index+'yu'}>
  // {/* <Image source={{uri: item}} style={{width: '95%', height: height < 700 ? '90%': '100%',}} resizeMode='contain'/> */}
// </View>

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a3c9a8"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#84b59f"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#69a297"
  },
  text: {
    color: "#1f2d3d",
    opacity: 0.7,
    fontSize: normalize(48),
    fontWeight: "bold"
  },
  container: {
    // flex: 1,
    position: 'relative',
    // backgroundColor: 'red',
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  imageContainer: {
    // backgroundColor: 'green',
    flex: 1.1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
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
});