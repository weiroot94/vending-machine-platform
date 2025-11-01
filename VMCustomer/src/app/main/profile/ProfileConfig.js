import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import Profile from "./Profile";

i18next.addResourceBundle("en", "ProfilePage", en);
i18next.addResourceBundle("de", "ProfilePage", de);

const ProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: "profile",
      element: <Profile />,
    },
  ],
};

export default ProfileConfig;
