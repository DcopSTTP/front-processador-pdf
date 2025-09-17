import axios from "axios";

export const URL = 'http://localhost:3335';
const instance = axios.create({
  baseURL: URL,
  timeout: 30000,
});

export const api = async (endpoint, metodo, body, newHeaders) => {
  const token = localStorage.getItem('access_token');

  let headers = newHeaders ? newHeaders : { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return instance.request({
    url: endpoint,
    method: metodo,
    data: body ? body : undefined,
    headers: headers,
  });
};

const post = async (url, data, headers) => {
  return api(url, 'POST', data, headers);
};

const postWithoutAuth = async (url, data, headers) => {
  const defaultHeaders = headers ? headers : { 'Content-Type': 'application/json' };
  
  return instance.request({
    url: url,
    method: 'POST',
    data: data,
    headers: defaultHeaders, // Não inclui token de autorização
  });
};

const put = async (url, data, headers) => {
  return api(url, 'PUT', data, headers);
};

const get = async (url, config) => {
  try {
    const token = localStorage.getItem('access_token');

    let requestHeaders = config?.headers ? config.headers : {};
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig = { headers: requestHeaders, params: config?.params };
    const response = await instance.get(url, requestConfig);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro no GET:", error.response?.data);
      throw error.response?.data;
    } else {
      console.error("Erro no GET:", error);
      throw error;
    }
  }
};

const deleteRequest = async (url, headers) => {
  try {
    const token = localStorage.getItem('access_token');

    const requestHeaders = headers ? headers : {};
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await instance.delete(url, { headers: requestHeaders });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro no DELETE:", error.response?.data);
      throw error.response?.data;
    } else {
      console.error("Erro no DELETE:", error);
      throw error;
    }
  }
};

const postFormData = async (url, formData, headers) => {
  try {
    const token = localStorage.getItem('access_token');

    let requestHeaders = headers ? headers : { 'Content-Type': 'multipart/form-data' };
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    console.log(`Executando FormData: url: ${URL}${url}, headers:`, requestHeaders);

    const response = await instance.request({
      url: url,
      method: 'POST',
      data: formData,
      headers: requestHeaders,
    });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro no postFormData:", error.response?.data);
      throw error.response?.data || error.message;
    } else {
      console.error("Erro no postFormData:", error);
      throw error;
    }
  }
};

export const getImageUrl = (endpoint) => `${URL}${endpoint}`;

export { post, postWithoutAuth, get, put, postFormData, deleteRequest as delete };