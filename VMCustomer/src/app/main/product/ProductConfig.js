import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import Product from "./Product";

i18next.addResourceBundle("en", "ProductPage", en);
i18next.addResourceBundle("de", "ProductPage", de);

const ProductConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "product",
      element: <Product />,
    },
  ],
};

export default ProductConfig;
