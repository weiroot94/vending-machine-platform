import {Link} from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="logo-link">
      <h3 className="mt-2 ms-1 ">VM Admin</h3>
    </Link>
  );
}

export default Logo;
