import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import appConfig from "app/configs/appConfig";
import MarkerContainer from "./MarkerContainer";

const MapComponent = (({ machines }) => {
  const position = {
    lat: 52.512772141670325,
    lng: 13.406185921060313,
  };
 
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  const onApiLoaded = ({ map, maps }) => {
    setMap(map);
    setMaps(maps);
  }
  return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: appConfig.GOOGLE_MAP_API_KEY }}
        defaultCenter={position}
        defaultZoom={12}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={onApiLoaded}
      >
        {map && maps && <MarkerContainer map={map} maps={maps} machines={machines} />}
      </GoogleMapReact>
  )
});

export default MapComponent;