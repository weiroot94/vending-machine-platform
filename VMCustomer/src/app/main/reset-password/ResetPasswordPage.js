import { Hidden } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import ResetPasswordPageContent from "./ResetPasswordPageContent";
import ResetPasswordPageMobileContent from "./ResetPasswordPageMobileContent";
import axios from "axios";
import appConfig from "app/configs/appConfig";
import { useTranslation } from "react-i18next";

function ResetPasswordpage(props) {
  const { token } = useParams();
  const goToSetNewPass = token == "loginuser" ? false : true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("ResetPasswordPage");

  const sendPasswordResetRequest = (email, callback) => {
    if (!email) {
      callback && callback()
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
        callback && callback()
        dispatch(
          showMessage({
            message: `${t("Email_Invalid_MSG")}`,
            variant: 'warning'
          }));
        return;
      }
    }

    axios.post(appConfig.API_SERVER + "auth/resetpass", { email }).then((res) => {
      callback && callback()
      dispatch(
        showMessage({
          message: res.data.message,
          variant: 'success'
        }));
    }).catch(err => {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        callback && callback()
        dispatch(
          showMessage({
            message: err.response.data.error,
            variant: 'error'
          }));
      } else {
        console.log(err);
        callback && callback()
        dispatch(
          showMessage({
            message: `${t("Fail_Req_MSG")}`,
            variant: 'error'
          }));
      }
    });
  }

  const doPasswordReset = (password, callback) => {
    if (!token) {
      callback && callback()
      dispatch(
        showMessage({
          message: `${t("Fail_Token_MSG")}`,
          variant: 'error'
        }));
      return;
    }
    if (!password) {
      callback && callback()
      dispatch(
        showMessage({
          message: `${t("New_Pwd_MSG")}`,
          variant: 'warning'
        }));
      return;
    }

    axios.post(appConfig.API_SERVER + "auth/resetpassverify", { token, password }).then((res) => {
      callback && callback()
      dispatch(
        showMessage({
          message: res.data.message,
          variant: 'success'
        }));
      setTimeout(navigate("/sign-in"), 500);
    }).catch(err => {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        callback && callback()
        dispatch(
          showMessage({
            message: err.response.data.error,
            variant: 'error'
          }));
      } else {
        console.log(err);
        callback && callback()
        dispatch(
          showMessage({
            message: `${t("Fail_New_MSG")}`,
            variant: 'error'
          }));
      }
    });
  }


  return (
    <>
      <Hidden lgDown>
        <div className="px-32 flex flex-row justify-center w-full">
          <ResetPasswordPageContent
            goToSetNewPass={goToSetNewPass}
            sendPasswordResetRequest={sendPasswordResetRequest}
            doPasswordReset={doPasswordReset}
          />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 flex flex-row justify-center">
          <ResetPasswordPageMobileContent
            goToSetNewPass={goToSetNewPass}
            sendPasswordResetRequest={sendPasswordResetRequest}
            doPasswordReset={doPasswordReset}
          />
        </div>
      </Hidden>
    </>
  );
}

export default ResetPasswordpage;
