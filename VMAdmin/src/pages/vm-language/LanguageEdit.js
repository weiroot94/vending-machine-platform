import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {requestTokenPost, formPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMLanguageEdit() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState();
  const [language, setLanuage] = useState();
  const { t } = useTranslation("global");

  useEffect(() => {
    requestTokenPost(
      "/api/language/detail",
      {id},
      function (res) {
        if (res.data.status == "success") {
          setValues(res.data.languagevalues);
          setLanuage(res.data.language);
        }
      },
      function (error) {
        console.log(error);
        toast.error(`${t("Messages.Fail_Get_Language_MSG")}`);
      }
    );
  }, []);

  const onChangeLanguageValue = (langkey, langvalue) => {
    let tempValues = [...values];
    tempValues.map((value) => {
      if (value.language_key == langkey) value.language_value = langvalue;
    });
    setValues(tempValues);
  };

  const onSaveValues = async (event) => {
    event.preventDefault();
    requestTokenPost(
      "/api/language/update",
      {id, values},
      function (res) {
        if (res.data.status != "success") {
          toast.error(res.data.message);
          return;
        } else if (res.data.status == "success") {
          toast.success("Language updated");
          navigate("/vm-language/list");
          return;
        }
      },
      function (err) {
        toast.error("Failed to update language");
      }
    );
  };

  return (
    <Layout title="Edit Information" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Language.Message_Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Help")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-language/list">{t("Language.Language")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Language.Message_Edit")}
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
                    <Card.Header>
                      <h1>{language && language[0].name}</h1>
                    </Card.Header>
                    <Card.Body>
                      {values &&
                        values.map((value) => (
                          <Row className="g-gs mb-4" key={value._id}>
                            <Col lg="12">
                              <Form.Group className="form-group">
                                <Form.Label htmlFor="category-name">
                                  {value.language_key}
                                </Form.Label>
                                <div className="form-control-wrap">
                                  <Form.Control
                                    type="text"
                                    id="category-name"
                                    value={value.language_value}
                                    onChange={(event) => {
                                      onChangeLanguageValue(
                                        value.language_key,
                                        event.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                        ))}
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
                          onSaveValues(e);
                        }}
                      >
                        {t("Language.Update")}
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

export default VMLanguageEdit;
