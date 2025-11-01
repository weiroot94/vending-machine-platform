import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import Map from "./Map";

i18next.addResourceBundle("en", "MapPage", en);
i18next.addResourceBundle("de", "MapPage", de);

const MapConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "map",
      element: <Map />,
    },
  ],
};

export default MapConfig;
