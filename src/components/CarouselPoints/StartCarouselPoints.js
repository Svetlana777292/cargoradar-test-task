import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { THEME, mainstyles } from '../../theme';
import IconPinSmallOt from '../Svg/IconPinSmallOt';
import { width } from '../../util/helperConst';
import IconVolume from '../Svg/IconVolume';
import IconWeight from '../Svg/IconWeight';

export const StartCarouselPoints = (props) => {
  const {
    item,
    onPress    
  } = props
  // console.log('!!!!!!!!!!item', item)

  // const onLayOut = (event) => {
  //   const {x, y, height, width} = event.nativeEvent.layout;
  //   console.log('!!!! onLayOut event', event.nativeEvent.layout)
  //   setHeight(height)
  // }

  return (
    <View style={{paddingVertical: 5,backgroundColor: 'transparent'}} >
      <View style={{}}>
        <View style={[mainstyles.rowalCjcSb,mainstyles.pB10,{paddingHorizontal: 15,}]}>
          <View>
            {
              item?.typeDate === 'single' ?
              <Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>Загрузка: {item?.date}</Text>
              :<Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>Загрузка: {item?.dateRange[0]} - {item?.dateRange[1]}</Text>
            }
          </View>
          <View>
            <Text style={[mainstyles.text16M,{color: THEME.GREY900},]}>{item?.price} BYN</Text>
          </View>
        </View>

        <View style={[mainstyles.rowalC,{paddingBottom: 15,paddingHorizontal: 15,}]}>        
            <IconPinSmallOt />
          <Text style={[mainstyles.text14R,{color: THEME.GREY700,paddingLeft: 15}]}>{item?.address}</Text>
        </View>

        <View style={{paddingHorizontal: 15,}}>
          <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.infoContainer,mainstyles.mB15,]}>
            <View style={[styles.infoInputBox,{borderRightWidth:1, borderRightColor: THEME.GREY300}]}>
              <View style={styles.imgContainer}>
                <IconWeight/>
              </View>
              <View style={styles.inputWeight}>
                {
                  item?.weight &&item?.weight?.trim()?.length>0?
                  <Text style={[mainstyles.text14R,]}>{item?.weight} кг</Text>
                  :<Text style={[mainstyles.text14R,]}>- кг</Text>
                }
              </View>
            </View>
            <View style={styles.infoInputBox}>
              <View style={styles.imgContainer}>
                <IconVolume />
              </View>
              <View style={styles.inputWeight}>
                {
                  item?.volume && item?.volume?.trim()?.length>0?
                  <Text style={[mainstyles.text14R,]}>{item?.volume} м3</Text>
                  :<Text style={[mainstyles.text14R,]}>- м3</Text>
                }
              </View>
            </View>
          </View>
        </View>

          {
            item?.description && item?.description?.trim()?.length > 0 ?
            <View style={{paddingHorizontal: 15,}}>
              <View style={[styles.desctWrapper,styles.whiteBlock,mainstyles.shadowG5r5, {alignItems: 'flex-start',}]}>
                <Text style={[mainstyles.text14R,styles.desctInput,]}>{item?.description}</Text>
              </View> 
            </View>
            :
            null
            // <Text style={[mainstyles.text14R]}>Информация о грузе...</Text>
          }

        {/* <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.infoContainer,mainstyles.mB15,{paddingVertical: 15}]}>
          <View style={[styles.infoInputBox,{borderRightWidth:1, borderRightColor: THEME.GREY300}]}>
            <Text style={[mainstyles.text12R, {color: THEME.GREY400}]}>Предложенная цена</Text>
          </View>
          <View style={styles.infoInputBox}>
            <Text style={[mainstyles.text14R,styles.inputPrice, {color: THEME.GREY600}]}>{item?.price} BYN</Text>
          </View>
        </View> */}

          {/* <View style={styles.photoWrapper}>
            {
              item.images?.length>0?
              <>
              {item.images.map((elem, index)=>(
                <TouchableOpacity key={index+'ph'} style={[styles.rowItem,]} onPress={()=>onPress(item.images)}>
                  <Image source={{uri: elem}} style={[styles.img]} />
                </TouchableOpacity>
              ))} 
              </>
              : null
            }
          </View> */}
        <FlatList
          data={item.images}
          keyExtractor={(elem, index) => index+1+'a2w'}
          numColumns={4}
          columnWrapperStyle={{backgroundColor: 'transparent',paddingHorizontal: 15}}
          renderItem={(elem, index)=>{
            // console.log('elem', elem.item)
            return (
              <TouchableOpacity key={index+'ph'} style={[styles.rowItem,]} onPress={()=>onPress(item.images)}>
                <Image source={{uri: elem.item}} style={[styles.img]} />
              </TouchableOpacity>
          )}}
          
          // horizontal={true}
          // showsHorizontalScrollIndicator={false}
        />

      </View>
    </View>
    )
} 
const styles = StyleSheet.create({
  btnPoints: {
    width: '50%',
    paddingVertical:7,
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
  
  photoWrapper: {
    width: '100%',
    marginBottom: 10,    
    // backgroundColor: 'pink',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 15,
    flexWrap: 'wrap',
    // justifyContent: 'space-between'
  },
  rowItem: {
    // backgroundColor: 'pink',
    position: 'relative',
    paddingRight: 6,
    paddingBottom: 8,
    width: '25%',
    // justifyContent: 'flex-start',
    // alignItems: 'center'
  },
  img: {
    // backgroundColor: 'green',
    borderRadius: 10,
    height: width/4,
    // width: width/4-15,
    // width: '24%',
  },
  //
  whiteBlock: {
    borderRadius: 27,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
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


  //!!!!!!
})