// AuthProvider.js
import React, {useState, useContext, useEffect} from "react";
import { Image, Spinner } from "react-bootstrap";
import { requestPost } from "../service";

const AuthContext = React.createContext();

const AuthProvider = ({children}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [needWaitForCheck, setNeedWaitForCheck] = useState(true);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
  };

  const setUserRole = (role) => {
    setRole(role);
  };

  const setUserEmail = (email) => {
    setEmail(email);
  };

  useEffect(() => {
    const usrCash = window.localStorage.getItem("vending_user");
    if (usrCash) {
      const userData = JSON.parse(usrCash);
      if (userData) {
        requestPost(
          `/auth/verify_token`,
          {
            user_token: userData.token,
          },
          function (result) {
            // result.data.message => success message
            setEmail(userData.email);
            setUserRole(userData.role);
            setToken(userData.token);
            login();
            setNeedWaitForCheck(false);
          },
          function (error) {
            console.log(error);
            setNeedWaitForCheck(false);
            logout();
          }
        );
      }
    } else {
      setNeedWaitForCheck(false);
    }    
  }, []);

  return (
    needWaitForCheck ? (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-white" style={{backgroundColor: "#2e314a"}}>
        <Image src="/admin/images/logo/logo-new.svg" alt="Logo" className="mb-5" />
        <Spinner animation="border" variant="primary" />
      </div>
    ) :
    <AuthContext.Provider
      value={{
        authenticated,
        role,
        email,
        token,
        login,
        logout,
        setUserRole,
        setUserEmail,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export {AuthProvider, useAuth};
