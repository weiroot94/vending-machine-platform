const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const config = require("./config");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const https = require("https");
const http = require("http");
const wss = require("./server/ws");
const fileUpload = require("express-fileupload");
const limiter = require("./server/middleware/apiRateLimit");
const logger = require("./server/logger");

require("dotenv").config();

const key = fs.readFileSync(__dirname + "/certsFiles/priv.key");
const cert = fs.readFileSync(__dirname + "/certsFiles/cert.crt");

const options = {
  key: key,
  cert: cert,
};

const port = process.env.PORT || 8443;
const host = process.env.HOST || "localhost";
const wsport = process.env.WSPORT || 8081;

// Connect to the database and load models
require("./server/models").connect(config.dbUri);

const app = express();

app.use(express.static(path.join(__dirname, "static")));

// Tell the app to parse HTTP body message
app.use(cookieParser());
app.use(bodyParser.json());
app.use(limiter);

// In production build, we will use only limited origin client sites;
// const allowedDomains = ['http://domain1.com', 'http://domain2.com', 'http://domain3.com'];
// app.use(cors({ origin: allowedDomains }));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(
  session({
    secret: "wbfbTrnuOfeTkmQkSXwvzkRwdoWmUeGiRqPBUKRZ",
    resave: true,
    saveUninitialized: false,
  })
);

// Pass the authentication checker middleware
// const authCheckMiddleware = require("./server/middleware/auth-check");
// app.use("/api", authCheckMiddleware);

// Routes
const authRoutes = require("./server/routes/auth");
const apiRoutes = require("./server/routes/api");
const fileRoutes = require("./server/routes/file");
const tokenRoutes = require("./server/routes/token");
const clientRoutes = require("./server/routes/client");
const customerRoutes = require("./server/routes/customer");

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/file", fileRoutes);
app.use("/token", tokenRoutes);
app.use("/client", clientRoutes);
app.use("/customer", customerRoutes);

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "static", "index.html"));
// });

const server = https.createServer(options, app);
// const server = http.createServer(options, app);
wss({port: wsport});

server.listen(port, () => {
  logger.info(`Server is running on https://${host}:${port}`);
});
