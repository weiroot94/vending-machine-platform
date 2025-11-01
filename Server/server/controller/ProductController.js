const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const AuditController = require("./AuditController");
const Util = require("./Util");

class ProductController {
  static ProductList = async (req, res, next) => {
    let productList = await Product.find({}).sort({ name: 1 });
    await Promise.all(
      productList.map(async (product) => {
        let user = await User.findOne({ _id: product.product_manager_id });
        if (user != null) {
          product.poster = user.fullname;
        }
      })
    );
    res.status(200).json({
      status: "success",
      message: "",
      data: productList,
    });
  };

  static moveFile_ = (file, path) => {
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

  static ProductAdd = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await Util.verifyToken(payload.token);

      if (user != false) {
        const newProduct = new Product();

        newProduct.name = payload.name;
        newProduct.name_de = payload.name_de;
        newProduct.product_manager_id = user._id;
        newProduct.description = payload.description;
        newProduct.description_de = payload.description_de;
        newProduct.category = payload.category;
        newProduct.price = payload.price;
        newProduct.currency = payload.currency;
        newProduct.theme = payload.theme;
        newProduct.additionalinfo1 = payload.additionalInfo1;
        newProduct.additionalinfo2 = payload.additionalInfo2;
        newProduct.additionalinfo3 = payload.additionalInfo3;
        newProduct.additionalinfo4 = payload.additionalInfo4;
        newProduct.additionalinfo5 = payload.additionalInfo5;
        newProduct.additionalinfo1_de = payload.additionalInfo1_de;
        newProduct.additionalinfo2_de = payload.additionalInfo2_de;
        newProduct.additionalinfo3_de = payload.additionalInfo3_de;
        newProduct.additionalinfo4_de = payload.additionalInfo4_de;
        newProduct.additionalinfo5_de = payload.additionalInfo5_de;
        newProduct.isfeatured = payload.isfeatured;
        newProduct.created_at = new Date().toLocaleString("en-us");
        newProduct.updated_at = new Date().toLocaleString("en-us");

        const imageFiles = req.files;
        const productName = payload.name;
        const dateSuffix = Date.now();
        const mainImageName = `${productName}-main-${dateSuffix}`;
        const subinfoImage1Name = `${productName}-additional-1-${dateSuffix}`;
        const subinfoImage2Name = `${productName}-additional-2-${dateSuffix}`;
        const subinfoImage3Name = `${productName}-additional-3-${dateSuffix}`;

        if (imageFiles) {
          try {
            const mainImage = imageFiles.attachfile;
            await this.moveFile_(mainImage, `server/upload/product/${mainImageName}`);
            newProduct.thumbnail = `server/upload/product/${mainImageName}`;

            if (imageFiles.subinfoimage1) {
              await this.moveFile_(imageFiles.subinfoimage1, `server/upload/product/${subinfoImage1Name}`);
              newProduct.subinfoimage1 = `server/upload/product/${subinfoImage1Name}`;
            }

            if (imageFiles.subinfoimage2) {
              await this.moveFile_(imageFiles.subinfoimage2, `server/upload/product/${subinfoImage2Name}`);
              newProduct.subinfoimage2 = `server/upload/product/${subinfoImage2Name}`;
            }

            if (imageFiles.subinfoimage3) {
              await this.moveFile_(imageFiles.subinfoimage3, `server/upload/product/${subinfoImage3Name}`);
              newProduct.subinfoimage3 = `server/upload/product/${subinfoImage3Name}`;
            }
          } catch (error) {
            return res.status(500).json({
              error: "Failed to upload product image",
            });
          }
        }

        newProduct.save().then((newProductResult) => {
          AuditController.AuditAdd(
            payload.token,
            "gift",
            "success",
            `@ added a new product: <strong>${newProductResult.name}<strong>`,
            function () {
              res.status(200).json({
                message: "Added new product successfully",
              });
            }
          );
        }).catch(err => {
          throw err;
        });
      } else {
        res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (err) {
      res.status(400).json({
        error: "Failed to create add new product",
      });
    }
  };

  static ProductUpdate = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await Util.verifyToken(payload.token);

      if (user != false) {
        let updateData = {};

        updateData.name = payload.name;
        updateData.name_de = payload.name_de;
        updateData.product_manager_id = user._id;
        updateData.description = payload.description;
        updateData.description_de = payload.description_de;
        updateData.category = payload.category;
        updateData.price = payload.price;
        updateData.currency = payload.currency;
        updateData.theme = payload.theme;
        updateData.additionalinfo1 = payload.additionalInfo1;
        updateData.additionalinfo2 = payload.additionalInfo2;
        updateData.additionalinfo3 = payload.additionalInfo3;
        updateData.additionalinfo4 = payload.additionalInfo4;
        updateData.additionalinfo5 = payload.additionalInfo5;
        updateData.additionalinfo1_de = payload.additionalInfo1_de;
        updateData.additionalinfo2_de = payload.additionalInfo2_de;
        updateData.additionalinfo3_de = payload.additionalInfo3_de;
        updateData.additionalinfo4_de = payload.additionalInfo4_de;
        updateData.additionalinfo5_de = payload.additionalInfo5_de;
        updateData.isfeatured = payload.isfeatured;
        updateData.updated_at = new Date().toLocaleString("en-us");

        const imageFiles = req.files;
        const productName = payload.name;
        const dateSuffix = Date.now();
        const mainImageName = `${productName}-main-${dateSuffix}`;
        const subinfoImage1Name = `${productName}-additional-1-${dateSuffix}`;
        const subinfoImage2Name = `${productName}-additional-2-${dateSuffix}`;
        const subinfoImage3Name = `${productName}-additional-3-${dateSuffix}`;

        updateData.thumbnail = payload.attachfile;
        updateData.subinfoimage1 = payload.subinfoimage1;
        updateData.subinfoimage2 = payload.subinfoimage2;
        updateData.subinfoimage3 = payload.subinfoimage3;

        if (imageFiles) {
          try {
            if (imageFiles.attachfile) {
              const mainImage = imageFiles.attachfile;
              await this.moveFile_(mainImage, `server/upload/product/${mainImageName}`);
              updateData.thumbnail = `server/upload/product/${mainImageName}`;
            }

            if (imageFiles.subinfoimage1) {
              await this.moveFile_(imageFiles.subinfoimage1, `server/upload/product/${subinfoImage1Name}`);
              updateData.subinfoimage1 = `server/upload/product/${subinfoImage1Name}`;
            }

            if (imageFiles.subinfoimage2) {
              await this.moveFile_(imageFiles.subinfoimage2, `server/upload/product/${subinfoImage2Name}`);
              updateData.subinfoimage2 = `server/upload/product/${subinfoImage2Name}`;
            }

            if (imageFiles.subinfoimage3) {
              await this.moveFile_(imageFiles.subinfoimage3, `server/upload/product/${subinfoImage3Name}`);
              updateData.subinfoimage3 = `server/upload/product/${subinfoImage3Name}`;
            }
          } catch (error) {
            return res.status(500).json({
              error: "Failed to upload product image",
            });
          }
        }

        Product.findByIdAndUpdate(payload.id, updateData).then((updatedProduct) => {
          AuditController.AuditAdd(
            payload.token,
            "gift",
            "warning",
            `@ updated a type: <strong>${payload.name}<strong>`,
            function () {
              res.status(200).json({
                message: "Updated product successfully",
              });
            }
          );
        }).catch(err => {
          throw err;
        });
      } else {
        res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Failed to update product",
      });
    }
  };

  static ProductDelete = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await Util.verifyToken(payload.token);

      if (user != false) {
        const product = await Product.findOne({ _id: payload.id });
        if (!product) {
          return res.status(400).json({
            error: "Failed to find product",
          });
        }

        const result = await Product.deleteOne({ _id: payload.id });
        if (result.deletedCount === 0) {
          return res.status(400).json({
            error: "No product was deleted",
          });
        }
        AuditController.AuditAdd(
          payload.token,
          "gift",
          "danger",
          `@ deleted a type: <strong>${product.name}<strong>`,
          function () {
            res.status(200).json({
              message: "Deleted product successfully",
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
        error: "Failed to delete product",
      });
    }
  };

  static ProductDetail = async (req, res, next) => {
    await Product.findById(req.body.id).then((result) => {
      return res.status(200).json({
        data: result,
      });
    }).catch(err => {
      console.log(err);
      return res.status(400).json({
        error: "Failed to get product detail information"
      });
    });
  };

  static ProductMapDetail = async (req, res, next) => { };

  static GetFeaturedProductList = async (req, res, next) => { };

  static GetHomeProductList = async (req, res, next) => {
    try {
      const orderList = await Order.aggregate([
        {
          $group: {
            _id: "$product",
            totalQuantitySold: { $sum: "$product_count" },
          },
        },
        {
          $sort: { totalQuantitySold: -1 },
        },
        {
          $limit: 3,
        },
      ]).exec();

      const productIds = orderList.map(product => product._id);
      const popular = await Product.find({ _id: { $in: productIds } }).exec();

      let featured = await Product.find({ isfeatured: true });

      res.status(200).json({
        status: "success",
        message: "Success!",
        detail: {
          popular,
          featured
        },
      });
    } catch (err) {
      console.error(err);
      return;
    }
  };
}

module.exports = ProductController;
