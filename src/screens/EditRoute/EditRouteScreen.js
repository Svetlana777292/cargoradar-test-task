import React,{ useState, useEffect,useRef } from 'react';
import { Platform, KeyboardAvoidingView, Text, View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, StatusBar } from 'react-native';

//packages
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@react-native-vector-icons/entypo';

//components
import { MainMap } from '../../components/MapComponents/MainMap';
import IconPinSmallOt from '../../components/Svg/IconPinSmallOt';
import IconPinSmallFill from '../../components/Svg/IconPinSmallFill';
import { BtnIconTrs } from '../../components/Buttons/BtnIconTrs';
import { DefaultBtnWite } from '../../components/Buttons/DefaultBtnWite';
import ListPoints from '../../components/ListPoints/ListPoints';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import PromptComponent from '../../components/Modal/PromptComponent';
import { HeaderTitleComponentNoBg } from '../../components/Headers/HeaderTitleComponentNoBg';

//functions && features && slice
import { askResetEditRoute, height, promptShowDateExpired, promptSuccEditRoute, width } from '../../util/helperConst';
import { onChangeIndexOfPoint, onDeletePoint, setInfoRoute, onResetRoute} from '../../store/features/editRouteSlice';
import { checkActualDateOfTender, checkDateOfTender, findJsonObj } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import { put } from '../../store/features/api/user-api';

const EditRouteScreen = ({route,navigation}) => {
  console.log('\x1b[34m%s %s\x1b[0m \x1b[34m%s', 'screens > EditRoute > EditRouteScreen.js', 'route:',route);
  const mapViewRef = useRef(null)
  const titleRef = useRef()
  const safeInsets = useSafeAreaInsets();
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt) 
  const role = useSelector((state) => state.login.role)
  const dataTender = useSelector(state=> state.editRoute.tender)
  const dataTenderState = useSelector(state=> state.editRoute.tenderState)
  const userProfile = useSelector((state) => state.login.userProfileInfo)
  // console.log('userProfile', userProfile)
  // console.log('tenderEditState', tenderEditState)
  const [tenderState, setTenderState] = useState(null)
  const [title, setTitle] = useState('')
  const [isOpenList, setIsOpenList] = useState(false)
  const [listPoint, setListPoint] = useState('')
  const [coordinatesFrom, setCoordinatesFrom] = useState([])
  const [coordinatesTo, setCoordinatesTo] = useState([])
  const [routeInfo, setRouteInfo] = useState({
    distance: '',
    duration: ''
  })
  const [coordinates, setCoordinates] = useState([])
  const [paddingB, setPaddingB] = useState(65)
  const [isDisableBtn, setIsDisableBtn] = useState(true)
  const [isAskResetVisible, setIsAskResetVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessedCreate, setIsSuccessedCreate] = useState(false)
  const [isShowReset, setIsShowReset] = useState(false)
  const [isShowDateExpired, setIsShowDateExpired] = useState(false)
  const dispatch = useDispatch()
  console.log('dataTender', JSON.stringify(dataTenderState,null,2) )

  const onOpenList = (point) => {
    console.log('onOpenList btn', point)

    setIsOpenList(true)
    setListPoint(point)
  }
  const onOpenCreatePoint = (point) => {
    if(point==='start') {
      dataTender.startPoints.length === 0 ?  navigation.navigate('EditRoutePoint',{firstOpen: true, type: point}) : navigation.navigate('EditRoutePoint',{firstOpen: false,type: point})
    } else if(point==='end') {
      dataTender.endPoints.length === 0 ?  navigation.navigate('EditRoutePoint',{firstOpen: true, type: point}) : navigation.navigate('EditRoutePoint',{firstOpen: false,type: point})
    }
  }

  const handleSaveText = (flag,value) => {
    if(value!==undefined && value.trim().length > 0){
      dispatch(setInfoRoute({type: flag, data: value}))
      setTitle(value) 
    } else {
      dispatch(setInfoRoute({type: flag, data: ''}))
      setTitle('')
    }
  }

  const handleEditPoint = (item,index,point) => {
    console.log('handleEditPoint: ', )
    if(point==='start'){
      navigation.navigate('EditRoutePoint',{data: {item: item, index: index, type: point, action: 'edit'}})
    } else {
      navigation.navigate('EditRoutePoint',{data: {item: item, index: index, type: point, action: 'edit'}})
    }
  }
  const handleDeletePoint = (index, point) => {
    console.log('handleDeletePoint: ', )
    dispatch(onDeletePoint({type: point, data: index}))
  }
  const handleChangeIndexPoint = (data) => {
    console.log('handleChangeIndexPoint: ', )
    dispatch(onChangeIndexOfPoint(data))
  }
  const handleOpenAsk = () => {
    console.log('handleOpenAsk', )
    Keyboard.dismiss() 
    if(
      dataTender.data.name?.length>0||
      dataTender.startPoints?.length>0||
      dataTender.endPoints?.length>0
      ) {
        setIsAskResetVisible(true)
    } else {
      setIsAskResetVisible(true)
    }
  }
  const handleResetState = () => {
    console.log('handleResetState',)
      setIsAskResetVisible(false)
      dispatch(onResetRoute()) 
      setTitle('')
      setIsDisableBtn(true)
      setCoordinatesFrom([])
      setCoordinatesTo([])
      setRouteInfo({
        distance: '',
        duration: ''
      })
      setCoordinates([])
      setIsSuccessedCreate(false)
      navigation.navigate('Routes')
  }
  const createRouteInfo = (result) => {
    // console.log('createRouteInfo result', result)
    // console.log('createRouteInfo result', typeof(result.distance), typeof(result.distance.toFixed(0)))
    
    setRouteInfo({
      distance: result.distance.toFixed(1),
      duration: result.duration
    })
  }

  const handleEditRoute = async() => {
    // setIsLoading(true)
    Keyboard.dismiss()

    const checkDateStPoints = await checkActualDateOfTender(dataTender.startPoints)
    console.log('checkDateStPoints', checkDateStPoints)
    if(checkDateStPoints === false ) {
      setIsShowDateExpired(true)
      setIsLoading(false)
      return;
    } else {
      console.log(' no expired', dataTenderState.id)
      try {
        
        let tenderObj = {
          'archived': false,
          'name':  dataTender.data?.name?.trim(),
          'startPoints':  dataTender.startPoints,
          'endPoints':  dataTender.endPoints,
          'route':  routeInfo,
          'userId':  userProfile.id,
          'id': dataTenderState.id,
          "finishedAt": null,
          "isEdit": null,
        }
        
        console.log('tenderObj', tenderObj);  
    
        const response = await put(`routes/${dataTenderState.id}`,tenderObj)
        
        if (!response.success) {
          console.warn('Ошибка запроса:', response.error);
          //
          setIsLoading(false)
          alert(response.error);
          return;
        }
        console.log('response.data', response.data)
        setIsLoading(false)
        setIsSuccessedCreate(true)

        
        // сохранение и отправка данных в firebase
        // await firestore().collection('routes')
        // .doc(tenderState.id)
        // .update(tenderObj)
        // .then(() => {
        //   console.log('successfully!')
        //   // console.log('res', res)
        //   setIsLoading(false)
        //   setIsSuccessedCreate(true)
        // })
        
        
      } catch (error) {
        setIsLoading(false)
        console.log(' error', error);
        // alert(`Ошибка создания заявки \n err:${JSON.stringify(error)}  msg:${JSON.stringify(error?.messages)}`)
      }
    }
  }

  useEffect(()=> { 
    const onCreateRoutePoints = () => {
      console.log(' onCreateRoutePoints START', )

      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})

      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)
      
      //координаты в один массив
      const coordsRoute = coordsFrom.concat(coordsTo)
      // console.log('onCreateRoutePoints coordsRoute: ', coordsRoute);
      setCoordinates(coordsRoute)
    }
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      // console.log(' onCreateStartEndPoints start: ', startEndPoints)
      onCreateRoutePoints()
    }
    //если нет то ставим предупреждение в слайд route
    
  },[dataTender])

  useEffect(()=> { 
    if(dataTender.startPoints.length > 0 || dataTender.endPoints.length > 0) {
      const coordsFrom = dataTender.startPoints.map((item,index)=>{return item.coords})
      const coordsTo = dataTender.endPoints.map((item,index)=>{return item.coords})
      // console.log('MAKE coords from: ', coordsFrom)
      // console.log('MAKE coords to: ', coordsTo)

      setCoordinatesFrom(coordsFrom)
      setCoordinatesTo(coordsTo)
    }
    
  },[dataTender])

  useEffect(()=>{
    // console.log('text', description)
    if(title !== null && title!==undefined && title?.trim()?.length > 0 &&      
      dataTender.startPoints?.length > 0 && dataTender.endPoints?.length > 0
      ) {
        // console.log('useEffect disable', isDisableBtn)
      setIsDisableBtn(false)
    } else {
      setIsDisableBtn(true)
    }
  },[dataTender,title])

  //кнопка сброса
  useEffect(()=>{
    // console.log('text', description)
    if((title !==null && title!==undefined && title?.trim()?.length > 0) ||
      dataTender.startPoints?.length > 0 ||
      dataTender.endPoints?.length > 0
      ) {
      setIsShowReset(true)
    } else {
      setIsShowReset(false)
    }
  },[dataTender,title])
  
  useEffect(()=>{
    if(dataTender.data.name?.length> 0) {
      setTitle(dataTender.data.name)
    }
  },[])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          console.log('keyboardDidShow', paddingB)
          setPaddingB(0)
          // paddingB===65?setPaddingB(0):null
            // setKeyboardVisible(true);
        },
    );
    const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          console.log('keyboardDidHide', paddingB)
          setPaddingB(65)
          // paddingB===0?setPaddingB(65):null
            // setKeyboardVisible(false);
        },
    );

    return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(()=>{
    if(route?.params !== undefined) {
      setTenderState(route?.params.dataTender)
    }
  },[route])

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{flex:1,}}
      >
        <View style={[styles.container,{}]}>
          <StatusBar translucent barStyle={'dark-content'}/>
          <View  style={[styles.topBar,{}]} >
            <HeaderTitleComponentNoBg customStyle={{paddingTop: safeInsets.top}} title={'Ваш маршрут'} onPress={!isOpenList ? ()=>navigation.goBack(): ()=>setIsOpenList(false)} icon={!isOpenList ? false : true}/>
          </View>
          <View style={[Platform.OS==='android'?{flex:1,}:{height:height/1.8,paddingTop: safeInsets?.top}]}>
    
            <MainMap 
              mapViewRef={mapViewRef} 
              customStyles={{height:height/1.8}} 
              cusStMap={{ minHeight: height/1.8}}
              customBtnPosition={Platform.OS ==='android'? safeInsets?.top+20 : safeInsets?.top}
              coordinatesArr={coordinates}
              coordinatesFrom={coordinatesFrom}
              coordinatesTo={coordinatesTo}
              isRouteVisible={true}
              onCreateRouteInfo={createRouteInfo}
            />
          </View>
          {
            !isOpenList ?
            <LinearGradient colors={['rgba(20, 136, 204, 0.9)', 'rgba(43, 50, 178, 0.9)']} useAngle angle={-135}  
            style={[styles.bottomWrapper,{
              // flex:2,height:height-height/1.8,
              }]}>
              <TouchableOpacity style={[]} activeOpacity={1} onPress={()=>Keyboard.dismiss()}>
                
                <View style={[styles.whiteComponent,mainstyles.shadowPr10,{marginBottom: 20,}]}>
                  <View style={[styles.titleWrapper,{padding: 0,paddingHorizontal:0}]}>
                    <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{title?.length >0? title?.length: 0} | 50</Text>
                    <TextInput 
                      ref={titleRef}
                      style={[mainstyles.text14M,styles.textAddress,styles.inputTitle,Platform.OS==='ios' ? {paddingVertical: 15}: null]}
                      placeholder='Краткое описание*'
                      blurOnSubmit={true}
                      placeholderTextColor={THEME.GREY900}
                      value={title}
                      onChangeText={(v)=>handleSaveText('title',v)}
                      maxLength={50}
                    />
                  </View>
    
                </View>

                <View style={[styles.whiteComponent,mainstyles.shadowPr10, styles.midWrapperContent]}>
                  <View style={styles.midTopInner}>
                    <View style={styles.leftContainer}>
                      <IconPinSmallOt />
                      <View style={styles.vertLine}/>
                      <IconPinSmallFill />
                    </View>
    
                    <View style={styles.rightContainer}>
                      <View style={[styles.addressItem,mainstyles.botLineGr]}>
                        {
                          dataTender.startPoints.length===0 ?
                            <TouchableOpacity onPress={()=>onOpenCreatePoint('start')}
                              style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>Загрузка</Text>
                            </TouchableOpacity>
                          :
                            <TouchableOpacity onPress={()=>onOpenList('start')}
                              style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                              {dataTender.startPoints.length===1?
                                <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>{dataTender?.startPoints[0].address}</Text>
                                :
                                <View style={[mainstyles.rowalC,styles.textAddress]}>
                                  <Text style={[mainstyles.text14R,styles.textAddressWithNum]}>{dataTender.startPoints?.length}</Text>
                                    {
                                      dataTender.startPoints?.length === 1 ?
                                      <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точка</Text>
                                      :
                                      <>
                                        {
                                          dataTender.startPoints?.length >1&&dataTender.startPoints?.length <=4 ?
                                          <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точки</Text>
                                          :
                                          <>
                                            {
                                              dataTender.startPoints?.length > 4?
                                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точек</Text>
                                              :
                                              null
                                            }
                                          </>
                                        }
                                      </>
      
                                    }
                                </View>
                              }                            
                              {
                                dataTender.startPoints?.length > 1 ?
                                  <Icon name='dots-three-horizontal' color={THEME.GREY500} size={20} style={{ }}/>
                                : null
                              }
                            </TouchableOpacity>
                        }
                        <View style={[styles.btnAddressContainer,{width: '18%'}]}>
                          {
                            (dataTender.startPoints?.length+dataTender.endPoints?.length) < 10 &&
                            dataTender.startPoints?.length < 9 ?
                            <BtnIconTrs onPress={()=>onOpenCreatePoint('start')} customStyles={{height: 30}}>
                              <Icon name={'plus'} color={THEME.GREY500} size={20}/>
                            </BtnIconTrs>
                            :
                            null
                          }
                        </View>
                      </View>
    
                      <View style={[styles.addressItem,styles.addressItemBottom]}>
                        {
                          dataTender.endPoints.length===0?
                            <TouchableOpacity onPress={()=>onOpenCreatePoint('end')}
                            style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>Разгрузка</Text>
                            </TouchableOpacity>
                          :
                            <TouchableOpacity onPress={()=>onOpenList('end')}
                            style={[mainstyles.rowalC,{backgroundColor: 'transparent',width: '82%',height: '100%',justifyContent: 'space-between'}]}>
                              
                              {dataTender.endPoints.length===1?
                                <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddress]}>{dataTender?.endPoints[0].address}</Text>
                                :
                                <View style={[mainstyles.rowalC,styles.textAddress]}>
                                  <Text style={[mainstyles.text14R,styles.textAddressWithNum]}>{dataTender.endPoints?.length}</Text>
                                    {
                                      dataTender.endPoints?.length === 1 ?
                                      <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точка</Text>
                                      :
                                      <>
                                        {
                                          dataTender.endPoints?.length >1&&dataTender.endPoints?.length <=4 ?
                                          <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точки</Text>
                                          :
                                          <>
                                            {
                                              dataTender.endPoints?.length > 4?
                                              <Text numberOfLines={2}  style={[mainstyles.text14R,styles.textAddressWithNum]}>Точек</Text>
                                              :
                                              null
                                            }
                                          </>
      
                                        }
                                      </>
      
                                    }
                                </View>
                              }
                              {
                                dataTender.endPoints?.length >1?
                                // <BtnIconTrs onPress={()=>onOpenList('end')}>
                                  <Icon name='dots-three-horizontal' color={THEME.GREY500} size={20} style={{ }}/>
                                // </BtnIconTrs>
                                : null
                              }
                            </TouchableOpacity>
                        }
                        <View style={[styles.btnAddressContainer,{width: '18%'}]}>
                          {
                            (dataTender.startPoints?.length+dataTender.endPoints?.length) <10 &&
                            dataTender.endPoints?.length < 9 ?
                            <BtnIconTrs onPress={()=>onOpenCreatePoint('end')} customStyles={{height: 30}}>
                              <Icon name={'plus'} color={THEME.GREY500} size={20}/>
                            </BtnIconTrs>
                            :
                            null
                          }
                        </View>
    
                        
                      </View>
                    </View>
                  </View>
    
                  <View style={[mainstyles.lineTop,mainstyles.pH20,{paddingVertical: 15}]}>
                    <View style={[mainstyles.rowalCjcSb,]}>
                      <Text style={[mainstyles.text14M,styles.textAddress]}>Расстояние:</Text>
                      {
                        routeInfo?.distance && routeInfo.distance?.length > 0 ?
                        <Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>{routeInfo.distance} км</Text>
                        :<Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>-</Text>
                      }
                      {/* <Text style={[mainstyles.text14M,{color: THEME.GREY900}]}>{routeInfo.distance?.length>0 ? routeInfo.distance:0} км</Text> */}
                    </View>
                  </View>
                </View>

                <View style={[styles.btnRow, {width: '100%'}]}>
                  <View style={[styles.qwe,{width: '48%'}]}>
                    <DefaultBtnWite title={'Сохранить'} disabled={isDisableBtn} onPress={handleEditRoute} customStyles={[styles.btnCustomStyle, {width: '100%',}]}/>
                  </View>
                    <View style={[styles.qwe,{width: '48%'}]}>
                      <DefaultBtnWite title={'Отменить'} onPress={handleOpenAsk} customStyles={[styles.btnCustomStyle,{width: '100%'}]}/>
                    </View>
                </View>

              </TouchableOpacity>
            </LinearGradient>
              :
              <ListPoints 
                point={listPoint} 
                data={dataTender} 
                onClose={()=>setIsOpenList(false)}
                onEdit={handleEditPoint}
                onDelete={handleDeletePoint}
                onChangeIndex={handleChangeIndexPoint}
                nav={'editRoute'}
              />
    
          }
          {
            isAskResetVisible?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top,minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'askResetEditRoute',askResetEditRoute)} onPress={handleResetState} onClose={()=>setIsAskResetVisible(false)}/>
            </View>
            :
            null
          }
          {
            isLoading?
            <View style={[mainstyles.containerModalGgBl,{zIndex: 999,minHeight: height+safeInsets?.top,justifyContent: 'center',paddingTop: safeInsets.top}]}>
              <ActivityIndicator color={'#fff'} size={'large'}/>
            </View>
            : null
          }
          {
            isSuccessedCreate ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'promptSuccEditRoute',promptSuccEditRoute)} onPress={handleResetState}/>
            </View>
            :null
          }
          {
            isShowDateExpired  ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,zIndex: 999}]}>
              <PromptComponent data={findJsonObj(jsonDataPrompt,'promptShowDateExpired',promptShowDateExpired)} onPress={()=>setIsShowDateExpired(false)}/>
            </View>
            :null
          }
        </View>
      </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: '#fff',
    // backgroundColor: 'pink',
    justifyContent: 'flex-end'
  },
  topBar: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    zIndex: 990,
  },
  whiteComponent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 15,
  },
  bottomWrapper: {
    // position:'absolute',
    // bottom:0,
    paddingHorizontal: 10,
    paddingTop: 20,
    width: '100%',
    // backgroundColor: 'beige',
    // paddingBottom:65,
    zIndex: 999
  },
  grWrapper: {
    borderTopRightRadius:25,
    borderTopLeftRadius:25,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 30,
    // paddingBottom: 65
    // alignItems: 'center',

  },
  midWrapperContent: {
    // backgroundColor: 'pink',
    marginBottom: 20,
  },
  midTopInner: {
    // backgroundColor: 'yellow',
    width: '100%',
    flexDirection: 'row',
  },
  leftContainer: {
    // backgroundColor: 'red',
    paddingLeft: 23,
    paddingRight: 13,
    width: '15%',
    // paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vertLine: {
    width: 1.7,
    height: 35,
    backgroundColor: THEME.PRIMARY,
    marginVertical: 6
  },
  rightContainer: {
    // backgroundColor: 'blue',
    width: '85%',
  },
  addressItem: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    paddingRight: 20
  },
  addressItemBottom: {
    // backgroundColor: 'green',
    borderBottomWidth: 0,
  },
  btnAddressContainer: {
    // backgroundColor: 'blue', 
    width: '30%', 
    alignItems: 'center',
    justifyContent: 'flex-end', 
    flexDirection: 'row'
  },
  textAddress: {
    width: '70%',
    color: THEME.GREY900, 
    paddingHorizontal: 5,
  },
  textAddressWithNum: {
    color: THEME.GREY900, 
    paddingHorizontal: 5,
  },

  btnRow: {
    // backgroundColor: 'red',
    width: width-60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  btnCustomStyle: {
    height: 45, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
    shadowColor: THEME.PRIMARY,
    elevation: 20,
  },
  closeBtn: {
    width: 45,
    height: 45,
    borderRadius: 40,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: THEME.PRIMARY,
    borderColor: THEME.PRIMARY,
    borderWidth: 2
  },
  titleSection: {
    
    paddingVertical: 5,
    marginBottom: 20,
    borderRadius: 28,
  },
  titleWrapper: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 20,
  },
  inputTitle: {
    padding: 0,
    // backgroundColor: 'red',
    paddingVertical: 10,
    paddingLeft: 15,
    borderRadius: 28,
    width: '100%',
  },
  inputCounterStr: {
    color: THEME.GREY300,
    position: 'absolute',
    top: 12,
    right: 20
  },
})
export default EditRouteScreen;