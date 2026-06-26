import { SERVERURL } from "../../../util/apiVars";
import { getToken } from "../../../util/asyncstor";


export const login = async (userData) =>{
  console.log('\x1b[96m5\x1b[0m', 'API login', userData)

  const myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "phone": userData
  });

  // formdata.append("pushNotificationToken", userData.pushNotificationToken);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response =  await fetch(`${SERVERURL}/api/auth/send`, requestOptions)
    const contentType = response.headers.get('content-type');
    // console.log('fetch response', response)
    
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
    console.log('response.json()', json)
    return {
      success: true,
      status: response.status,
      data: json,
    };

  } catch (error) {
    console.warn('Error during sendcode:', error);
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
}

export const sendcode = async (userData) =>{
  console.log('\x1b[96m5\x1b[0m', 'API sendcode', userData)

  const myHeaders = new Headers();
  // myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    "phone": userData.phone,
    "code": parseInt(userData.code)
  });

  // formdata.append("pushNotificationToken", userData.pushNotificationToken);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response =  await fetch(`${SERVERURL}/api/auth/verify`, requestOptions)
    const contentType = response.headers.get('content-type');
    console.log('response', response)
    
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
    console.warn('Error during sendcode:', error);
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
}

export const registration = async (userData,value) =>{
  console.log('\x1b[96m5\x1b[0m', 'API registration', userData)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const raw = JSON.stringify({
    "name": userData.name,
    "email": userData.email,
    "phone": userData.phone,
    "organization": userData.organization,
    "unp": userData.unp,
    "role": userData.role
    });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response =  await fetch(`${SERVERURL}/api/auth/register`, requestOptions)
    const contentType = response.headers.get('content-type');

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
        error: 'Unexpected login error',
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
    console.warn('Error during register:', error);
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
}

//___________________________________________________________________
// apiClient.js

export const request = async (method, api, body = null, params = null) => {
  // console.log('\x1b[96m5\x1b[0m', 'API request: ', method, api, body, params)

  const token = await getToken();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const url = new URL(`${SERVERURL}/api/${api}`);
  if (params) {
    if (Array.isArray(params)) {
      url.searchParams.append('data', JSON.stringify(params));
    } 
    // Если params — обычный объект
    else if (typeof params === 'object') {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, value);
        }
      });
    }
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };
  // redirect: "follow" -- посмотреть как добавлять

  try {
    // console.log('url.toString()', url.toString())
    const response = await fetch(url.toString(), options);
    const contentType = response.headers.get('content-type');

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
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
};
export const requestArr = async (method, api, body = null, params = null) => {
  console.log('\x1b[96m5\x1b[0m', 'API requestArr: ', method, api, body, params)

  const token = await getToken();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const url = new URL(`${SERVERURL}/api/${api}`);
  if (params) {
    if (Array.isArray(params)) {
      url.searchParams.append('data', JSON.stringify(params));
    }
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };
  // redirect: "follow" -- посмотреть как добавлять

  try {
    // console.log('url.toString()', url.toString())
    const response = await fetch(url.toString(), options);
    const contentType = response.headers.get('content-type');

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
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    // const json = await response.json();
    
    return {
      success: true,
      status: response.status,
      data: json,
    };

  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error?.message || 'Network error',
      details: error?.stack,
    };
  }
};

export const get = (api, params) => request('GET', api, null, params);
export const post = (api, body) => request('POST', api, body);
export const put = (api, body) => request('PUT', api, body);
export const del = (api) => request('DELETE', api);

export const postRequest = async (data,value,api) => {
  console.log('\x1b[96m5\x1b[0m', 'API postRequest', data, api)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}`, requestOptions)

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
    console.log('Error during postRequest:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}
export const postRequestById = async (data,value,api,id) => {
  console.log('\x1b[96m5\x1b[0m', 'API postRequestById', data, api)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}/${id}`, requestOptions)

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
    console.log('Error during postRequestById:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}

export const getRequest = async (value,api) => {
  console.log('\x1b[96m5\x1b[0m', 'API getRequest', api)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}`, requestOptions)
    // console.log('response', response)
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
    console.log('Error during getRequest:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}

export const getRequestById = async (value,api,id) => {
  console.log('\x1b[96m5\x1b[0m', 'API getRequestById', api)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}/${id}`, requestOptions)

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
    console.log('Error during getRequestById:', error);
    return {
      code: 500,
      message: error?.message,
      details: error?.stack
    };
  }
}

export const putRequest = async (data,value,api) => {
  console.log('\x1b[96m5\x1b[0m', 'API putRequestById', api)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}`, requestOptions)

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

export const putRequestById = async (data,value,api,id) => {
  console.log('\x1b[96m5\x1b[0m', 'API putRequestById', api,id)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`); 

  const raw = JSON.stringify(data);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}/${id}`, requestOptions)

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

export const delRequestById = async (id,value,api) => {
  console.log('\x1b[96m5\x1b[0m', 'API delRequestById', api,id)

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${value}`);


  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${SERVERURL}/api/${api}/${id}`, requestOptions)

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
