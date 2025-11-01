import {Hidden} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { hideMessage, showMessage } from "app/store/fuse/messageSlice";
import SignInPageContent from "./SignInPageContent";
import SignInPageMobileContent from "./SignInPageMobileContent";
import { useAuth } from "src/app/auth/AuthContext";
import axios from "axios";
import appConfig from "app/configs/appConfig";
import { useTranslation } from "react-i18next";
import { Dialpad } from "@mui/icons-material";

function SignInPage(props) {
  const {login, setCustomerName, setCustomerEmail, setToken} = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation("SignInPage");

  const userLogin = async (email, password, callback) => {
    if (!email) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Email_Type_MSG")}`,
            variant: 'warning'
        }));
        return;
    } else {
      if (!email.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        callback && callback();
        dispatch(
          showMessage({
              message: `${t("Email_Invalid_MSG")}`,
              variant: 'warning'
          }));
          return;
      }
    }
    if (!password) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Type_Pwd_MSG")}`,
            variant: 'warning'
        }));
        return;
    }
    try {
      const res = await axios.post(appConfig.API_SERVER + "auth/login", { email, password});
      if (res.data.status == 1) {
        callback && callback();
        window.localStorage.setItem(
          "customer",
          JSON.stringify(res.data.user)
        );
        setCustomerName(res.data.user.name);
        setCustomerEmail(res.data.user.email);
        setToken(res.data.user.token);
        setTimeout(login, 500);
      } else {
        callback && callback();
        dispatch(
          showMessage({
              message: res.data.message,
              variant: 'error'
          }))
      }
    } catch (err) {
      callback && callback();
      if (err.response) {
        if (err.response.status == 400 || err.response.status == 500) {
          dispatch(
            showMessage({
                message: err.response.data.error,
                variant: 'error'
            }));
        } else if (err.response.status == 401) {
          dispatch(
            showMessage({
                message: `${t("Login_MSG")}`,
                variant: 'warning'
            }));
        }
      } else {
        console.log(err);
        dispatch(
          showMessage({
              message: `${t("Fail_Login_MSG")}`,
              variant: 'error'
          }));
      }
    }
  };

  const usergoogleLogin = async (code) => {
    try {
      const res = await axios.post(appConfig.API_SERVER + "auth/googlelogin", { code });
      window.localStorage.setItem(
        "customer",
        JSON.stringify(res.data.user)
      );
      setCustomerName(res.data.user.name);
      setCustomerEmail(res.data.user.email);
      setToken(res.data.user.token);
      setTimeout(login, 500);
    } catch (err) {
      if (err.response) {
        if (err.response.status == 400 || err.response.status == 500) {
          dispatch(
            showMessage({
                message: err.response.data.error,
                variant: 'error'
            }));
        } else if (err.response.status == 401) {
          dispatch(
            showMessage({
                message: `${t("Login_MSG")}`,
                variant: 'warning'
            }));
        }
      } else {
        console.log(err);
        dispatch(
          showMessage({
              message: `${t("Fail_Login_MSG")}`,
              variant: 'error'
          }));
      }
    }
  };

  return (
    <>
      <Hidden lgDown>
        <div className="px-32 flex flex-row justify-center w-full">
          <SignInPageContent
            userLogin={userLogin}
            usergoogleLogin={usergoogleLogin}
          />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 flex flex-row justify-center">
          <SignInPageMobileContent
            userLogin={userLogin}
            usergoogleLogin={usergoogleLogin}
          />
        </div>
      </Hidden>
    </>
  );
}

export default SignInPage;
