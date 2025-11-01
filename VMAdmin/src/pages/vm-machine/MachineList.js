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

function VMMachineList() {
  const role = JSON.parse(window.localStorage.getItem("vending_user")).role;
  const [machineList, setMachineList] = useState([]);
  const [adbInstalled, setAdbInstalled] = useState(false);
  const { t } = useTranslation("global");
  const navigate = useNavigate();

  const getMachineList = () => {
    requestTokenPost(
      "/api/machine/list",
      {},
      function (result) {
        if (result?.data?.status == "success") {
          setMachineList(result.data?.data);
        }
      },
      function (error) {
        toast.error(`${t("Messages.Fail_List_Machine_MSG")}`);
      }
    );
  };

  const deleteInfo = (machineId) => {
    Swal.fire({
      title: `${t("Machine.Delete")}`,
      text: `${t("Machine.Delete_Descrip")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("Options.Yes")}`,
      cancelButtonText: `${t("Options.Cancel")}`
    }).then((result) => {
      if (result.value) {
        requestTokenPost(
          "/api/machine/delete",
          {id: machineId},
          function (res) {
            toast.success(res.data.message);
            getMachineList();
          },
          function (err) {
            if (err.response && (err.response.status == 400 || err.response.status == 500)) {
              toast.error(err.response.data.error);
            } else {
              console.log(err);
              toast.error(`${t("Messages.Fail_Del_Machine_MSG")}`);
            }
          }
        );
      }
    });
  };

  const initialProc = async () => {
    const adblocker = await checkAdblock();
    if (adblocker) {
      setAdbInstalled(true);
      Swal.fire({
        title: `${t("Messages.Block_Detect_MSG")}`,
        text: `${t("Messages.Block_Notice_MSG")}`,
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    } else {
      // api can be called successfully when ad blocker is disabled
      getMachineList();
    }
  };

  useEffect(() => {
    initialProc();
  }, []);

  const columns = [
    {
      name: `${t("Machine.Col_Serial")}`,
      selector: (row) => row.serial_number,
      grow: 2,
      cell: (row) => <span>{row.serial_number}</span>,
      sortable: true,
    },
    {
      name: `${t("Machine.Col_Agent")}`,
      selector: (row) => row.agent,
      cell: (row) => <span>{row.agent}</span>,
      sortable: true,
    },
    // {
    //   name: `${t("Machine.Col_Cash") + " (€)"}`,
    //   selector: (row) => row.cash_list,
    //   cell: (row) => (
    //     <span>
    //       {row.cash_list.reduce((sum, item) => {
    //         const cash_item = parseInt(item.value) * parseInt(item.name);
    //         return sum + cash_item;
    //       }, 0)}
    //     </span>
    //   ),
    //   sortable: true,
    // },
    {
      name: `${t("Machine.Col_Status")}`,
      selector: (row) => row.value,
      cell: (row) => row.activated ? row.online ?
        <span className="badge text-bg-success-soft">{t("Machine.Online")}</span>
        :
        <span className="badge text-bg-danger-soft">{t("Machine.Offline")}</span>
        :
        <span className="badge text-bg-warning-soft">{t("Machine.Locked")}</span>,
      sortable: true,
    },
    {
      name: `${t("Machine.Col_Created")}`,
      selector: (row) => row.items,
      cell: (row) => (
        <span>{new Date(row.created_at).toLocaleString("de-DE")}</span>
      ),
      sortable: true,
    },
    {
      name: `${t("Machine.Col_Expiration")}`,
      selector: (row) => row.items,
      cell: (row) => row.activated ? 
        <span>{row.expDate} </span>
        :
        <span>{t("Options.Not_Available")}</span>,
      sortable: true,
    },
    {
      name: `${t("Machine.Col_Action")}`,
      cell: (row) => (
        <div className="text-end w-100">
          <Link to={`/vm-machine/edit/${row._id}`} className="btn border-0 p-0">
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

  const onClickAddNewMachine = () => {
    if (adbInstalled) {
      toast.error(`${("Messages.Disable_Block_MSG")}`);
      return;
    } else {
      navigate("/vm-machine/add");
    }
  }

  return (
    <Layout title="Machines" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Machine.Title")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Machine.Title")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {role && (role == "administrator" || role == "agent") && (
            <Block.HeadContent>
              <ul className="d-flex">
                <li>
                  <div
                    className="btn btn-primary btn-md d-md-none"
                    onClick={onClickAddNewMachine}
                  >
                    <Icon name="plus" />
                    <span>{t("Options.Add")}</span>
                  </div>
                </li>
                <li>
                  <div
                    className="btn btn-primary d-none d-md-inline-flex"
                    onClick={onClickAddNewMachine}
                  >
                    <Icon name="plus" />
                    <span>{t("Machine.Add")}</span>
                  </div>
                </li>
              </ul>
            </Block.HeadContent>
          )}
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Card>
          <DataTable
            tableClassName="data-table-head-light table-responsive data-table-checkbox"
            data={machineList}
            columns={columns}
            selectableRows
          ></DataTable>
        </Card>
      </Block>
    </Layout>
  );
}

export default VMMachineList;
