const Order = require("../models/order");
const Machine = require("../models/machine");
const Product = require("../models/product");
const Util = require("../controller/Util");
const moment = require("moment");
const machine = require("../models/machine");
const { startOfYear, endOfYear, startOfMonth, endOfMonth } = require('date-fns');

class SalesController {
  static GetSalesList = async (req, res, next) => {

    const startDate = startOfMonth(new Date(req.body.year, req.body.month-1, 1));
    const endDate = endOfMonth(new Date(req.body.year, req.body.month-1, 31));

    const orderList = await Order.aggregate([
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: "$created_at",
            }
          }
        }
      },
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
    ]);

    let detailedOrderList = [];

    await Promise.all(
      orderList.map(async (order) => {
        const populatedOrder = await Order.populate(order, [
          { path: 'orderer' },
          { path: 'product' },
          { path: 'machine' }
        ]);

        if (populatedOrder.machine == null)
          return;

        detailedOrderList.push({
          order_id: populatedOrder._id,
          orderer: populatedOrder.orderer,
          machine: populatedOrder.machine.serial_number,
          product: populatedOrder.product.name,
          product_count: populatedOrder.product_count,
          product_price: populatedOrder.product.price,
          total_amount: populatedOrder.total_amount,
          status: populatedOrder.purchased,
          payment: populatedOrder.payment,
          created_at: populatedOrder.created_at,
        });
      })
    );

    res.status(200).json({
      status: "success",
      message: "",
      details: detailedOrderList,
    });
  };

  static GetPurchaseList = async (req, res, next) => {
    const {user_token} = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        const purchaseList = await Order.find({orderer: user._id, purchased: 'success'}).populate('product').populate('machine').exec();
        const showList = [];
        await Promise.all(
          purchaseList.map(async (purchase) => {
            showList.push({
              date: purchase.updated_at,
              product: purchase.product,
              amount: purchase.product_count,
              machine: purchase.machine,
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
      logger.error("[controller/paymentcontroller] Failed to query Purchase list");
    }
  };
}

module.exports = SalesController;
