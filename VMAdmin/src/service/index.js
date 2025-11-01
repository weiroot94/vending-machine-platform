import axios from "axios";
import {config} from "../config";

const requestPost = (url, data, successCallback, errorCallback) => {
  errorCallback = errorCallback || function (err) { console.log(config.serverUrl, url, err) };
  axios
    .post(config.serverUrl + url, data)
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const requestGet = (url, data, successCallback, errorCallback) => {
  axios
    .get(config.serverUrl + url, data)
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const requestTokenPost = (url, data, successCallback, errorCallback) => {
  if (window.localStorage.getItem("vending_user") == "") {
    errorCallback("Failed to get user information!");
    return;
  }
  const userData = JSON.parse(window.localStorage.getItem("vending_user"));
  axios
    .post(config.serverUrl + url, {
      ...data,
      ...{
        token: userData.token,
      },
    })
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const requestTokenPostAsync = async (url, data, errorFunc) => {
  if (window.localStorage.getItem("vending_user") == "") {
    errorFunc("Failed to get user information!");
    return;
  }
  const userData = JSON.parse(window.localStorage.getItem("vending_user"));

  try {
    const result = await axios.post(config.serverUrl + url,
      {
      ...data,
      ...{
        token: userData.token,
      },
    });
    return result;
  } catch (err) {
    throw err;
  }
};

const requestTokenGet = (url, data, successCallback, errorCallback) => {
  if (window.localStorage.getItem("vending_user") == "") {
    errorCallback("Failed to get user information!");
    return;
  }
  const userData = JSON.parse(window.localStorage.getItem("vending_user"));
  axios
    .get(config.serverUrl + url, {
      ...data,
      ...{
        token: userData.token,
      },
    })
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

const formPost = (url, data, successCallback, errorCallback) => {
  if (window.localStorage.getItem("vending_user") == "") {
    errorCallback("Failed to get user information!");
    return;
  }
  const userData = JSON.parse(window.localStorage.getItem("vending_user"));
  data.append("token", userData.token);
  axios
    .post(config.serverUrl + url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((result) => {
      successCallback(result);
    })
    .catch((error) => {
      errorCallback(error);
    });
};

export {requestPost, requestGet, requestTokenPost, requestTokenPostAsync, requestTokenGet, formPost};
