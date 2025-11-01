const mongoose = require('mongoose');
const logger = require("../logger");

module.exports.connect = (uri) => {
  mongoose.connect(uri);
  // Plug in to the promise library
  mongoose.Promise = global.Promise;

  mongoose.connection.once('open', () => {
    logger.info(`Mongoose connected to ${uri}`);
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });

  // Load models
}
