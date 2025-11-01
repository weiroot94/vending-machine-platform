"use strict";
const express = require("express");
const useragent = require("useragent");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config");
const AuditController = require("../controller/AuditController");
const GoogleController = require("../controller/GoogleController");
const verifyToken = require("../middleware/verifyToken");
const Util = require("../controller/Util");
const logger = require("../logger");

const router = new express.Router();

// Google login
router.post("/googlelogin", GoogleController.LoginByGoogle);

// POST Login
router.post("/login",  async (req, res, next) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = useragent.parse(req.headers['user-agent']);
  try {
    const userResult = await User.findOne({ email });
    if (!userResult) {
      return res.status(200).json({ status: 0, message: "You're not registered yet, please sign up first" });
    }

    if (userResult.googleId) {
      return res.status(200).json({ status: 0, message: "Please log in with your Google account" });
    }

    if (userResult.role == "agent") {
      // block user who did not verify sign up email yet
      if (!userResult.verified) {
        return res.status(400).json({ error: "Your account is not verifed yet. Please verify your email first"});
      }

      // Check different login for agent users only for now
      if (userResult.ipaddr != ipAddress) {
        const verifyToken = jwt.sign({email}, config.jwtSecret, { expiresIn: '2h'});
        AuditController.AuditAdd(
          userResult.token,
          "users",
          "warning",
          `@ Login from different location detected: <strong>${userResult.fullname}</strong> from ${ipAddress} ${userAgent}`,
          function () {
            logger.info(`[routes/auth] user ${userResult.fullname}: login attempt from different location or browser`)
            Util.sendLoginVerifyMail(userResult.fullname, email, verifyToken, res);
          }
        );
        return;
      }
    }

    const match = await bcrypt.compare(password, userResult.password);
    if (match) {
      const token = jwt.sign({ userid: userResult._id }, config.jwtSecret, {
        expiresIn: '2h',
      });
      userResult.token = token;
      // temporary code for old model schema using users
      userResult.ipaddr = ipAddress;
      userResult.useragent = userAgent.toString();

      userResult.save().then((updatedUser) => {
        AuditController.AuditAdd(
          token,
          "signin",
          "success",
          `@ sign in: <strong> - ${userResult.fullname}`,
          function () {
            res.status(200).json({
              status: 1,
              message: "Login successfully!",
              user: {
                email: userResult.email,
                name: userResult.fullname,
                role: userResult.role,
                token
              },
            });
          }
        );
      });
    } else res.status(200).json({ status: 0, message: "Wrong password" });

  } catch (error) {
    logger.error(`Mongoose Query Failed: ${error.errmsg}`);
    res.status(500).json({
      error: "Failed to log in, please contact support team"
    });
  }
});

router.post("/loginverify", async (req, res) => {
  try {
    const {token} = req.body;
    try {
      const decryptedUser = jwt.verify(token, config.jwtSecret);
      const user = await User.findOne({email: decryptedUser.email});

      if (user) {
        const ipAddress = req.ip;
        const userAgent = useragent.parse(req.headers['user-agent']);

        user.ipaddr = ipAddress;
        user.useragent = userAgent.toString();

        user.save().then((updatedUser) => {
          AuditController.AuditAdd(
            user.token,
            "users",
            "success",
            `@ Login verified: <strong>${updatedUser.fullname}<strong>`,
            function () {
              res.status(200).json({
                message: "Successfully verified login",
              });
            }
          );
        }).catch(err => {
          return res.status(400).json({ error: "Faild to update user data" });
        });
      } else {
        return res.status(400).json({ error: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Session timeout, please try again" });
    }
  } catch (error) {
    res.status(500).json({error: "Failed to verify login"});
  }
});

router.post("/signup",  async (req, res) => {
  const payload = req.body;
  const ipAddress = req.ip;
  const userAgent = useragent.parse(req.headers['user-agent']);
  const {name, email, password} = payload;
  const saltRounds = 10;
  const hashedPasswd = await bcrypt.hash(password, saltRounds);
  const verifyToken = jwt.sign({email}, config.jwtSecret, { expiresIn: '15m'});

  try {
    const result = await User.find({ email });

    if (result.length == 0) {
      const newUser = new User();

      newUser.fullname = name;
      newUser.email = email;
      newUser.role = "agent";
      newUser.subscribed = true;
      newUser.password = hashedPasswd;
      newUser.token = verifyToken;
      newUser.ipaddr = ipAddress;
      newUser.useragent = userAgent.toString();
      newUser.created_at = new Date().toLocaleString("en-us");
      newUser.updated_at = new Date().toLocaleString("en-us");
     
      await newUser.validate();

      newUser.save().then((newUserResult) => {
        AuditController.AuditAdd(
          verifyToken,
          "users",
          "warning",
          `@ registered a new ${newUser.role} user(not verified): <strong>${newUser.fullname}<strong>`,
          function () {
            Util.sendVerificationMail(newUser.fullname, newUser.email, verifyToken, res);
          }
        );
      });
    } else {
      const registeredUser = result[0];
      if (registeredUser.verified) {
        res.status(400).json({error: "The user is already registered"});
      } else {
        // update user info with new one when sign up again
        registeredUser.fullname = name;
        registeredUser.password = hashedPasswd;
        registeredUser.ipaddr = ipAddress;
        registeredUser.useragent = userAgent.toString();
        registeredUser.updated_at = new Date().toLocaleString("en-us");

        registeredUser.save().then(() => {
          Util.sendVerificationMail(registeredUser.fullname, registeredUser.email, verifyToken, res);
        }).catch(err => {
          throw err;
        });
      }
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({error: "Failed to register new user"});
      logger.error(`[routes/auth] failed to register new user`);
    }
  }
});

router.post("/resendmail",  async (req, res) => {
  const payload = req.body;
  const {email} = payload;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "Sorry, we can't find your email in registered users"});
    } else {
      const verifyToken = jwt.sign({email}, config.jwtSecret, { expiresIn: '15m'});
      Util.sendVerificationMail(user.fullname, email, verifyToken, res);
    }
  } catch (error) {
    res.status(500).json({error: "Failed to resend verification mail"});
    logger.error(`[routes/auth] failed to re-send verification mail`);
  }
});

router.post("/verify_token", verifyToken, async (req, res) => {
  return res.status(200).json({message: "Verified successfully"});
});

router.post("/sigupverify", async (req, res) => {
  try {
    const {token} = req.body;
    const decryptedUser = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({email: decryptedUser.email});

    if (user) {
      user.verified = true;
      user.save().then((updatedUser) => {
        AuditController.AuditAdd(
          user.token,
          "users",
          "success",
          `@ verified user: <strong>${updatedUser.fullname}<strong>`,
          function () {
            res.status(200).json({
              message: "User verificated successfully",
            });
          }
        );
      }).catch(err => {
        return res.status(400).json({ error: "Faild to save user data" });
      });
    } else {
      return res.status(400).json({ error: "User not found, please sign up first" });
    }
  } catch (error) {
    res.status(500).json({error: "Verification token is expired"});
  }
});

router.post("/resetpass", async (req, res) => {
  const payload = req.body;
  const {email} = payload;
  const verifyToken = jwt.sign({email}, config.jwtSecret, { expiresIn: '1h'});

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "Sorry, we can't find your email in registered users"});
    } else {
      Util.sendResetPasswordMail(user.fullname, email, verifyToken, res);
    }
  } catch (error) {
    res.status(500).json({error: "Failed to resend verification mail"});
    logger.error(`[routes/auth] failed to re-send verification mail`);
  }
});

router.post("/resetpassverify", async (req, res) => {
  try {
    const {token, password} = req.body;
    try {
      const decryptedUser = jwt.verify(token, config.jwtSecret);
      const user = await User.findOne({email: decryptedUser.email});

      if (user) {
        const saltRounds = 10;
        const hashedPasswd = await bcrypt.hash(password, saltRounds);

        user.password = hashedPasswd;
        user.save().then((updatedUser) => {
          AuditController.AuditAdd(
            user.token,
            "users",
            "success",
            `@ Reset password: <strong>${updatedUser.fullname}<strong>`,
            function () {
              res.status(200).json({
                message: "Password was reset successfully",
              });
            }
          );
        }).catch(err => {
          logger.error(`[routes/auth] failed to save user data after password reset`);
          return res.status(400).json({ error: "Faild to update user data" });
        });
      } else {
        return res.status(400).json({ error: "User not found, please sign up again" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Session timeout, please try again" });
    }
  } catch (error) {
    res.status(500).json({error: "Failed to reset password"});
    logger.error(`[routes/auth] failed to reset password`);
  }
});

router.post("/logout", async (req, res) => {
  const email = req.body.email;

  try {
    const userResult = await User.findOne({email});
    if (userResult == null) {
      res.status(200).json({ status: "error", message: "Failed to log out!" });
      return;
    }
    AuditController.AuditAdd(
      req.body.token,
      "signin",
      "warning",
      `@ log out: <strong> - ${userResult.fullname}`,
      function () {
        res
          .status(200)
          .json({ status: "success", message: "Successfully logged out" });
      }
    );
  } catch (error) {
    logger.error(`Error occured: ${error}`);
  }    
});

module.exports = router;
