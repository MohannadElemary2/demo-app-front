import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { editProfile, viewProfile } from "../../../redux/profile/profileActions";
import LazyButton from "../../../components/shared/lazyButton";
import CancelButton from "../../../components/shared/cancelButton";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * Edit Profile Component
 */
const EditProfile = ({ serverErrors, loaders, profile, editProfile }) => {
  const [initialValues, setinitialValues] = useState(() => "");
  useBreadCrumb({
    breadCrumbTitle: "Edit Profile",
    breadCrumbItems: [
      {
        title: "Edit Profile",
      },
    ],
  });

  // bind profile data to the form from store
  useEffect(() => {
    // listenint to the name coz the obj changes and puts name to undefined
    if (profile.name) {
      setinitialValues({
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phone || "", // have to put empty string coz backend sends null that causes errs
      });
    }
  }, [profile]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("This field is required!"),
    name: Yup.string()
      .min(2, "Minimum length must be longer than 2 characters")
      .max(100, "Maximum length must be no longer than 100 characters")
      .required("This field is required!"),
  });

  const onSubmit = (values) => {
    const body = {
      name: values.name,
      email: values.email,
      phone: values.phoneNumber,
    };
    editProfile(body);
  };

  const renderForm = () => {
    if (initialValues) {
      return (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          <Form>
            <FormGroup>
              <label htmlFor="name" className="mb-1">
                Name*
              </label>
              <Field
                className="form-control mb-1"
                name="name"
                placeholder="Enter Name"
                type="text"
              />
              <ErrorMessage name="name" component="div" className="field-error text-danger" />
              {/* Backend Validation */}
              {serverErrors.name && (
                <div className="field-error text-danger">{serverErrors.name}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label htmlFor="email" className="mb-1">
                Email*
              </label>
              <Field
                className="form-control mb-1"
                name="email"
                placeholder="Enter Email"
                type="email"
              />
              {/* FrontEnd Validation */}
              <ErrorMessage name="email" component="div" className="field-error text-danger" />
              {/* Backend Validation */}
              {serverErrors.email && (
                <div className="field-error text-danger">{serverErrors.email}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label htmlFor="phoneNumber" className="mb-1">
                Phone Number
              </label>
              <Field
                className="form-control mb-1"
                name="phoneNumber"
                placeholder="Phone Number"
                type="text"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="field-error text-danger"
              />
              {/* Backend Validation */}
              {serverErrors.phone && (
                <div className="field-error text-danger">{serverErrors.phone}</div>
              )}
            </FormGroup>
            <LazyButton label="Save" loader={loaders.saveBtn} />
            <CancelButton className="ml-2" url="/" />
          </Form>
        </Formik>
      );
    }
    return (
      <>
        <Skeleton className="w-25 mb-1" />
        <h1>
          <Skeleton />
        </h1>
        <br />
        <Skeleton className="w-25 mb-1" />
        <h1>
          <Skeleton />
        </h1>
        <br />
        <Skeleton className="w-25 mb-1" />
        <h1>
          <Skeleton />
        </h1>
        <br />
        <div className="d-flex">
          <h1>
            <Skeleton width={100} height={40} className="mr-2" />
          </h1>
          <h1>
            <Skeleton width={100} height={40} />
          </h1>
        </div>
      </>
    );
  };

  return (
    <>
      <Card className="p-1">
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardBody>{renderForm()}</CardBody>
      </Card>
    </>
  );
};

const mapDispatchToProps = {
  editProfile,
  viewProfile,
};

const mapStateToProps = (state) => ({
  loaders: state.loaders,
  profile: state.profile,
  serverErrors: state.serverErrors,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
