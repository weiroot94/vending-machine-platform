import FuseScrollbars from "@fuse/core/FuseScrollbars";
import {styled} from "@mui/material/styles";
import clsx from "clsx";
import {memo} from "react";
import Navigation from "../../shared-components/Navigation";

const Root = styled("div")(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

function NavbarLayout2(props) {
  const StyledActiveBottomContainier = styled("div")(`
    width: 100%;
    height: 19px;
    background: #E2F9FF;
  `);

  return (
    <Root
      className={clsx(
        "w-full h-82 min-h-82 max-h-82 shadow-md",
        props.className
      )}
    >
      <div className="flex flex-column justify-between items-center w-full h-full p-0 lg:px-24 z-20">
        <Navigation className="w-full" layout="horizontal" />
      </div>
      <StyledActiveBottomContainier />
    </Root>
  );
}

export default memo(NavbarLayout2);
