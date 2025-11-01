import {styled} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";

const Root = styled("div")(({theme}) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  const navigate = useNavigate();
  return (
    <Root className="flex items-center">
      <img
        className="logo-icon w-200 h-80"
        src="assets/images/logo/logo-new.svg"
        alt="logo"
        onClick={() => {
          navigate("/");
        }}
      />
    </Root>
  );
}

export default Logo;
