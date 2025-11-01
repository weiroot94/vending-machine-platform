const User = require("../models/user");
const AuditController = require("./AuditController");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const Util = require("./Util");

class UserController {
  static UserAdd = async (req, res, next) => {
    const saltRounds = 10;
    const password = await bcrypt.hash(req.body.password, saltRounds);

    try {
      const result = await User.find({ email: req.body.email });

      if (result.length == 0) {
        const newUser = new User();

        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.role = req.body.role;
        newUser.subscribed = req.body.subscribed;
        newUser.password = password;
        newUser.area = req.body.areas;
        newUser.verified = true;
        newUser.token = "";
        newUser.created_at = new Date().toLocaleString("en-us");
        newUser.updated_at = new Date().toLocaleString("en-us");
       
        await newUser.validate();

        newUser.save().then((newUserResult) => {
          AuditController.AuditAdd(
            req.body.token,
            "users",
            "success",
            `@ added a new ${newUser.role} user: <strong>${newUser.fullname}<strong>`,
            function () {
              res.status(200).json({message: "Added new user successfully"});
            }
          );
          logger.info(`[controller/usercontroller] added user ${newUser.fullname}(${newUser.role})`);
        });
      } else {
        res.status(400).json({error: "The user is already registered"});
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({error: "Failed to add new user"});
        logger.error(`[controller/usercontroller] failed to add new user`);
      }
    }
  };

  static UserUpdate = async (req, res, next) => {
    const saltRounds = 10;
    const params = {
      fullname: req.body.fullname,
      email: req.body.email,
      role: req.body.role,
      subscribed: req.body.subscribed,
      area: req.body.areas,
      updated_at: new Date().toLocaleString("en-us"),
    };

    if (req.body.password != "") {
      const password = await bcrypt.hash(req.body.password, saltRounds);
      params.password = password;
    }
  
    await User.findOneAndUpdate({ _id: req.body.id }, params).then(
      (updatedUser) => {
        let comment = "";
        if (updatedUser.fullname != req.body.fullname) {
          comment += `&nbsp;&nbsp;<strong class="text-info">fullname</strong>: <span>${updatedUser.fullname} -> ${req.body.fullname}</span>`;
        }
        if (updatedUser.email != req.body.email) {
          comment += `&nbsp;&nbsp;<strong class="text-info">email<strong>: <span>${updatedUser.email} -> ${req.body.email}<span>`;
        }
        if (updatedUser.role != req.body.role) {
          comment += `&nbsp;&nbsp;<strong class="text-info">role<strong>: <span>${updatedUser.role} -> ${req.body.role}<span>`;
        }
        if (updatedUser.role != req.body.role) {
          comment += `&nbsp;&nbsp;<strong class="text-info">password<strong>`;
        }
        if (updatedUser.area != req.body.area) {
          comment += `&nbsp;&nbsp;<strong class="text-info">area<strong>`;
        }
        if (comment != "") comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;

        AuditController.AuditAdd(
          req.body.token,
          "users",
          "warning",
          `@ updated an user information: <strong>${updatedUser.fullname}<strong>${comment}`,
          function () {
            res.status(200).json({
              message: "Updated user successfully",
            });
          }
        );
        logger.info(`[controller/usercontroller] user ${updatedUser.fullname} updated`);
      }
    ).catch(error => {
      logger.error("[controller/usercontroleer] failed to delete user\n"+error);
      res.status(400).json({
        message: "Failed to update User",
      });
    });
  };

  static UserDelete = (req, res, next) => {
    User.findOne({ _id: req.body.id }).then((userResult) => {
      AuditController.AuditAdd(
        req.body.token,
        "users",
        "danger",
        `@ deleted an user: <strong>${userResult.fullname}<strong>`,
        function () {
          User.deleteOne({ _id: req.body.id }).then((result) => {
            res.status(200).json({
              message: "Deleted user successfully",
            });
            logger.info(`[controller/usercontroller] delete use ${userResult.fullname}`);
            return;
          });
        }
      );
    }).catch(error => {
      logger.error("[controller/usercontroleer] failed to delete user");
      res.status(400).json({
        message: "Failed to delete User",
      });
    });
  };

  static UserDetail = async (req, res, next) => {
    await User.find({ _id: req.body.id }).then((userResult) => {
      res.status(200).json({
        detail: userResult,
      });
      return;
    });
  };

  static UserList = async (req, res, next) => {
    try {
      const result = await User.find({}).sort({ fullname: 1 });
      const balances = [];

      for (let i = 0; i < result.length; i++) {
        let user = result[i];
        const balance = await Util.getCustomerBalance(user._id);
        balances.push(balance);
      }

      res.status(200).json({
          data: result,
          balance: balances,
        });
    } catch (error)
    {
      logger.error(`List User Failed: ${error}`);
    }
  };

  static GetUserInfoDetail = async (req, res, next) => {};

  static UpdateUserInfo = async (req, res) => {
    const { user_token, new_name, current_pass, new_pass, new_email } = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      let newDataAvaiable = false;
      if (user != false) {
        let updateData = {};
        // change password only if current password is provided
        if (current_pass) {
          const match = await bcrypt.compare(current_pass, user.password);
          if (match) {
            if (new_pass && new_pass.trim()) {
              const saltRounds = 10;
              const hashedPasswd = await bcrypt.hash(new_pass, saltRounds);
              updateData.password = hashedPasswd;
              newDataAvaiable = true;
            } else {
              return res.status(400).json({
                error: "New password is empty",
              });
            }
          } else {
            return res.status(400).json({
              error: "Current password is invalid",
            });
          }
        }

        if (new_name) {
          updateData.fullname = new_name;
          newDataAvaiable = true;
        }

        if (new_email) {
          updateData.email = new_email;
          newDataAvaiable = true;
        }

        if (!newDataAvaiable) {
          return res.status(400).json({
            error: "Please provide at least one new data",
          });
        }

        await User.findOneAndUpdate({ token: user_token }, updateData).then(
          (updatedUser) => {
            AuditController.AuditAdd(
              user_token,
              "users",
              "warning",
              `@ updated account info`,
              function () {
                res.status(200).json({
                  message: "Account updated successfully, please log in again",
                });
              },
              function () {
                res.status(400).json({
                  error: "Faild to save to audit logger",
                });
              }
            );
          }
        ).catch(err => {
          throw err;
        });
      } else {
        res.status(400).json({
          error: "Token verification failed",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to update account setting",
      });
    }
  };

  static GetUserBalance = async (req, res) => {
    const {user_token} = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        const balance = await Util.getCustomerBalance(user._id);
        res.status(200).json({
          status: "success",
          message: "",
          data: balance,
        });
      } else {
        res.status(400).json({
          error: "Token verification failed",
        });
      }
    } catch (err) {
      console.log(err);
      logger.error("[controller/usercontroller] Failed to find user with token");
      res.status(500).json({
        status: "error",
        message: "Failed to get user balance",
      });
    }
  };

  static DeleteUserAccount = async (req, res) => {
    const {user_token} = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        User.deleteOne({ _id: user._id }).then((result) => {
          return res.status(200).json({
            message: "Deleted account successfully",
          });
        }).catch(err => {
          throw err;
        });
      } else {
        res.status(400).json({
          error: "Token verification failed",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to delete account",
      });
    }
  };
}

module.exports = UserController;
