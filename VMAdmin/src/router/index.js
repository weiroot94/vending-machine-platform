import React, {useEffect} from "react";
import {Routes, Route} from "react-router-dom";
import {ScrollToTop} from "../components";
import {useAuth} from "../provider/AuthProvider";

//Pages
import Blank from "../pages/Blank";
import Home from "../pages/Home";
import HomeEcommerce from "../pages/HomeEcommerce";
import Overview from "../pages/Overview";
import HomeProject from "../pages/HomeProject";
import HomeMarketing from "../pages/HomeMarketing";
import HomeNFT from "../pages/HomeNFT";

// auths pages
import AuthRegister from "../pages/auths/AuthRegister";
import AuthLogin from "../pages/auths/AuthLogin";
import AuthReset from "../pages/auths/AuthReset";

import NotFound from "../pages/error/NotFound";
import IconsPreview from "../pages/IconsPreview";

/************************************************************/

// Vending - Users
import VMUserList from "../pages/vm-user/UserList";
import VMUserEdit from "../pages/vm-user/UserEdit";
import VMUserAdd from "../pages/vm-user/UserAdd";

// Vending - Subscriptions
import SubscriptionList from "../pages/vm-subscription/SubscriptionList";
import SubscriptionEdit from "../pages/vm-subscription/SubscriptionEdit";
import SubscriptionAdd from "../pages/vm-subscription/SubscriptionAdd";

// Vending - Types
import VMTypeList from "../pages/vm-type/TypeList";
import VMTypeEdit from "../pages/vm-type/TypeEdit";
import VMTypeAdd from "../pages/vm-type/TypeAdd";

// Vending - Infos
import VMInfoList from "../pages/vm-info/InfoList";
import VMInfoEdit from "../pages/vm-info/InfoEdit";
import VMInfoAdd from "../pages/vm-info/InfoAdd";

// Vending - Advertisements
import VMAdvertisementList from "../pages/vm-ads/AdvertisementList";
import VMAdvertisementEdit from "../pages/vm-ads/AdvertisementEdit";
import VMAdvertisementAdd from "../pages/vm-ads/AdvertisementAdd";

// Vending - Machines
import VMMachineList from "../pages/vm-machine/MachineList";
import VMMachineEdit from "../pages/vm-machine/MachineEdit";
import VMMachineAdd from "../pages/vm-machine/MachineAdd";

// Vending - Audit Logs
import VMAuditList from "../pages/vm-audit/AuditList";

// Vending - Language
import VMLanguageList from "../pages/vm-language/LanguageList";
import VMLanguageAdd from "../pages/vm-language/LanguageAdd";
import VMLanguageEdit from "../pages/vm-language/LanguageEdit";

// Vending - Update
import VMUpdateList from "../pages/vm-update/UpdateList";
import VMUpdateAdd from "../pages/vm-update/UpdateAdd";
import VMUpdateEdit from "../pages/vm-update/UpdateEdit";

// Vending - Sales
import VMSales from "../pages/vm-sales/VMSales";
import VMAnalytics from "../pages/vm-analytics/Analytics";

function Router() {
  const {authenticated, role} = useAuth();

  return (
    <ScrollToTop>
      {authenticated == true ? (
        <Routes>
          {role && role == "administrator" && (
            <Route path="/vm-user">
              <Route path="list" element={<VMUserList />} />
              <Route path="add/:roletype" element={<VMUserAdd />} />
              <Route path="edit/:id" element={<VMUserEdit />} />
            </Route>
          )}
          {role && role == "administrator" && (
            <Route path="/vm-subscription">
              <Route path="list" element={<SubscriptionList />} />
              <Route path="add" element={<SubscriptionAdd />} />
              <Route path="edit/:id" element={<SubscriptionEdit />} />
            </Route>
          )}
          {role && (role == "administrator" || role == "agent") && (
            <Route path="/vm-info">
              <Route path="list" element={<VMInfoList />} />
              <Route path="add" element={<VMInfoAdd />} />
              <Route path="edit/:id" element={<VMInfoEdit />} />
            </Route>
          )}
          {role && (role == "administrator" || role == "agent") && (
            <Route path="/vm-product">
              <Route path="list" element={<VMTypeList />} />
              <Route path="add" element={<VMTypeAdd />} />
              <Route path="edit/:id" element={<VMTypeEdit />} />
            </Route>
          )}
          {role &&
            (role == "administrator" || role == "agent" || role == "ads") && (
              <Route path="/vm-machine">
                <Route path="list" element={<VMMachineList />} />
                <Route path="add" element={<VMMachineAdd />} />
                <Route path="edit/:id" element={<VMMachineEdit />} />
              </Route>
            )}
          {role && (role == "administrator" || role == "ads") && (
            <Route path="/vm-ads">
              <Route path="list" element={<VMAdvertisementList />} />
              <Route path="add" element={<VMAdvertisementAdd />} />
              <Route path="edit/:id" element={<VMAdvertisementEdit />} />
            </Route>
          )}
          {role && role == "administrator" && (
            <Route path="/vm-audit/list" element={<VMAuditList />} />
          )}
          {role && role == "administrator" && (
            <Route path="/vm-sales" element={<VMSales />} />
          )}
          {role && role == "administrator" && (
            <Route path="/vm-analytics" element={<VMAnalytics />} />
          )}
          {role && role == "administrator" && (
            <Route path="/vm-language">
              <Route path="list" element={<VMLanguageList />} />
              <Route path="add/:langtype" element={<VMLanguageAdd />} />
              <Route path="edit/:id" element={<VMLanguageEdit />} />
            </Route>
          )}
          {role && role == "administrator" && (
            <Route path="/vm-update">
              <Route path="list" element={<VMUpdateList />} />
              <Route path="add" element={<VMUpdateAdd />} />
              <Route path="edit/:id" element={<VMUpdateEdit />} />
            </Route>
          )}

          <Route path="blank" element={<Blank />} />
          <Route path="/" element={<HomeEcommerce />} />
          <Route path="/home" element={<HomeEcommerce />} />
          <Route path="/home-ecommerce" element={<HomeEcommerce />} />
          <Route path="/overview" element={<Overview />} />

          <Route path="/auths">
            <Route path="auth-register" element={<AuthRegister />} />
            <Route path="auth-login" element={<AuthLogin />} />
            <Route path="auth-reset" element={<AuthReset />} />
          </Route>

          <Route path="/icons" element={<IconsPreview />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<AuthLogin />} />
          <Route path="/" element={<AuthLogin />} />
        </Routes>
      )}
    </ScrollToTop>
  );
}

export default Router;
