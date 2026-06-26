import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView, Platform, KeyboardAvoidingView, Modal } from 'react-native';

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
import { height, promptCalendarDataEnd } from '../../util/helperConst';
import { onEditPoint, savePoint } from '../../store/features/editTenderSlice';
import { findJsonObj, findLargestDate, findMinDateOfTender, findSmallestDate, findSmallestDateUtc, formatDateMlsToCalendar, formatDateToMls } from '../../util/tools';

//styles
import { THEME, mainstyles } from '../../theme';
import { convertToNextMidnightUTC, convertToYYYYMMDD, convertUtcToLocalDate, formatToUts } from '../../util/dateFormats';


const EditEndPointScreen = ({route, navigation}) => {
  console.log('EditEndPointScreen route', )
  const currentDateState = useSelector(state=>state.user.currentDate)
  const dataTender = useSelector(state=> state.editTender.tender)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
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
  const [description, setDiscription] = useState('')
  const [onOpenMap, setOnOpenMap] = useState(false)
  const [addressFromMap,setAddressFromMap] = useState(null)
  const [isOpenAskSource,setIsOpenAskSource] = useState(false)
  const [isCalendarVisible,setIsCalendarVisible] = useState(false)
  const [isPromptVisible,setIsPromptVisible] = useState(false)
  const [validDateErr,setValidDateErr] = useState(false)
  // const [isDisable,setIsDisable] = useState(true)
  const [validAddressErr,setValidAddressErr] = useState(false)
  const [minDate,setMinDate] = useState(null)
  const dispatch = useDispatch()

  const resetState = () => {
    setTypeDate('single')
    setRangeDate(null)
    setSingleDate(null)
    setDateMls(null)
    setRangeDateMls(null)
    setShowSingleDate(null)
    setShowRangeDate(null)
    setDiscription('')
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
      //добавлять милисикунды 
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

    // if(type==='single') {
    //   setSingleDate(data)
    //   //!!!конверт-ть в миллисикунды отдельный стейт
    //   const timeMls = formatDateToMls(data)
    //   setDateMls(timeMls)
    //   setRangeDate(null)
    //   setRangeDateMls(null)
    // } else {  
    //   setRangeDate(data)
    //   //добавлять милисикунды 
    //   //!!!конверт-ть в миллисикунды отдельный стейт
    //   let startDate = formatDateToMls(data[0])
    //   let endDate = formatDateToMls(data[1])
    //   setRangeDateMls([startDate,endDate])
    //   setSingleDate(null)
    //   setDateMls(null)
    // }
    // setTypeDate(type)
  }

  const handleSavePoint = (flag) => {
    // console.log('addressFromMap', addressFromMap)
    if(addressFromMap==null||addressFromMap==undefined) {
      setValidAddressErr(true)
    } 
    if(singleDate === null && singleDate === undefined || rangeDate === null && rangeDate === undefined ) {
      setValidDateErr(true)
    }
    if(addressFromMap!==null&& addressFromMap!==undefined &&
      ((typeDate === 'single' && singleDate !== null && singleDate !== undefined) || 
      (typeDate === 'range' && rangeDate !== null && rangeDate !== undefined))
      ){
        const obj = {
          address: addressFromMap.address,
          coords: {latitude: addressFromMap.latitude, longitude: addressFromMap.longitude},
          date: showSingleDate,
          dateRange: showRangeDate,
          typeDate: typeDate,
          dateMls: dateMls,
          rangeDateMls: rangeDateMls,
          description: description,
        }
        console.log('obj', obj)
        if(route?.params?.data?.item.hasOwnProperty('id')) {
          obj.id = route?.params?.data.item.id
        }
        if(route?.params?.data !==null &&route?.params?.data !==undefined &&route.params.data?.action ==='edit' ) {
          console.log('edit route', )
          dispatch(onEditPoint({index: route?.params?.data.index, item: obj, type: 'end'}))
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
                    name: 'EditTender',
                  },
                  {
                  name: 'EditEndTender',
                  params: {firstOpen: true}
                },
              ],
              })
              //обнулить стейт(уточнить?)
              //открыть карту и открыть календарь
              setIsCalendarVisible(true)
              setOnOpenMap(true)
            }  else {
              navigation.navigate('EditTender')
            }
          } else {
            navigation.navigate('EditTender')

          }
        } else {
          console.log('add route', )
          dispatch(savePoint({data: obj, type: 'end'}))
          if(flag ==='addnewone') {
            if((dataTender.startPoints?.length+dataTender.endPoints?.length) < 9 &&
            dataTender.endPoints?.length < 8) { 
              resetState()
              //обнулить стейт(уточнить?)
              //открыть карту и открыть календарь
              setIsCalendarVisible(true)
              setOnOpenMap(true)
            } else {
              navigation.navigate('EditTender')
              // navigation.goBack()
  
            }
          } else {
            navigation.navigate('EditTender')
            // navigation.goBack()

          }
        }
      }
  }

  useEffect(()=>{
    if(route?.params?.data !==null && route?.params?.data !==undefined) {
      if(route.params.data?.action ==='edit') { 
        setStateItem(route?.params?.data)
        let item = route?.params?.data.item
        console.log('item', item)

        setTypeDate(item.typeDate)
        item.weight ? setDiscription(item.description) : null
        setAddressFromMap({address: item.address,latitude: item.coords.latitude, longitude: item.coords.longitude})

        //данные с сервера поэтому надо переконвертирывать dateMls в utc
        if(item.typeDate === 'single') {
          let convertDate = convertUtcToLocalDate(item.dateMls) //calendar format
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
        
        //!25.03-старый вариант выбора самой ранней даты загрузки
        let dateMin = findSmallestDateUtc(dataTender.startPoints) //'YYYY-MM-DD'
        // let formatDate = formatDateMlsToCalendar(dateMin)
        console.log('YYYY-MM-DD dateMin', dateMin) 
        setMinDate(dateMin)
      }
    } else {
      if(singleDate==null) {
        
        if(dataTender.startPoints.length > 0) {
          let dateMin = findSmallestDateUtc(dataTender.startPoints) //'YYYY-MM-DD'
          // let formatDate = formatDateMlsToCalendar(dateMin)
          console.log('dataTender.startPoints.length > 0 dateMin', dateMin, )
          setMinDate(dateMin) //min date in calendar 'YYYY-MM-DD' calendar format
          let curDateStateFormatted = dayjs(dateMin).format('DD.MM.YYYY')
          console.log('curDateStateFormatted', curDateStateFormatted)

          setSingleDate(curDateStateFormatted) //'YYYY-MM-DD' calendar format
          setShowSingleDate(curDateStateFormatted) //'DD.MM.YYYY'

          const dateUtc = formatToUts(dateMin)
          console.log('dateUtc', dateUtc)
          setDateMls(dateUtc) //utc format

        } else {
          let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
          setShowSingleDate(curDateStateFormatted) //'DD.MM.YYYY'
          setSingleDate(currentDateState) //calendar format
          setDateMls(currentDateState) //utc format
        }
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{flex:1,}}
    >
      <View style={styles.container}>
        <View style={{paddingTop: safeInsets.top}}>
          <HeaderTitleComponent title={'Точка разгрузки'} onPress={()=>navigation.navigate('EditTender')} customStyle={{paddingBottom: 0}}/>
        </View>

        <ScrollView style={styles.inner}>
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
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата разгрузки (дд.мм.гг)</Text>
                    }
                  </>
                  :
                  <>
                    {
                      showRangeDate && showRangeDate?.length > 0 ?
                      <Text style={[mainstyles.text15R, styles.textData]}>{showRangeDate[0]} - {showRangeDate[1]}</Text>
                      : 
                      <Text style={[mainstyles.text15R, styles.textData]}>Дата разгрузки (дд.мм.гг)</Text>
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
                <Text style={[mainstyles.text12R, {color: THEME.REDERR,paddingTop: 5}]}>Выберите дату разгрузки!</Text>
                :null
            }
          </View>

          <View style={[styles.desctWrapper,mainstyles.pH15]}>
            <TextInput 
              style={[mainstyles.text14R,styles.desctInput,styles.whiteBlock,mainstyles.shadowG5r5,mainstyles.inputMultiline5]}
              blurOnSubmit={true}
              textAlignVertical='top'
              placeholder='Информация про разгрузку'
              placeholderTextColor={THEME.GREY900}
              value={description}
              onChangeText={setDiscription}
              onBlur={()=>Keyboard.dismiss()}
              multiline={true}
              numberOfLines={5}
              maxLength={300}
            />
            <Text style={[mainstyles.text14R,styles.inputCounterStr]}>{description?.length >0? description?.length: 0} | 300</Text>

          </View>

        </ScrollView>

        <View style={[styles.btnRow,Platform.OS==='android'?{paddingBottom: safeInsets?.bottom}: {}]}>
          <View style={[styles.bottomBtns,]}>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={handleSavePoint}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Сохранить точку разгрузки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,styles.itemBtnMid,]} onPress={()=>handleSavePoint('addnewone')}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Создать еще одну точку разгрузки</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemBtn,]} onPress={()=>{navigation.navigate('EditTender')}}>
              <Text style={[mainstyles.text14M, {color: THEME.PRIMARY,textAlign: 'center'}]}>Отменить или назад</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          isCalendarVisible ?
          <View style={[mainstyles.containerModalGgBl,{paddingTop: safeInsets?.top,minHeight: height,}]}>
            <ChooseCalendarDate
              type="multi"
              point='end'
              rangeDateState={rangeDate}
              singleDateState={singleDate}
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
            <PromptComponent data={findJsonObj(jsonDataPrompt,'dateEnd',promptCalendarDataEnd)} onPress={()=>{setIsPromptVisible(false)}}/>
          </View>
          :null
        }
      </View>
      <Modal
        animationType='fade'
        visible={onOpenMap}
        onRequestClose={()=>setOnOpenMap(false)}
      >
        <MapAddAddress title={'Адрес разгрузки'} addressFromMap={addressFromMap} setAddressFromMap={setAddressFromMap} onClose={()=>setOnOpenMap(false)}/>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    zIndex: 99
    // height: 200
  },
  inner: {
    // backgroundColor: 'red',
    // flex: 1,
    // // position: 'relative',
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
    right: 20
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
})

export default EditEndPointScreen;