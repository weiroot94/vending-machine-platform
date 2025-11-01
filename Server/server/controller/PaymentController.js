const Deposit = require("../models/deposit");
const Util = require("./Util");
const logger = require("../logger");

class PaymentController {
  static DepositList = async (req, res, next) => {
    const {user_token} = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        const depositList = await Deposit.find({depositor: user._id});
        // When user info is needed to use, can try this to populate depositor field
        // const depositList = await Deposit.find({}).populate('depositor').exec();
        const showList = [];
        await Promise.all(
          depositList.map(async (deposit) => {
            showList.push({
              id: deposit._id,
              amount: deposit.amount,
              method: deposit.method,
              date: deposit.created_at,
            })
          })
        );
        res.status(200).json({
          status: "success",
          message: "",
          data: showList,
        });
      } else {
        res.status(400).json({
          error: "Token verification failed",
        });
      }
    } catch (err) {
      logger.error("[controller/paymentcontroller] Failed to query Deposit list");
    }
  };

  static DepositCard = async (req, res) => {
    const {user_token, card_name, card_no, cvc_no, deposit_amount} = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        const newDeposit = new Deposit();
        newDeposit.depositor = user._id;
        newDeposit.amount = deposit_amount;
        newDeposit.method = 'card';
        newDeposit.debitcard = {
          name: card_name,
          cardno: card_no,
          cvcno: cvc_no,
        };
        newDeposit.created_at = new Date().toLocaleString("en-us");
        await newDeposit.validate();

        newDeposit.save().then(() => {
            res.status(200).json({
              status: "success",
              message: `Deposited Successfully`,
            });
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({
              status: "error",
              message: "An error occurred while saving the Deposit.",
            });
          });
      } else {
        res.status(400).json({
          error: "Token verification failed",
        });
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err);
        logger.error("[controller/paymentcontroller] Failed to deposity money via card");
        res.status(500).json({
          error: "Failed to deposit money via credit card",
        });
      }
    }
  };
}

module.exports = PaymentController;
