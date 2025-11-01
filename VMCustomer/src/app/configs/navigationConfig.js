import i18next from "i18next";
import en from "./navigation-i18n/en";
import de from "./navigation-i18n/de";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("de", "navigation", de);

const navigationConfig = [
  {
    id: "home-component",
    title: "Home",
    translate: "MENU_HOME",
    type: "item",
    icon: "heroicons-outline:home",
    url: "home",
  },
  {
    id: "product-component",
    title: "Product",
    translate: "MENU_PRODUCT",
    type: "item",
    icon: "heroicons-outline:gift",
    url: "product",
  },
  {
    id: "map-component",
    title: "Map",
    translate: "MENU_MAP",
    type: "item",
    icon: "heroicons-outline:map",
    url: "map",
  },
  {
    id: "qr-component",
    title: "QR",
    translate: "MENU_QR",
    type: "item",
    icon: "heroicons-outline:qrcode",
    url: "qrscan",
  },
  {
    id: "deposit-component",
    title: "Deposit",
    translate: "MENU_DEPOSIT",
    type: "item",
    icon: "heroicons-outline:credit-card",
    url: "deposit",
  },
  {
    id: "history-component",
    title: "History",
    translate: "MENU_HISTORY",
    type: "item",
    icon: "material-twotone:history",
    url: "payment",
  },
];

export default navigationConfig;
