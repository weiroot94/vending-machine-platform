import {Hidden} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import SignUpPageContent from "./SignUpPageContent";
import SignUpPageMobileContent from "./SignUpPageMobileContent";
import axios from "axios";
import appConfig from "app/configs/appConfig";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/app/auth/AuthContext";

function SignUpPage() {
  const dispatch = useDispatch();
  const [goToResend, setGoToResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const {login, setCustomerName, setCustomerEmail, setToken} = useAuth();
  const { t } = useTranslation("SignUpPage");

  const userSignUp = async (name, email, password, passwordConfirm, callback) => {
    if (!name) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Type_Name_MSG")}`,
            variant: 'warning'
        }));
        return;
    }
    if (!email) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Type_Email_MSG")}`,
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
              message: `${t("Fail_Email_MSG")}`,
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
    } else if (password !== passwordConfirm) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Mismatch_MSG")}`,
            variant: 'warning'
        }));
        return;
    }

    try {
      const res = await axios.post(appConfig.API_SERVER + "auth/signup", { name, email, password});
      setResendEmail(email);
      setGoToResend(true);
      callback && callback();
      dispatch(
        showMessage({
            message: res.data.message,
            variant: 'success'
        }));
    } catch (err) {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        callback && callback();
        dispatch(
          showMessage({
              message: err.response.data.error,
              variant: 'error'
          }));
      } else {
        console.log(err);
        callback && callback();
        dispatch(
          showMessage({
              message: `${t("Fail_Sign_MSG")}`,
              variant: 'error'
          }));
      }
    }
  };

  const resendVerificationMail = (resendEmail, callback) => {
    if (!resendEmail) {
      callback && callback();
      dispatch(
        showMessage({
            message: `${t("Type_Email_MSG")}`,
            variant: 'warning'
        }));
        return;
    } else {
      if (!resendEmail.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
        callback && callback();
        dispatch(
          showMessage({
              message: `${t("Fail_Email_MSG")}`,
              variant: 'warning'
          }));
          return;
      }
    }

    axios.post(appConfig.API_SERVER + "auth/resendmail", { email: resendEmail }).then((res) => {
      callback && callback();
      dispatch(
        showMessage({
            message: res.data.message,
            variant: 'success'
        }));
    }).catch(err => {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        callback && callback();
        dispatch(
          showMessage({
              message: err.response.data.error,
              variant: 'error'
          }));
      } else {
        console.log(err);
        callback && callback();
        dispatch(
          showMessage({
              message: `${t("Fail_Verify_MSG")}`,
              variant: 'error'
          }));
      }
    });
  }

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
        <div className="flex flex-row justify-center">
          <SignUpPageContent
            signUp={userSignUp}
            usergoogleLogin={usergoogleLogin}
            resendVerificationMail={resendVerificationMail}
            goToResend={goToResend}
            setGoToResend={setGoToResend}
            resendEmail={resendEmail}
          />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 flex flex-row justify-center">
          <SignUpPageMobileContent
            signUp={userSignUp}
            usergoogleLogin={usergoogleLogin}
            resendVerificationMail={resendVerificationMail}
            goToResend={goToResend}
            setGoToResend={setGoToResend}
            resendEmail={resendEmail}
          />
        </div>
      </Hidden>
    </>
  );
}

export default SignUpPage;
