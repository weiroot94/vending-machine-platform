import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import {Navigate} from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import HomeConfig from "../main/home/HomeConfig";
import ProductConfig from "../main/product/ProductConfig";
import ProductDetailConfig from "../main/product-detail/ProductDetailConfig";
import MapConfig from "../main/map/MapConfig";
import DepositConfig from "../main/deposit/DepositConfig";
import QrScanConfig from "../main/qr/QrScanConfig";
import PaymentHistoryConfig from "../main/payment-history/PaymentHistoryConfig";
import VerifyConfig from "../main/verify/VerifyConfig";
import ProfileConfig from "../main/profile/ProfileConfig";
import ResetPasswordConfig from "../main/reset-password/ResetPasswordConfig";
import LoginVerifyConfig from "../main/login-verify/LoginVerifyConfig";
import UnsubscribeConfig from "../main/unsubscribe/UnsubscribeConfig";
import Error404Page from "../main/404/Error404Page";

const routeConfigs = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  HomeConfig,
  ProductConfig,
  ProductDetailConfig,
  MapConfig,
  DepositConfig,
  QrScanConfig,
  PaymentHistoryConfig,
  ProfileConfig,
  VerifyConfig,
  ResetPasswordConfig,
  LoginVerifyConfig,
  UnsubscribeConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
