import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import PaymentHistory from "./PaymentHistory";

i18next.addResourceBundle("en", "PurchaseHistoryPage", en);
i18next.addResourceBundle("de", "PurchaseHistoryPage", de);

const PaymentHistoryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "payment",
      element: <PaymentHistory />,
    },
  ],
};

export default PaymentHistoryConfig;
