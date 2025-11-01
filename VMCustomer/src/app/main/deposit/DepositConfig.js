import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import Deposit from "./Deposit";

i18next.addResourceBundle("en", "DepositPage", en);
i18next.addResourceBundle("de", "DepositPage", de);

const DepositConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "deposit",
      element: <Deposit />,
    },
  ],
};

export default DepositConfig;
