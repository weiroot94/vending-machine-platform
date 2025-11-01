"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const router = new express.Router();

router.post("/genAdminToken", (req, res, next) => {
  res.status(200).json({
      token: jwt.sign(
          JSON.stringify({
            email: "brian@gmail.com",
            role: "Admin",
          }),
          config.jwtSecret
      )
  });
});

router.post("/genMachineToken", (req, res, next) => {
  res.status(200).json({
    token: jwt.sign(
      JSON.stringify({
        email: "1234-5678-90",
        role: "Machine",
      }),
      config.jwtSecret
    ),
  });
});

module.exports = router;