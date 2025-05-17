import axios from "axios";
// import toast from 'react-hot-toast';
import { BASE_API_URL } from "../constants/apiEndPoints";
import Swal from "sweetalert2";

var CreateRequest = axios.create({
  timeout: 60000,
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT,DELETE",
    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  },
});

export const SetAuthorizationToken = (token: string) => {
  if (token === "") {
    delete CreateRequest.defaults.headers.common["Authorization"];
    return;
  }
  CreateRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

CreateRequest.interceptors.request.use(
  (conf: any) => {
    const token = null; //will do something later
    if (token) conf.headers.Authorization = `Bearer ${token}`;

    if (conf.headers["form-data"])
      conf.headers["Content-Type"] = "multipart/form-data";

    // const _date:any = new Date().toString()

    // conf.headers['CLIENT_TIME_ZONE'] = Intl.DateTimeFormat().resolvedOptions().timeZone
    // conf.headers['CLIENT_TIME_ZONE_OFFSET'] = _date.match(/([-\+][0-9]+)\s/)[1]

    return conf;
  },
  (error: any) => {
    console.log("request-error: ", error);
    Promise.reject(error).then(null);
  }
);

CreateRequest.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error?.response?.status == 429) {
      Swal.fire({
        icon: "error",
        title: "Login!",
        text: "Too many request. Please wait for sometime!",
      });
    }
    if (!error.response) {
      return Promise.reject("Network Error");
    } else {
      return error.response;
    }
  }
);

export default CreateRequest;
