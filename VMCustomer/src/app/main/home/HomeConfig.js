import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import Home from "./Home";

i18next.addResourceBundle("en", "homePage", en);
i18next.addResourceBundle("de", "homePage", de);

const HomeConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "home",
      element: <Home />,
    },
  ],
};

export default HomeConfig;
