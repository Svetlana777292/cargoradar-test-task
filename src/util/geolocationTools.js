import { get, post, put } from "../store/features/api/user-api";
import { nowDateUTC } from "./tools";

export function checkPositionDriver(serverObject, currentCoords) {
  // Преобразуем строку "2025-05-02 11:28:57" в ISO-формат
  const serverTimestamp = serverObject.timestamp.replace(' ', 'T') + 'Z';
  const serverDate = new Date(serverTimestamp);
  const now = new Date();
  console.log('text', serverTimestamp,serverDate, now)

  // Проверяем, корректно ли преобразовалась дата
  if (isNaN(serverDate.getTime())) {
    console.warn('Невалидная дата в serverObject.timestamp:', serverObject.timestamp);
    return true; // считаем, что нужно обновить
  }

  // Разница во времени в часах
  const diffMs = now - serverDate;
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours > 24

  //!! сравнение координат пока отключено
  
  // if (diffHours > 24) {
  //   return true; // данные устарели, требуется обновление
  // }

  
  // // Сравниваем координаты
  // const sameLatitude = serverObject.coords.latitude === currentCoords.latitude;
  // const sameLongitude = serverObject.coords.longitude === currentCoords.longitude;

  // console.log('checkPositionDriver res', !(sameLatitude && sameLongitude))
  // return !(sameLatitude && sameLongitude); // true, если координаты разные (нужно обновление)
}

export async function checkAndUpdCoords(userId,currentPositionWithAddress) {
  //вернет null - если ошибка или объект с сервера
  try {
    const dateUTCFormat = nowDateUTC()
    const obj = {coords: currentPositionWithAddress, timestamp: dateUTCFormat}
    const response = await get(`positions/users/${userId}`)
    console.log('response', response)
    if (!response.success) {
      console.warn('Ошибка запроса:', response.error);
  
      if(response.error == "Position not created") {
        //создаем позицию
        const responsePosition = await post('positions',obj)
        if (!responsePosition.success) {
          console.warn('Ошибка запроса responsePosition:', responsePosition.error);
          alert(responsePosition.error);
          return null;
        } else {
          //  ок - return obj
          return responsePosition.data;
        }
      } else {
        alert(response.error);
        return null;
      }
    }
    console.log('checkAndUpdCoords если есть Позиция ->', )
    //если есть Позиция то проверять дату и координаты и обновлять если надо
    const checkDrPos = checkPositionDriver(response.data,currentPositionWithAddress.coords)
    if(checkDrPos === true) {
      //> 24h or <24h && coords changed
      //обновить и отправить в стейт

      const newResponse = await put(`positions/${response.data.id}`,obj)
      if (!newResponse.success) {
        console.warn('Ошибка запроса:', newResponse.error);
        return null;
      } else {
        //  ок - return obj
        return newResponse.data;
      }
    } else {
      //  ок - return obj
      return response.data;
    }
  } catch (error) {
    console.log('fn error', error)
  }
}
