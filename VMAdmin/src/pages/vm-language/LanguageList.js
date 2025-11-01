import {useEffect, useState} from "react";
import {Card, Button, ButtonGroup} from "react-bootstrap";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {Icon, MediaGroup, Media, MediaText, Image} from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import {requestTokenPost} from "../../service";
import {config} from "../../config";
import { useTranslation } from "react-i18next";

function VMLanguageList() {
  const [langList, setLangList] = useState([]);
  const [langType, setLangType] = useState("VMApp");
  const { t } = useTranslation("global");

  const getLangList = () => {
    requestTokenPost(
      "/api/language/list",
      {},
      function (result) {
        if (result.data.status == "success") setLangList(result.data.data);
      },
      function (error) {
        toast.error(`${t("Messages.Fail_List_Language_MSG")}`);
      }
    );
  };

  const deleteLang = (languageId) => {
    Swal.fire({
      title: `${t("Language.Remove")}`,
      text: `${t("Language.Remove_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          "/api/language/delete",
          {id: languageId},
          function (res) {
            toast.success(res.data.message);
            getLangList();
          },
          function (err) {
            if (err.response && (err.response.status == 400 || err.response.status == 500)) {
              toast.error(err.response.data.error);
            } else {
              console.log(err);
              throw err;
            }
          }
        );
      }
    });
  };

  useEffect(() => {
    getLangList();
  }, []);

  const columns = [
    {
      name: `${t("Language.Col_Language")}`,
      selector: (row) => row.name,
      cell: (row) => (
        <MediaGroup>
          <Media to={`/vm-language/edit/${row._id}`} size="md">
            <Image
              src={`${config.serverUrl}/file/download/${btoa(row.thumbnail)}`}
              staticImage
            />
          </Media>
          <MediaText>
            <Link to={`/vm-language/edit/${row._id}`} className="title">
              {row.name}
            </Link>
          </MediaText>
        </MediaGroup>
      ),
      sortable: true,
    },
    {
      name: `${t("Language.Col_Created")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Language.Col_Updated")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Language.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link
            to={`/vm-language/edit/${row._id}`}
            className="btn border-0 p-0"
          >
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteLang(row._id)}
          >
            <Icon name="trash"></Icon>
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Layout title="Info" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Language.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Language.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to={`/vm-language/add/${langType}`}
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Language.Add")}</span>
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
            variant={langType == "VMApp" ? "primary" : "outline-primary"}
            htmlFor="btnradio1"
            onClick={() => {
              setLangType("VMApp");
            }}
          >
            {t("Language.App")}
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
            variant={langType == "VMAdmin" ? "primary" : "outline-primary"}
            htmlFor="btnradio2"
            onClick={() => {
              setLangType("VMAdmin");
            }}
          >
            {t("Language.Admin_Site")}
          </Button>
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio3"
            autoComplete="off"
          />
          <Button
            as="label"
            variant={langType == "VMCustomer" ? "primary" : "outline-primary"}
            htmlFor="btnradio3"
            onClick={() => {
              setLangType("VMCustomer");
            }}
          >
            {t("Language.Custom_Site")}
          </Button>
        </ButtonGroup>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={
              langType == "VMApp" ?
              langList.filter((lang) => lang.role == "VMApp") :
                langType == "VMAdmin" ?
                langList.filter((lang) => lang.role == "VMAdmin") :
                langList.filter((lang) => lang.role == "VMCustomer")
            }
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMLanguageList;
