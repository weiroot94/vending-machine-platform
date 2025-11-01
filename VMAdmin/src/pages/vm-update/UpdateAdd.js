import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {requestTokenPost} from "../../service";

function VMUpdateAdd() {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [git, setGit] = useState("");
  const [status, setStatus] = useState(false);
  const { t } = useTranslation("global");

  const onSaveUpdate = () => {
    if (comment == "" || git == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    requestTokenPost(
      `/api/update/add`,
      {
        comment,
        git,
        status,
      },
      function (res) {
        if (res.data.status == "error") {
          toast.error(res.data.message);
          return;
        } else if (res.data.status == "success") {
          toast.success(`${t("Messages.Success_Add_Update_MSG")}`);
          setTimeout(() => {
            navigate("/vm-update/list");
          }, 1000);
          return;
        }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_New_Update_MSG")}`);
        return;
      }
    );
  };

  return (
    <Layout title="Add Vending Machine Update" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Update.Machine_Update")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-user/list">{t("Update.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Update.Add")}
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
                            {t("Update.Comment")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder={t("Update.Comment")}
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
                            {t("Update.Git_Link")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="vat-amount"
                                placeholder={t("Update.Git_Link")}
                                onChange={(e) => {
                                  setGit(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="tax-class">{t("Update.Status")}</Form.Label>
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
                        {t("Update.Save_Update")}
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

export default VMUpdateAdd;
