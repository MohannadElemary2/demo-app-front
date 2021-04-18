import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  UncontrolledAlert,
} from "reactstrap";
import { Mail, Lock } from "react-feather";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../../history";
import loginImg from "../../../../assets/img/pages/login.png";
import "../../../../assets/scss/pages/authentication.scss";

import { login, checkDomainExistance } from "../../../../redux/Auth/AuthActions";
import { removeServerError } from "../../../../redux/serverErrors/serverErrorsActions";
import LazyButton from "../../../../components/shared/lazyButton";

const Login = ({
  login,
  serverErrors,
  removeServerError,
  loaders,
  auth,
  checkDomainExistance,
  profile,
}) => {
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };
  const onSubmit = (values) => {
    const user = {
      email: values.email,
      password: values.password,
    };
    login(user);
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleInputChange = (e, inputName) => {
    formik.handleChange(e);
    if (serverErrors[inputName]) removeServerError(inputName);
  };
  useEffect(() => {
    if (auth.email) {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    checkDomainExistance();
  }, []);
  if (auth.domainExist) {
    return (
      <Row className="m-0 justify-content-center">
        <Col sm="8" xl="7" lg="10" md="8" className="d-flex justify-content-center">
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              {/* Image */}
              <Col lg="6" className="d-lg-block d-none text-center align-self-center px-1 py-0">
                <img src={loginImg} alt="loginImg" />
              </Col>
              {/* Form */}
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="mb-2 mt-1">
                      Welcome to Omniful! <br /> Please log in using your Email and Password
                    </p>
                    <Form onSubmit={formik.handleSubmit}>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          invalid={formik.errors.email && formik.touched.email}
                          type="email"
                          name="email"
                          placeholder="Email"
                          {...formik.getFieldProps("email")}
                          onChange={(e) => {
                            handleInputChange(e, "email");
                          }}
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        {/* Front end validation */}
                        <FormFeedback>{formik.touched.email && formik.errors.email}</FormFeedback>
                        {/* Backend validation when check inactive account */}
                        {serverErrors.email && (
                          <FormFeedback className="d-block">
                            <UncontrolledAlert color="danger">
                              {serverErrors.email}
                            </UncontrolledAlert>
                          </FormFeedback>
                        )}
                        <Label>Email</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          invalid={formik.errors.password && formik.touched.password}
                          type="password"
                          name="password"
                          placeholder="Password"
                          {...formik.getFieldProps("password")}
                          onChange={(e) => {
                            handleInputChange(e, "password");
                          }}
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        {/* Front end validation */}
                        <FormFeedback>
                          {formik.touched.password && formik.errors.password}
                        </FormFeedback>
                        {/* Backend validation when check inactive account */}
                        {serverErrors.password && (
                          <FormFeedback className="d-block">
                            <UncontrolledAlert color="danger">
                              {serverErrors.password}
                            </UncontrolledAlert>
                          </FormFeedback>
                        )}
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <div className="float-right">
                          <Link
                            to={{
                              pathname: "/forget-password",
                            }}
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </FormGroup>
                      <div className="d-flex justify-content-between">
                        <LazyButton label="Login" loader={loaders.loginBtn} />
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
  return <Spinner />;
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

const mapDispatchToProps = {
  login,
  removeServerError,
  checkDomainExistance,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
