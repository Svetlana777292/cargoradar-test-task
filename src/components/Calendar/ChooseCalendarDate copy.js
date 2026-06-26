import React, { useEffect, useState } from 'react';
import { View,StyleSheet,Text, TouchableOpacity, ScrollView } from "react-native";

//packages
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

//functions && features && slice
import { formatDate } from '../../util/tools';

//components
import DateSinglePicker from './DateSinglePicker';
import BackArrow from '../Svg/BackArrow';
import DateRangePicker from './DateRangePicker';
import { DefaultBtn } from '../Buttons/DefaultBtn';

//styles
import { THEME, mainstyles } from '../../theme';

export const ChooseCalendarDate = (props) => {
  const { type, point,oneDateState,rangeDateState, onPress, onClose, minDate } = props;
  console.log('ChooseCalendarDate ', oneDateState,rangeDateState)
  const currentDateState = useSelector(state=>state.user.currentDate)
  const [isActive,setIsActive] = useState(true)
  //
  
  //выбранные значения
  const [oneDate,setOneDate] = useState(null)
  const [oneDateFormatted,setOneDateFormatted] = useState(null)
  const [currentDateStateFormatted,setCurrentDateStateFormatted] = useState(null)
  const [rangeDate,setRangeDate] = useState(null)
  const [rangeFormatted,setRangeFormatted] = useState(null)
  const [disabled,setDisabled] = useState(true)
  // console.log('!!! oneDate', oneDate)
  // console.log('!!! rangeDate', rangeDate)

  const handleSaveSingleData = (data) => {
    console.log('CCD handleSaveSingleData data ', data)  
    const formatDay = dayjs(data).format('DD.MM.YYYY')
    setOneDate(data)
    setOneDateFormatted(formatDay)
    console.log('formatDay', formatDay)
    setDisabled(false)
  }

  const handleSaveRangeData =(start,end)=> {
    console.log('CCD handleSaveRangeData start end', start,end)    
    let stRange = dayjs(start).format('DD.MM.YYYY')
    let endRange = dayjs(end).format('DD.MM.YYYY')
    //в календарь
    setRangeDate([start,end])
    //для отображения и отправки в фильтры
    setRangeFormatted([stRange, endRange])
    setDisabled(false)
  }

  const handlePress = () => {
    console.log('CCD handlePress ',)
    //конвертировать дату тут
    if(isActive===true &&  oneDate!==null&&oneDate!==undefined) {
      console.log('oneDate', oneDate)
      const formatDay = dayjs(oneDate).format('DD.MM.YYYY')
      onPress(formatDay,'single')

    } else if(isActive===false &&  rangeDate!==null){
      console.log('rangeDate', rangeDate, 'rangeFormatted',rangeFormatted)
      onPress(rangeFormatted,'range')
    }
    onClose()
  }

  useEffect(()=>{
    console.log('useEffect', 'ChooseCalendarDate','currentDateState',currentDateState,'oneDateState',oneDateState,'rangeDateState',rangeDateState )
    let curDateStateFormatted = dayjs(currentDateState).format('DD.MM.YYYY')
    console.log('1 CCD curDateStateFormatted', curDateStateFormatted)
    setCurrentDateStateFormatted(curDateStateFormatted)

    if(oneDateState!==null) {
      let oneDateStateFormatted = formatDate(oneDateState) //YYYY-MM-DD
      console.log('2 CCD oneDateStateFormatted', oneDateStateFormatted)
      if(curDateStateFormatted!==oneDateState) {
        setOneDate(oneDateStateFormatted)
        setOneDateFormatted(oneDateState)
      } else {
        console.log('3 curDateStateFormatted!==oneDateState', curDateStateFormatted!==oneDateState)
        setOneDate(oneDateStateFormatted)
        setOneDateFormatted(oneDateState)
      }
    }
    
    // if(type ==='single') setIsActive(true)
    if(rangeDateState?.length > 0 ){
      console.log('useEffect rangeDateState', rangeDateState)
      const formatStartDay = formatDate(rangeDateState[0])
      const formatEndDay = formatDate(rangeDateState[1])
      console.log('range initial formatStartDay,formatEndDay', formatStartDay,formatEndDay)
      setRangeDate([formatStartDay,formatEndDay])
      setRangeFormatted(rangeDateState)
    }
  },[oneDateState,rangeDateState,currentDateState])
  
  useEffect(()=>{
    if(type==='multi') {
      isActive===false ? setDisabled(true) : setDisabled(true)
    } else {
      // setDisabled(false)
    }
    // if(isActive===false){
      
    // }
  },[isActive,type])

  useEffect(()=>{
    console.log('------rerender CCD------', )
  },[])
  useEffect(()=>{
    console.log('------oneDate',oneDate )
  },[oneDate,rangeDate])
  useEffect(()=>{
    console.log('currentDateStateFormatted',currentDateStateFormatted )
  },[currentDateStateFormatted])
  
  return (
    <View style={{backgroundColor: '#fff',alignSelf: 'center',width: '98%',borderRadius: 20,marginBottom: 75}}>
      <ScrollView style={{backgroundColor: 'transparent', }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onClose}
        style={{backgroundColor: 'transparent', flexDirection: 'row',paddingVertical: 10,paddingTop: 15,alignItems: 'center',paddingHorizontal: 10,}}>
          <BackArrow />
          {
            point==='start' ?
            <Text style={[mainstyles.text16R, {color: THEME.GREY800,paddingLeft: 15}]}>Выбрать дату загрузки</Text>
            :<Text style={[mainstyles.text16R, {color: THEME.GREY800,paddingLeft: 15}]}>Выбрать дату разгрузки</Text>
          }
        </TouchableOpacity>
        {
          type==='multi'?
          <View style={{paddingHorizontal: 10}}>
            <View style={[mainstyles.rowalCjcSb,styles.containerBtn,{}]}>
              <View style={[mainstyles.rowalCjcSb,styles.containerBtnBr,]}/>
                <TouchableOpacity onPress={()=>setIsActive(true)} style={[styles.radioBtn,mainstyles.rowalCjcSb,isActive?styles.radioBtnActive:null]}>
                  {
                    oneDate !==null && oneDate !== undefined ?
                    <Text style={[mainstyles.text14R,styles.textDate,{paddingLeft: 15,}]}>{oneDateFormatted}</Text>
                    :<Text style={[mainstyles.text14R,styles.textDate,{paddingLeft: 15,}]}>{currentDateStateFormatted}</Text>
                  }
                  <View style={[styles.radioBtnCircleContainer]}>
                    <View style={[styles.radioBtnOut]}>
                      <View style={[styles.radioBtnIn,{backgroundColor: isActive?THEME.PRIMARY:THEME.GREY300}]}/>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setIsActive(false)} style={[styles.radioBtn,mainstyles.rowalCjcSb,isActive?null:styles.radioBtnActive]}>
                  {
                    rangeFormatted!==null&&rangeFormatted!==undefined?
                    <Text style={[mainstyles.text14R,styles.textDate,{paddingLeft: 15,}]}>{rangeFormatted[0]} - {rangeFormatted[1]}</Text>
                    :<Text style={[mainstyles.text14R,styles.textDate,{paddingLeft: 15,}]}>Диапазон</Text>
                  }
                  <View style={[styles.radioBtnCircleContainer]}>
                    <View style={[styles.radioBtnOut]}>
                      <View style={[styles.radioBtnIn,{backgroundColor: isActive?THEME.GREY300:THEME.PRIMARY}]}/>
                    </View>
                  </View>
                </TouchableOpacity>
            </View>

          </View>
          :null
        }
        {
          isActive ?
          <DateSinglePicker
            initialDate={point==='end' && minDate!==null ? minDate : currentDateState} 
            currDate={oneDate} 
            onPress={handleSaveSingleData} 
            onClose={onClose} 
          />
          :
          <>
            {
              !isActive ?
              <DateRangePicker
                minDate={point==='end' && minDate!==null? minDate : currentDateState}
                initialRange={rangeDate}
                onSuccess={handleSaveRangeData}
                theme1={{ markColor: THEME.PRIMARY, markTextColor: THEME.GREY300, markColor1: THEME.GREY100 }} 
              />
              : null
            }
          </>
        }
        
        <DefaultBtn title={'Выбрать'} disabled={disabled} onPress={handlePress} customStyle={{alignSelf: 'center', marginVertical: 20}}/>
      
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 6,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: THEME.GREY300,
    elevation: 4
    // height: '100%'
  },
  containerBtn: {
    // height: 50,
    // backgroundColor: 'orange',
    width: '100%',
    marginBottom:15,
    // borderRadius: 30,
    // borderWidth:1,
    // borderColor:THEME.GREY300,
    padding:0
  },
  containerBtnBr: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    marginBottom:15,
    borderRadius: 30,
    borderWidth:1,
    borderColor:THEME.GREY300,
    padding:0
    // paddingVertical: 10
  },
  radioBtn: {
    width: '50%',
    borderRadius: 30,
    borderColor:'#fff',
    padding:6,    
  }, 
  radioBtnActive: {
    // backgroundColor: 'pink',
    borderWidth:2,
    borderColor:THEME.PRIMARY,   
  }, 
  radioBtnCircleContainer: {
    // backgroundColor: 'red',    
    justifyContent: 'center',
    alignItems: 'center', 
    // 
  },
  radioBtnOut: {
    // backgroundColor: 'green',
    width: 32,
    height: 32,
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: THEME.GREY300,
    borderWidth:1,
    padding:2
  }, 
  radioBtnIn: {
    backgroundColor: THEME.GREY300,
    width: 24,
    height: 24,
    borderRadius:20,
  },
  textDate: {
    // backgroundColor: 'red',
    width: '70%',
    
  },
})