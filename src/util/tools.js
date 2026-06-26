import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);

dayjs.extend(isSameOrAfter);

export function changeFormatTime(time) {
  let t = Number(time);
		
    let h = Math.floor(t / 60);
    let m = Math.floor(t % 60);
   // var s = Math.floor(t % 60 % 60);

    return ('0' + h).slice(-2) + "ч " + ('0' + m).slice(-2) + "мин"//+ ":" + ('0' + s).slice(-2);
}

export function unique(arr) {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
}

export function sortArrMsg(msgState,stateCount) {

  let newArr = []

  // console.log('stateCount', stateCount)
  msgState!==null&&msgState.forEach((elem)=>{
    // console.log('elem', elem)
    //stateCount - id тендеров
    let arrFilter = stateCount&&stateCount.find(item=>item.tenderId == elem.tenderId)
    // console.log('arrFilter', arrFilter)
    if(arrFilter!==undefined) {
      newArr.push(elem)
    }
    // console.log('newArr', newArr)
  })
  return newArr.length
}

export function findSmallestDate(objects) {
  let smallestDate = Number.MAX_VALUE;
  for (const obj of objects) {
    // console.log('smallestDate', smallestDate)
    // console.log('obj', obj)
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls < smallestDate) {
        // console.log('111', obj.dateMls && obj.dateMls < smallestDate)
        smallestDate = obj.dateMls;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] < smallestDate) {
        smallestDate = obj.rangeDateMls[0];
      }
    }
  }

  return smallestDate === Number.MAX_VALUE ? null : smallestDate;
}

export function findLargestDate(objects) {
  let largestDate = Number.MIN_VALUE; // Минимальное возможное значение для числа

  for (const obj of objects) {
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls > largestDate) {
        largestDate = obj.dateMls;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] > largestDate) {
        largestDate = obj.rangeDateMls[0];
      }
    }
  }

  return largestDate === Number.MIN_VALUE ? null : largestDate;
}

export function formatDateMlsToCalendar(date) {
  const d = new Date(date)
  const formattedDate = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
  return formattedDate;
}

export function formatDate(dateString) {
  let parts = dateString.split('.');
  let formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
  return formattedDate;
}

export function formatDateToMls(dateString) {
  let parts = dateString.split('.');
  let formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
  let formattedDateToMls = Date.parse(formattedDate)
  return formattedDateToMls;
}

export const formatDateToUTC = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`); // Добавляем время и указываем, что это уже UTC
  return date.toISOString();
};

export function getCurrentDate() {
  const d = new Date()
  const INITIAL_DATE = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
  
  return INITIAL_DATE
}

export function currDateToMls() {
  const d = new Date()
  // console.log('d', d, new Date(d.getFullYear(), d.getMonth(), d.getDate()))
  // const dateStr = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2)  + "-" + d.getFullYear()
  // const [day, month, year] = dateStr.split('.').map((str) => parseInt(str));

  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function rangeFormatDate() {
  const d = new Date()
  const dateFormatted = dayjs(d).format('DD.MM.YYYY')
  let thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(d.getDate() + 30);
  const thirtyDaysFromNowFormatted = dayjs(thirtyDaysFromNow).format('DD.MM.YYYY')

  // console.log('drangeFormatDate', dateFormatted,thirtyDaysFromNowFormatted)

  return [dateFormatted,thirtyDaysFromNowFormatted]
}
export function currentDateInMlsZeroHours() {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);    
  // Получаем миллисекунды этой даты
  return currentDate.getTime();

}

export function calculateTotalWeight(objectsArray) {
  let totalWeight = 0;

  for (let i = 0; i < objectsArray.length; i++) {
    const currentObject = objectsArray[i];
  
    // Проверяем, что у объекта есть поле 'weight' и оно не является пустой строкой
    if (currentObject.weight !== '' && typeof currentObject.weight === 'string') {
      totalWeight += parseFloat(currentObject.weight); // Преобразуем строку в число и добавляем к общей сумме
    }
  }

  return totalWeight;
}

export function findJsonObj(array=[],key,empty) {
  let obj = array.find(elem => elem.name == key)
  // console.log('findJsonObj obj find in array', obj)
  return obj != undefined ? obj : empty;
}
export const validateNumberInput = (input) => {
  // Проверяем, что значение не пустое
  if (!input.trim()) {
    return false;
  }

  // Обрезаем пробелы
  const trimmedInput = input.trim();

  // Проверяем, чтобы число не начиналось на 0 и не было нулем
  if (trimmedInput.startsWith('0') || parseFloat(trimmedInput) === 0) {
    return false;
  }

  // Проверяем, что значение является числом
  if (isNaN(trimmedInput)) {
    return false;
  }

  // Все проверки прошли успешно
  return true;
};


//для отображения свмой ранней даты загрузки и самой поздней даты разгрузки в заявке

export function findSmallestDateFromRender(objects) {
  let smallestDate = Number.MAX_VALUE;
  let val = '' 
  // Минимальное возможное значение для числа

  for (const obj of objects) {
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls < smallestDate) {
      	// console.log('obj', obj.dateMls,obj.date)
        smallestDate = obj.dateMls;
        val = obj.date;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] < smallestDate) {
      	// console.log('obj', obj.rangeDateMls,obj.dateRange)
        smallestDate = obj.rangeDateMls[0];
        val = obj.dateRange[0];
      }
    }
  }

	// console.log('val', val)
	
  return smallestDate === Number.MAX_VALUE ? null : val;
}

export function findLargestDateFromRender(objects) {
  let largestDate = Number.MIN_VALUE;
  let val = '' 
  // Минимальное возможное значение для числа

  for (const obj of objects) {
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls > largestDate) {
      	// console.log('obj', obj.dateMls,obj.date)
        largestDate = obj.dateMls;
        val = obj.date;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] > largestDate) {
      	// console.log('obj', obj.rangeDateMls,obj.dateRange)
        largestDate = obj.rangeDateMls[0];
        val = obj.dateRange[0];
      }
    }
  }

	// console.log('val', val)
	
  return largestDate === Number.MIN_VALUE ? null : val;
}

//проверка дат заявки на актуальность
export function checkDateOfTender(data) {

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // Получаем миллисекунды этой даты
  let milliseconds = currentDate.getTime();
  // console.log(milliseconds);

  return data.some(elem => {
    // console.log('elem', elem)
    if(elem.typeDate ==='single') {
      // const pointDate = parseDateToMilliseconds(elem.date);
      // console.log('res compare single', elem.dateMls >= milliseconds)
      return elem.dateMls >= milliseconds
      
    } else {
      // console.log('res compare range', elem.rangeDateMls[0] >= milliseconds || milliseconds >= elem.rangeDateMls[1])
      return elem.rangeDateMls[0] >= milliseconds || milliseconds <= elem.rangeDateMls[1]
    }
  })
}

export function checkArrNewElem(actualState, currState) {
  // let actualState = ['qwe','qwe1','qwe2']
  // let currState = ['qwe','qwe1','qwe2','qwe5']
    
  // actualState.forEach(elem => currState.push(elem))  // Добавляем каждый элемент из массива 1 в массив 2
  // let newArrarr = [...new Set(currState)]
  // console.log(newArrarr)
  // return newArrarr
    const added = [];
    const removed = [];

    // Проверяем новые элементы
    actualState.forEach(item => {
        if (!currState.includes(item)) {
            added.push(item);
        }
    });

    // Проверяем удаленные элементы
    currState.forEach(item => {
        if (!actualState.includes(item)) {
            removed.push(item);
        }
    });

    return {
        added: added,
        removed: removed,
        identical: added.length === 0 && removed.length === 0
    };
}


//возвращает дату 
export function checkPointsToCurrDataTender(objects) {
  let smallestDate = Number.MAX_VALUE;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // Получаем миллисекунды этой даты
  let milliseconds = currentDate.getTime();
  // console.log(milliseconds);
  // let minDate = null
  // for (const obj of objects) {
  //   // console.log('smallestDate', smallestDate)
  //   // console.log('obj', obj)
  //   if (obj.typeDate === 'single') {
  //     if (obj.dateMls && obj.dateMls >= milliseconds) {
  //       // console.log('111', obj.dateMls && obj.dateMls < smallestDate)
  //       minDate = obj.dateMls;
  //     }
  //   } else if (obj.typeDate === 'range') {
  //     if (obj.rangeDateMls && obj.rangeDateMls[0] >= milliseconds) {
  //       minDate = obj.rangeDateMls[0];
  //     }
  //   }
  // }

  
  for (const obj of objects) {
    // console.log('smallestDate', smallestDate)
    // console.log('obj', obj)
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls < smallestDate && obj.dateMls >= milliseconds) {
        // console.log('111', obj.dateMls && obj.dateMls < smallestDate)
        smallestDate = obj.dateMls;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] < smallestDate && obj.dateMls >= milliseconds) {
        smallestDate = obj.rangeDateMls[0];
      }
    }
  }

  return smallestDate === Number.MAX_VALUE ? null : smallestDate;


  // return data.some(elem => {
  //   // console.log('elem', elem)
  //   if(elem.typeDate ==='single') {
  //     // const pointDate = parseDateToMilliseconds(elem.date);
  //     // console.log('res compare single', elem.dateMls >= milliseconds)
  //     return elem.dateMls >= milliseconds
      
  //   } else {
  //     // console.log('res compare range', elem.rangeDateMls[0] >= milliseconds || milliseconds >= elem.rangeDateMls[1])
  //     return elem.rangeDateMls[0] >= milliseconds || milliseconds <= elem.rangeDateMls[1]
  //   }
  // })
}

export function isDateGreaterOrEqual(objects, minDate) {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let milliseconds = currentDate.getTime();

  // console.log('milliseconds', milliseconds)
  for (const obj of objects) {
    if (obj.typeDate === 'single') {
      if (obj.dateMls && obj.dateMls >= minDate && minDate >= milliseconds) {
        return true;
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0] >= minDate  && minDate >= milliseconds) {
        return true;
      }
    }
  }
  return false;
}

//___________________ new fn with utc

export function findSmallestDateUtc(objects) {
  let smallestDate = Number.MAX_VALUE;

  for (const obj of objects) {
    if (obj.typeDate === 'single') {
      console.log('obj.dateMls', obj.date)
      console.log('obj.dateMls', obj.dateMls)
      if (obj.dateMls) {
        const time = Date.parse(obj.dateMls);
        console.log('time', time)
        if (!isNaN(time) && time < smallestDate) {
          smallestDate = time;
        }
      }
    } else if (obj.typeDate === 'range') {
      if (obj.rangeDateMls && obj.rangeDateMls[0]) {
        const time = Date.parse(obj.rangeDateMls[0]);
        if (!isNaN(time) && time < smallestDate) {
          smallestDate = time;
        }
      }
    }
  }
  // console.log('new Date(smallestDate).toISOString()', new Date(smallestDate))
  // console.log('text', smallestDate === Number.MAX_VALUE)
  // recieve 'YYYY-MM-DD HH:mm:ss'
  // return //'YYYY-MM-DD'
  console.log('smallestDate', smallestDate,new Date(smallestDate).toISOString().slice(0, 10) )
  return smallestDate === Number.MAX_VALUE ? null : new Date(smallestDate).toISOString().slice(0, 10); // или вернуть просто smallestDate, если нужны миллисекунды
}

export function findSmallestDateLocal(objects) {
  let smallestDate = null;

  for (const obj of objects) {
    let dateStr = null;

    if (obj.typeDate === 'single' && obj.dateMls) {
      dateStr = obj.dateMls;
    } else if (obj.typeDate === 'range' && obj.rangeDateMls?.[0]) {
      dateStr = obj.rangeDateMls[0];
    }

    if (dateStr) {
      const time = dayjs(dateStr); // парсим как локальную дату

      if (time.isValid()) {
        if (!smallestDate || time.isBefore(smallestDate)) {
          smallestDate = time;
        }
      }
    }
  }

  return smallestDate ? smallestDate.format('YYYY-MM-DD') : null;
}

//TODO check this fn //min date closest to now
export function findClosestDateObject(objects) {
  let now = new Date().getTime();
  let closestDiff = Number.MAX_VALUE;
  let closestObject = null;

  for (const obj of objects) {
    let dateStr;

    if (obj.typeDate === 'single') {
      dateStr = obj.dateMls;
    } else if (obj.typeDate === 'range') {
      dateStr = obj.rangeDateMls[0];
    }

    if (dateStr) {
      // Преобразуем строку "2025-04-09 09:53:48" в Date с учётом локального времени
      const time = new Date(dateStr.replace(' ', 'T'));

      if (!isNaN(time)) {
        const diff = Math.abs(time.getTime() - now);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestObject = obj;
        }
      }
    }
  }

  if (!closestObject) return null;
  // console.log('closestObject.date', closestObject.date)
  return closestObject.typeDate === 'single'
    ? closestObject.date
    : closestObject.dateRange[0];
}

//TODO check this fn //max date
export function findMaxDateObject(objects) {
  let maxDate = 0;
  let maxDateObject = null;

  for (const obj of objects) {
    let dateStr;

    if (obj.typeDate === 'single') {
      dateStr = obj.dateMls;
    } else if (obj.typeDate === 'range') {
      dateStr = obj.rangeDateMls?.[1];
    }

    if (dateStr) {
      // Преобразуем строку "2025-04-09 09:53:48" в Date (локальное время)
      const date = new Date(dateStr.replace(' ', 'T'));

      if (!isNaN(date)) {
        const time = date.getTime();
        if (time > maxDate) {
          maxDate = time;
          maxDateObject = obj;
        }
      }
    }
  }

  if (!maxDateObject) return null;

  return maxDateObject.typeDate === 'single'
    ? maxDateObject.date
    : maxDateObject.dateRange[1];
}

export function nowDateUTC() {
  const now = new Date();
  const todayUtcDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));

  // console.log(todayUtcDate.toISOString());
  return todayUtcDate.toISOString()
}

//проверка даты не старше 24ч
export function isWithin24Hours(serverDateTime) {
  // // Преобразуем строку в ISO-формат, добавив 'T' и 'Z' для корректной работы
  // const serverDate = new Date(serverDateTime.replace(' ', 'T') + 'Z');
  // const now = new Date();

  // // Считаем разницу в миллисекундах
  // const diffMs = now - serverDate;
  // const diffHours = diffMs / (1000 * 60 * 60);

  // // Проверяем больше ли разница 24 часов
  // return diffHours <= 24;
  const serverDateUTC = dayjs.utc(serverDateTime, 'YYYY-MM-DD HH:mm:ss');
  const nowUTC = dayjs.utc();

  const diffInHours = nowUTC.diff(serverDateUTC, 'hour');
  console.log('diffInHours', diffInHours)
  return diffInHours >= 24;
}

//проверка дат заявки на актуальность (вместо checkDateOfTender)
export function checkActualDateOfTender(data) {
  const currentDate = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'); // сегодняшняя дата без времени
  // console.log('currentDate', currentDate)

  return data.every(elem => {
    // console.log('elem', elem)
    if (elem.typeDate === 'single') {
      // console.log('1', dayjs(elem.dateMls, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(currentDate))
      return dayjs(elem.dateMls, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(currentDate);
    } else {
      // console.log('2', dayjs(elem.rangeDateMls[0], 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(currentDate))
      return dayjs(elem.rangeDateMls[0], 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(currentDate);
    }
  });
}

//найти минимальную дату в startPoints (вместо checkPointsToCurrDataTender) - //!! не использую
export function findMinDateOfTender(data) {
  if (!data || data.length === 0) return null;

  let minDate = null;

  data.forEach(elem => {
    let dateStr = null;

    if (elem.typeDate === 'single') {
      dateStr = elem.date;
    } else if (elem.dateRange && elem.dateRange.length > 0) {
      dateStr = elem.dateRange[0];
    }

    if (dateStr) {
      const current = dayjs(dateStr, 'DD.MM.YYYY');
      if (!minDate || current.isBefore(minDate)) {
        minDate = current;
      }
    }
  });

  return minDate ? minDate.format('DD.MM.YYYY') : null;
}

//сравнить endPoints с минимальной датой изstartPoints и сегодняшней датой (вместо isDateGreaterOrEqual)
export function validateDatesAfterGiven(data, compareDateStr) {
  const today = dayjs().startOf('day');
  const compareDate = dayjs(compareDateStr, 'YYYY-MM-DD HH:mm:ss');

  return data.every(elem => {
    let dateToCheck;

    if (elem.typeDate === 'single') {
      dateToCheck = dayjs(elem.dateMls, 'YYYY-MM-DD HH:mm:ss');
    } else {
      dateToCheck = dayjs(elem.rangeDateMls[0], 'YYYY-MM-DD HH:mm:ss');
    }

    // Дата должна быть >= сегодняшней и >= compareDate
    return dateToCheck.isSameOrAfter(today) && dateToCheck.isSameOrAfter(compareDate);
  });
}

//найти минимальную дату для EditEndPointScreen
export function findEarliestDate(data) {
  let earliestDate = null;

  data.forEach(item => {
    console.log('item', item)
    let dateToCompare = null;

    // Оставляем условие, что если typeDate === 'single', то берем dateMls
    if (item.typeDate === 'single') {
      // Если typeDate === 'single', выбираем dateMls (если оно существует)
      if (item.dateMls) {
        dateToCompare = dayjs.utc(item.dateMls); // Указываем, что это UTC
        console.log('1', dateToCompare?.format()); // Выводим в формате ISO для проверки
      }
    } else {
      // Если есть rangeDateMls, выбираем его первый элемент
      if (item.rangeDateMls && item.rangeDateMls[0]) {
        dateToCompare = dayjs.utc(item.rangeDateMls[0]); // Указываем, что это UTC
        console.log('2', dateToCompare?.format()); // Выводим в формате ISO для проверки
      }
    }

    // Если есть дата для сравнения, обновляем наименьшую дату
    console.log('earliestDate', earliestDate ? earliestDate?.format() : null)
    console.log('dateToCompare', dateToCompare?.format())

    if (dateToCompare && (!earliestDate || dateToCompare.isBefore(earliestDate))) {
      earliestDate = dateToCompare;
    }
  });

  // Возвращаем наименьшую дату в формате "YYYY-MM-DD"
  return earliestDate ? earliestDate.format('YYYY-MM-DD') : null;
}

//calendar format
export function rangeFormatDateToCalend() {
  const d = new Date()
  const dateFormatted = dayjs(d).format("YYYY-MM-DD")
  let thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(d.getDate() + 30);
  const thirtyDaysFromNowFormatted = dayjs(thirtyDaysFromNow).format("YYYY-MM-DD")

  // console.log('drangeFormatDate', dateFormatted,thirtyDaysFromNowFormatted)

  return [dateFormatted,thirtyDaysFromNowFormatted]
}