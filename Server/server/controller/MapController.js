const Product = require("../models/product");
const Machine = require("../models/machine");
const User = require("../models/user");

class MapController {
  static GetMachineList = async (req, res, next) => {
    try {
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
            product_list: machine.product_list,
            serial: machine.serial_number,
            cash: cash,
            agent: agentUser.fullname,
          });
        }
      }

      res.status(200).json({
        status: "success",
        message: "",
        machines: res_position,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };

  static GetMachineListByProduct = async (req, res, next) => {
    const productId = req.params.id;
    try {
      let res_position = [];
      const machines = await Machine.find({});
      for (const machine of machines) {
        if (machine.product_list) {
          const checkMatchedProductResult = machine.product_list.filter( (product) => product.type == productId );
          if (checkMatchedProductResult.length > 0) {
            let agentUser = await User.findOne({ _id: machine.agent_id });
            let cash = machine.cash_list.reduce((sum, item) => {
              const cash_item = parseInt(item.value) * parseInt(item.name);
              return sum + cash_item;
            }, 0);

            res_position.push ({
              location: machine.location,
              product_list: machine.product_list,
              serial: machine.serial_number,
              cash,
              agent: agentUser.fullname,
            })
          }
        }
      }

      res.status(200).json({
        status: "success",
        message: "",
        machines: res_position,
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

module.exports = MapController;
