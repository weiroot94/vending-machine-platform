import {Row, Col, Card, Button, Dropdown, Table, Badge} from "react-bootstrap";

import Layout from "../layout/default";
import {
  Image,
  Icon,
  Media,
  MediaGroup,
  MediaText,
  Pureknob,
  CustomDropdownMenu,
  CustomDropdownToggle,
  OverlineTitle,
  ChartLegend,
} from "../components";
import {ChartBar, ChartLine} from "../components/Chart/Charts";
import {Colors} from "../utilities/index";
import hexRGB from "../utilities/hexRGB";
import {requestTokenPost} from "../service";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";

function HomeEcommerce() {
  const [dashboardData, setDashboardData] = useState({
    machines: {
      total: 0,
      online: 0,
      offline: 0,
      alert_machines: [
        {
          machine: "VM-xxx",
          agent: "Agent 1",
          status: "Out of stock",
        },
        {
          machine: "VM-xxx",
          agent: "Agent 1",
          status: "Low stock",
        },
        {
          machine: "VM-xxx",
          agent: "Agent 1",
          status: "Out of cash",
        },
      ],
    },
    users: {
      total_visitor: 0,
      total_register: 0,
      week_visitors: [0, 0, 0, 0, 0, 0, 0],
      year_registors: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    products: {
      total_product: 0,
    },
    locations: 0,
    running_version: 1.0,
    analytics: {
      total_income: 0,
      cash_income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      qr_income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      total_deposit: 0,
      year_total_amount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      year_total_orders: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  });

  // visitor chart data
  const [visitorsChartData, setVisitorsChartData] = useState({
    labels: [],
    yAxis: false,
    xGridColor: Colors.white,
    xGridBorderColor: Colors.white,
    datasets: [
      {
        label: "Visited",
        borderColor: "transparent",
        backgroundColor: hexRGB(Colors.info, 0.3),
        hoverBackgroundColor: Colors.info,
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false,
        data: [],
      },
    ],
  });

  const [totalVisitors, setTotalVisitors] = useState(0);
  const [weeklyVisitorTrend, setWeeklyVisitorTrend] = useState(0);
  const [totalRegisters, setTotalRegisters] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalQrIncome, setTotalQrIncome] = useState(0);
  const [totalCashIncome, setTotalCashIncome] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);

  // Registers
  const [registerChart, setRegisterChart] = useState({
    labels: [],
    xAxis: false,
    yAxis: false,
    datasets: [
      {
        tension: 0.4,
        label: "Registered",
        borderColor: Colors.success,
        pointBackgroundColor: Colors.success,
        backgroundColor: hexRGB(Colors.success, 0.2),
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: Colors.success,
        fill: true,
        data: [],
      },
    ],
  });

  // total Profit Chart
  const [totalProfitChart, setTotalProfitChart] = useState({
    labels: [],
    stacked: true,
    ticksValue: "€",
    borderDash: [8, 4],
    xGridColor: Colors.white,
    xGridBorderColor: Colors.white,
    yGridBorderColor: Colors.white,
    maxTicksLimit: 20,
    datasets: [
      {
        borderRadius: {
          topLeft: 50,
          topRight: 50,
          bottomLeft: 50,
          bottomRight: 50,
        },
        backgroundColor: Colors.blue,
        label: "Total QR",
        borderSkipped: false,
        data: [],
      },
      {
        borderRadius: {
          topLeft: 50,
          topRight: 50,
          bottomLeft: 50,
          bottomRight: 50,
        },
        backgroundColor: Colors.success,
        label: "Total Cash",
        borderSkipped: false,
        data: [],
      },
    ],
  });

  // total sales knob chart
  const [totalSales, setTotalSales] = useState({
    size: 120,
    value: 65,
    angleOffset: -0.5,
    angleStart: 0.5,
    angleEnd: 0.5,
    colorFg: Colors.info,
  });

  // total revenue Chart
  const [totalRevenueChart, setTotalRevenueChart] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    yAxis: false,
    xAxis: false,
    datasets: [
      {
        tension: 0.4,
        label: "Total",
        borderColor: Colors.primary,
        backgroundColor: "transparent",
        borderWidth: 4,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: Colors.primary,
        borderCapStyle: "round",
        data: [12, 40, 13, 130, 70, 210],
      },
    ],
  });

  // sales analytics Chart
  const [salesAnalyticsChart, setSalesAnalyticsChart] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    borderDash: [8, 4],
    maxTicksLimit: 10,
    ticksValue: "k",
    xAxis: false,
    xGridBorderColor: Colors.white,
    yGridBorderColor: Colors.white,
    datasets: [
      {
        tension: 0.4,
        borderWidth: 3,
        borderColor: Colors.yellow,
        backgroundColor: hexRGB(Colors.yellow, 0.2),
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointHoverBackgroundColor: Colors.yellow,
        label: "Total Sales",
        fill: true,
        data: [40, 60, 30, 65, 60, 95, 90, 100, 96, 120, 105, 134],
      },
      {
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: "transparent",
        pointBackgroundColor: "transparent",
        borderColor: Colors.danger,
        pointHoverBackgroundColor: Colors.danger,
        label: "Total Orders",
        borderDash: [8, 4],
        data: [70, 44, 49, 78, 39, 49, 39, 38, 59, 80, 56, 101],
      },
    ],
  });

  useEffect(() => {
    requestTokenPost(
      "/api/dashboard/all",
      {},
      function (result) {
        setDashboardData(result.data.data);

        // Set this week visitors
        const weekVisitorsData = result.data.data.users.week_visitors;
        const weekVisitorsChartLabel = [];
        const weekVisitorsChartData = [];

        for (const [key, value] of Object.entries(weekVisitorsData.visitorsPerDay)) {
          weekVisitorsChartLabel.push(key);
          weekVisitorsChartData.push(value);
        }

        setVisitorsChartData((prevChartData) => ({
          ...prevChartData,
          labels: weekVisitorsChartLabel,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: weekVisitorsChartData,
            },
          ],
        }));

        setTotalVisitors(weekVisitorsData.weekVisitors);
        setWeeklyVisitorTrend(weekVisitorsData.trend);

        // Set this year registors
        const yearRegisters = result.data.data.users.total_register;
        const yearRegistersChartLabel = [];
        const yearRegistersChartData = [];
        let totalRegisterNum = 0;

        for (const [key, value] of Object.entries(yearRegisters)) {
          yearRegistersChartLabel.push(key);
          yearRegistersChartData.push(value);
          totalRegisterNum += value;
        }
        setTotalRegisters(totalRegisterNum);
        setRegisterChart((prevChartData) => ({
          ...prevChartData,
          labels: yearRegistersChartLabel,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: yearRegistersChartData,
            },
          ],
        }));

        // Set this year selling analytics
        const yearQrInComes = result.data.data.analytics.qr_income;
        const yearCashIncomes = result.data.data.analytics.cash_income;
        const chartLabel = [];
        const qrIncomeData = [];
        const cashIncomeData = [];
        let qrIncomeSum = 0;
        let cashIncomeSum = 0;

        console.log(result.data.data.analytics);

        for (const [key, value] of Object.entries(yearQrInComes)) {
          chartLabel.push(key);
          qrIncomeData.push(value);
          qrIncomeSum += value;
        }

        for (const [key, value] of Object.entries(yearCashIncomes)) {
          cashIncomeData.push(value);
          cashIncomeSum += value;
        }

        setTotalQrIncome(qrIncomeSum);
        setTotalCashIncome(cashIncomeSum);
        setTotalIncome(qrIncomeSum + cashIncomeSum);
        setTotalProfitChart((prevChartData) => ({
          ...prevChartData,
          labels: chartLabel,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: qrIncomeData,
            },
            {
              ...prevChartData.datasets[1],
              data: cashIncomeData,
            },
          ],
        }));

        // Set actual total deposited amount
        setTotalDeposited(result.data.data.analytics.total_deposit - qrIncomeSum);
      },
      function (error) {}
    );
  }, []);

  const {t} = useTranslation("global");

  return (
    <Layout title="Dashboard">
      {dashboardData && (
        <Row className="g-gs">
          <Col xxl="4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="card-title">
                        <h4 className="title mb-1">
                          {t("homecommerce.Machines")}
                        </h4>
                      </div>
                      <div className="my-3 d-flex gap-1 align-items-center">
                        {t("homecommerce.Total")}{" "}
                        <div className="amount h2 fw-bold text-primary">
                          {dashboardData.machines.total}
                        </div>
                      </div>
                      <div className="my-3 d-flex gap-1 align-items-center">
                        {t("homecommerce.Online")}{" "}
                        <div className="amount h2 fw-bold text-primary">
                          {dashboardData.machines.online}
                        </div>
                      </div>
                      <div className="my-3 d-flex gap-1 align-items-center">
                        {t("homecommerce.Offline")}{" "}
                        <div className="amount h2 fw-bold text-primary">
                          {dashboardData.machines.offline}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-none d-sm-block d-xl-none d-xxl-block me-md-5 me-xxl-0">
                    <Image
                      src="/images/machines/vending-machine.png"
                      staticImage
                      alt=""
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="6" xxl="4">
            <Card className="h-100">
              <Card.Body>
                <div className="card-title">
                  <h4 className="title">{t("homecommerce.Visitors")}</h4>
                </div>
                <div className="d-flex justify-content-between align-items-end gap g-2">
                  <div className="flex-grow-1">
                    <div className="smaller">
                      <strong className="text-base">{totalVisitors}</strong> {t("homecommerce.New_Visitor")}
                      <span className="d-block">{t("homecommerce.During_Week")}</span>
                    </div>
                    <div className="d-flex align-items-center mt-1">
                      {/* <div className="amount h2 mb-0 fw-bold">
                        {dashboardData.users.total_visitor}
                      </div> */}
                      {
                        weeklyVisitorTrend >= 0 ?
                        <div className="change up smaller ms-1">
                          <Icon name="trend-up"></Icon> {weeklyVisitorTrend}%
                        </div>
                        :
                        <div className="change down smaller ms-1">
                          <Icon name="trend-down"></Icon> {weeklyVisitorTrend * -1}%
                        </div>
                      }
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="nk-chart-ecommerce-visitor">
                      <ChartBar data={visitorsChartData} />
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="6" xxl="4">
            <Card className="h-100">
              <Card.Body>
                <div className="card-title">
                  <h4 className="title">{t("homecommerce.Registers")}</h4>
                </div>
                <div className="d-flex justify-content-between align-items-end gap g-2">
                  <div className="flex-grow-1">
                    <div className="smaller">
                      <strong className="text-base">{totalRegisters}</strong> {t("homecommerce.New_Register")}
                      <span className="d-block">{t("homecommerce.During_Year")}</span>
                    </div>
                    {/* <div className="d-flex align-items-center mt-1">
                      <div className="amount h2 mb-0 fw-bold">
                        {totalRegisters}
                      </div>
                      <div className="change up smaller ms-1">
                        <Icon name="trend-up"></Icon> 38
                      </div>
                    </div> */}
                  </div>
                  <div className="nk-chart-ecommerce-activity">
                    <ChartLine data={registerChart} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xxl="8">
            <Card className="h-100">
              <Row className="g-0 col-sep col-sep-md">
                <Col md="8">
                  <Card.Body>
                    <div className="card-title-group mb-4">
                      <div className="card-title">
                        <h4 className="title">
                          {t("homecommerce.Selling")}
                        </h4>
                      </div>
                    </div>
                    <div className="nk-chart-ecommerce-total-profit">
                      <ChartBar data={totalProfitChart} />
                    </div>
                  </Card.Body>
                </Col>
                <Col md="4">
                  <Card.Body>
                    <div className="total-profit-data">
                      <div className="amount-wrap pb-4">
                        <div className="amount h2 mb-0 fw-bold">
                          {t("homecommerce.Earning")}
                        </div>
                      </div>
                      <ul className="nk-data-list-group d-flex flex-column flex-sm-row flex-md-column gap g-4">
                        <li className="nk-data-list-item">
                          <Media shape="circle" variant="primary-soft">
                            <Icon name="coin-alt"></Icon>
                          </Media>
                          <div className="amount-wrap">
                            <div className="amount h3 mb-0">
                              {totalIncome} €
                            </div>
                            <span className="smaller">{t("homecommerce.Total_Income")}</span>
                          </div>
                        </li>
                        <li className="nk-data-list-item">
                          <Media shape="circle" variant="success-soft">
                            <Icon name="coins"></Icon>
                          </Media>
                          <div className="amount-wrap">
                            <div className="amount h3 mb-0">
                              {totalCashIncome} €
                            </div>
                            <span className="smaller">{t("homecommerce.Cash_Income")}</span>
                          </div>
                        </li>
                        <li className="nk-data-list-item">
                          <Media shape="circle" variant="secondary-soft">
                            <Icon name="qr"></Icon>
                          </Media>
                          <div className="amount-wrap">
                            <div className="amount h3 mb-0">
                              {totalQrIncome} €
                            </div>
                            <span className="smaller">{t("homecommerce.QR_Income")}</span>
                          </div>
                        </li>
                      </ul>
                      {/* <div className="pt-5">
                        <Button href="#" variant="primary">
                          {t("homecommerce.Report")} 
                        </Button>
                      </div> */}
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xxl="4">
            <Row className="g-gs">
              <Col sm="6" xl="3" xxl="6">
                <Card className="h-100">
                  <Card.Body>
                    <Media shape="circle" variant="warning" className="mb-3">
                      <Icon name="sign-mxn"></Icon>
                    </Media>
                    <h5>{t("homecommerce.Deposit")}</h5>
                    <div className="d-flex align-items-center mb-3">
                      <div className="amount h4 mb-0">
                        {totalDeposited} €
                      </div>
                    </div>
                    <p className="small">
                      {t("homecommerce.Current_Deposit")}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="6" xl="3" xxl="6">
                <Card className="h-100">
                  <Card.Body>
                    <Media shape="circle" variant="success" className="mb-3">
                      <Icon name="gift"></Icon>
                    </Media>
                    <h5>{t("homecommerce.Product")}</h5>
                    <div className="d-flex align-items-center mb-3">
                      <div className="amount h4 mb-0">
                        {dashboardData.products.total_product}
                      </div>
                    </div>
                    <p className="small">
                      {t("homecommerce.Current_Product")}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="12" xl="6" xxl="12">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <div className="amount h4 mb-0">
                      {dashboardData.running_version.version}
                    </div>
                    <div className="amount h6 mb-0">
                      {dashboardData.running_version.comment}
                    </div>
                    <div className="nk-chart-ecommerce-total-revenue">
                      <ChartLine data={totalRevenueChart} />
                    </div>
                    <p className="small mt-3">{t("homecommerce.Current_AppVersion")}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          {/* <Col xxl="6">
            <Card className="h-100">
              <Card.Body className="flex-grow-0 py-2">
                <div className="card-title-group">
                  <div className="card-title">
                    <h4 className="title">{t("homecommerce.Vending_Machine")}</h4>
                  </div>
                  <div className="card-tools">
                    <Dropdown>
                      <Dropdown.Toggle
                        size="sm"
                        as={CustomDropdownToggle}
                        className="btn btn-sm btn-icon btn-zoom me-n1"
                      >
                        <Icon name="more-v"></Icon>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-sm"
                        as={CustomDropdownMenu}
                        align="end"
                      >
                        <Dropdown.Header className="py-2">
                          <h6 className="mb-0">{t("Options.Title")}</h6>
                        </Dropdown.Header>
                        <Dropdown.Divider className="mt-0" />
                        <Dropdown.Item>{t("Options.Low_T_High")}</Dropdown.Item>
                        <Dropdown.Item>{t("Options.High_T_Low")}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Card.Body>
              <Table responsive className="table-middle mb-0">
                <thead className="table-light table-head-sm">
                  <tr>
                    <th className="tb-col">
                      <OverlineTitle tag="span">{t("homecommerce.Col_Machine")}</OverlineTitle>
                    </th>
                    <th className="tb-col tb-col-end tb-col-sm">
                      <OverlineTitle tag="span">{t("homecommerce.Col_Agent")}</OverlineTitle>
                    </th>
                    <th className="tb-col tb-col-end tb-col-sm">
                      <OverlineTitle tag="span">{t("homecommerce.Col_Status")}</OverlineTitle>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.machines.alert_machines.map(
                    (machine, index) => (
                      <tr key={"alert-machine-" + index}>
                        <td className="tb-col">
                          <MediaGroup>
                            <MediaText>
                              <span className="title">
                                {machine.serial_number}
                              </span>
                            </MediaText>
                          </MediaGroup>
                        </td>
                        <td className="tb-col tb-col-end tb-col-sm">
                          <span className="small">{machine.agent_id}</span>
                        </td>
                        <td className="tb-col tb-col-end tb-col-sm">
                          <Badge className="text-bg-danger-soft">
                            {machine.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </Col> */}
          {/* <Col xxl="6">
            <Card className="h-100">
              <Card.Body>
                <div className="card-title-group">
                  <div className="card-title">
                    <h4 className="title">{t("homecommerce.Sale_Analytic")}</h4>
                  </div>
                  <div className="card-tools">
                    <Dropdown>
                      <Dropdown.Toggle
                        size="sm"
                        as={CustomDropdownToggle}
                        className="btn btn-sm btn-icon btn-zoom me-n1"
                      >
                        <Icon name="more-v"></Icon>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu-sm"
                        as={CustomDropdownMenu}
                        align="end"
                      >
                        <Dropdown.Header className="py-2">
                          <h6 className="mb-0">{t("Options.Title")}</h6>
                        </Dropdown.Header>
                        <Dropdown.Divider className="mt-0" />
                        <Dropdown.Item>7  {t("Options.Days")}</Dropdown.Item>
                        <Dropdown.Item>15 {t("Options.Days")}</Dropdown.Item>
                        <Dropdown.Item>30 {t("Options.Days")}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="nk-chart-ecommerce-sales-analytics mt-3">
                  <ChartLine data={salesAnalyticsChart} />
                </div>
                <ChartLegend.Group className="justify-content-center gap gx-4 pt-3">
                  <div className="gap-col">
                    <ChartLegend symbol="warning">{t("homecommerce.Total_Sale")}</ChartLegend>
                  </div>
                  <div className="gap-col">
                    <ChartLegend symbol="danger">{t("homecommerce.Total_Order")}</ChartLegend>
                  </div>
                </ChartLegend.Group>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      )}
    </Layout>
  );
}

export default HomeEcommerce;
