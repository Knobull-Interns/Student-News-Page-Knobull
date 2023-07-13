import axios, { AxiosResponse, AxiosError } from "axios";
import { message, notification } from "antd";
import { getToken, clearLocalDatas, USER_INFO, TOKEN, MENU } from "@/utils";
import qs from "qs";
import store from "@/store";
import { clearUser } from "@/store/action";
// Request Address
const BASE_URL =
  import.meta.env.REACT_APP_API_BASEURL || "/api/react-ant-admin";

// Error Information
const codeMessage: { [key: number]: string } = {
  200: "The server successfully returned the requested data",
  201: "New or modified data was successful",
  202: "A request has entered the backend queue (asynchronous task).",
  204: "Data deleted successfully",
  400: "The request sent has an error, the server did not carry out new or modified data operations.",
  401: "The user does not have permission (token, username, password error).",
  403: "The user is authorized, but access is forbidden。",
  404: "The request send is for a non-existent record, the server did not perform operations.",
  406: "The format of the request is not available.",
  410: "The requested resource has been permanently deleted and will not be obtained again.",
  422: "When creating an object, a validation error occurred.",
  500: "An error occurred on the server, please check the server.",
  502: "Gateway error.",
  503: "Service is not available, the server is temporarily overloaded or in maintenance.",
  504: "Gateway timeout.",
};

// Request Configuration File
const config = {
  // 'baseURL' will be automatically added to the 'url' front, unless the 'url' is an absolute URL.
  // It can be facilitated to pass relative URLs to the method of the axios instance by setting a 'baseURL'
  baseURL: BASE_URL,

  timeout: 1000 * 15,

  // `withCredentials` indicates whether to use credentials for cross-domain requests
  withCredentials: false,

  // `maxRedirects` defines the maimum number of redirects to follow in node.js
  // If set to 0, no redirects will be followed
  maxRedirects: 3,
  headers: {
    "Content-Type": " application/json;charset=UTF-8",
  },
};

// Create Ajax Instance
const instance = axios.create(config);
instance.interceptors.request.use(
  function (config) {
    // What to do before sending a request
    let token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function (error) {
    // What to do if a request error occurs
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    if (response.data) {
      let { message: msg, status } = response.data;
      if (status === 1) {
        message.error(msg);
      }
    }
    return response && response.data;
  },
  function (error: AxiosError) {
    const { response } = error;
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, config } = response;
      notification.error({
        message: `Request error ${status}: ${config.url}`,
        description: errorText,
      });
      if (response.status === 401 || response.status === 403) {
        clearLocalDatas([USER_INFO, TOKEN, MENU]);
        store.dispatch(clearUser());
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else if (!response) {
      notification.error({
        description:
          "Client exception or network issue, please clear the cache?",
        message: "Abnormal status",
      });
    }
    // What to do if a response error occurs
    return Promise.reject(error);
  }
);

const rewriteGet = instance.get;
instance.get = function (url: string, data: any, ...any) {
  let query: string = qs.stringify(data, { addQueryPrefix: true });
  return rewriteGet(url + query, ...any);
};

export default instance;
