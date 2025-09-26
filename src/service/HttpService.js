import axios from "axios";

export const URL = process.env.REACT_APP_API_URL;
const instance = axios.create({
  baseURL: URL,
  timeout: 30000,
});

const isTokenExpired = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return true;
   
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; 
  
  return (now - parseInt(loginTime)) > twentyFourHours;
};

const forceLogout = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('access_token');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('nome');
  localStorage.removeItem('email');
  localStorage.removeItem('cpf');
  localStorage.removeItem('acesso');
  window.location.href = '/login';
};
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      return Promise.reject(new Error('Sessão expirada. Você será redirecionado para o login.'));
    }
    return Promise.reject(error);
  }
);
instance.interceptors.request.use(
  (config) => {
    const publicUrls = ['/auth/signin', '/auth/esqueci-a-senha', '/auth/redefinir-senha', '/auth/cadastro'];
    const isPublicUrl = publicUrls.some(url => config.url.includes(url));
    if (!isPublicUrl && isTokenExpired()) {
      return Promise.reject(new Error('Sessão expirada'));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

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
    headers: defaultHeaders, 
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
      throw error.response?.data;
    } else {
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
      throw error.response?.data;
    } else {
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
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};

export const getImageUrl = (endpoint) => `${URL}${endpoint}`;

export { deleteRequest as delete, get, post, postFormData, postWithoutAuth, put };
