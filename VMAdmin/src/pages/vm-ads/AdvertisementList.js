import {useEffect, useState} from "react";
import {Card, Button} from "react-bootstrap";
import Swal from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { checkAdblock } from '@hs-web-team/adblocker-detect';
import {Icon} from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import {requestTokenPost} from "../../service";
import { useTranslation } from "react-i18next";

function VMAdvertisementList() {
  const [adsList, setAdsList] = useState([]);
  const [adbInstalled, setAdbInstalled] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("global");

  const getAdvertisementList = () => {
    requestTokenPost(
      "/api/ads/list",
      {},
      function (result) {
        if (result.data.status == "success") setAdsList(result.data.data);
      },
      function (error) {
        toast.error(`${t("Messages.Fail_Get_Adver_MSG")}`);
      }
    );
  };

  const deleteAdvertisement = (adsId) => {
    Swal.fire({
      title: `${t("Advertisement.Delete")}`,
      text: `${t("Advertisement.Del_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          "/api/ads/delete",
          {id: adsId},
          function (result) {
            if (result.data.status == "success") {
              toast.success(`${t("Advertisement.Del_Finished")}`);
              getAdvertisementList();
            } else
              toast.error(result.status.message);
            return;
          },
          function (error) {
            toast.error(`${t("Messages.Fail_Del_Adver_MSG")}`);
          }
        );
      }
    });
  };

  const onClickAddNewAd = () => {
    if (adbInstalled) {
      toast.error(`${("Messages.Disable_Blocker_Extension_MSG")}`);
      return;
    } else {
      navigate("/vm-ads/add");
    }
  }

  const initialProc = async () => {
    const adblocker = await checkAdblock();
    if (adblocker) {
      setAdbInstalled(true);
      Swal.fire({
        title: `${t("Advertisement.Blocker_Detect")}`,
        text: `${t("Advertisement.Blocker_Desc")}`,
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    } else {
      // ads api can be called successfully when ad blocker is disabled
      getAdvertisementList();
    }
  };

  useEffect(() => {
    initialProc();
  }, []);

  const columns = [
    {
      name: `${t("Advertisement.Col_Title")}`,
      selector: (row) => row.title,
      grow: 2,
      cell: (row) => <span>{row.title}</span>,
      sortable: true,
    },
    {
      name: `${t("Advertisement.Col_Type")}`,
      selector: (row) => row.type,
      cell: (row) => (
        <div className="blank">
          {row.type == "PPT" ? (
            <span className="badge text-bg-success-soft fs-6">{row.type}</span>
          ) : (
            <span className="badge text-bg-info-soft fs-6">{row.type}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: `${t("Advertisement.Col_Poster")}`,
      selector: (row) => row.poster,
      cell: (row) => <span>{row.poster}</span>,
    },
    {
      name: `${t("Advertisement.Col_Created")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Advertisement.Col_Updated")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Options.Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-ads/edit/${row._id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteAdvertisement(row._id)}
          >
            <Icon name="trash"></Icon>
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Layout title="Advertisement" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Advertisement.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Advertisement.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <div
                  className="btn btn-primary btn-md d-md-none"
                  onClick={onClickAddNewAd}
                >
                  <Icon name="plus" />
                  <span>{t("Options.Add")}</span>
                </div>
              </li>
              <li>
                <div
                  className="btn btn-primary d-none d-md-inline-flex"
                  onClick={onClickAddNewAd}
                >
                  <Icon name="plus" />
                  <span>{t("Advertisement.Add")}</span>
                </div>
              </li>
            </ul>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={adsList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMAdvertisementList;
