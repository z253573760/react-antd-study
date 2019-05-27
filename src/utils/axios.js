import axios from 'axios';

axios.defaults.baseURL = 'http://dev.znlife.com/sapi/v340';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
  config.headers['key'] = '26b3d4ce84e487d005a327a6d2d05cd1';
  return config;
});

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default axios;
