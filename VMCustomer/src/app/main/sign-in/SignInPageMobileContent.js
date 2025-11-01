import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StyledLoginContainer = styled("div")(`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    .logo-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        flex-shrink: 0;
        background: linear-gradient(180deg, #9ddfef 0%, #B8F0FF 33%, #B8F0FF 67%, #9ddfef 100%);
    }

    .sign-form {
      margin-top: 60px;
      padding-left: 25px;
      padding-right: 25px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;

      .title {
        color: #000;
        text-align: center;
        font-family: Museo Sans;
        font-size: 30px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -1.2px;
      }

      .sign-input {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 5px;

        div {
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-size: 20px;
          font-style: normal;
          font-weight: 250;
          line-height: normal;
          letter-spacing: -0.8px;
        }

        input {
          width: 100%;
          height: 39px;
          border-radius: 5px;
          background: #F6F6F6;
          padding: 5px;
          font-size: 20px;
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
  width: "247px",
  height: "44px",
  gap: "10px",
  borderRadius: "13px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "26px",
  fontStyle: "normal",
  fontWeight: "600",
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


  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation("SignInPage");

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
      <div className="logo-container">
        <img src="assets/images/logo/logo-new-color.png" />
      </div>
      <div className="sign-form">
        <div className="title">{t("Login")}</div>
        <div className="sign-input">
          {t("Email")}
          <input
            type="text"
            onKeyDown={handleKeyDown}
            ref={emailRef}
          />
        </div>
        <div className="sign-input">
          {t("Password")}
          <input
            type="password"
            onKeyDown={handleKeyDown}
            ref={passwordRef}
          />
        </div>
        <div
          className="forgotpass"
          onClick={() => {
            navigate("/resetpass/loginuser");
          }}
        >
          {t("Forgot")}
        </div>
        <svg
          width="281"
          height="21"
          viewBox="0 0 281 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M141.149 10.4786C141.149 11.7258 140.924 12.8037 140.473 13.7123C140.023 14.6208 139.405 15.3214 138.619 15.8142C137.834 16.3069 136.937 16.5533 135.929 16.5533C134.92 16.5533 134.023 16.3069 133.238 15.8142C132.452 15.3214 131.835 14.6208 131.384 13.7123C130.934 12.8037 130.708 11.7258 130.708 10.4786C130.708 9.23128 130.934 8.15338 131.384 7.24486C131.835 6.33635 132.452 5.63571 133.238 5.14296C134.023 4.65021 134.92 4.40383 135.929 4.40383C136.937 4.40383 137.834 4.65021 138.619 5.14296C139.405 5.63571 140.023 6.33635 140.473 7.24486C140.924 8.15338 141.149 9.23128 141.149 10.4786ZM139.763 10.4786C139.763 9.45455 139.592 8.59031 139.249 7.88583C138.91 7.18134 138.45 6.64817 137.869 6.2863C137.291 5.92444 136.645 5.7435 135.929 5.7435C135.213 5.7435 134.564 5.92444 133.983 6.2863C133.405 6.64817 132.945 7.18134 132.603 7.88583C132.264 8.59031 132.094 9.45455 132.094 10.4786C132.094 11.5026 132.264 12.3668 132.603 13.0713C132.945 13.7758 133.405 14.3089 133.983 14.6708C134.564 15.0327 135.213 15.2136 135.929 15.2136C136.645 15.2136 137.291 15.0327 137.869 14.6708C138.45 14.3089 138.91 13.7758 139.249 13.0713C139.592 12.3668 139.763 11.5026 139.763 10.4786ZM142.906 16.3916V4.56551H146.902C147.826 4.56551 148.584 4.72335 149.177 5.03902C149.77 5.35084 150.209 5.78007 150.494 6.32672C150.779 6.87337 150.921 7.49509 150.921 8.19187C150.921 8.88866 150.779 9.50652 150.494 10.0455C150.209 10.5844 149.772 11.0079 149.183 11.3159C148.594 11.62 147.841 11.772 146.925 11.772H143.692V10.4786H146.879C147.51 10.4786 148.019 10.3862 148.404 10.2014C148.792 10.0166 149.073 9.75483 149.247 9.41606C149.424 9.07344 149.512 8.66538 149.512 8.19187C149.512 7.71837 149.424 7.30453 149.247 6.95036C149.069 6.5962 148.787 6.32287 148.398 6.13039C148.009 5.93406 147.495 5.83589 146.856 5.83589H144.338V16.3916H142.906ZM148.473 11.0791L151.383 16.3916H149.72L146.856 11.0791H148.473Z"
            fill="black"
          />
          <line
            x1="0.698242"
            y1="12.5875"
            x2="120.458"
            y2="12.5875"
            stroke="black"
            strokeWidth="0.73913"
          />
          <line
            x1="161.09"
            y1="12.5875"
            x2="280.849"
            y2="12.5875"
            stroke="black"
            strokeWidth="0.73913"
          />
        </svg>
        <StyeldSVGButton onClick={loginGoogle}>
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20.5" cy="20.4351" r="20" fill="white" />
            <path d="M34.8617 17.5051H33.6819V17.4443H20.5V23.303H28.7775C27.5699 26.7134 24.3249 29.1616 20.5 29.1616C15.6468 29.1616 11.712 25.2268 11.712 20.3736C11.712 15.5205 15.6468 11.5857 20.5 11.5857C22.7402 11.5857 24.7783 12.4308 26.3301 13.8112L30.4729 9.66845C27.857 7.23052 24.3579 5.72705 20.5 5.72705C12.4114 5.72705 5.85339 12.2851 5.85339 20.3736C5.85339 28.4622 12.4114 35.0202 20.5 35.0202C28.5886 35.0202 35.1466 28.4622 35.1466 20.3736C35.1466 19.3916 35.0455 18.433 34.8617 17.5051Z" fill="#FFC107" />
            <path d="M7.54224 13.5564L12.3544 17.0855C13.6565 13.8618 16.8099 11.5857 20.5001 11.5857C22.7403 11.5857 24.7784 12.4308 26.3302 13.8112L30.4729 9.66845C27.8571 7.23052 24.358 5.72705 20.5001 5.72705C14.8743 5.72705 9.99554 8.90317 7.54224 13.5564Z" fill="#FF3D00" />
            <path d="M20.4999 35.02C24.2832 35.02 27.7207 33.5722 30.3198 31.2178L25.7866 27.3818C24.3161 28.4957 22.4882 29.1614 20.4999 29.1614C16.6904 29.1614 13.4557 26.7322 12.2371 23.3423L7.46082 27.0222C9.88483 31.7655 14.8075 35.02 20.4999 35.02Z" fill="#4CAF50" />
            <path d="M34.8617 17.5051H33.6819V17.4443H20.5V23.303H28.7775C28.1975 24.9412 27.1437 26.3539 25.7845 27.3828C25.7852 27.382 25.786 27.3821 25.7867 27.3813L30.3198 31.2173C29.999 31.5087 35.1466 27.697 35.1466 20.3737C35.1466 19.3916 35.0455 18.433 34.8617 17.5051Z" fill="#1976D2" />
          </svg>
        </StyeldSVGButton>
        <div
          className="register"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          {t("Member")}&nbsp;&nbsp;{" "}
          <span style={{ textDecoration: "underline" }}>{t("Register")}</span>
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
          {!isSubmit ? `${t("SignIn")}` : <StyledLoading />}
        </StyledSignInButton>
      </div>
    </StyledLoginContainer>
  );
}

export default SignInPageContent;
