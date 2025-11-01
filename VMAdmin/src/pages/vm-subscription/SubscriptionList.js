import { useEffect, useState } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Icon } from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import { requestTokenPost } from "../../service";
import { useTranslation } from "react-i18next";

function SubscriptionList() {
  const [subscriptionList, setSubscriptionList] = useState([]);
  const { t } = useTranslation("global");

  const getSubscriptionList = () => {
    requestTokenPost(
      `/api/subscription/list`,
      {},
      function (result) {
        setSubscriptionList(result.data.data);
      },
      function (err) {
        if (err.response && (err.response.status == 400 || err.response.status == 500)) {
          toast.error(err.response.data.error);
        } else {
          console.log(err);
          toast.error(`${("Messages.Fail_List_Subscript_MSG")}`);
        }
      }
    );
  };

  const sendSubscription = (id) => {
    toast.info(`${("Messages.Send_Bulk_MSG")}`)
    requestTokenPost(
      `/api/subscription/send`,
      { id },
      function (result) {
        toast.success(result.data.message);
        getSubscriptionList();
      },
      function (error) {
        console.log(error);
        toast.error(`${("Messages.Fail_Send_MSG")}`);
      }
    );
  };

  const deleteSubscription = (id) => {
    Swal.fire({
      title: `${t("Subscription.Delete")}`,
      text: `${t("Messages.Delete_MSG")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          `/api/subscription/delete`,
          { id },
          function (result) {
            toast.success(result.data.message);
            getSubscriptionList();
          },
          function (error) {
            console.log(error);
            toast.error(`${("Messages.Fail_Del_Sub_MSG")}`);
          }
        );
      }
    });
  };

  useEffect(() => {
    getSubscriptionList();
  }, []);

  const columns = [
    {
      name: `${t("Subscription.Col_Subject")}`,
      grow: 3,
      selector: (row) => row.subject,
      cell: (row) => <span>{row.subject}</span>,
      sortable: true,
    },
    {
      name: `${t("Subscription.Col_Create")}`,
      selector: (row) => row.createdAt,
      cell: (row) => <span>{row.createdAt}</span>,
      sortable: true,
    },
    {
      name: `${t("Subscription.Col_Updated")}`,
      selector: (row) => row.updatedAt,
      cell: (row) => <span>{row.updatedAt}</span>,
      sortable: true,
    },
    {
      name: `${t("Subscription.Col_Delivered")}`,
      selector: (row) => row.sentAt,
      cell: (row) => (
        <div className="blank">
          {row.sentAt ? (
            <span className="badge text-bg-success-soft">{row.sentAt}</span>
          ) : (
            <span className="badge text-bg-info-soft">`${t("Subscription.NotYet")}`</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Subscription.Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => sendSubscription(row.id)}
          ><Icon name="send"></Icon>
          </Button>
          <Link to={`/vm-subscription/edit/${row.id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteSubscription(row.id)}
          >
            <Icon name="trash"></Icon>
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Layout title="Users" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Subscription.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Subscription.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/vm-subscription/add"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Options.Add")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vm-subscription/add"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Subscription.Add")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={subscriptionList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default SubscriptionList;
