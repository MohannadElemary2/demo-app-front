import React from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Row, Col } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { setPasswordValidateLink, setPassword } from "../../../redux/Auth/AuthActions";
import LazyButton from "../../../components/shared/lazyButton";
import loginImg from "../../../assets/img/pages/login.png";

const setPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, "Password min length is 6").required("Required"),
  password_confirmation: Yup.string()
    .min(6, "Password min length is 6")
    .required("Required")
    .oneOf([Yup.ref("password"), null], "The Password didn't match."),
});
const segmants = window.location.pathname + window.location.search;

class SetPassword extends React.Component {
  componentDidMount() {
    this.props.setPasswordValidateLink(segmants);
  }

  onSubmit = (formValues) => {
    this.props.setPassword(segmants, formValues);
  };

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col sm="8" xl="7" lg="10" md="8" className="d-flex justify-content-center">
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="6" className="d-lg-block d-none text-center align-self-center px-1 py-0">
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader>
                    <CardTitle>
                      <FormattedMessage id="welcome To Omniful" />
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p>
                      <FormattedMessage id="Set your password to activate your account" />
                    </p>
                    <Formik
                      initialValues={{
                        password: "",
                        password_confirmation: "",
                      }}
                      validationSchema={setPasswordSchema}
                      onSubmit={this.onSubmit}
                    >
                      {({ errors, touched }) => (
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
                            <LazyButton label="Save" loader={this.props.loaders.setPasswordBtn} />
                          </span>
                        </Form>
                      )}
                    </Formik>
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
  setPasswordValidateLink,
  setPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
