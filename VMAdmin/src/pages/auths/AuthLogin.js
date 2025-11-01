import React, {useState} from "react";
import {Row, Col, Card, Form, Button } from "react-bootstrap";
import {useAuth} from "../../provider/AuthProvider";
import Layout from "../../layout/fullpage";
import {Logo} from "../../components";
import {toast} from "react-toastify";
import {requestPost} from "../../service";

const AuthLoginPage = () => {
  const {login, setUserRole, setUserEmail, setToken} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      userLogin();
    }
  };

  const userLogin = () => {
    if (!email) {
      toast.warning("Please type your email");
      return;
    }

    if (!password) {
      toast.warning("Please type your password");
      return;
    }
    
    requestPost(
      "/auth/login",
      {
        email,
        password,
      },
      function (loginResult) {
        if (loginResult.data.status == 1) {
          toast.success("Login success!");
          window.localStorage.setItem(
            "vending_user",
            JSON.stringify(loginResult.data.user)
          );
          setUserRole(loginResult.data.user.role);
          setUserEmail(loginResult.data.user.email);
          setToken(loginResult.data.user.token);
          setTimeout(login, 2000);
        } else {
          toast.error(loginResult.data.message);
        }
      },
      function (error) {
        toast.error("Authentication failed");
      }
    );
  };

  return (
        <Layout title="Login" centered>
          <div className="container p-2 p-sm-4">
            <Card className="overflow-hidden card-gutter-lg rounded-4 card-auth card-auth-mh">
              <Row className="g-0 flex-lg-row-reverse">
                <Col lg="5">
                  <Card.Body className="h-100 d-flex flex-column justify-content-center">
                    <div className="nk-block-head text-center">
                      <div className="nk-block-head-content">
                        <h3 className="nk-block-title mb-1">
                          Login to Account
                        </h3>
                        <p className="small">
                          Please sign-in to your account
                        </p>
                      </div>
                    </div>
                    <Form action="#">
                      <Row className="gy-3">
                        <Col className="col-12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="text"
                                id="email"
                                value={email}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                                placeholder="Enter email"
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col className="col-12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <div className="form-control-wrap">
                              <Form.Control
                                type="password"
                                id="password"
                                value={password}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                                placeholder="Enter password"
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col className="col-12">
                          <div className="d-grid">
                            <Button
                              type="button"
                              onClick={() => {
                                userLogin();
                              }}
                            >
                              Login to account
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Col>
                <Col lg="7">
                  <Card.Body className="bg-darker is-theme has-mask has-mask-1 h-100 d-flex flex-column justify-content-end">
                    <div className="mask mask-1"></div>
                    <div className="brand-logo">
                      <Logo />
                    </div>
                    <div className="row">
                      <div className="col-sm-11">
                        <div className="mt-4">
                          <div className="h1 title mb-3">
                            Welcome back to <br /> our community
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </div>
        </Layout>
  );
};

export default AuthLoginPage;
