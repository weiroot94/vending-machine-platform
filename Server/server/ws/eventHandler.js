const fs = require("fs");
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const config = require("../../config");
const Machine = require("../models/machine");
const Order = require("../models/order");
const logger = require("../logger")

const {
  ADMIN_CONNECT,
  ADMIN_GET_VENDING_STATUS,
  MACHINE_CONNECT,
  MACHINE_SEND_STATUS,
  DISCONNECTED,
} = require("./constants");

let socket_clients = [];

const eventHandlers = () => {
  const broadcastToAdmins = (action, payload) => {
    socket_clients
      .filter((client) => client.position === "admin")
      .forEach((client) => {
        client.send(JSON.stringify({ action: action, ...payload }));
      });
  };

  const broadcastToClients = (action, payload) => {
    socket_clients
      .filter((client) => client.position === "user")
      .forEach((client) => {
        client.send(JSON.stringify({ action: action, ...payload }));
      });
  };

  const replyOnCurrent = (ws, action, payload) => {
    ws.send(JSON.stringify({ action: action, ...payload }));
  };

  const formatedDateTime = (format) => {
    const now = new Date().toLocaleString("en-us");
    return date.format(now, format);
  };

  const generateJWT = (serialNumber) => {
    return jwt.sign(
      JSON.stringify({
        email: serialNumber,
        role: "Machine",
      }),
      config.jwtSecret
    );
  };

  const findOrderByHashvalue = (hashValue, ws) => {
    Order.findOne({ hash_value: hashValue }).then((result) => {
      if (result !== null) {
        replyOnCurrent(ws, "onMachineConnected", {
          result: result,
        });
      } else {
        findOrderByHashvalue(hashValue, ws);
      }
    });
  };

  return {
    [MACHINE_CONNECT]: async (ws, uid, payload) => {
      ws.position = "machine";
      if (!socket_clients.some((client) => client == ws)) {
        socket_clients.push(ws);
      }
      try {
        Order.findOneAndUpdate({ hash_value: payload.payload.hashvalue, purchased: 'pending' },
          {
            purchased: 'success',
            updated_at: new Date().toLocaleString("en-us"),
          }
        ).then((result) => {
          if (result) {
            logger.info(`[ws] ${ws.uid}: Processed Order ${result.hash_value}`);
            replyOnCurrent(ws, "onMachineConnected", {
              result: result,
            });
          }
        })
      } catch (error) {
        logger.error("[ws/eventhandler] Failed to process Order");
      }
    },
    [MACHINE_SEND_STATUS]: async (ws, uid, payload) => {
      const action = "onMachineGetStatus";

      Machine.findOne({ serial_number: payload.serialno }).then((result) => {
        const payload_noupdates = {
          status: 0,
          type: "",
        };

        const payload_updates = {
          status: 1,
          type: ["ads", "machine", "product"],
        };

        replyOnCurrent(ws, action, payload_updates);
      });
    },
    [DISCONNECTED]: async (ws) => {
      logger.info(`[ws] Connection ${ws.uid} exited`)
      const removeIndex = socket_clients.findIndex((obj) => obj == ws);
      if (removeIndex !== -1) {
        socket_clients.splice(removeIndex, 1);
      }
    },
  };
};

module.exports = eventHandlers;
