import {Hidden} from "@mui/material";
import MapContent from "./MapContent";
import MapMobileContent from "./MapMobileContent";
import {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import appConfig from "app/configs/appConfig";
import axios from "axios";

function MapPage(props) {
  let [machines, setMachines] = useState([]);
  let [products, setProducts] = useState([]);
  let [isLoaded, setLoaded] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    axios
      .post(appConfig.API_SERVER + "customer/map/machine/list")
      .then((res) => {
        setMachines(res.data.machines);
        axios
          .post(appConfig.API_SERVER + "customer/product/list")
          .then((res) => {
            setProducts(res.data.data);
            setLoaded(true);
          });
      });
    return () => {};
  }, []);

  return (
    isLoaded && (
      <>
        <Hidden lgDown>
          <div className="py-20 flex flex-row justify-center">
            <MapContent Machines={machines} Product={products} Specified={state}/>
          </div>
        </Hidden>
        <Hidden lgUp>
          <div className="py-32 px-16 flex flex-row justify-center">
            <MapMobileContent Machines={machines} Product={products} Specified={state}/>
          </div>
        </Hidden>
      </>
    )
  );
}

export default MapPage;
