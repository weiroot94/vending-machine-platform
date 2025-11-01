import { useEffect, useState } from "react";
import {Card, Button, Table, Badge, Form, InputGroup} from "react-bootstrap";
import { toast } from "react-toastify";
import {Link} from "react-router-dom";
import { Icon, MediaGroup, MediaText, OverlineTitle } from "../../components";
import DateRangePicker from "../../components/Form/DateRangePicker";
import Layout from "../../layout/default";
import DataTable from "../../components/DataTable/DataTable";
import Block from "../../components/Block/Block";
import {requestTokenPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMSales() {

  const MonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [salesList, setSalesList] = useState([])
  const [selectedOrder, setSelectedOrder] = useState()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { t } = useTranslation("global");

  const loadOrderData = (row) => {
    console.log(row)
    setSelectedOrder(row)
  }

  const columns = [
    // {
    //   name: `${t("Sale.Col_ORDER")}`,
    //   selector: (row) => row.order_id,
    //   cell: (row) => <span>#{row.order_id}</span>,
    //   sortable: true,
    // },
    {
      name: `${t("Sale.Col_Vending")}`,
      selector: (row) => row.machine,
      cell: (row) => <span>{row.machine}</span>,
      grow: 1.5,
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Product")}`,
      selector: (row) => row.items,
      cell: (row) => <span>{row.product}</span>,
      grow: 2,
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Amount")} (€)`,
      selector: (row) => row.items,
      cell: (row) => <span>{row.total_amount}</span>,
      grow: 0.8,
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Payment")}`,
      selector: (row) => row.items,
      cell: (row) => <span>{row.payment.toUpperCase() == "QR"? t("Sale.QR"): t("Sale.Cash")}</span>,
      grow: 0.8,
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Date")}`,
      selector: (row) => row.created_at,
      cell: (row) => <span>{row.created_at}</span>,
      grow: 2,
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Status")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <div className="blank">
          {row.status.toUpperCase() == "PENDING" 
          ? <span className="badge text-bg-warning-soft" style={{ width: "80px" }}>{t("Sale.Pending")}</span>
          : <span className="badge text-bg-success-soft" style={{ width: "80px" }}>{t("Sale.Success")}</span>
          }
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Sale.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Button
            variant="outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            size="sm"
            onClick={() => loadOrderData(row)}
          >
            <Icon name="eye"></Icon>
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {

    const params = {
      year: year,
      month: month
    }

    requestTokenPost(
      "/api/sales/list",
      params,
      function (result) {
        if (result.data.status == "success")
          setSalesList(result.data.details);
      },
      function (error) {
        toast.error(`${t("Messages.Fail_List_Sales_MSG")}`);
      }
    );
  }, [year, month])

  return (
    <Layout title="Sales" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Sale.List")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Sale.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li style={{ display: 'flex',  width: '600px', flexDirection : 'row', justifyContent: 'end', gap: '30px' }}>
                <Form.Group className="form-group w-25 mb-3 me-1">
                  <div className="form-control-wrap d-flex justify-content-center align-items-center gap-1">
                    {t("Date.Year")}: 
                    <select
                      className="form-control"
                      onChange={(event) => {
                        console.log(event.target.value)
                        setYear(event.target.value)
                      }}
                      value={year}
                    >
                      <option value="">{t("Date.Sel_Year")}</option>
                      <option value={new Date().getFullYear()+1}>{new Date().getFullYear()+1}</option>
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                      <option value={new Date().getFullYear()-1}>{new Date().getFullYear()-1}</option>
                    </select>
                  </div>
                </Form.Group>
                <Form.Group className="form-group w-25 mb-3">
                  <div className="form-control-wrap d-flex justify-content-center align-items-center gap-1">
                    {t("Date.Month")}: 
                    <select
                      className="form-control"
                      onChange={(event) => {
                        setMonth(event.target.value)
                      }}
                      value={month}
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
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={salesList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                {t("Sale.Detail_Title")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {
                selectedOrder && (
                  <>
                    {/* <div className="mb-2">
                      <strong>{t("Sale.Detail_Order")} </strong> #{selectedOrder.order_id}
                    </div> */}
                    <div className="mb-2">
                      <strong>{t("Sale.Detail_Machine")} </strong> {selectedOrder.machine}
                    </div>
                    { selectedOrder.orderer && 
                    <div className="mb-2">
                      <strong>{t("Sale.Order")} </strong> { selectedOrder.orderer.fullname }
                    </div>
                    }
                    <div className="mb-2">
                      <strong>{t("Sale.Detail_Payment")} </strong>
                      <span className="badge text-bg-success-soft fs-5">
                        {selectedOrder.payment.toUpperCase() == "QR"? t("Sale.QR"): t("Sale.Cash")}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>{t("Sale.Detail_Status")} </strong>
                      <span className="badge text-bg-success-soft fs-5">
                        {selectedOrder.status.toUpperCase() == "PENDING"? t("Sale.Pending"): t("Sale.Success")}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong>{t("Sale.Detail_Date")} </strong> {selectedOrder.created_at}
                    </div>
                    <div className="mb-2">
                      <strong>{t("Sale.Detail_Types")} </strong>
                    </div>
                    <Table responsive className="table-middle mb-0">
                      <thead className="table-light table-head-sm">
                        <tr>
                          <th className="tb-col">
                            <OverlineTitle tag="span">{t("Sale.Types_Title")}</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">{t("Sale.Types_Price")}(€)</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end tb-col-sm">
                            <OverlineTitle tag="span">{t("Sale.Types_Count")}</OverlineTitle>
                          </th>
                          <th className="tb-col tb-col-end">
                            <OverlineTitle tag="span">{t("Sale.Types_Total")}(€)</OverlineTitle>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="tb-col">
                            <MediaGroup>
                              <MediaText>
                                <span className="title">{selectedOrder.product}</span>
                              </MediaText>
                            </MediaGroup>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <span className="small">{selectedOrder.product_price}</span>
                          </td>
                          <td className="tb-col tb-col-end tb-col-sm">
                            <span className="small">{selectedOrder.product_count}</span>
                          </td>
                          <td className="tb-col tb-col-end">
                            <span className="small">{selectedOrder.total_amount}</span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="1" className="tb-col tb-col-end tb-col-sm">
                            {t("Options.Total")}
                          </td>
                          <td className="tb-col tb-col-end">{selectedOrder.total_amount}(€)</td>
                        </tr>
                      </tfoot>
                    </Table>
                  </>
                )
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("Options.Close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VMSales;
