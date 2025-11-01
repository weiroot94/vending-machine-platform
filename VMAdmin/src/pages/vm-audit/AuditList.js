import {useState, useEffect, useMemo} from "react";
import {Card, Nav, Tab, Form, InputGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Timeline} from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {requestTokenPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMAuditList() {
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [logHistory, setLogHistory] = useState([]);
  const { t } = useTranslation("global");

  const getLogHistory = () => {
    requestTokenPost(
      "/api/audit/list",
      {
        role: tab,
        keyword: keyword,
        date_from: fromDate,
        date_to: toDate,
        current_page: currentPage,
      },
      function (result) {
        setLogHistory(result.data.data);
        setTotalItem(result.data.totalItem);
        setTotalPage(result.data.totalPage);
      },
      function (error) {}
    );
  };

  useEffect(() => {
    setCurrentPage(1);
    getLogHistory();
  }, [keyword, tab, fromDate, toDate]);

  useEffect(() => {
    getLogHistory();
  }, [currentPage]);

  const logHistoryComponent = useMemo(() => {
    return (
      <Timeline className="nk-timeline-center mt-4">
        <Timeline.List>
          {logHistory &&
            logHistory.map((log, index) => {
              return (
                <Timeline.Item
                  key={index}
                  symbol={log.type}
                  variant={log.color}
                  className="d-flex justify-content-center"
                >
                  <div dangerouslySetInnerHTML={{__html: log.comment}}></div>
                  <small className="f-right ms-auto">{log.created_at}</small>
                </Timeline.Item>
              );
            })}
        </Timeline.List>
      </Timeline>
    );
  }, [logHistory]);

  return (
    <Layout title="Users" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Logs.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Logs.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <InputGroup>
                  <Form.Control
                    placeholder="yyyy-mm-dd"
                    type="date"
                    autoComplete="off"
                    name="start"
                    size="sm"
                    value={fromDate}
                    onChange={(event) => {
                      setFromDate(event.target.value);
                    }}
                  />
                  <InputGroup.Text>{t("Options.To")}</InputGroup.Text>
                  <Form.Control
                    placeholder="yyyy-mm-dd"
                    type="date"
                    autoComplete="off"
                    name="end"
                    size="sm"
                    value={toDate}
                    onChange={(event) => {
                      setToDate(event.target.value);
                    }}
                  />
                </InputGroup>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <Card.Body>
            <Tab.Container id="custom-tabs-example" defaultActiveKey="logs-all">
              <Nav variant="pills" className="mb-3">
                <Nav.Item
                  onClick={() => {
                    setTab("all");
                  }}
                >
                  <Nav.Link eventKey="logs-all">{t("Logs.All")}</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onClick={() => {
                    setTab("administrator");
                  }}
                >
                  <Nav.Link eventKey="logs-admin">{t("Logs.Admin")}</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onClick={() => {
                    setTab("agent");
                  }}
                >
                  <Nav.Link eventKey="logs-agent">{t("Logs.Agent")}</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onClick={() => {
                    setTab("ads");
                  }}
                >
                  <Nav.Link eventKey="logs-ads">{t("Logs.ADS")}</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onClick={() => {
                    setTab("machine");
                  }}
                >
                  <Nav.Link eventKey="logs-machines">{t("Logs.Machine")}</Nav.Link>
                </Nav.Item>
                <div className="ms-auto">
                  <Form.Control
                    type="input"
                    placeholder={t("Logs.Search")}
                    className="mb-1"
                    value={keyword}
                    onChange={(event) => {
                      setKeyword(event.target.value);
                    }}
                  />
                </div>
              </Nav>
              <Tab.Content>
                {logHistoryComponent}
                <nav>
                  <ul className="pagination pagination-s1 flex-wrap justify-content-start mt-5">
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => {
                          setCurrentPage("1");
                        }}
                      >
                        <em className="ni ni-chevrons-left icon me-1"></em>
                        {t("Options.Frist")}
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => {
                          if (currentPage != 1) setCurrentPage(currentPage - 1);
                        }}
                      >
                        <em className="ni ni-chevron-left icon me-1"></em>
                        {t("Options.Prev")}
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => {
                          if (currentPage != totalPage)
                            setCurrentPage(currentPage + 1);
                        }}
                      >
                        {t("Options.Next")}
                        <em className="ni ni-chevron-right icon ms-1"></em>
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => {
                          setCurrentPage(totalPage);
                        }}
                      >
                        {t("Options.Last")}
                        <em className="ni ni-chevrons-right icon ms-1"></em>
                      </a>
                    </li>
                  </ul>
                </nav>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMAuditList;
