import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Icon } from "../../components";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { config } from "../../config";
import { requestTokenPost, formPost } from "../../service";
import { useTranslation } from "react-i18next";

function VMTypeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameDe, setNameDe] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [theme, setTheme] = useState("green");
  const [description, setDescription] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [category, setCategory] = useState("ecig");
  const [additionalInfo1, setAdditionalInfo1] = useState("");
  const [additionalInfo2, setAdditionalInfo2] = useState("");
  const [additionalInfo3, setAdditionalInfo3] = useState("");
  const [additionalInfo4, setAdditionalInfo4] = useState("");
  const [additionalInfo5, setAdditionalInfo5] = useState("");
  const [additionalInfo1De, setAdditionalInfo1De] = useState("");
  const [additionalInfo2De, setAdditionalInfo2De] = useState("");
  const [additionalInfo3De, setAdditionalInfo3De] = useState("");
  const [additionalInfo4De, setAdditionalInfo4De] = useState("");
  const [additionalInfo5De, setAdditionalInfo5De] = useState("");
  const [featured, setFeatured] = useState(false);

  const [ productImages, setProductImage ] = useState([]);
  const [ initialProductImages, setInitialProductImages] = useState([]);
  const [ eventId, setEventId ] = useState(-1);

  const { t } = useTranslation("global");

  useEffect(() => {
    requestTokenPost(
      "/api/product/detail",
      { id },
      function (res) {
        setName(res.data.data.name);
        setNameDe(res.data.data.name_de)
        setPrice(res.data.data.price);
        setCurrency(res.data.data.currency);
        setTheme(res.data.data.theme);
        setDescription(res.data.data.description);
        setDescriptionDe(res.data.data.description_de);
        setCategory(res.data.data.category);
        setFeatured(
          res.data.data.isfeatured
            ? res.data.data.isfeatured
            : false
        );
        setAdditionalInfo1(
          res.data.data.additionalinfo1
            ? res.data.data.additionalinfo1
            : ""
        );
        setAdditionalInfo2(
          res.data.data.additionalinfo2
            ? res.data.data.additionalinfo2
            : ""
        );
        setAdditionalInfo3(
          res.data.data.additionalinfo3
            ? res.data.data.additionalinfo3
            : ""
        );
        setAdditionalInfo4(
          res.data.data.additionalinfo4
            ? res.data.data.additionalinfo4
            : ""
        );
        setAdditionalInfo5(
          res.data.data.additionalinfo5
            ? res.data.data.additionalinfo5
            : ""
        );
        setAdditionalInfo1De(
          res.data.data.additionalinfo1_de
            ? res.data.data.additionalinfo1_de
            : ""
        );
        setAdditionalInfo2De(
          res.data.data.additionalinfo2_de
            ? res.data.data.additionalinfo2_de
            : ""
        );
        setAdditionalInfo3De(
          res.data.data.additionalinfo3_de
            ? res.data.data.additionalinfo3_de
            : ""
        );
        setAdditionalInfo4De(
          res.data.data.additionalinfo4_de
            ? res.data.data.additionalinfo4_de
            : ""
        );
        setAdditionalInfo5De(
          res.data.data.additionalinfo5_de
            ? res.data.data.additionalinfo5_de
            : ""
        );

        let images = [""];
        let initImages = [res.data.data.thumbnail];

        if (res.data.data.subinfoimage1) {
          images = [...images, ""];
          initImages = [...initImages, res.data.data.subinfoimage1];
        }

        if (res.data.data.subinfoimage2) {
          images = [...images, ""];
          initImages = [...initImages, res.data.data.subinfoimage2];
        }

        if (res.data.data.subinfoimage3) {
          images = [...images, ""];
          initImages = [...initImages, res.data.data.subinfoimage3];
        }

        setInitialProductImages(initImages);
        setProductImage(images);
      },
      function (error) {
        console.log("Getting product error: ", error);
        toast.error(`${t("Messages.Fail_Detail_Product_MSG")}`);
      }
    );
  }, []);

  const emitEvent = (index) => {
    setEventId(index);
    document.getElementById('main_image').click();
  }

  const onFileChange = (event) => {
    if (!event.target.files[0])
      return;
    if (eventId == -1) {
      onAddImage(event);
    } else {
      onEditImage(eventId, event);
    }
  }

  const onAddImage = (event) => {
    if (productImages.length > 3) {
      toast.error(`${t("Machine.Exceed_Limit_Image")}`);
      return;
    }
    setProductImage([...productImages, event.target.files[0]]);
  }

  const onRemoveImage = (index) => {
    if (initialProductImages.length > index) {
      let initImages = [];
      initImages = initImages.concat(initialProductImages);
      initImages.splice(index, 1);
      setInitialProductImages(initImages);
    }

    let images = [];
    images = images.concat(productImages);
    images.splice(index, 1);
    setProductImage(images);

  }

  const onEditImage = (index, event) => {
    if (initialProductImages.length > index) {
      let initImages = [];
      initImages = initImages.concat(initialProductImages);
      initImages.splice(index, 1);
      setInitialProductImages(initImages);
    }

    let images = [];
    images = images.concat(productImages);
    images[index] = event.target.files[0];
    setProductImage(images);
  };

  const onSaveProduct = async (event) => {
    if (name == "" || currency == "" 
      || price == "" || description == "" 
      || (initialProductImages[0] == "" && productImages[0] == "")) {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    event.preventDefault();
    let formData = new FormData();

    formData.append("id", id);
    formData.append("name", name);
    formData.append("name_de", nameDe);
    formData.append("currency", currency);
    formData.append("price", price);
    formData.append("theme", theme);
    formData.append("description", description);
    formData.append("description_de", descriptionDe);
    formData.append("category", category);
    formData.append("additionalInfo1", additionalInfo1);
    formData.append("additionalInfo2", additionalInfo2);
    formData.append("additionalInfo3", additionalInfo3);
    formData.append("additionalInfo4", additionalInfo4);
    formData.append("additionalInfo5", additionalInfo5);
    formData.append("additionalInfo1_de", additionalInfo1De);
    formData.append("additionalInfo2_de", additionalInfo2De);
    formData.append("additionalInfo3_de", additionalInfo3De);
    formData.append("additionalInfo4_de", additionalInfo4De);
    formData.append("additionalInfo5_de", additionalInfo5De);
    formData.append("isfeatured", featured);

    let order = 0;
    for (let i = 0; i < productImages.length; i++) {
      let str_field = "attachfile";
      if (productImages[i] !== "") {
        str_field = (order == 0) ? "attachfile" : ("subinfoimage" + order);
        formData.append(str_field, productImages[i]);
        order++;
      } else if (i < initialProductImages.length && initialProductImages[i]) {
        str_field = (order == 0) ? "attachfile" : "subinfoimage" + order;
        formData.append(str_field, initialProductImages[i]);
        order++;
      }
    }

    for (let i = order; i < 4; i++) {
      formData.append("subinfoimage" + i, "");
    }

    try {
      formPost(
        "/api/product/update",
        formData,
        function (res) {
          toast.success(res.data.message);
          setTimeout(() => {
            navigate("/vm-product/list");
          }, 1000);
        },
        function (err) {
          if (err.response && (err.response.status == 400 || err.response.status == 500)) {
            toast.error(err.response.data.error);
          } else {
            console.log(err);
            toast.error("Failed to update product info");
          }
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Edit Product" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Product.Edit")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-product/list">{t("Product.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Product.Edit")}
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
        </Block.HeadBetween>
      </Block.Head>
      <Block>
        <Form action="#">
          <Row className="g-gs">
            <Col xxl="12">
              <div className="gap gy-4">
                <div className="gap-col">
                  <Card className="card-gutter-md">
                    <Card.Body>
                      <Row className="g-gs">
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Name_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder={t("Product.Name")}
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Name_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name-de"
                                placeholder={t("Product.German_Name")}
                                value={nameDe}
                                onChange={(e) => {
                                  setNameDe(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Price_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="number"
                                id="category-name"
                                value={price}
                                placeholder={t("Product.Price")}
                                onChange={(e) => {
                                  setPrice(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Currency_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={currency}
                                placeholder={t("Product.Currency")}
                                onChange={(e) => {
                                  setCurrency(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Description_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                as="textarea"
                                placeholder={t("Product.Description")}
                                id="exampleFormControlTextarea8"
                                rows="3"
                                defaultValue={description}
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                              ></Form.Control>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Description_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                as="textarea"
                                placeholder={t("Product.German_Description")}
                                id="exampleFormControlTextarea8"
                                rows="3"
                                defaultValue={descriptionDe}
                                onChange={(e) => {
                                  setDescriptionDe(e.target.value);
                                }}
                              ></Form.Control>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Category_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio11"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    category == "ecig"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio11"
                                  onClick={() => {
                                    setCategory("ecig");
                                  }}
                                >
                                  {t("Product.Category_EC")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio12"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    category == "snack"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio12"
                                  onClick={() => {
                                    setCategory("snack");
                                  }}
                                >
                                  {t("Product.Category_Snack")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio13"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    category == "drink"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio13"
                                  onClick={() => {
                                    setCategory("drink");
                                  }}
                                >
                                  {t("Product.Category_Drink")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Theme_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio1"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    theme == "green"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio1"
                                  onClick={() => {
                                    setTheme("green");
                                  }}
                                >
                                  {t("Product.Theme_Green")}
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
                                  variant={
                                    theme == "blue"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio2"
                                  onClick={() => {
                                    setTheme("blue");
                                  }}
                                >
                                  {t("Product.Theme_Blue")}
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
                                  variant={
                                    theme == "pink"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio3"
                                  onClick={() => {
                                    setTheme("pink");
                                  }}
                                >
                                  {t("Product.Theme_Pink")}
                                </Button>
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio4"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    theme == "black"
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio4"
                                  onClick={() => {
                                    setTheme("black");
                                  }}
                                >
                                  {t("Product.Theme_Black")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Feature_Lbl")}
                            </Form.Label>
                            <div className="form-control-wrap">
                              <ButtonGroup aria-label="Basic radio toggle button group">
                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio14"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    featured == true
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio14"
                                  onClick={() => {
                                    setFeatured(true);
                                  }}
                                >
                                  {t("Options.Yes")}
                                </Button>

                                <input
                                  type="radio"
                                  className="btn-check"
                                  name="btnradio"
                                  id="btnradio15"
                                  autoComplete="off"
                                />
                                <Button
                                  as="label"
                                  variant={
                                    featured == false
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  htmlFor="btnradio15"
                                  onClick={() => {
                                    setFeatured(false);
                                  }}
                                >
                                  {t("Options.No")}
                                </Button>
                              </ButtonGroup>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Addition_Info")} (1)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo1}
                                placeholder={t("Product.Addition_Info")+"1"}
                                onChange={(e) => {
                                  setAdditionalInfo1(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Addition_Info")} (1)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo1De}
                                placeholder={t("Product.German_Addition_Info")+" 1"}
                                onChange={(e) => {
                                  setAdditionalInfo1De(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Addition_Info")} (2)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                value={additionalInfo2}
                                id="category-name"
                                placeholder={t("Product.Addition_Info") + " 2"}
                                onChange={(e) => {
                                  setAdditionalInfo2(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Addition_Info")} (2)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo2De}
                                placeholder={t("Product.German_Addition_Info")+" 2"}
                                onChange={(e) => {
                                  setAdditionalInfo2De(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Addition_Info")} (3)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                value={additionalInfo3}
                                id="category-name"
                                placeholder={t("Product.Addition_Info") + " 3"}
                                onChange={(e) => {
                                  setAdditionalInfo3(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Addition_Info")} (3)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo3De}
                                placeholder={t("Product.German_Addition_Info") + " 3"}
                                onChange={(e) => {
                                  setAdditionalInfo3De(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Addition_Info")} (4)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo4}
                                placeholder={t("Product.Addition_Info") + " 4"}
                                onChange={(e) => {
                                  setAdditionalInfo4(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Addition_Info")} (4)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo4De}
                                placeholder={t("Product.Addition_Info") + " 4"}
                                onChange={(e) => {
                                  setAdditionalInfo4De(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.Addition_Info")} (5)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo5}
                                placeholder={t("Product.Addition_Info") + " 5"}
                                onChange={(e) => {
                                  setAdditionalInfo5(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                            {t("Product.German_Addition_Info")} (5)
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                value={additionalInfo5De}
                                placeholder={t("Product.German_Addition_Info") + " 5"}
                                onChange={(e) => {
                                  setAdditionalInfo5De(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Card className="card-gutter-md">
                            <Card.Body>
                              <Row lg="12">
                                <Col lg="7">
                                  <h4 >{t("Product.Image_Lbl")}</h4>
                                </Col>
                                <Col lg="5">
                                  <Button
                                    type="button"
                                    variant="primary"
                                    onClick={(e) => {
                                      emitEvent(-1);
                                    }}
                                    style={{ float:"right" }}
                                  >
                                    {t("Product.ADD_EXTRA_PRODUCT_IMAGES")}
                                  </Button>
                                </Col>
                              </Row>
                              <Row lg="12">
                                <Form.Control
                                  size="md"
                                  type="file"
                                  name="file"
                                  id="main_image"
                                  style={{display:"none"}}
                                  onChange={(event) => {
                                    onFileChange(event);
                                  }}
                                />
                                <Col lg="3">
                                  <Row lg="12">
                                    <Form.Group className="form-group">
                                      <Row log="12">
                                        <Col lg="9">
                                          <Form.Label htmlFor="category-name">
                                            {t("Product.Main_Image")}
                                          </Form.Label>
                                        </Col>
                                        <Col lg="3">
                                          <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            style={{ height: "25px" }}
                                            onClick={() => {
                                              emitEvent(0);
                                          }}>
                                            <Icon name="edit"></Icon>
                                          </Button>
                                          
                                        </Col>
                                      </Row>
                                    </Form.Group>
                                  </Row>
                                  <Row lg="12">
                                    <Form.Group className="form-group">
                                      <Form.Label htmlFor="category-name">
                                      {t("Product.Preview")}
                                      </Form.Label>
                                      {productImages[0] ? (
                                        <img
                                          src={URL.createObjectURL(productImages[0])}
                                          style={{
                                            width: "100%",
                                            height: "300px",
                                            border: "solid 1px grey",
                                            padding: "3px",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      ) : (
                                        <img
                                          src={`${config.serverUrl
                                            }/file/download/${btoa(initialProductImages[0])}`}
                                          style={{
                                            width: "100%",
                                            height: "300px",
                                            border: "solid 1px grey",
                                            padding: "3px",
                                            borderRadius: "10px",
                                          }}
                                        />
                                      )}
                                    </Form.Group>
                                  </Row>
                                </Col>
                                {
                                  productImages.map((imageFile, index) => {
                                    if (index == 0)
                                      return null;
                                    return (
                                    <Col lg="3" key={`image-${index}`}>
                                      <Row lg="12">
                                        <Form.Group className="form-group">
                                          <Row log="12">
                                            <Col lg="4">
                                              <Form.Label htmlFor="category-name">
                                                {t("Product.Additional")}
                                              </Form.Label>
                                            </Col>
                                            <Col lg="8">
                                              <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(event) =>{
                                                  onRemoveImage(index);
                                                }}
                                                style={{ height: "25px", float: "right"}}
                                              >
                                                <Icon name="trash"></Icon>
                                              </Button>
                                              <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                style={{ height: "25px", float: "right" }}
                                                onClick={() => {
                                                  emitEvent(index);
                                              }}>
                                                <Icon name="edit"></Icon>
                                              </Button>
                                            </Col>
                                          </Row>
                                        </Form.Group>
                                      </Row>
                                      <Row lg="12">
                                        {(imageFile || initialProductImages[index]) && (
                                          <Form.Group className="form-group">
                                            <Form.Label htmlFor="category-name">
                                              {t("Product.Preview")}
                                            </Form.Label>
                                            {imageFile ? (
                                              <img
                                                src={URL.createObjectURL(imageFile)}
                                                style={{
                                                  width: "100%",
                                                  height: "300px",
                                                  border: "solid 1px grey",
                                                  padding: "3px",
                                                  borderRadius: "10px",
                                                }}
                                              />
                                            ) : (
                                              <img
                                                src={`${config.serverUrl}/file/download/${btoa(initialProductImages[index])}`}
                                                style={{
                                                  width: "100%",
                                                  height: "300px",
                                                  border: "solid 1px grey",
                                                  padding: "3px",
                                                  borderRadius: "10px",
                                                }}
                                              />
                                            )}
                                          </Form.Group>
                                        )}
                                      </Row>
                                    </Col>
                                    )
                                  })
                                }
                              </Row>
                            </Card.Body>
                          </Card>
                          <Form.Group className="form-group">
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
                <div className="gap-col">
                  <ul className="d-flex align-items-center gap g-3">
                    <li>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={(e) => {
                          onSaveProduct(e);
                        }}
                      >
                        {t("Product.Save")}
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-product/list" className="btn border-0">
                      {t("Options.Go_Back")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Block>
    </Layout>
  );
}

export default VMTypeEdit;
