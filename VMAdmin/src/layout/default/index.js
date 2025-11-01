import React, {useLayoutEffect} from "react";

import AppRoot from "../global/AppRoot";
import AppMain from "../global/AppMain";
import AppWrap from "../global/AppWrap";
import AppContent from "../global/AppContent";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import LayoutProvider from "./LayoutProvider";

function Default({title, content, ...props}) {
  useLayoutEffect(() => {
    document.title = `${title} - Vending Machine`;
  });

  return (
    <LayoutProvider>
      <AppRoot>
        <AppMain>
          <Sidebar />
          <AppWrap>
            <Header />
            <AppContent content={content}>{props.children}</AppContent>
          </AppWrap>
        </AppMain>
        <Footer />
      </AppRoot>
    </LayoutProvider>
  );
}

export default Default;
