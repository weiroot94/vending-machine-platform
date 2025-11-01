const fs = require("fs");
const Machine = require("../models/machine");
const User = require("../models/user");
const AuditController = require("./AuditController");
const Util = require('./Util');

async function readFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, function (error, data) {
      if (error) return reject(error);
      resolve(data.toString("base64"));
    });
  });
}

class MachineController {
  static checkMachineLicense = async (serial_number) => {
    //Pseudo code
    //const licenseInfo = await sendLicenseCheckRequest("https://vmlicense.com/api/validcheck", machine.license_code);
    // if (licenseInfo) return licenseInfo.expDate;
    // else return false;

    if (serial_number == "1111-1111-1111-1111-1111")
      return true;
    else
      return false;
  }

  static checkMachineExpireDate = async (serial_number) => {
    if (serial_number == "1111-1111-1111-1111-1111") {
      const currentDate = new Date();
      const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
      const futureDate = new Date(currentDate.getTime() + thirtyDaysInMilliseconds);
      return futureDate;
    }
    else
      return 0;
  }

  static MachineList = async (req, res, next) => {
    let machineList = await Machine.find({}).sort({ serial_number: 1});
    let resultList = [];
    await Promise.all(
      machineList.map(async (machine) => {
        let { _id, agent_id, serial_number, latest_ping_at, license_code, created_at } = machine;
        let machineInfo = {
          _id,
          agent_id,
          serial_number,
          latest_ping_at,
          license_code,
          created_at
        };

        let user = await User.findOne({ _id: machine.agent_id });
        
        machineInfo.agent = user ? user.fullname : null;
        machineInfo.activated = await this.checkMachineLicense(machine.license_code);
        machineInfo.expDate = await this.checkMachineExpireDate(machine.license_code);
        machineInfo.online = machine.latest_ping_at ? Date.now() - machine.latest_ping_at < 20000 : false;

        resultList.push(machineInfo);
      })
    );
    res.status(200).json({
      status: "success",
      message: "",
      data: resultList,
    });
  };

  static MachineAdd = async (req, res) => {
    try {
      const payload = req.body;
      const user = await Util.verifyToken(payload.token);

      if (user != false) {
        const newMachine = new Machine();
        newMachine.serial_number = payload.serial_number;
        newMachine.agent_id = user._id;
        newMachine.location = JSON.parse(payload.location);
        newMachine.machine_details = JSON.parse(payload.machine_details);
        newMachine.ads_detail = payload.ads_detail;
        newMachine.product_list = JSON.parse(payload.product_list);
        newMachine.cash_list = JSON.parse(payload.cash_list);
        newMachine.is_online = false;
        newMachine.created_at = new Date().toLocaleString("en-us");
        newMachine.updated_at = new Date().toLocaleString("en-us");

        newMachine.save().then((newMachineResult) => {
          AuditController.AuditAdd(
            req.body.token,
            "building",
            "success",
            `@ added new a machine: <strong>${newMachineResult.serial_number}<strong>`,
            function () {
              res.status(200).json({
                message: "Machine created successfully",
              });
            }
          );
        }).catch(err => {
          res.status(400).json({
            error: "Faild to save database, please check if serial number is unique",
          });
        });
      } else {
        res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (err) {
      res.status(400).json({
        error: "Failed to create new machine",
      });
    }
  };

  static MachineDelete = async (req, res, next) => {
    const { id, token } = req.body;
    Machine.findById(id).then((result) => {
      if (!result) {
        return res.status(400).json({
          error: "Faild to find registered machine",
        });
      }
      AuditController.AuditAdd(
        token,
        "building",
        "danger",
        `@ deleted a machine: <strong>${result.serial_number}<strong>`,
        function () {
          Machine.deleteOne({ _id: id }).then((result) => {
            res.status(200).json({
              message: "Machine deleted successfully",
            });
            return;
          }).catch(err => {
            console.log(err);
            res.status(400).json({
              error: "Faild to delete machine",
            });
          });
        }
      );
    });
  };

  static MachineUpdate = async (req, res) => {
    const {id, location, machine_details, ads_detail, product_list, cash_list, token} = req.body;
    try {
      const user = await Util.verifyToken(token);

      if (user != false) {
        Machine.findByIdAndUpdate(id, 
          {
            agent_id: user._id,
            location: JSON.parse(location),
            machine_details: JSON.parse(machine_details),
            ads_detail: ads_detail,
            product_list: JSON.parse(product_list),
            cash_list: JSON.parse(cash_list),
            updated_at: new Date().toLocaleString("en-us"),
          }
        ).then((updatedMachine) => {
          if (!updatedMachine) {
            return res.status(400).json({
              error: "Failed to update, machine not found",
            });
          }

          let comment = "";
            if (updatedMachine.agent_id != user._id) {
              comment += `&nbsp;&nbsp;<strong class="text-info">agent_id<strong>: <span>${updatedMachine.agent_id} -> ${user._id}<span>`;
            }
            if (updatedMachine.location != location) {
              comment += `&nbsp;&nbsp;<strong class="text-info">location<strong>`;
            }
            if (updatedMachine.machine_details != machine_details) {
              comment += `&nbsp;&nbsp;<strong class="text-info">machine_details<strong>: <span>${JSON.stringify(updatedMachine.machine_details)} -> ${machine_details}<span>`;
            }
            if (updatedMachine.ads_detail != ads_detail) {
              comment += `&nbsp;&nbsp;<strong class="text-info">ads_detail<strong>: <span>${updatedMachine.ads_detail} -> ${ads_detail}<span>`;
            }
            if (updatedMachine.product_list != product_list) {
              comment += `&nbsp;&nbsp;<strong class="text-info">product_list<strong>`;
            }
            if (comment != "") comment = `&nbsp;&nbsp;(${comment}&nbsp;&nbsp;)`;
  
          AuditController.AuditAdd(
            user.token,
            "building",
            "warning",
            `@ updated a machine: <strong>${updatedMachine.serial_number}<strong>${comment}`,
            function () {
              res.status(200).json({
                message: "Updated machine successfully",
              });
            }
          );
        });
      } else {
        res.status(400).json({
          error: "Invalid request from unregistered user",
        });
      }
    } catch (err) {
      res.status(500).json({
        error: "User authentication failed or session time out, please log in again",
      });
    }
  };

  static MachineDetail = async (req, res, next) => {
    await Machine.findById(req.body.id).then(async (result) => {
      const checkResult = await this.checkMachineLicense(result.license_code);
      let machineDetail = {};
      machineDetail.machine = result;
      machineDetail.activated = checkResult;

      res.status(200).json({
        status: "success",
        message: "Success!",
        detail: machineDetail,
      });
      return;
    });
  };

  static MachineLicense = async (req, res) => {
    const licensecode = req.body.licensecode;
    const machineId = req.body.id;

    const checkResult = await this.checkMachineLicense(licensecode);
    if (checkResult) {
      const machine = await Machine.findById(machineId);
      if (!machine) {
        return res.status(400).json({
          error: "Failed to find registered machine",
        });
      }

      machine.license_code = licensecode;
      machine.save().then(result => {
        this.SendMachineUnLockMail(machine);
        res.status(200).json({
          message: "Machine is activated successfully",
        });
      }).catch(err => {
        console.log(err);
        res.status(400).json({
          error: "Failed to update machine information",
        });
      })
    } else {
      res.status(400).json({
        error: "Invalid license code",
      });
    }
  }

  static SendMachineUnLockMail = async (machine) => {
    let agent_id = machine.agent_id;
    const agents = await User.find({ _id: agent_id });
    agents.map((agent) => {
      Util.sendMachineUnLockMail(agent.fullname, agent.email, machine.serial_number);
    })

    const admins = await User.find({ role: "administrator" });
    admins.map((admin) => {
      // Util.sendMachineUnLockMail(admin.fullname, admin.email, machine.serial_number);
    });
  }
}

module.exports = MachineController;
