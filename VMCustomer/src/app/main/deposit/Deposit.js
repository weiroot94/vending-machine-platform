import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import axios from 'axios';
import { useAuth } from "src/app/auth/AuthContext";
import {Hidden} from "@mui/material";
import DepositContent from "./DepositContent";
import DepositMobileContent from "./DepositMobileContent";
import {showMessage} from "app/store/fuse/messageSlice";
import appConfig from "app/configs/appConfig";
import {useTranslation} from "react-i18next";

function DepositPage(props) {
  const {token, isAuthenticated, setNavigateUrl} = useAuth();
  const [depositList, setDepositList] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  // For mobile contents
  const [goToCardTab, setGoToCardTab] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t} = useTranslation("DepositPage");

  const depositByCard = async (cardName, cardNo, cvcNo, amount, callback) => {
    if (!token) {
      callback && callback()
      dispatch(
        showMessage({
            message: `${t("Expire_MSG")}`,
            variant: 'warning'
        }));
      return;
    }

    if (parseFloat(amount) <= 0) {
      callback && callback()
      dispatch(
        showMessage({
            message: `${t("Zero_MSG")}`,
            variant: 'error'
        }));
      return;
    }

    const postdata = {
      user_token: token,
      card_name: cardName,
      card_no: cardNo,
      cvc_no: cvcNo,
      deposit_amount: amount
    };

    try {
      const response = await axios.post(appConfig.API_SERVER + "customer/deposit/card", postdata);

      if (response.status == 200) {
        setIsUpdated(true);
        setGoToCardTab(false);
        callback && callback();
        dispatch(
          showMessage({
              message: `${t("Success")}`,
              variant: 'success'
          }));
      }
    } catch (err) {
      if (err.response && (err.response.status == 400 || err.response.status == 500)) {
        callback && callback()
        dispatch(
          showMessage({
              message: err.response.data.error,
              variant: 'error'
          }));
      } else {
        callback && callback()
        console.log(err);
        dispatch(
          showMessage({
              message: `${t("Fail_Deposit_MSG")}`,
              variant: 'error'
          }));
      }
    }
  }

  const depositByPayPal = () => {};

  useEffect(() => {
    axios.post(appConfig.API_SERVER + "customer/deposit/list", {user_token: token}).then(res => {
      setDepositList(res.data.data);
      axios.post(appConfig.API_SERVER + "customer/user/balance", {user_token: token}).then(res => {
        setUserBalance(res.data.data.toLocaleString('en-US'));
      });
      setIsLoaded(true);
      setIsUpdated(false);
    }).catch(() => {
      dispatch(
        showMessage({
            message: `${t("Fail_History_MSG")}`,
            variant: 'error'
        }));
    });
  }, [isUpdated]);

  return (
    isLoaded && (
      <>
      <Hidden lgDown>
        <div className="py-20 px-32 flex flex-row justify-center w-full">
          <DepositContent
            depositList={depositList}
            doByCard={depositByCard}
            setIsUpdated={setIsUpdated}
            userBalance={userBalance}
          />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 px-16 flex flex-row justify-center">
          <DepositMobileContent
            doByCard={depositByCard}
            setIsUpdated={setIsUpdated}
            goToCardTab={goToCardTab}
            setGoToCardTab={setGoToCardTab}
            userBalance={userBalance}
            />
        </div>
      </Hidden>
    </>
    )
  );
}

export default DepositPage;
