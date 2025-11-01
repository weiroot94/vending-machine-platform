import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import { showMessage } from "app/store/fuse/messageSlice";
import PayPalCheckout from "./PayPalCheckout";

const StyledDepositContainer = styled("div")(`
    display: flex;
    width: 1383px;
    height: 752px;
    align-items: flex-start;
    gap: 25px;
    flex-shrink: 0;
    margin-top: 150px;
    margin-bottom: 150px;
    justify-content: center;
  `);

  const StyledDepositHistory = styled("div")(`
    width: 659px;
    height: 732px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);

    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .header {
      display: flex;
      height: 129px;
      padding: 34px 72px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      align-self: stretch;
      border-radius: 10px 10px 0px 0px;
      background: #1D2D35;

      color: #FFF;
      text-align: center;
      font-family: Museo Sans;
      font-size: 36px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -2.2px;
    }

    .title {
      color: #000;
      text-align: center;
      font-family: Museo Sans;
      font-size: 40px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -1.84px;
    }

    .history {
      background-color: rgb(245, 245, 245, 1);
      gap: 10px;
      align-self: stretch;
      height: 66%;
      overflow-y: scroll;

      .history-row {
        display: flex;
        width: 100%;
        padding: 10px;
        justify-content: flex-start;
        align-items: center;
        gap: 4%;
        flex: 1 0 0;

        .history-item {
          flex: 0 0 100%;
          align-self: stretch;
          border-radius: 10px;
          border: 1px solid #000;
          background: #E6FDFF;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          div {
            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 27px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -1.08px;
          }
        }
      }
    }
  `);

  const StyledDepoist = styled("div")(`
    width: 659px;
    height: 732px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);

    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .header {
      display: flex;
      height: 129px;
      padding: 34px 72px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      align-self: stretch;
      border-radius: 10px 10px 0px 0px;
      background: #1D2D35;

      color: #FFF;
      text-align: center;
      font-family: Museo Sans;
      font-size: 36px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -2.2px;
    }

    .card-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 30px;

      .title {
        color: #000;
        font-family: Museo Sans;
        font-size: 35px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.84px;
        width: 100%;
        text-align: center;
      }

      .note {
        color: #000;
        font-family: Museo Sans;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        width: 100%;
        text-align: center;
      }

      .card-form-input {
        width: 549.685px;
        height: 59px;
        transform: rotate(-0.296deg);
        border-radius: 10px;
        background: #D9D9D9;
        color: #464141;
        text-align: center;
        font-family: Museo Sans;
        font-size: 40px;
        font-style: italic;
        font-weight: 300;
        line-height: normal;
        letter-spacing: -1.6px;
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

  const StyledPayPalButton = styled(motion.button)(({ theme }) => ({
    display: "flex",
    padding: "15px 26px",
    justifyContent: "center",
    alignItems: "center",
    width: "410px",
    height: "61px",
    gap: "10px",
    borderRadius: "15px",
    border: "1px solid #000",
    background: "#DFF5FB",
    color: "#000",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "36px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-1.44px",
    cursor: "pointer",
  }));

  const hoverPayPalAnimation = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
    backgroundColor: "#BEF1FF",
    borderColor: "#BEF1FF",
    transition: { duration: 0.2 }
  };

  const StyledDepositButton = styled(motion.button)(({ theme }) => ({
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
    fontSize: "36px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-1.44px",
    cursor: "pointer",
    marginTop: "20px",
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

function DepositContent(props) {
  const {t} = useTranslation("DepositPage");
  const dispatch = useDispatch();

  const {depositList, doByCard, setIsUpdated, userBalance, payPalBtnRef} = props;
  const [cardName, setCardName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [amount, setAmount] = useState("");
  const [isDeposite, setIsDeposite] = useState(false);

  const itemsPerRow = 1;

  const rows = [];
  for (let i = depositList.length - 1; i >= 0; i -= itemsPerRow) {
    const rowProducts = depositList.slice(Math.max(0, i - itemsPerRow + 1), i + 1);
    rows.push(rowProducts);
  }

  // only accepts card-number formatted value ex: 3928 2394 3839 2020
  const handleCardNumberInput = event => {
    let formattedValue = event.target.value.replace(/\D/g, '');
    formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (formattedValue.length <= 19) {
      setCardNo(formattedValue);
    }
  };

  const onClickDepositByCard = () => {
    if (!cardName) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_Name_MSG")}`,
        variant: 'warning'
      }));
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_Amount_MSG")}`,
        variant: 'warning'
      }));
      return;
    }

    if (!cardNo) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_Card_MSG")}`,
        variant: 'warning'
      }));
      return;
    } else {
      if (cardNo.replace(/\s/g, '').length != 16) {
        setIsDeposite(false);
        dispatch(showMessage({
          message: `${t("Card_Invalid_MSG")}`,
          variant: 'warning'
        }));
        return;
      }
    }

    if (!cardCVC) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_CVC_MSG")}`,
        variant: 'warning'
      }));
      return;
    }

    doByCard(cardName, cardNo, cardCVC, amount, () => {
      setIsDeposite(false);
    });
  }

  useEffect(() => {
    if (isDeposite)
    onClickDepositByCard();
  }, [isDeposite]);

  return (
    <StyledDepositContainer className="w-full">
      <StyledDepositHistory>
        <div className="header">{t("CurBalance")} : <span style={{color: "#ddfdb3"}}>{userBalance}$</span></div>
        <div className="title">{t("PreDeposit")}</div>
        <div className="history">
          {rows.map((row) => (
            <div className="history-row" key={row[0].id}>
              {row.map((historyItem, index) => (
                <div className="history-item" key={index}>
                  <div>
                    <span style={{color: "#5ca7a0"}}>{t("Amount")}: </span>
                    <span style={{color: "#046254"}}>{historyItem.amount.toLocaleString('en-US')}$</span>
                  </div>
                  <div>
                    <span style={{color: "#5ca7a0"}}>{t("Date")}: </span>
                    <span style={{color: "#046254"}}>{historyItem.date.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </StyledDepositHistory>
      <StyledDepoist>
        <div className="header">{t("DepositNow")}</div>
        <div className="card-form">
          <div className="title">{t("DEPOSIT_BY_PAYPAL")}</div>
          <div className="note">{t("DEPOSIT_BY_PAYPAL_NOTE")}</div>
          {/* <input className="card-form-input" placeholder={t("Name")}
                value={cardName} onChange={e => setCardName(e.target.value)} /> */}

          <input className="card-form-input" type="number" placeholder={t("Amount")}
                  value={amount} onChange={e => setAmount(e.target.value)} />

          {/* <input className="card-form-input" placeholder={t("CardNum")}
                  type="text" value={cardNo} onChange={handleCardNumberInput}
                  maxLength="19" autoComplete="off" /> */}

          {/* <input className="card-form-input" placeholder={t("CVC")}
                  type="number" value={cardCVC}
                  onChange={e => setCardCVC(e.target.value)}
                  autoComplete="off" /> */}
        </div>
        {/* <StyledDepositButton
          whileHover={!isDeposite && hoverAnimation}
          whileTap={!isDeposite && tapAnimation}
          onClick={() => {
              if(!isDeposite)
                setIsDeposite(true);
            }
          }
          >
          {!isDeposite ? `${t("Deposit")}` :  <StyledLoading />} */}
        {/* </StyledDepositButton> */}
        <PayPalCheckout depositAmount={amount} setIsUpdated={setIsUpdated}/>
        {/* <StyledPayPalButton
          whileHover={hoverPayPalAnimation}
          whileTap={tapAnimation}
          ref={payPalBtnRef}
        >
          Use Paypal Instead &nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="42"
            viewBox="0 0 36 42"
            fill="none"
          >
            <g clipPath="url(#clip0_1249_357)">
              <path
                d="M30.6184 3.99655C28.6859 1.86962 25.1925 0.957764 20.7237 0.957764H7.75372C6.83941 0.957764 6.06248 1.59986 5.91933 2.47047L0.518902 35.5437C0.41154 36.1959 0.934497 36.7867 1.61907 36.7867H9.62621L11.6372 24.4699L11.5749 24.8556C11.718 23.985 12.4892 23.3429 13.4023 23.3429H17.2074C24.6823 23.3429 30.5353 20.4111 32.245 11.9302C32.2958 11.6794 32.3396 11.4352 32.3777 11.1967C32.1618 11.0863 32.1618 11.0863 32.3777 11.1967C32.8868 8.06201 32.3743 5.9284 30.6184 3.99655Z"
                fill="#27346A"
              />
              <path
                d="M14.7011 10.0674C14.9147 9.96934 15.1525 9.91472 15.4018 9.91472H25.57C26.7741 9.91472 27.8974 9.99052 28.9237 10.1499C29.218 10.1956 29.5032 10.248 29.7803 10.3082C30.0573 10.3673 30.3263 10.4342 30.5872 10.5078C30.7177 10.5445 30.8458 10.5824 30.9716 10.6226C31.4761 10.7853 31.946 10.9748 32.3777 11.1967C32.8868 8.0609 32.3743 5.9284 30.6184 3.99655C28.6847 1.86962 25.1925 0.957764 20.7237 0.957764H7.75257C6.83941 0.957764 6.06248 1.59986 5.91933 2.47047L0.518903 35.5426C0.411541 36.1959 0.934498 36.7856 1.61792 36.7856H9.62621L13.7983 11.2379C13.8837 10.714 14.2324 10.2848 14.7011 10.0674Z"
                fill="#27346A"
              />
              <path
                d="M32.2445 11.93C30.5347 20.4099 24.6818 23.3428 17.2068 23.3428H13.4007C12.4875 23.3428 11.7164 23.9849 11.5744 24.8555L9.07272 40.1698C8.97921 40.7405 9.43637 41.2578 10.0344 41.2578H16.7843C17.5832 41.2578 18.2631 40.6959 18.3878 39.9346L18.4536 39.6024L19.7258 31.817L19.8078 31.3867C19.9324 30.6254 20.6124 30.0635 21.4113 30.0635H22.4214C28.9601 30.0635 34.08 27.4985 35.5761 20.0799C36.2007 16.9798 35.8774 14.3914 34.2255 12.5732C33.7244 12.0226 33.1022 11.5677 32.3772 11.1965C32.338 11.4362 32.2952 11.6792 32.2445 11.93Z"
                fill="#2790C3"
              />
              <path
                d="M30.5885 10.5078C30.3276 10.4343 30.0586 10.3674 29.7815 10.3083C29.5045 10.2492 29.2182 10.1968 28.925 10.1511C27.8975 9.9906 26.7754 9.91479 25.5702 9.91479H15.4031C15.1526 9.91479 14.9148 9.96942 14.7024 10.0686C14.2325 10.286 13.885 10.7141 13.7996 11.2391L11.6385 24.47L11.5762 24.8557C11.7182 23.9851 12.4893 23.343 13.4025 23.343H17.2086C24.6836 23.343 30.5365 20.4112 32.2463 11.9302C32.2971 11.6794 32.3398 11.4364 32.379 11.1967C31.9461 10.976 31.4774 10.7854 30.9729 10.6238C30.8471 10.5836 30.7189 10.5446 30.5885 10.5078Z"
                fill="#1F264F"
              />
            </g>
            <defs>
              <clipPath id="clip0_1249_357">
                <rect
                  width="35.5038"
                  height="40.4435"
                  fill="white"
                  transform="translate(0.5 0.848633)"
                />
              </clipPath>
            </defs>
          </svg>
        </StyledPayPalButton> */}
      </StyledDepoist>
    </StyledDepositContainer>
  );
}

export default DepositContent;
