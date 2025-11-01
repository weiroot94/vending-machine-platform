const express = require("express");
const router = new express.Router();

const ClientController = require("../controller/ClientController");

// Machine Update
router.post("/ping", ClientController.GetPingFromMachine);
router.post("/code", ClientController.UpdateCode);
router.post("/language", ClientController.UpdateLanguage);
router.post("/ads", ClientController.UpdateADS);
router.post("/product", ClientController.UpdateProduct);
router.post("/info", ClientController.UpdateInfo);
router.post("/sell", ClientController.SellProduct);
router.post("/qrsell", ClientController.SellProductQR);
router.post("/confirmpurchase", ClientController.confirmPurchaseFromMachine);
router.post("/licensecheck", ClientController.CheckMachineLocked);

module.exports = router;
