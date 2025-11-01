import { styled } from "@mui/material/styles";
import { Hidden } from "@mui/material";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Logo from "app/theme-layouts/shared-components/Logo";
import { useAuth } from "src/app/auth/AuthContext";
import MobileLogo from "app/theme-layouts/shared-components/MobileLogo";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StyledList = styled("div")(({ theme }) => ({
  "& .fuse-list-item": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0,0,0,.04)",
    },
    "&:focus:not(.active)": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(0,0,0,.05)",
    },
    padding: "8px 12px 8px 12px",
    height: 40,
    minHeight: 40,
    "&.level-0": {
      minHeight: 44,
      minminHeight: 44,
    },
    "& .fuse-list-item-text": {
      padding: "0 0 0 8px",
    },
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  "&.active-square-list": {
    "& .fuse-list-item": {
      borderRadius: "0",
    },
  },
  "&.menu-gap": {
    gap: "150px",
  },
}));

const StyledMenuItem = styled(motion.button)(({ theme }) => ({
  "&.custom-header-menu-item": {
    position: "relative",
    display: "flex",
    height: "82px",
    width: "90px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "25px",
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: "normal",
    letterSpacing: "-1px",
    cursor: "pointer",
  },
}));

const StyledLogo = styled(motion.button)(({ theme }) => ({
  "&.custom-header-menu-item": {
    display: "flex",
    height: "82px",
    width: "90px",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
}));

const hoverAnimation = {
  scale: 1.12,
  transition: { duration: 0.3 }
};

const hoverLogoAnimation = {
  scale: 1.1,
  transition: { duration: 0.3 }
};

const tapAnimation = {
  scale: 1.05
};

const StyledMobileMenuItem = styled(motion.button)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  span: {
    // position: "absolute",
    // top: "35px",
    color: "#000",
    textAlign: "center",
    fontFamily: "Museo Sans",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "normal",
    letterSpacing: "-0.4px",
  }
}));

const hoverMobileAnimation = {
  scale: 1.2,
  transition: { duration: 0.3 }
};

const tapMobileAnimation = {
  scale: 1.1,
  transition: { duration: 0.3 }
};

const StyledLoginButton = styled(motion.button)(({ theme }) => ({
  padding: "15px",
  height: "55px",
  borderRadius: "12.603px",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  background: "#1B1919",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "30.247px",
  fontStyle: "italic",
  letterSpacing: "-1.21px",
  justifyContent: "center",
  cursor: "pointer",
}));

const hoverLoginAnimation = {
  backgroundColor: "#341D52",
  transition: { duration: 0.2 }
};

const StyledLoginMobileButton = styled(motion.button)(({ theme }) => ({
  padding: "10px",
  height: "20px",
  borderRadius: "4.603px",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  background: "#1B1919",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "10.247px",
  fontStyle: "italic",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "-0.21px",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledActiveBottomBar = styled("div")(`
  width: 52px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #1D2D35;
  position: absolute;
  top: 95px;
  z-index: 99;
`);

const StyledMobileActiveBottomBar = styled("div")(`
  width: 25px;
  height: 4px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #1D2D35;
  position: absolute;
  bottom: -10px;
  z-index: 99;
`);

const StyledProfileButton = styled("div")(`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  .username {
    display: flex;
    align-items: flex-start;
    gap: 10.447px;
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 22.983px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    justify-content: center;
    align-items: center;
  }
`);

const StyledMobileProfileButton = styled("div")(`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  cursor: pointer;

  .username {
    display: flex;
    align-items: flex-start;
    gap: 3.447px;
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 10.983px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.919px;
    justify-content: center;
    align-items: center;
  }
`);

const ProfileMenu = styled("div")(`
  position: absolute;
  top: 83px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #E2F9FF;
  box-shadow: 0px 6px 11px 2px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  z-index: 100;

  .profile-item {
    width: 200px;
    height: 53px;
    flex-shrink: 0;
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 22.983px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.596px;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    &:hover {
      background: #a2bbc1;
    }

    &:first-child:hover {
      border-radius: 10px 10px 0 0;
    }

    &:last-child:hover {
      border-radius: 0 0 10px 10px;
    }
  }
`);

const MobileProfileMenu = styled("div")(`
  position: absolute;
  top: 55px;
  right: 0px;
  display: flex;
  background: #E2F9FF;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  z-index: 100;

  .profile-item {
    width: 120px;
    height: 20px;
    flex-shrink: 0;
    color: #000;
    text-align: center;
    font-family: Museo Sans;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.596px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: #a2bbc1;
    }

    &:first-child:hover {
      border-radius: 3px 3px 0 0;
    }

    &:last-child:hover {
      border-radius: 0 0 3px 3px;
    }
  }
`);

function FuseNavHorizontalLayout1(props) {
  const { navigation, layout, active, dense, className, onItemClick } = props;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, name, logout } = useAuth();
  const [isProfileBtnClicked, setProfileBtnClicked] = useState(false);
  const {t} = useTranslation("navigation");
  const onClickProfileBtn = () => {
    setProfileBtnClicked(!isProfileBtnClicked);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // If the click is outside the dropdown, close the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileBtnClicked(false);
      }
    }

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <StyledList
      className={clsx(
        "navigation whitespace-nowrap flex p-0 flex flex-auto justify-between items-center",
        `active-${active}-list`,
        dense && "dense",
        className
      )}
    >
      <Hidden lgDown>
        <StyledLogo
          whileHover={hoverLogoAnimation}
          whileTap={tapAnimation}
        >
          <Logo />
        </StyledLogo>
        {navigation.map((_item) => (
          <StyledMenuItem
            key={_item.id}
            className={clsx("custom-header-menu-item")}
            whileHover={hoverAnimation}
            whileTap={tapAnimation}
            onClick={() => navigate(_item.url)}
          >
            <FuseSvgIcon className="text-57" size={57} style={{ color: "black" }}>
              {_item.icon}
            </FuseSvgIcon>
            {t(_item.translate)}
            {(_item.url === location.pathname.slice(1) ||
              (_item.url === 'product' && location.pathname.includes('product/detail'))) &&
              <StyledActiveBottomBar />}
          </StyledMenuItem>
        ))}
        {!isAuthenticated ? (
          <StyledLoginButton
            whileHover={hoverLoginAnimation}
            whileTap={tapAnimation}
            onClick={() => {
              navigate("/sign-in");
            }}
          >
            {t("LOGIN_REGISTER")} {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="36"
              viewBox="0 0 35 36"
              fill="none"
            >
              <g clipPath="url(#clip0_1399_12858)">
                <path
                  d="M30.625 9.25H29.1666V7.79167C29.1666 7.4049 29.013 7.03396 28.7395 6.76047C28.466 6.48698 28.0951 6.33334 27.7083 6.33334C27.3215 6.33334 26.9506 6.48698 26.6771 6.76047C26.4036 7.03396 26.25 7.4049 26.25 7.79167V9.25H24.7916C24.4049 9.25 24.0339 9.40365 23.7604 9.67714C23.487 9.95063 23.3333 10.3216 23.3333 10.7083C23.3333 11.0951 23.487 11.466 23.7604 11.7395C24.0339 12.013 24.4049 12.1667 24.7916 12.1667H26.25V13.625C26.25 14.0118 26.4036 14.3827 26.6771 14.6562C26.9506 14.9297 27.3215 15.0833 27.7083 15.0833C28.0951 15.0833 28.466 14.9297 28.7395 14.6562C29.013 14.3827 29.1666 14.0118 29.1666 13.625V12.1667H30.625C31.0118 12.1667 31.3827 12.013 31.6562 11.7395C31.9297 11.466 32.0833 11.0951 32.0833 10.7083C32.0833 10.3216 31.9297 9.95063 31.6562 9.67714C31.3827 9.40365 31.0118 9.25 30.625 9.25Z"
                  fill="white"
                />
                <path
                  d="M14.5833 16.5417C15.7371 16.5417 16.8649 16.1996 17.8242 15.5586C18.7834 14.9176 19.5311 14.0066 19.9726 12.9407C20.4141 11.8748 20.5297 10.7019 20.3046 9.57031C20.0795 8.43875 19.5239 7.39935 18.7081 6.58355C17.8923 5.76774 16.8529 5.21217 15.7214 4.98709C14.5898 4.76201 13.4169 4.87753 12.351 5.31904C11.2851 5.76055 10.3741 6.50822 9.73309 7.46751C9.09212 8.4268 8.75 9.55461 8.75 10.7083C8.75 12.2554 9.36458 13.7392 10.4585 14.8331C11.5525 15.9271 13.0362 16.5417 14.5833 16.5417ZM14.5833 7.79167C15.1602 7.79167 15.7241 7.96273 16.2037 8.28322C16.6834 8.6037 17.0572 9.05922 17.278 9.59218C17.4987 10.1251 17.5565 10.7116 17.444 11.2773C17.3314 11.8431 17.0536 12.3628 16.6457 12.7707C16.2378 13.1786 15.7181 13.4564 15.1523 13.569C14.5866 13.6815 14.0001 13.6237 13.4672 13.403C12.9342 13.1822 12.4787 12.8084 12.1582 12.3287C11.8377 11.8491 11.6667 11.2852 11.6667 10.7083C11.6667 9.93479 11.974 9.19292 12.5209 8.64594C13.0679 8.09896 13.8098 7.79167 14.5833 7.79167Z"
                  fill="white"
                />
                <path
                  d="M14.5833 19.4583C11.8759 19.4583 9.27939 20.5339 7.36495 22.4483C5.45052 24.3627 4.375 26.9593 4.375 29.6667C4.375 30.0534 4.52865 30.4244 4.80214 30.6979C5.07563 30.9714 5.44656 31.125 5.83333 31.125C6.22011 31.125 6.59104 30.9714 6.86453 30.6979C7.13802 30.4244 7.29167 30.0534 7.29167 29.6667C7.29167 27.7328 8.05989 25.8781 9.42735 24.5107C10.7948 23.1432 12.6495 22.375 14.5833 22.375C16.5172 22.375 18.3719 23.1432 19.7393 24.5107C21.1068 25.8781 21.875 27.7328 21.875 29.6667C21.875 30.0534 22.0286 30.4244 22.3021 30.6979C22.5756 30.9714 22.9466 31.125 23.3333 31.125C23.7201 31.125 24.091 30.9714 24.3645 30.6979C24.638 30.4244 24.7917 30.0534 24.7917 29.6667C24.7917 26.9593 23.7161 24.3627 21.8017 22.4483C19.8873 20.5339 17.2908 19.4583 14.5833 19.4583Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1399_12858">
                  <rect
                    width="35"
                    height="35"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </StyledLoginButton>
        ) : (
          <div className="relative">
            <StyledProfileButton onClick={onClickProfileBtn}>
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M22.054 4.41079C18.9681 4.41022 15.936 5.21904 13.2604 6.75651C10.5848 8.29398 8.35928 10.5063 6.80591 13.1727C5.25253 15.8391 4.42568 18.8663 4.40787 21.9521C4.39006 25.038 5.18193 28.0745 6.70442 30.7586C7.73348 29.4212 9.05632 28.3384 10.5707 27.5939C12.085 26.8493 13.7503 26.463 15.4378 26.4647H28.6701C30.3576 26.463 32.0229 26.8493 33.5373 27.5939C35.0516 28.3384 36.3744 29.4212 37.4035 30.7586C38.926 28.0745 39.7179 25.038 39.7001 21.9521C39.6823 18.8663 38.8554 15.8391 37.302 13.1727C35.7487 10.5063 33.5231 8.29398 30.8475 6.75651C28.1719 5.21904 25.1398 4.41022 22.054 4.41079ZM39.5714 35.4539C42.5201 31.6098 44.115 26.8987 44.1079 22.0539C44.1079 9.87355 34.2344 0 22.054 0C9.87357 0 2.48178e-05 9.87355 2.48178e-05 22.0539C-0.00725615 26.8987 1.5877 31.6099 4.53652 35.4539L4.52549 35.4936L5.30841 36.4044C7.37681 38.8227 9.94499 40.7637 12.8359 42.0936C15.7269 43.4235 18.8718 44.1107 22.054 44.1079C26.525 44.1161 30.8919 42.758 34.5696 40.2154C36.1375 39.1321 37.5592 37.8512 38.7995 36.4044L39.5824 35.4936L39.5714 35.4539ZM22.054 8.82158C20.2992 8.82158 18.6164 9.51864 17.3756 10.7594C16.1348 12.0002 15.4378 13.683 15.4378 15.4378C15.4378 17.1925 16.1348 18.8753 17.3756 20.1161C18.6164 21.3569 20.2992 22.0539 22.054 22.0539C23.8087 22.0539 25.4915 21.3569 26.7323 20.1161C27.9731 18.8753 28.6701 17.1925 28.6701 15.4378C28.6701 13.683 27.9731 12.0002 26.7323 10.7594C25.4915 9.51864 23.8087 8.82158 22.054 8.82158Z" fill="black" />
              </svg>

              <div className="username">
                {name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="16"
                  viewBox="0 0 19 16"
                  fill="none"
                >
                  <path
                    d="M9.4211 15.8935L0.373936 0.223381L18.4683 0.223381L9.4211 15.8935Z"
                    fill="black"
                  />
                </svg>
              </div>
            </StyledProfileButton>
            {isProfileBtnClicked && (
              <ProfileMenu ref={dropdownRef}>
                <div
                  className="profile-item"
                  onClick={() => {
                    setProfileBtnClicked(false);
                    navigate("/profile");
                  }}
                >
                  {t("ACCOUNT_SETTINGS")}
                </div>
                <div
                  className="profile-item"
                  onClick={() => {
                    logout();
                  }}
                >
                  <span style={{ color: "red" }}>{t("LOGOUT")}</span>
                </div>
              </ProfileMenu>
            )}
          </div>
        )}
      </Hidden>
      <Hidden lgUp>
        <div className="flex flex-col justify-center items-center w-full px-8">
          <div className="flex flex-row justify-between items-center w-full">
            <StyledMobileMenuItem
              className={`${isAuthenticated ? "m-auto" : ""}`}
              whileHover={hoverAnimation}
              whileTap={tapAnimation}
            >
              <MobileLogo isAuthenticated={isAuthenticated}/>
            </StyledMobileMenuItem>

            {!isAuthenticated && (
              <StyledLoginMobileButton
                whileHover={hoverLoginAnimation}
                whileTap={tapAnimation}
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                {" "}
                {t("LOGIN_REGISTER")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="36"
                  viewBox="0 0 35 36"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1399_12858)">
                    <path
                      d="M30.625 9.25H29.1666V7.79167C29.1666 7.4049 29.013 7.03396 28.7395 6.76047C28.466 6.48698 28.0951 6.33334 27.7083 6.33334C27.3215 6.33334 26.9506 6.48698 26.6771 6.76047C26.4036 7.03396 26.25 7.4049 26.25 7.79167V9.25H24.7916C24.4049 9.25 24.0339 9.40365 23.7604 9.67714C23.487 9.95063 23.3333 10.3216 23.3333 10.7083C23.3333 11.0951 23.487 11.466 23.7604 11.7395C24.0339 12.013 24.4049 12.1667 24.7916 12.1667H26.25V13.625C26.25 14.0118 26.4036 14.3827 26.6771 14.6562C26.9506 14.9297 27.3215 15.0833 27.7083 15.0833C28.0951 15.0833 28.466 14.9297 28.7395 14.6562C29.013 14.3827 29.1666 14.0118 29.1666 13.625V12.1667H30.625C31.0118 12.1667 31.3827 12.013 31.6562 11.7395C31.9297 11.466 32.0833 11.0951 32.0833 10.7083C32.0833 10.3216 31.9297 9.95063 31.6562 9.67714C31.3827 9.40365 31.0118 9.25 30.625 9.25Z"
                      fill="white"
                    />
                    <path
                      d="M14.5833 16.5417C15.7371 16.5417 16.8649 16.1996 17.8242 15.5586C18.7834 14.9176 19.5311 14.0066 19.9726 12.9407C20.4141 11.8748 20.5297 10.7019 20.3046 9.57031C20.0795 8.43875 19.5239 7.39935 18.7081 6.58355C17.8923 5.76774 16.8529 5.21217 15.7214 4.98709C14.5898 4.76201 13.4169 4.87753 12.351 5.31904C11.2851 5.76055 10.3741 6.50822 9.73309 7.46751C9.09212 8.4268 8.75 9.55461 8.75 10.7083C8.75 12.2554 9.36458 13.7392 10.4585 14.8331C11.5525 15.9271 13.0362 16.5417 14.5833 16.5417ZM14.5833 7.79167C15.1602 7.79167 15.7241 7.96273 16.2037 8.28322C16.6834 8.6037 17.0572 9.05922 17.278 9.59218C17.4987 10.1251 17.5565 10.7116 17.444 11.2773C17.3314 11.8431 17.0536 12.3628 16.6457 12.7707C16.2378 13.1786 15.7181 13.4564 15.1523 13.569C14.5866 13.6815 14.0001 13.6237 13.4672 13.403C12.9342 13.1822 12.4787 12.8084 12.1582 12.3287C11.8377 11.8491 11.6667 11.2852 11.6667 10.7083C11.6667 9.93479 11.974 9.19292 12.5209 8.64594C13.0679 8.09896 13.8098 7.79167 14.5833 7.79167Z"
                      fill="white"
                    />
                    <path
                      d="M14.5833 19.4583C11.8759 19.4583 9.27939 20.5339 7.36495 22.4483C5.45052 24.3627 4.375 26.9593 4.375 29.6667C4.375 30.0534 4.52865 30.4244 4.80214 30.6979C5.07563 30.9714 5.44656 31.125 5.83333 31.125C6.22011 31.125 6.59104 30.9714 6.86453 30.6979C7.13802 30.4244 7.29167 30.0534 7.29167 29.6667C7.29167 27.7328 8.05989 25.8781 9.42735 24.5107C10.7948 23.1432 12.6495 22.375 14.5833 22.375C16.5172 22.375 18.3719 23.1432 19.7393 24.5107C21.1068 25.8781 21.875 27.7328 21.875 29.6667C21.875 30.0534 22.0286 30.4244 22.3021 30.6979C22.5756 30.9714 22.9466 31.125 23.3333 31.125C23.7201 31.125 24.091 30.9714 24.3645 30.6979C24.638 30.4244 24.7917 30.0534 24.7917 29.6667C24.7917 26.9593 23.7161 24.3627 21.8017 22.4483C19.8873 20.5339 17.2908 19.4583 14.5833 19.4583Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1399_12858">
                      <rect
                        width="35"
                        height="35"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </StyledLoginMobileButton>
            )}
          </div>
          <div
            className="flex flex-row items-center w-full mt-3"
            style={{ justifyContent: "space-around", marginTop: "15px" }}
          >
            {navigation.map((_item) => (
              <StyledMobileMenuItem
                whileHover={hoverMobileAnimation}
                whileTap={tapMobileAnimation}
                key={_item.id}
                onClick={() => {
                  if (_item.id === "qr-component" || _item.id === "deposit-component" || _item.id === "history-component") {
                    if (isAuthenticated) {
                      navigate(_item.url);
                    } else {
                      navigate("/sign-in");
                    }
                  } else {
                    navigate(_item.url);
                  }
                }}
              >
                <FuseSvgIcon
                  className="text-25"
                  size={25}
                  style={{ color: "black" }}
                >
                  {_item.icon}
                </FuseSvgIcon>
                <span>{t(_item.translate)}</span>
                {_item.url === location.pathname.slice(1) && (
                  <StyledMobileActiveBottomBar />
                )}
              </StyledMobileMenuItem>
            ))}
            {isAuthenticated && (
              <div className="flex flex-col justify-center items-end relative">
                <StyledMobileProfileButton onClick={onClickProfileBtn}>
                  <svg width="25" height="25" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M22.054 4.41079C18.9681 4.41022 15.936 5.21904 13.2604 6.75651C10.5848 8.29398 8.35928 10.5063 6.80591 13.1727C5.25253 15.8391 4.42568 18.8663 4.40787 21.9521C4.39006 25.038 5.18193 28.0745 6.70442 30.7586C7.73348 29.4212 9.05632 28.3384 10.5707 27.5939C12.085 26.8493 13.7503 26.463 15.4378 26.4647H28.6701C30.3576 26.463 32.0229 26.8493 33.5373 27.5939C35.0516 28.3384 36.3744 29.4212 37.4035 30.7586C38.926 28.0745 39.7179 25.038 39.7001 21.9521C39.6823 18.8663 38.8554 15.8391 37.302 13.1727C35.7487 10.5063 33.5231 8.29398 30.8475 6.75651C28.1719 5.21904 25.1398 4.41022 22.054 4.41079ZM39.5714 35.4539C42.5201 31.6098 44.115 26.8987 44.1079 22.0539C44.1079 9.87355 34.2344 0 22.054 0C9.87357 0 2.48178e-05 9.87355 2.48178e-05 22.0539C-0.00725615 26.8987 1.5877 31.6099 4.53652 35.4539L4.52549 35.4936L5.30841 36.4044C7.37681 38.8227 9.94499 40.7637 12.8359 42.0936C15.7269 43.4235 18.8718 44.1107 22.054 44.1079C26.525 44.1161 30.8919 42.758 34.5696 40.2154C36.1375 39.1321 37.5592 37.8512 38.7995 36.4044L39.5824 35.4936L39.5714 35.4539ZM22.054 8.82158C20.2992 8.82158 18.6164 9.51864 17.3756 10.7594C16.1348 12.0002 15.4378 13.683 15.4378 15.4378C15.4378 17.1925 16.1348 18.8753 17.3756 20.1161C18.6164 21.3569 20.2992 22.0539 22.054 22.0539C23.8087 22.0539 25.4915 21.3569 26.7323 20.1161C27.9731 18.8753 28.6701 17.1925 28.6701 15.4378C28.6701 13.683 27.9731 12.0002 26.7323 10.7594C25.4915 9.51864 23.8087 8.82158 22.054 8.82158Z" fill="black" />
                  </svg>
                  <div className="username">
                    Profile
                  </div>
                </StyledMobileProfileButton>
                {isProfileBtnClicked && (
                  <MobileProfileMenu ref={dropdownRef}>
                    <div
                      className="profile-item"
                      onClick={() => {
                        setProfileBtnClicked(false);
                        navigate("/profile");
                      }}
                    >
                      {t("ACCOUNT_SETTINGS")}
                    </div>
                    <div
                      className="profile-item"
                      onClick={() => {
                        logout();
                      }}
                    >
                      <span style={{ color: "red" }}>{t("LOGOUT")}</span>
                    </div>
                  </MobileProfileMenu>
                )}
              </div>
            )}
          </div>
        </div>
      </Hidden>
    </StyledList>
  );
}

export default FuseNavHorizontalLayout1;
