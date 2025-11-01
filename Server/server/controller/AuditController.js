const compareVersions = require('compare-versions');
const { format, addDays } = require("date-fns");

const Audit = require("../models/audit");
const User = require("../models/user");
const Machine = require("../models/machine");
const ChangelogController = require("./ChangelogController");


class AuditController {
  static AuditList = async (req, res, next) => {
    const { role, keyword, date_from, date_to, current_page } = req.body;
    const perPage = 10;
    const skip = (current_page - 1) * perPage;
    const query = {};

    if (role && role !== "all") {
      query.role = { $regex: role, $options: "i" };
    }


    if (date_from && date_to) {
      const fromDate = new Date(date_from);
      // As the input date only contains yyyy/mm/dd, its time is set to 00:00:00
      // Thus end time should be 1 day after the input one
      const toDate = addDays(new Date(date_to), 1);

      query.created_at = {
        $gte: format(fromDate, "yyyy/MM/dd"),
        $lte: format(toDate, "yyyy/MM/dd"),
      };
    }

    if (keyword) {
      query.$or = [
        { user_id: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
        { comment: { $regex: keyword, $options: "i" } },
      ];
    }

    try {
      // Retrieve total count of documents matching the query
      const totalItems = await Audit.countDocuments(query);

      // Retrieve documents based on query, sorting, pagination
      const result = await Audit.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();

      const totalPages = Math.ceil(totalItems / perPage);

      // Return response with data and pagination information
      res.status(200).json({
        status: "success",
        message: "",
        data: result,
        totalPage: totalPages,
        totalItem: totalItems,
      });
    } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  };

  static AuditAdd = async (token, type, color, comment, callback) => {
    try {
      // Find the user based on the provided token
      const userResult = await User.findOne({ token });
      if (!userResult) {
        console.log("User not found");
        return;
      }

      // Prepare audit data
      const now = new Date();
      const formattedDate = format(now, "yyyy/MM/dd HH:mm:ss");
      const audit = new Audit({
        user_id: userResult._id,
        role: userResult.role,
        type,
        color,
        comment: comment.replace("@", userResult.fullname),
        created_at: formattedDate
      });

      // Save the audit entry
      await audit.save();
      if (typeof callback === 'function') {
        callback();
      }
    } catch (err) {
      console.error("Error adding audit:", err);
    }
  };


  static AuditMachine = async (serialno, version, callback, errCallback) => {
    try {
      const result = await Machine.findOneAndUpdate(
        { serial_number: serialno },
        { updated_at: new Date().toLocaleString("en-us") }
      );

      if (!result) {
        return errCallback("Machine unregistered");
      }

      const lastAudit = await Audit.findOne({
        comment: { $regex: new RegExp(serialno, "i") },
        type: "building",
        color: "success",
      })
        .sort({ created_at: -1 })
        .limit(1);

      let updatedItemList = [];

      // Check machine's app version with the current latest one
      const latestVersion = await ChangelogController.GetCurrentVersion("vendingapp");
      if (version && compareVersions.compare(version, latestVersion.version, "<")) {
        updatedItemList.push("code");
      }

      if (lastAudit) {
        const auditHistory = await Audit.find({
          created_at: { $gte: lastAudit.created_at },
        });

        auditHistory.forEach((audit_item) => {
          switch (audit_item.type) {
            case "gift":
              updatedItemList.push("product");
              break;
            case "video":
              updatedItemList.push("ads");
              break;
            case "text":
              updatedItemList.push("language");
              break;
            case "building":
              if (audit_item.color === "warning") {
                // When machine is updated, all settings should be downloaded
                updatedItemList = ["machine"];
              }
              break;
            default:
              break;
          }
        });

        if (updatedItemList.length != 0) {
          const now = new Date();
          const formattedDate = format(now, "yyyy/MM/dd HH:mm:ss");
          const audit = new Audit({
            type: "building",
            role: "machine",
            color: "success",
            comment: `Machine (${serialno}) started updating`,
            created_at: formattedDate,
          });

          await audit.save();
        }
      }

      callback(updatedItemList);
    } catch (err) {
      errCallback(err);
    }
  };
}

module.exports = AuditController;
