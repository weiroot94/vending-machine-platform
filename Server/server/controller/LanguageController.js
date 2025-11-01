const Language = require("../models/language");
const User = require("../models/user");
const AuditController = require("./AuditController");
const LanguageValueController = require("./LanguageValueController");
const Util = require("./Util");

class LanguageController {
  static LanguageList = async (req, res, next) => {
    let langList = await Language.find({});
    res.status(200).json({
      status: "success",
      message: "",
      data: langList,
    });
  };

  static LanguageAdd = async (req, res, next) => {
    const file = req.files.attachfile;
    const fileName = Date.now() + "_" + req.files.attachfile.name;
    file.mv(`server/upload/language/${fileName}`, (err) => {
      User.findOne({ token: req.body.token }).then((userResult) => {

        const newLang = new Language();
        newLang.name = req.body.name;
        newLang.thumbnail = `server/upload/language/${fileName}`;
        newLang.role = req.body.role;
        newLang.created_at = new Date().toLocaleString("en-us");
        newLang.updated_at = new Date().toLocaleString("en-us");

        newLang.save().then((newLangResult) => {
          LanguageValueController.LanguageValueInit(newLangResult._id, newLangResult.role).then(result => {
            AuditController.AuditAdd(
              req.body.token,
              "text",
              "success",
              `@ added a new language: <strong>${newLangResult.name}<strong>`,
              function () {
                res.status(200).json({
                  status: "success",
                  message: "Success!",
                });
              }
            );
          })
        });
      });
    });
  };

  static LanguageUpdate = async (req, res, next) => {
    LanguageValueController.LanguageValueUpdate(req.body.values).then(result2 => {
      AuditController.AuditAdd(
        req.body.token,
        "text",
        "warning",
        `@ updated a language`,
        function () {
          res.status(200).json({
            status: "success",
            message: "Success!",
          });
          return;
        }
      );
    });
  };

  static LanguageDelete = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await Util.verifyToken(payload.token);

      if (user != false) {
        const language = await Language.findById(payload.id);
        if (!language) {
          return res.status(400).json({
            error: "Failed to find language data",
          });
        }

        AuditController.AuditAdd(
          payload.token,
          "text",
          "danger",
          `@ deleted a language: <strong>${language.name}<strong>`,
          function () {
            Language.deleteOne({ _id: payload.id }).then((result) => {
              res.status(200).json({
                message: "Deleted language successfully",
              });
              return;
            }).catch(err => {
              res.status(400).json({
                error: "Failed to delete language data",
              });
            });
          }
        );
      } else {
        res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Failed to delete language",
      });
    }
  };

  static LanguageDetail = async (req, res, next) => {
    await Language.find({ _id: req.body.id }).then((languageResult) => {
      LanguageValueController.LanguageValueList(req.body.id).then((languageValuesResult) => {
        res.status(200).json({
          status: "success",
          message: "Success!",
          languagevalues: languageValuesResult,
          language: languageResult,
        });
        return;
      })
    });
  };
}

module.exports = LanguageController;
