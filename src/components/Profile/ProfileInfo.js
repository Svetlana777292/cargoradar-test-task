import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView,ActivityIndicator } from 'react-native';

//packages
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/entypo';
import Carousel from "pinar";

//functions && features && slice
import { getCarsInfoFromUser, getProfileUserInfo } from '../../util/firebase';
import { height } from '../../util/helperConst';

//components
import { CloseBtn } from '../CloseBtn';
import IconUserAvatar from '../Svg/IconUserAvatar';
import IconStarSmallF from '../Svg/IconStarSmallF';
import { CarsList } from '../Car/CarsList';

//styles
import { THEME, mainstyles } from '../../theme';
import { get } from '../../store/features/api/user-api';

export const ProfileInfo = (props) => {
  console.log('ProfileInfo',props?.userInfo)
  const {role, userInfo, type,  onClose } = props
  const [isLoading, setIsLoading] = useState(false)
  // const [userInfo, setUserInfo] = useState(null)
  const [userInfoCars, setUserInfoCars] = useState([])
  const safeInsets = useSafeAreaInsets();
  const text = role ==='driver' ? 'Созданные заказы':'Выполненные заказы'
  const counter = role ==='driver' ? userInfo?.quantityTenders : userInfo?.finishedTenders

  const carousel = useRef(null)
  const [currIndexImag, setCurrIndexImag] = useState(0)
  const [imageState, setImageState] = useState([])
  const [isShowCarousel, setIsShowCarousel] = useState(false)

  // console.log('userId', userId)
  const handleGetData = async () => {
    setIsLoading(true)
    // const userData = await getProfileUserInfo(userId)
    // const userDataCars = role ==='client' && !type ? await getCarsInfoFromUser(userId) : null
    try {
      
      const response = await get(`cars/users/${userInfo.userId}`)
      // console.log('response dt', response.details)
      // console.log('response st', response.status)
  
      if(!response.success) {
        console.log('handleGetData', response.error)
        alert(response.error)
      }
      setUserInfoCars(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }

    // if(userData) {
    //   setUserInfo(userData)
    // }
  }

  const handleShowGallery = (index, item) => {
    // console.log('index', index, )
    // onOpenGallery(item.data?.photos)
    setCurrIndexImag(index)
    setImageState(item)
    setIsShowCarousel(true)

  }

  const handleCloseSettings = () => {
    setIsShowCarousel(false)
    setCurrIndexImag(0)
    setImageState([])
    // setEnScr(true)
  }
  const renderItemC = (item, index) => {
    console.log('item, index', item, index)
    return (
      <View style={{alignItems: 'center',justifyContent:'center',zIndex: 998 }} key={index+'yu'}>
        <Image source={{uri: item}} 
        style={{width: '95%', height: height < 700 ? '90%': '100%',}}
        // style={{width: 300, height: 300,backgroundColor: 'pink'}}
         resizeMode='contain'/>
      </View>
    )
  }

  useEffect(()=>{
    if(role === 'client') {

      handleGetData()
    }
  },[props])

  return (
    <View style={[styles.container,{height: height+safeInsets.top}]}>
      <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} useAngle angle={-90} 
      style={[styles.wrapper,{padding: 0,}]}>
        {
          isLoading ?
          <View style={[mainstyles.alCjcC,{flex:1, minHeight: height+safeInsets.top,zIndex: 99999}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
          : null
        }
        {
          isShowCarousel ?
          <View style={[{ 
            position: 'absolute', 
            zIndex: 999,
            width: '100%',
            height: '100%', //!!!
            // height: height-45,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignSelf: 'center', justifyContent: 'center', 
            paddingTop: safeInsets?.top}
          ]} >
            <TouchableOpacity style={[styles.close,{zIndex: 999,top: safeInsets?.top}]} onPress={handleCloseSettings}>
              <Icon name='cross' color={'#fff'} size={30} style={{}}/>
            </TouchableOpacity>

            <Carousel
              ref={carousel}
              mergeStyles={true}
              loop={false}
              index={currIndexImag}
              showsControls={false}
              showsDots
              // width={width}
              // height={height+safeInsets.top}
              autoPlay={false}
              // style={{paddingTop: safeInsets?.top,width: '100%',backgroundColor: 'blue', }}
              onIndexChanged={(index) => { console.log('index', index)}}
              dotsContainerStyle={{bottom: 65}}
              activeDotStyle={{
                backgroundColor: THEME.GREY300
              }}
              dotStyle={{
                backgroundColor: THEME.GREY500,
              }}
            >
              {
                imageState&&imageState.map((item,index)=>renderItemC(item,index))
              }
            </Carousel>
          </View>
          : <CloseBtn nameBtn={'cross'} onPress={onClose} sizeBtn={30} colorBtn={'#fff'} styleBtn={[styles.close,{top: safeInsets.top}]}/>
        }
        {
          userInfo !==null && userInfo !==undefined ?
          <View style={[mainstyles.alCjcC,
            {paddingTop: safeInsets.top+15, 
              paddingBottom: userInfoCars?.length > 0 ? 65+safeInsets.top : 0, 
              marginBottom: userInfoCars?.length > 0 ? 65+safeInsets.top: 0}
          ]}>
            <View style={[mainstyles.alCjcC,{paddingBottom: 15}]}>
              <View style={[mainstyles.pB5]}>
                {
                  userInfo?.avatar && userInfo?.avatar?.length > 0 ?
                  <Image source={{uri: userInfo?.avatar}} style={[styles.avatar]}/>
                  :
                  <IconUserAvatar />
                }
              </View>
              <View>
                <Text style={[mainstyles.text22SB,{color: '#fff', paddingBottom: 10}]}>{userInfo?.name}</Text>
              </View>
              <View style={[mainstyles.rowalC,mainstyles.pB5]}>
                <Text style={[mainstyles.text15R,{color: '#fff',paddingRight: 10,}]}>Рейтинг: {userInfo?.rating}</Text>
                <IconStarSmallF />
              </View>
              <Text style={[mainstyles.text16M,{color: '#fff',}]}>{text}: {counter == null ? 0 : counter}</Text>
            </View>
            {
              userInfoCars?.length > 0 ?
              <ScrollView style={[{backgroundColor:'transparent', width: '100%',}]} >
                <CarsList data={userInfoCars} onOpenGallery={handleShowGallery} />
              </ScrollView>
              : null
            }
          </View>
          : 
          null
        }
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    position: 'relative',
    // backgroundColor: '#fff',
  },
  wrapper: {
    flex:1,
    width: '100%',
    height: height
  },
  close: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 998
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: THEME.GREY400
  },
})