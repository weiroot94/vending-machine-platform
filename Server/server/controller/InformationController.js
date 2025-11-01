const Info = require("../models/info");
const User = require("../models/user");
const AuditController = require("./AuditController");

class InformationController {
  static InformationList = async (req, res, next) => {
    let infoList = await Info.find({});
    await Promise.all(
      infoList.map(async (info) => {
        let user = await User.findOne({ _id: info.info_manager_id });
        if (user != null) {
          info.poster = user.fullname;
        }
      })
    );
    res.status(200).json({
      status: "success",
      message: "",
      data: infoList,
    });
  };

  static InformationAdd = async (req, res, next) => {
    const file = req.files.attachfile;
    const fileName = Date.now() + "_" + req.files.attachfile.name;
    file.mv(`server/upload/info/${fileName}`, (err) => {
      User.findOne({ token: req.body.token }).then((userResult) => {
        const newInfo = new Info();
        newInfo.name = req.body.name;
        newInfo.info_manager_id = userResult._id;
        newInfo.unit = req.body.unit;
        newInfo.value = req.body.value;
        newInfo.thumbnail = `server/upload/info/${fileName}`;
        newInfo.created_at = new Date().toLocaleString("en-us");
        newInfo.updated_at = new Date().toLocaleString("en-us");
        newInfo.save().then((newInfoResult) => {
          AuditController.AuditAdd(
            req.body.token,
            "edit",
            "success",
            `@ added a new information: <strong>${newInfoResult.name}<strong>`,
            function () {
              res.status(200).json({
                status: "success",
                message: "Success!",
              });
            }
          );
        });
      });
    });
  };

  static InformationUpdate = async (req, res, next) => {
    User.findOne({ token: req.body.token }).then((userResult) => {
      if (req.files) {
        const file = req.files.attachfile;
        const fileName = Date.now() + "_" + req.files.attachfile.name;
        file.mv(`server/upload/info/${fileName}`, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send(err);
          }
            Info.findOneAndUpdate(
              { _id: req.body.id },
              {
                name: req.body.name,
                info_manager_id: userResult._id,
                unit: req.body.unit,
                value: req.body.value,
                thumbnail: `server/upload/info/${fileName}`,
                updated_at: new Date().toLocaleString("en-us"),
              }
            ).then((updatedInfo) => {
              let comment = "";
              console.log(updatedInfo.name)
              console.log(req.body.name)
              if (updatedInfo.name != req.body.name) {
                comment += `&nbsp;&nbsp;<strong class="text-info">name</strong>: <span>${updatedInfo.name} -> ${req.body.name}</span>`;
              }
              if (updatedInfo.info_manager_id != userResult._id) {
                comment += `&nbsp;&nbsp;<strong class="text-info">info_manager_id</strong>: <span>${updatedInfo.info_manager_id} -> ${userResult._id}</span>`;
              }
              if (updatedInfo.unit != req.body.unit) {
                comment += `&nbsp;&nbsp;<strong class="text-info">unit</strong>: <span>${updatedInfo.unit} -> ${req.body.unit}</span>`;
              }
              if (updatedInfo.value != req.body.value) {
                comment += `&nbsp;&nbsp;<strong class="text-info">value</strong>: <span>${updatedInfo.value} -> ${req.body.value}</span>`;
              }
              if (updatedInfo.thumbnail != `server/upload/ads/${fileName}`) {
                comment += `&nbsp;&nbsp;<strong class="text-info">thumbnail</strong>: changed into -> ${fileName}</span>`;
              }

              if (comment != "") comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;

              AuditController.AuditAdd(
                req.body.token,
                "edit",
                "warning",
                `@ updated an information: <strong>${updatedInfo.name}<strong>${comment}`,
                function () {
                  res.status(200).json({
                    status: "success",
                    message: "Success!",
                  });
                }
              );
            });
            })
      } else {
        Info.findOneAndUpdate(
          { _id: req.body.id },
          {
            info_manager_id: userResult._id,
            name: req.body.name,
            unit: req.body.unit,
            value: req.body.value,
            updated_at: new Date().toLocaleString("en-us"),
          }
        ).then((updatedInfo) => {
          let comment = "";
          if (updatedInfo.name != req.body.name) {
            comment += `&nbsp;&nbsp;<strong class="text-info">name</strong>: <span>${updatedInfo.name} -> ${req.body.name}</span>`;
          }
          if (updatedInfo.info_manager_id != userResult._id) {
            comment += `&nbsp;&nbsp;<strong class="text-info">info_manager_id</strong>: <span>${updatedInfo.info_manager_id} -> ${userResult._id}</span>`;
          }
          if (updatedInfo.unit != req.body.unit) {
            comment += `&nbsp;&nbsp;<strong class="text-info">unit</strong>: <span>${updatedInfo.unit} -> ${req.body.unit}</span>`;
          }
          if (updatedInfo.value != req.body.value) {
            comment += `&nbsp;&nbsp;<strong class="text-info">value</strong>: <span>${updatedInfo.value} -> ${req.body.value}</span>`;
          }

          if (comment != "") comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;

          console.log(comment)

          AuditController.AuditAdd(
            req.body.token,
            "edit",
            "warning",
            `@ updated an information: <strong>${updatedInfo.name}<strong>${comment}`,
            function () {
              res.status(200).json({
                status: "success",
                message: "Success!",
              });
            }
          );
        });
      }
    });
  };

  static InformationDelete = async (req, res, next) => {
    Info.findOne({ _id: req.body.id }).then((result) => {
      AuditController.AuditAdd(
        req.body.token,
        "edit",
        "danger",
        `@ deleted an information: <strong>${result.name}<strong>`,
        function () {
          Info.deleteOne({ _id: req.body.id }).then((result) => {
            res.status(200).json({
              status: "success",
              message: "Success!",
            });
            return;
          });
        }
      );
    });
  };

  static InformationDetail = async (req, res, next) => {
    await Info.find({ _id: req.body.id }).then((result) => {
      res.status(200).json({
        status: "success",
        message: "Success!",
        detail: result,
      });
      return;
    });
  };
}

module.exports = InformationController;
