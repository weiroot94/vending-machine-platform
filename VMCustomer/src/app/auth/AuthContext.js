import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import axios from "axios";
import {logoutUser, setUser} from "app/store/userSlice";
import appConfig from "app/configs/appConfig";

const AuthContext = React.createContext();

function AuthProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  const login = () => {
    setIsAuthenticated(true);
    setWaitAuthCheck(false);
    dispatch(setUser({
      role: ['user']
    }));
  }

  const logout = () => {
    axios.post(appConfig.API_SERVER + "auth/logout").then(res => {
      window.localStorage.setItem("customer", "");
      setIsAuthenticated(false);
      dispatch(logoutUser());
    })
  }

  const setCustomerEmail = (email) => {
    setEmail(email);
  }

  const setCustomerName = (name) => {
    setName(name);
  }

  useEffect(() => {
    const localStorage = window.localStorage.getItem("customer");

    if (localStorage) {
      const userData = JSON.parse(localStorage);
      if (userData) {
        axios.post(appConfig.API_SERVER + `auth/verify_token`,
        {
          user_token: userData.token,
        }).then(res => {
          setCustomerEmail(userData.email);
          setName(userData.name);
          setToken(userData.token);
          login();
          setWaitAuthCheck(false);
        }).catch(err => {
          setWaitAuthCheck(false);
          logout();
        });
      }
    } else {
      setWaitAuthCheck(false);
    }
  }, []);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{
      isAuthenticated, name, email, token, login, logout, setCustomerEmail, setCustomerName, setToken, setWaitAuthCheck}}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export {AuthProvider, useAuth};
