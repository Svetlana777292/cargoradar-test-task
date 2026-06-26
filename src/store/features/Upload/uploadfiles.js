import { SERVERURL } from "../../../util/apiVars";
import { getToken } from "../../../util/asyncstor";


export const uploadImage = async (data) => {
  console.log('\x1b[96m5\x1b[0m', 'API uploadImage', data)
  const token = await getToken();
  const myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", 'multipart/form-data');
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append("image[]", data);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };
  
  try {
    const response = await fetch(`${SERVERURL}/api/upload/avatars`, requestOptions)
    // console.log('1 response', response, )
    // console.log('2 response', await response.text(), )

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      console.log('else response', response)
      // Log the response text for debugging
      const responseText = await response.text();
      console.warn('Unexpected response format:', responseText);
      return {
        code: 500,
        message: 'Unexpected response format',
        details: responseText
      };
    }
  } catch (error) {
    console.log('Error during putRequestById:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}

export const uploadImages = async (data,api) => {
  console.log('\x1b[96m5\x1b[0m', 'API uploadImages Arr','api',api, 'data',data)
  const token = await getToken()
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", 'multipart/form-data');
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  if(data && data.length > 1) {
    data.forEach(item => 
    formdata.append("image[]", item) )

  } else {
    formdata.append("image[]", data[0])
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };
  console.log('requestOptions', requestOptions.body)
  
  try {
    const response = await fetch(`${SERVERURL}/api/upload/${api}`, requestOptions)
    // console.log('1 response', response, )
    // console.log('2 response', await response.text(), )

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      console.log('else response', response)
      // Log the response text for debugging
      const responseText = await response.text();
      console.warn('Unexpected response format:', responseText);
      return {
        code: 500,
        message: 'Unexpected response format',
        details: responseText
      };
    }
  } catch (error) {
    console.log('Error during putRequestById:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}

export const uploadChatsMedia = async (data,type,signal) => {
  console.log('\x1b[96m5\x1b[0m', 'API uploadChatsMedia', data,type)
  const token = await getToken();
  const myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");
  if(type != "doc[]") {
    myHeaders.append("Content-Type", 'multipart/form-data');
  }
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append(type, data);
  // "image[]" - type
  // "video[]" - type
  // "doc[]" - type

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
    signal
  };
  
  try {
    const response = await fetch(`${SERVERURL}/api/upload/messages`, requestOptions)
    console.log('1 response', response, )
    // console.log('2 response', await response.text(), )

    // Check if the response is JSON
    //todo - обрабатывать ошибку как в request {"message": "The video.0 field must be a file of type: video/mp4, video/x-msvideo, video/x-flv."}
    
    
    if (!response.ok) {
      // Ошибка с JSON
      if (contentType?.includes('application/json')) {
        const errorBody = await response.json();
        return {
          success: false,
          status: response.status,
          error: errorBody?.message || 'Something went wrong',
          details: errorBody,
        };
      }
      // Ошибка с текстом
      const text = await response.text();
      return {
        success: false,
        status: response.status,
        error: 'Unexpected error',
        details: text,
      };
    }

    // Успешный ответ
    const json = await response.json();
    return {
      success: true,
      status: response.status,
      data: json,
    };

  } catch (error) {
    console.log('Error during uploadChatsMedia:', error);
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
}