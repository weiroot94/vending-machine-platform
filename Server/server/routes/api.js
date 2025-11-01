const express = require("express");
const router = new express.Router();
const upload = require("../middleware/filesMiddleware");

const UserController = require("../controller/UserController");
const SubscriptionController = require("../controller/SubscriptionController");
const MachineController = require("../controller/MachineController");
const ProductController = require("../controller/ProductController");
const AdvertisementController = require("../controller/AdvertisementController");
const InformationController = require("../controller/InformationController");
const OverviewController = require("../controller/OverviewController");
const AuditController = require("../controller/AuditController");
const LanguageController = require("../controller/LanguageController");
const UpdateController = require("../controller/UpdateController");
const SalesController = require("../controller/SalesController");
const AnalyticsController = require("../controller/AnalyticsController");
const DashboardController = require("../controller/DashboardController");
const ChangelogController = require("../controller/ChangelogController");

// Users API
router.post("/overview", OverviewController.GetOverviewInfo);

// Users API
router.post("/user/add", UserController.UserAdd);
router.post("/user/delete", UserController.UserDelete);
router.post("/user/update", UserController.UserUpdate);
router.post("/user/detail", UserController.UserDetail);
router.post("/user/list", UserController.UserList);

// Subscription API
router.post("/subscription/add", SubscriptionController.SubscriptionAdd);
router.post("/subscription/delete", SubscriptionController.SubscriptionDelete);
router.post("/subscription/update", SubscriptionController.SubscriptionUpdate);
router.post("/subscription/detail", SubscriptionController.SubscriptionDetail);
router.post("/subscription/send", SubscriptionController.SubscriptionSend);
router.post("/subscription/list", SubscriptionController.SubScriptionList);
router.post("/subscription/disable", SubscriptionController.SubscriptionDisable);

// ADS API
router.post("/ads/add", AdvertisementController.AdvertisementAdd);
router.post("/ads/update", AdvertisementController.AdvertisementUpdate);
router.post("/ads/detail", AdvertisementController.AdvertisementDetail);
router.post("/ads/list", AdvertisementController.AdvertisementList);
router.post("/ads/delete", AdvertisementController.AdvertisementDelete);

// Information API
router.post("/info/add", InformationController.InformationAdd);
router.post("/info/update", InformationController.InformationUpdate);
router.post("/info/detail", InformationController.InformationDetail);
router.post("/info/list", InformationController.InformationList);
router.post("/info/delete", InformationController.InformationDelete);

// Machine API
router.post("/machine/add", MachineController.MachineAdd);
router.post("/machine/delete", MachineController.MachineDelete);
router.post("/machine/update", MachineController.MachineUpdate);
router.post("/machine/list", MachineController.MachineList);
router.post("/machine/detail", MachineController.MachineDetail);
router.post("/machine/license", MachineController.MachineLicense);

// Product API
router.post("/product/add", ProductController.ProductAdd);
router.post("/product/delete", ProductController.ProductDelete);
router.post("/product/update", ProductController.ProductUpdate);
router.post("/product/detail", ProductController.ProductDetail);
router.post("/product/list", ProductController.ProductList);

// Audit API
router.post("/audit/list", AuditController.AuditList);

// Language API
router.post("/language/add", LanguageController.LanguageAdd);
router.post("/language/delete", LanguageController.LanguageDelete);
router.post("/language/update", LanguageController.LanguageUpdate);
router.post("/language/detail", LanguageController.LanguageDetail);
router.post("/language/list", LanguageController.LanguageList);

// Update API
router.post("/update/add", UpdateController.UpdateAdd);
router.post("/update/delete", UpdateController.UpdateDelete);
router.post("/update/update", UpdateController.UpdateUpdate);
router.post("/update/detail", UpdateController.UpdateDetail);
router.post("/update/list", UpdateController.UpdateList);

// Sales API
router.post("/sales/list", SalesController.GetSalesList);

// Analytics API
router.post("/analytics/total", AnalyticsController.GetTotalValues);
router.post("/analytics/type", AnalyticsController.GetTypeValues);
router.post("/analytics/machine", AnalyticsController.GetMachineValues);
router.post("/analytics/area", AnalyticsController.GetAreaValues);

// Dashboard API
router.post("/dashboard/all", DashboardController.GetAllDetails);

// Changelog API
router.post("/changelog/list", ChangelogController.ChangelogList);
router.post("/changelog/add", ChangelogController.AddChangelogItem);

module.exports = router;
