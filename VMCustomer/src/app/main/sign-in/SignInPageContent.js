import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StyledLoginContainer = styled("div")(`
    width: 1920px;
    flex-shrink: 0;
    background: url(assets/images/pages/sign/bg.png), lightgray 50%;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
  `);

const StyledSignInComponent = styled("div")(`
    display: flex;
    width: 1595px;
    height: 864px;
    padding: 20px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-top: 150px;
    margin-bottom: 150px;

    .img-place {
      border-radius: 9px 0px 0px 9px;
      background: #1B1919;
      width: 50%;
      height: 100%;
    }

    .sign-panel {
      width: 50%;
      display: flex;
      padding: 50px;
      justify-content: center;
      align-items: center;
      gap: 15px;
      flex: 1 0 0;
      align-self: stretch;
      border-radius: 0px 9px 9px 0px;
      background: #70ACCC;

      .sign-form {
        width: 578px;
        height: 665px;
        transform: rotate(0.27deg);
        border-radius: 30px;
        border: 1px solid #FFF;
        background: linear-gradient(122deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.20) 102.32%);
        box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(10px);

        display: flex;
        padding: 4.42px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 22.1px;

        img {
          width: 149.399px;
          height: 149.399px;
        }

        .sign-input {
          width: 335.042px;
          height: 52.157px;
          flex-shrink: 0;
          border-radius: 8.84px;
          background: #F9F9F9;

          color: #464141;
          text-align: center;
          font-family: Museo Sans;
          font-size: 28.289px;
          font-weight: 300;
          line-height: normal;
          letter-spacing: -1.132px;
        }

        .signin-util {
          width: 335.042px;
          height: 52.157px;
          font-size: 16px;
        }

        .remember-me {
          width: 15px;
          height: 15px;
          margin-right: 10px;
        }

        .register {
          color: rgba(255, 255, 255, 0.80);
          text-align: center;
          font-family: Inter var;
          font-size: 22.1px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.884px;
          cursor: pointer;
        }

        .forgotpass {
          color: #000;
          text-align: center;
          font-family: Inter var;
          font-size: 18px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin-left: 89px;
          cursor: pointer;
        }
      }
    }
  `);

const StyledLoading = styled("div")(`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`);

const StyledSignInButton = styled(motion.button)(({ theme }) => ({
  display: "flex",
  padding: "15px 26px",
  justifyContent: "center",
  alignItems: "center",
  width: "287px",
  height: "61px",
  gap: "10px",
  borderRadius: "13px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "31px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-1.44px",
  cursor: "pointer",
}));

const hoverAnimation = {
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
  backgroundColor: "#536A71",
  borderColor: "#536A71",
  transition: { duration: 0.2 }
};

const tapAnimation = {
  scale: 1.2
};

const StyeldSVGButton = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  '& svg': {
    transition: 'all 0.3s ease',
  },
  '& svg:hover': {
    fill: '#f00',
    transform: 'scale(1.1)',
  },
  '& svg:active': {
    fill: '#f00',
    transform: 'scale(1.03)',
  },
}));

function SignInPageContent(props) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);
  // const [checked, setChecked] = useState(false);

  const { t } = useTranslation("SignInPage");

  // const handleChange = () => {
  //   setChecked(!checked);
  // }

  const { userLogin, usergoogleLogin } = props;

  const loginGoogle = useGoogleLogin({
    onSuccess: codeResponse => {
      console.log(codeResponse);
      if (codeResponse.code) {
        usergoogleLogin(codeResponse.code);
      }
    },
    flow: 'auth-code',
  });

  function onSubmit() {
    userLogin(emailRef.current.value, passwordRef.current.value, () => {
      setIsSubmit(false);
    });
  }

  useEffect(() => {
    if (isSubmit)
      onSubmit();
  }, [isSubmit]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isSubmit) {
      setIsSubmit(true);
    }
  };

  return (
    <StyledLoginContainer>
      <StyledSignInComponent>
        <div className="img-place"></div>
        <div className="sign-panel">
          <div className="sign-form">
            <img src="assets/images/avatars/avatar.png" alt="avatar" />
            <input
              className="sign-input"
              placeholder={t("Email")}
              onKeyDown={handleKeyDown}
              ref={emailRef}
            />
            <input
              type="password"
              className="sign-input"
              placeholder={t("Password")}
              onKeyDown={handleKeyDown}
              ref={passwordRef}
            />
            <div className="flex flex-row justify-between align-center signin-util">
              {/* <label className="remember-checkbox">
                <input
                  type="checkbox"
                  className="remember-me"
                  name="remember"
                  checked={checked}
                  onChange={handleChange}
                />
                Remember me
              </label> */}
              <div
                className="forgotpass"
                onClick={() => {
                  navigate("/resetpass/loginuser");
                }}
              >
                <span style={{ textDecoration: "underline", color: "black" }}>{t("Forgot")}</span>
              </div>
            </div>
            <svg
              width="337"
              height="25"
              viewBox="0 0 337 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M168.688 12.6777C168.688 14.1695 168.419 15.4587 167.88 16.5453C167.341 17.6319 166.602 18.4699 165.663 19.0592C164.724 19.6486 163.651 19.9433 162.445 19.9433C161.238 19.9433 160.165 19.6486 159.226 19.0592C158.287 18.4699 157.548 17.6319 157.009 16.5453C156.47 15.4587 156.201 14.1695 156.201 12.6777C156.201 11.186 156.47 9.89677 157.009 8.81017C157.548 7.72357 158.287 6.88559 159.226 6.29625C160.165 5.7069 161.238 5.41223 162.445 5.41223C163.651 5.41223 164.724 5.7069 165.663 6.29625C166.602 6.88559 167.341 7.72357 167.88 8.81017C168.419 9.89677 168.688 11.186 168.688 12.6777ZM167.03 12.6777C167.03 11.453 166.825 10.4194 166.416 9.57678C166.011 8.7342 165.46 8.09651 164.765 7.66371C164.074 7.23091 163.301 7.01451 162.445 7.01451C161.588 7.01451 160.812 7.23091 160.117 7.66371C159.426 8.09651 158.876 8.7342 158.466 9.57678C158.061 10.4194 157.859 11.453 157.859 12.6777C157.859 13.9025 158.061 14.9361 158.466 15.7787C158.876 16.6213 159.426 17.259 160.117 17.6918C160.812 18.1246 161.588 18.341 162.445 18.341C163.301 18.341 164.074 18.1246 164.765 17.6918C165.46 17.259 166.011 16.6213 166.416 15.7787C166.825 14.9361 167.03 13.9025 167.03 12.6777ZM170.79 19.7499V5.60561H175.569C176.674 5.60561 177.581 5.79438 178.29 6.17193C178.999 6.54488 179.524 7.05825 179.865 7.71206C180.206 8.36586 180.376 9.10945 180.376 9.94282C180.376 10.7762 180.206 11.5152 179.865 12.1598C179.524 12.8044 179.002 13.3108 178.297 13.6792C177.593 14.0429 176.693 14.2248 175.597 14.2248H171.729V12.6777H175.541C176.297 12.6777 176.904 12.5672 177.365 12.3462C177.83 12.1252 178.166 11.8121 178.373 11.407C178.585 10.9972 178.691 10.5091 178.691 9.94282C178.691 9.37649 178.585 8.88154 178.373 8.45794C178.161 8.03435 177.823 7.70745 177.358 7.47724C176.893 7.24242 176.278 7.12501 175.514 7.12501H172.503V19.7499H170.79ZM177.448 13.396L180.928 19.7499H178.939L175.514 13.396H177.448Z"
                fill="#000"
              />
              <line
                x1="0.959961"
                y1="15.3362"
                x2="144.195"
                y2="15.3362"
                stroke="#000"
                strokeWidth="0.884017"
              />
              <line
                x1="192.792"
                y1="15.3362"
                x2="336.027"
                y2="15.3362"
                stroke="#000"
                strokeWidth="0.884017"
              />
            </svg>
            <StyeldSVGButton onClick={loginGoogle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M53.8153 25.3728H51.8423V25.2711H29.7971V35.069H43.6403C41.6207 40.7726 36.1939 44.8668 29.7971 44.8668C21.6808 44.8668 15.1003 38.2863 15.1003 30.17C15.1003 22.0538 21.6808 15.4733 29.7971 15.4733C33.5436 15.4733 36.952 16.8866 39.5472 19.1952L46.4755 12.2669C42.1008 8.18979 36.249 5.67542 29.7971 5.67542C16.27 5.67542 5.30249 16.6429 5.30249 30.17C5.30249 43.6972 16.27 54.6647 29.7971 54.6647C43.3243 54.6647 54.2918 43.6972 54.2918 30.17C54.2918 28.5277 54.1227 26.9245 53.8153 25.3728Z"
                  fill="#FFC107"
                />
                <path
                  d="M8.12671 18.769L16.1744 24.671C18.352 19.2797 23.6257 15.4733 29.7971 15.4733C33.5436 15.4733 36.952 16.8866 39.5472 19.1952L46.4755 12.2669C42.1008 8.18979 36.249 5.67542 29.7971 5.67542C20.3887 5.67542 12.2296 10.9871 8.12671 18.769Z"
                  fill="#FF3D00"
                />
                <path
                  d="M29.7971 54.6647C36.124 54.6647 41.8729 52.2434 46.2195 48.3059L38.6384 41.8908C36.1791 43.7536 33.1222 44.8668 29.7971 44.8668C23.426 44.8668 18.0164 40.8044 15.9784 35.1351L7.99072 41.2894C12.0446 49.222 20.2772 54.6647 29.7971 54.6647Z"
                  fill="#4CAF50"
                />
                <path
                  d="M53.8153 25.3729H51.8423V25.2712H29.7971V35.0691H43.6403C42.6703 37.8088 40.9079 40.1713 38.6348 41.8921C38.636 41.8908 38.6372 41.8909 38.6385 41.8896L46.2195 48.3048C45.6831 48.7922 54.2918 42.4175 54.2918 30.1702C54.2918 28.5278 54.1227 26.9246 53.8153 25.3729Z"
                  fill="#1976D2"
                />
              </svg>
            </StyeldSVGButton>
            <div
              className="register"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              {t("Member")}&nbsp;&nbsp;
              <span style={{ textDecoration: "underline", color: "black" }}>{t("Register")}</span>
            </div>
            <StyledSignInButton
              onClick={() => {
                if (!isSubmit)
                  setIsSubmit(true)
              }
              }
              whileHover={!isSubmit && hoverAnimation}
              whileTap={!isSubmit && tapAnimation}
            >
              {!isSubmit ? `${t("Login")}` : <StyledLoading />}
            </StyledSignInButton>
          </div>
        </div>
      </StyledSignInComponent>
    </StyledLoginContainer>
  );
}

export default SignInPageContent;
