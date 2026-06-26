export const toggleNumberInArray = (array, number) => {
  const index = array.indexOf(number);

  if (index !== -1) {
    // Число найдено — удалить
    return [...array.slice(0, index), ...array.slice(index + 1)];
  } else {
    // Число не найдено — добавить
    return [...array, number];
  }
};

export function mergeUnique(a, b) {
  // Если массив b пустой, просто возвращаем копию a
  if (!b || b.length === 0) return [...a];

  // Объединяем массивы и убираем дубликаты через Set
  return Array.from(new Set([...a, ...b]));
}
export function mergeUniqueArrObj(arr1, arr2) {
  if(arr2.length === 0) {
    return arr1 
  } else {

    //объект который надо записать в стейт формы
    let resar = []
     arr1.forEach(elem => {
      let res = arr2.find(item => {
        // console.log('!=',item.tenderId == elem.tenderId)
        return item.tenderId === elem.tenderId
      })
      // console.log('res',res) 
      if(res === undefined) resar.push(elem) 
    })
    return resar
  }
}
export function mergeUniqueArrObjId(arr1, arr2) {
  if(arr2.length === 0) {
    return arr1 
  } else {

    //объект который надо записать в стейт формы
    let resar = []
     arr1.forEach(elem => {
      let res = arr2.find(item => {
        // console.log('!=',item.tenderId == elem.tenderId)
        return item._id === elem._id
      })
      // console.log('res',res) 
      if(res === undefined) resar.push(elem) 
    })
    return resar
  }
}