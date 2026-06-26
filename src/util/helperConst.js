import {Dimensions } from 'react-native';

export const width = Dimensions.get('window').width
export const height = Dimensions.get('window').height

export const testPrompt = {
  "name": "testPrompt",
  "img": "",
  "title": "testPrompt",
  "text": "testPrompt",
  "button": "ok"
}
// console.log('height', height)

export const calendarPopup =  {
  "name": "calendar_popup",
  "img": "/images/popup/Calendar.svg",
  "title": "Выбор дат маршрута",
  "text": "Для выбора дат нажмите на планируемую дату - будет выбран диапазон с сегодняшнего дня до выбранного",
  "button": "Закрыть"
}
export const datePopup = {
  "name": "date_popup",
  "img": "",
  "title": "Выбор даты загрузки",
  "text": "По умолчанию выбрана сегодняшняя дата",
  "button": "Закрыть"
}
export const deletePopup = {
  "name": "delete_popup",
  "img": "",
  "title": "Удаление точки",
  "text": "Вы действительно хотите удалить точку?",
  "button1": "Удалить",
"button2": "Отменить"
}
export const intermPoints = {
  "name": "intermediate_points_popup",
  "img": "",
  "title": "Промежуточные точки",
  "text": "Активный параметр учитывает точки, входящие в заказы и поиск происходит по адресам точек заказов.",
  "button": "Закрыть"
}
export const auctionPopup = {
"name": "auction_popup",
  "img": "",
  "title": "Прекратить торг",
  "text": "Вы действительно хотите прекратить торг и отправить чат в неактуальные?",
  "button1": "Прекратить",
"button2": "Отменить"
}
export const hideAppPopup = {
  "name": "hide_app_popup",
  "img": "",
  "title": "Скрыть заявку",
  "text": "Вы действительно хотите скрыть эту заявку?",
  "button1": "Скрыть",
  "button2": "Отменить"
}
export const acceptApp = {
"name": "accept_app_popup",
  "img": "",
  "title": "Принять ставку",
  "text": "Вы согласны с условиями сделки?",
  "button1": "Согласен",
"button2": "Отменить"
}
export const offerBid = {
"name": "offer_a_bid_popup",
  "img": "",
  "title": "Предложить ставку",
  "text": "У вас отсутствуют авто, вы не можете сделать предложение. Для создания предложения зайдите в профиль и заполните авто.",
  "button1": "В профиль",
"button2": "Отменить"
}
export const exitAsk = {
"name": "Exit",
  "img": "",
  "title": "Выход",
  "text": "Вы действительно хотите выйти из аккаунта?",
  "button1": "Выйти",
"button2": "Отменить"
}

export const restoreChat = {
  "name": "restoreChat",
  "img": "",
  "title": "Восстановление чата",
  "text": "Вы действительно хотите восстановить чат из неактуальных?",
  "button1": "Да",
  "button2": "Отменить"
}

export const waitingAnswer = {
  "name": "waitingAnswer",
  "img": "",
  "title": "Отклик на рассмотрении",
  "text": "Вы согласились с условиями сделки, сейчас ваш отклик на рассмотрении у заказчика. Хотите отменить свой отклик?",
  "button1": "Да",
  "button2": "Нет"
}

export const distanceToUser = {
  "name": "distanceToUser",
  "img": "",
  "title": "Заголовок",
  "text": "Описание",
  "button": "Закрыть"
}

export const promptSuccCrTend =  {
  "name": "promptSuccCrTend",
  "img": "",
  "title": "Создание заказа",
  "text": "Заказ успешно создан!",
  "button1": "Посмотреть",
  "button2": "Закрыть"
}
export const promptSuccEditTend =  {
  "name": "promptSuccEditTend",
  "img": "",
  "title": "Заявка успешно изменена",
  "text": "",
  "button": "Закрыть"
}
export const promptSuccCrRoute =  {
  "name": "promptSuccCrRoute",
  "img": "",
  "title": "Маршрут успешно создан",
  "text": "Созданный маршрут можно посмотреть в 'Мои маршруты' ",
  "button": "Закрыть"
}
export const promptSuccEditRoute =  {
  "name": "promptSuccEditRoute",
  "img": "",
  "title": "Маршрут успешно изменен",
  "text": "",
  "button": "Закрыть"
}
export const promptCalendarDataStart =  {
  "name": "dateStart",
  "img": "",
  "title": "Выбор даты загрузки",
  "text": "По умолчанию сегодня",
  "button": "Закрыть"
}
export const promptCalendarDataEnd =  {
  "name": "dateEnd",
  "img": "",
  "title": "Выбор даты разгрузки",
  "text": "По умолчанию сегодня",
  "button": "Закрыть"
}
export const askDelPoint =  {
  "name": "askDelPoint",
  "img": "",
  "title": "Удаление точки",
  "text": "Вы действительно хотите удалить точку?",
  "button1": "Удалить",
  "button2": "Отмена"
}
export const askResetTender =  {
  "name": "askResetTender",
  "img": "",
  "title": "Отменить создание заявки",
  "text": "Вы действительно хотите удалить все данные заявки?",
  "button1": "Да",
  "button2": "Отмена"
}
export const askDelRoute =  {
  "name": "askDelRoute",
  "img": "",
  "title": "Удаление маршрута",
  "text": "Вы действительно хотите удалить маршрут?",
  "button1": "Да",
  "button2": "Отмена"
}
export const askResetEditTender =  {
  "name": "askResetEditTender",
  "img": "",
  "title": "Отменить редактирование заявки",
  "text": "Вы действительно хотите отменить редактирование заявки?",
  "button1": "Да",
  "button2": "Отмена"
}
export const askResetRoute =  {
  "name": "askResetRoute",
  "img": "",
  "title": "Отменить создание маршрута",
  "text": "Вы действительно хотите удалить все данные маршрута?",
  "button1": "Да",
  "button2": "Отмена"
}
export const askResetEditRoute =  {
  "name": "askResetEditRoute",
  "img": "",
  "title": "Отменить редактирование маршрута",
  "text": "Вы действительно хотите отменить редактирование маршрута?",
  "button1": "Да",
  "button2": "Отмена"
}
export const askRestoreEditRoute =  {
  "name": "askRestoreEditRoute",
  "img": "",
  "title": "Восстановление маршрута",
  "text": "Что бы восстановить этот маршрут, отредактируйте дату точки загрузки",
  "button1": "Редактировать",
  "button2": "Отмена"
}
export const askRestoreRoute =  {
  "name": "askRestoreRoute",
  "img": "",
  "title": "Восстановление маршрута",
  "text": "Вы действительно хотите восстановить этот маршрут?",
  "button1": "Восстановить",
  "button2": "Отмена"
}
export const askRestoreEditTender =  {
  "name": "askRestoreEditTender",
  "img": "",
  "title": "Восстановление заявки",
  "text": "Что бы восстановить эту заявку, отредактируйте дату точки загрузки",
  "button1": "Редактировать",
  "button2": "Отмена"
}
export const askRestoreTender =  {
  "name": "askRestoreTender",
  "img": "",
  "title": "Восстановление заявки",
  "text": "Вы действительно хотите восстановить заявку?",
  "button1": "Восстановить",
  "button2": "Отмена"
}
export const testObj =  {
  "name": "testObj",
  "img": "",
  "title": "Подсказка не найдена",
  "text": "",
  "button": "Закрыть"
}

export const testObjAsk =  {
  "name": "testObjAsk",
  "img": "",
  "title": "Подсказка не найдена",
  "text": "",
  "button1": "Закрыть",
  "button2": "Отмена"
}

//не используется
export const internetCn =  {
  "name": "internetCn",
  "img": "",
  "title": "Нет подключения к интернету",
  "text": "описание",
  "button": "Закрыть"
}

//не используется
export const changeRole =  {
  "name": "changeRole",
  "img": "",
  "title": "Вы успешно сменили роль",
  // "text": "описание",
  "button": "Закрыть"
}
export const finishTender =  {
  "name": "finishTender",
  "img": "",
  "title": "Вы успешно оставили отзыв",
  "text": "Отзывы можно посмотреть в чате заявки",
  "button": "Закрыть"
}
export const finishTenderErr =  {
  "name": "finishTenderErr",
  "img": "",
  "title": "Ошибка отправки отзыва",
  "text": "Попробуйде еще раз позже",
  "button": "Закрыть"
}
export const transportAddErr =  {
  "name": "TransportAddErr",
  "img": "",
  "title": "Ошибка добавления транспорта",
  "text": "Попробуйде еще раз позже",
  "button": "Закрыть"
}
export const editProfileSucc =  {
  "name": "editProfileSucc",
  "img": "",
  "title": "Данные профиля успешно обновлены",
  "text": "",
  "button": "Закрыть"
}
export const transportAdd =  {
  "name": "TransportAdd",
  "img": "",
  "title": "Вы успешно добавили транспорт",
  "text": "",
  "button": "Закрыть"
}
export const transportEdit =  {
  "name": "transportEdit",
  "img": "",
  "title": "Вы успешно обновили данные транспорта",
  "text": "",
  "button": "Закрыть"
}
export const transportDel =  {
  "name": "transportDel",
  "img": "",
  "title": "Вы действительно хотите удалить транспорт?",
  "text": "",
  "button1": "Да",
  "button2": "Отмена"
}


export const promptSuccSendDrvPrpus =  {
  "name": "promptSuccSendDrvPrpus",
  "img": "",
  "title": "Вы успешно отправлили предложение выбранным водителям",
  "text": "",
  "button": "Закрыть"
}
export const promptShowDateExpired =  {
  "name": "promptShowDateExpired",
  "img": "",
  "title": "Измените даты загрузки и разгрузки хотя бы одной точки на актуальные",
  "text": "",
  "button": "Закрыть"
}

export const titleChat = [
  {title: "Актуальные"},
  {title: "Неактуальные"},
] 

export const testDataChat = [
  {data: {userName: 'Jhon', name: 'tender with two lines, tender with two lines', price: '350', status: 'wait', read: true, counterMsg: 2, avatar: 'http://www.sfu.ca/~cqt/IAT352/a4/img/avatars/test-user.png',}, id: 'qwe1'},
  {data: {userName: 'Dan', name: 'tender 2', price: '150',  status: 'accept',read: false, counterMsg: 4, avatar: 'http://www.sfu.ca/~cqt/IAT352/a4/img/avatars/test-user.png',}, id: 'qwe2'},
  {data: {userName: 'Fred', name: 'tender 3', price: '2500', status: 'base', read: true, counterMsg: 66, avatar: 'http://www.sfu.ca/~cqt/IAT352/a4/img/avatars/test-user.png',}, id: 'qwe3'},  
]

export const gpsErr = {
  "name": "gpsErr",
  "img": "",
  "title": "GPS не включен, чтобы использовать все функции приложения, включите GPS в настройках телефона",
  "text": "",
  "button": "Закрыть"
}
export const cancelTenderBet =  {
  "name": "cancelTenderBet",
  "img": "",
  "title": "Вы успешно отменили принятую ставку",
  "text": "",
  "button": "Закрыть"
}
export const finishTenderTestimErr = {
  "name": "finishTenderTestimErr",
  "img": "",
  "title": "Завершение заказа",
  "text": "Вы не можете завершить заказ, пока его не завершил водитель",
  "button": "Закрыть"
}
export const cancelTender = {
  "name": "cancelTender",
  "img": "",
  "title": "Отмена заказа",
  "text": "Вы действительно хотите отменить выполнение заказа",
  "button1": "Да",
  "button2": "Отмена"
}
export const notifAlarm = {
    "name": "notifAlarm",
    "img": "",
    "title": "Пуш-нотификации не включены",
    "text": "Для того что бы получать пуш-нотификации перейдите в Настройки телефона и разрешите пуш-нотификации. Вы можете менять настроки получения пуш-нотификаций в Профиле приложения.",
    "button1": "В настройки",
    "button2": "Закрыть"
  }
export const notifRoleChangeAsk = {
    "name": "notifAlarm",
    "img": "",
    "title": "Новое уведомление для другой роли",
    "text": "Что бы посмотреть новые уведомления для другой роли, смените роль в настройках профиля",
    "button1": "В профиль",
    "button2": "Закрыть"
  }
export const cameraPermissionInfo = {
    "name": "cameraPermissionInfo",
    "img": "",
    "title": "Вы запретили доступ к камере или галерее",
    "text": "Что бы выбрать или снять фото, измените настройки приложения ",
    "button1": "В настройки",
    "button2": "Закрыть"
  }
export const checkPositionPermiss = {
    "name": "checkPositionPermiss",
    "img": "",
    "title": "Необходим доступ к вашему местоположению",
    "text": "Для использования сортировки по расстоянию нужно дать доступ к вашему местоположению",
    "button1": "Разрешить",
    "button2": "Закрыть"
  }
export const complaintSucceed = {
    "name": "complaintSucceed",
    "img": "",
    "title": "Жалоба отправлена",
    "text": "Мы перепроверим ваше обращение и примем меры, если тут действительно есть нарушение.",
    "button": "Закрыть",
  }
export const cancelAlertClient = {
    "name": "cancelAlertClient",
    "img": "",
    "title": "Ошибка",
    "text": "Вы не можете завершить заявку или отменить заявку, клиент отменил выполнение заявки",
    "button": "Закрыть",
  }
export const notifSettings = {
    "button1": "В настройки",
    "button2": "Закрыть",
    "img": "",
    "name": "notifSettings",
    "text": "Что бы настроить получение пуш уведомлений перейдите в настройки", "title": "Настройка получения уведомлений"
  }



  //complain

  export const dataComplainPrompt = [
    {
      "value": "userBehaivor",
      "title": "Поведение пользователя",
    },
    {
      "value": "scam",
      "title": "Мошенничество",
    },
    {
      "value": "wrongDescription",
      "title": "Недостоверное описание",
    },
    {
      "value": "photo",
      "title": "Фотографии",
    },
    {
      "value": "duplicate",
      "title": "Дубликат",
    },
    {
      "value": "forbiddenProducts",
      "title": "Запрещённый товар",
    },
    {
      "value": "wrongUsersContacts",
      "title": "Неправильные контактные данные",
    },
    {
      "value": "irrelevant",
      "title": "Уже неактуально",
    },
  ]


  export const jsonSlider = [
    {
      "slideimg": "",
      "slidetitle": "Слайдер 0",
      "slidetext": "Описание демо текст для слайдера 1",
      "slidebtn": "Далее",
      "registered": "0"
    },
    {
      "slideimg": "",
      "slidetitle": "Слайдер 2",
      "slidetext": "Описание демо текст для слайдера 2",
      "slidebtn": "Далее",
      "registered": "0"
    },
    {
      "slideimg": "",
      "slidetitle": "Слайдер 13",
      "slidetext": "Описание демо текст для слайдера 3",
      "slidebtn": "Приступить",
      "registered": "0"
    }
  ]