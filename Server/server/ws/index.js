const { WebSocket, WebSocketServer } = require("ws");
const eventHandlers = require("./eventHandler");
const logger = require("../logger");


module.exports = (server) => {
  const wssServer = new WebSocketServer(server);

  const generateUUID = () =>
    Date.now() + Math.floor(Math.random() * (1000 - 1) + 1);

  wssServer.on("connection", (wss) => {
    const uuid = generateUUID();
    let request_count = 0;
    const eventProcessor = eventHandlers();

    wss.uid = uuid;
    logger.info(`[ws] New connection ${wss.uid} established`);

    wss.on("message", async (payload) => {
      const { action, ...receivedPayload } = JSON.parse(payload.toString());
      request_count++;
      Object.hasOwnProperty.call(eventProcessor, action) &&
        (await eventProcessor[action](wss, uuid, receivedPayload));
    });

    wss.on("close", () => {
      eventProcessor["disconnected"](wss);
    });
  });
};
