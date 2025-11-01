import { useAuth } from "src/app/auth/AuthContext";
import {Hidden} from "@mui/material";
import QrScanContent from "./QrScanContent";
import QrScanMobileContent from "./QrScanMobileContent";

function QrScanPage(props) {
  const {token} = useAuth();
  return (
    <>
      <Hidden lgDown>
        <div className="py-20 px-32 flex flex-row justify-center">
          <QrScanContent token={token} />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 px-16 flex flex-row justify-center">
          <QrScanMobileContent token={token}/>
        </div>
      </Hidden>
    </>
  );
}

export default QrScanPage;
