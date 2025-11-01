import {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {requestTokenPost} from "../../service";
import GoogleMapReact from "google-map-react";
import { useTranslation } from "react-i18next";
import {config} from "../../config";

function VMUserAdd() {
  const { roletype } = useParams();
  const navigate = useNavigate();
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState((roletype === "Administrators") ? "administrator": "agent");
  const [subscribed, setSubscribed] = useState(true);
  const [position, setPosition] = useState({
    lat: 52.512772141670325,
    lng: 13.406185921060313,
  });

  const [triangleCoords, settriangleCoords] = useState([
    {lat: 52.512772141670325, lng: 13.416185921060313},
    {lat: 52.522772141670325, lng: 13.406185921060313},
    {lat: 52.512772141670325, lng: 13.396185921060313},
  ]);
  const [map, setMap] = useState(null);
  let [areas, setAreas] = useState([triangleCoords]);
  const googleMapApiKey = config.googleMapApiKey;

  const addArea = () => {
    setAreas([...areas, triangleCoords]);
  };

  const { t } = useTranslation("global");

  const handleApiLoaded = (map, maps) => {
    // setMap(map);
    areas.map((area, index) => {
      let editablePolygon = new maps.Polygon({
        paths: area,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
      });

      editablePolygon.setMap(map);

      maps.event.addListener(editablePolygon, "dragend", () => {
        const updatedCoords = editablePolygon
          .getPath()
          .getArray()
          .map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }));
        areas[index] = updatedCoords;
        setAreas(areas);
      });

      maps.event.addListener(editablePolygon.getPath(), "insert_at", () => {
        const updatedCoords = editablePolygon
          .getPath()
          .getArray()
          .map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }));
        areas[index] = updatedCoords;
        setAreas(areas);
      });

      maps.event.addListener(editablePolygon.getPath(), "set_at", () => {
        const updatedCoords = editablePolygon
          .getPath()
          .getArray()
          .map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }));
        areas[index] = updatedCoords;
        setAreas(areas);
      });
    });
  };

  const onSaveUser = () => {
    if (fullname == "" || email == "" || role == "" || password == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }
    // map coordinate

    debugger;

    requestTokenPost(`/api/user/add`, {fullname, email, password, role, subscribed, areas},
      function (res) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/vm-user/list");
        }, 1000);
      },
      function (err) {
        if (err.response && (err.response.status == 400 || err.response.status == 500)) {
          toast.error(err.response.data.error);
        } else {
          console.log(err);
          toast.error(`${t("Messages.Fail_Add_User_MSG")}`);
        }
      }
    );
  };

  return (
    <Layout title={t("Users.Add")} content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Users.Add")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-user/list">{t("Users.Users")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Users.Add")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Form action="#">
          <Row className="g-gs">
            <Col xxl="12">
              <div className="gap gy-4">
                <div className="gap-col">
                  <Card className="card-gutter-md">
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              {t("Users.Name_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder={t("Users.Name")}
                                onChange={(e) => {
                                  setFullName(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="vat-amount">{t("Users.Email_Lbl")}</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="vat-amount"
                                placeholder={t("Users.Email")}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="vat-amount">
                            {t("Users.Password_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="password"
                                id="password"
                                placeholder={t("Users.Password")}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">
                            {t("Users.User_Role")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio1"
                                  autoComplete="off"
                                />
                                { role !== "agent" &&
                                  <Button
                                    as="label"
                                    variant={role == "administrator" ? "primary" : "outline-primary"}
                                    htmlFor="btnradio1"
                                    onClick={() => {
                                      setRole("administrator");
                                    }}
                                  >
                                    {t("Users.Admin_Role")}
                                  </Button>
                                }
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio2"
                                  autoComplete="off"
                                />
                                { role === "agent" &&
                                  <Button
                                    as="label"
                                    variant={role == "agent" ? "primary" : "outline-primary"}
                                    htmlFor="btnradio2"
                                    onClick={() => {
                                      setRole("agent");
                                    }}
                                  >
                                    {t("Users.Agent_Role")}
                                  </Button>
                                }

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio3"
                                  autoComplete="off"
                                />
                                { role !== "agent" &&
                                  <Button
                                    as="label"
                                    variant={role == "ads" ? "primary" : "outline-primary"}
                                    htmlFor="btnradio3"
                                    onClick={() => {
                                      setRole("ads");
                                    }}
                                  >
                                    {t("Users.ADS_Role")}
                                  </Button>
                                }
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              {t("Users.Subscribed")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio2"
                                  id="btnradio12"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    subscribed == true
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio12"
                                  onClick={() => {
                                    setSubscribed(true);
                                  }}
                                >
                                  {t("Options.Yes")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio2"
                                  id="btnradio22"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    subscribed == false
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio22"
                                  onClick={() => {
                                    setSubscribed(false);
                                  }}
                                >
                                  {t("Options.No")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        {(role === "ads" || role === "agent") && (
                          <Col lg="12">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="tax-class">
                                <span>{t("Users.Advertise_Area")}</span>
                              </Form.Label>
                              <Button
                                as="label"
                                variant="outline-primary"
                                style={{float: "right"}}
                                onClick={() => {
                                  addArea();
                                }}
                              >
                                {t("Users.Add_Area")}
                              </Button>
                              <div
                                className="form-control-wrap"
                                style={{top: "20px"}}
                              >
                                <div style={{height: "400px", width: "100%"}}>
                                  <GoogleMapReact
                                    key={areas.length}
                                    bootstrapURLKeys={googleMapApiKey ? {key: googleMapApiKey} : {}}
                                    defaultCenter={position}
                                    defaultZoom={12}
                                    onGoogleApiLoaded={({map, maps}) => {
                                      handleApiLoaded(map, maps);
                                    }}
                                    on
                                  ></GoogleMapReact>
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
                <div className="gap-col">
                  <ul className="d-flex align-items-center gap g-3">
                    <li>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => {
                          onSaveUser();
                        }}
                      >
                        {t("Users.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-user/list" className="btn border-0">
                        {t("Options.Go_Back")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default VMUserAdd;
