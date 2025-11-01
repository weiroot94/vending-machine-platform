import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { showMessage } from "app/store/fuse/messageSlice";
import { useAuth } from "src/app/auth/AuthContext";
import axios from "axios";
import appConfig from "app/configs/appConfig";

function LoginVerifyPage() {
  const {token} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {setWaitAuthCheck} = useAuth();

  const verifySignupToken = async () => {
    try {
      setWaitAuthCheck(true);
      const res = await axios.post(appConfig.API_SERVER + "auth/loginverify", {token});
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
              message: "Failed to verify login, please try again",
              variant: 'error'
          }));
      }
    }
    setWaitAuthCheck(false);
  }

  useEffect(() => {
    verifySignupToken();
  }, []);

  return (
    <></>
  );
}

export default LoginVerifyPage;
