import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {formPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMLanguageAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const {langtype} = useParams();
  const [role, setRole] = useState(langtype ? langtype : "VMApp");
  const { t } = useTranslation("global");

  const onFileChanged = (event) => {
    setCurrentFile(event.target.files[0]);
  };

  const onSaveLanguage = async (event) => {
    if (name == "" || currentFile == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    event.preventDefault();
    let formData = new FormData();
    formData.append("attachfile", currentFile);
    formData.append("name", name);
    formData.append("role", role);

    try {
      formPost(
        "/api/language/add",
        formData,
        function (res) {
          if (res.data.status != "success") {
            toast.error(res.data.message);
            return;
          } else if (res.data.status == "success") {
            toast.success(`${t("Messages.Success_New_Language_MSG")}`);
            setTimeout(() => {
              navigate("/vm-language/list");
            }, 1000);
            return;
          }
        },
        function (error) {
          toast.error(`${t("Messages.Fail_New_Language_MSG")}`);
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Add Information" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Language.Add")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-language/list">{t("Language.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Language.Add")}
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
                            {t("Language.Title")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder={t("Language.Name_Field")}
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">
                            {t("Language.Where_Use")}
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
                                <Button
                                  as="label"
                                  variant={role == "VMApp" ? "primary" : "outline-primary"}
                                  htmlFor="btnradio1"
                                  onClick={() => {
                                    setRole("VMApp");
                                  }}
                                >
                                  {t("Language.Machine_App")}
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
                                  variant={role == "VMAdmin" ? "primary" : "outline-primary"}
                                  htmlFor="btnradio2"
                                  onClick={() => {
                                    setRole("VMAdmin");
                                  }}
                                >
                                  {t("Language.Admin_Site")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio3"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={role == "VMCustomer" ? "primary" : "outline-primary"}
                                  htmlFor="btnradio3"
                                  onClick={() => {
                                    setRole("VMCustomer");
                                  }}
                                >
                                  {t("Language.Custom_Site")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        {currentFile && (
                          <Col lg="12">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="category-name">
                              {t("Language.Current_File")}
                              </Form.Label>
                              <div className="form-control-wrap">
                                <img
                                  src={URL.createObjectURL(currentFile)}
                                  style={{
                                    width: "auto",
                                    height: "300px",
                                    border: "solid 1px grey",
                                    padding: "3px",
                                    borderRadius: "10px",
                                  }}
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        )}
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Language.Icon")}
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
                          onSaveLanguage(e);
                        }}
                      >
                        {t("Language.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-language/list" className="btn border-0">
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

export default VMLanguageAdd;
