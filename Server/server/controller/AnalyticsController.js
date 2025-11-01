const { startOfYear, endOfYear, startOfMonth, endOfMonth } = require('date-fns');

const Order = require("../models/order");
const Machine = require("../models/machine");

class AnalyticsController {
  static GetTotalValues = async (req, res, next) => {
    try {
      const year = parseInt(req.body.year);
      const startDate = startOfYear(new Date(year, 0, 1));
      const endDate = endOfYear(new Date(year, 11, 31));

      const result = await Order.aggregate([
        {
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$created_at",
              }
            }
          }
        },
        {
          $match: {
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $month: "$date" },
            sum_amount: { $sum: "$total_amount" },
            sum_product_count: { $sum: "$product_count" },
            count_orders: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            sum_amount: 1,
            sum_product_count: 1,
            count_orders: 1
          }
        },
        {
          $sort: { month: 1 }
        }
      ]);

      const detailedTotalValues = Array.from({ length: 12 }, (v, i) => ({
        month: i + 1,
        sum_amount: 0,
        sum_product_count: 0,
        count_orders: 0
      }));

      result.forEach(data => {
        const index = data.month - 1; // Convert 1-based month to 0-based index for array
        detailedTotalValues[index].sum_amount = data.sum_amount;
        detailedTotalValues[index].sum_product_count = data.sum_product_count;
        detailedTotalValues[index].count_orders = data.count_orders;
      });

      res.status(200).json({
        status: "success",
        message: "Total values retrieved successfully",
        details: detailedTotalValues
      });
    } catch (err) {
      console.error("Error retrieving total values:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to retrive total sales analytics information"
      });
    }
  };

  static GetTypeValues = async (req, res, next) => {
    try {
      const matchStage = {};
    // Add year filter if specified
    if (req.body.year) {
      const year = parseInt(req.body.year);
      const startDate = startOfYear(new Date(year, 0, 1));
      const endDate = endOfYear(new Date(year, 11, 31));

      // As the created_at of Order collection is just string typed, we need to change
      // it to formatted one in query
      matchStage.created_date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Add month filter if specified
    if (req.body.month && req.body.month !== "0") {
      const year = parseInt(req.body.year);
      const month = parseInt(req.body.month);
      const startDate = startOfMonth(new Date(year, month - 1, 1));
      const endDate = endOfMonth(new Date(year, month - 1, 1));

      matchStage.created_date = {
        ...matchStage.created_date,
        $gte: startDate,
        $lte: endDate
      };
    }
      // Aggregate to get type values
      const typeValues = await Order.aggregate([
        {
          $addFields: {
            created_date: {
              $dateFromString: {
                dateString: "$created_at",
              }
            }
          }
        },
        { $match: matchStage },
        {
          $group: {
            _id: "$product",
            totalProductCount: { $sum: "$product_count" },
            totalAmount: { $sum: "$total_amount" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            product: "$product.name",
            totalProductCount: 1,
            totalAmount: 1,
          },
        },
      ]);
  
      res.status(200).json({
        status: "success",
        message: "Success!",
        details: typeValues,
      });
    } catch (err) {
      console.error("Error fetching type values:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to get sales informatoin according to products",
      });
    }
  };

  static GetMachineValues = async (req, res, next) => {
    try {
      const matchStage = {};
  
      // Add year filter if specified
      if (req.body.year) {
        const year = parseInt(req.body.year);
        const startDate = startOfYear(new Date(year, 0, 1));
        const endDate = endOfYear(new Date(year, 11, 31));
  
        matchStage.created_date = {
          $gte: startDate,
          $lte: endDate
        };
      }
  
      // Add month filter if specified
      if (req.body.month && req.body.month !== "0") {
        const month = parseInt(req.body.month);
        const year = parseInt(req.body.year);
        const startDate = startOfMonth(new Date(year, month - 1, 1));
        const endDate = endOfMonth(new Date(year, month - 1, 1));
  
        matchStage.created_date = {
          ...matchStage.created_date,
          $gte: startDate,
          $lte: endDate
        };
      }
  
      const machineValues = await Order.aggregate([
        {
          $addFields: {
            created_date: {
              $dateFromString: {
                dateString: "$created_at",
              }
            }
          }
        },
        { $match: matchStage },
        {
          $group: {
            _id: "$machine",
            totalProductCount: { $sum: "$product_count" },
            totalAmount: { $sum: "$total_amount" },
            count_orders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            machine_id: "$_id",
            totalProductCount: 1,
            totalAmount: 1,
            count_orders: 1,
          },
        },
      ]);
  
      let detailedMachineValues = [];
  
      await Promise.all(
        machineValues.map(async (machineValue) => {
          let result = await Machine.findById(machineValue.machine_id);
  
          if (result) {
            detailedMachineValues.push({
              machine: result.serial_number,
              count_orders: machineValue.count_orders,
              totalProductCount: machineValue.totalProductCount,
              totalAmount: machineValue.totalAmount,
            });
          }
        })
      );
  
      res.status(200).json({
        status: "success",
        message: "Success!",
        details: detailedMachineValues,
      });
    } catch (err) {
      console.error("Error fetching machine values:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to get sales information according to machines",
      });
    }
  };

  static GetAreaValues = async (req, res, next) => { };
}

module.exports = AnalyticsController;
