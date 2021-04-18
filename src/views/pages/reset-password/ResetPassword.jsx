import React from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Row, Col } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import queryString from "query-string";
import { resetPasswordValidateLink, resetPassword } from "../../../redux/Auth/AuthActions";
import loginImg from "../../../assets/img/pages/login.png";
import LazyButton from "../../../components/shared/lazyButton";

const setPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, "Password min length is 6").required("Required"),
  password_confirmation: Yup.string()
    .min(6, "Password min length is 6")
    .required("Required")
    .oneOf([Yup.ref("password"), null], "The Password didn't match."),
});

class ResetPassword extends React.Component {
  componentDidMount() {
    const params = queryString.parse(window.location.search);
    const data = {
      id: params.id,
      token: params.token,
      check: 1,
    };
    this.props.resetPasswordValidateLink(data);
  }

  onSubmit = (formValues) => {
    const params = queryString.parse(window.location.search);
    formValues.id = params.id;
    formValues.token = params.token;
    this.props.resetPassword(formValues);
  };

  render() {
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
                  <CardHeader>
                    <CardTitle>
                      <FormattedMessage id="Omniful Account Recovery" />
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p>
                      <FormattedMessage id="Create a new password" />
                    </p>
                    <Formik
                      initialValues={{
                        password: "",
                        password_confirmation: "",
                        check: 0,
                      }}
                      validationSchema={setPasswordSchema}
                      onSubmit={this.onSubmit}
                      render={({ errors, touched }) => (
                        <Form>
                          <FormGroup>
                            <label htmlFor="password">
                              <FormattedMessage id="Password" />
                            </label>
                            <Field
                              className="form-control"
                              name="password"
                              placeholder=""
                              type="password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="field-error text-danger"
                            />
                          </FormGroup>

                          <FormGroup>
                            <label htmlFor="password_confirmation">
                              <FormattedMessage id="Confirm Password" />
                            </label>
                            <Field
                              className="form-control"
                              name="password_confirmation"
                              placeholder=""
                              type="password"
                            />
                            <ErrorMessage name="password_confirmation">
                              {(msg) => <div className="field-error text-danger">{msg}</div>}
                            </ErrorMessage>
                          </FormGroup>

                          <span className="mt-1 mr-1">
                            <LazyButton label="Save" loader={this.props.loaders.resetPasswordBtn} />
                          </span>
                        </Form>
                      )}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

const mapDispatchToProps = {
  resetPassword,
  resetPasswordValidateLink,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
