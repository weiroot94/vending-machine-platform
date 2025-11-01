import {useEffect, useState} from "react";
import {Card, Button} from "react-bootstrap";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import {Icon, Image, MediaText, Media, MediaGroup} from "../../components";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import DataTable from "../../components/DataTable/DataTable";
import {requestTokenPost} from "../../service";
import {config} from "../../config";
import { useTranslation } from "react-i18next";

function VMTypeList() {
  const [productList, setProductList] = useState([]);
  const { t, i18n } = useTranslation("global");

  const getProductList = () => {
    requestTokenPost(
      "/api/product/list",
      {},
      function (result) {
        if (result.data.status == "success") {
          setProductList(result.data.data);
        }
      },
      function (error) {}
    );
  };

  const deleteProduct = (productId) => {
    Swal.fire({
      title: `${t("Product.Delete")}`,
      text: `${t("Product.Delete_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          "/api/product/delete",
          {id: productId},
          function (res) {
            toast.success(res.data.message);
            getProductList();
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
    getProductList();
  }, []);

  const columns = [
    {
      name: `${t("Product.Col_Name")}`,
      selector: (row) => (i18n.language == "en" ? row.name: row.name_de),
      grow: 2,
      cell: (row) => (
        <MediaGroup>
          <Media to={`/vm-product/edit/${row._id}`} size="md">
            <Image
              src={`${config.serverUrl}/file/download/${btoa(row.thumbnail)}`}
              staticImage
            />
          </Media>
          <MediaText>
            <Link to={`/vm-product/edit/${row._id}`} className="title">
              {(i18n.language == "en" ? row.name: row.name_de)}
            </Link>
          </MediaText>
        </MediaGroup>
      ),
      sortable: true,
    },
    {
      name: `${t("Product.Col_Category")}`,
      selector: (row) => row.category,
      cell: (row) => row.category == 'ecig' ?  `${t("Product.Category_EC")}` :
            row.category == 'snack' ? `${t("Product.Category_Snack")}` : `${t("Product.Category_Drink")}`,
      sortable: true,
    },
    {
      name: `${t("Product.Col_Feature")}`,
      selector: (row) => row.isfeatured,
      cell: (row) => row.isfeatured ? <span>{t("Options.Yes")}</span> : <span>{t("Options.No")}</span>,
      sortable: true,
    },
    {
      name: `${t("Product.Col_Price")}`,
      selector: (row) => row.price,
      cell: (row) => <span>{row.price}</span>,
      sortable: true,
    },
    {
      name: `${t("Product.Col_Currency")}`,
      selector: (row) => row.currency,
      cell: (row) => <span>{row.currency}</span>,
      sortable: true,
    },
    {
      name: `${t("Product.Col_Created")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Product.Col_Updated")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Product.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-product/edit/${row._id}`} className="btn border-0 p-0">
            <Button variant="outline-primary" size="sm">
              <Icon name="edit"></Icon>
            </Button>
          </Link>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => deleteProduct(row._id)}
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
            <Block.Title tag="h2">{t("Product.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Product.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/vm-product/add"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="plus" />
                  <span>{t("Options.Add")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/vm-product/add"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="plus" />
                  <span>{t("Product.Add")}</span>
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
            data={productList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMTypeList;
