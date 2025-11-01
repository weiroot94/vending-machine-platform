import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {styled} from "@mui/material/styles";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import { QrReader } from "react-qr-reader";
import appConfig from "app/configs/appConfig";

function QrScanContent(props) {
  const StyledQrScanContainer = styled("div")(`
    display: flex;
    width: 1328px;
    height: 712px;
    justify-content: center;
    align-items: center;
    gap: 50px;
    flex-shrink: 0;
    margin-top: 150px;
    margin-bottom: 150px;
  `);

  const StyledQrScanInfo = styled("div")(`
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `);

  const StyledQrScanInfoTitle = styled("div")(`
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 60px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -2.4px;
  `);

  const StyledQrScanInfoDescription = styled("div")(`
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    align-self: stretch;

    div {
      color: #333232;
      font-family: Museo Sans;
      font-size: 28px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.12px;

      padding: 0px 100px;
    }
  `);

  const StyledScanQRButton = styled(motion.button)(({ theme }) => ({
    display: "flex",
    padding: "15px 26px",
    justifyContent: "center",
    alignItems: "center",
    width: "322px",
    height: "61px",
    gap: "10px",
    borderRadius: "15px",
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
    scale: 1.05
  };

  const StyledQrScanDevice = styled("div")(`
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);
    flex: 1 0 0;
    align-self: stretch;

    display: flex;
    justify-content: center;
    align-items: center;
  `);

  const StyledQrScanSection = styled("div")(`
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  align-self: stretch;

    div {
      color: #333232;
      font-family: Museo Sans;
      font-size: 28px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -1.12px;

      padding: 0px 100px;
    }

    .qr-reader {
      width: 80%;
    }

    p {
      color: blue;
      font-size: 22px;
    }
  `);

  const {t} = useTranslation("QrScanPage");
  const {i18n} = useTranslation();
  const {token} = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qrResult, setQrResult] = useState(`${t("ScanQR")}`);
  const [isCaptured, setCaptured] = useState(false);

  let handleScan = (data) => {
    if (data) {      
      if (isCaptured == false) {
        setCaptured(true);
        
        try {
          axios.post(appConfig.API_SERVER + "client/qrsell", {
            user_token: token,
            order_data: data.text,
          }).then((response) => {
            dispatch(showMessage({
              message: response.data.message,
              variant: "success"
            }));
              setQrResult(response.data.message);
              setTimeout(navigate('/payment'), 2000);
            }).catch(err => {
                if (err.response) {
                  if (err.response.status == 400 || err.response.status == 500) {
                    dispatch(
                      showMessage({
                          message: err.response.data.error,
                          variant: 'error'
                      }));
                    setQrResult(err.response.data.error);
                  }
                } else {
                  console.log(err);
                  dispatch(
                    showMessage({
                        message: `${t("Order_Fail_MSG")}`,
                        variant: 'error'
                    }));
                  setQrResult(`${t("Again_MSG")}`);
                }
            });
        } catch (err) {
          console.log(err);
          dispatch(showMessage({
            message: `${t("Trans_Fail_MSG")}`,
            variant: "error"
          }));
        }
      }
    }
  };

  return (
    <StyledQrScanContainer className="w-full">
      <StyledQrScanInfo>
        <StyledQrScanInfoTitle>{t("Instruction")}</StyledQrScanInfoTitle>
        <StyledQrScanInfoDescription>
          <div>
            {t("Desc1")}
          </div>
          <div>
            {t("Desc2")}
          </div>
          <div>
            {t("Desc3")}
          </div>
        </StyledQrScanInfoDescription>
        <br></br>
        {/* <StyledScanQRButton
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
        >
          SCAN QR CODE
        </StyledScanQRButton> */}
      </StyledQrScanInfo>
      <StyledQrScanDevice>
        <StyledQrScanSection>
          <div>{t("Camera")}</div>
          <QrReader
            className="qr-reader"
            delay={300}
            // onError={handleError}
            onResult={handleScan}
            constraints={{
              facingMode: "environment",
            }}
          />
          <p>{qrResult}</p>
        </StyledQrScanSection>
      </StyledQrScanDevice>
    </StyledQrScanContainer>
  );
}

export default QrScanContent;
