import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);

//маркеры и данные подсказки на маркере
export const getMarkerCoords = (tenderDoc) => {
  // console.log('getMarkerCoords: ', tenderDoc)

  let newArt = tenderDoc.map((item,index)=>{
    // console.log('tenderDoc map', item.id,)
    return {
      coords: item.startPoints[0].coords,
      address: item.startPoints[0].address,
      nameTender: item.name,
      itemId: item.id
    }
  })
  
  // console.log('getMarkerCoords newArt', newArt.length,)
  // setCoordinates(newArt)
  return newArt
}


function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// расчет расстояния от позиции юзера до точки загрузки - | fn sortDocuments
function calculateDistance(coords1, coords2) {
  // Расчет расстояния между двумя точками на поверхности Земли
  // Возвращает расстояние в километрах
  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  // console.log('distance', distance)
  return distance;
}

function closesDate(point,currDate) {
  // console.log('closesDate', point,currDate)
  if (point.typeDate === 'single') {
    return dayjs.utc(point.dateMls, 'YYYY-MM-DD HH:mm:ss');
  } else if (point.typeDate === 'range' && Array.isArray(point.rangeDateMls)) {
    const start = dayjs.utc(point.rangeDateMls[0], 'YYYY-MM-DD HH:mm:ss');
    const end = dayjs.utc(point.rangeDateMls[1], 'YYYY-MM-DD HH:mm:ss');
    if (currDate.isAfter(start) && currDate.isBefore(end)) {
      return currDate;
    } else {
      const diffToStart = Math.abs(currDate.diff(start));
      const diffToEnd = Math.abs(currDate.diff(end));
      console.log('diffToStart', diffToStart)
      console.log('diffToEnd', diffToEnd)
      return diffToStart <= diffToEnd ? start : end;
    }
  }
  return currDate;
}

//сортировка заявок по дате и геопозиции
export function sortDocuments(collection, currentPosition) {
  console.log('start fn sortDocuments', )
  // Отфильтруем коллекцию, чтобы оставить только документы с допустимыми датами
  //!! --->
  // const currentDate = '' //currDateToMls(); //todo сегодняшняя дата в стейте в формате "YYYY-MM-DD"
  // let thirtyDaysFromNow = new Date();
  // thirtyDaysFromNow.setDate(currentDate.getDate() + 30); 
  // const dateToMls = currentDate.getTime()
  // // console.log('dateToMls', dateToMls)
  // const thirtyDaysFromNowToMls = thirtyDaysFromNow.getTime()

  // //фильтр по дате в переделах 30 дней от сегодняшней даты
  // collection = collection.filter((doc) => {

  //   return doc.data.startPoints.some((date) => {
  //     // console.log('date', date)
  //     if(date.typeDate === 'single') {
  //       // console.log('date.typeDate', date.dateMls >= dateToMls && date.dateMls <= thirtyDaysFromNowToMls)
  //       return date.dateMls >= dateToMls && date.dateMls <= thirtyDaysFromNowToMls;
  //     } else {
  //       // console.log('date.typeDate', date.rangeDateMls[0] >= dateToMls && date.rangeDateMls[0] <= thirtyDaysFromNowToMls && date.rangeDateMls[1] >= dateToMls && date.rangeDateMls[1] <= thirtyDaysFromNowToMls)

  //       return (date.rangeDateMls[0] >= dateToMls || date.rangeDateMls[0] <= thirtyDaysFromNowToMls) && (date.rangeDateMls[1] >= dateToMls && date.rangeDateMls[1] <= thirtyDaysFromNowToMls)
  //     }
  //   });
  // });
  //!! ---<  часть кода которая фильтрует заявки что бы дата старта заявки была не старше 30 дней 
  //!! надо ли это реализовывать на клиенте? Если завки становятся архивными то они не будут попадать в поиск

  // console.log('collection', collection)


  collection.forEach((doc) => {
    // Вычисляем расстояние от текущей позиции пользователя до каждой точки из массива startPoints
    doc.startPoints.forEach((point) => {
      if (currentPosition) {
        point.distanceToUser = calculateDistance(currentPosition, point.coords);
      }
    });
  });
  // console.log('sortDocuments currentPosition', currentPosition)
  // Если currentPosition равно null, сортируем по дате и имени
  if (currentPosition === null) {
    const dateToMls = dayjs.utc();
    collection.sort((a, b) => {
      // Сортировка по дате
      
      const dateA = closesDate(a.startPoints[0],dateToMls);
      const dateB = closesDate(b.startPoints[0],dateToMls);

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // Если даты совпадают, сортируем по имени
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
  } else {
    // Если currentPosition не равно null, сортируем по расстоянию
    collection.sort((a, b) => {
      // console.log('sort by distance', a.data.startPoints, b.data.startPoints)
      // console.log('sort by distance', a.id, b.id)

      if (a.startPoints[0]?.distanceToUser < b.startPoints[0]?.distanceToUser) return -1;
      if (a.startPoints[0]?.distanceToUser > b.startPoints[0]?.distanceToUser) return 1;
      return 0;
    });
  }
  // console.log('collection.length', collection.length)
  return collection;
}
