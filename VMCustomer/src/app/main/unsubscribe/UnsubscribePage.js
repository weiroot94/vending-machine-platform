import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import appConfig from "app/configs/appConfig";

function UnsubscribePage() {
  const {token} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.post(appConfig.API_SERVER + "api/subscription/disable", {token}).then(res => {
      console.log(res);
      dispatch(
        showMessage({
            message: res.data.message,
            variant: 'success'
        }));
    }).catch(err => {
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
              message: "Failed to unsubscribe, please try again",
              variant: 'error'
          }));
      }
    });
  }, []);

  return (
    <></>
  );
}

export default UnsubscribePage;
