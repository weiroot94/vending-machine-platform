import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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

      .reset-password-form {
        width: 578px;
        height: 665px;
        transform: rotate(0.27deg);
  
        display: flex;
        padding: 4.42px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
  
        .reset-password-title {
          font-size: 40px;
          font-weight: bold;
          color: white;
          margin-bottom: 50px;
        }
  
        .reset-password-description {
          font-family: Museo Sans;
          font-size: 24px;
          font-weight: 500;
          padding: 0px 80px;
          text-align: center;
          margin-bottom: 50px;
        }
  
        .reset-password-input-label {
          font-family: Museo Sans;
          font-size: 24px;
          font-weight: 500;
          margin-right: auto;
          margin-left: 6%;
        }
  
        .reset-password-input {
          width: 88%;
          height: 52.157px;
          flex-shrink: 0;
          border-radius: 8.84px;
          background: #F9F9F9;
  
          color: #464141;
          text-align: center;
          font-family: Museo Sans;
          font-size: 28.289px;
          font-style: italic;
          font-weight: 300;
          line-height: normal;
          letter-spacing: -1.132px;
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
          margin-top: 40px;
        }
      }
    }
  `);

const StyledButton = styled(motion.button)(({ theme }) => ({
  display: "flex",
  padding: "15px 26px",
  justifyContent: "center",
  alignItems: "center",
  width: "88%",
  height: "52.157px",
  gap: "10px",
  borderRadius: "13px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "22px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-1.44px",
  cursor: "pointer",
  marginTop: "15px",
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
  backgroundColor: "#536A71",
  borderColor: "#536A71",
  transition: { duration: 0.2 }
};

const tapAnimation = {
  scale: 1.2
};

function ResetPasswordPageContent(props) {
  const { goToSetNewPass, sendPasswordResetRequest, doPasswordReset } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("ResetPasswordPage");

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
      <StyledSignInComponent>
        <div className="img-place"></div>
        <div className="sign-panel">
          {!goToSetNewPass ?
            <div className="reset-password-form">
              <p className="reset-password-title">{t("Forgot")}</p>
              <p className="reset-password-description">
                {t("MailDesc")}
              </p>
              <p className="reset-password-input-label">{t("Email")}</p>
              <input
                className="reset-password-input"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />

              <StyledButton
                onClick={() => {
                  if (!isSubmit)
                    setIsSubmit(true)
                  }
                }
                whileHover={!isSubmit && hoverAnimation}
                whileTap={!isSubmit && tapAnimation}
              >
                {!isSubmit ? `${t("Continue")}` :  <StyledLoading />}
              </StyledButton>
              <div
                className="register"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                {t("DontAccount")}&nbsp;&nbsp;
                <span style={{ textDecoration: "underline", color: "black" }}>{t("SignUp")}</span>
              </div>
            </div>
            :
            <div className="reset-password-form">
              <p className="reset-password-title">{t("SetPassword")}</p>
              <p className="reset-password-description">
                {t("PwdDesc")}
              </p>
              <p className="reset-password-input-label">{t("NewPassword")}</p>
              <input
                type="password"
                className="reset-password-input"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />

              <StyledButton
                onClick={() => {
                  if (!isSubmit)
                    setIsSubmit(true)
                  }
                }
                whileHover={!isSubmit && hoverAnimation}
                whileTap={!isSubmit && tapAnimation}
              >
                {!isSubmit ? `${t("ResetPassword")}` :  <StyledLoading />}
              </StyledButton>
            </div>}
        </div>
      </StyledSignInComponent>
    </StyledLoginContainer>
  );
}

export default ResetPasswordPageContent;
