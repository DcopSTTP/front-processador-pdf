import axios from "axios";

export const URL = 'http://localhost:3335';
const instance = axios.create({
  baseURL: URL,
  timeout: 30000,
});

// Função para verificar se o token expirou (24h)
const isTokenExpired = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return true;
  
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24h em milliseconds
  
  return (now - parseInt(loginTime)) > twentyFourHours;
};

// Função para fazer logout automático
const forceLogout = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('access_token');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('nome');
  localStorage.removeItem('email');
  localStorage.removeItem('cpf');
  localStorage.removeItem('acesso');
  
  // Redirecionar para login
  window.location.href = '/login';
};

// Interceptor para respostas - detectar token expirado
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Unauthorized) ou 403 (Forbidden), token provavelmente expirou
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Token expirado ou inválido, fazendo logout automático');
      forceLogout();
      return Promise.reject(new Error('Sessão expirada. Você será redirecionado para o login.'));
    }
    
    return Promise.reject(error);
  }
);

// Interceptor para requisições - verificar token antes de enviar
instance.interceptors.request.use(
  (config) => {
    // Lista de URLs que não precisam de autenticação
    const publicUrls = ['/auth/signin', '/auth/esqueci-a-senha', '/auth/redefinir-senha', '/auth/cadastro'];
    const isPublicUrl = publicUrls.some(url => config.url.includes(url));
    
    // Verificar se o token expirou antes de fazer qualquer requisição
    if (!isPublicUrl && isTokenExpired()) {
      console.log('Token expirado por tempo (24h), fazendo logout automático');
      forceLogout();
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