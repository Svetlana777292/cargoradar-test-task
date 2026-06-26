export async function getJsonDataSliderData(dispatch,fn,fnErr) {
  try {
    const response = await fetch(
      "http://api-stage.cargogo.pro/json/slider.json"
    );
    const json = await response.json()
    // console.log('getJsonDataSliderData json', json)

    // dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.log('getJsonDataSliderData fetch error',error);
    return null
  }
}
export async function getJsonDataPrompt(dispatch,fn,fnErr) {
  try {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    const response = await fetch(
      "http://api-stage.cargogo.pro/json/date-popup.json",requestOptions
    )
    const json = await response.json()
    // console.log('getJsonDataPrompt json', json)

    dispatch(fn(json))
    return json;
  } catch (error) {
    dispatch(fnErr(error))
    console.log('getJsonDataPrompt fetch error',error);
  }
}