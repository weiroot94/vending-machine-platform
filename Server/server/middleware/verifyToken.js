const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../../config");
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

module.exports = (req, res, next) => {
  const { user_token } = req.body;
  if (!user_token) {
    return res.status(400).json({ error: "Token is empty" });
  }

  try {
    jwt.verify(user_token, config.jwtSecret, async (err, data) => {
      if (err) {
        return res.status(400).json({ error: "Failed to verify token" });
      }

      const userResult = await User.findOne({_id: data.userid, token: user_token});
      if (!userResult) {
        return res.status(400).json({ error: "User not found" });
      }

      req.user = userResult;
      next();
    });
  } catch (error) {
    logger.error(`Error occured: ${error}`);
  }
};
