import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {formPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMAdvertisementAdd() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PPT");
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const onFileChanged = (event) => {
    setFile(event.target.files[0]);
  };

  const onSaveAdvertisement = async (event) => {
    if (title == "" || type == "" || file == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    event.preventDefault();
    let formData = new FormData();
    formData.append("attachfile", file);
    formData.append("title", title);
    formData.append(
      "poster",
      JSON.parse(window.localStorage.getItem("vending_user")).email
    );
    formData.append("type", type);

    try {
      formPost(
        "/api/ads/add",
        formData,
        function (res) {
          if (res.data.status != "success") {
            toast.error(res.data.message);
          } else {
            toast.success(`${t("Messages.Success_Add_Adver_MSG")}`);
            setTimeout(() => {
              navigate("/vm-ads/list");
            }, 1000);
            return;
          }
        },
        function (error) {
          toast.error(`${t("Messages.Fail_Add_Adver_MSG")}`);
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Add Advertisement" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Advertisement.Add")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-ads/list">{t("Advertisement.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Advertisement.Add")}
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
                              {t("Advertisement.Type_Title")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder={t("Advertisement.Type_Title")}
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">{t("Advertisement.Type_Label")}</Form.Label>
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
                                  variant={type == "PPT" ? "primary" : "outline-primary"}
                                  htmlFor="btnradio1"
                                  onClick={() => {
                                    setType("PPT");
                                  }}
                                >
                                  {t("Advertisement.Type_PPT")}
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
                                  variant={type == "MP4" ? "primary" : "outline-primary"}
                                  htmlFor="btnradio2"
                                  onClick={() => {
                                    setType("MP4");
                                  }}
                                >
                                  {t("Advertisement.Type_Mp4")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              {t("Advertisement.File")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                size="md"
                                type="file"
                                name="file"
                                id="file"
                                onChange={(event) => {
                                  onFileChanged(event);
                                }}
                              />
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
                        onClick={(event) => {
                          onSaveAdvertisement(event);
                        }}
                      >
                        {t("Advertisement.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-ads/list" className="btn border-0">
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

export default VMAdvertisementAdd;
