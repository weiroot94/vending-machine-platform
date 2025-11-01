import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";

const Root = styled("div")(({theme}) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    width: "57px",
    height: "22px",
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function MobileLogo(props) {
  const isAuthenticated = {props}
  const navigate = useNavigate();
  return (
    <Root className="flex items-center">
      <img
        className={`${isAuthenticated ? "scale-125" : ""} logo-icon w-57 h-22`}
        src="assets/images/logo/logo-new.svg"
        alt="logo"
        onClick={() => {
          navigate("/");
        }}
      />
    </Root>
  );
}

export default MobileLogo;
