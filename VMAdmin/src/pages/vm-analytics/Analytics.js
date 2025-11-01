import {Card, Nav, Tab, Row, Col, Table, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {ChartLine, ChartBar, ChartPie} from "../../components/Chart/Charts";
import Select from "../../components/Form/Select";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {Colors} from "../../utilities/index";
import hexRGB from "../../utilities/hexRGB";
import { MediaGroup, MediaText, OverlineTitle } from "../../components";
import {toast} from "react-toastify";
import { useEffect, useState } from "react";
import {requestTokenPost} from "../../service";
import { useTranslation } from "react-i18next";

const MonthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function VMAnalytics() {

  const [tab, setTab] = useState(1);

  const [totalValues, setTotalValues] = useState(null)
  const [typeValues, setTypeValues] = useState(null)
  const [machineValues, setMachineValues] = useState(null)
  const [areaValues, setAreaValues] = useState(null)

  const [totalYear, setTotalYear] = useState(new Date().getFullYear())
  const [typeYear, setTypeYear] = useState(new Date().getFullYear())
  const [typeMonth, setTypeMonth] = useState(new Date().getMonth() + 1)
  const [machineYear, setmachineYear] = useState(new Date().getFullYear())
  const [machineMonth, setmachineMonth] = useState(new Date().getMonth() + 1)

  const [chartKey, setChartKey] = useState(0)

  const { t } = useTranslation("global");

  const [totalChartData, setTotalChartData] = useState({
    labels: MonthNames,
    legend: true,
    datasets: [
      {
        tension: 0.4,
        label: `${t("Table.Total_Received")}`,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: hexRGB(Colors.primary, 0.2),
        pointBorderColor: Colors.primary,
        pointBackgroundColor: Colors.white,
        pointHoverBackgroundColor: Colors.primary,
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 4,
        fill: true,
        data: [],
      },
    ],
  })

  const [typeChartData, setTypeChartData] = useState({
    labels: [],
    legend: true,
    barThickness: 16,
    datasets: [
      {
        label: `${t("Table.Bar_Data")}`,
        borderColor: hexRGB(Colors.primary, 0.6),
        backgroundColor: hexRGB(Colors.primary, 0.2),
        hoverBackgroundColor: hexRGB(Colors.primary, 0.6),
        borderWidth: 1,
        data: [],
      },
    ],
  })

  const [machineChartData, setMachineChartData] = useState({
    labels: MonthNames,
    legend: true,
    barThickness: 16,
    datasets: [
      {
        label: `${t("Table.Bar_Data")}`,
        borderColor: hexRGB(Colors.primary, 0.6),
        backgroundColor: hexRGB(Colors.primary, 0.2),
        hoverBackgroundColor: hexRGB(Colors.primary, 0.6),
        borderWidth: 1,
        data: [],
      },
    ],
  })

  const convertMonthNumberToName = (monthNumber) => {
    return MonthNames[parseInt(monthNumber, 10) - 1];
  };

  const getValues = () => {

    let url = ''
    let params = {}

    if (tab == 1) {
      url = '/api/analytics/total'
      params = {
        year: totalYear
      }
    } else if (tab == 2) {
      url = '/api/analytics/type'
      params = {
        year: typeYear,
        month: typeMonth
      }
    } else if (tab == 3) {
      params = {
        year: machineYear,
        month: machineMonth
      }
      url = '/api/analytics/machine'
    }

    requestTokenPost(
      url,
      params,
      function (result) {
        if (result.data.status == "success")
          if (tab == 1) {

            setTotalValues(result.data.details)
            let tempChartData = totalChartData;
            tempChartData.labels = MonthNames;
            tempChartData.datasets[0].data = result.data.details.map(item => item.sum_amount);
            setTotalChartData(tempChartData);
            setChartKey((prevKey) => prevKey + 1)

          } else if (tab == 2) {

            setTypeValues(result.data.details)
            let tempChartData = totalChartData;
            tempChartData.labels = result.data.details.map(item => item.product)
            tempChartData.datasets[0].data = result.data.details.map(item => item.totalAmount);
            setTypeChartData(tempChartData);
            setChartKey((prevKey) => prevKey + 1)

          } else if (tab == 3) {

            setMachineValues(result.data.details)
            let tempChartData = totalChartData;
            tempChartData.labels = result.data.details.map(item => item.machine)
            tempChartData.datasets[0].data = result.data.details.map(item => item.totalAmount);
            setMachineChartData(tempChartData);
            setChartKey((prevKey) => prevKey + 1)
            
          }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_Analytics_MSG")}`);
      }
    );
  }


  useEffect(() => {
    getValues()
  }, [tab, totalYear, typeYear, typeMonth, machineYear, machineMonth])

  return (
    <Layout title="Users" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Analytics.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Analytics.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li></li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <Card.Body>
            <Tab.Container id="custom-tabs-example" defaultActiveKey="total">
              <Nav variant="pills" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="total" onClick={() => {
                    setTab(1)
                  }}>{t("Analytics.Total")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="product" onClick={() => {
                    setTab(2)
                  }}>{t("Analytics.Type")}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="machine" onClick={() => {
                    setTab(3)
                  }}>{t("Analytics.Machines")}</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="total">
                  <Card>
                    <Card.Body>
                      <div className="d-flex">
                        <Form.Group className="form-group w-25 mb-3 me-1">
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              onChange={(event) => {
                                setTotalYear(event.target.value)
                              }}
                              value={totalYear}
                            >
                              <option value="">{t("Date.Sel_Year")}</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                            </select>
                          </div>
                        </Form.Group>
                      </div>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Card>
                            <Table responsive className="table-middle mb-0">
                              <thead className="table-light table-head-sm">
                                <tr>
                                  <th className="tb-col">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Month")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Order")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Stock")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Amount")} (€)
                                    </OverlineTitle>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  totalValues && totalValues.map(value => (
                                    <tr key={'total-' + convertMonthNumberToName(value.month)}>
                                      <td className="tb-col">
                                        <MediaGroup>
                                          <MediaText>
                                              <span className="title">{convertMonthNumberToName(value.month)}</span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small">{value.count_orders}</span>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small">{value.sum_product_count}</span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small">{value.sum_amount}</span>
                                      </td>
                                    </tr>
                                  ))
                                }
                                {
                                  totalValues && (
                                    <tr key="sum-total">
                                      <td className="tb-col tb-col-end">
                                        <MediaGroup>
                                          <MediaText>
                                              <span className="title" style={{ color: 'red' }}>{t("Options.Total")} </span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {totalValues.reduce((sum, item) => {
                                              return sum + parseInt(item.count_orders);
                                          }, 0)}
                                        </span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {totalValues.reduce((sum, item) => {
                                              return sum + parseInt(item.sum_product_count);
                                          }, 0)}
                                        </span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {totalValues.reduce((sum, item) => {
                                              return sum + parseInt(item.sum_amount);
                                          }, 0)}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Table>
                          </Card>
                        </Col>
                        <Col lg="6">
                          <Card>
                            <Card.Body>
                              <div className="nk-chart-overview">
                                <ChartLine key={'chart-' + chartKey} data={totalChartData} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="product">
                  <Card>
                    <Card.Body>
                      <div className="d-flex">
                        <Form.Group className="form-group w-25 mb-3 me-1">
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              onChange={(event) => {
                                setTypeYear(event.target.value)
                              }}
                              value={typeYear}
                            >
                              <option value="">{t("Date.Sel_Year")}</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                            </select>
                          </div>
                        </Form.Group>
                        <Form.Group className="form-group w-25 mb-3">
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              onChange={(event) => {
                                setTypeMonth(event.target.value)
                              }}
                              value={typeMonth}
                            >
                              <option value="0">{t("Options.All")}</option>
                              {
                                MonthNames.map((month, index) => (
                                  <option key={'product-month-' + index} value={index + 1}>{month}</option>
                                ))
                              }
                            </select>
                          </div>
                        </Form.Group>
                      </div>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Card>
                            <Table responsive className="table-middle mb-0">
                              <thead className="table-light table-head-sm">
                                <tr>
                                  <th className="tb-col">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Product")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Count")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Amount")} (€)
                                    </OverlineTitle>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  typeValues && typeValues.map((typeValue, index) => (
                                    <tr key={'type-' + index}>
                                      <td className="tb-col">
                                        <MediaGroup>
                                          <MediaText>
                                            <span className="title">
                                              {typeValue.product}
                                            </span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small">{typeValue.totalProductCount}</span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small">{typeValue.totalAmount}</span>
                                      </td>
                                    </tr>
                                  ))
                                }
                                {
                                  typeValues && (
                                    <tr key={'type-total'}>
                                      <td className="tb-col">
                                        <MediaGroup>
                                          <MediaText>
                                            <span className="title" style={{ color: 'red' }}>
                                            {t("Options.Total")} ({typeValues.length}): 
                                            </span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small" style={{ color: 'red' }}>
                                          {
                                            typeValues.reduce((sum, item) => {
                                              return sum + parseInt(item.totalProductCount);
                                            }, 0)
                                          }
                                        </span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {
                                            typeValues.reduce((sum, item) => {
                                              return sum + parseInt(item.totalAmount);
                                            }, 0)
                                          }
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Table>
                          </Card>
                        </Col>
                        <Col lg="6">
                          <Card>
                            <Card.Body>
                              <div className="nk-chart-overview">
                                <ChartBar key={'chart-' + chartKey} data={typeChartData} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="machine">
                  <Card>
                    <Card.Body>
                      <div className="d-flex">
                        <Form.Group className="form-group w-25 mb-3 me-1">
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              onChange={(event) => {
                                setmachineYear(event.target.value)
                              }}
                              value={machineYear}
                            >
                              <option value="">{t("Date.Sel_Year")}</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                            </select>
                          </div>
                        </Form.Group>
                        <Form.Group className="form-group w-25 mb-3">
                          <div className="form-control-wrap">
                            <select
                              className="form-control"
                              onChange={(event) => {
                                setmachineMonth(event.target.value)
                              }}
                              value={machineMonth}
                            >
                              <option value="0">{t("Options.All")}</option>
                              {
                                MonthNames.map((month, index) => (
                                  <option  key={'machine-month-' + index} value={index + 1}>{month}</option>
                                ))
                              }
                            </select>
                          </div>
                        </Form.Group>
                      </div>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Card>
                            <Table responsive className="table-middle mb-0">
                              <thead className="table-light table-head-sm">
                                <tr>
                                  <th className="tb-col">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Vending")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Order")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end tb-col-sm">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Stock")}
                                    </OverlineTitle>
                                  </th>
                                  <th className="tb-col tb-col-end">
                                    <OverlineTitle tag="span">
                                    {t("Analytics.Amount")} (€)
                                    </OverlineTitle>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  machineValues && machineValues.map((machineValue, index) => (
                                    <tr key={'type-' + index}>
                                      <td className="tb-col">
                                        <MediaGroup>
                                          <MediaText>
                                            <span className="title">
                                              {machineValue.machine}
                                            </span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small">{machineValue.count_orders}</span>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small">{machineValue.totalProductCount}</span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small">{machineValue.totalAmount}</span>
                                      </td>
                                    </tr>
                                  ))
                                }
                                {
                                  machineValues && (
                                    <tr key={'type-total'}>
                                      <td className="tb-col">
                                        <MediaGroup>
                                          <MediaText>
                                            <span className="title" style={{ color: 'red' }}>
                                            {t("Options.Total")} ({machineValues.length}): 
                                            </span>
                                          </MediaText>
                                        </MediaGroup>
                                      </td>
                                      <td className="tb-col tb-col-end tb-col-sm">
                                        <span className="small" style={{ color: 'red' }}>
                                          {
                                            machineValues.reduce((sum, item) => {
                                              return sum + parseInt(item.count_orders);
                                            }, 0)
                                          }
                                        </span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {
                                            machineValues.reduce((sum, item) => {
                                              return sum + parseInt(item.totalProductCount);
                                            }, 0)
                                          }
                                        </span>
                                      </td>
                                      <td className="tb-col tb-col-end">
                                        <span className="small" style={{ color: 'red' }}>
                                          {
                                            machineValues.reduce((sum, item) => {
                                              return sum + parseInt(item.totalAmount);
                                            }, 0)
                                          }
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Table>
                          </Card>
                        </Col>
                        <Col lg="6">
                          <Card>
                            <Card.Body>
                              <div className="nk-chart-overview">
                                <ChartBar key={'chart-' + chartKey} data={machineChartData} />
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMAnalytics;
