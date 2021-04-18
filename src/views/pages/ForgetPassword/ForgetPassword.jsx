import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail } from "react-feather";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Card, CardBody, Row, Col, Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { forgetPassword } from "../../../redux/Auth/AuthActions";
import loginImg from "../../../assets/img/pages/login.png";
import LazyButton from "../../../components/shared/lazyButton";
import { history } from "../../../history";

const ForgetPassword = ({ auth, loaders, forgetPassword }) => {
  const initialValues = {
    email: "",
  };
  const onSubmit = (values) => {
    forgetPassword(values);
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email format")
      .required("This field is required!"),
  });

  useEffect(() => {
    if (auth.email) {
      history.push("/");
    }
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <Row className="m-0 justify-content-center">
      <Col sm="8" xl="7" lg="10" md="8" className="d-flex justify-content-center">
        <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col lg="6" className="d-lg-block d-none text-center align-self-center px-1 py-0">
              <img src={loginImg} alt="loginImg" />
            </Col>
            {/* Form */}
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 p-2">
                <CardBody>
                  <h4 className="pb-2">
                    <FormattedMessage id="Request new password" />
                  </h4>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        invalid={formik.errors.email && formik.touched.email}
                        type="email"
                        name="email"
                        placeholder="Email"
                        {...formik.getFieldProps("email")}
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>

                      <FormFeedback>{formik.touched.email && formik.errors.email}</FormFeedback>
                      <Label>
                        <FormattedMessage id="Email" />
                      </Label>
                    </FormGroup>

                    <div className="d-flex justify-content-between">
                      <span className="mt-1 mr-1">
                        <LazyButton label="Send" loader={loaders.forgetPasswordBtn} />
                      </span>
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
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

const mapDispatchToProps = {
  forgetPassword,
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
