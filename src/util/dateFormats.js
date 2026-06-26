import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatToUts = (date) => {
  return dayjs.utc(date).format('YYYY-MM-DD HH:mm:ss')
}

export const convertUtcToLocalDate = (date) => {
  return dayjs.utc(date).local().format("YYYY-MM-DD");

}

export function convertToNextMidnightUTC(dateStr) {
  const localDate = dayjs(dateStr, 'YYYY-MM-DD HH:mm:ss');
  return localDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
}

export function convertToYYYYMMDD(dateStr) {
  const date = dayjs(dateStr, 'YYYY-MM-DD HH:mm:ss');
  return date.format('YYYY-MM-DD');
}

export function parseDateTimeObj(dateTimeStr) {
  //без учета тайм зоны
  const date = dayjs(dateTimeStr)

  return {
    dateMsg: date.format('DD.MM.YYYY'),
    dateMls: date.valueOf(), // миллисекунды с начала эпохи
  }
}
export function convertChatsDate(dateTimeStr) {
  const dateUtc = dayjs.utc(dateTimeStr, 'YYYY-MM-DD HH:mm:ss')

  return dateUtc.valueOf()
}