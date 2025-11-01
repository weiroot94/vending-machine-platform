const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const AuditController = require("./AuditController");
const config = require("../../config");

require("dotenv").config();
const { GOOGLE_CLIENT_SECRET } = process.env;

const client = new OAuth2Client(
  config.googleclientid,
  GOOGLE_CLIENT_SECRET,
  'postmessage'
);

class GoogleController {
  static LoginByGoogle = async (req, res) => {
    const code = req.body.code;
    try {
      const { tokens } = await client.getToken({
        code: code,
      });

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.googleclientid,
      });

      const payload = ticket.getPayload();
      const userid = payload["sub"];
      const email = payload["email"];
      const username = payload["name"];

      let user = await User.findOne({ email: email });
      let isSignup = false;

      if (user) {
        if (!user.googleId) {
          return res.status(400).json({
            error: "You registered already with same email address and password"
          })
        }
      } else {
        // If the user doesn't exist, create a new user
        user = new User({
          email: email,
          fullname: username,
          role: "agent",
          subscribed: true,
          verified: true,
          googleId: userid,
          created_at: new Date().toLocaleString("en-us"),
          updated_at: new Date().toLocaleString("en-us")
        });

        user = await user.save();
        isSignup = true;
      }

      const verifyToken = jwt.sign({ userid: user._id }, config.jwtSecret, {
        expiresIn: '2h',
      });
      
      user.token = verifyToken;

      user.save().then((updatedUser) => {
        AuditController.AuditAdd(
          verifyToken,
          isSignup ? "users" : "signin",
          "success",
          isSignup ?
            `@ registered a new ${user.role} user by Google: <strong>${user.fullname}<strong>`
            :
            `@ sign in by Google: <strong> - ${user.fullname}`,
          function () {
            res.status(200).json({
              user: {
                email: user.email,
                name: user.fullname,
                role: user.role,
                token: verifyToken
              },
            });
          }
        );
      }).catch(err => {
        console.log(err);
        throw new Error("Failed to save to database");
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Failed to log in, please contact support team"
      });
    }
  };
}

module.exports = GoogleController;
