import SignOutPage from './SignOutPage';
import i18next from "i18next";
import en from "./i18n/en";
import de from "./i18n/de";

i18next.addResourceBundle("en", "SignOutPage", en);
i18next.addResourceBundle("de", "SignOutPage", de);

const SignOutConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
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
  auth: null,
  routes: [
    {
      path: 'sign-out',
      element: <SignOutPage />,
    },
  ],
};

export default SignOutConfig;
