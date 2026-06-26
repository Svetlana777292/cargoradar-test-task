import React, { Component } from 'react'
import { View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { THEME } from '../../theme';
import Icon from '@react-native-vector-icons/entypo';
import { normalize } from '../../util/UI/fontsUI';
const XDate = require('xdate');

// type Props = {
//   initialRange: React.PropTypes.array.isRequired,
//   onSuccess: React.PropTypes.func.isRequired,
// };

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
  dayNames: ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', ],
  dayNamesShort: ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', ],
  // today: "Aujourd'hui"
};

LocaleConfig.defaultLocale = 'ru';

export default class DateRangePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFromDatePicked: false, isToDatePicked: false, markedDates: {}, LocaleConfig
    }
    // console.log('tepropsxt', props)
  }

  componentDidMount() {
    this.setupInitialRange()
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialRange !== prevProps.initialRange) {
      this.setupInitialRange();
    }
  }

  onDayPress = (day) => {
    if (!this.state.isFromDatePicked || (this.state.isFromDatePicked && this.state.isToDatePicked)) {
      this.setupStartMarker(day)
    } else if (!this.state.isToDatePicked) {
      let markedDates = {...this.state.markedDates}
      let [mMarkedDates, range] = this.setupMarkedDates(this.state.fromDate, day.dateString, markedDates)
      if (range >= 0) {
        this.setState({isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates})
        this.props.onSuccess(this.state.fromDate, day.dateString)
      } else {
        this.setupStartMarker(day)
      }
    }
  }

  setupStartMarker = (day) => {
    let markedDates = {[day.dateString]: {startingDay: true, color: this.props.theme1.markColor, textColor: this.props.theme1.markTextColor}}
    this.setState({isFromDatePicked: true, isToDatePicked: false, fromDate: day.dateString, markedDates: markedDates})
  }

  setupMarkedDates = (fromDate, toDate, markedDates) => {
    let mFromDate = new XDate(fromDate)
    let mToDate = new XDate(toDate)
    let range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range == 0) {
        markedDates = {[toDate]: {color: this.props.theme1.markColor, textColor: this.props.theme1.markTextColor}}
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDates[tempDate] = {color: this.props.theme1.markColor1, textColor: this.props.theme1.markTextColor}
          } else {
            markedDates[tempDate] = {endingDay: true, color: this.props.theme1.markColor, textColor: this.props.theme1.markTextColor}
          }
        }
      }
    }
    return [markedDates, range]
  }

  setupInitialRange = () => {
    // console.log('this.props.initialRange', typeof(this.props.initialRange), this.props)
    if (!this.props.initialRange) return
    let [fromDate, toDate] = this.props.initialRange
    let markedDates = {[fromDate]: {startingDay: true, color: this.props.theme1.markColor, textColor: this.props.theme1.markTextColor}}
    let [mMarkedDates, range] = this.setupMarkedDates(fromDate, toDate, markedDates)
    this.setState({markedDates: mMarkedDates, fromDate: fromDate})
    // console.log('fromDate', fromDate)
    // console.log('markedDates', markedDates)
    //что бы показать период должен приходить массив  из двух значений
    //если приходит одно стартовое значение то из за параметра markingType={'period'} день не показывается
    //для отображения другим цветом сегодняшний день - нужно ставить проверку на код выше и если пришла одна дата то другой код

  }

  render() {
    return (
      <>
        {
          <Calendar 
          {...this.props}        
            disableAllTouchEventsForDisabledDays={true}
            minDate={this.props.minDate}
            pastScrollRange={0}
            futureScrollRange={2}
            current={this.props.minDate}
            hideDayNames={false}
            markingType={'period'}
            firstDay={1}
            markedDates={this.state.markedDates}
            onDayPress={(day) => {this.onDayPress(day)}}
            style={{
              borderRadius: 6,
              paddingVertical: 10,
              backgroundColor: '#fff',
              borderColor: THEME.GREY300,
              elevation: 4
              // height: '100%'
            }}
            headerStyle={{backgroundColor: '#fff', paddingTop: 0, paddingBottom: 10,borderBottomWidth: 1, borderBottomColor: THEME.GREY300,}}
            renderArrow={(direction ) => 
              <View>
                <Icon name={direction == 'left' ? 'chevron-left': 'chevron-right'} size={20}/>
              </View>
            }
            theme={{
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
            }}
          />
        }
      </>
    )
  }
}

DateRangePicker.defaultProps = {
  theme1: { markColor: '#00adf5', markTextColor: '#ffffff',selectedDayTextColor: '#00adf5', },

};