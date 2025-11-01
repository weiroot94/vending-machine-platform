const { format, subDays, eachDayOfInterval, subYears, subMonths, startOfMonth, endOfMonth } = require('date-fns');

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const Machine = require("../models/machine");
const Audit = require("../models/audit");
const Deposit = require("../models/deposit");
const ChangelogController = require("./ChangelogController");

class DashboardController {
  static GetAllDetails = async (req, res, next) => {
    try {
      let returnValue = {
        machines: {
          total: 0,
          online: 0,
          offline: 0,
          alert_machines: [],
        },
        users: {
          total_visitor: 0,
          total_register: 0,
          week_visitors: {},
          year_registors: {},
        },
        products: {
          total_product: 0,
        },
        locations: 0,
        running_version: 1.0,
        analytics: {
          total_income: 0,
          cash_income: {},
          qr_income: {},
          total_deposit: 0,
          year_total_amount: {},
          year_total_orders: {},
        },
      };

      // registered machines: Total/Online/Offline
      let allMachines = await Machine.find({});
      returnValue.machines.total = allMachines.length;
      returnValue.machines.online = allMachines.filter((machine) => {
        let isOnline = false;

        if (machine.latest_ping_at) {
          const timeSinceLastPing = Date.now() - machine.latest_ping_at;
          if (timeSinceLastPing < 20000) {
            isOnline = true;
          }
        }

        return isOnline;
      }).length;
      returnValue.machines.offline = returnValue.machines.total - returnValue.machines.online;

      ////////////////////////////////////////////////////////////////////////
      // Total Visitors in one week
      ////////////////////////////////////////////////////////////////////////
      let endDate = new Date();
      let startDate = subDays(endDate, 6);
      let formattedStartDate = format(startDate, "yyyy/MM/dd HH:mm:ss");
      let formattedEndDate = format(endDate, "yyyy/MM/dd HH:mm:ss");

      const weekVisitors = await Audit.aggregate([
        {
          $match: {
            created_at: { $gte: formattedStartDate, $lte: formattedEndDate },
            comment: { $regex: '.*sign in:.*', $options: 'i' }
          }
        },
        {
          $addFields: {
            dateOnly: { $substr: ["$created_at", 0, 10] } // Extracting 'yyyy/MM/dd'
          }
        },
        {
          $group: {
            _id: "$dateOnly",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Generate a list of dates for the last 7 days
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate }).map(date =>
        format(date, "yyyy/MM/dd")
      );

      // Initialize an object to hold the final counts, with all dates set to 0
      const visitorsCountsByDate = dateRange.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      weekVisitors.forEach(result => {
        if (visitorsCountsByDate.hasOwnProperty(result._id)) {
          visitorsCountsByDate[result._id] = result.count;
        }
      });

      let responseData = {};

      for (const [key, value] of Object.entries(visitorsCountsByDate)) {
        const date = new Date(key);
        const formattedKey = date.toLocaleDateString('en-US', {
          // month: 'short',
          day: 'numeric'
        });
        responseData[formattedKey] = value; // Assign the value to the new formatted key
      }

      // get the trend value
      const today = new Date();
      const sevenDaysAgo = subDays(today, 7);
      const fourteenDaysAgo = subDays(today, 14);

      const results = await Audit.aggregate([
        {
          $match: {
            comment: { $regex: 'sign in', $options: 'i' },
            created_at: {
              $gte: format(fourteenDaysAgo, "yyyy/MM/dd HH:mm:ss"),
              $lte: format(today, "yyyy/MM/dd HH:mm:ss")
            }
          }
        },
        {
          $project: {
            recent: {
              $cond: {
                if: { $gte: ["$created_at", format(sevenDaysAgo, "yyyy/MM/dd HH:mm:ss")] },
                then: 'last7days',
                else: 'previous7days'
              }
            }
          }
        },
        {
          $group: {
            _id: '$recent',
            count: { $sum: 1 }
          }
        }
      ]);

      const thisWeek = results.find(result => result._id === 'last7days')?.count || 0;
      const last7days = results.find(result => result._id === 'previous7days')?.count || 0;

      let percentageChange = 0;
      if (last7days > 0) {
        percentageChange = parseInt(((thisWeek - last7days) / last7days) * 100);
      } else if (thisWeek > 0) {
        percentageChange = 100;
      }

      returnValue.users.week_visitors = {
        visitorsPerDay: responseData,
        weekVisitors: thisWeek,
        trend: percentageChange
      };

      const totalVisitors = await Audit.countDocuments({
        comment: { $regex: 'sign in', $options: 'i' }
      });

      returnValue.users.total_visitor = totalVisitors;



      //////////////////////////////////////////////////////////////////////////////////
      // Total registers in one year
      //////////////////////////////////////////////////////////////////////////////////
      endDate = new Date();
      startDate = subYears(endDate, 1);

      formattedStartDate = format(startDate, 'yyyy/MM/dd HH:mm:ss');
      formattedEndDate = format(endDate, 'yyyy/MM/dd HH:mm:ss');

      const registeredPerMonth = await Audit.aggregate([
        {
          $match: {
            created_at: { $gte: formattedStartDate, $lte: formattedEndDate },
            comment: { $regex: 'registered', $options: 'i' }
          }
        },
        {
          $addFields: {
            formattedDate: { $substr: ['$created_at', 0, 7] }
          }
        },
        {
          $group: {
            _id: '$formattedDate',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])

      let allMonths = [];
      let currentDate = endDate;
      let i = 0;
      while (i < 12) {
        allMonths.push(format(currentDate, 'yyyy/MM'));
        currentDate = subMonths(currentDate, 1);
        i++;
      }

      // Merge the aggregated results with all months
      let resultData = allMonths.reduce((acc, month) => {
        const matchingResult = registeredPerMonth.find(result => result._id === month);
        acc[month] = matchingResult ? matchingResult.count : 0;
        return acc;
      }, {});


      let formattedResult = {};
      for (const [key, value] of Object.entries(resultData).reverse()) {
        const date = new Date(key);
        const formattedKey = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        });
        formattedResult[formattedKey] = value;
      }

      returnValue.users.total_register = formattedResult;

      //////////////////////////////////////////////////////////////////////////////////
      // Total Selling analytics in one year
      //////////////////////////////////////////////////////////////////////////////////
      endDate = new Date();
      startDate = subYears(endDate, 1);

      formattedStartDate = format(startDate, 'M/d/yyyy, h:mm:ss a');
      formattedEndDate = format(endDate, 'M/d/yyyy, h:mm:ss a');

      const sellingsPerMonth = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $gte: [{ $toDate: "$created_at" }, new Date(formattedStartDate)] },
                { $lte: [{ $toDate: "$created_at" }, new Date(formattedEndDate)] }
              ]
            },
            purchased: "success",
            payment: "cash",
          }
        },
        {
          $addFields: {
            formattedDate: { $dateToString: { format: "%Y/%m", date: { $toDate: "$created_at" } } }
          }
        },
        {
          $group: {
            _id: '$formattedDate',
            total: { $sum: "$total_amount" }
          }
        }
      ]);

      allMonths = [];
      currentDate = endDate;
      i = 0;
      while (i < 12) {
        allMonths.push(format(currentDate, 'yyyy/MM'));
        currentDate = subMonths(currentDate, 1);
        i++;
      }

      // Merge the aggregated results with all months
      resultData = allMonths.reduce((acc, month) => {
        const matchingResult = sellingsPerMonth.find(result => result._id === month);
        acc[month] = matchingResult ? matchingResult.total : 0;
        return acc;
      }, {});


      formattedResult = {};
      for (const [key, value] of Object.entries(resultData).reverse()) {
        const date = new Date(key);
        const formattedKey = date.toLocaleDateString('en-US', {
          // year: 'numeric',
          month: 'short'
        });
        formattedResult[formattedKey] = value;
      }

      returnValue.analytics.cash_income = formattedResult;

      const ordersPerMonth = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $gte: [{ $toDate: "$created_at" }, new Date(formattedStartDate)] },
                { $lte: [{ $toDate: "$created_at" }, new Date(formattedEndDate)] }
              ]
            },
            purchased: "success",
            payment: "qr",
          }
        },
        {
          $addFields: {
            formattedDate: { $dateToString: { format: "%Y/%m", date: { $toDate: "$created_at" } } }
          }
        },
        {
          $group: {
            _id: '$formattedDate',
            total: { $sum: "$total_amount" }
          }
        }
      ]);

      allMonths = [];
      currentDate = endDate;
      i = 0;
      while (i < 12) {
        allMonths.push(format(currentDate, 'yyyy/MM'));
        currentDate = subMonths(currentDate, 1);
        i++;
      }

      // Merge the aggregated results with all months
      resultData = allMonths.reduce((acc, month) => {
        const matchingResult = ordersPerMonth.find(result => result._id === month);
        acc[month] = matchingResult ? matchingResult.total : 0;
        return acc;
      }, {});


      formattedResult = {};
      for (const [key, value] of Object.entries(resultData).reverse()) {
        const date = new Date(key);
        const formattedKey = date.toLocaleDateString('en-US', {
          // year: 'numeric',
          month: 'short'
        });
        formattedResult[formattedKey] = value;
      }

      returnValue.analytics.qr_income = formattedResult;

      // Total depositing money
      const depositSum = await Deposit.aggregate([{
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }]);

      const totalDeposited = depositSum.length > 0 ? depositSum[0].totalAmount : 0;
      returnValue.analytics.total_deposit = parseInt(totalDeposited);

      // Current Products count for all vending machines
      let products = await Product.find({});
      returnValue.products.total_product = products.length;

      // Current Registered locations

      // Current running version
      returnValue.running_version =  await ChangelogController.GetCurrentVersion("vendingapp");

      // Alerts of Vending machines ( Out of stock, Low stock, Out of cash)
      let machine_list = await Machine.aggregate([
        {
          $project: {
            serial_number: 1,
            agent_id: 1,
            status: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$product_list",
                          cond: { $eq: [{ $toInt: "$$this.stock" }, 0] },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: "out of stock",
                else: {
                  $cond: {
                    if: {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$product_list",
                              cond: { $lt: [{ $toInt: "$$this.stock" }, 3] },
                            },
                          },
                        },
                        0,
                      ],
                    },
                    then: "low stock",
                    else: {
                      $cond: {
                        if: {
                          $gt: [
                            {
                              $size: {
                                $filter: {
                                  input: "$cash_list",
                                  cond: {
                                    $eq: [{ $toInt: "$$this.value" }, 0],
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        then: "out of cash",
                        else: "normal",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]);

      let alert_list = machine_list.filter(
        (machine) => machine.status != "normal"
      );

      await Promise.all(
        alert_list.map(async (alert) => {
          let agent = await User.findOne({ _id: alert.agent_id });
          alert.agent_id = agent.fullname;
        })
      );

      returnValue.machines.alert_machines = alert_list;

      res.status(200).json({
        status: "success",
        message: "",
        data: returnValue,
      });

    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Failed to get dashboard data"
      });
    }
  };
}

module.exports = DashboardController;
