import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import appConfig from "app/configs/appConfig";

function VerifyPage() {
  const {token} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifySignupToken = async () => {
    try {
      const res = await axios.post(appConfig.API_SERVER + "auth/sigupverify", {token});
      dispatch(
        showMessage({
            message: res.data.message,
            variant: 'success'
        }));
      setTimeout(navigate('/sign-in'), 500);
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
              message: "Failed to verify your sign up request, please try again",
              variant: 'error'
          }));
      }
    }
  }

  useEffect(() => {
    verifySignupToken();
  }, []);

  return (
    <></>
  );
}

export default VerifyPage;
