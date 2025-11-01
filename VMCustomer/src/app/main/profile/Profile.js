import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import {Hidden} from "@mui/material";
import { showMessage } from "app/store/fuse/messageSlice";
import ProfileContent from "./ProfileContent";
import ProfileMobileContent from "./ProfileMobileContent";
import { useAuth } from "src/app/auth/AuthContext";
import appConfig from "app/configs/appConfig";
import { useTranslation } from "react-i18next";

function ProfilePage(props) {
  const [userBalance, setUserBalance] = useState(0);
  const {token, logout} = useAuth();
  const {t} = useTranslation("ProfilePage");
  const dispatch = useDispatch();

  useEffect(() => {
    axios.post(appConfig.API_SERVER + "customer/user/balance", {user_token: token}).then(res => {
      setUserBalance(res.data.data.toLocaleString('en-US'));
    });
  }, []);

  const updateProfile = async (newName, currentPass, newPass, newEmail) => {
    try {
      const res = await axios.post(appConfig.API_SERVER + "customer/user/update",
        {
          user_token: token,
          new_name: newName,
          current_pass: currentPass,
          new_pass: newPass,
          new_email: newEmail,
        });
      dispatch(
        showMessage({
            message: res.data.message,
            variant: 'success'
        }));
      logout();
      
    } catch (err) {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        dispatch(
          showMessage({
              message: err.response.data.error,
              variant: 'error'
          }));
      } else {
        console.log(err);
        dispatch(
          showMessage({
              message: `${t("Fail_Update_MSG")}`,
              variant: 'error'
          }));
      }
    }
  };

  return (
    <>
      <Hidden lgDown>
        <div className="py-20 flex flex-row justify-center">
          <ProfileContent
            userBalance={userBalance}
            updateProfile={updateProfile}
          />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 px-16 flex flex-row justify-center">
          <ProfileMobileContent
            userBalance={userBalance}
            updateProfile={updateProfile}
          />
        </div>
      </Hidden>
    </>
  );
}

export default ProfilePage;
