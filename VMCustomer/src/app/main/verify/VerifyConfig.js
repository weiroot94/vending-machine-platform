import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import tr from "./i18n/de";
import VerifyPage from "./VerifyPage";

i18next.addResourceBundle("en", "ProductPage", en);
i18next.addResourceBundle("tr", "ProductPage", tr);

const VerifyConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: true,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "verify/:token",
      element: <VerifyPage />,
    },
  ],
};

export default VerifyConfig;
