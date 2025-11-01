const express = require("express");
const router = new express.Router();

const ProductController = require("../controller/ProductController");
const MapController = require("../controller/MapController");
const SalesController = require("../controller/SalesController");
const PaymentController = require("../controller/PaymentController");
const UserController = require("../controller/UserController");
const PayPalController = require("../controller/PayPalController");

// Product API
router.post("/product/list", ProductController.ProductList);
router.post("/product/home/list", ProductController.GetHomeProductList);
router.post("/product/detail", ProductController.ProductDetail);

// Location API
router.post("/map/machine/list", MapController.GetMachineList);
router.get("/map/machine/product/:id", MapController.GetMachineListByProduct);

// Card API
router.post("/deposit/list", PaymentController.DepositList);
router.post("/deposit/card", PaymentController.DepositCard);
router.post("/deposit/paypalorder", PayPalController.CreateOrder);
router.post("/deposit/paypalcapture/:orderID", PayPalController.CaptureOrder);

// Purchase History
router.post("/purchase/history", SalesController.GetPurchaseList);

// Profile API
router.post("/user/detail", UserController.GetUserInfoDetail);
router.post("/user/update", UserController.UpdateUserInfo);
router.post("/user/balance", UserController.GetUserBalance);
router.post("/user/delete", UserController.DeleteUserAccount);

module.exports = router;
