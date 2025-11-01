import React from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t, i18n } = useTranslation("global");
  return (
    <div className="nk-footer" style={{ position: "fixed", bottom: "0px", right: "0px", width: "100%", paddingLeft: "280px", zIndex: "10" }}>
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            &copy; 2024 {t("Footer.Copyright")}
          </div>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              {t("Header.Language")}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                if (i18n.language != "en")
                  i18n.changeLanguage("en")
              }}>{t("Header.English")}</Dropdown.Item>
              <Dropdown.Item onClick={() => {
                if (i18n.language != "de")
                  i18n.changeLanguage("de");
              }}>{t("Header.German")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Footer;
