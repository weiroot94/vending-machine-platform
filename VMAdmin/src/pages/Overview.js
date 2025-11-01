import {useState, useEffect, useRef} from "react";
import {toast} from "react-toastify";

import Layout from "../layout/default";
import GoogleMapReact from "google-map-react";

import {requestTokenPost} from "../service";
import {config} from "../config";

import { useTranslation } from "react-i18next";
import { useAuth } from "../provider/AuthProvider";

function Overview() {
  const [position, setPosition] = useState({
    lat: 52.512772141670325,
    lng: 13.406185921060313,
  });

  let [areas, setAreas] = useState([]);
  let [locations, setLocations] = useState([]);
  let [users, setUsers] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const markerRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [markerTooltipContent, setMarkerTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0});
  const [areaRole, setAreaRole] = useState("");
  const [isMarkerOn, setMarkerOn] = useState(false);
  const { t } = useTranslation("global");
  const { role } = useAuth();
  const googleMapApiKey = config.googleMapApiKey;

  const isPointInArea = (point, region) => {
    const x = point.lng;
    const y = point.lat;

    let inside = false;
    for (let i = 0, j = region.length - 1; i < region.length; j = i++) {
      const xi = region[i].lng;
      const yi = region[i].lat;
      const xj = region[j].lng;
      const yj = region[j].lat;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  useEffect(() => {
    requestTokenPost(
      "/api/overview",
      {},
      function (res) {
        if (res.data.status == "success") {
          let area_detail = res.data.area ? res.data.area : [];
          let location_detail = res.data.location ? res.data.location : [];
          let user_detail = res.data.users ? res.data.users : [];
          setAreas(area_detail);
          setUsers(user_detail);
          setLocations(location_detail);
          setIsRender(true);
        }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_Get_Overview")}`);
      }
    );
  }, []);

  const injectTooltip = (event, data, role) => {
    if (event) {
      setAreaRole(role);
      setTooltipContent(data);
      setTooltipPosition({
        top: event.domEvent.clientY + 20,
        left: event.domEvent.clientX + 20,
      });
    }
  };

  function moveTooltip(event) {
    if (event) {
      setTooltipPosition({
        top: event.domEvent.clientY + 20,
        left: event.domEvent.clientX + 20,
      });
    }
  }

  function deleteTooltip(event) {
    setTooltipContent("");
  }

  const handleApiLoaded = (map, maps) => {
    areas.map((area, index) => {
      if (role !== "administrator" && role !== users[index].role )
        return 0;
      let color = "#FF0000";

      if (users[index].role == "ads") {
        color = "#6765e1";
      }

      let editablePolygon = new maps.Polygon({
        paths: area,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        editable: false,
        draggable: false,
      });

      editablePolygon.setMap(map);

      maps.event.addListener(editablePolygon, "mouseover", (e) => {
        let comment = "";
        if (users[index].role === "administrator" || users[index].role === "agent")
          comment =
            `<span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Agent")}</span><br/>`;
        if (users[index].role === "administrator" || users[index].role === "ads")
          comment =
            `<span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.ADS")}</span><br/>`;
        comment =
          comment +
          '<span style="color: white; font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          users[index].fullname +
          "</span>";
        comment = comment + "<br/>";

        comment =
          comment +
          `<span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Machine")}</span>`;

        locations.map((location) => {
          if (isPointInArea(location.location, area))
            comment =
              comment +
              '<br/><span style = "color: white; font-size: 14px;" > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
              location.serial +
              "</span>";
        });

        comment =
          comment +
          `<br/><span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Total")}</span>`;
        comment =
          comment +
          '<br/><span style="color: white; font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;300 €</span>';

        injectTooltip(e, comment, users[index].role);
      });

      maps.event.addListener(editablePolygon, "mousemove", (e) => {
        moveTooltip(e);
      });

      maps.event.addListener(editablePolygon, "mouseout", (e) => {
        deleteTooltip(e);
      });
    });

    let onlineMarkUrl = 
      "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    let offlineMarkUrl = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

    locations.map((location, index) => {
      const newMarker = new maps.Marker({
        position: location.location,
        map: map,
        draggable: false,
        icon: {url: onlineMarkUrl},
      });
      markerRef.current = newMarker;

      // Add event listeners for mouseover and mouseout
      newMarker.addListener("mouseover", (event) => {
        let comment =
          `<span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Machine_Id")}</span><br/>`;
        comment =
          comment +
          '<span style="color: white; font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          location.serial +
          "</span>";

        comment =
          comment +
          `<br/><span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Agent")}</span>`;
        comment =
          comment +
          '<br/><span style="color: white; font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          location.agent +
          "</span>";

        comment =
          comment +
          `<br/><span style="color: white; font-size: 16px; font-weight: Bold;">${t("Overview.Cash")}</span>`;
        comment =
          comment +
          '<br/><span style="color: white; font-size: 14px;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          location.cash +
          " €</span>";

        injectTooltip(event, comment, users[index].role);
        setMarkerTooltipContent(comment);
        setMarkerOn(true);
      });

      newMarker.addListener("mouseout", (event) => {
        setMarkerTooltipContent("");
        deleteTooltip(event);
        setMarkerOn(false);
      });
    });
  };

  return (
    <Layout title="eCommerce">
      <div className="form-control-wrap">
        <div style={{height: "100vh", width: "100%"}}>
          {isRender && (
            <GoogleMapReact
              bootstrapURLKeys={googleMapApiKey ? {key: googleMapApiKey} : {}}
              defaultCenter={position}
              defaultZoom={12}
              onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
            ></GoogleMapReact>
          )}
          {isMarkerOn == false && tooltipContent != "" && (
            <div
              className={"map-overlay ads"}
              style={{
                position: "fixed",
                width: "200px",
                borderRadius: "0px",
                padding: "10px",
                opacity: "0.7",
                color: "white",
                display: tooltipContent ? "block" : "none",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              <span></span>
              <div dangerouslySetInnerHTML={{__html: tooltipContent}} />
            </div>
          )}
          {isMarkerOn == true && markerTooltipContent != "" && (
            <div
              className={"map-overlay ads"}
              style={{
                position: "fixed",
                width: "200px",
                borderRadius: "0px",
                padding: "10px",
                opacity: "0.7",
                color: "white",
                display: tooltipContent ? "block" : "none",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              <span></span>
              <div dangerouslySetInnerHTML={{__html: markerTooltipContent}} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Overview;
