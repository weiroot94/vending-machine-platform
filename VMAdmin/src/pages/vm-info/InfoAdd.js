import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {formPost} from "../../service";

function VMInfoAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [currentFile, setCurrentFile] = useState("");

  const onFileChanged = (event) => {
    setCurrentFile(event.target.files[0]);
  };

  const onSaveInformation = async (event) => {
    if (name == "" || unit == "" || value == "" || currentFile == "") {
      toast.warning("Please check all fields");
      return;
    }

    event.preventDefault();
    let formData = new FormData();
    formData.append("attachfile", currentFile);
    formData.append("name", name);
    formData.append("value", value);
    formData.append("unit", unit);

    try {
      formPost(
        "/api/info/add",
        formData,
        function (res) {
          if (res.data.status != "success") {
            toast.error(res.data.message);
            return;
          } else if (res.data.status == "success") {
            toast.success("New information added");
            setTimeout(() => {
              navigate("/vm-info/list");
            }, 1000);
            return;
          }
        },
        function (error) {
          toast.error("Failed to add new information");
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Add Information" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Add Information</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-info/list">Informations</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Information
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
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              Name
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder="Information Name"
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              Unit
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder="Information Unit"
                                onChange={(e) => {
                                  setUnit(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              Value
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="category-name"
                                placeholder="Information Value"
                                onChange={(e) => {
                                  setValue(e.target.value);
                                }}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              Current File
                            </Form.Label>
                            <div className="form-control-wrap">
                              {currentFile && (
                                <img
                                  src={URL.createObjectURL(currentFile)}
                                  style={{
                                    width: "auto",
                                    height: "300px",
                                    border: "solid 1px grey",
                                    padding: "3px",
                                    borderRadius: "10px",
                                  }}
                                />
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="category-name">
                              Information File
                            </Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                size="md"
                                type="file"
                                name="file"
                                id="file"
                                onChange={(event) => {
                                  onFileChanged(event);
                                }}
                              />
                            </div>
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
                          onSaveInformation(e);
                        }}
                      >
                        Save Information
                      </Button>
                    </li>
                    <li>
                      <Link to="/vm-info/list" className="btn border-0">
                        Go Back
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

export default VMInfoAdd;
