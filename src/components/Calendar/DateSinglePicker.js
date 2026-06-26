import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from "react-native";

//packages
import { Calendar, LocaleConfig } from 'react-native-calendars'
import Icon from '@react-native-vector-icons/entypo';

//functions && features && slice

//components

//styles
import { THEME, mainstyles } from '../../theme';
import { normalize } from '../../util/UI/fontsUI';

const DateSinglePicker = ({initialDate,currDate,onPress,customStyle}) => {
  console.log('DateSinglePicker', initialDate,currDate)
  // const [minDate, setSetMinDate] = useState(null)
  // const [initialDateState, setInitialDateState] = useState(null)
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log('selected', selected)
  LocaleConfig.locales['ru'] = {
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: [ 'Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',],
    dayNamesShort: ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', ],
    // today: "Aujourd'hui"
  };
  LocaleConfig.defaultLocale = 'ru';

  const onDayPress = useCallback((day) => {
    console.log('day', day.dateString)
    setSelected(day.dateString);    
    onPress(day.dateString)
    // const formatDay = dayjs(day.dateString).format('DD.MM.YYYY')
    // onPress(formatDay)
  }, []);

  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: THEME.PRIMARY,
        selectedTextColor: '#fff'
      }
    };
  }, [selected])

  useEffect(()=> {
    console.log('useEffect initialDate,currDate:', initialDate,currDate)
    if(currDate !== undefined && currDate !== null) {
      
      // const formatDay = formatDate(currDate)
      // setSelected(formatDay)
      // setSelected(currDate)
      setIsLoading(false)
      //old
      // setInitialDateState()
      // const d = new Date()
      // const INITIAL_DATE = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
      // setSetMinDate(INITIAL_DATE)
    } else {
      setIsLoading(false)
      //old
      // const d = new Date()
      // const INITIAL_DATE = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
      // setSetMinDate(INITIAL_DATE)
      // setSelected(INITIAL_DATE)
    }
  },[initialDate,currDate])

  const THEMECALENDAR  = {
    backgroundColor: '#ffffff',
    calendarBackground: 'ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: 'transparent',
    selectedDayTextColor: '#00adf5',
    todayTextColor: '#61C5EF',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: '#000',
    indicatorColor: '#00adf5',
    // textDayFontFamily: 'monospace',
    // textMonthFontFamily: 'monospace',
    // textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '400',
    textMonthFontWeight: '400',
    textDayHeaderFontWeight: '400',
    textDayFontSize: normalize(16),
    textMonthFontSize: normalize(16),
    textDayHeaderFontSize: normalize(16),
  };

  return (
    <>
        {
          !isLoading ?
          <>
            <Calendar
              disableAllTouchEventsForDisabledDays={true}
              style={[styles.calendarContainer, customStyle]}
              theme={THEMECALENDAR}
              pastScrollRange={0}
              futureScrollRange={2}
              firstDay={1}
              minDate={initialDate}
              markedDates={marked}
              // current={(currDate===null|| currDate===undefined) ? initialDate : selected}
              current={initialDate}
              hideDayNames={false}
              onDayPress={(day) => {onDayPress(day)}}
              // disableAllTouchEventsForInactiveDays={true}
              // customHeaderTitle={(data)=>{console.log('text',data )}}
              // disableArrowLeft={true}
              headerStyle={{backgroundColor: '#fff', paddingTop: 0, paddingBottom: 10,borderBottomWidth: 1, borderBottomColor: THEME.GREY300,}}
              renderArrow={(direction ) => 
                <View>
                  <Icon name={direction == 'left' ? 'chevron-left': 'chevron-right'} size={20}/>
                </View>
              }
            />
          </>
          :<View>
            <ActivityIndicator color={THEME.PRIMARY} size={'large'}/>
          </View>
        }
    </>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 6,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: THEME.GREY300,
    elevation: 4
    // height: '100%'
  },
})

export default DateSinglePicker;