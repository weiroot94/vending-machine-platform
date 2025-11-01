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

function VMUserList() {
  const [userList, setUserList] = useState([]);
  const [type, setType] = useState("Administrators");
  const { t } = useTranslation("global");

  const getUserList = () => {
    requestTokenPost(
      `/api/user/list`,
      {},
      function (result) {
        result.data.data.map((user, index) => {
          user["balance"] = result.data.balance[index];
        });
        setUserList(result.data.data);
      },
      function (error) {
        toast.error(`${t("Messages.Fail_List_User_MSG")}`);
      }
    );
  };

  const deleteUser = (userId) => {
    Swal.fire({
      title: `${t("Users.Del_Title")}`,
      text: `${t("Users.Del_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          `/api/user/delete`,
          {
            id: userId,
          },
          function (result) {
            toast.success(result.data.message);
            getUserList();
          },
          function (error) {
            console.log(error);
            toast.error(`${t("Messages.Fail_Del_User_MSG")}`);
          }
        );
      }
    });
  };

  useEffect(() => {
    getUserList();
  }, []);

  const customer_columns = [
    {
      name: `${t("Users.Col_Name")}`,
      selector: (row) => row.fullname,
      cell: (row) => <span>{row.fullname}</span>,
      sortable: true,
    },
    {
      name: `${t("Users.Col_Email")}`,
      grow: 3,
      selector: (row) => row.email,
      cell: (row) => <span>{row.email}</span>,
      sortable: true,
    },
    {
      name: `${t("Users.Col_Balance")}`,
      selector: (row) => row.balance,
      cell: (row) => <span>{row.balance}</span>,
      sortable: true,
    },
    {
      name: `${t("Users.Col_Role")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <div className="blank">
          {row.role == "administrator" ? (
            <span className="badge text-bg-success-soft" style={{ width: "100px" }}>{t("Users.Admin_Type")}</span>
          ) : row.role == "agent" ? (
            <span className="badge text-bg-info-soft" style={{ width: "100px" }}>{t("Users.Agent_Type")}</span>
          ) : (
            <span className="badge text-bg-danger-soft" style={{ width: "100px" }}>{t("Users.ADS_Type")}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Subscribe")}`,
      selector: (row) => row.subscribed,
      cell: (row) => (
        <div className="blank">
          {row.subscribed ? (
            <span className="badge text-bg-success-soft" style={{ width: "50px" }}>{t("Options.Yes")}</span>
          ) : (
            <span className="badge text-bg-info-soft" style={{ width: "50px" }}>{t("Options.No")}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Joined")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Updated")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-user/edit/${row._id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteUser(row._id)}
          >
            <Icon name="trash"></Icon>
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  const columns = [
    {
      name: `${t("Users.Col_Name")}`,
      selector: (row) => row.fullname,
      cell: (row) => <span>{row.fullname}</span>,
      sortable: true,
    },
    {
      name: `${t("Users.Col_Email")}`,
      grow: 3,
      selector: (row) => row.email,
      cell: (row) => <span>{row.email}</span>,
      sortable: true,
    },
    {
      name: `${t("Users.Col_Role")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <div className="blank">
          {row.role == "administrator" ? (
            <span className="badge text-bg-success-soft" style={{ width: "100px" }}>{t("Users.Admin_Type")}</span>
          ) : row.role == "agent" ? (
            <span className="badge text-bg-info-soft" style={{ width: "100px" }}>{t("Users.Agent_Type")}</span>
          ) : (
            <span className="badge text-bg-danger-soft" style={{ width: "100px" }}>{t("Users.ADS_Type")}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Subscribe")}`,
      selector: (row) => row.subscribed,
      cell: (row) => (
        <div className="blank">
          {row.subscribed ? (
            <span className="badge text-bg-success-soft" style={{ width: "50px" }}>{t("Options.Yes")}</span>
          ) : (
            <span className="badge text-bg-info-soft" style={{ width: "50px" }}>{t("Options.No")}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Joined")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Updated")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Users.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-user/edit/${row._id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteUser(row._id)}
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
            <Block.Title tag="h2">{t("Users.Users")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Users.Users")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to={`/vm-user/add/${type}`}
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Options.Add")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/vm-user/add/${type}`}
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Users.Add")}</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <ButtonGroup
          aria-label="Basic radio toggle button group"
          className="mb-5"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
          />
          <Button
            as="label"
            variant={type == "Administrators" ? "primary" : "outline-primary"}
            htmlFor="btnradio1"
            onClick={() => {
              setType("Administrators");
            }}
          >
            {t("Users.Administrator")}
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
            variant={type == "Customers" ? "primary" : "outline-primary"}
            htmlFor="btnradio2"
            onClick={() => {
              setType("Customers");
            }}
          >
            {t("Users.Customer")}
          </Button>
        </ButtonGroup>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={
              type == "Administrators"
                ? userList.filter((user) => user.role != "agent")
                : userList.filter((user) => user.role == "agent")
            }
            columns={type == "Administrators"? columns: customer_columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMUserList;
