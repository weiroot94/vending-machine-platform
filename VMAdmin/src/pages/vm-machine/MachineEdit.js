import { useEffect, useState, useRef } from "react";
import { Card, Form, Row, Col, Button, ListGroup } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleMapReact from "google-map-react";
import StepWizard from "react-step-wizard";
import { checkAdblock } from '@hs-web-team/adblocker-detect';
import Swal from "sweetalert2";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { config } from "../../config";
import { formPost, requestTokenPost, requestTokenPostAsync } from "../../service";
import MarkerContainer from "./MarkerContainer";
import { Autocomplete } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

function VMMachineEdit() {
  const stepWizard = useRef(null);
  const { id } = useParams();
  const role = JSON.parse(window.localStorage.getItem("vending_user")).role;
  const { t } = useTranslation("global");
  const googleMapApiKey = config.googleMapApiKey;
  const infoList = [
    {
      name: `${t("Machine.Type_Cloud")}`,
      value: "cloud.svg",
      path: "../../images/infos/cloud.svg",
      unit: "mg",
    },
    {
      name: `${t("Machine.Type_Liquid")}`,
      value: "liquid.svg",
      path: "../../images/infos/liquid.svg",
      unit: "ml",
    },
    {
      name: `${t("Machine.Type_Ruler")}`,
      value: "ruler.svg",
      path: "../../images/infos/ruler.svg",
      unit: "cm",
    },
    {
      name: `${t("Machine.Type_Hand")}`,
      value: "hand.svg",
      path: "../../images/infos/hand.svg",
      unit: "k",
    },
    {
      name: `${t("Machine.Type_Balancer")}`,
      value: "balancer.svg",
      path: "../../images/infos/balancer.svg",
      unit: "mg",
    },
    {
      name: `${t("Machine.Type_Battery")}`,
      value: "battery.svg",
      path: "../../images/infos/battery.svg",
      unit: "mA",
    },
  ];

  const cashList = [
    {
      name: "5 ERO",
      value: "5",
    },
    {
      name: "10 ERO",
      value: "10",
    },
    {
      name: "20 ERO",
      value: "20",
    },
    {
      name: "50 ERO",
      value: "50",
    },
    {
      name: "100 ERO",
      value: "100",
    },
    {
      name: "200 ERO",
      value: "200",
    },
  ];

  const boxList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [firstWizardStep, setFirstWizardStep] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [adsList, setAdsList] = useState([]);

  const [licenseCode, setLicenseCode] = useState("");
  const [machineProductList, setMachineProductList] = useState([]);
  const [selectedTypeList, setSelectedTypeList] = useState([]);
  const [selectedAdsList, setselectedAdsList] = useState(null);
  const [selectedInfoList, setSelectedInfoList] = useState([]);
  const [selectedCashList, setSelectedCashList] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  const infoCheckRefs = useRef([]);
  const infoInputRefs = useRef([]);
  const productCheckRefs = useRef([]);
  const productStockInputRefs = useRef([]);
  const productBoxDropdownlistRefs = useRef([]);
  const cashCheckRefs = useRef([]);
  const cashInputRefs = useRef([]);

  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  const [position, setPosition] = useState({
    lat: 52.512772141670325,
    lng: 13.406185921060313,
  });
  const [isUpdated, setIsUpdated] = useState(false);

  const markerRef = useRef(null);

  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMaps(maps);
  };

  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      this.setState({ center: { lat, lng } });
    }
  };

  const handleSearch = (search_location) => {
    debugger;
    const locationName = search_location;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=YOUR_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setPosition({
            lat: lat,
            lng: lng,
          });
        }
      });
  };

  const handleLicenseInput = (event) => {
    const inputValue = event.target.value;
    const formattedValue = inputValue
      // Remove any non-alphanumeric characters
      .replace(/[^\w]/g, '')
      // Insert dashes at appropriate positions
      .replace(/(.{4})(?=.)/g, '$1-');

    // Ensure the length doesn't exceed 24 characters, including dashes
    if (formattedValue.length <= 24) {
      setLicenseCode(formattedValue.toUpperCase());
    }
  }

  const setInformation = (infoName, infoUnit, index) => {
    const tempInfoList = selectedInfoList;
    let filteredList = [];
    let isFind = false;

    tempInfoList.map((info, index) => {
      if (info.name === infoName) isFind = true;
      else filteredList.push(info);
    });

    if (isFind !== true) {
      filteredList.push({
        name: infoName,
        value: "",
        unit: infoUnit,
      });
    } else {
      infoInputRefs.current[index].value = "";
    }
    setSelectedInfoList(filteredList);
  };

  const setInformationComment = (infoName, comment, infoUnit, index) => {
    let tempInfoList = selectedInfoList;
    const foundIdx = tempInfoList.findIndex(info => info.name == infoName);

    if (comment == "") {
      if (foundIdx != -1)
        tempInfoList[foundIdx].value = 0;
    } else {
      if (foundIdx !== -1) {
        tempInfoList[foundIdx].value = parseInt(comment) + tempInfoList[foundIdx].unit;
      } else {
        let newVal = parseInt(comment) + infoUnit;
        tempInfoList.push({
          name: infoName,
          value: newVal,
          unit: infoUnit,
        });
      }
      infoCheckRefs.current[index].checked = true;
    }

    setSelectedInfoList(tempInfoList);
  };

  const setCash = (cashName, index) => {
    const tempCashList = selectedCashList;
    let filteredList = [];
    let isFind = false;

    tempCashList.map((cash, index) => {
      if (cash.name === cashName) isFind = true;
      else filteredList.push(cash);
    });

    if (isFind !== true) {
      filteredList.push({
        name: cashName,
        value: 0,
      });
    } else {
      cashInputRefs.current[index].value = "";
    }
    setSelectedCashList(filteredList);
  };

  const setCashComment = (cashName, comment, index) => {
    let tempCashList = selectedCashList;
    const foundIdx = tempCashList.findIndex(cash => cash.name == cashName);

    if (comment == "") {
      if (foundIdx != -1)
        tempCashList[foundIdx].value = 0;
    } else {
      if (foundIdx !== -1) {
        tempCashList[foundIdx].value = comment;
      } else {
        tempCashList.push({
          name: cashName,
          value: comment,
        });
      }
      cashCheckRefs.current[index].checked = true;
    }

    setSelectedCashList(tempCashList);
  };

  const setType = (typeValue, index) => {
    const tempTypeList = selectedTypeList;
    let filteredList = [];
    let isFind = false;

    tempTypeList.map((type, index) => {
      if (type.type == typeValue) isFind = true;
      else filteredList.push(type);
    });

    if (isFind != true) {
      filteredList.push({
        type: typeValue,
        stock: 0,
        box: 1,
      });
    } else {
      productStockInputRefs.current[index].value = "";
      productBoxDropdownlistRefs.current[index].value = "";
    }
    setSelectedTypeList(filteredList);
  };

  const setTypeStock = (stockValue, typeValue, index) => {
    let tempTypeList = selectedTypeList;
    const foundIdx = tempTypeList.findIndex(type => type.type == typeValue);

    if (stockValue == "") {
      if (foundIdx != -1)
        tempTypeList[foundIdx].stock = 0;
    } else {
      if (foundIdx !== -1) {
        tempTypeList[foundIdx].stock = stockValue;
      } else {
        tempTypeList.push({
          type: typeValue,
          stock: stockValue,
          box: productBoxDropdownlistRefs.current[index].value,
        });
      }
      productCheckRefs.current[index].checked = true;
    }

    setSelectedTypeList(tempTypeList);
  };

  const setTypeBox = (boxValue, typeValue, index) => {
    // check if current box number is already selected, and its product is already
    // originally registered to the machine
    const sameValuedIndex = selectedBoxes.findIndex(box => box.box_value == boxValue);
    if (sameValuedIndex != -1) {
      const sameRefedIndex = selectedBoxes.findIndex(box => box.ref_index == index);
      // if the product is original one of the machine, restore original box value
      // or ignore
      if (sameRefedIndex != -1) {
        productBoxDropdownlistRefs.current[index].value = selectedBoxes[sameRefedIndex].box_value;
      } else {
        productBoxDropdownlistRefs.current[index].value = "";
      }
      return toast.warn(`${t("Messages.Already_Selected_MSG")}`);
    }

    // add new ref_index, box_value pair regarding new info
    let tempSelectedBoxes = selectedBoxes;
    const sameRefedIndex = tempSelectedBoxes.findIndex(box => box.ref_index == index);
    if (sameRefedIndex != -1) {
      tempSelectedBoxes = tempSelectedBoxes.map(box => {
        if (box.ref_index == index) {
          return {...box, box_value: boxValue};
        }
        return box;
      });
    } else {
      tempSelectedBoxes.push({
        ref_index: index,
        box_value: boxValue
      });
    }
    setSelectedBoxes(tempSelectedBoxes);

    let tempTypeList = selectedTypeList;
    const foundIdx = tempTypeList.findIndex(type => type.type == typeValue);

    if (foundIdx !== -1) {
      tempTypeList[foundIdx].box = boxValue;
    } else {
      tempTypeList.push({
        type: typeValue,
        stock: productStockInputRefs.current[index].value,
        box: boxValue,
      });
    }
    productCheckRefs.current[index].checked = true;
    setSelectedTypeList(tempTypeList);
  };

  const handleComplete = async (event) => {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("location", JSON.stringify(location));
    formData.append("machine_details", JSON.stringify(selectedInfoList));
    formData.append("ads_detail", selectedAdsList);
    formData.append("product_list", JSON.stringify(selectedTypeList));
    formData.append("cash_list", JSON.stringify([]));
    /*  for cash
    formData.append("cash_list", JSON.stringify(selectedCashList));
    */

    try {
      formPost(
        "/api/machine/update",
        formData,
        function (res) {
          toast.success(res.data.message);
          setTimeout(() => {
            navigate("/vm-machine/list");
          }, 1000);
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
    } catch (error) {
      toast.error(`${t("Messages.Fail_Update_Machine_MSG")}`);
    }
  };

  const handleNext = async () => {
    const currentStepIndex = stepWizard.current.state.activeStep;

    // validate license code, fake code for now
    if (currentStepIndex == 0) {
      if (!licenseCode) {
        toast.warning(`${t("Messages.Enter_License_MSG")}`);
        return;
      }
      if (licenseCode.length < 24) {
        toast.warning(`${t("Messages.Type_Serial_Number_MSG")}`);
        return;
      }

      try {
        const res = await requestTokenPostAsync(`/api/machine/license`,
        { id, licensecode: licenseCode, });
        // toast.success(res.data.message);
        setIsLocked(false);
        toast.success(`${t("Messages.Machine_Active_MSG")}`);
      } catch (err) {
        if (err.response && (err.response.status == 400 || err.response.status == 500)) {
          toast.error(err.response.data.error);
        } else {
          console.log(err);
          toast.error(`${t("Messages.License_Code_MSG")}`);
        }
        return;
      }
    }

    if (currentStepIndex > 0 && !selectedAdsList) {
      toast.warning(`${t("Messages.Select_Machine_MSG")}`);
      return;
    }

    if (currentStepIndex > 1) {
      const nonSetInfoList = selectedInfoList.filter((info) => info.value == 0);

      if (!selectedInfoList.length) {
        toast.warning(`${t("Messages.Select_Info_MSG")}`);
        return;
      }
      else if (nonSetInfoList.length) {
        toast.warning(`${t("Messages.Input_Info_MSG")}`);
        return;
      }

      if (currentStepIndex == 2) {
        // Set product information
        let avaiableTypeList = []; // we don't need to take care of deleted products
        let boxValues = [];
        machineProductList.forEach(originType => {
          const foundIdx = typeList.findIndex(type => type._id == originType.type);
          if (foundIdx != -1) {
            if (productCheckRefs.current.length) {
              productCheckRefs.current[foundIdx].checked = true;
              productStockInputRefs.current[foundIdx].value = originType.stock;
              productBoxDropdownlistRefs.current[foundIdx].value = originType.box;
              boxValues.push({
                ref_index: foundIdx,
                box_value: originType.box
              });
              avaiableTypeList.push(originType);
            }
          }
        });
        setSelectedBoxes(boxValues);
        setSelectedTypeList(avaiableTypeList);
      }
    }

    if (currentStepIndex > 2) {
      const nonSetTypeList = selectedTypeList.filter((type) => type.stock == 0 || type.box == "");

      if (!selectedTypeList.length) {
        toast.warning(`${t("Messages.Select_Prodcuct_MSG")}`);
        return;
      }
      if (nonSetTypeList.length) {
        toast.warning(`${t("Messages.Set_Neccessary_Info_MSG")}`);
        return;
      }
    }

    /*    for cash
    if (currentStepIndex > 3) {
      const nonSetCashList = selectedCashList.filter((cash) => cash.value == "");
      if (!selectedCashList.length) {
        toast.warning(`${t("Messages.Create_Config_MSG")}`);
        return;
      }
      if (nonSetCashList.length) {
        toast.warning(`${t("Messages.Commnect_Cash_MSG")}`);
        return;
      }
    }
    */

    if (stepWizard.current) {
      stepWizard.current.nextStep();
    }
  };

  const initialProc = async () => {
    const adblocker = await checkAdblock();
    if (adblocker) {

      Swal.fire({
        title: `${t("Messages.Block_Detect_MSG")}`,
        text: `${t("Messages.Block_Notice_MSG")}`,
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
      });
    } else {
      // api can be called successfully when ad blocker is disabled
      requestTokenPost(
        `/api/machine/detail`,
        {
          id,
        },
        function (res) {
          if (res.data.status == "success") {
            const machineActivated = res.data.detail.activated;
            const machineInfo = res.data.detail.machine;

            if (machineActivated) {
              setIsLocked(false);
              setFirstWizardStep(2);
            }
            setLoaded(true);

            // show original information settings
            const originInfoList = machineInfo.machine_details;
            setSelectedInfoList(originInfoList);
            originInfoList.forEach(originInfo => {
              const foundIdx = infoList.findIndex(info => info.name.toLowerCase() == originInfo.name.toLowerCase());
              if (foundIdx != -1) {
                infoCheckRefs.current[foundIdx].checked = true;
                // chop down unit string
                infoInputRefs.current[foundIdx].value = parseInt(originInfo.value);
              } else {
                console.log("not found info");
              }
            });

            setMachineProductList(machineInfo.product_list);

            setselectedAdsList(machineInfo.ads_detail);

            // show origin cash lists
            // const originCashList = machineInfo.cash_list;
            // setSelectedCashList(originCashList);
            // originCashList.forEach(originCash => {
            //   const foundIdx = cashList.findIndex(cash => cash.value == originCash.name);
            //   if (foundIdx != -1) {
            //     cashCheckRefs.current[foundIdx].checked = true;
            //     cashInputRefs.current[foundIdx].value = originCash.value;
            //   } else {
            //     console.log("not found cash");
            //   }
            // });

            setLocation(machineInfo.location);

            requestTokenPost(
              "/api/ads/list",
              {},
              function (result) {
                if (result.data.status == "success") {
                  setAdsList(result.data.data);

                  requestTokenPost(
                    "/api/product/list",
                    {},
                    function (result) {
                      if (result.data.status == "success") {
                        const typeList = result.data.data;
                        setTypeList(typeList);

                        navigator.geolocation.getCurrentPosition(
                          function (position) {
                            setPosition({
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                            });
                          },
                          function (err) {
                            console.log("Error : getting current location");
                            console.log(err);
                          }
                        );
                      }
                    },
                    function (error) {
                      console.log(error);
                      toast.error(`${t("Messages.Fail_list_Product_MSG")}`);
                    }
                  );
                }
              },
              function (error) {
                toast.error(`${t("Messages.Select_Machine_MSG")}`);
              }
            );
          }
        },
        function (error) {
          console.log(error);
          toast.error(`${t("Messages.Fail_Machine_Detail_MSG")}`);
        }
      );
    }
  };

  useEffect(() => {
    initialProc();
  }, []);

  return (
    <Layout title="Edit Vending Machine" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Machine.Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-machine/list">{t("Machine.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                {t("Machine.Edit")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        {
          loaded ?
          <StepWizard initialStep={firstWizardStep} ref={stepWizard}>
          {/* License input */}
          <div>
            <Row className="g-gs">
              <h3>{t("Messages.License_Active_MSG")}</h3>
              <Col lg="12">
                <div className="form-control-wrap">
                  <Form.Control
                    type="text"
                    id="license"
                    value={licenseCode}
                    onChange={handleLicenseInput}
                    placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                  />
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3, offset: 9 }}>
                <br></br>
                <Button onClick={handleNext} style={{ width: "100%" }}>{t("Options.Activate")}</Button>
              </Col>
            </Row>
          </div>

          {/* Advertisement */}
          <div>
            <h3>{t("Machine.Step")} 1: {t("Machine.Advertisement")}</h3>
            <Row className="g-gs">
              <Col lg="12">
                <br></br>
                <div className="form-control-wrap">
                  <Row className="gy-3">
                    {adsList &&
                      adsList.map((ads, index) => {
                        return (
                          <Col sm="12" lg="12" key={`ads-` + index}>
                            <Form.Check
                              type="radio"
                              name="adsRadio"
                              id={ads._id}
                              value={ads._id}
                              label={ads.title}
                              checked={
                                selectedAdsList == ads._id ? true : false
                              }
                              onChange={() => { }}
                              onClick={(e) => {
                                setselectedAdsList(e.target.value);
                              }}
                            />
                          </Col>
                        );
                      })}
                  </Row>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3 }}>
                <br></br>
                {
                  isLocked &&
                  <Button onClick={() => stepWizard.current.previousStep()} style={{ width: "100%" }}>{t("Options.Prev")}</Button>
                }
              </Col>
              <Col lg={{ span: 3, offset: 6 }}>
                <br></br>
                <Button onClick={handleNext} style={{ width: "100%" }}>{t("Options.Next")}</Button>
              </Col>
            </Row>
          </div>

          {/* Information */}
          <div>
            <h3>{t("Machine.Step")} 2: {t("Machine.Information")}</h3>
            <Row className="g-gs">
              <Col lg="12">
                <br></br>
                <div className="form-control-wrap">
                  <ListGroup>
                    {infoList.map((info, index) => {
                      return (
                        <ListGroup.Item
                          key={`info-` + index}
                          as="label"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <div
                            className="d-flex justify-content-between p-1"
                            style={{ marginTop: "4px" }}
                          >
                            <Form.Check
                              type="checkbox"
                              className="me-1"
                              ref={(ref) => infoCheckRefs.current[index] = ref}
                              onClick={() => {
                                setInformation(info.name, info.unit, index);
                              }}
                            />
                            <img
                              src={info.path}
                              style={{
                                width: "30px",
                                height: "30px",
                                marginRight: "10px",
                                marginLeft: "10px",
                              }}
                            />
                            {info.name + " (" + info.unit + ")"}
                          </div>
                          <Form.Control
                            className="w-25"
                            type="number"
                            max={100}
                            min={0}
                            ref={(ref) => infoInputRefs.current[index] = ref}
                            onChange={(e) => {
                              setInformationComment(
                                info.name,
                                e.target.value,
                                info.unit,
                                index
                              );
                            }}
                          />
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3 }}>
                <br></br>
                <Button onClick={() => stepWizard.current.previousStep()} style={{ width: "100%" }}>{t("Options.Prev")}</Button>
              </Col>
              <Col lg={{ span: 3, offset: 6 }}>
                <br></br>
                <Button onClick={handleNext} style={{ width: "100%" }}>{t("Options.Next")}</Button>
              </Col>
            </Row>
          </div>

          {/* Products */}
          <div>
            <h3>{t("Machine.Step")} 3: {t("Machine.Products")}</h3>
            <Row className="g-gs">
              <Col lg="12">
                <div className="form-control-wrap">
                  <ListGroup>
                    {typeList.map((type, index) => {
                      return (
                        <ListGroup.Item
                          key={`type-` + index}
                          as="label"
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div
                            className="d-flex justify-content-between align-items-center p-1 gap-2"
                            style={{ marginTop: "4px" }}
                          >
                            <Form.Check
                              type="checkbox"
                              className="me-1"
                              ref={(ref) => productCheckRefs.current[index] = ref}
                              onClick={() => {
                                setType(type._id, index);
                              }}
                            />
                            <img
                              src={`${config.serverUrl}/file/download/${btoa(
                                type.thumbnail
                              )}`}
                              style={{ height: "50px" }}
                            />
                            {type.name}
                          </div>
                          <div className="d-flex flex-direction-row gap-5">
                            <div
                              className="d-flex justify-content-between align-items-center gap-1"
                              style={{ marginTop: "4px" }}
                            >
                              {t("Machine.Stock")}:
                              <Form.Control
                                type="number"
                                max={100}
                                min={0}
                                ref={(ref) => productStockInputRefs.current[index] = ref}
                                onChange={(e) => {
                                  setTypeStock(e.target.value, type._id, index);
                                }}
                              />
                            </div>
                            <div
                              className="d-flex justify-content-between align-items-center gap-1"
                              style={{ marginTop: "4px" }}
                            >
                              {t("Machine.BoxNumber")}:
                              <select
                                className="form-control"
                                style={{ width: "100px" }}
                                ref={(ref) => productBoxDropdownlistRefs.current[index] = ref}
                                onChange={(event) => {
                                  setTypeBox(event.target.value, type._id, index);
                                }}
                              >
                                <option value={""} selected disabled hidden>Select</option>
                                {boxList.map((box) =>
                                  selectedTypeList.find(
                                    (findInfo) => findInfo.type === type._id
                                  )?.box == box ? (
                                    <option
                                      key={"box-" + box}
                                      value={box}
                                      selected
                                    >
                                      {box}
                                    </option>
                                  ) : (
                                    <option key={"box-" + box} value={box}>
                                      {box}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3 }}>
                <br></br>
                <Button onClick={() => stepWizard.current.previousStep()} style={{ width: "100%" }}>{t("Options.Prev")}</Button>
              </Col>
              <Col lg={{ span: 3, offset: 6 }}>
                <br></br>
                <Button onClick={handleNext} style={{ width: "100%" }}>{t("Options.Next")}</Button>
              </Col>
            </Row>
          </div>

          {/* Cash */}
          {/* <div>
            <h3>{t("Machine.Step")} 4: {t("Machine.Cash")}</h3>
            <Row className="g-gs">
              <Col lg="12">
                <div className="form-control-wrap">
                  <ListGroup>
                    {cashList.map((cash, index) => {
                      return (
                        <ListGroup.Item
                          key={`cash-` + index}
                          as="label"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <div
                            className="d-flex justify-content-between p-1"
                            style={{ marginTop: "4px" }}
                          >
                            <Form.Check
                              type="checkbox"
                              className="me-1"
                              ref={(ref) => cashCheckRefs.current[index] = ref}
                              onClick={() => {
                                setCash(cash.value, index);
                              }}
                            />
                            {cash.name}
                          </div>
                          <Form.Control
                            className="w-25"
                            type="number"
                            max={100}
                            min={0}
                            ref={(ref) => cashInputRefs.current[index] = ref}
                            onChange={(e) => {
                              setCashComment(cash.value, e.target.value, index);
                            }}
                          />
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3 }}>
                <br></br>
                <Button onClick={() => stepWizard.current.previousStep()} style={{ width: "100%" }}>{t("Options.Prev")}</Button>
              </Col>
              <Col lg={{ span: 3, offset: 6 }}>
                <br></br>
                <Button onClick={handleNext} style={{ width: "100%" }}>{t("Options.Next")}</Button>
              </Col>
            </Row>
          </div> */}

          {/* Location */}
          <div>
            <h3>{t("Machine.Step")} 4: {t("Machine.Location")}</h3>
            <Row className="g-gs">
              <div style={{ height: "400px", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={googleMapApiKey ? {key: googleMapApiKey} : {}}
                  defaultCenter={position}
                  defaultZoom={12}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) =>
                    handleApiLoaded(map, maps)
                  }
                >
                  {map &&
                    maps &&
                    <MarkerContainer
                      map={map}
                      maps={maps}
                      location={location}
                      setLocation={setLocation}
                    />}
                </GoogleMapReact>
              </div>
            </Row>
            <Row className="g-gs">
              <Col lg={{ span: 3 }}>
                <br></br>
                <Button onClick={() => stepWizard.current.previousStep()} style={{ width: "100%" }}>{t("Options.Prev")}</Button>
              </Col>
              <Col lg={{ span: 3, offset: 6 }}>
                <br></br>
                <Button onClick={handleComplete} style={{ width: "100%" }}>{t("Machine.Update")}</Button>
              </Col>
            </Row>
          </div>
        </StepWizard>
        :
        null
        }
      </Block>
    </Layout>
  );
}

export default VMMachineEdit;
