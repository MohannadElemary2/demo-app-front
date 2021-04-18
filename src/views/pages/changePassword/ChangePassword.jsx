import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody, Button, FormGroup } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { ToastContainer, toast } from "react-toastify";
import { changePassword } from "../../../redux/Auth/AuthActions";
import { history } from "../../../history";
import "react-toastify/dist/ReactToastify.min.css";
import LazyButton from "../../../components/shared/lazyButton";
import {
  clearBreadCrumbData,
  updateBreadCrumbData,
} from "../../../redux/BreadCrumb/BreadCrumbActions";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
const validationSchema = Yup.object().shape({
  old_password: Yup.string().min(6, "Password min length is 6").required("This field is required"),
  password: Yup.string().min(6, "Password min length is 6").required("This field is required"),
  password_confirmation: Yup.string()
    .min(6, "Password min length is 6")
    .required("This field is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const ChangePassword = (props) => {
  const handleSubmit = (values) => {
    props.changePassword(values);
  };

  useBreadCrumb({
    breadCrumbTitle: "Change Password",
    breadCrumbItems: [
      {
        title: "Change Password",
      },
    ],
  });

  return (
    <Card>
      <CardBody>
        <Formik
          initialValues={{
            old_password: "",
            password: "",
            password_confirmation: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          render={() => (
            <Form>
              <FormGroup>
                <label className="mb-1" htmlFor="old_password">
                  <FormattedMessage id="Password" />
                </label>
                <Field
                  className="form-control"
                  name="old_password"
                  placeholder=""
                  type="password"
                />
                <ErrorMessage
                  name="old_password"
                  component="div"
                  className="field-error text-danger"
                />
              </FormGroup>

              <FormGroup>
                <label className="mb-1" htmlFor="password">
                  <FormattedMessage id="New password" />
                </label>
                <Field className="form-control" name="password" placeholder="" type="password" />
                <ErrorMessage name="password">
                  {(msg) => <div className="field-error text-danger">{msg}</div>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <label className="mb-1" htmlFor="password_confirmation">
                  <FormattedMessage id="Confirm password" />
                </label>
                <Field
                  className="form-control"
                  name="password_confirmation"
                  placeholder=""
                  type="password"
                />
                {/* This will render a string */}
                <ErrorMessage name="password_confirmation">
                  {(msg /** this is the same as the above */) => (
                    <div className="field-error text-danger">{msg}</div>
                  )}
                </ErrorMessage>
              </FormGroup>

              <span className="mt-1 mr-1">
                <LazyButton label="Save" loader={props.loaders.changePasswordBtn} />
              </span>

              <Button.Ripple
                onClick={() => {
                  toast.warn("Your changes could not be saved.");
                  history.push("/");
                }}
                color="primary"
                outline
                className="mt-1"
              >
                <FormattedMessage id="Cancel" />
              </Button.Ripple>
              <ToastContainer />
            </Form>
          )}
        />
      </CardBody>
    </Card>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

const mapDispatchToProps = {
  changePassword,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
