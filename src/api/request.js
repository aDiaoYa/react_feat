import axios from "axios";

const service = axios.create({
  timeout: 8000,
  baseURL: "https://mock.apipark.cn/m1/4552128-4200391-default",
});
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
