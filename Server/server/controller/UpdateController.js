const Update = require("../models/update");
const AuditController = require("./AuditController");

class UpdateController {
    static UpdateAdd = async (req, res, next) => {

        const newUpdate = new Update();
        newUpdate.comment = req.body.comment;
        newUpdate.git = req.body.git;
        newUpdate.status = req.body.status;
        newUpdate.created_at = new Date().toLocaleString("en-us");
        newUpdate.updated_at = new Date().toLocaleString("en-us");

        newUpdate.save().then((newUpdateResult) => {
            AuditController.AuditAdd(
                req.body.token,
                "setting",
                "success",
                `@ added a new Update: <strong>${newUpdate.comment}<strong>`,
                function () {
                    res.status(200).json({
                        status: "success",
                        message: "Success!",
                    });
                }
            );
        });
  };

    static UpdateUpdate = async (req, res, next) => {
        let params;
        params = {
            comment: req.body.comment,
            git: req.body.git,
            status: req.body.status,
            updated_at: new Date().toLocaleString("en-us"),
        };
        await Update.findOneAndUpdate({ _id: req.body.id }, params).then(
            (updatedUpdate) => {
                let comment = "";
                if (updatedUpdate.comment != req.body.comment) {
                    comment += `&nbsp;&nbsp;<strong class="text-info">Comment</strong>: <span>${updatedUpdate.comment} -> ${req.body.comment}</span>`;
                }
                if (updatedUpdate.git != req.body.git) {
                    comment += `&nbsp;&nbsp;<strong class="text-info">Git commit link<strong>: <span>${updatedUpdate.git} -> ${req.body.git}<span>`;
                }
                if (updatedUpdate.status != req.body.status) {
                    comment += `&nbsp;&nbsp;<strong class="text-info">Status<strong>: <span>${updatedUpdate.status} -> ${req.body.status}<span>`;
                }
                if (comment != "") comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;

                AuditController.AuditAdd(
                    req.body.token,
                    "setting",
                    "warning",
                    `@ updated an Update: <strong>${updatedUpdate.comment}<strong>${comment}`,
                    function () {
                        res.status(200).json({
                        status: "success",
                        message: "Success!",
                        });
                    }
                );
            }
        );
    };

    static UpdateDelete = (req, res, next) => {
        Update.findOne({ _id: req.body.id }).then((updateResult) => {
        AuditController.AuditAdd(
            req.body.token,
            "setting",
            "danger",
            `@ deleted an Update: <strong>${updateResult.comment}<strong>`,
            function () {
                Update.deleteOne({ _id: req.body.id }).then((result) => {
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

    static UpdateDetail = async (req, res, next) => {
        await Update.find({ _id: req.body.id }).then((updateResult) => {
            res.status(200).json({
                status: "success",
                message: "Success!",
                detail: updateResult,
            });
            return;
        });
    };

    static UpdateList = async (req, res, next) => {
        await Update.find({}, (error, result) => {
            if (error) {
                console.log(error);
                return;
            } else {
                res.status(200).json({
                    status: "success",
                    message: "",
                    data: result,
                });
                return;
            }
        });
    };
}

module.exports = UpdateController;
