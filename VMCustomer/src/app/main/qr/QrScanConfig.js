import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import QrScan from "./QrScan";

i18next.addResourceBundle("en", "QrScanPage", en);
i18next.addResourceBundle("de", "QrScanPage", de);

const QrScanConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "qrscan",
      element: <QrScan />,
    },
  ],
};

export default QrScanConfig;
