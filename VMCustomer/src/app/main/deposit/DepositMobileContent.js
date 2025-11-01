import {styled} from "@mui/material/styles";
import {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import PayPalCheckout from "./PayPalCheckout";

const StyledDepositContainer = styled("div")(`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;

    .title {
      color: #000;
      text-align: center;
      font-family: Museo Sans;
      font-size: 25px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
    }
  `);

  const StyledDepositForm = styled("div")(`
    width: 100%;
    border-radius: 10px 10px 10px 10px;
    background: #FFF;
    box-shadow: 0px 4px 13.9px 4px rgba(0, 0, 0, 0.25);
    padding: 70px 25px 70px 25px;

    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
    flex-shrink: 0;

    .deposit-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 35px;
      flex: 1 0 0;
      align-self: stretch;

      .balance {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .balance-label {
          color: rgba(0, 0, 0, 0.70);
          text-align: center;
          font-family: Museo Sans;
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.8px;
        }

        .balance-amount {
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-size: 25px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -1px;
        }
      }

      .deposit-amount {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 29px;

        .deposit-title {
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          font-size: 30px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -1.2px;
        }

        .deposit-subtitle {
          margin-top: -15px;
          color: rgba(0, 0, 0, 0.70);
          text-align: center;
          font-family: Museo Sans;
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.8px;
        }

        .deposit-amount-items {
          display: flex;
          align-items: flex-start;
          gap: 12px 3%;
          flex-wrap: wrap;
          width: 100%;

          .deposit-amount-item {
            display: flex;
            padding: 13px 10px;
            justify-content: center;
            align-items: center;
            flex: 1 0 47%;
            background: #D9D9D9;
            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.8px;
          }
          .deposit-amount-item.active {
            background: #1D2D35;
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
            color: #FFF;
          }
        }

        .deposit-custom-amount-input {
          width: 100%;
          height: 43px;
          margin-top: -17px;
          transform: rotate(-0.296deg);
          background: #D9D9D9;
          color: #464141;
          text-align: center;
          font-family: Museo Sans;
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.8px;
        }
      }
    }

    .deposit-method {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 36px;
      width: 100%;

      .title {
        color: rgba(0, 0, 0, 0.70);
        text-align: center;
        font-family: Museo Sans;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.8px;
      }


      .note {
        color: rgba(0, 0, 0, 1);
        font-family: Museo Sans;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.8px;
      }

      .payment-list {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 36px;
        width: 100%;

        .payment-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .payment-name {
            display: flex;
            align-items: center;
            gap: 25px;

            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.8px;
          }
        } 
      }
    }
  `);

  const StyledCardForm = styled("div")(`
    width: 100%;
    height: 100%;
    border-radius: 10px 10px 10px 10px;
    background: #FFF;
    box-shadow: 0px 4px 13.9px 4px rgba(0, 0, 0, 0.25);
    padding: 25px 25px 70px 25px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    flex-shrink: 0;

    .card-form-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      width: 100%;

      .card-form-date {
        display: flex;
        flex-direction: row;
        gap: 2%;
        width: 100%;

        .date-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 50%; 
        }
      }
    }

    .card-form-input {
      width: 100%;
      height: 33px;
      background: #D9D9D9;
      color: #464141;
      font-family: Museo Sans;
      font-size: 18px;
      font-style: italic;
      font-weight: 300;
      padding: 5px;
      line-height: normal;
      letter-spacing: -1.6px;
    }

    .label-card {
      color: #000;
      margin-right: auto;
      font-family: Museo Sans;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  `);

  const StyledDepositButton = styled(motion.button)(({ theme }) => ({
    display: "inline-flex",
    width: "150px",
    marginTop: "40px",
    padding: "5.859px 10.155px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    border: "1px solid #000",
    background: "#1C2E33",
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    letterSpacing: "-0.344px",
    height: "45px",
    cursor: "pointer",
    "@media screen and (max-width: 1199px)": {
      fontSize: "2.5vw",
    },
  
    "@media screen and (max-width: 600px)": {
      fontSize: "20px",
    },
  }));

  const StyledLoading = styled("div")(`
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 28px;
    height: 28px;
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
    scale: 1.05
  };

  const StyledBackBtn = styled("div")(`
    height: 30px;
    width: 30px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: auto;
    transition: background 0.3s, transform 0.3s;
  
    &:active {
      transform: scale(1.2);
      background: #0e181c;
    }
  `);
  
function DepositMobileContent(props) {
  const {doByCard, setIsUpdated, goToCardTab, setGoToCardTab, userBalance} = props;
  const {t} = useTranslation("DepositPage");
  const dispatch = useDispatch();
  const [moneySelect, setMoneySelect] = useState("");
  const [customAmountMoney, setCustomAmountMoney]= useState("");
  const [depositAmount, setDepositAmount] = useState(0);

  const [cardName, setCardName] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardExpDate, setCardExpDate] = useState("");
  const [isDeposite, setIsDeposite] = useState(false);

  const onClickGoCard = () => {
    if (!moneySelect && !customAmountMoney) {
      dispatch(showMessage({
        message: `${t("First_Amount_MSG")}`,
        variant: "warning"
      }));
      return;
    }

    if (parseFloat(customAmountMoney) < 0) {
      dispatch(showMessage({
        message: `${t("Valid_Amount_MSG")}`,
        variant: "warning"
      }));
      return;
    }

    setGoToCardTab(true);
  }

  const handleCardNumberInput = event => {
    let formattedValue = event.target.value.replace(/\D/g, '');
    formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (formattedValue.length <= 19) {
      setCardNo(formattedValue);
    }
  };

  const handleCardExpDateInput = event => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .replace(/\D/g, '') // Remove non-numeric characters
      .slice(0, 6) // Limit input to 4 characters (MMYYYY)
      .replace(/(\d{2})(\d)/, '$1/$2'); // Add a slash after the second digit
    setCardExpDate(formattedValue);
  };

  const handleCardCVCInput = event => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      .replace(/\D/g, '');
    setCardCVC(formattedValue);
  }

  useEffect(() => {
    if (isDeposite)
    onClickDeposit();
  }, [isDeposite]);

  useEffect(() => {
    if (moneySelect) {
      setDepositAmount(moneySelect);
    } else if (customAmountMoney) {
      setDepositAmount(customAmountMoney);
    }
  }, [moneySelect, customAmountMoney]);

  const onClickDeposit = () => {
    if (!cardNo) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_Name_MSG")}`,
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

    if (!cardExpDate) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Expirate_Date_MSG")}`,
        variant: 'warning'
      }));
      return;
    } else {
      const parts = cardExpDate.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      const currentYear = new Date().getFullYear();

      if(parts.length != 2 || isNaN(month) || month < 1 || month > 12 ||
          isNaN(year) || year <= currentYear) {
            setIsDeposite(false);
            dispatch(showMessage({
              message: `${t("Card_Expiration_MSG")}`,
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

    if (!cardName) {
      setIsDeposite(false);
      dispatch(showMessage({
        message: `${t("Fill_Card_MSG")}`,
        variant: 'warning'
      }));
      return;
    }

    doByCard(cardName, cardNo, cardCVC, depositAmount, () => {
      setIsDeposite(false);
    });
  }

  return (
    <StyledDepositContainer>
      
      {goToCardTab ?
        <>
        <StyledBackBtn onClick={() => setGoToCardTab(false)}>
          <FuseSvgIcon className="FuseSidePanel-buttonIcon">
            heroicons-outline:chevron-left
          </FuseSvgIcon>
        </StyledBackBtn>
        <div className="title">{t("Deposit")} {goToCardTab ? parseFloat(depositAmount).toLocaleString('en-US') + '$' : ''} {t("Mobile_Sufix")}</div>
        <StyledCardForm>
          <div className="card-form-item">
            <div className="label-card">{t("CardNum")}</div>
            <input className="card-form-input"
                value={cardNo} onChange={handleCardNumberInput} />
          </div>
          <div className="card-form-item">
            <div className="card-form-date">
              <div className="date-item">
                <div className="label-card">{t("Expiration")}</div>
                <input className="card-form-input" placeholder="MM/YYYY"
                    value={cardExpDate} onChange={handleCardExpDateInput} />
              </div>
              <div className="date-item">
                <div className="label-card">{t("CVC")}</div>
                <input className="card-form-input"
                  value={cardCVC} onChange={handleCardCVCInput} />
              </div>
            </div>       
          </div>
          <div className="card-form-item">
            <div className="label-card">{t("Cardholder")}</div>
            <input className="card-form-input"
                value={cardName} onChange={e => setCardName(e.target.value)} />
          </div>
          <div className="card-form-item">
            <StyledDepositButton
              whileHover={!isDeposite && hoverAnimation}
              whileTap={!isDeposite && tapAnimation}
              onClick={() => {
                if(!isDeposite)
                  setIsDeposite(true);
              }}
            >
              {!isDeposite ? `${t("Done")}` :  <StyledLoading />}
            </StyledDepositButton>
          </div>
        </StyledCardForm>
        </>
        :
        <>
        <div className="title">{t("Mobile_Title")}</div>
        <StyledDepositForm>
        <div className="deposit-info">
          <div className="balance">
            <div className="balance-label">{t("Mobile_Balance")}</div>
            <div className="balance-amount">{userBalance} $</div>
          </div>
          <div className="deposit-amount">
            <div className="deposit-title">{t("Mobile_Deposit")} </div>
            <div className="deposit-subtitle">{t("Mobile_Amount")}</div>
            <div className="deposit-amount-items">
              <div
                className={
                  moneySelect == 5 && customAmountMoney == ""
                    ? "deposit-amount-item active"
                    : "deposit-amount-item"
                }
                onClick={() => {
                  setCustomAmountMoney("");
                  setMoneySelect(5);
                }}
              >
                5$
              </div>
              <div
                className={
                  moneySelect == 10 && customAmountMoney == ""
                    ? "deposit-amount-item active"
                    : "deposit-amount-item"
                }
                onClick={() => {
                  setCustomAmountMoney("");
                  setMoneySelect(10);
                }}
              >
                10$
              </div>
              <div
                className={
                  moneySelect == 15 && customAmountMoney == ""
                    ? "deposit-amount-item active"
                    : "deposit-amount-item"
                }
                onClick={() => {
                  setCustomAmountMoney("");
                  setMoneySelect(15);
                }}
              >
                15$
              </div>
              <div
                className={
                  moneySelect == 20 && customAmountMoney == ""
                    ? "deposit-amount-item active"
                    : "deposit-amount-item"
                }
                onClick={() => {
                  setCustomAmountMoney("");
                  setMoneySelect(20);
                }}
              >
                20$
              </div>
            </div>
            <input className="deposit-custom-amount-input" placeholder={t("Mobile_Custom")} type="number"
                  value={customAmountMoney} onChange={event => {
                    setMoneySelect("");
                    setCustomAmountMoney(event.target.value);
                  }} />
          </div>
        </div>
        <div className="deposit-method">
          {/* <div className="title">{t("Mobile_Pay_Type")}</div> */}
          <div className="title">{t("DEPOSIT_BY_PAYPAL")}</div>
          <div className="note">{t("DEPOSIT_BY_PAYPAL_NOTE")}</div>
          <PayPalCheckout depositAmount={depositAmount} setIsUpdated={setIsUpdated}/>
          {/* <div className="payment-list">
            <div
              className="payment-item"
              onClick={() => {
                onClickGoPayPal();
              }}
            >
              <div className="payment-name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="41"
                  viewBox="0 0 36 41"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1291_1674)">
                    <path
                      d="M30.3918 3.14816C28.4593 1.02123 24.966 0.109375 20.4972 0.109375H7.52716C6.61285 0.109375 5.83592 0.751466 5.69277 1.62208L0.29234 34.6954C0.184978 35.3475 0.707935 35.9383 1.39251 35.9383H9.39964L11.4107 23.6215L11.3483 24.0072C11.4915 23.1366 12.2626 22.4945 13.1758 22.4945H16.9808C24.4557 22.4945 30.3087 19.5627 32.0184 11.0818C32.0692 10.831 32.1131 10.5868 32.1512 10.3483C31.9353 10.2379 31.9353 10.2379 32.1512 10.3483C32.6603 7.21363 32.1477 5.08001 30.3918 3.14816Z"
                      fill="#27346A"
                    />
                    <path
                      d="M14.4745 9.21905C14.6881 9.12095 14.9259 9.06633 15.1753 9.06633H25.3435C26.5476 9.06633 27.6708 9.14213 28.6971 9.30154C28.9915 9.34724 29.2766 9.39964 29.5537 9.45983C29.8308 9.51891 30.0997 9.5858 30.3606 9.65937C30.4911 9.69616 30.6192 9.73406 30.7451 9.77419C31.2496 9.93694 31.7194 10.1264 32.1512 10.3483C32.6603 7.21251 32.1477 5.08001 30.3918 3.14816C28.4581 1.02123 24.966 0.109375 20.4972 0.109375H7.526C6.61285 0.109375 5.83592 0.751466 5.69277 1.62208L0.292341 34.6942C0.184978 35.3475 0.707936 35.9372 1.39136 35.9372H9.39964L13.5718 10.3895C13.6572 9.8656 14.0058 9.43642 14.4745 9.21905Z"
                      fill="#27346A"
                    />
                    <path
                      d="M32.0184 11.0816C30.3087 19.5615 24.4557 22.4944 16.9808 22.4944H13.1746C12.2615 22.4944 11.4903 23.1365 11.3483 24.0071L8.84665 39.3214C8.75314 39.8921 9.21029 40.4094 9.80829 40.4094H16.5582C17.3571 40.4094 18.0371 39.8476 18.1617 39.0862L18.2275 38.754L19.4997 30.9686L19.5817 30.5383C19.7064 29.777 20.3863 29.2151 21.1852 29.2151H22.1953C28.734 29.2151 33.8539 26.6501 35.3501 19.2315C35.9746 16.1314 35.6514 13.543 33.9994 11.7249C33.4984 11.1742 32.8761 10.7194 32.1511 10.3481C32.1119 10.5878 32.0692 10.8308 32.0184 11.0816Z"
                      fill="#2790C3"
                    />
                    <path
                      d="M30.3619 9.65896C30.101 9.58539 29.832 9.5185 29.555 9.45942C29.2779 9.40034 28.9916 9.34795 28.6984 9.30224C27.671 9.14172 26.5488 9.06592 25.3436 9.06592H15.1765C14.926 9.06592 14.6882 9.12054 14.4758 9.21975C14.006 9.43713 13.6585 9.86519 13.573 10.3902L11.4119 23.6211L11.3496 24.0068C11.4916 23.1362 12.2628 22.4941 13.1759 22.4941H16.9821C24.457 22.4941 30.31 19.5623 32.0197 11.0814C32.0705 10.8306 32.1132 10.5875 32.1525 10.3479C31.7195 10.1272 31.2508 9.93653 30.7464 9.77489C30.6205 9.73476 30.4924 9.69575 30.3619 9.65896Z"
                      fill="#1F264F"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1291_1674">
                      <rect
                        width="35.5038"
                        height="40.4435"
                        fill="white"
                        transform="translate(0.273438)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div>Paypal</div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
              >
                <path
                  d="M8.98445 8.92879C9.37497 8.53826 9.37497 7.9051 8.98445 7.51457L2.62049 1.15061C2.22997 0.760087 1.5968 0.760087 1.20628 1.15061C0.815752 1.54114 0.815752 2.1743 1.20628 2.56483L6.86313 8.22168L1.20628 13.8785C0.815752 14.2691 0.815752 14.9022 1.20628 15.2927C1.5968 15.6833 2.22997 15.6833 2.62049 15.2927L8.98445 8.92879ZM7.77734 9.22168H8.27734V7.22168H7.77734V9.22168Z"
                  fill="black"
                />
              </svg>
            </div>
            <div
              className="payment-item"
              onClick={() => {
                onClickGoCard();
              }}
            >
              <div className="payment-name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="62"
                  height="46"
                  viewBox="0 0 62 46"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1291_1681)">
                    <path
                      d="M11.8672 45.2197V42.2414C11.8672 41.0994 11.1347 40.355 9.87918 40.355C9.25155 40.355 8.57149 40.5535 8.10065 41.1989C7.73465 40.6528 7.21162 40.355 6.42696 40.355C5.9037 40.355 5.38091 40.5038 4.96225 41.0499V40.4543H3.86377V45.2197H4.96225V42.5887C4.96225 41.745 5.43309 41.3477 6.16557 41.3477C6.89757 41.3477 7.26404 41.7945 7.26404 42.5887V45.2197H8.36252V42.5887C8.36252 41.745 8.88531 41.3477 9.56536 41.3477C10.2978 41.3477 10.6638 41.7945 10.6638 42.5887V45.2197H11.8672ZM28.1349 40.4543H26.3566V39.0147H25.2581V40.4543H24.2642V41.3972H25.2579V43.5816C25.2579 44.6739 25.7287 45.319 26.9842 45.319C27.455 45.319 27.9778 45.1702 28.3443 44.9717L28.0303 44.078C27.7164 44.2765 27.3504 44.3263 27.0888 44.3263C26.5658 44.3263 26.3566 44.0285 26.3566 43.5319V41.3972H28.1349V40.4543ZM37.4459 40.3548C36.8183 40.3548 36.3999 40.6528 36.1383 41.0499V40.4543H35.0398V45.2197H36.1383V42.5392C36.1383 41.745 36.5042 41.2982 37.1843 41.2982C37.3935 41.2982 37.6552 41.3479 37.8644 41.3974L38.1782 40.4047C37.969 40.355 37.6551 40.355 37.4459 40.355V40.3548ZM23.375 40.8513C22.8517 40.5038 22.1194 40.355 21.3348 40.355C20.0795 40.355 19.2427 40.9506 19.2427 41.8938C19.2427 42.6882 19.8703 43.1348 20.9688 43.2838L21.4918 43.3336C22.0673 43.4326 22.3811 43.5816 22.3811 43.8299C22.3811 44.1773 21.9627 44.4256 21.2302 44.4256C20.4979 44.4256 19.9225 44.1773 19.5563 43.9292L19.0332 44.7234C19.6087 45.1205 20.3933 45.319 21.1778 45.319C22.6425 45.319 23.4796 44.6739 23.4796 43.7802C23.4796 42.9363 22.7995 42.4894 21.7532 42.3406L21.2302 42.2909C20.7593 42.2411 20.3933 42.1421 20.3933 41.8443C20.3933 41.4967 20.7593 41.2982 21.3348 41.2982C21.9627 41.2982 22.5903 41.5462 22.9041 41.6953L23.375 40.8513ZM52.5632 40.355C51.9353 40.355 51.5169 40.6528 51.2553 41.0499V40.4543H50.1568V45.2197H51.2553V42.5392C51.2553 41.745 51.6215 41.2982 52.3013 41.2982C52.5108 41.2982 52.7724 41.3479 52.9816 41.3974L53.2955 40.4047C53.0862 40.355 52.7724 40.355 52.5632 40.355ZM38.5444 42.837C38.5444 44.2765 39.5905 45.319 41.2122 45.319C41.9445 45.319 42.4675 45.1702 42.9905 44.7731L42.4675 43.9292C42.0491 44.227 41.6306 44.3758 41.1598 44.3758C40.2705 44.3758 39.6429 43.7802 39.6429 42.837C39.6429 41.9435 40.2705 41.3477 41.1598 41.2982C41.6306 41.2982 42.0491 41.447 42.4675 41.745L42.9905 40.9011C42.4675 40.5038 41.9445 40.355 41.2122 40.355C39.5905 40.355 38.5444 41.3974 38.5444 42.837ZM48.6923 42.837V40.4543H47.5939V41.0499C47.2276 40.6033 46.7046 40.355 46.0245 40.355C44.6122 40.355 43.5138 41.3974 43.5138 42.837C43.5138 44.2765 44.6122 45.319 46.0245 45.319C46.7568 45.319 47.28 45.0709 47.5939 44.6241V45.2197H48.6923V42.837ZM44.6644 42.837C44.6644 41.9931 45.2399 41.2982 46.1813 41.2982C47.0706 41.2982 47.6985 41.9435 47.6985 42.837C47.6985 43.6809 47.0706 44.3758 46.1813 44.3758C45.2399 44.3261 44.6644 43.6809 44.6644 42.837ZM31.5351 40.355C30.0704 40.355 29.0241 41.3477 29.0241 42.837C29.0241 44.3263 30.0702 45.319 31.5873 45.319C32.3196 45.319 33.052 45.1205 33.6275 44.6739L33.1042 43.9292C32.6858 44.227 32.1628 44.4256 31.6397 44.4256C30.9597 44.4256 30.2796 44.1277 30.1226 43.2836H33.8367V42.8867C33.8891 41.3477 32.9477 40.355 31.5351 40.355ZM31.5351 41.2484C32.2149 41.2484 32.686 41.6457 32.7904 42.3904H30.175C30.2796 41.745 30.7505 41.2484 31.5351 41.2484ZM58.7878 42.837V38.5679H57.6894V41.0499C57.3231 40.6033 56.8001 40.355 56.12 40.355C54.7077 40.355 53.6093 41.3974 53.6093 42.837C53.6093 44.2765 54.7077 45.319 56.12 45.319C56.8525 45.319 57.3755 45.0709 57.6894 44.6241V45.2197H58.7878V42.837ZM54.7602 42.837C54.7602 41.9931 55.3354 41.2982 56.2771 41.2982C57.1663 41.2982 57.794 41.9435 57.794 42.837C57.794 43.6809 57.1663 44.3758 56.2771 44.3758C55.3354 44.3261 54.7602 43.6809 54.7602 42.837ZM18.0394 42.837V40.4543H16.9409V41.0499C16.5746 40.6033 16.0516 40.355 15.3716 40.355C13.9593 40.355 12.8608 41.3974 12.8608 42.837C12.8608 44.2765 13.9593 45.319 15.3716 45.319C16.104 45.319 16.6271 45.0709 16.9409 44.6241V45.2197H18.0394V42.837ZM13.9593 42.837C13.9593 41.9931 14.5347 41.2982 15.4762 41.2982C16.3654 41.2982 16.9933 41.9435 16.9933 42.837C16.9933 43.6809 16.3654 44.3758 15.4762 44.3758C14.5347 44.3261 13.9593 43.6809 13.9593 42.837Z"
                      fill="black"
                    />
                    <path
                      d="M23.0083 4.26562H39.4854V32.3626H23.0083V4.26562Z"
                      fill="#FF5F00"
                    />
                    <path
                      d="M24.0548 18.3142C24.0548 12.6056 26.8794 7.54205 31.2209 4.26565C28.0303 1.88291 24.0026 0.443359 19.6087 0.443359C9.19892 0.443359 0.777344 8.43549 0.777344 18.3142C0.777344 28.1928 9.19892 36.1851 19.6085 36.1851C24.0024 36.1851 28.03 34.7456 31.2209 32.3626C26.8794 29.136 24.0548 24.0229 24.0548 18.3142Z"
                      fill="#EB001B"
                    />
                    <path
                      d="M61.717 18.3142C61.717 28.1928 53.2954 36.1851 42.8858 36.1851C38.4919 36.1851 34.4643 34.7456 31.2734 32.3626C35.6673 29.0864 38.4397 24.0229 38.4397 18.3142C38.4397 12.6056 35.6149 7.54205 31.2734 4.26565C34.464 1.88291 38.4919 0.443359 42.8858 0.443359C53.2954 0.443359 61.717 8.48524 61.717 18.3142Z"
                      fill="#F79E1B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1291_1681">
                      <rect
                        width="61"
                        height="45"
                        fill="white"
                        transform="translate(0.777344 0.443359)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div>{t("Mobile_Pay")}</div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
              >
                <path
                  d="M8.98445 8.92879C9.37497 8.53826 9.37497 7.9051 8.98445 7.51457L2.62049 1.15061C2.22997 0.760087 1.5968 0.760087 1.20628 1.15061C0.815752 1.54114 0.815752 2.1743 1.20628 2.56483L6.86313 8.22168L1.20628 13.8785C0.815752 14.2691 0.815752 14.9022 1.20628 15.2927C1.5968 15.6833 2.22997 15.6833 2.62049 15.2927L8.98445 8.92879ZM7.77734 9.22168H8.27734V7.22168H7.77734V9.22168Z"
                  fill="black"
                />
              </svg>
            </div>
          </div> */}
        </div>
      </StyledDepositForm>
        </>}
    </StyledDepositContainer>
  );
}

export default DepositMobileContent;
