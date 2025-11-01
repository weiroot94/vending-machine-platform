const User = require("../models/user");
const Machine = require("../models/machine");
const bcrypt = require("bcrypt");

class OverviewController {
  static GetOverviewInfo = async (req, res, next) => {
    try {
      const users = await User.find({});
      let res_area = [];
      let res_users = [];

      users.forEach((user) => {
        user.area &&
          user.area.forEach((assigned_area) => {
            res_area.push(assigned_area);
            res_users.push(user);
          });
      });

      let res_position = [];

      const machines = await Machine.find({});
      for (const machine of machines) {
        if (machine.location) {
          let cash = machine.cash_list.reduce((sum, item) => {
            const cash_item = parseInt(item.value) * parseInt(item.name);
            return sum + cash_item;
          }, 0);

          let agentUser = await User.findOne({ _id: machine.agent_id });

          res_position.push({
            location: machine.location,
            serial: machine.serial_number,
            cash: cash,
            agent: agentUser.fullname,
          });
        }
      }

      res.status(200).json({
        status: "success",
        message: "",
        area: res_area,
        location: res_position,
        users: res_users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
}

module.exports = OverviewController;
