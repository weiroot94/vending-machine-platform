import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {QrReader} from "react-qr-reader";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import appConfig from "app/configs/appConfig";

function QrScanMobileContent(props) {
  const StyledQrScanContainer = styled("div")(`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    width: 100%;

    .title {
      color: #000;
      text-align: center;
      font-family: Museo Sans;
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
    }
  `);

  const StyledQrScanForm = styled("div")(`
    width: 100%;
    border-radius: 10px 10px 10px 10px;
    background: #FFF;
    box-shadow: 0px 4px 13.9px 4px rgba(0, 0, 0, 0.25);
    padding: 70px 25px 70px 25px;
    text-align: center;

    .qr-info {
      color: #4D4D4D;
      text-align: center;
      font-family: Museo Sans;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    p {
      color: blue;
      font-size: 20px;
    }
  `);

  const {t} = useTranslation("QrScanPage");
  const [qrResult, setQrResult] = useState(`${t("ScanQR")}`);
  const [isCaptured, setCaptured] = useState(false);
  const navigate = useNavigate();

  let handleScan = (data) => {
    if (data) {
      let orderData = JSON.parse(data.text);
      
      if (isCaptured == false) {
        setCaptured(true);
        
        try {
          axios.post(appConfig.API_SERVER + "client/qrsell", {
            user_token: token,
            order_data: orderData,
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
    <StyledQrScanContainer>
      <div className="title">{t("Scanner")}</div>
      <StyledQrScanForm>
        <div className="qr-info">
          {t("Align")}
        </div>
        <QrReader
          delay={300}
          // onError={handleError}
          onResult={handleScan}
          style={{ width: '100%' }}
          constraints={{
            facingMode: "environment",
          }}
        />
        <p>{qrResult}</p>
      </StyledQrScanForm>
    </StyledQrScanContainer>
  );
}

export default QrScanMobileContent;