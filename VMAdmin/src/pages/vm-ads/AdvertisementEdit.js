import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {formPost, requestTokenPost} from "../../service";
import {config} from "../../config";
import { useTranslation } from "react-i18next";

function VMAdvertisementEdit() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [origtype, setOrigType] = useState("");
  const [file, setFile] = useState("");
  const [filepath, setFilepath] = useState("");
  const { t } = useTranslation("global");

  const onFileChanged = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    requestTokenPost(
      "/api/ads/detail",
      {id},
      function (res) {
        if (res.data.status == "success") {
          setTitle(res.data.detail.title);
          setType(res.data.detail.type);
          setOrigType(res.data.detail.type);
          setFilepath(res.data.detail.filepath);
        }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_Get_Detail_Adver_MSG")}`);
        return;
      }
    );
  }, []);

  const onSaveAdvertisement = async (event) => {
    if (title == "" || type == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    event.preventDefault();
    let formData = new FormData();
    formData.append("id", id);
    formData.append("attachfile", file);
    formData.append("title", title);
    formData.append("type", type);

    try {
      formPost(
        "/api/ads/update",
        formData,
        function (res) {
          if (res.data.status != "success") {
            toast.error(res.data.message);
          } else {
            toast.success(`${t("Messages.Success_Update_Adver_MSG")}`);
            setTimeout(() => {
              navigate("/vm-ads/list");
            }, 1000);
            return;
          }
        },
        function (error) {
          toast.error(`${t("Messages.Fail_Update_Adver_MSG")}`);
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Edit Advertisement" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Advertisement.Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-ads/list">{t("Advertisement.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Advertisement.Edit")}
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
                                value={title}
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
                                  variant={
                                    type == "PPT"
                                      ? "primary"
                                      : "outline-primary"
                                  }
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
                                  variant={
                                    type == "MP4"
                                      ? "primary"
                                      : "outline-primary"
                                  }
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
                              {origtype == "MP4" ? (
                                <video
                                  controls
                                  style={{
                                    width: "auto",
                                    height: "300px",
                                    border: "solid 1px grey",
                                    padding: "3px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <source
                                    src={`${
                                      config.serverUrl
                                    }/file/download/${btoa(filepath)}`}
                                  />
                                </video>
                              ) : (
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={(e) => {
                                    window.location.replace(
                                      `${config.serverUrl}/file/download/${btoa(
                                        filepath
                                      )}`
                                    );
                                  }}
                                >
                                  {t("Advertisement.Download_PPT")}
                                </Button>
                              )}
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
                        onClick={(e) => {
                          onSaveAdvertisement(e);
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

export default VMAdvertisementEdit;
