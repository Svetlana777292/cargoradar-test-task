import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, Platform } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import crashlytics from '@react-native-firebase/crashlytics';

//functions && features && slice
import { height, promptSuccSendDrvPrpus } from '../util/helperConst';
import { timest } from '../util/const';
import { messageIdGenerator } from '../util/msgGenerator';
import { createNotificationAll } from '../util/firebase';
import { findJsonObj } from '../util/tools';

//components
import { HeaderTitleComponent } from '../components/Headers/HeaderTitleComponent';
import RangeSlider from '../components/RangeSlider/RangeSlider';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import IconStarSmallFill from '../components/Svg/IconStarSmallFill';
import IconCheck from '../components/Svg/IconCheck';
import PromptComponent from '../components/Modal/PromptComponent';
import { ProfileInfo } from '../components/Profile/ProfileInfo';

//styles
import { THEME, mainstyles } from '../theme';
import { firebeseUpdateTender } from '../util/tenders';
import { get, post, put, requestArr } from '../store/features/api/user-api';
import { getUserFormDataFromDB, setUserFormDataFromDB } from '../store/features/api/userInfoForms';

//modal
export const SearchDriversScreen = ({ route, navigation }) => {
  console.log('SearchDriversScreen', '___render___');
  // console.log('route.params.dataTender.id', route.params.dataTender.id);
  
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const { userProfileInfo, userFormsInfo} = useSelector((state) => state.login)
  const uid = '2'//auth().currentUser.uid
  // console.log('userFormsInfo', userFormsInfo.driverRoutesOffers)
  const [radius, setRadius] = useState([10])
  const [searchResult, setSearchResult] = useState([])
  const [searchResultDr, setSearchResultDr] = useState([])
  const [choseDrivers, setChoseDrivers] = useState([])
  const [isDisable, setIsDisable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowSucceed, setIsShowSucceed] = useState(false)
  const [textEmpty, setTextEmpty] = useState('Вы еще не искали водителей')
  const [userProfileState, setUserProfileState] = useState(null)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)
  // console.log('searchResult', searchResult)
  // console.log('choseDrivers', choseDrivers)
  const dispatch =  useDispatch()

  const handleChose = (itemId) => {
    try {
      console.log('itemId', itemId)
      let inArr = choseDrivers.includes(itemId)
      console.log('inArr', inArr)

      if(inArr === true) {
        let newArr = choseDrivers?.filter((item)=> item !== itemId)
        console.log('newArr', newArr)
        setChoseDrivers(newArr)
      } else {
        let newInArr = choseDrivers.concat([itemId])
        setChoseDrivers(newInArr)
      }
      
    } catch (error) {
      // crashlytics().recordError(error);
    }
  }

  const handleChoseAll = () => {
    let newArr = searchResult.map((item)=> { return item.userId })
    // console.log('newArr', newArr)
    setChoseDrivers(newArr)
  }

  function checkPointsInRadius(coordsMain, radius, routeArr) {
    console.log('checkPointsInRadius start', )
    // coordsMain - стартовые точки загрузки заказа
    // routeArr - массив маршрутов()
      
      // Перевести радиус из километров в градусы
      const degreesPerKilometer = 1 / 111.32;
      const radiusInDegrees = radius * degreesPerKilometer;
    
      // Создать массив для точек, находящихся внутри радиуса
      const pointsInsideRadius = [];
    
      // Пройти по каждой координате в массиве coordsMain
      for (const coordsOfPoint of coordsMain) {
        // console.log('\x1b[44m%s %s\x1b[0m','coordsOfPoint', coordsOfPoint)
        // Пройти по каждому элементу(объект маршрута) массива routeArr
        for (const routeObj of routeArr) {
          let isInsideRadius = false;
          let arrAllPoints = routeObj.startPoints.concat(routeObj.endPoints);
          
          // Пройти по каждой точке внутри элемента startPoints и endPoints
          for (const onePoint of arrAllPoints) {
            const latDiff = Math.abs(coordsOfPoint.coords.latitude - onePoint.coords.latitude);
            const lonDiff = Math.abs(coordsOfPoint.coords.longitude - onePoint.coords.longitude);
            const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    
            // Если расстояние меньше или равно радиусу, флаг и выход из цикла
            if (distance <= radiusInDegrees) {
              isInsideRadius = true;
              break;
            }
          }
          // console.log('\x1b[43m%s %s\x1b[0m','***isInsideRadius', isInsideRadius)
          // Если хотя бы одна точка входит в радиус, элемент в routeArr
          if (isInsideRadius) {
            pointsInsideRadius.push(routeObj);
          }    
        }
      }
    
      return pointsInsideRadius;
  }

  function checkDriverPositionInRadius(coordsMain, radius, positionDriver) {
    // console.log('checkDriverPositionInRadius', coordsMain, radius, points)\
    if(positionDriver === null || positionDriver === undefined) return false
    const degreesPerKilometer = 1 / 111.32;
    const radiusInDegrees = radius * degreesPerKilometer;

    for (const coordsOfPoint of coordsMain) {
      const latDiff = Math.abs(coordsOfPoint.coords.latitude - positionDriver?.coords.latitude);
      const lonDiff = Math.abs(coordsOfPoint.coords.longitude - positionDriver?.coords.longitude);
      // console.log('latDiff', latDiff, 'lonDiff', lonDiff)
      const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
      // console.log('positionDriver distance', distance <= radiusInDegrees)
      if (distance <= radiusInDegrees) {
        // Если хотя бы одна точка входит в радиус, добавьте элемент массива points
        return true;
      }
    }
    return false;
  }
  //поиск
  const handleSearch = async () => {
    setIsLoading(true)
    
    try {
      const response = await get('users/drivers')
      if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          setIsLoading(false)
          alert(response.error);
          return;
        }
      // console.log('response.data',JSON.stringify(response.data,null,2))
      // console.log('response',response.data.map(elem => console.log('user driver',elem.id, elem.forms.profile.name,elem.forms.profile.phone)))
      const arrOfDrivers = []

      if(response.data.length > 0) {
        // setSearchResultDr(response.data)
        //todo - обработка позиции по радиусу или маршрута 
        //есть позиция - проверяем радиус не подошел или нету - проверяем маршрут (не архивный)
        //формируем чат

        const allStartPoints = route.params.dataTender.startPoints
        const driverWithOffers = route.params.driversWithOffer?.length > 0 ? route.params.driversWithOffer : []
        // console.log('driverWithOffers', driverWithOffers)
        response.data.forEach(element => {
          // console.log('\x1b[43m%s %s\x1b[0m','users/drivers element', element.forms.profile, element.id)
          // element.routes
          // element.position
          // element.forms
          //1 - если водитель есть в driverRoutesOffers в стейте формс водителя то не отправлять
//!!раскомент
          let alreadySend = driverWithOffers.includes(element.id) 
          //element.driverRoutesOffers.find(elem => elem.tenderId === route.params.dataTender.id && elem.userId === element.id)
          // console.log('alreadySend', alreadySend)
          if(alreadySend === true) return
//!!
          //todo проверка на нахождение в скрытых
          let chekHidden = userFormsInfo.hiddenTendersClient.find(itemfnd => { return itemfnd?.userId === element.id && itemfnd?.tenderId === route.params.dataTender.id })
          if(chekHidden !== undefined) return
          // console.log('chekHidden', chekHidden)

          //2 - проверка позиции в радиусе
          const checkDriverPosition = checkDriverPositionInRadius(allStartPoints,radius[0],element.position)
          // console.log('\x1b[44m%s %s\x1b[0m','checkDriverPosition', checkDriverPosition)
          if(checkDriverPosition === false) {
            // console.log('\x1b[45m%s %s\x1b[0m','checkDriverPosition', checkDriverPosition)
            let routesArr = element.routes !== null && element.routes.filter(elm => elm.archived === false )
            // console.log('routesArr', routesArr)
            const checkDriverRoutes = checkPointsInRadius(allStartPoints,radius[0],routesArr)
            // console.log('\x1b[42m%s %s\x1b[0m','checkDriverRoutes', checkDriverRoutes)
            // проверяем маршруты
            if(checkDriverRoutes.length > 0) {
                // alert('in route ')

              let obj = {
                avatar: element.forms.profile.driverAvatar,
                name: element.forms.profile.name,
                rating: element.forms.profile.rating,
                quantityOfFinished: element.forms.quantityOfFinished,
                userId: element.id,
                routeId: checkDriverRoutes[0].id, //берет первый маршрут (не обязательно что это тот в котором был поиск - переделать функцию что бы возвращаля маршрут)
                driverRoutesOffers: element.forms?.driverRoutesOffers
              }
              console.log('obj', obj)
              arrOfDrivers.push(obj)
            } 
          } else {
            // alert('in position ')
            let obj = {
              avatar: element.forms.profile.driverAvatar,
              name: element.forms.profile.name,
              rating: element.forms.profile.rating,
              quantityOfFinished: element.forms.quantityOfFinished, //находится не в профиле в этой точке
              userId: element.id,
              routeId: null,
              driverRoutesOffers: element.forms?.driverRoutesOffers
            }
            // console.log('obj', obj)
            arrOfDrivers.push(obj)
          }
        });
        // console.log('arrOfDrivers', arrOfDrivers)
        setSearchResult(arrOfDrivers)
      } else {
        setTextEmpty('Подходящих водителей не найдено')
      }
      setIsLoading(false)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleCloseSettings = async () => {
    setChoseDrivers([])
  }

  //todo сообщения выбранным водителям
  async function sendMsgToDriver(user) {
    console.log('sendMsgToDriver',  user)
    try {
      const tender = route.params.dataTender
      let objMsg = {
        partnerId: user.userId,
        partnerRole: 'driver',
        read: false,
        replyId: null,
        tenderId: tender.id,
        text: null,
        textSystem: 'offerFromClient',
        typeMsg: 'offerFromClient',
        system: true,
        priceBet: tender.price,
        userId: tender.userId,
        userRole: 'client',
        // size: null, -> user.routeId 
        size: user.routeId !== null ? user.routeId : null, //id маршрута routeId -поля нету в сообщениях
        url: "",
        file_type: null,
        name: null,
        thumbnail: null
      }
      
      const response = await post(`messages`,objMsg)
      if (!response.success) {
        console.warn('Ошибка запроса post messages:', response.error);
        //
        alert(`Ошибка запроса post messages ${response.error}`)
        return null;
      }
      // console.log('msg response.data', response.data)
      //? todo в маршрут водителю в offersTendersId добавлять id tender - делать? и для чего?
      //todo если это офер по маршруту то в форму юзера по точке PUT /api/forms/users/{userId} добавлять в {tenderId, routeId} -->
      if(user.routeId !== null) {
        //проверить есть ли офер в массиве - если нет то добавить в стейт
        
        let check = user.driverRoutesOffers.find(elem => {return elem.tenderId === tender.id && elem.routeId === user.routeId})
        console.log('check driverRoutesOffers', check)
        if(check === undefined) {
          let objUpd = {'driverRoutesOffers': user.driverRoutesOffers.concat([{tenderId: tender.id, routeId: user.routeId}])}
          console.log('objUpd', objUpd)
          const responseForm = await put(`forms/users/${user.userId}`,objUpd)
          if(!responseForm.success) {
            alert(`Ошибка запроса forms/users upd ${responseForm.error}`)
            return null;
          }
          console.log('put responseForm.data', responseForm.data)
        }
        // todo --> (id маршрута и заявки ? или только заявки ? подумать ( пока в распределении информеров  стоит проверять айди заявки - тогда в маршруте в offersTendersId должно быть айди заявки) что бы можно было соотнести информер к заявке)
        //пока не делать - айди роута есть в оферах
      }

      return user

    } catch (error) {
      console.log('sendMsgToDriver error', error)
    }
  }

  //?
  const handleSendPropose = async () => {
    setIsLoading(true)

    let drivers = searchResult.filter(elem => {
    // console.log('elem', elem)
    let result = choseDrivers.find(itemft =>itemft === elem.userId)
      // console.log('result',result)
      if(result !== undefined) return elem
    })
    // console.log('1 drivers',drivers)

    // const response = await Promise.all(drivers.map(elem => sendMsgToDriver(elem)))
    
    // остальное скрыть
    // console.log('response Promise', response)
    // let arrUerMsgToSend = response.filter(elem => elem !== null)
    // console.log('arrUerMsgToSend', arrUerMsgToSend)
    
    // let arrForm = response.map(item => {
    //   return {tenderId: route.params.dataTender.id, userId: item.userId}
    // })
    
    // console.log('arrForm', arrForm)
    
    const objDrivers = drivers.map(elem => { return {
      userId: elem.userId,
      routeId: elem.routeId
    }})
    console.log('objDrivers', objDrivers)
    // console.log('objDrivers1', JSON.stringify(objDrivers))

    

        // if (Array.isArray(params)) {
    //   url.searchParams.append('data', JSON.stringify(params));
    // } else if (typeof params === 'object') {
    //   Object.keys(params).forEach(key => {
    //     const value = params[key];
    //     if (typeof value === 'object') {
    //       url.searchParams.append(key, JSON.stringify(value));
    //     } else {
    //       url.searchParams.append(key, value);
    //     }
    //   });
    // }
    
    // const response = await post(`tenders/${route.params.dataTender.id}/offers`,objDrivers)
    const response = await requestArr('POST',`tenders/${route.params.dataTender.id}/offers`,objDrivers)
    console.log('response.data', response.data)
    if (!response.success) {
      console.warn('Ошибка запроса post offers:', response.error);
      //
      alert(`Ошибка запроса post messages ${response.error}`)
      setIsLoading(false)
      return null;
    }



    //todo изменять форму надо у драйвера
    // const resForm = await put(`forms`,{'driverRoutesOffers': userFormsInfo.driverRoutesOffers.concat(arrForm)})
    
    // if (!resForm.success) {
    //   console.warn('Ошибка запроса put forms:', resForm.error);
    //   //
    //   getUserFormDataFromDB(dispatch)
    //   setIsLoading(false)
    //   alert(resForm.error);
    //   return null;
    // }

    // // получить новую форму
    // getUserFormDataFromDB(dispatch)


    setIsLoading(false)
    setIsShowSucceed(true)

    // try {
    //   let drivers = searchResult.filter(elem => {
    //     // console.log('elem', elem)
    //     let result = choseDrivers.find(itemft =>itemft === elem.userId)
    //       // console.log('result',result)
    //     if(result !== undefined) return elem
    //   })
    //   // console.log('drivers', drivers)
    //   // console.log('choseDrivers', choseDrivers)
    //   choseDrivers?.length > 0 && choseDrivers.forEach(elem => {
    //     let updateTender = {'usersIdWithChat': firestore.FieldValue.arrayUnion(elem)}
    //     firebeseUpdateTender(route.params.dataTender.id,updateTender)
    //   })
    //   const allsend = await Promise.all(drivers.map(elem => sendMsgToDriver(messageIdGenerator,elem,route,uid,userProfileInfo?.quantityTenders))).then((res=>{
    //     console.log('finished all promise', )
    //     //send notificatian all или кажому отсылать пуш
    //     let msgToAllUser = {
    //       // старое название propouseFromClient -> новое название offerFromClient
    //       createdAtServer: firestore.FieldValue.serverTimestamp(),
    //       type: "offerFromClient",//notifyAllDriver
    //       ids: choseDrivers, //id водителей
    //       newPrice: route.params.dataTender.data.price,
    //       tenderName: route.params.dataTender.data.name,
    //       fromUserName: route.params.dataTender.data.userName,
    //       tenderId: route.params.dataTender.id,
    //       fromUser: uid,
    //       userId: uid,
    //       data: {
    //         dataExist: 'yes',
    //         type: 'chat',
    //         tenderId: route.params.dataTender.id,
    //         receiverRole: 'driver'
    //       }
    //     }
    //     console.log('msgToAllUser', msgToAllUser)

        
    //     createNotificationAll(msgToAllUser)
    //     setIsShowSucceed(true)
    //   }))
      
      
    // } catch (error) {
    //   console.log('518 handleSendPropose error', error)
    //   setIsLoading(false)
    // }
  }

  const handleShowProfile = (item) => {
    setUserProfileState(item)
    setIsVisibleProfile(true)
  }

  const testfn = async() => {
    let objForm = {'driverRoutesOffers': []}

    // const resForm = await put(`forms`,objForm)
    let objMsg = {
        partnerId: 8,
        partnerRole: 'driver',
        read: false,
        replyId: null,
        tenderId: 112,
        text: 'hallo90',
        textSystem: null,
        typeMsg: null,
        routeId: null, //id маршрута
        system: false,
        priceBet: null,
        userId: 2,
        userRole: 'client',
        size: null,
        url: "",
        file_type: null,
        name: null,
        thumbnail: null
      }
      
      const response = await post(`messages`,objMsg)
      console.log('response', response)
  }

  const ChatItem = ({prop, flag}) => {
    console.log('SDS ChatItem prop', prop)
    let isChose = choseDrivers && choseDrivers.find(item=> item===prop?.userId)
    
    // console.log('isChose', isChose)

    return (
      <View style={[mainstyles.mrChats,]}>
        <View style={[styles.row,[styles.wrapperItem,mainstyles.shadowG5r8]]}>
          <TouchableOpacity style={styles.imgContainer} onPress={() =>handleShowProfile(prop.userId)}>
            <View style={{width:60,height:60}}>
              {
                prop.avatar!==null && prop.avatar?.length > 0 ?
                <Image source={{uri: prop.avatar }} style={styles.img}/>
                :
                <View style={styles.img}>
                  <Icon name="camera" size={20} color={THEME.PRIMARY} />
                </View>
              }
              <View style={[styles.starContainer]}>
                <Text style={[mainstyles.text10R,styles.starText]}>{prop.rating}</Text>
                <IconStarSmallFill color={THEME.YELLOW}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.innerItem} activeOpacity={0.9} onLongPress={()=>{handleChose(prop.userId)}} onPress={()=>handleChose(prop.userId)}>
            <View style={[styles.content,{justifyContent: 'space-between'}]}>
              <Text style={[mainstyles.text14R,{color: THEME.GREY800,}]}>{prop.name}</Text>
              <View style={[mainstyles.rowalC]}>
                <Text style={[mainstyles.text14R,{color: THEME.GREY800}]}>Выполнено заказов: </Text>
                <Text style={[mainstyles.text14M,{color: THEME.GREY800}]}>{prop.quantityOfFinished !== null && prop.quantityOfFinished !== undefined ? prop.quantityOfFinished : 0}</Text>
              </View>
            </View>
          <View style={[styles.priceContainer]}>
            <View style={[styles.checkContainer,mainstyles.alCjcC,isChose ? { borderColor: THEME.PRIMARY,}:{borderColor: THEME.GREY600}]}>
              {
                isChose ?
                <IconCheck />
                : <></>
              }
            </View>
          </View>
          </TouchableOpacity>
          
        </View>
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <ChatItem prop={item} />
  )

  return (
    <View style={styles.container}>
      {
        isVisibleProfile && userProfileState ? 
        <View style={[mainstyles.containerModalGgBl,{flex:1, minHeight: height+safeInsets.top, zIndex: 99999}]}>
          <ProfileInfo role={'client'} userInfo={userProfileState} onClose={()=>{setIsVisibleProfile(false)}}/>
        </View>
        :null
      }
      <View style={[styles.wrapper,{paddingTop: safeInsets.top}]}>
        <HeaderTitleComponent onPress={()=>navigation.goBack()}
        titleWrapStyles={{width: '90%', backgroundColor: 'transparent'}}
        btnWrapStyles={{width: '10%', backgroundColor: 'transparent'}}
        title={'Поиск водителей по маршруту'} />
      </View>

      <View style={[styles.headContent,mainstyles.pH10]}>
        <Text style={[mainstyles.text14R,{color: '#000',paddingBottom: 10}]}>Ускорьте выполнение вашего заказа, разослав водителям рядом уведомление о заказе.</Text>
        <Text style={[mainstyles.text14R,{color: '#000'}]}>Поиск от первой точки загрузки: <Text style={[mainstyles.text18R,{color: THEME.GREY600}]}>{radius}</Text> км</Text>
        <RangeSlider from={10} to={50} value={radius} setValue={setRadius} />
        <View style={[mainstyles.pV10, mainstyles.alCjcC]}>
          <DefaultBtn title={'Искать'} onPress={handleSearch} customStyle={{width:'90%'}}/>
          {__DEV__&&<DefaultBtn title={'tst'} onPress={testfn} customStyle={{width:'90%',backgroundColor: 'pink'}}/>}
        </View>
      </View>

      <View style={[styles.rowManage, mainstyles.rowalCjcSb]}>
        <Text style={[mainstyles.text14R,styles.textColorD,]}>Найденные водители</Text>
        <View>
          {
            searchResult.length > 0 ?

            <View style={[mainstyles.rowalCjcSb,{backgroundColor: 'transparent'}]}>
              <TouchableOpacity style={{paddingLeft: 10}} onPress={handleCloseSettings}>
                <Icon name='cross' color={THEME.PRIMARY} size={28}/>
              </TouchableOpacity>
              <View style={[mainstyles.outlBage25,{marginHorizontal: 10}]}>
                <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY600}]}>{choseDrivers?.length}</Text>
              </View>
              <TouchableOpacity style={[mainstyles.pH5,{paddingRight: 10}]} onPress={()=>handleChoseAll()}>
                <Text style={[mainstyles.text14R,{lineHeight: 16,color: THEME.GREY800,paddingLeft: 10,}]}>Выбрать все</Text>
              </TouchableOpacity>
            </View>
            : null
          }
        </View>
      </View>
          
      <FlatList
        data={searchResult}
        style={[{paddingTop: 15,backgroundColor: 'transparent',}, Platform.OS ==='ios'? {paddingBottom: 0}:{}]}
        ListEmptyComponent={()=> (
          <View style={{alignSelf: 'center', paddingVertical: 15,}}><Text>{textEmpty}</Text></View>
        )}
        renderItem={renderItem}
        keyExtractor={(item,index) => index+'weqwe'}
        ListFooterComponent={()=>(<View style={{height:30}}></View>)}
      />
        <View style={[mainstyles.pV10, mainstyles.alCjcC, {paddingBottom: 20}]}>
          <DefaultBtn title={'Предложить заказ'} onPress={handleSendPropose} customStyle={{width:'90%'}} disabled={choseDrivers?.length === 0}/>
        </View>


      {
        isLoading ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999,}]}>
            <ActivityIndicator color='#fff' size='large'/>
          </View>
        : 
        null
      }
      {
        isShowSucceed ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{flex:1,minHeight: height+safeInsets.top, paddingTop: safeInsets.top,zIndex: 99999,}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'promptSuccSendDrvPrpus',promptSuccSendDrvPrpus)} onPress={()=>navigation.goBack()}/>
          </View>
        : 
        null
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // height: height,
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'space-between',
    // backgroundColor: 'red'
  },
  wrapperItem: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 7,

  },
  imgContainer: {
    // backgroundColor: 'lightblue',
    width: '20%',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  innerItem: {
    // backgroundColor: 'pink',
    paddingVertical: 10,
    width: '80%',
    paddingRight: 10,
    flexDirection: 'row',
  },
  content: {
    // backgroundColor: 'yellow',
    width: '75%',
    paddingHorizontal: 10,
    
  },
  priceContainer: {
    // backgroundColor: 'red',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkContainer: {
    borderWidth: 1, 
    width: 25, height: 
    25, 
    borderRadius: 30
  },
  rowManage: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5'
  },
  img: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.GREY100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  starContainer: {
    position: 'absolute',
    bottom: 0,
    right: -7,
    width: 30,
    height: 30,
    // borderRadius: 10,
    // padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: THEME.GREY100,
    // borderColor: '#fff',
    // borderWidth: 1,
  },
  starText: {
    color: '#000',
    lineHeight: 11,
    position: 'absolute',
    bottom: 7,
    // backgroundColor: 'red',
    zIndex: 2
  },
});



    // // const dataTender = route.params.dataTender.data
    // try {
    //   //достаем все маршруты которые не архивные (сделать индекс для не архивных)
    //   let objRoutes = []
    //   let myPropouse = []
    //   let driversPosition = []
    //   const allStartPoints = route.params.dataTender.data.startPoints

    //   await firestore().collection('routes')
    //   .where('createdAt', '>', timest)
    //   .get()
    //   .then((querySnapshot) => {
    //     console.log('querySnapshot routes size \n', querySnapshot.size)
    //     querySnapshot.forEach(documentSnapshot => {
    //       // console.log('querySnapshot Tender: ', documentSnapshot.data())
    //       let createdAt = documentSnapshot.data().createdAt.toMillis()
          
    //       if(createdAt > timest && documentSnapshot.data().archived === false && documentSnapshot.data().userId !== uid) {
    //         let obj = {
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id,
    //           userId: documentSnapshot.data().userId,
    //         }
    //          objRoutes.push(obj)
    //       }
    //     })
    //   })

    //   await firestore().collection('positions')
    //   // .where('timestamp', '>', timest) //отдавал геопозицию не позже 24ч
    //   .get()
    //   .then((querySnapshot) => {
    //     console.log('querySnapshot position size \n', querySnapshot.size)
    //     querySnapshot.forEach(documentSnapshot => {
    //       // console.log('querySnapshot Tender: ', documentSnapshot.id)
    //       let timestamp = documentSnapshot.data().timestamp.toMillis()
    //       let datenow = Date.now()
    //       // console.log('timestamp', timestamp,)
          
    //       if(datenow <= timestamp+86400000 && documentSnapshot.id !== uid && documentSnapshot.data().coords !== null) {
    //         // console.log('if', datenow <= timestamp+86400000)
    //         let obj = {
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id,
    //           userId: documentSnapshot.id
    //         }
    //         driversPosition.push(obj)            
    //       }
    //     })
    //   })

    //   await firestore().collection('messages')
    //   .where('createdAt', '>' , timest)
    //   .where('userId', '==' , uid)
    //   .where('typeMsg', '==' , 'offerFromClient')
    //   .get()
    //   .then((querySnapshot) => {
    //     console.log('querySnapshot messages size \n', querySnapshot.size)
    //     querySnapshot.forEach(documentSnapshot => {
    //       // console.log('querySnapshot Tender: ', documentSnapshot.data())
          
    //         let obj = {
    //           data: documentSnapshot.data(),
    //           id: documentSnapshot.id,
    //         }
    //         myPropouse.push(obj)
    //     })
    //   })
    //   // console.log('myPropouse', myPropouse)
    //   // console.log('objRoutes', objRoutes)
    //   // console.log('driversPosition', driversPosition) 

    //   //noPropouseRoutes - Маршрутоы без предложений по этой заявке
    //   let noPropouseRoutes = objRoutes.filter(elem => {
    //     let result = myPropouse.find(itemft => {
    //       // console.log('myPropouse find',elem.id, itemft.data.tenderId)
    //       //*тут myPropouse - массив сообщений - предложение которое отправляется клиентом водителю (напр если есть маршрут)
    //       //*в сообщение записывается id маршрута - но надо учитывать что на этот маршрут могут быть несколько предложений
    //       //* поэтому надо myPropouse проверять есть ли там id заявки
    //       // console.log('myPropouse.find', elem.data.userId, itemft.data.partnerId, itemft.data.tenderId, route.params.dataTender.id)
    //       if(elem.data.userId === itemft.data.partnerId && itemft.data.tenderId === route.params.dataTender.id) {
    //         // console.log('myPropouse.find', elem.id, itemft.data.routeId , itemft.data.tenderId,route.params.dataTender.id)
    //         return itemft
    //       }
    //     })
    //     // console.log('noPropouseRoutes filter result elem id', elem.id, result )
    //     if(result == undefined) {
    //       return elem
    //     }
    //   })

    //   //noPropousePosition - Координаты водителя без предложений по этой заявке
    //   let noPropousePosition = driversPosition.filter(elem => {
    //     // console.log('elem driversPosition', elem)
    //     let result = myPropouse.find(itemft => {
    //       // console.log('itemft', itemft.data.partnerId)
    //       // elem.id - id - водителя равен id партнера в пропозиции ( тоесть сообщения не этого водителя)
    //       // itemft.tenderId.id - id заявки равен айди заявки из роута
    //       if(elem.userId === itemft.data.partnerId && itemft.data.tenderId === route.params.dataTender.id) {
    //         // console.log('driversPosition : ', elem.userId, itemft.data.partnerId)
    //         return itemft
    //         //оба условия выполнены - значит предложене уже присылалось и этого водителя не показывать
    //       }
    //     })        
    //     // console.log('result noPropousePosition', result)
    //     if(result == undefined) {
    //       return elem
    //     }
    //   })
      
    //   //*------проверка координат--------*//
    //   // console.log('allStartPoints', allStartPoints)
    //   // console.log('noPropouseRoutes', noPropouseRoutes)
    //   // console.log('noPropousePosition', noPropousePosition)
    //   //!!проверять noPropousePosition и смотреть чтобы не было одинаковых водителей через маршруты и позицию
    //   //!!переделать, в noPropousePosition может быть больше итемов чем в noPropouseRoutes      
      

    //   //фильтровать массив noPropouseRoutes что бы были только уникальные водители
    //   let resCheckRoutes = []
    //   if(noPropouseRoutes.length > 0 ) {
    //     //checkPointsInRadius в каждом маршруте проверяет все точки загрузки и выгрузки входят ли они в radius всех точек загрузки заказа
    //     const routes = checkPointsInRadius(allStartPoints,radius[0],noPropouseRoutes)
    //     // console.log('routes', routes)
    //     const uniqueUserIds = new Set();
    //     const filteredArray = [];
  
    //     routes.forEach((item) => {
    //       const userId = item.data.userId;
    //       if (!uniqueUserIds.has(userId)) {
    //         uniqueUserIds.add(userId);
    //         filteredArray.push(item);
    //       }
    //     });
  
    //     // console.log('filteredArray', filteredArray)
    //     resCheckRoutes = filteredArray        
    //   }

    //   let resCheckPosition = []
    //   if(noPropousePosition.length > 0) {
    //     // console.log('noPropousePosition > 0', noPropousePosition)
    //     let uniqueArrnoPropousePosition = noPropousePosition
    //     let arrCheck = []
    //     if(resCheckRoutes.length > 0 ) {
    //       uniqueArrnoPropousePosition = noPropousePosition.map(elem => {

    //         let res = resCheckRoutes.find(fnitem => {
    //           // console.log('fnitem res',  fnitem.data.userId === elem.id)
    //           return fnitem.data.userId === elem.id
    //         })
    //         // console.log('res resCheckRoutes',  res)
    //         if(res === undefined) {

    //           return elem
    //         }
    //       })
    //       arrCheck = uniqueArrnoPropousePosition.filter((elem) => !!elem)
    //       // console.log('arrCheck', arrCheck)
    //     } else {
    //       arrCheck = uniqueArrnoPropousePosition
    //     }
    //     // console.log('arrCheck', arrCheck)

    //     resCheckPosition = checkDriverPositionInRadius(allStartPoints,radius[0],arrCheck)
    //     // console.log('resCheckPosition', resCheckPosition)//массив водителей чьи координаты входят в радиус
    //     // получить данные водителей
    //     resCheckPosition = await Promise.all(resCheckPosition.map(elem => getProfilesDr(elem.userId)))
        
    //   }

    //   // let finalArr = resCheckRoutes.concat(resCheckPosition)
    //   let unitedArr = resCheckRoutes.concat(resCheckPosition)
      
    //   let finalArr = unitedArr?.length > 0 ? removeDuplicatesByUserId(unitedArr) : unitedArr
    //   console.log('finalArr', finalArr)
      
    //   if(finalArr.length > 0) {
    //     setSearchResult(finalArr)
    //   } else {
    //     setTextEmpty('Подходящих водителей не найдено')
    //   }

    //   setIsLoading(false)
      
    // } catch (error) {
    //   console.log('430 error', error)
    //   setIsLoading(false)
    // }