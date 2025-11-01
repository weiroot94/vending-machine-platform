const appConfig = {
  API_SERVER: process.env.REACT_APP_API_SERVER || "https://localhost:8443/",
  PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
  PAYPAL_MACHANT_ID: process.env.REACT_APP_PAYPAL_MERCHANT_ID || "",
  PAYPAL_SECRET_NO: process.env.REACT_APP_PAYPAL_SECRET || "",
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
};

export default appConfig;
