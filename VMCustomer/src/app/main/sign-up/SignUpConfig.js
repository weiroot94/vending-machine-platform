import SignUpPage from "./SignUpPage";
import authRoles from "../../auth/authRoles";
import i18next from "i18next";
import en from "./i18n/en";
import de from "./i18n/de";

i18next.addResourceBundle("en", "SignUpPage", en);
i18next.addResourceBundle("de", "SignUpPage", de);

const SignUpConfig = {
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
      path: "sign-up",
      element: <SignUpPage />,
    },
  ],
};

export default SignUpConfig;
