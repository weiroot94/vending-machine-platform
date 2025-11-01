import classNames from "classnames";
import { Dropdown, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAuth } from "../../../provider/AuthProvider";
import {
  Icon,
  MediaGroup,
  MediaText,
  CustomDropdownToggle,
} from "../../../components";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import ToggleSidebar from "../Toggle/Sidebar";
import { useLayout, useLayoutUpdate } from "./../LayoutProvider";
import { requestTokenPost } from "../../../service";
import { useTranslation } from "react-i18next";

function QuickNav({ className, ...props }) {
  const compClass = classNames({
    "nk-quick-nav": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function QuickNavItem({ className, ...props }) {
  const compClass = classNames({
    "d-inline-flex": true,
    [className]: className,
  });
  return <li className={compClass}>{props.children}</li>;
}

function Header() {
  const { logout, email, role } = useAuth();
  const layout = useLayout();
  const layoutUpdate = useLayoutUpdate();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");

  const compClass = classNames({
    "nk-header nk-header-fixed": true,
    [`is-${layout.headerVariant}`]: layout.headerVariant,
  });

  const navClass = classNames({
    "nk-header-menu nk-navbar": true,
    "navbar-active": layout.headerActive,
    // eslint-disable-next-line
    "navbar-mobile":
      layout.headerTransition ||
      eval(`layout.breaks.${layout.headerCollapse}`) > window.innerWidth,
  });

  const userLogOut = () => {
    requestTokenPost(
      "/auth/logout",
      { email: email },
      function (result) {
        if (result.data.status === "success") {
          window.localStorage.setItem("vending_user", "");
          navigate("/");
          logout();
        }
      },
      function (error) {
        console.log(error);
      }
    );
  };

  return (
    <>
      <div className={compClass}>
        <div className="container-fluid">
          <div className="nk-header-wrap">
            <div className="nk-header-logo">
              <ToggleSidebar className="me-5" variant="zoom" icon="menu" />
            </div>
            {layout.headerActive && (
              <div
                className="navbar-overlay"
                onClick={layoutUpdate.headerMobile}
              ></div>
            )}
            <nav className={navClass}>
              <Menu />
            </nav>
            <div className="nk-header-tools">
              <QuickNav>
                <Dropdown as={QuickNavItem}>
                  <Dropdown.Toggle bsPrefix as={CustomDropdownToggle}>
                    <div className="d-sm-flex">
                      <MediaGroup>
                        <MediaText>
                          <div className="lead-text">{email}</div>
                          <span className="sub-text">{role}</span>
                        </MediaText>
                      </MediaGroup>
                      <OverlayTrigger
                        delay={{ hide: 450, show: 300 }}
                        overlay={(props) => (
                          <Tooltip {...props}>
                            {t("Header.LogOut")}
                          </Tooltip>
                        )}
                        placement="bottom"
                      >
                        <Button
                          size="sm"
                          variant="info"
                          className="ms-2 rounded-pill"
                          onClick={() => {
                            userLogOut();
                          }}
                        >
                          <Icon name="signout"></Icon>
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </Dropdown.Toggle>
                </Dropdown>
              </QuickNav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

