import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {useTranslation} from "react-i18next";
import { useAuth } from "src/app/auth/AuthContext";
import { showMessage } from "app/store/fuse/messageSlice";
import appConfig from "app/configs/appConfig";

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

const PayPalCheckout = (props) => {
  const initialOptions = {
    "client-id": appConfig.PAYPAL_CLIENT_ID,
    "enable-funding": "",
    "disable-funding": "paylater,venmo,card",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { depositAmount, setIsUpdated } = props;
  const { token } = useAuth();
  const {t} = useTranslation("DepositPage");

  return (
    <div style={{ width: "50%" }}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          forceReRender={[depositAmount]}
          createOrder={async () => {
            try {
              if (!depositAmount) {
                dispatch(showMessage({
                  message: `${t("Fill_Amount_MSG")}`,
                  variant: 'warning'
                }));
                return;
              }
              const response = await fetch(appConfig.API_SERVER + "customer/deposit/paypalorder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_token: token,
                  depositAmount: depositAmount.toString(),
                }),
              });

              const orderData = await response.json();

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              dispatch(showMessage({
                message: `Could not initiate PayPal Checkout...${error}`,
                variant: 'error'
              }));
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(appConfig.API_SERVER + `customer/deposit/paypalcapture/${data.orderID}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user_token: token,
                  }),
                },
              );

              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`,
                );
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];

                if (transaction.status == 'COMPLETED') {
                  const sellerReceiving = transaction.seller_receivable_breakdown;
                  dispatch(showMessage({
                    message: `Deposited ${sellerReceiving.net_amount.value}${sellerReceiving.net_amount.currency_code} successfully, with the PayPal fee ${sellerReceiving.paypal_fee.value}${sellerReceiving.paypal_fee.currency_code}`,
                    variant: 'success'
                  }));
                  setIsUpdated(true);
                }
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2),
                );
              }
            } catch (error) {
              console.error(error);
              dispatch(showMessage({
                message: `Failed to make PayPal transaction`,
                variant: 'error'
              }));
            }
          }}
        />
      </PayPalScriptProvider>
      {/* <Message content={message} /> */}
    </div>
  );
}

export default PayPalCheckout;
