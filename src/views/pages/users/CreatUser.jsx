import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  UncontrolledAlert,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Check } from "react-feather";
import { AsyncPaginate } from "react-select-async-paginate";
import { getRolesDDLAsync } from "../../../redux/roles/rolesActions";
import { getHubsDDLAsync } from "../../../redux/hubs/hubsActions";
import { createUser } from "../../../redux/users/usersActions";
import { removeServerError } from "../../../redux/serverErrors/serverErrorsActions";
import LazyButton from "../../../components/shared/lazyButton";
import { noActionsRoles } from "../../../utility/constants";
import CheckBox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import CancelButton from "../../../components/shared/cancelButton";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import { can } from "../../../configs/casl/ability";
import NoPermissions from "../../../components/shared/noPermission";
/**
 * Createuser Component
 * @param {props} ReactProps
 */
const CreateUser = () => {
  const dispatch = useDispatch();

  useBreadCrumb({
    breadCrumbTitle: "Create User",
    breadCrumbItems: [
      {
        title: "Users",
        url: "/users",
      },
      {
        title: "Create User",
      },
    ],
  });

  const { serverErrors, loaders } = useSelector((state) => state);
  const [predifinedRolesWarning, setPredifinedRolesWarning] = useState(() => null);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    roles: [],
    hubs: [],
    all_hubs: 0,
  };
  const onSubmit = (values) => {
    const user = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      roles: values.roles.map((role) => role.value),
      hubs: values.hubs.map((hub) => hub.value),
      all_hubs: values.all_hubs,
    };
    dispatch(createUser(user));
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("This field is required!")
      .max(100, "The maximum number of characters is 100"),
    email: Yup.string().email("Please enter a valid email").required("This field is required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    let found;
    if (formik.values.roles) {
      found = formik.values.roles?.some((r) => noActionsRoles.includes(r.label));
    }
    if (found) {
      setPredifinedRolesWarning({
        message: <FormattedMessage id="You have selected one or more Pre-Defined Role(s)" />,
        description: <FormattedMessage id="You can only select one hub" />,
      });
      formik.setFieldValue("all_hubs", 0);
    } else {
      setPredifinedRolesWarning(null);
    }
  }, [formik.values.roles]);

  if (!can("add", "users")) {
    return <NoPermissions />;
  }

  return (
    <>
      <Card className="p-2" style={{ marginBottom: 400 }}>
        <CardHeader>
          <FormattedMessage id="title" />
        </CardHeader>
        <CardBody>
          <Form className="w-100" onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg="6">
                {/* user name */}
                <FormGroup>
                  <Label for="name" className="mb-1">
                    <FormattedMessage id="Name" />*
                  </Label>
                  <FormattedMessage id="Username">
                    {(placeholder) => (
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={placeholder}
                        {...formik.getFieldProps("name")}
                        invalid={formik.errors.name && formik.touched.name}
                      />
                    )}
                  </FormattedMessage>

                  {/* Front end validation */}
                  <FormFeedback>{formik.touched.name && formik.errors.name}</FormFeedback>
                  {/* Back end validation */}
                  {serverErrors.name && (
                    <FormFeedback className="d-block">
                      <UncontrolledAlert color="danger">{serverErrors.name}</UncontrolledAlert>
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col lg="6">
                {/* user email */}
                <FormGroup>
                  <Label for="email" className="mb-1">
                    <FormattedMessage
                      id="label"
                      values={{
                        name: "Email",
                      }}
                    />
                    *
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email..."
                    {...formik.getFieldProps("email")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (serverErrors.email) removeServerError("email");
                    }}
                    invalid={formik.errors.email && formik.touched.email}
                  />
                  {/* Front end validation */}
                  <FormFeedback>{formik.touched.email && formik.errors.email}</FormFeedback>
                  {/* Back end validation */}
                  {serverErrors.email && (
                    <FormFeedback className="d-block">
                      <UncontrolledAlert color="danger">{serverErrors.email}</UncontrolledAlert>
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>

              <Col lg="6">
                {/*  phone number */}
                <FormGroup>
                  <Label for="phone" className="mb-1">
                    <FormattedMessage
                      id="label"
                      values={{
                        name: "Phone Number",
                      }}
                    />
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number..."
                    {...formik.getFieldProps("phone")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (serverErrors.phone) removeServerError("phone");
                    }}
                    invalid={formik.errors.phone && formik.touched.phone}
                  />
                  {/* Front end validation */}
                  <FormFeedback>{formik.touched.phone && formik.errors.phone}</FormFeedback>
                  {/* Backend validation */}
                  {serverErrors.phone && (
                    <FormFeedback className="d-block">
                      <UncontrolledAlert color="danger">{serverErrors.phone}</UncontrolledAlert>
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col lg="6">
                <Label for="roles" className="mb-1">
                  <FormattedMessage id="Roles" />
                </Label>
                <AsyncPaginate
                  id="roles"
                  value={formik.values.roles}
                  loadOptions={getRolesDDLAsync}
                  onChange={(e) => {
                    formik.setFieldValue("roles", e || []);
                  }}
                  isMulti
                  debounceTimeout={1000}
                  isLoading={loaders.getRolesDDLAsync}
                  additional={{
                    page: 1,
                  }}
                  placeholder={
                    loaders.getRolesDDLAsync ? (
                      <span>
                        Loading... <Spinner style={{ height: 20, width: 20 }} />
                      </span>
                    ) : (
                      "Search Roles"
                    )
                  }
                />
                {predifinedRolesWarning && (
                  <FormFeedback className="d-block">
                    <UncontrolledAlert color="warning">
                      {predifinedRolesWarning.message}
                    </UncontrolledAlert>
                  </FormFeedback>
                )}
              </Col>
              <Col lg="12">
                <CheckBox
                  className="w-fit my-2"
                  name="allHubs"
                  color="primary"
                  disabled={predifinedRolesWarning}
                  icon={<Check className="vx-icon" size={16} />}
                  label={<FormattedMessage id="All Hubs" />}
                  checked={formik.values.all_hubs}
                  onChange={(e) => {
                    formik.setFieldValue("all_hubs", +e.target.checked);
                    formik.setFieldValue("hubs", []);
                  }}
                />
                <Label for="hubs" className="mb-1">
                  <FormattedMessage id="Hubs" />
                </Label>
                <AsyncPaginate
                  id="hubs"
                  value={formik.values.hubs}
                  loadOptions={getHubsDDLAsync}
                  onChange={(e) => {
                    formik.setFieldValue("hubs", e || []);
                  }}
                  isMulti
                  debounceTimeout={1000}
                  isLoading={loaders.getHubsDDLAsync}
                  isDisabled={formik.values.all_hubs}
                  additional={{
                    page: 1,
                  }}
                  placeholder={
                    loaders.getHubsDDLAsync ? (
                      <span>
                        Loading... <Spinner style={{ height: 20, width: 20 }} />
                      </span>
                    ) : (
                      "Search Hubs"
                    )
                  }
                />
                {predifinedRolesWarning && (
                  <FormFeedback className="d-block">
                    <UncontrolledAlert color="warning">
                      {predifinedRolesWarning.description}
                    </UncontrolledAlert>
                  </FormFeedback>
                )}
              </Col>
            </Row>
            {/* form buttons */}
            <Row className="mt-2">
              <Col>
                <LazyButton
                  label="Create user"
                  loader={loaders.createUser}
                  className=" mr-1"
                  disabled={Boolean(predifinedRolesWarning && formik.values.hubs.length > 1)}
                />
                <CancelButton url="/users" />
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default CreateUser;
