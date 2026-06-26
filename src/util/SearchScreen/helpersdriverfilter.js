import { currentDateInMlsZeroHours } from "../tools";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);

  //сортировка с учетом информеров (в получении заявок и в изменении стейта информеров)
  export function sortTender(arrTender,arrInformer) {
    // console.log('arrInformer', arrInformer)
    // bb4PeV1ovXD7MzASR2rB - test004_0013 10:44:43
    // RHI25Zv8B1bkp8UZBM0K - test004_0012 10:45:18
    let informers = arrInformer.slice()
    let tenders = arrTender.slice()
    let idToTimeMap = {};
    informers.forEach(item => {
      idToTimeMap[item.tenderId] = new Date(item.createdAt.replace(" ", "T") + "Z").getTime();
    });
    // console.log('idToTimeMap', idToTimeMap)
    // Теперь используем этот объект для сортировки arr2.
    tenders.sort((a, b) => {
      // Получаем время для каждого элемента из arr2
      let timeA = idToTimeMap[a.id] || 0; // Если id отсутствует в arr, считаем время как 0
      let timeB = idToTimeMap[b.id] || 0;
      // Сортируем по убыванию времени
      // console.log('idToTimeMap[a.id]', idToTimeMap[a.id])
      // console.log('idToTimeMap[b.id]', idToTimeMap[b.id])
      // console.log('return res ', timeA,timeB , timeB - timeA)
      // return timeB < timeA ?  1 : -1;
      return timeB - timeA ;
    });
    // console.log('tenders', tenders)
    return tenders
    // return arrTender
  }
  //сортировка для роутов
  export function sortRoutes(arrRoutes,arrInformer) {
    console.log('arrInformer', arrInformer)
    let informers = arrInformer.slice()
    let tenders = arrRoutes.slice()
    let idToTimeMap = {};
    console.log('tenders', tenders)
    informers.forEach(item => {
      idToTimeMap[item.tenderId] = new Date(item.createdAt.replace(" ", "T") + "Z").getTime();
    });
    console.log('idToTimeMap', idToTimeMap)
    // Теперь используем этот объект для сортировки arr2.
    tenders.sort((a, b) => {
      // Получаем время для каждого элемента из arr2
      // console.log('idToTimeMap[a.id]', idToTimeMap[a.id])
      console.log('a.id', a.id)
      //a.id - тут айди маршрута и сортировка не сработает 
      let timeA = idToTimeMap[a.id] || 0; // Если id отсутствует в arr, считаем время как 0
      let timeB = idToTimeMap[b.id] || 0;
      // Сортируем по убыванию времени
      // console.log('idToTimeMap[a.id]', idToTimeMap[a.id])
      // console.log('idToTimeMap[b.id]', idToTimeMap[b.id])
      console.log('return res ', timeA,timeB , timeB - timeA)
      // return timeB < timeA ?  1 : -1;
      return timeB - timeA ;
    });
    // console.log('tenders', tenders)
    return tenders
  }

  function isInRange(value, min, max) {
    // console.log('\x1b[35m%s %s\x1b[0m','isInRange', value, min, max)
    // console.log('isInRange min', min !== null && value < Number(min))
    // console.log('isInRange max', max !== null && value < Number(max))
    if(value == 0 && (min !== null || max !== null)) {
      return false;
    }
    if (min !== null && value < Number(min) ) {
      return false;
    }
  
    if (max !== null && value > Number(max)) {
      return false;
    }
  
    return true;
  }

  function closesDate(point,currDate) {
    // console.log('closesDate', point,currDate)
    if (point.typeDate === 'single') {
      //  HH:mm:ss
      return dayjs.utc(point.dateMls, 'YYYY-MM-DD');
    } else if (point.typeDate === 'range' && Array.isArray(point.rangeDateMls)) {
      const start = dayjs.utc(point.rangeDateMls[0], 'YYYY-MM-DD');
      const end = dayjs.utc(point.rangeDateMls[1], 'YYYY-MM-DD');
      if (currDate.isAfter(start) && currDate.isBefore(end)) {
        return currDate;
      } else {
        const diffToStart = Math.abs(currDate.diff(start));
        const diffToEnd = Math.abs(currDate.diff(end));
        // console.log('diffToStart', diffToStart)
        // console.log('diffToEnd', diffToEnd)
        return diffToStart <= diffToEnd ? start : end;
      }
    }
    return currDate;
  }

  function isDateInRange(point, singleDate, typeDate, rangeDate) {
    console.log('isDateInRange', point, singleDate, typeDate, rangeDate)
 
    const toMillis = (dateStr) => new Date(dateStr).getTime();
    //вернет милисекунды dateStr - может быть любой формат даты

    let dateCheck = ''
    if (point.typeDate === 'single') {
      //TODO задать что бы убирало время у даты
      const dt = dayjs(point.dateMls).format("YYYY-MM-DD"); 
      dateCheck = toMillis(dt)
      // console.log('single dateCheck', dateCheck)
    } else {
      let currDtMlsZeroHours = dayjs.utc(); //currentDateInMlsZeroHours()
      //TODO новая фун из closesDate задать что бы убирало время у даты
      dateCheck = closesDate(point,currDtMlsZeroHours) // функция которая будет переводить в милисек
      // console.log('range dateCheck', dateCheck)
    }
  
    const date = toMillis(dateCheck) //formatDateInRn(point);
    // console.log('date', date, toMillis(dateCheck))
  
    if (typeDate === 'single') {
      const oneDate = toMillis(singleDate);
      return date === oneDate;
    } else if (typeDate === 'range') {
      const startDate = toMillis(rangeDate[0]);
      const endDate = toMillis(rangeDate[1]);
      // console.log('startDate', startDate)
      // console.log('endDate', endDate)
      // console.log('return', date >= startDate && date <= endDate)
      return date >= startDate && date <= endDate;
    }
  
    // return false;
  }

  function isCoordinateInRadius(coords1, coords2, radius) {
    const R = 6371; // Радиус Земли в километрах
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    // console.log('distance', distance <= radius)
    return distance <= radius;
  } 

  // Main function to filter documents
  export function filterDocuments(collection, filters) {

    // let result = 
    // console.log('result', result)
    // let resultArr = result !== undefined  ? result : []
    // return resultArr
    return collection.filter((doc) => {
      // console.log('doc', doc?.data?.name)
      //!!TODO - проверка на активные(уже не нужна? так как для активных свой стейт)
      // if(doc.driverId !==null && doc.driverId===uid) {
      //   return true 
      // }

      //!!TODO - фильтр показывать заявки с моими активностями(ставки, сообщения)
      // if(showTnWithMyActv === true && !tendersActivity?.includes(doc.id)) {
      //   // console.log('showTnWithMyActv',showTnWithMyActv,'includes:', tendersActivity?.includes(doc.id))
      //   return false 
      // }

      const startPoints = doc.startPoints;
      // console.log('\x1b[36m%s %s\x1b[0m %s\x1b[0m','docId', doc.id,'startPoints', startPoints.length)
      
      //!!TODO
      // if(tenderDel !== null && tenderDel !== undefined && filters.showHidTender===false) {
      //   // console.log('check del',doc.id, tenderDel?.includes(doc.id))
      //   if (tenderDel?.includes(doc.id)) {
      //     return false
      //   }
      // }

      // Если filters.inAllStPoints === true, проверяем все элементы в массиве startPoints
      if (filters.inAllStPoints) {
        // Если хотя бы один элемент соответствует фильтрам, возвращаем true
        if (startPoints.some((point) => {
          // console.log('\x1b[36m%s %s\x1b[0m','point',point?.price, point?.weight, point?.volume, )
          // console.log('\x1b[36m%s %s\x1b[0m','filters',filters )
          // console.log('1',  isInRange(Number(point.price), filters.priceMin, filters.priceMax))
          // console.log('!!!!!',   (filters.radius > 0 && filters.radius <= 600 ? isCoordinateInRadius(point.coords, filters.addressCoords, filters.radius) : true))
          
          let isInPrice = () => {
            let res = (filters.priceMin !== null || filters.priceMax !== null) ? isInRange(Number(point.price), filters.priceMin, filters.priceMax) : true 
            return res
          }
          let isInWeight= () => {
            let res = (filters.weightMin !== null || filters.weightMax !== null) ? isInRange(Number(point.weight), filters.weightMin, filters.weightMax) : true 
            return res
            // let res = isInRange(Number(point.weight), filters.weightMin, filters.weightMax)
            // console.log('res', res)
            // return res
          }
          let isInVolume= () => {
            let res = (filters.volumeMin !== null || filters.volumeMax !== null) ? isInRange(Number(point.volume), filters.volumeMin, filters.volumeMax) : true 
            return res
          }

          console.log('isInPrice', isInPrice(),'isInWeight', isInWeight(),'isInVolume', isInVolume())
          console.log('isDateInRange', isDateInRange(point, filters.singleDate, filters.typeDate, filters.rangeDate),
          ((filters.radius > 0 && filters.radius <= 600 && filters.addressCoords!==null) ? isCoordinateInRadius(point.coords, filters.addressCoords, filters.radius) : true))
          
          console.log('\x1b[36m%s %s\x1b[0m','resultItem return', isInPrice() &&
          isInWeight() &&
          isInVolume() &&
          isDateInRange(point, filters.singleDate, filters.typeDate, filters.rangeDate) &&
          ((filters.radius > 0 && filters.radius <= 600 && filters.addressCoords!==null) ? isCoordinateInRadius(point.coords, filters.addressCoords, filters.radius) : true)) 

          return (
            isInPrice() &&
            isInWeight() &&
            isInVolume() &&
            isDateInRange(point, filters.singleDate, filters.typeDate, filters.rangeDate) &&
            ((filters.radius > 0 && filters.radius <= 600 && filters.addressCoords!==null) ? isCoordinateInRadius(point.coords, filters.addressCoords, filters.radius) : true)
          );
          // return (
          //   isInRange(Number(point.price), filters.priceMin, filters.priceMax) &&
          //   (point.weight !== '' && isInRange(Number(point.weight), filters.weightMin, filters.weightMax)) &&
          //   (point.volume !== '' && isInRange(Number(point.volume), filters.volumeMin, filters.volumeMax)) &&
          //   isDateInRange(point, filters.singleDate, filters.typeDate, filters.rangeDate) &&
          //   ((filters.radius > 0 && filters.radius <= 600 && filters.addressCoords!==null) ? isCoordinateInRadius(point.coords, filters.addressCoords, filters.radius) : true)
          // );
        })) {
          return true;
        } else {
          return false
        }
      } else {
        // Если filters.inAllStPoints === false, проверяем только первый элемент в массиве startPoints
        const firstStartPoint = startPoints[0];
        if (
          isInRange(Number(firstStartPoint.price), filters.priceMin, filters.priceMax) &&
          (firstStartPoint.weight === '' || isInRange(Number(firstStartPoint.weight), filters.weightMin, filters.weightMax)) &&
          (firstStartPoint.volume === '' || isInRange(Number(firstStartPoint.volume), filters.volumeMin, filters.volumeMax)) &&
          isDateInRange(firstStartPoint, filters.singleDate, filters.typeDate, filters.rangeDate) &&
          ((filters.radius > 0 && filters.radius <= 600 && filters.addressCoords!==null) ? isCoordinateInRadius(firstStartPoint.coords, filters.addressCoords, filters.radius) : true)
        ) {
          return true;
        }
      }
      // Если ни одно условие не выполнено, возвращаем false
      return false;
    })
  }

  export function moveObjectToStartById(arr, id) {
    // Находим индекс объекта с заданным id
    let array = arr
    const index = array.findIndex(obj => obj.id === id);
    
    // Если объект с таким id найден
    if (index !== -1) {
        // Вытаскиваем объект из массива
        const objToMove = array.splice(index, 1)[0];
        // Вставляем его в начало массива
        array.unshift(objToMove);
    }
    
    return array;
  }