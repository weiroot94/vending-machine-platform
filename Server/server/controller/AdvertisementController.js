const Advertisement = require("../models/advertisement");
const User = require("../models/user");
const AuditController = require("./AuditController");
const Util = require("./Util");

class AdvertisementController {
  static AdvertisementList = async (req, res, next) => {
    try {
      let adsList = await Advertisement.find({});
      const userIds = [...new Set(adsList.map(ad => ad.ads_manager_id))];
      const users = await User.find({ _id: { $in: userIds } });
      const userMap = users.reduce((acc, user) => ({ ...acc, [user._id]: user.fullname }), {});

      adsList = adsList.map(ad => ({
        ...ad.toObject(),
        poster: userMap[ad.ads_manager_id] || 'No manager found'
      }));

      res.status(200).json({
        status: "success",
        message: "",
        data: adsList,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve advertisements",
        data: error
      });
    }
  };


  static AdvertisementAdd = async (req, res, next) => {
    try {
      if (!req.files || !req.files.attachfile) {
        return res.status(400).json({ status: "error", message: "No file uploaded" });
      }

      const file = req.files.attachfile;
      if (!Util.isValidFileType(file.name)) {
        return res.status(400).json({ status: "error", message: "Invalid file type" });
      }

      const fileName = Date.now() + "_" + file.name;
      const filePath = `server/upload/ads/${fileName}`;

      await Util.moveFile(file, filePath);

      const userResult = await User.findOne({ token: req.body.token });
      if (!userResult) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }

      const newADS = new Advertisement({
        title: req.body.title,
        ads_manager_id: userResult._id,
        filepath: filePath,
        type: req.body.type,
        created_at: new Date(),
        updated_at: new Date()
      });

      const newAdsResult = await newADS.save();
      await AuditController.AuditAdd(
        req.body.token, "video", "success",
        `@ added a new advertisement: <strong>${newADS.title}<strong>`
      );

      res.status(200).json({ status: "success", message: "Advertisement added successfully!" });

    } catch (err) {
      res.status(500).json({ status: "error", message: "Server error", error: err.message });
    }
  };

  static AdvertisementUpdate = async (req, res, next) => {
    try {
      const userResult = await User.findOne({ token: req.body.token });
      if (!userResult) {
        return res.status(404).json({ status: "error", message: "User not found" });
      }

      const updateFields = {
        type: req.body.type,
        title: req.body.title,
        ads_manager_id: userResult._id,
        updated_at: new Date().toLocaleString("en-us"),
      };

      if (req.files && req.files.attachfile) {
        const file = req.files.attachfile;
        const fileName = Date.now() + "_" + req.files.attachfile.name;
        await Util.moveFile(file, `server/upload/ads/${fileName}`);

        updateFields.filepath = `server/upload/ads/${fileName}`;
      }

      const updatedADS = await Advertisement.findOneAndUpdate(
        { _id: req.body.id },
        updateFields,
        { new: true } // Return the updated document
      );

      let comment = "";
      if (updatedADS.type !== req.body.type) {
        comment += `&nbsp;&nbsp;<strong class="text-info">type</strong>: <span>${updatedADS.type} -> ${req.body.type}</span>`;
      }
      if (updatedADS.title !== req.body.title) {
        comment += `&nbsp;&nbsp;<strong class="text-info">title<strong>: <span>${updatedADS.title} -> ${req.body.title}<span>`;
      }
      if (comment !== "") {
        comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;
      }

      await AuditController.AuditAdd(
        req.body.token,
        "video",
        "warning",
        `@ updated an advertisement: <strong>${updatedADS.title}</strong>${comment}`
      );

      res.status(200).json({ status: "success", message: "Advertisement updated successfully" });
    } catch (err) {
      console.error("Error updating advertisement:", err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };


  static AdvertisementDelete = async (req, res, next) => {
    try {
      const adId = req.body.id;
      const adsResult = await Advertisement.findById(adId);

      if (!adsResult) {
        return res.status(404).json({ status: "error", message: "Advertisement not found" });
      }

      await AuditController.AuditAdd(
        req.body.token,
        "video",
        "danger",
        `@ deleted an advertisement: <strong>${adsResult.title}</strong>`
      );

      await Advertisement.deleteOne({ _id: adId });

      res.status(200).json({ status: "success", message: "Advertisement successfully deleted" });
    } catch (err) {
      console.error("Error deleting advertisement:", err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };


  static AdvertisementDetail = async (req, res, next) => {
    try {
      const adId = req.body.id;
      if (!adId) {
        return res.status(400).json({ status: "error", message: "Advertisement ID is required" });
      }

      const detail = await Advertisement.findById(adId);
      if (!detail) {
        return res.status(404).json({ status: "error", message: "Advertisement not found" });
      }

      res.status(200).json({
        status: "success",
        message: "Advertisement detail information retrived successfuly",
        detail: detail,
      });
    } catch (err) {
      // Handle errors (e.g., invalid ID format)
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve advertisement details",
        error: err.message
      });
    }
  };
}

module.exports = AdvertisementController;
