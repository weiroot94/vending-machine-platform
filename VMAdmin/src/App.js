import Router from "./router";
import {AuthProvider} from "./provider/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AuthProvider>
        <Router />
        <ToastContainer autoClose={3000}/>
      </AuthProvider>
    </>
  );
}

export default App;
