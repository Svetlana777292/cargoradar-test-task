import React, { useState, useEffect,useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Modal, Platform } from 'react-native';

//packages
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch,useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

//components
import { HeaderTitleComponent } from '../../components/Headers/HeaderTitleComponent';
import { DefaultBtn } from '../../components/Buttons/DefaultBtn';
import { AddAddressBtn } from '../../components/Buttons/AddAddressBtn';
import { MapAddAddress } from '../../components/Modal/MapAddAddress';
import AddPhotoTender from '../../components/AddPhotoComponents/AddPhotoTender';
import PromptComponent from '../../components/Modal/PromptComponent';
import IconMsgF from '../../components/Svg/IconMsgF';
import { ChooseCalendarDate } from '../../components/Calendar/ChooseCalendarDate';
import IconWeight from '../../components/Svg/IconWeight';
import IconVolume from '../../components/Svg/IconVolume';

//functions && features && slice
import { onEditPoint, savePoint } from '../../store/features/editTenderSlice';
import { calendarPopup, cameraPermissionInfo, height } from '../../util/helperConst';
import { deletePhoto, takePhotoFromCamera, takePhotoFromLibrary } from '../../util/getPhotos';
import { findJsonObj, formatDateToMls } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import InfoAskWindow from '../../components/Modal/InfoAskWindow';
import { onOpenModalSource } from '../../util/permissions';
import { openSettings } from 'react-native-permissions';
import { convertToNextMidnightUTC, convertToYYYYMMDD, formatToUts } from '../../util/dateFormats';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const EditStartPointScreen = ({route,navigation}) => {
  console.log('EditStartPointScreen route: ', route);
  const priceRef = useRef(null)
  let scrollref = useRef()
  const currentDateState = useSelector(state=>state.user.currentDate)
  const dataTender = useSelector(state=> state.editTender.tender)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  const safeInsets = useSafeAreaInsets();
  const [stateItem,setStateItem] = useState(null)
  const [typeDate, setTypeDate] = useState('single')
  const [singleDate,setSingleDate] = useState(null) //calendar format
  const [rangeDate, setRangeDate] = useState(null) //calendar format
  const [showSingleDate, setShowSingleDate] = useState(null) //'DD.MM.YYYYY'
  const [showRangeDate, setShowRangeDate] = useState(null)//'DD.MM.YYYYY'
  const [dateMls, setDateMls] = useState(null) //utc format
  const [rangeDateMls, setRangeDateMls] = useState(null) //utc format
  const [description, setDiscription] = useState('')
  const [weight, setWeight] = useState('')
  const [volume, setVolume] = useState('')
  const [price, setPrice] = useState('')
  const [addressFromMap,setAddressFromMap] = useState(null)
  const [onOpenMap, setOnOpenMap] = useState(false)
  const [isOpenAskSource,setIsOpenAskSource] = useState(false)
  const [isCalendarVisible,setIsCalendarVisible] = useState(false)
  const [isPromptVisible,setIsPromptVisible] = useState(false)
  const [validDateErr,setValidDateErr] = useState(false)
  const [validPriceErr,setValidPriceErr] = useState(false)
  const [validAddressErr,setValidAddressErr] = useState(false)
  const [photosTender,setPhotosTender] = useState([])
  const [isShowPermisson,setIsShowPermisson] = useState(false)
  const [urlToDel,setUrlToDel] = useState([])
  // console.log('urlToDel', urlToDel)
  const dispatch = useDispatch()
  // console.log('showSingleDate', showSingleDate)
  // console.log('showRangeDate', showRangeDate)
  // console.log('dateMls', dateMls)
  // console.log('rangeDateMls', rangeDateMls)

  // const [isDisable,setIsDisable] = useState(true)
  // console.log('photosTender', photosTender.length)
  // const routeName = getFocusedRouteNameFromRoute(route)
  // console.log('routeName', routeName)

  const handleAddToDel = (item) => {
    let newArr = urlToDel
    newArr.push(item)
    setUrlToDel(newArr)
  }
  const handleOpenModalSource = async () => {

    let resultAsk = await onOpenModalSource(Platform,setIsOpenAskSource,setIsShowPermisson)
    console.log('3 resultAsk', resultAsk)
  }

  const handleOpenSettings = () => {
    setIsShowPermisson(false)
    openSettings().catch(() => console.warn('cannot open settings'))
  }

  const resetState = () => {
    setTypeDate('single')
    setRangeDate(null)
    setSingleDate(null)
    setDateMls(null)
    setRangeDateMls(null)
    setShowSingleDate(null)
    setShowRangeDate(null)
    setDiscription('')
    setWeight('')
    setWeight('')
    setVolume('')
    setPrice('')
    setPhotosTender([])
    setAddressFromMap(null)
  }

  const handleAddAddress = () => {
    setOnOpenMap(true)
  }

  const handleCloseCalendar = () => {

    setIsCalendarVisible(false)
  }

  const handleSetShowDate = (date,flag) => {
    console.log('handleSetShowDate date:', date)
    // setShowSingleDate(date)
    if(flag === 'single') {
      // const date = fn(date)
      setShowSingleDate(date)
    } else {
      
      // const date = fn(date)
      setShowRangeDate(date)
    }
  }

  const handleSetDate = (data,type) => {
    console.log('handleSetDate data:', data, 'type:',type)

    if(type==='single') {
      const timeMls = formatToUts(data)
      setSingleDate(data) //calendar format
      setDateMls(timeMls) //uts format

      setRangeDate(null)
      setShowRangeDate(null)
      setRangeDateMls(null)
      
    } else {
      //!!!конверт-ть в uts отдельный стейт
      let startDate = formatToUts(data[0])
      let endDate = formatToUts(data[1])
      setRangeDate(data) //calendar format
      setRangeDateMls([startDate,endDate]) //uts format

      setSingleDate(null)
      setShowSingleDate(null)
      setDateMls(null)
    }
    setTypeDate(type)
  }

  const handleSavePoint = (flag) => {

    // !! если это редактирование точки то надо добавлять id точки иначе создастся новая
    if(addressFromMap==null||addressFromMap==undefined) {
      setValidAddressErr(true)
    } 
    // console.log('price',price,)

    //TODO заменить старые названия и проверить все (остальное готово)
    if (Number(price)===0) {
      scrollref?.current?.scrollToEnd({animated: true})
      setValidPriceErr(true)
    } 
    if((singleDate === null && singleDate === undefined) || (rangeDate === null && rangeDate === undefined) ) {
      setValidDateErr(true)
    }  
    if(addressFromMap!==null&& addressFromMap!==undefined &&
      price!==null&& price!==undefined&&Number(price)!==0&&
      ((typeDate === 'single' && singleDate !== null && singleDate !== undefined) || 
      (typeDate === 'range' && rangeDate !== null && rangeDate !== undefined))
      ){
        console.log('addressFromMap', addressFromMap)
        const obj = {
          address: addressFromMap.address,
          coords: {latitude: addressFromMap.latitude, longitude: addressFromMap.longitude},
          date: showSingleDate,
          dateRange: showRangeDate,
          typeDate: typeDate,
          dateMls: dateMls,
          rangeDateMls: rangeDateMls,
          description: description,
          weight: weight,
          volume: volume,
          price: price,
          images: photosTender,
          // urlToDel: urlToDel, //убрать проверку из скрина редактирования
        }
        if(route.params?.data?.item.hasOwnProperty('id')) {
          obj.id = route?.params?.data.item.id
        }
        console.log('obj', obj)
        if(route?.params?.data !==null &&route?.params?.data !==undefined &&route.params.data?.action ==='edit' ) {
          console.log('edit route', )
          dispatch(onEditPoint({index: route?.params?.data.index, item: obj,type: 'start'}))
          if(flag ==='addnewone') {
            if((dataTender.startPoints?.length+dataTender.endPoints?.length) < 10 &&
            dataTender.startPoints?.length < 9) {
              //тут проверить еще - когда нажимаешь сохр и добав еще точку  - надо сбрасывать стейт так как при создании новой 
              //точки будет  диспатч onEditPoint а нужно savePoint
              resetState()
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'EditTender',
                  },
                  {
                  name: 'EditStartTender',
                  params: {firstOpen: true}
                },
              ],
              })
              //обнулить стейт(уточнить?)
              //открыть карту и открыть календарь
              setIsCalendarVisible(true)
              setOnOpenMap(true)

            } else {
              navigation.navigate('EditTender')
            }
          } else {
            navigation.navigate('EditTender')
          }
        } else {
          console.log('add route', )
          dispatch(savePoint({data: obj, type: 'start'}))
          if(flag ==='addnewone') {
            console.log('dataTender.startPoints?.length', dataTender.startPoints?.length)
            //обнулить стейт(уточнить?)
            //открыть карту и открыть календарь
            if((dataTender.startPoints?.length+dataTender.endPoints?.length) < 9 &&
            dataTender.startPoints?.length < 8) {
              resetState()
              setIsCalendarVisible(true)
              setOnOpenMap(true)
            } else {
              navigation.navigate('EditTender')
              // navigation.goBack()  
            }

          } else {
            console.log('route?.params', route?.params?.firstOpen,typeof(route?.params?.firstOpen))
            // if(route?.params.firstOpen === true) {
            //   console.log('text', route?.params?.firstOpen===true, route?.params.firstOpen === true)
            // }
            if(route?.params?.firstOpen===true) {
              // console.log('1', route)
              navigation.navigate('CreateEndPoint')
              // navigation.navigate('CreateEndPoint',{firstOpen: true})
            } else {
              // console.log('2', route)
              navigation.navigate('EditTender')
            }
            // navigation.goBack()
          }
        }
    }
  }  

  // console.log('\x1b[43m%s %s\x1b[0m', 'CreateStartPointScreen addressFromMap: ', addressFromMap)
  useEffect(()=>{
    if(route?.params?.data !==null &&route?.params?.data !==undefined) {
      if(route.params.data?.action ==='edit') { 
        setStateItem(route?.params?.data)
        let item = route?.params?.data.item
        console.log('item', item)

        item.weight ? setDiscription(item.description) : null
        item.weight ? setWeight(item.weight) : null
        item.volume ? setVolume(item.volume) : null
        item.price ? setPrice(item.price) : null
        setPhotosTender(item.images)
        setAddressFromMap({address: item.address, latitude: item.coords.latitude, longitude: item.coords.longitude})
        setTypeDate(item.typeDate)

        //данные с сервера поэтому надо переконвертирывать dateMls в utc
        if(item.typeDate === 'single') {
          let convertDate = convertToYYYYMMDD(item.dateMls) //calendar format
          let dateToUts = convertToNextMidnightUTC(item.dateMls) //utc format
          setSingleDate(convertDate) //calendar format
          setShowSingleDate(item.date) //'DD.MM.YYYYY'
          setDateMls(dateToUts) //utc format
        } else {
          let convertDate1 = convertToYYYYMMDD(item.rangeDateMls[0])
          let convertDate2 = convertToYYYYMMDD(item.rangeDateMls[1])
          console.log('convertDate 1&2', convertDate1,convertDate2)
          setRangeDate([convertDate1,convertDate2]) //calendar format
          setShowRangeDate(item.dateRange) //'DD.MM.YYYYY'
          const dateRangeToUTCFormat1 = convertToNextMidnightUTC(item.rangeDateMls[0])
          const dateRangeToUTCFormat2 = convertToNextMidnightUTC(item.rangeDateMls[1])
          setRangeDateMls([dateRangeToUTCFormat1,dateRangeToUTCFormat2]) //utc format

        }
      }
    } else {
      if(singleDate==null) {
        console.log('set singleDate ', singleDate, currentDateState)
        let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
        setSingleDate(currentDateState) //'YYYY-MM-DD' calendar format
        setShowSingleDate(curDateStateFormatted) //'DD.MM.YYYY'
        const dateUtc = formatToUts(currentDateState)
        console.log('dateUtc', dateUtc)
        setDateMls(dateUtc) //utc format
      }
    }
  },[route])

  useEffect(()=>{
    if(typeDate === 'single') {
      if(singleDate !== null && singleDate !== undefined && singleDate?.length > 0) {
        //!!! проврка даты или рендж даты
        setValidDateErr(false)
      }
    } else {
      if(rangeDate !== null && rangeDate !== undefined && rangeDate?.length > 0) {
        //!!! проврка даты или рендж даты
        setValidDateErr(false)
      }
    }
  },[singleDate,rangeDate])

  useEffect(()=>{
    if(price!==null&& price!==undefined&&parseInt(price)>0) {
      setValidPriceErr(false)
    } 
  },[price])

  useEffect(()=>{
    if(addressFromMap!==null&& addressFromMap!==undefined) {
      setValidAddressErr(false)
    } 
  },[addressFromMap]) 

  useEffect(()=>{
    if(route?.params?.firstOpen===true) {
      setIsCalendarVisible(true)
      setOnOpenMap(true)
    } 
  },[route]) 

  return (
    // <KeyboardAvoidingView 
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
    //   style={{flex:1,}}
    // >
        <View
          // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
          // style={{height:500,}}
          style={{flex:1,}}
        >
      <View style={styles.container}>
        <View style={{paddingTop: safeInsets.top}}>
          <HeaderTitleComponent title={'Точка загрузки'} onPress={()=>navigation.navigate('EditTender')} customStyle={{paddingBottom: 0}}/>
        </View>

        {/* <ScrollView ref={scrollref} style={styles.inner} contentContainerStyle={{justifyContent: 'space-between'}} > */}
        <KeyboardAwareScrollView
          innerRef={ref => {
            scrollref = ref
          }}
          enableOnAndroid={true}
          extraScrollHeight={0} // на сколько дополнительно поднять поле над клавой
          // keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
          }}
          keyboardDismissMode='on-drag'
        >
    
          <View style={{position: 'relative', alignItems: 'center',paddingVertical:10}}>
            <AddAddressBtn onPressAddress={handleAddAddress} data={addressFromMap} point='start'/>                
            {
              validAddressErr?
                <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Выберите адрес</Text>
                :null
            }
          </View>
          
          <View style={[mainstyles.pH15,mainstyles.mB25]}>
            <View style={[mainstyles.botLineGr400, styles.dateContainer, {borderBottomColor: validDateErr ? THEME.REDERR : THEME.GREY300}]}>
              <TouchableOpacity style={styles.dateFild} onPress={()=>setIsCalendarVisible(true)}>
                {
                  typeDate === 'single' ? 
                  <>
                    {
                      showSingleDate && showSingleDate?.length > 0 ?
                      <Text style={[mainstyles.text15R, styles.textData]}>{showSingleDate}</Text>
                      : 
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата загрузки (дд.мм.гг)</Text>
                    }
                  </>
                  :
                  <>
                    {
                      showRangeDate && showRangeDate?.length > 0 ?
                      <Text style={[mainstyles.text15R, styles.textData]}>{showRangeDate[0]} - {showRangeDate[1]}</Text>
                      : 
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата загрузки (дд.мм.гг)</Text>
                    }
                  </>
                }
              </TouchableOpacity>
              <TouchableOpacity style={styles.popupDate} onPress={()=>setIsPromptVisible(true)}>
                <View style={styles.popupBtn} >
                  <Text style={[mainstyles.text14R, {color: '#fff'}]}>?</Text>
                </View>
              </TouchableOpacity>
            </View>
              {
                validDateErr?
                  <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 5}]}>Выберите дату загрузки!</Text>
                  :null
              }
          </View>

          <View style={[styles.desctWrapper,mainstyles.pH15]}>
            <TextInput 
              style={[mainstyles.text14R,styles.desctInput,styles.whiteBlock,mainstyles.shadowG5r5,mainstyles.inputMultiline5]}
              blurOnSubmit={true}
              textAlignVertical='top'
              placeholder='Информация про загрузку'
              placeholderTextColor={THEME.GREY900}
              value={description}
              onChangeText={setDiscription}
              multiline={true}
              numberOfLines={5}
              maxLength={300}
            />
            <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{description?.length >0? description?.length: 0} | 300</Text>
          </View>
          <View style={[mainstyles.pH15,mainstyles.mB25]}>
            <View style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.infoContainer,]}>
              <View style={[styles.infoInputBox,{borderRightWidth:1, borderRightColor: THEME.GREY300}]}>
                <View style={styles.imgContainer}>
                  <IconWeight />
                  <View style={[styles.tooltip,mainstyles.alCjcC,{paddingRight: 10}]}>
                    <IconMsgF />
                    <Text style={[mainstyles.text12R,styles.tooltiptext]}>кг</Text>
                  </View>
                </View>
                <View style={styles.inputWeight}>
                  <TextInput 
                    blurOnSubmit={true}
                    style={[mainstyles.text14R,{width: '100%'}]}
                    placeholder='Вес'
                    keyboardType='numeric'
                    placeholderTextColor={THEME.GREY400}
                    value={weight}
                    onChangeText={setWeight}
                    maxLength={10}
                  />
                </View>

              </View>
              <View style={styles.infoInputBox}>
                <View style={styles.imgContainer}>
                  <IconVolume />
                  <View style={[styles.tooltip,mainstyles.alCjcC,{right: 2}]}>
                    <IconMsgF />
                    <Text style={[mainstyles.text12R,styles.tooltiptext,{left: 6}]}>м3</Text>
                  </View>
                </View>
                <View style={styles.inputWeight}>
                  <TextInput 
                    blurOnSubmit={true}
                    style={[mainstyles.text14R,{width: '100%'}]}
                    placeholder='Объем'
                    placeholderTextColor={THEME.GREY400}
                    keyboardType='numeric'
                    value={volume}
                    onChangeText={setVolume}
                    maxLength={9}
                  />

                </View>
              </View>
            </View>
          </View>

          <View style={[mainstyles.pH15, mainstyles.mB25]}>
            <View 
              style={[styles.whiteBlock,mainstyles.shadowG5r5,styles.infoContainer,{ height: 40,paddingVertical:5, },validPriceErr? {shadowColor: '#D32030', elevation: 8,  borderWidth:1, borderColor: THEME.REDERR}:null]}>
              <View style={[{width: '50%',borderRightWidth:1, borderRightColor: THEME.GREY300,height: '100%',justifyContent: 'center',}]}>
                <Text style={[mainstyles.text12R, {color: THEME.GREY400, justifyContent: 'center',}]}>Предложите цену</Text>
              </View>
              <View style={[styles.infoInputBox,]}>
                <TextInput 
                  ref={priceRef}
                  style={[mainstyles.text14R,styles.inputPrice,]}
                  keyboardType='numeric'
                  placeholder='0'
                  placeholderTextColor={THEME.GREY800}
                  value={price}
                  onChangeText={setPrice}
                  onFocus={()=>{priceRef?.current.focus(),scrollref?.current?.scrollTo({x: 0 , y: height, animated: true})}}
                  onBlur={()=> {scrollref?.current?.scrollTo({x: 0, y: 0, animated: true})}}
                  maxLength={50}
                  textAlign='right'
                />
                <Text style={[mainstyles.text12R, {color: THEME.GREY600}]}>BYN</Text>
              </View>
            </View>
            {
              validPriceErr
                ?
                <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 10}]}>Заполните поле с ценой!</Text>
                :null
            }
          </View>
            
          <View style={mainstyles.pH15}>
            <View style={styles.photoWrapper}>
              <Text style={[mainstyles.text16R, {color: THEME.GREY700, paddingBottom: 15}]}>Добавить фото</Text>
              
              <AddPhotoTender 
                images={photosTender} 
                setImages={setPhotosTender} 
                onOpenAskModal={()=>{handleOpenModalSource()}} 
                onDelete={deletePhoto}
                flag={true}
                setDelItem={handleAddToDel}
                />
            </View>
          </View>

        </KeyboardAwareScrollView>

        {/* </ScrollView> */}
        <View style={[styles.btnRow,Platform.OS==='android'?{paddingBottom: safeInsets?.bottom+40}: {}]}>
          <View style={[styles.bottomBtns,]}>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={handleSavePoint}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Сохранить точку загрузки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,styles.itemBtnMid,]} onPress={()=>handleSavePoint('addnewone')}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Создать еще одну точку загрузки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={()=>{navigation.navigate('EditTender')}}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Отменить или назад</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          isOpenAskSource ?
          <TouchableOpacity onPress={()=>setIsOpenAskSource(false)} style={{position: 'absolute', width: '100%', height:height+safeInsets?.top, backgroundColor: 'rgba(0,0,0,0.8)',justifyContent: 'center',}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',padding: 10}}>
              <DefaultBtn title={'Из галереи'} onPress={()=>{takePhotoFromLibrary(photosTender,setPhotosTender),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
              <DefaultBtn title={'Сделать фото'} onPress={()=>{takePhotoFromCamera(photosTender,setPhotosTender),setIsOpenAskSource(false)}} customStyle={{width: '35%'}}/>
            </View>
          </TouchableOpacity>
          : null
        }
        {
          isCalendarVisible ?
          <View style={[mainstyles.containerModalGgBl,{paddingTop: safeInsets?.top,minHeight: height,}]}>
            <ChooseCalendarDate
               type="multi"
               point='start'
               singleDateState={singleDate}
               rangeDateState={rangeDate}
               showSingleDate={showSingleDate}
               showRangeDate={showRangeDate}
               setShowDate={handleSetShowDate}
               onPressSave={handleSetDate} 
               onClose={handleCloseCalendar}
            />
          </View>
          :null
        }
        {
          isPromptVisible ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top,minHeight: height,alignItems: 'center',}]}>
            <PromptComponent data={findJsonObj(jsonDataPrompt,'calendar_popup',calendarPopup)} onPress={()=>{setIsPromptVisible(false)}}/>
          </View>
          :null
        }
        {
          isShowPermisson ?
            <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top,minHeight: height,alignItems: 'center',}]}>
              <InfoAskWindow data={findJsonObj(jsonDataPrompt,'cameraPermissionInfo',cameraPermissionInfo)} onPress={()=>{handleOpenSettings()}} onClose={()=>setIsShowPermisson(false)}/>
            </View>
          : 
          null
        }
      </View>
      <Modal
        animationType='fade'
        visible={onOpenMap}
        onRequestClose={()=>setOnOpenMap(false)}
      >
        <MapAddAddress title={'Адрес загрузки'} addressFromMap={addressFromMap} setAddressFromMap={setAddressFromMap} onClose={()=>setOnOpenMap(false)}/>
      </Modal>
      </View>
    // </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  whiteBlock: {
    borderRadius: 27,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
  },
  searchBar: {
    // backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: 5,
    zIndex: 99
    // height: 200
  },
  inner: {
    // position: 'relative',
    // paddingHorizontal: 20
  },
  textData: {
    color: THEME.GREY800,
    // backgroundColor: 'red'
  },
  //date
  dateContainer: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // paddingBottom: 15,
    paddingTop: 10
  },
  dateFild: {
    // backgroundColor: 'red',
    width: '85%',
    paddingVertical: 12,
    // paddingBottom: 15,
  },
  popupDate: {
    // backgroundColor: 'blue',
    width: '15%',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.GREY400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //inputs
  desctWrapper: {
    marginBottom: 20
  },
  desctInput: {
    color: THEME.GREY800,
    alignItems: 'center',
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
    paddingVertical: 5,
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
    width: '85%',
    // backgroundColor: 'orange',
    // paddingVertical: 20,
    height: 40,

    paddingRight: 10
  },
  photoWrapper: {
    marginBottom: 20
  },
  btnRow: {
    // backgroundColor: 'red',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20
  },
  bottomBtns: {
    // backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    borderColor: THEME.PRIMARY,
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 45,
    elevation: 10,
    backgroundColor: '#fff',
    shadowColor: THEME.PRIMARY
  },
  itemBtn: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',    
  },
  itemBtnMid: {
    borderRightColor: THEME.PRIMARY,
    borderRightWidth: 2,
    borderLeftColor: THEME.PRIMARY,
    borderLeftWidth: 2,   
  },
  btnCustomStyle: {
    height: 55, 
    borderRadius: 50,
    // paddingHorizontal: 40,
    // paddingVertical: 16
  },
  // photoContainer: {},
})

export default EditStartPointScreen;