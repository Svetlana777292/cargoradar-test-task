import React, { useRef } from 'react';
import { StatusBar, View, Image, StyleSheet } from 'react-native';

//packages
import Carousel from "pinar";

//functions && features && slice
import { height, width } from '../util/helperConst';

//components

//styles
import { THEME, mainstyles } from '../theme';
import { normalize } from '../util/UI/fontsUI';


export const CarouselImages = (props) => {

  const {imageState,carouselImages,currIndexImag,setCurrIndexImag,onClose} = props
  console.log('CarouselImages', imageState)
  // const width = Dimensions.get('window').width;
  // const height = Dimensions.get("window").height
  const carousel = useRef(null)

  const handlePress = () => {
    // navigation.navigate('Auth')
    // carousel.current?.next()
    // onPress()
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


        
  // data.map((item, index)=>dots(item,index))
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' transluent={true} backgroundColor={'transparent'}/>
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
        // data={dataCarousel}
        // vertical={true}
        // style={{paddingTop: safeInsets?.top,width: '100%',backgroundColor: 'blue', }}
        onIndexChanged={(index) => { console.log('index', index)}}
        activeDotStyle={{
          backgroundColor: THEME.GREY300
        }}
        dotStyle={{
          backgroundColor: THEME.GREY500
        }}
        
        // onIndexChanged={(index) => { setCurrIndexImag(index), console.log('index', index)}}
        // renderItem={({ item, index }) => (
        //   <View style={{width: width,height: height+safeInsets.top, position: 'relative',backgroundColor: 'orange',alignItems: 'center' }}>
        //     <Text>123</Text>
        //     <TouchableOpacity style={[styles.closew,{zIndex: 998}]} onPress={handleCloseSettings}>
        //       <Icon name='cross' color={'#fff'} size={30} style={{}}/>
        //     </TouchableOpacity>
        //     <Image source={{uri: item}} style={{width: '90%', height: height,}} resizeMode='contain'/>
        //   </View>
        // )}
      >
              {/* <View style={styles.slide1}>
                <Text style={styles.text}>1</Text>
              </View>
              <View style={styles.slide2}>
                <Text style={styles.text}>2</Text>
              </View>
              <View style={styles.slide3}>
                <Text style={styles.text}>3</Text>
              </View> */}
          {
            imageState&&imageState.map((item,index)=>(
              <View style={{backgroundColor: 'transparent',alignItems: 'center',justifyContent:'center' }} key={index+'yu'}>

                <Image source={{uri: item}} style={{width: '95%', height: height < 700 ? '90%': '100%',}} resizeMode='contain'/>
              </View>
            ))
          }
        </Carousel>
    </View>
  )
}

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


{/* <Carousel
          ref={carouselImages} 
          loop={false}
          defaultIndex={currIndexImag}
          width={width}
          height={height+safeInsets.top}
          autoPlay={false}
          data={imageState}
          // data={dataCarousel}
          // vertical={true}
          style={{paddingTop: safeInsets?.top,width: '100%',backgroundColor: 'blue', }}
          onSnapToItem={(index) => { setCurrIndexImag(index)}}
          renderItem={({ item, index }) => (
            <View style={{width: width,height: height+safeInsets.top, position: 'relative',backgroundColor: 'orange',alignItems: 'center' }}>
              <Text>123</Text>
              <TouchableOpacity style={[styles.closew,{zIndex: 998}]} onPress={handleCloseSettings}>
                <Icon name='cross' color={'#fff'} size={30} style={{}}/>
              </TouchableOpacity>
              <Image source={{uri: item}} style={{width: '90%', height: height,}} resizeMode='contain'/>
            </View>
          )}
        /> */}

                  {/* <View style={[{alignItems: 'center',position: 'absolute', bottom: 30, alignSelf:'center',}]}>
            <FlatList
              data={imageState}
              keyExtractor={(item, index) => index+1+'ai'}
              renderItem={(item, index)=>renderItemCarouselDotsImg(item, index)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // scrollEnabled={true}
            />
          </View> */}