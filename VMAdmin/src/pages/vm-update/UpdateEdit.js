import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { useTranslation } from "react-i18next";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {requestTokenPost} from "../../service";

function VMUserEdit() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [git, setGit] = useState("");
  const [status, setStatus] = useState(false);
  const { t } = useTranslation("global");

  useEffect(() => {
    requestTokenPost(
      "/api/update/detail",
      {id},
      function (res) {
        if (res.data.status == "success") {
          setComment(res.data.detail[0].comment);
          setGit(res.data.detail[0].git);
          setStatus(res.data.detail[0].status);
        }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_Update_History_MSG")}`);
      }
    );
  }, []);

  const onSaveUpdate = () => {
    if (comment == "" || git == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    requestTokenPost(
      "/api/update/update",
      {
        id,
        comment,
        git,
        status,
      },
      function (res) {
        if (res.data.status == "error") {
          toast.error(res.data.message);
          return;
        } else if (res.data.status == "success") {
          toast.success("Updated successfully");
          setTimeout(() => {
            navigate("/vm-update/list");
          }, 1000);
          return;
        }
      },
      function (error) {
        console.log(error);
        toast.error("Failed to update");
        return;
      }
    );
  };

  return (
    <Layout title="Edit Update" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Update.Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-update/list">{t("Update.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Update.Edit")}
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
                              {t("Update.Name")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                value={comment}
                                id="category-name"
                                placeholder="Comment"
                                onChange={(e) => {
                                  setComment(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="vat-amount">
                            {t("Update.Link")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                value={git}
                                id="email"
                                placeholder="Git commit link"
                                onChange={(e) => {
                                  setGit(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">Status</Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio1"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    status == true
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio1"
                                  onClick={() => {
                                    setStatus(true);
                                  }}
                                >
                                  {t("Update.Enable")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio2"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    status == false
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio2"
                                  onClick={() => {
                                    setStatus(false);
                                  }}
                                >
                                  {t("Update.Disable")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
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
                          onSaveUpdate();
                        }}
                      >
                        {t("Update.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-update/list" className="btn border-0">
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

export default VMUserEdit;
