/*
 * This is an example of Vending Machine & Server communication
 * You can refer these examples for your python app
 * This example is written by Node.js
 */

const { response } = require("express");

/*** 1. WS : connect to the server ***/
webSocket.send({
  action: "MachineConnect",
  payload: {
    serialno: "1234-5678-90",
  },
});

webSocket.on("onMachineConncted", (response) => {
  response = {
    status: 1,
    token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4",
  };
});

/*** 2. WS : send machine status every 5s ***/
webSocket.send({
  action: "MachineSendStatus",
  payload: {
    serialno: "123-456-678",
    temparature: "XXX",
    token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4", // this should be the previous token that server provided
  },
});

webSocket.on("onMachineGetStatus", (response) => {
  response = {
    status: 1, // this can be 1 or 0. 1: there is updated information, 0: there is no updated information
    type: "machine", // this can be "machine", "ads", "product" or "all"
  };
});

/*** 3. HTTPS : request for getting updated Machine info ***/
method = "POST";

const requestMachineInfo = {
  serialno: "123-345-456",
  token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4",
};

const responseMachineInfo = {
  status: 1, // 1: success, 0: error
  message: "", // message
  details: [
    // machine info details
    {
      name: "carori",
      unit: "kj",
      value: "600",
      thumbnail: "",
    },
  ],
};

/*** 4. HTTPS : request for getting updated ads info ***/
method = "POST";
const requestADSInfo = {
  serialno: "123-345-456",
  token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4",
};

const responseADSInfo = {
  status: 1,
  message: "",
  details: {
    type: "PPT", // PPT or MP4
    content: "", // content for base64
  },
};

/*** 5. HTTPS : request for getting updated product info ***/
method = "POST";
const requestProductInfo = {
  serialno: "123-345-456",
  token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4",
};

const responseProductInfo = {
  status: 1,
  message: "",
  details: [
    {
      itemno: "1",
      name: "Product-Apple",
      thumbnail: await readFile("server/upload/product/1.png"), // base64 content jpeg or png
      detailimg: await readFile("server/upload/product/detail.png"),
      nicotine: "20mg",
      batterypack: "300mAh",
      tankvolumn: "XXX",
      price: 10,
      currency: "EUR",
      caution: "This is ....",
      stock: 10,
    },
  ],
};

/*** 6. Sell Product ***/
method = "POST";

const requestSellProduct = {
  serialno: "123-345-456",
  product_id: "1",
  product_count: "3",
  product_price: "10",
  total_price: "30",
  currency: "EUR",
  token: "123kj12k34n12k3npqosfdh89dhsvc09h8129b4123nb4",
};

const responseSellProduct = {
  status: "success", // 1: success, 0: error
  message: "Success", // message
};
