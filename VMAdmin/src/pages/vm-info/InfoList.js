import {useEffect, useState} from "react";
import {Card, Button, Row, Col} from "react-bootstrap";
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

function VMInfoList() {
  const [infoList, setInfoList] = useState([]);
  const { t, i18n } = useTranslation("global");

  const getInfoList = () => {
    requestTokenPost(
      "/api/info/list",
      {},
      function (result) {
        if (result.data.status == "success") setInfoList(result.data.data);
      },
      function (error) {
        toast.error(`${t("Messages.Fail_list_Info_MSG")}`);
      }
    );
  };

  const deleteInfo = (infoId) => {
    Swal.fire({
      title: `${t("Information.Remove")}`,
      text: `${t("Information.Remove_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          "/api/info/delete",
          {id: infoId},
          function (result) {
            if (result.data.status == "success") {
              toast.success(`${t("Messages.Success_Del_Info_MSG")}`);
              getInfoList();
            } else
              toast.error(result.status.message);
            return;
          },
          function (error) {
            toast.error(`${t("Messages.Fail_Del_Info_MSG")}`);
          }
        );
      }
    });
  };

  useEffect(() => {
    getInfoList();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      grow: 2,
      cell: (row) => (
        <MediaGroup>
          <Media to={`/vm-info/edit/${row._id}`} size="md">
            <Image
              src={`${config.serverUrl}/file/download/${btoa(row.thumbnail)}`}
              staticImage
            />
          </Media>
          <MediaText>
            <Link to={`/vm-info/edit/${row._id}`} className="title">
              {row.name}
            </Link>
          </MediaText>
        </MediaGroup>
      ),
      sortable: true,
    },
    {
      name: "Poster",
      selector: (row) => row.poster,
      cell: (row) => <span>{row.poster}</span>,
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      cell: (row) => <span>{row.unit}</span>,
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      cell: (row) => <span>{row.value}</span>,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: "Updated Date",
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: "action",
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-info/edit/${row._id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteInfo(row._id)}
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
            <Block.Title tag="h2">{t("Information.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Information.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            {/* <ul className="d-flex">
              <li>
                <Link
                  to="/vm-info/add"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>Add</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vm-info/add"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>Add Information</span>
                </Link>
              </li>
            </ul> */}
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        {/* <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={infoList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card> */}
        <Card>
          <Card.Body>
            <Row className="g-gs">
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/cloud.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Cloud")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/balancer.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Weight")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/battery.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Battery")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/hand.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Hand")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/liquid.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Capacity")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="3">
                <Card className="p-3 text-center">
                  <Card.Img variant="top" src="../images/infos/ruler.svg" />
                  <Card.Body>
                    <Card.Title>{t("Information.Length")}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMInfoList;
