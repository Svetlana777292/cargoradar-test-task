import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Platform,} from 'react-native';

//packages
import { useDispatch,useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from 'dayjs';

//components
import { HeaderTitleComponent } from '../../components/Headers/HeaderTitleComponent';
import { AddAddressBtn } from '../../components/Buttons/AddAddressBtn';
import PromptComponent from '../../components/Modal/PromptComponent';
import { MapAddAddress } from '../../components/Modal/MapAddAddress';
import { ChooseCalendarDate } from '../../components/Calendar/ChooseCalendarDate';

//functions && features && slice
import { calendarPopup, height, promptCalendarDataEnd, width } from '../../util/helperConst';
import { onEditPoint, savePoint } from '../../store/features/addRouteSlice';
import { findJsonObj, findSmallestDate, findSmallestDateLocal, formatDateMlsToCalendar, formatDateToMls } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import { convertUtcToLocalDate, formatToUts } from '../../util/dateFormats';

const CreateRoutePointScreen = ({route, navigation}) => {
  console.log('\x1b[35m%s %s\x1b[0m \x1b[35m%s CreateRoutePointScreen route', route)
  const currentDateState = useSelector(state=>state.user.currentDate)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  // console.log('jsonDataPrompt', typeof(jsonDataPrompt))
  const dataTender = useSelector(state=> state.addRoute.tender)
  const safeInsets = useSafeAreaInsets();
  const [address,setAddress] = useState()
  const [stateItem,setStateItem] = useState(null)
  const [typeDate, setTypeDate] = useState('single')
  const [singleDate,setSingleDate] = useState(null) //calendar format
  const [rangeDate, setRangeDate] = useState(null) //calendar format
  const [showSingleDate, setShowSingleDate] = useState(null) //'DD.MM.YYYYY'
  const [showRangeDate, setShowRangeDate] = useState(null)//'DD.MM.YYYYY'
  const [dateMls, setDateMls] = useState(null) //utc format
  const [rangeDateMls, setRangeDateMls] = useState(null) //utc format
  const [onOpenMap, setOnOpenMap] = useState(false)
  const [addressFromMap,setAddressFromMap] = useState(null)
  const [textType,setTextType] = useState('')
  const [isOpenAskSource,setIsOpenAskSource] = useState(false)
  const [isCalendarVisible,setIsCalendarVisible] = useState(false)
  const [isPromptVisible,setIsPromptVisible] = useState(false)
  const [validDateErr,setValidDateErr] = useState(false)
  const [minDate,setMinDate] = useState(null)
  // const [isDisable,setIsDisable] = useState(true)
  const [validAddressErr,setValidAddressErr] = useState(false)
  const dispatch = useDispatch()

  // console.log('textType', textType)
  console.log('----!! singleDate', singleDate,'showSingleDate',showSingleDate,'dateMls',dateMls)
  console.log('----!! rangeDate', rangeDate,'showRangeDate',showRangeDate,'rangeDateMls',rangeDateMls)

  const resetState = () => {
    setTypeDate('single')
    setRangeDate(null)
    setSingleDate(null)
    setDateMls(null)
    setRangeDateMls(null)
    setShowSingleDate(null)
    setShowRangeDate(null)
    // setDiscription('')
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
      console.log('timeMls', timeMls)
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
    // console.log('addressFromMap', addressFromMap)
    if(addressFromMap==null||addressFromMap==undefined) {
      setValidAddressErr(true)
    } 
    if(showSingleDate === null && showSingleDate === undefined || showRangeDate === null && showRangeDate === undefined ) {
      setValidDateErr(true)
    } 
    if(addressFromMap!==null&& addressFromMap!==undefined &&
      ((typeDate === 'single' && showSingleDate !== null && showSingleDate !== undefined) || 
      (typeDate === 'range' && showRangeDate !== null && showRangeDate !== undefined))
      ){
        const obj = {
          address: addressFromMap.address,
          coords: {latitude: addressFromMap.latitude, longitude: addressFromMap.longitude},
          date: showSingleDate,
          dateRange: showRangeDate,
          typeDate: typeDate,
          dateMls: dateMls,
          rangeDateMls: rangeDateMls,
        }
        console.log('obj', obj)
        if(route?.params?.data !==null &&route?.params?.data !==undefined &&route.params.data?.action ==='edit' ) {
          console.log('edit route', )
          dispatch(onEditPoint({index: route?.params?.data.index, item: obj, type: route.params.type}))
          if(flag ==='addnewone') {
            if((dataTender.startPoints?.length+dataTender.endPoints?.length) < 10 &&
            dataTender.endPoints?.length < 9) {
              resetState()
              //тут проверить еще - когда нажимаешь сохр и добав еще точку  - надо сбрасывать стейт так как при создании новой 
              //точки будет  диспатч onEditPoint а нужно savePoint
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'CreateRoute',
                  },
                  {
                  name: 'CreatePoint',
                  params: {firstOpen: true, type: route.params?.type}
                },
              ],
              })
              //обнулить стейт(уточнить?)
              //открыть карту и открыть календарь
              setIsCalendarVisible(true)
              setOnOpenMap(true)
            }  else {
              navigation.navigate('CreateRoute')
            }
          } else {
            navigation.navigate('CreateRoute')

          }
        } else {
          console.log('add route', )
          dispatch(savePoint({data: obj, type: route.params.type}))
          if(flag ==='addnewone') {
            if((dataTender.startPoints?.length+dataTender.endPoints?.length) < 9 &&
            dataTender.endPoints?.length < 8) { 
              resetState()
              //обнулить стейт(уточнить?)
              //открыть карту и открыть календарь
              setIsCalendarVisible(true)
              setOnOpenMap(true)
            } else {
              navigation.navigate('CreateRoute')
              // navigation.goBack()
  
            }
          } else {
            navigation.navigate('CreateRoute')
            // navigation.goBack()

          }
        }
      }
  }

  useEffect(()=>{
    if(route?.params?.data !==null &&route?.params?.data !==undefined) {
      if(route.params.data?.action ==='edit') { 
        setStateItem(route?.params?.data)
        let item = route?.params?.data.item
        // console.log('item', item)
        setTypeDate(item.typeDate)
        setAddressFromMap({address: item.address, latitude: item.coords.latitude, longitude: item.coords.longitude})
        if(route.params?.data?.type === 'start') {
          setTextType('загрузки')
        } else {
          setTextType('разгрузки')
        }
        
        if(item.typeDate === 'single') {
          let convertDate = convertUtcToLocalDate(item.dateMls)
          console.log('single','convertDate', convertDate)
          setSingleDate(convertDate) //calendar format
          setShowSingleDate(item.date) //'DD.MM.YYYYY'
          setDateMls(item.dateMls) //utc format
        } else {
          let convertDate1 = convertUtcToLocalDate(item.rangeDateMls[0])
          let convertDate2 = convertUtcToLocalDate(item.rangeDateMls[1])
          console.log('convertDate 1&2', convertDate1,convertDate2)
          setRangeDate([convertDate1,convertDate2]) //calendar format
          setShowRangeDate(item.dateRange) //'DD.MM.YYYYY'
          setRangeDateMls(item.rangeDateMls) //utc format
        }
        
        let dateMin = findSmallestDateLocal(dataTender.startPoints) //'YYYY-MM-DD'
        // let formatDate = formatDateMlsToCalendar(dateMin)
        // console.log('YYYY-MM-DD dateMin', dateMin) 
        setMinDate(dateMin)
        // if(route.params?.type === 'end' && dataTender.startPoints?.length > 0) {
        //   let dateMin = findSmallestDate(dataTender.startPoints)
        //   let formatDate = formatDateMlsToCalendar(dateMin)
        //   console.log('dateMin', dateMin, 'formatDate',formatDate)
        //   setMinDate(formatDate)
        // }
      }
    } else {
      if(route.params?.type === 'start') {
        setTextType('загрузки')
      } else {
        setTextType('разгрузки')
      }
      if(route.params?.type === 'end' && dataTender.startPoints?.length > 0) {
        let dateMin = findSmallestDateLocal(dataTender.startPoints)
        // let formatDate = formatDateMlsToCalendar(dateMin)
        console.log('dateMin', dateMin, )
        setMinDate(dateMin)
        let curDateStateFormatted = dayjs(dateMin).format('DD.MM.YYYY')
        console.log('curDateStateFormatted', curDateStateFormatted)
        setSingleDate(dateMin) //'YYYY-MM-DD' calendar format
        
        setShowSingleDate(curDateStateFormatted)
        const dateUtc = formatToUts(dateMin)
        setDateMls(dateUtc)
        
        
      } else {
        if(singleDate==null) {
          console.log('set singleDate ', singleDate, currentDateState)
          let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
          setShowSingleDate(curDateStateFormatted) //'DD.MM.YYYY'
          setSingleDate(currentDateState) //'YYYY-MM-DD' calendar format
          const dateUtc = formatToUts(currentDateState)
          console.log('dateUtc', dateUtc)
          setDateMls(dateUtc) //utc format

          // if(dataTender.startPoints.length > 0 ) {
            
          //   let dateMin = findSmallestDate(dataTender.startPoints)
          //   let formatDate = formatDateMlsToCalendar(dateMin)
          //   console.log('dateMin', dateMin, 'formatDate',formatDate)
          //   setMinDate(formatDate)
          //   let curDateStateFormatted = dayjs(dateMin).format('DD.MM.YYYY')
          //   console.log('curDateStateFormatted', curDateStateFormatted)
          //   setShowSingleDate(curDateStateFormatted)
          //   setDateMls(dateMin)
          // } else {

          //   let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
          //   setShowSingleDate(curDateStateFormatted)
          //   setDateMls(Date.now())
          // }
        }
      }
    }
  },[route])

  useEffect(()=>{
    if(typeDate === 'single') {
      if(showSingleDate !== null && showSingleDate !== undefined && showSingleDate?.length > 0) {
        //!!! проврка даты или рендж даты
        setValidDateErr(false)
      }
    } else {
      if(showRangeDate !== null && showRangeDate !== undefined && showRangeDate?.length > 0) {
        //!!! проврка даты или рендж даты
        setValidDateErr(false)
      }
    }
  },[showSingleDate,showRangeDate])

  useEffect(()=>{
    if(addressFromMap!==null&& addressFromMap!==undefined) {
      setValidAddressErr(false)
    } 
  },[addressFromMap])

  useEffect(()=>{
    if(route?.params?.firstOpen===true) {
      setIsCalendarVisible(true)
      // setOnOpenMap(true)
    } 
  },[route]) 

  return (
    <>
      <View style={styles.container}>
        <View style={{paddingTop: safeInsets.top}}>
          <HeaderTitleComponent title={`Точка ${textType}`} onPress={()=>navigation.navigate('CreateRoute')} customStyle={{paddingBottom: 0}}/>
        </View>

        <View style={styles.inner}>
          <View style={{position: 'relative', alignItems: 'center',paddingVertical:10}}>
            <AddAddressBtn onPressAddress={handleAddAddress} data={addressFromMap} point='end'/>
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
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата {textType} (дд.мм.гг)</Text>
                    }
                  </>
                  :
                  <>
                    {
                      showRangeDate && showRangeDate?.length > 0 ?
                      <Text style={[mainstyles.text15R, styles.textData]}>{showRangeDate[0]} - {showRangeDate[1]}</Text>
                      : 
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата {textType} (дд.мм.гг)</Text>
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
                <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 5}]}>Выберите дату {textType}!</Text>
                :null
            }
          </View>

        </View>

        <View style={[styles.btnRow,Platform.OS==='android'?{paddingBottom: safeInsets?.bottom}: {}]}>
          <View style={[styles.bottomBtns,]}>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={handleSavePoint}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,}]}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,styles.itemBtnMid,]} onPress={()=>handleSavePoint('addnewone')}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,}]}>Cоздать еще</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={()=>{navigation.navigate('CreateRoute')}}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,}]}>Отменить</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          isCalendarVisible ?
          <View style={[mainstyles.containerModalGgBl,{paddingTop: safeInsets?.top,minHeight: height,}]}>
            <ChooseCalendarDate
              type="multi"
              point={route?.params?.data !==null ? route?.params?.data?.type : route.params.type}
              singleDateState={singleDate}
              rangeDateState={rangeDate}
              showSingleDate={showSingleDate}
              showRangeDate={showRangeDate}
              setShowDate={handleSetShowDate}
              onPressSave={handleSetDate} 
              onClose={handleCloseCalendar}
              minDate={minDate}
            />
          </View>
          :null
        }
        {
          isPromptVisible ?
          <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{paddingTop: safeInsets?.top,minHeight: height,alignItems: 'center',}]}>
            <PromptComponent data={route.params?.type === 'start' ? findJsonObj(jsonDataPrompt,'calendar_popup',calendarPopup): findJsonObj(jsonDataPrompt,'dateEnd',promptCalendarDataEnd)} onPress={()=>{setIsPromptVisible(false)}}/>
          </View>
          :null
        }
      </View>
      
      <Modal
        animationType='fade'
        visible={onOpenMap}
        onRequestClose={()=>setOnOpenMap(false)}
      >
        <MapAddAddress title={`Адрес ${textType}`} addressFromMap={addressFromMap} setAddressFromMap={setAddressFromMap} onClose={()=>setOnOpenMap(false)}/>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inner: {
    // backgroundColor: 'red',
    flex: 1,
    // position: 'relative',
    paddingHorizontal: 20
  },
  textData: {
    color: THEME.GREY800,
    // backgroundColor: 'red'
  },
  //showSingleDate
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
})

export default CreateRoutePointScreen;