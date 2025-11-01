import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
        height: 76px;
        flex-shrink: 0;
        background: #70ACCC;
    }

    .reset-pass-form {
      margin-top: 60px;
      padding-left: 25px;
      padding-right: 25px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 50px;

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

      .description {
        font-family: Museo Sans;
        font-size: 19px;
        font-weight: 500;
        padding: 0px 2px;
        text-align: center;
      }

      .reset-pass-input {
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

const hoverAnimation = {
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
  backgroundColor: "#60B6E3",
  borderColor: "#60B6E3",
  transition: { duration: 0.2 }
};

const tapAnimation = {
  scale: 1.2
};

function ResetPasswordPageMobileContent(props) {
  const { goToSetNewPass, sendPasswordResetRequest, doPasswordReset } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation("ResetPasswordPage");

  function onSubmit() {
    if (!goToSetNewPass) {
      sendPasswordResetRequest(email, () => {
        setIsSubmit(false);
      });
    } else {
      doPasswordReset(password, () => {
        setIsSubmit(false);
      });
    }
  }

  useEffect(() => {
    if (isSubmit)
      onSubmit();
  }, [isSubmit]);

  return (
    <StyledLoginContainer>
      <div className="logo-container">
        <img src="assets/images/logo/logo-new-color.png" />
      </div>
      {!goToSetNewPass ?
        <div className="reset-pass-form">
          <div className="title">{t("Forgot")}</div>
          <p className="description">{t("MailDesc")}</p>
          <div className="reset-pass-input">
            {t("Email")}
            <input
              type="text"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </div>
          <StyledSignInButton
            onClick={() => {
              if (!isSubmit)
                setIsSubmit(true)
            }}
            whileHover={!isSubmit && hoverAnimation}
            whileTap={!isSubmit && tapAnimation}
          >
            {!isSubmit ? `${t("Continue")}` :  <StyledLoading />}
          </StyledSignInButton>
          <div
            className="register"
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            {t("DontAccount")}&nbsp;&nbsp;
            <span style={{ textDecoration: "underline" }}>{t("SignUp")}</span>
          </div>

        </div>
        :
        <div className="reset-pass-form">
          <div className="title">{t("SetPassword")}</div>
          <p className="description">{t("PwdDesc")}</p>
          <div className="reset-pass-input">
            {t("NewPassword")}
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          <StyledSignInButton
            onClick={() => {
              if (!isSubmit)
                setIsSubmit(true)
            }}
            whileHover={!isSubmit && hoverAnimation}
            whileTap={!isSubmit && tapAnimation}
          >
            {!isSubmit ? `${t("ResetPassword")}` :  <StyledLoading />}
          </StyledSignInButton>
        </div>}
    </StyledLoginContainer>
  );
}

export default ResetPasswordPageMobileContent;
