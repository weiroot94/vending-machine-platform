import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Icon } from "../../components";
import { Link } from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import { formPost } from "../../service";
import { useTranslation } from "react-i18next";

function VMTypeAdd() {
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

  const [ productImages, setProductImage ] = useState([""]);
  const [ eventId, setEventId ] = useState(-1);
  const { t } = useTranslation("global");

  const emitEvent = (index) => {
    setEventId(index);
    document.getElementById('main_image').click();
  }

  const onFileChange = (event) => {
    if (!event.target.files[0])
      return;
    if (eventId == -1) 
      onAddImage(event);
    else
      onEditImage(eventId, event);
  }

  const onAddImage = (event) => {
    if (productImages.length > 3) {
      toast.error(`${t("Machine.Exceed_Limit_Image")}`);
      return;
    }
    setProductImage([...productImages, event.target.files[0]]);
  }

  const onRemoveImage = (index) => {
    let images = [];
    images = images.concat(productImages);
    images.splice(index, 1);
    setProductImage(images);
  }

  const onEditImage = (index, event) => {
    let images = [];
    images = images.concat(productImages);
    images[index] = event.target.files[0];
    setProductImage(images);
  };

  const onSaveProduct = async (event) => {
    if (
      name == "" ||
      nameDe == "" ||
      currency == "" ||
      price == "" ||
      description == "" ||
      descriptionDe == "" ||
      productImages[0] == ""
    ) {
      toast.warning(`${t("Messages.Check_All_MSG")}`);
      return;
    }

    event.preventDefault();
    let formData = new FormData();
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
        str_field = (i == 0) ? "attachfile" : "subinfoimage" + order;
        formData.append(str_field, productImages[i]);
        order++;
      }
    }

    for (let i = order+1; i < 4; i++) {
      formData.append("subinfoimage" + i, "");
    }
    
    try {
      formPost(
        "/api/product/add",
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
            throw err;
          }
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Add Product" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">{t("Product.Add")}</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">{t("Options.Home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-product/list">{t("Product.Title")}</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {t("Product.Add")}
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
                                  name="btnradio2"
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
                                  name="btnradio2"
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
                                <Col lg="8">
                                  <h4 >{t("Product.Image_Lbl")}</h4>
                                </Col>
                                <Col lg="4">
                                  <Button
                                    type="button"
                                    variant="primary"
                                    onClick={(e) => {
                                      if (!productImages[0]) {
                                        return toast.error(`${t("Product.ERRMSG_SET_PRIMARY_IMAGE_FIRST")}`);
                                      }
                                      emitEvent(-1);
                                    }}
                                    style={{float:"right"}}
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
                                    {productImages[0] && (
                                      <Form.Group className="form-group">
                                        <Form.Label htmlFor="category-name">
                                          {t("Product.Preview")}
                                        </Form.Label>                                        
                                        <div className="form-control-wrap">
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
                                        </div>
                                      </Form.Group>
                                    )}
                                  </Row>
                                </Col>
                                {
                                  productImages.map((imageFile, index) => {
                                    if (index === 0)
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
                                                  style={{ height: "25px", float: "right" }}
                                                >
                                                  <Icon name="trash"></Icon>
                                                </Button>
                                                <Button 
                                                  variant="outline-primary" 
                                                  size="sm" 
                                                  style={{ height: "25px", float: "right" }}
                                                  onClick={() => {
                                                  // document.getElementById(`additionImage_${index}`).click();
                                                    emitEvent(index);
                                                }}>
                                                  <Icon name="edit"></Icon>
                                                </Button>
                                                
                                              </Col>
                                            </Row>
                                          </Form.Group>
                                        </Row>
                                        <Row lg="12">
                                          {imageFile && (
                                            <Form.Group className="form-group">
                                              <Form.Label htmlFor="category-name">
                                                {t("Product.Preview")}
                                              </Form.Label>                                        
                                              <div className="form-control-wrap">
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
                                              </div>
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

export default VMTypeAdd;
