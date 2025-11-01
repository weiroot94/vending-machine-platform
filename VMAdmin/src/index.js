import React, {Suspense} from "react";
import { Image, Spinner } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import "./assets/scss/style.scss";
import reportWebVitals from "./reportWebVitals";
import { render } from "react-dom";                 // add this
import './i18n';

const App = React.lazy(() => import('./App'));
render(
  <React.StrictMode>
    <BrowserRouter basename="/admin">
      <Suspense fallback={
        <>
          <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-white" style={{backgroundColor: "#2e314a"}}>
            <Image src="/admin/images/logo/logo-new.svg" alt="Logo" className="mb-5" />
            <Spinner animation="border" variant="primary" />
          </div>
        </>
      }>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
