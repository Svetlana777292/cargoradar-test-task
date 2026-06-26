import React, { useState, useEffect, } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, } from 'react-native';

//packages
import Icon from '@react-native-vector-icons/entypo';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from 'dayjs';

//functions && features && slice
import { objFiltering, setInAllStartPoints,setMapVisible,setHiddenTenderVisible,setIsActiveTab,setShowTnWtMyActv, resetObjFiltering } from '../store/features/filtersSlice';
import { datePopup, distanceToUser, height, intermPoints, } from '../util/helperConst';
import { findJsonObj, rangeFormatDate, rangeFormatDateToCalend } from '../util/tools';

//components
import RangeSlider from '../components/RangeSlider/RangeSlider';
import { Switch } from '../components/Switch';
import { PromptButton } from '../components/Buttons/PromptButton';
import IconCalendar from '../components/Svg/IconCalendar';
import { DefaultBtn } from '../components/Buttons/DefaultBtn';
import { DefaultBtnOutline } from '../components/Buttons/DefaultBtnOutline';
import { MapAddAddress } from '../components/Modal/MapAddAddress';
import { ChooseCalendarDate } from '../components/Calendar/ChooseCalendarDate';
import PromptComponent from '../components/Modal/PromptComponent';

//styles
import { mainstyles, THEME } from '../theme';

export const FilterScreen = ({route, navigation}) => {
  console.log('FilterScreen:', )
  const safeInsets = useSafeAreaInsets();
  const {objDataFiltering, inAllStartPoints, mapVisible, hiddenTenderVisible,showTnWithMyActv,isActiveTab} = useSelector(state => state.filters)
  const currentDateState = useSelector(state=>state.user.currentDate)
  const currAddress = useSelector(state=>state.user.currentPositionWithAddress)
  const jsonDataPrompt = useSelector(state=>state.jsoninfo.jsonDataPrompt)
  // console.log('objDataFiltering',objDataFiltering,)
  const [currentDateStateFormatted,setCurrentDateStateFormatted] = useState(null)
  //switch btn
  const [inAllStPoints,setInAllStPoints] = useState(true)
  const [showOnMap,setShowOnMap] = useState(false)
  const [showHidTender,setShowHidTender] = useState(false)
  const [showTenderWithMyActivity,setShowTenderWithMyActivity] = useState(false)

  //inputs
  const [dataFilters, setDataFilters] = useState({
    weightMin: '',
    weightMax: '',
    volumeMin: '',
    volumeMax: '',
    priceMin: '',
    priceMax: '',
  })

  //range slider
  const [radius, setRadius]=useState([0])
  const [addressFromMap, setAddressFromMap] = useState(null)

  //date
  const [typeDate, setTypeData] = useState('range')
  const [singleDate, setSingleDate] = useState(null)
  const [rangeDate, setRangeDate] = useState(null)
  const [showSingleDate, setShowSingleDate] = useState(null) //'DD.MM.YYYYY'
  const [showRangeDate, setShowRangeDate] = useState(null)//'DD.MM.YYYYY'
  // console.log('-- singleDate', singleDate, '-- rangeDate',rangeDate)
  // console.log('-- showSingleDate', showSingleDate, '-- showRangeDate',showRangeDate)
  //open Components modal
  const [isOpenMapAddress, setIsOpenMapAddress] = useState(false)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [isPromptVisible, setIsPromptVisible] = useState(false)
  const [isPromptVisibleAddress, setIsPromptVisibleAddress ] = useState(false)
  const [isPromptVisiblePoint, setIsPromptVisiblePoint] = useState(false)

  const dispatch = useDispatch()

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false)
  }
  

  const handleReset = () => {
    dispatch(resetObjFiltering(null))
    dispatch(setMapVisible(false))
    dispatch(setHiddenTenderVisible(false))
    dispatch(setShowTnWtMyActv(false))
    dispatch(setInAllStartPoints(true))    
    setDataFilters({
      weightMin: '',
      weightMax: '',
      volumeMin: '',
      volumeMax: '',
      priceMin: '',
      priceMax: '',
    })
    setAddressFromMap(currAddress)
    setRadius([0])
    setTypeData('range')
    //TODO при нажатии сбросить и потом сразу применить - даты в rangeArrCl будут датами для календаря - а надо что бы были обработаны
    //если очистил - то убирать все отображения дат 
    //в фун-и применить - убрать даты если они пустые - не фильтровать по ним
    //в юз эфекте при обработке уже имеющихся фильтров делать проверку на наличие дат

    //или сделать отдельный календарь что бы не было мороки с датами и сбросом

    let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
    setSingleDate(currentDateState) //calendar format
    setShowSingleDate(curDateStateFormatted)
    
    const rangeArr = rangeFormatDate()
    // console.log('rangeArr', rangeArr)
    const rangeArrCl = rangeFormatDateToCalend()
    console.log('rangeArrCl', rangeArrCl)
    setShowRangeDate(rangeArr)
    //todo календарный формат для setRangeDate
    setRangeDate(rangeArrCl)
  }

  const handleSetDate = (data,type) => {
    // console.log('handleSetDate data:', data, 'type:',type)
    if(type==='single') {
      setSingleDate(data) //calendar format
    } else {  
      setRangeDate(data) //calendar format
    }
    setTypeData(type)
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

  const handleOnPressTopTab = () => {
    navigation.navigate('Search')
  }

  const handleFilterTenders = async(obj, radius, ) => {
    console.log('handleFilterTenders :', )
    // console.log('11', typeDate == 'single' ? (singleDate==currentDateStateFormatted ? true : false) : rangeDate!==null)
    console.log('1', rangeDate,typeDate)
    // if(
    //   obj.weightMin?.trim().length == 0 &&
    //   obj.weightMax?.trim().length == 0 &&
    //   obj.volumeMin?.trim().length == 0 &&
    //   obj.volumeMax?.trim().length == 0 &&
    //   obj.priceMin?.trim().length == 0 &&
    //   obj.priceMax?.trim().length == 0 &&
    //   (typeDate == 'single' ? (singleDate==currentDateStateFormatted ? true : false) : rangeDate!==null) &&
    //   radius[0] == 0 &&
    //   showOnMap === mapVisible &&
    //   showHidTender == hiddenTenderVisible
    //   ) {
    //     console.log('нет фильтров');
    //     alert("заполните фильтры")
    //     return
    //   }
          
    showOnMap !== mapVisible ? dispatch(setMapVisible(showOnMap)) : null
    showHidTender!== hiddenTenderVisible ? dispatch(setHiddenTenderVisible(showHidTender)) : null
    showTenderWithMyActivity!== showTnWithMyActv ? dispatch(setShowTnWtMyActv(showTenderWithMyActivity)) : null
    inAllStPoints !== inAllStartPoints ? dispatch(setInAllStartPoints(inAllStPoints)) : null

    const searchData = obj
    const weightMin = searchData.weightMin.trim().length > 0 ? searchData.weightMin.trim() : null
    const weightMax = searchData.weightMax.trim().length > 0 ? searchData.weightMax.trim() : null
    const volumeMin = searchData.volumeMin.trim().length > 0 ? searchData.volumeMin.trim() : null
    const volumeMax = searchData.volumeMax.trim().length > 0 ? searchData.volumeMax.trim() : null
    const priceMin = searchData.priceMin.trim().length > 0 ? searchData.priceMin.trim(): null
    const priceMax = searchData.priceMax.trim().length > 0 ? searchData.priceMax.trim(): null

    let addressCoords = null
    addressCoords = addressFromMap

    //вид отображения картой - отдельный диспатч 
    //поиск промежуточных точек - в объект
    //показать скрытые заказы - в объект

    //TODO проверить что приходит в фильтры по датам - в заявках будут даты utc 0 - так что надо передавать соответств-й формат а не календарный
    const objData = {
      weightMin: weightMin,
      weightMax: weightMax,
      volumeMin: volumeMin,
      volumeMax: volumeMax,
      priceMin: priceMin,
      priceMax: priceMax,
      addressCoords: addressCoords,
      typeDate: typeDate,
      rangeDate: rangeDate, //["2025-05-07","2025-05-17"], //todo - уже формат utc
      singleDate: singleDate, //"2025-05-07", //todo - уже формат utc
      radius: radius[0],
      inAllStPoints: inAllStPoints,
      showHidTender: showHidTender,
    }

    // console.log('objData', JSON.stringify(objData,null,2));
    console.log('objData', objData);

    dispatch(objFiltering(objData))
    dispatch(setIsActiveTab(0))
    navigation.navigate('Search')
  }

  useEffect(()=> {    
    if(objDataFiltering!==null) {
      // console.log('objDataFiltering', objDataFiltering)

      setShowOnMap(mapVisible)
      setInAllStPoints(inAllStartPoints)
      setShowHidTender(hiddenTenderVisible)
      setShowTenderWithMyActivity(showTnWithMyActv)

      setDataFilters({
        weightMin: objDataFiltering.weightMin!==null&&objDataFiltering.weightMin!==undefined?objDataFiltering.weightMin:'',
        weightMax: objDataFiltering.weightMax!==null&&objDataFiltering.weightMax!==undefined?objDataFiltering.weightMax:'',
        volumeMin: objDataFiltering.volumeMin!==null&&objDataFiltering.volumeMin!==undefined?objDataFiltering.volumeMin:'',
        volumeMax: objDataFiltering.volumeMax!==null&&objDataFiltering.volumeMax!==undefined?objDataFiltering.volumeMax:'',
        priceMin: objDataFiltering.priceMin!==null&&objDataFiltering.priceMin!==undefined?objDataFiltering.priceMin:'',
        priceMax: objDataFiltering.priceMax!==null&&objDataFiltering.priceMax!==undefined?objDataFiltering.priceMax:'',
      })

      setTypeData(objDataFiltering?.typeDate)
      setRadius(objDataFiltering.radius? [objDataFiltering.radius]: [0])
      objDataFiltering?.addressCoords!==null ? setAddressFromMap(objDataFiltering?.addressCoords) : null


      //TODO - проверить что бы даты устанавливались корректно 
      
      let dateformatted = dayjs(objDataFiltering?.singleDate).format('DD.MM.YYYY')
      if(objDataFiltering.typeDate == 'single') {
        setSingleDate(objDataFiltering?.singleDate) //calendar format
        setShowSingleDate(dateformatted)
        // objDataFiltering?.singleDate!==null ? setSingleDate(objDataFiltering?.singleDate) : setSingleDate(curDateStateFormatted)
        
      } else {
        setRangeDate(objDataFiltering?.rangeDate)
        let convertDate1 = dayjs(objDataFiltering?.rangeDate[0]).format('DD.MM.YYYY')
        let convertDate2 = dayjs(objDataFiltering?.rangeDate[1]).format('DD.MM.YYYY')
        console.log('convertDate 1&2', convertDate1,convertDate2)
        setShowRangeDate([convertDate1,convertDate2]) //calendar format
        // objDataFiltering?.rangeDate!==null ? setRangeDate(objDataFiltering?.rangeDate) : setRangeDate(null)
      }
      
    } else {
      if(singleDate==null) {
        console.log('set setSingleDate ', singleDate)
        let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
        setSingleDate(currentDateState) //calendar format
        setShowSingleDate(curDateStateFormatted)
      }
      if(addressFromMap==null) {
        console.log('set setAddressFromMap ', currAddress)
        setAddressFromMap(currAddress)
      }
      // if(currentDateStateFormatted==null) {
      //   let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
      //   setCurrentDateStateFormatted(curDateStateFormatted)
      // }
      if(rangeDate==null){
        //значения 'DD.MM.YYYY' формата, в календаре будут переводится в нужный формат
        const rangeArr = rangeFormatDate()
        // console.log('rangeArr', rangeArr)
        const rangeArrCl = rangeFormatDateToCalend()
        console.log('rangeArrCl', rangeArrCl)
        setShowRangeDate(rangeArr)
        //todo календарный формат для setRangeDate
        setRangeDate(rangeArrCl)
      }
    }
  },[])


  useEffect(()=>{
   console.log('------------------render FilterScreen-----------------');
  },[])
  
  return (
    <View style={[styles.container,]} >
      <View style={{ position: 'relative',paddingTop: safeInsets.top, backgroundColor: 'transparent'}}>
        <Text style={[mainstyles.text18R,{color:THEME.PRIMARY,textAlign: 'center',paddingVertical: 5, backgroundColor: 'transparent'}]}>Настройки</Text>
        <TouchableOpacity style={{position: 'absolute', top: safeInsets.top, right: 0, width: 40, height:40,backgroundColor: 'transparent'}} onPress={handleOnPressTopTab}>
          <Icon name='cross' size={35} color={THEME.GREY300}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.wrapper} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
        <View style={[mainstyles.rowalCjcSb,mainstyles.pB15,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,{width: '60%'}]}>Поиск промежуточных точек маршрута</Text>
          <View style={[mainstyles.rowalC]}>
            <PromptButton onPress={()=>{setIsPromptVisiblePoint(true)}} customStyles={{marginRight: 15}}/>
            <Switch value={inAllStPoints} setValue={setInAllStPoints}/>
          </View>

        </View>
        <View style={[mainstyles.rowalCjcSb,mainstyles.pB15,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,{width: '60%'}]}>Вид отображения картой</Text>
          <Switch value={showOnMap} setValue={setShowOnMap}/>
        </View>
        <View style={[mainstyles.rowalCjcSb,mainstyles.pB15,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,{width: '60%'}]}>Показать скрытые заказы</Text>
          <Switch value={showHidTender} setValue={setShowHidTender}/>
        </View>
        <View style={[mainstyles.rowalCjcSb,mainstyles.pB15,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,{width: '60%'}]}>Заказы только с моими откликами</Text>
          <Switch value={showTenderWithMyActivity} setValue={setShowTenderWithMyActivity}/>
        </View>

        <View style={[mainstyles.rowalC, mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,styles.rowWithInput]}>Вес(кг):</Text>
          <Text style={[mainstyles.text14R,styles.textForInput]}>от</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              weightMin: value
            })}
            value={dataFilters.weightMin}
            keyboardType='number-pad'
          />
          <Text style={[mainstyles.text14R,styles.textForInput]}>до</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              weightMax: value
            })}
            value={dataFilters.weightMax}
            keyboardType='number-pad'
          />
        </View>
  
        <View style={[mainstyles.rowalC,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,styles.rowWithInput]}>Объем(м3):</Text>
          <Text style={[mainstyles.text14R,styles.textForInput]}>от</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              volumeMin: value
            })}
            value={dataFilters.volumeMin}
            keyboardType='number-pad'
          />
          <Text style={[mainstyles.text14R,styles.textForInput]}>до</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              volumeMax: value
            })}
            value={dataFilters.volumeMax}
            keyboardType='number-pad'
          />
        </View>
  
        <View style={[mainstyles.rowalC,mainstyles.pB20,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,styles.rowWithInput]}>Цена(руб):</Text>
          <Text style={[mainstyles.text14R,styles.textForInput]}>от</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              priceMin: value
            })}
            value={dataFilters.priceMin}
            keyboardType='number-pad'
          />
          <Text style={[mainstyles.text14R,styles.textForInput]}>до</Text>
          <TextInput 
            style={styles.input}
            placeholder="0"
            onChangeText={(value) => setDataFilters({
              ...dataFilters,
              priceMax: value
            })}
            value={dataFilters.priceMax}
            keyboardType='number-pad'
          />
        </View>

        <View style={[mainstyles.rowalC,mainstyles.pB10,mainstyles.pH10]}>
          <Text style={[mainstyles.text14R,styles.textDefault,{width: '85%',}]}>Расстояние от текущей позиции:   <Text style={[mainstyles.text14R,styles.textDefault,{textAlign: 'center'}]}><Text style={[mainstyles.text18R,{color:THEME.GREY600},]}>{radius}</Text> км</Text></Text>
          <PromptButton onPress={()=>{setIsPromptVisibleAddress(true)}} customStyles={{width: '15%', alignItems: 'flex-end',}}/>
        </View>
        <View style={[mainstyles.pB20, mainstyles.pH10,{}]}>
          <TouchableOpacity style={styles.currLocAddressBtn} 
            onPress={()=>setIsOpenMapAddress(true)}
            // onPress={()=>setopenT(true)}
            >
            {addressFromMap!==null?
              <Text numberOfLines={1} style={[mainstyles.text14R,styles.textDefault,{textAlign: 'center',paddingHorizontal:3}]}>{addressFromMap?.address}</Text>
              : <Text numberOfLines={1} style={[mainstyles.text14R,styles.textDefault,{textAlign: 'center',paddingHorizontal:3}]}>Разрешить отслеживание текущей геопозиции</Text>
            }
            <View style={styles.currLocAddressCloseBtn}>
              <Icon name={'cross'} size={12} color={'#fff'}/>
            </View>
          </TouchableOpacity>
          <RangeSlider from={0} to={600} value={radius} setValue={setRadius} valueSuffix={'км'}/>
        </View>
        
        <View style={[mainstyles.rowalCjcSb,mainstyles.pH10,{paddingBottom: 100}]}>
          <Text style={[mainstyles.text14R,styles.textDefault,]}>Дата загрузки</Text>

          <View style={[styles.calendar,mainstyles.rowalCjcSb]} >
            <TouchableOpacity onPress={()=>setIsCalendarVisible(true)} style={[{backgroundColor:'transparent',paddingRight: 5,paddingVertical:10,paddingLeft: 15}]}>
              <IconCalendar/>
            </TouchableOpacity>
            <View style={[mainstyles.rowalCjcSb, {backgroundColor:'transparent',paddingVertical:10,paddingRight:15}]}>
              {
                typeDate==='single'?
                <>
                {
                  showSingleDate!==null?
                  <Text onPress={()=>setIsCalendarVisible(true)} style={[mainstyles.text14R,styles.textDate]}>{showSingleDate}</Text>
                  :null
                }
                </>
                :
                <>
                {
                  showRangeDate!==null&&showRangeDate?.length>0?
                  <Text onPress={()=>setIsCalendarVisible(true)} style={[mainstyles.text14R,styles.textDate]}>{showRangeDate[0]} - {showRangeDate[1]}</Text>
                  : null
                }
                </>
              }
              <PromptButton onPress={()=>{setIsPromptVisible(true)}} customStyles={{backgroundColor: 'transparent', alignItems: 'flex-end',}}/>
            </View>
          </View>

        </View>

      </ScrollView>
      <View style={[mainstyles.rowalCjcSb,{width: '100%', paddingHorizontal: 15,position: 'absolute', bottom: 20}]}>
        <DefaultBtnOutline title={'Применить'} onPress={()=>handleFilterTenders(dataFilters,radius)} customStyle={{width: '45%'}}/>
        <DefaultBtn title={'Очистить'} onPress={handleReset} customStyle={{width: '45%'}}/>
      </View>

      {
        isOpenMapAddress?
        <View style={{height: height+safeInsets?.top,position: 'absolute',top:0,zIndex: 999,width: '100%',backgroundColor: '#fff'}}>
          <MapAddAddress
            title={'Мое местоположение'}
            addressFromMap={addressFromMap}
            setAddressFromMap={setAddressFromMap}
            onClose={()=>setIsOpenMapAddress(false)}
            type='filter'
            />
        </View>
        : null
      }
      {
        isCalendarVisible? 
        <View style={[mainstyles.containerModalGgBl,{minHeight: height+safeInsets?.top, paddingTop: safeInsets.top,zIndex: 999}]}>
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

            // oneDateState={oneDateCalendar} 
            // rangeDateState={rangeDate} 
            // onPress={handleSetDate} 
            // onClose={()=>setIsCalendarVisible(false)}
          />
        </View>
        :null
      }
      {
        isPromptVisible ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'date_popup',datePopup)} onPress={()=>{setIsPromptVisible(false)}}/>
        </View>
        :null
      }
      {
        isPromptVisibleAddress ?
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'distanceToUser',distanceToUser)} onPress={()=>{setIsPromptVisibleAddress(false)}}/>
        </View>
        :null
      }
      {/* подсказка промежуточные точки */}
      {
        isPromptVisiblePoint ? 
        <View style={[mainstyles.containerModalGgBl,mainstyles.alCjcC,{minHeight: height+safeInsets?.top,height:height+safeInsets?.top, zIndex: 999,paddingTop: safeInsets.top,}]}>
          <PromptComponent data={findJsonObj(jsonDataPrompt,'intermediate_points_popup',intermPoints)} onPress={()=>{setIsPromptVisiblePoint(false)}}/>
        </View>
        :null
      }
    </View> //container
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    position: 'relative',
    // backgroundColor: 'red',
    backgroundColor: '#fff',
    paddingBottom: 65
  },
  wrapper: {
    // minHeight: height-150,
    // flex:1,
    handleFilterTenders: '100%',
    // backgroundColor: 'blue',
    paddingTop: 20,

  },
  textDefault: {
    color: THEME.GREY900,
    lineHeight: 18,
  },
  rowWithInput: {
    width: '30%',
    paddingBottom: 28
  },
  input: {
    width: '27%',
    height: 30,
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: THEME.GREY300,
    backgroundColor: THEME.GREY100,
    borderWidth: 1,
  },
  textForInput: {
    width: '8%',
    paddingRight: 4,
    color: THEME.GREY600,
  },
  textForInput: {
    width: '8%',
    paddingHorizontal: 4,
    color: THEME.GREY600,
  },
  calendar: {
    // backgroundColor: 'pink',
    borderRadius: 30,    
    borderWidth:1,
    borderColor:THEME.GREY400,
    backgroundColor: '#fff',
  },
  currLocAddressBtn: {
    width: '100%',
    backgroundColor: THEME.GREY300,
    borderRadius: 15,
    paddingVertical: 5,
    position: 'relative'
  },
  currLocAddressCloseBtn: {
    width:12,
    height:12,
    borderRadius:10,
    backgroundColor:THEME.GREY400,
    position: 'absolute',
    right:0,
    top:-5
  },
  textDate: {
    color: THEME.GREY900,
    lineHeight: 18,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    minWidth:'20%',
  },
});



  // useEffect(() => {
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, [])

  //если нет данных кнопка найти заблокирована
  // useEffect(() => {
  //   if(dataFilters.weightMin.length == 0 &&
  //     dataFilters.weightMax.length == 0 &&
  //     dataFilters.volumeMin.length == 0 &&
  //     dataFilters.volumeMax.length == 0 &&
  //     dataFilters.priceMin.length == 0 &&
  //     dataFilters.priceMax.length == 0 &&
  //     dateTender.startDateCheck == false &&
  //     coordinatesFrom.length == 0 &&
  //     radius == 0) {
  //     setDisabledBtnSimpleSearch(true)
  //   } else setDisabledBtnSimpleSearch(false)
  // },[disBtnSimplSherch, dataFilters, dateTender, coordinatesFrom, radius])

  // useEffect(()=> {
  //   setAddress(addressFromMap)
  // },[addressFromMap])

