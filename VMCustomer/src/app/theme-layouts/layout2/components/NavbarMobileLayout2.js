import FuseScrollbars from "@fuse/core/FuseScrollbars";
import {styled} from "@mui/material/styles";
import clsx from "clsx";
import {memo} from "react";
import UserNavbarHeader from "../../shared-components/UserNavbarHeader";
import NavbarToggleButton from "../../shared-components/NavbarToggleButton";
import Logo from "../../shared-components/Logo";
import Navigation from "../../shared-components/Navigation";

const Root = styled("div")(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,

  "& ::-webkit-scrollbar-thumb": {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.24)"
        : "rgba(255, 255, 255, 0.24)"
    }`,
  },
  "& ::-webkit-scrollbar-thumb:active": {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.37)"
        : "rgba(255, 255, 255, 0.37)"
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({theme}) => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll",
}));

function NavbarMobileLayout2(props) {
  return (
    <Root
      className={clsx("flex flex-col h-full overflow-hidden", props.className)}
    >
      <Navigation layout="horizontal" />
    </Root>
  );
}

export default memo(NavbarMobileLayout2);
