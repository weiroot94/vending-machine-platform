import {useEffect, useState} from "react";
import {Card, Button, ButtonGroup} from "react-bootstrap";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";

import {Icon} from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import {requestTokenPost} from "../../service";

import { useTranslation } from "react-i18next";

function VMUserList() {
  const [updateList, setUpdateList] = useState([]);
  const { t } = useTranslation("global");

  const getProductList = () => {
    requestTokenPost(
      "/api/changelog/list",
      {
        name: "vendingapp"
      },
      function (result) {
        console.log(result.data.data);
        setUpdateList(result.data.data);
      },
      function (error) {}
    );
  };

  const formateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  }

  const revertGitGommit = (sha) => {
    Swal.fire({
      title: `${t("History.Revert")}`,
      text: `${t("History.Revert_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      try {
        console.warn("revertGitGommit not implemented");
      } catch (error) {
        console.error('Error reverting commit:', error);
      }
    })
  }

  useEffect(() => {
    getProductList();
  }, []);

  const columns = [
    {
      name: `${t("History.Col_Version")}`,
      selector: (row) => row.version,
      cell: (row) => <span>{row.version}</span>,
      grow: 1,
      sortable: false,
    },
    {
      name: `${t("History.Col_Comment")}`,
      selector: (row) => row.comment,
      cell: (row) => <span>{row.comment}</span>,
      grow: 2,
      sortable: false,
    },
    {
      name: `${t("History.Col_Branchname")}`,
      selector: (row) => row.gitbranch,
      cell: (row) => <span>{row.gitbranch}</span>,
      grow: 2,
      sortable: false,
    },
    {
      name: `${t("History.Col_SHA")}`,
      selector: (row) => row.gitcommit,
      cell: (row) => (
        <span>{row.gitcommit}</span>
      ),
      grow: 6,
      sortable: false,
    },
    {
      name: `${t("History.Col_Updated")}`,
      selector: (row) => row.created_at,
      cell: (row) => (
        <span>{formateDate(row.created_at)}</span>
      ),
      sortable: false,
    },
    // {
    //   name: `${t("History.Col_Action")}`,
    //   cell: (row) => (
    //     <div className="text-end w-100">
    //       <Button
    //         variant="outline-danger"
    //         size="sm"
    //         onClick={() => revertGitGommit(row.sha)}
    //       >
    //         {t("History.Col_Revert")}
    //       </Button>
    //     </div>
    //   ),
    //   sortable: false,
    // },
  ];

  return (
    <Layout title="Updates" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("History.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("History.Update")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={updateList}
            columns={columns}
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMUserList;
