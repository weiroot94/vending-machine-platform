import i18next from "i18next";
import authRoles from "../../auth/authRoles";
import en from "./i18n/en";
import de from "./i18n/de";
import ProductDetail from "./ProductDetail";

i18next.addResourceBundle("en", "ProductDetailPage", en);
i18next.addResourceBundle("de", "ProductDetailPage", de);

const ProductDetailConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "product/detail/:id",
      element: <ProductDetail />,
    },
  ],
};

export default ProductDetailConfig;
