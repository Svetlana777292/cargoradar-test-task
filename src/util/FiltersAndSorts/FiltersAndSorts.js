export function compareTenderDateAndPrice(dataTender) {
  // let tender = []

  const tenderFiltered = dataTender.sort((a,b) => { 
    if(a.data.createdAt.toMillis()===b.data.createdAt.toMillis()) {
      return a.data.price < b.data.price ? 1 : -1
    }
  })

  return tenderFiltered
}

export function removeDuplicates (array1, array2) {
  return array1.filter((item1) => {
    // Возвращаем только те элементы из array1, которых нет в array2
    return !array2.some((item2) => {
      return item1.userId === item2.userId && item1.tenderId === item2.tenderId;
    });
  });
};