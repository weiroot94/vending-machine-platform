const fs = require("fs");
const path = require('path');
const jwt = require("jsonwebtoken");
const AuditController = require("../controller/AuditController");
const MachineController = require("./MachineController");
const Util = require("../controller/Util");
const Language = require("../models/language");
const LanguageValue = require("../models/languagevalue");
const Advertisement = require("../models/advertisement");
const Product = require("../models/product");
const Machine = require("../models/machine");
const Order = require("../models/order");
const User = require("../models/user");
const config = require("../../config");
const logger = require("../logger");

async function readFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, function (error, data) {
      if (error) {
        return resolve(null);
      }
      resolve(data.toString("base64"));
    });
  });
}

class ClientController {
  static GetPingFromMachine = async (req, res, next) => {
    const { serialno, version } = req.body;
    try {
      const result = await Machine.findOneAndUpdate({ serial_number: serialno }, {
        latest_ping_at: Date.now()
      });

      if (!result) {
        return res.status(400).json({
          error: "Machine not found"
        });
      }

      AuditController.AuditMachine(
        serialno,
        version,
        function (updatedItemList) {
          res.status(200).json({
            data: updatedItemList,
          });
        },
        function (err) {
          console.log(err);
          res.status(400).json({
            error: "Unregistered machine or server error"
          })
        }
      );
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Failed to handle ping"
      });
    }
  };

  static UpdateCode = async (req, res, next) => {
    try {
      const machineSerial = req.body.serialno;
      const codePath = path.join("server/upload/vendingapp", "latestapp.zip");

      // Check if the file exists
      if (!fs.existsSync(codePath)) {
        console.error('Code file not found:', codePath);
        return res.status(404).send('Code file not found');
      }

      res.download(codePath, 'latestapp.zip', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Latest code file sent successfully to machine ' + machineSerial);
      }
    });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to download repository');
    }
  };

  static UpdateInfo = async (req, res, next) => {
    Machine.findOne({ serial_number: req.body.serialno }).then((machine) => {
      res.status(200).json({
        status: "success",
        message: "",
        details: machine.machine_details,
      });
    });
  };

  static UpdateLanguage = async (req, res, next) => {
    let langListOrig = await Language.find({});
    let langValueList = await LanguageValue.find({});
    let langList = [];

    await Promise.all(
      langListOrig.map(async (lang) => {
        // fetch languages which are only for vending app
        if (lang.role == "VMApp") {
          langList.push({
            language_id: lang._id,
            language_name: lang.name,
            language_icon: await readFile(lang.thumbnail),
            version: lang.updated_at,
          });
        }
      })
    );

    res.status(200).json({
      status: 1,
      message: "",
      details: {
        language_list: langList,
        language_value_list: langValueList,
      },
    });
  };

  static UpdateADS = async (req, res, next) => {
    const machine = await Machine.findOne({ serial_number: req.body.serialno });
    const ads = await Advertisement.findOne({ _id: machine.ads_detail });

    res.status(200).json({
      status: 1,
      message: "",
      details: {
        id: ads._id,
        version: ads.updated_at,
        type: "MP4", // PPT or MP4
        content: await readFile(ads.filepath), // content for base64
      },
    });
  };

  static UpdateProduct = async (req, res, next) => {
    const machine = await Machine.findOne({ serial_number: req.body.serialno });
    let product_list = [];
    machine.product_list.map((product) => {
      product_list.push(product.type);
    });
    const ProductList = await Product.find({ _id: { $in: product_list } });
    let detailedProductList = [];
    await Promise.all(
      ProductList.map(async (product) => {
        let product_info = machine.product_list.find(
          (findProduct) => findProduct.type == product._id
        );
        detailedProductList.push({
          id: product._id,
          product_name: product.name,
          product_name_de: product.name_de,
          price: product.price,
          currency: product.currency,
          description: product.description,
          description_de: product.description_de,
          category: product.category,
          theme: product.theme,
          additional_info1: product.additionalinfo1
            ? product.additionalinfo1
            : "",
          additional_info2: product.additionalinfo2
            ? product.additionalinfo2
            : "",
          additional_info3: product.additionalinfo3
            ? product.additionalinfo3
            : "",
          additional_info4: product.additionalinfo4
            ? product.additionalinfo4
            : "",
          additional_info5: product.additionalinfo5
            ? product.additionalinfo5
            : "",
          additional_info1_de: product.additionalinfo1_de
            ? product.additionalinfo1_de
            : "",
          additional_info2_de: product.additionalinfo2_de
            ? product.additionalinfo2_de
            : "",
          additional_info3_de: product.additionalinfo3_de
            ? product.additionalinfo3_de
            : "",
          additional_info4_de: product.additionalinfo4_de
            ? product.additionalinfo4_de
            : "",
          additional_info5_de: product.additionalinfo5_de
            ? product.additionalinfo5_de
            : "",
          box: product_info.box,
          stock: product_info.stock,
          thumbnail: await readFile(product.thumbnail),
          subinfoimage1: product.subinfoimage1 ? await readFile(product.subinfoimage1) : null,
          subinfoimage2: product.subinfoimage2 ? await readFile(product.subinfoimage2) : null,
          subinfoimage3: product.subinfoimage3 ? await readFile(product.subinfoimage3) : null,
          version: product.updated_at,
        });
      })
    );
    res.status(200).json({
      status: 1,
      message: "",
      details: detailedProductList,
    });
  };

  static SellProduct = async (req, res, next) => {
    const order_data = req.body;
    const amountToPay = order_data.count * order_data.price;
    try {
      const machine = await Machine.findOne({ serial_number: order_data.serial_no });
      if (!machine) {
        return res.status(400).json({
          error: "Can not find registered machine in server",
        });
      }

      logger.info(`Cash Order received from machine ${order_data.serial_no}`);
      const newOrder = new Order();

      // When product is bought in vending machine, then it uses
      // machine id as orderer doesn't exist in this case
      newOrder.orderer = machine._id;
      newOrder.machine = machine._id;
      newOrder.product = order_data.product_id;
      newOrder.product_count = order_data.count;
      newOrder.total_amount = amountToPay;
      newOrder.payment = 'cash';
      newOrder.purchased = 'success';
      newOrder.hash_value = order_data.hashed_value;
      newOrder.created_at = new Date().toLocaleString("en-us");

      newOrder.save()
        .then(result => {
          res.status(200).json({
            message: "Created order successfully",
          });
        })
        .catch(error => {
          console.error(error);
          res.status(400).json({
            error: "An error occurred while saving the order.",
          });
        });
    } catch (err) {
      return res.status(400).json({
        error: "Failed to create order",
      });
    }
  };

  static SellProductQR = async (req, res, next) => {
    const { user_token, order_data } = req.body;
    try {
      const user = await Util.verifyToken(user_token);
      if (user != false) {
        const balance = await Util.getCustomerBalance(user._id);

        // QR code contains JWT code of order info which expires within 2 minutes
        try {
          const decoded = jwt.verify(order_data, config.qrSecret);
          const orderData = decoded.sub;
          const amountToPay = orderData.count * orderData.price;

          if (balance < amountToPay) {
            res.status(400).json({
              error: "Insufficient funds, please deposit first",
            });
          } else {
            const machine = await Machine.findOne({ serial_number: orderData.serial_no });
            if (!machine) {
              return res.status(400).json({
                error: "Can not find registered machine in server",
              });
            }

            const historyOrder = await Order.findOne({ hash_value: orderData.hashed_value });

            if (historyOrder) {
              return res.status(200).json({
                message: "You have already paid for this QR code",
              });
            }

            logger.info(`Order received via QR code from machine ${orderData.serial_no}`);
            const newOrder = new Order();

            newOrder.orderer = user._id;
            newOrder.machine = machine._id;
            newOrder.product = orderData.product_id;
            newOrder.product_count = orderData.count;
            newOrder.total_amount = amountToPay;
            newOrder.payment = 'qr';
            newOrder.purchased = 'pending';
            newOrder.hash_value = orderData.hashed_value;
            newOrder.created_at = new Date().toLocaleString("en-us");

            newOrder.save()
              .then(result => {
                res.status(200).json({
                  message: "Paid successfully",
                });
              })
              .catch(error => {
                console.error(error);
                res.status(400).json({
                  error: "An error occurred while saving the order.",
                });
              });
          }

        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(400).json({
              error: "QR code is expired",
            });
          }

          return res.status(400).json({
            error: "Failed to verify QR code",
          });
        }
      } else {
        return res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (error) {
      logger.error("[controller/clientcontroller] Failed to make QR order");
      return res.status(400).json({
        error: "Failed to create QR order",
      });
    }
  };

  static confirmPurchaseFromMachine = async (req, res, next) => {
    const confirm_data = req.body;
    try {
      const order = await Order.findOne({ hash_value: confirm_data.order_hash });
      if (!order) {
        return res.status(400).json({
          error: "Can not find registered order in server",
        });
      }

      if (order.purchased != 'success') {
        return res.status(400).json({
          error: "This order is not confirmed yet",
        });
      }

      const machine = await Machine.findOne({ serial_number: confirm_data.serial_no});
      if (!machine) {
        return res.status(400).json({
          error: "Can not find registered machine in server",
        });
      }

      const newProductList = [];
      machine.product_list.map(productInfo => {
        if (productInfo.type == order.product) {
          newProductList.push({
            type: productInfo.type,
            stock: productInfo.stock - order.product_count,
            box: productInfo.box
          });
        } else {
          newProductList.push(productInfo);
        }
      });

      machine.product_list = newProductList;
      machine.save().then(() => {
        this.sendOutOfStockMail(machine, order.product);

        logger.info(`Purchase confirmed from machine ${confirm_data.serial_no}`)
        res.status(200).json({
          message: "Confirmed Purchase successfully",
        });
      }).catch(err => {
        res.status(400).json({
          error: "Failed to update machine information",
        });
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        error: "Failed to confirm purchase",
      });
    }
  };

  static sendOutOfStockMail = async (machine, productType) => {
    let empty_product = null;
    let product_info = null;
    for (let i = 0; i < machine.product_list.length; i++) {
      if (machine.product_list[i].type == productType && 
          machine.product_list[i].stock == 0
      ) {
        empty_product = machine.product_list[i];
        break;
      }
    }
    if (!empty_product)
      return;

      await Product.findById(empty_product.type).then((result) => {
      product_info = result;
    }).catch(err => {
      console.log("albert Out of Stock Failed");
      console.log(err);
    });

    const agent = await User.findById(machine.agent_id);

    if (!agent) {
      throw new Error("Failed to find corresponding user");
    }

    Util.sendOutOfStockMail(
      agent.fullname, agent.email, machine.serial_number, product_info.name, product_info.price
    );

    // const admins = await User.find({ role: "administrator" });
    // admins.map((admin) => {
    //   Util.sendOutOfStockMail(
    //     // admin.fullname, admin.email, machine.serial_number, product_info.name, product_info.price
    //   );
    // });
  }

  static CheckMachineLocked = async (req, res, next) => {
    try {
      const machine = await Machine.findOne({ serial_number: req.body.serialno });
      if (!machine) {
        return res.status(400).json({
          error: "Failed to find corresponding machine"
        });
      }

      const licensed = await MachineController.checkMachineLicense(machine.license_code);
      res.status(200).json({
        isLicensed: licensed,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Failed to check machine license"
      });
    }
  };
}

module.exports = ClientController;
