import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function sortByPrice(data,flag) {


  let result = data.sort((prev,next) => {
    if(flag === true) {
      if (prev?.price > next?.price) return -1;
      if (prev?.price < next?.price) return 1;
    } else {
      if (prev?.price < next?.price) return -1;
      if (prev?.price > next?.price) return 1;
    }
  })
  
  return result
}

export function sortByDistance(data,flag) {

  let result = data.sort((prev,next) => {
    let prevToNum = parseInt(prev?.route?.distance)
    let nextToNum = parseInt(next?.route?.distance)
    if(flag === true) {
      // console.log('flag === true 1', prevToNum > nextToNum)
      // console.log('flag === true 2', prevToNum < nextToNum)
      // console.log('prev,next', prevToNum,nextToNum,)
      if (prevToNum > nextToNum) return -1;
      if (prevToNum < nextToNum) return 1;
    } else {
      // console.log('flag !== true 1', prevToNum > nextToNum)
      // console.log('flag !== true 2', prevToNum < nextToNum)
      // console.log('prev,next', prevToNum,nextToNum,)
      if (prevToNum < nextToNum) return -1;
      if (prevToNum > nextToNum) return 1;
    }
  })
  return result
}
export function sortByPosition(data,flag) {
  console.log('sortByPosition data',data);
  
  let result = data.sort((prev,next) => {
    if(flag === true) {
      if (prev.startPoints[0]?.distanceToUser < next.startPoints[0]?.distanceToUser) return -1;
      if (prev.startPoints[0]?.distanceToUser > next.startPoints[0]?.distanceToUser) return 1;
      return 0;
    } else {
      if (prev.startPoints[0]?.distanceToUser < next.startPoints[0]?.distanceToUser) return -1;
      if (prev.startPoints[0]?.distanceToUser > next.startPoints[0]?.distanceToUser) return 1;
      return 0;
    }
  })
  return result
}

export function sortByNearestDate(orders,flag) {

  let currDt = new Date();
  currDt.setHours(0, 0, 0, 0);    
 // Получаем миллисекунды этой даты
  let currentDate = currDt.getTime();
  // console.log('currentDate', currentDate)
   // Функция для преобразования строки в миллисекунды
  const toMillis = (dateStr) => new Date(dateStr).getTime();

    const getNearestDate = (dates, currentDate) => {
      const sortedDates = dates.map(dateRange => {
        // console.log('dateRange', dateRange)
        if (dateRange.length === 2) {
          // Если в массиве два значения, это диапазон дат
          const [startStr, endStr] = dateRange;
          const start = toMillis(startStr);
          // console.log('start', start)
          const end = toMillis(endStr);
          // console.log('end', end)
          return currentDate >= start && currentDate <= end ? currentDate : start;
        } else {
          // Если одно значение, это просто дата
          // console.log('1 toMillis(dateRange)', toMillis(dateRange))
          return toMillis(dateRange);
        }
      }).sort((a, b) => Math.abs(a - currentDate) - Math.abs(b - currentDate));
  
      return sortedDates[0];
    };
  
    const sortedOrders = orders.sort((a, b) => {
      const aDate = getNearestDate(a.startPoints.map(point => point.typeDate === 'range' ? point.rangeDateMls : point.dateMls), currentDate);
      const bDate = getNearestDate(b.startPoints.map(point => point.typeDate === 'range' ? point.rangeDateMls : point.dateMls), currentDate);
      
      //для дат flag === false - значит даты будут отображаться от самой ближней к сегодняшней
      if(flag === false) {
      // console.log('flag === true 1', prevToNum > nextToNum)
      // console.log('flag === true 2', prevToNum < nextToNum)
      // console.log('prev,next', prevToNum,nextToNum,)
        if (aDate > bDate) return -1;
        if (aDate < bDate) return 1;
      } else {
        // console.log('flag !== true 1', prevToNum > nextToNum)
        // console.log('flag !== true 2', prevToNum < nextToNum)
        // console.log('prev,next', prevToNum,nextToNum,)
        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
      }
      // console.log('aDate', aDate, 'bDate', bDate, aDate - bDate)
      // return aDate - bDate;
    });
  
    return sortedOrders;
  
}

//new sortByNearestDate

// export function sortByNearestDate(orders, flag) {
//   // Устанавливаем сегодняшнюю дату с 00:00:00 в локальном времени
//   const currentDate = dayjs().startOf('day');

//   const getNearestDate = (points, currentDate) => {
//     const allDates = points.map(point => {
//       if (point.typeDate === 'range' && Array.isArray(point.rangeDateMls)) {
//         const start = dayjs(point.rangeDateMls[0]).local();
//         const end = dayjs(point.rangeDateMls[1]).local();

//         if (currentDate.isAfter(start) && currentDate.isBefore(end)) {
//           return currentDate;
//         }
//         const diffToStart = Math.abs(currentDate.diff(start));
//         const diffToEnd = Math.abs(currentDate.diff(end));
//         return diffToStart <= diffToEnd ? start : end;
//       } else if (point.typeDate === 'single' && point.dateMls) {
//         return dayjs(point.dateMls).local();
//       }
//       return null;
//     }).filter(Boolean);

//     // Вернём ближайшую к текущей дату
//     return allDates.sort((a, b) =>
//       Math.abs(a.diff(currentDate)) - Math.abs(b.diff(currentDate))
//     )[0];
//   };

//   const sortedOrders = orders.sort((a, b) => {
//     const aDate = getNearestDate(a.startPoints, currentDate);
//     const bDate = getNearestDate(b.startPoints, currentDate);

//     if (!aDate || !bDate) return 0;

//     if (flag === false) {
//       // Ближайшие к сегодняшнему — вниз
//       if (aDate.isAfter(bDate)) return -1;
//       if (aDate.isBefore(bDate)) return 1;
//     } else {
//       // Ближайшие к сегодняшнему — вверх
//       if (aDate.isBefore(bDate)) return -1;
//       if (aDate.isAfter(bDate)) return 1;
//     }

//     return 0;
//   });

//   return sortedOrders;
// }
