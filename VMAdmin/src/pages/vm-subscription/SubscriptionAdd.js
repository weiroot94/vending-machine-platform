import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Form, Row, Col, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import EmailEditor from "../../components/EmailEditor/EmailEditor";
import { useAuth } from "../../provider/AuthProvider";
import {requestTokenPost} from "../../service";
import { useTranslation } from "react-i18next";

function SubscriptionAdd() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [mailSubject, setMailSubject] = useState();
  const [mailContent, setMailContent] = useState('');
  const { t } = useTranslation("global");

  const onSave = () => {
    if (mailSubject == "" || mailContent == "") {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    requestTokenPost(`/api/subscription/add`, {
      token,
      subject: mailSubject,
      content: mailContent,
    },
      function (res) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/vm-subscription/list");
        }, 1000);
      },
      function (err) {
        if (err.response && (err.response.status == 400 || err.response.status == 500)) {
          toast.error(err.response.data.error);
        } else {
          console.log(err);
          toast.error(`${t("Messages.Fail_New_Sub_MSG")}`);
        }
      }
    );
  };

  return (
    <Layout title={t("Subscription.Add")} content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Subscription.Add")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-subscriptions/list">{t("Subscription.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Subscription.Add")}
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
                <Form.Group className="form-group">
                    <div className="form-control-wrap">
                      <Form.Control
                        type="text"
                        id="subject"
                        value={mailSubject}
                        placeholder={t("Subscription.Subject")}
                        onChange={(e) => {
                          setMailSubject(e.target.value);
                        }}
                      />
                    </div>
                </Form.Group>
                </div>
                <div className="gap-col">
                  <EmailEditor setMailContent={setMailContent} />
                </div>
                <div className="gap-col">
                  <ul className="d-flex align-items-center gap g-3">
                    <li>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => {
                          onSave();
                        }}
                      >
                        {t("Options.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-subscription/list" className="btn border-0">
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

export default SubscriptionAdd;
