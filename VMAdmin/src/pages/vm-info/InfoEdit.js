import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Card, Form, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import {config} from "../../config";
import {requestTokenPost, formPost} from "../../service";

function VMInfoEdit() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [initialFile, setinitialFile] = useState("");
  const [currentFile, setCurrentFile] = useState("");

  const onCurrentFileChanged = (event) => {
    setCurrentFile(event.target.files[0]);
  };

  useEffect(() => {
    requestTokenPost(
      "/api/info/detail",
      {id},
      function (res) {
        if (res.data.status == "success") {
          setName(res.data.detail[0].name);
          setUnit(res.data.detail[0].unit);
          setValue(res.data.detail[0].value);
          setinitialFile(res.data.detail[0].thumbnail);
        }
      },
      function (error) {
        toast.error("Failed to get detailed information");
      }
    );
  }, []);

  const onSaveInformation = async (event) => {
    if (name == "" || unit == "" || value == "") {
      toast.warning("Please check all fields");
      return;
    }

    event.preventDefault();
    let formData = new FormData();
    formData.append("attachfile", initialFile);
    formData.append("attachfile", currentFile ? currentFile : initialFile);
    formData.append("id", id);
    formData.append("name", name);
    formData.append("unit", unit);
    formData.append("value", value);

    try {
      formPost(
        "/api/info/update",
        formData,
        function (res) {
          if (res.data.status != "success") {
            toast.error(res.data.message);
            return;
          } else if (res.data.status == "success") {
            toast.success("Information updated");
            setTimeout(() => {
              navigate("/vm-info/list");
            }, 1000);
            return;
          }
        },
        function (err) {
          toast.error("Failed to update information");
        }
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <Layout title="Edit Information" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Edit Information</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/home-ecommerce">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/vm-info/list">Informations</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Information
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
                                value={name}
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
                                value={unit}
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
                                value={value}
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
                              {currentFile ? (
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
                              ) : (
                                <img
                                  src={`${
                                    config.serverUrl
                                  }/file/download/${btoa(initialFile)}`}
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
                                  onCurrentFileChanged(event);
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

export default VMInfoEdit;
