const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Deposit = require("../models/deposit");
const Order = require("../models/order");
const mailService = require("../services/mailService");
const config = require("../../config");
const logger = require("../logger");

class Util {
    static verifyToken = async (user_token) => {
        try {
            const data = jwt.verify(user_token, config.jwtSecret);
            const userResult = await User.findOne({_id: data.userid, token: user_token});
            if (userResult) {
                return userResult;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            logger.error("[controller/util] Failed to verify user token due to unexpected error");
            return false;
        }
    }

    static getCustomerBalance = async (userId) => {
        try {
                const depositList = await Deposit.find({depositor: userId});
                const orderList = await Order.find({orderer: userId});
                let balance = 0;
                await Promise.all(
                    depositList.map(async (deposit) => {
                    balance += deposit.amount;
                    })
                );
                await Promise.all(
                    orderList.map(async (order) => {
                    if (order.purchased == 'success')
                        balance -= order.total_amount;
                    })
                );

                return balance;
        } catch (err) {
          console.log(err);
          logger.error("[controller/util] Failed to get user balance");
          return -1;
        }
      }

    static sendVerificationMail = (userName, userEmail, verifyToken, res) => {
        try {
            const templatePath = path.join(__dirname, '../../emailTemplates', 'verification.html');
            const emailContent = fs.readFileSync(templatePath, 'utf8');
        
            const formattedEmailContent = emailContent
              .replace('{{User}}', userName)
              .replace('{{VerifyURL}}', config.customerURL + "verify/" + verifyToken);
        
            const mailOptions = {
              from: config.email.username,
              to: userEmail,
              subject: 'Verify your account',
              html: formattedEmailContent,
            };
            
            mailService.sendEmail(mailOptions).then(() => {
              res.status(200).json({message: "Verification mail sent, please check your inbox and verify email"});
            }).catch(err => {
              console.log(err);
              res.status(400).json({error: "Failed to send verification mail, please sign up again"});
            });          
          } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
          }
    }

    static sendResetPasswordMail = (userName, userEmail, verifyToken, res) => {
      try {
          const templatePath = path.join(__dirname, '../../emailTemplates', 'resetpassword.html');
          const emailContent = fs.readFileSync(templatePath, 'utf8');
      
          const formattedEmailContent = emailContent
            .replace('{{User}}', userName)
            .replace('{{ResetURL}}', config.customerURL + "resetpass/" + verifyToken);
      
          const mailOptions = {
            from: config.email.username,
            to: userEmail,
            subject: 'Reset password of your account',
            html: formattedEmailContent,
          };
          
          mailService.sendEmail(mailOptions).then(() => {
            res.status(200).json({message: "Mail for password reset sent, please check your inbox and verify email"});
          }).catch(err => {
            console.log(err);
            res.status(400).json({error: "Failed to send password reset mail, please try again again"});
          });          
        } catch (error) {
          console.error('Error sending password reset email:', error);
          throw error;
        }
    }

    static sendLoginVerifyMail = (userName, userEmail, verifyToken, res) => {
      try {
          const templatePath = path.join(__dirname, '../../emailTemplates', 'loginverify.html');
          const emailContent = fs.readFileSync(templatePath, 'utf8');
      
          const formattedEmailContent = emailContent
            .replace('{{User}}', userName)
            .replace('{{VerifyURL}}', config.customerURL + "loginverify/" + verifyToken);
      
          const mailOptions = {
            from: config.email.username,
            to: userEmail,
            subject: 'Verify your login',
            html: formattedEmailContent,
          };
          
          mailService.sendEmail(mailOptions).then(() => {
            res.status(401).json({error: "We detected that you are trying to log in different location or browser, please verify your login"});
          }).catch(err => {
            console.log(err);
            res.status(400).json({error: "Failed to send password reset mail, please try again again"});
          });
        } catch (error) {
          console.error('Error sending password reset email:', error);
          throw error;
        }
    }

    static sendMachineUnLockMail = (userName, userEmail, serialnumber) => {
      try {
        const templatePath = path.join(__dirname, '../../emailTemplates', 'MachineUnLock.html');
        const emailContent = fs.readFileSync(templatePath, 'utf8');
    
        const formattedEmailContent = emailContent
          .replace('{{User}}', userName)
          .replace('{{Machine}}', serialnumber);
    
        const mailOptions = {
          from: config.email.username,
          to: userEmail,
          subject: 'Machine UnLocked',
          html: formattedEmailContent,
        };
        
        mailService.sendEmail(mailOptions).then(() => {
          console.log("success");
        }).catch(err => {
          console.log(err);
        });          
      } catch (error) {
        console.error('Error sending machine unlocked email:', error);
        throw error;
      }
    }

    static sendOutOfStockMail = (userName, userEmail, machine_serialnumber, product_name, product_price) => {
      try {
        const templatePath = path.join(__dirname, '../../emailTemplates', 'OutOfStock.html');
        const emailContent = fs.readFileSync(templatePath, 'utf8');
    
        const formattedEmailContent = emailContent
          .replace('{{Product}}', product_name)
          .replace('{{User}}', userName)
          .replace('{{Product}}', product_name)
          .replace('{{Machine}}', machine_serialnumber)
          .replace('{{Product}}', product_name)
          .replace('{{Price}}', product_price);
    
        const mailOptions = {
          from: config.email.username,
          to: userEmail,
          subject: 'Out of Stock of Machine',
          html: formattedEmailContent,
        };
        
        mailService.sendEmail(mailOptions).then(() => {
        }).catch(err => {
          console.log(err);
        });          
      } catch (error) {
        console.error('Error sending out of stock email:', error);
        throw error;
      }
    }

    static isValidFileType(fileName) {
      const validExtensions = ['.jpg', '.png', '.gif', '.jpeg', '.mp4', '.ppt'];
      return validExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    static moveFile = (file, path) => {
      return new Promise((resolve, reject) => {
        file.mv(path, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };
};

module.exports = Util;