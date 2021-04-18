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
import { connect, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { Check } from "react-feather";
import { AsyncPaginate } from "react-select-async-paginate";
import { getRoles, getRolesDDLAsync } from "../../../redux/roles/rolesActions";
import { removeServerError } from "../../../redux/serverErrors/serverErrorsActions";
import LazyButton from "../../../components/shared/lazyButton";
import { getHubs, clearHubs, getHubsDDLAsync } from "../../../redux/hubs/hubsActions";
import { clearUser, viewUser, editUser } from "../../../redux/users/usersActions";
import CancelButton from "../../../components/shared/cancelButton";
import { noActionsRoles } from "../../../utility/constants";
import CheckBox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import { can } from "../../../configs/casl/ability";
import NoPermissions from "../../../components/shared/noPermission";

/**
 * Createuser Component
 * @param {props} ReactProps
 */
const EditUser = ({ loaders, serverErrors, match, editUser, viewUser, userInfo, clearUser }) => {
  const [initialValues, setInitialValues] = useState(() => "");
  const [predifinedRolesWarning, setPredifinedRolesWarning] = useState(() => null);
  const dispatch = useDispatch();

  useBreadCrumb({
    breadCrumbTitle: "Edit User",
    breadCrumbItems: [
      {
        title: "Users",
        url: "/users",
      },
      {
        title: "Edit User",
      },
    ],
  });

  const onSubmit = (values) => {
    const user = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      roles: values.roles.length ? values.roles.map((v) => v.value) : [],
      hubs: values.hubs.length ? values.hubs.map((v) => v.value) : [],
      all_hubs: values.all_hubs,
    };

    editUser(match.params.id, user);
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("This field is required!"),
    email: Yup.string().email("Please enter a valid email").required("This field is required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.roles) {
      const found = formik.values.roles.some((r) => noActionsRoles.includes(r.label));
      if (found) {
        setPredifinedRolesWarning({
          message: <FormattedMessage id="You have selected one or more Pre-Defined Role(s)" />,
          description: <FormattedMessage id="You can only select one hub" />,
        });
        formik.setFieldValue("all_hubs", 0);
      } else {
        setPredifinedRolesWarning(null);
      }
    }
  }, [formik.values.roles]);

  // getting client info on mount
  useEffect(() => {
    if (can("edit", "users")) viewUser(match.params.id);
  }, [viewUser, match.params.id]);

  // adding client info coming from server to the initial val of formik
  useEffect(() => {
    if (userInfo) {
      const rolesIds = userInfo.roles.map((v) => ({
        label: v.name,
        value: v.id,
      }));
      const hubsIds = userInfo.hubs.map((v) => ({
        label: v.name,
        value: v.id,
      }));
      setInitialValues({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone ? userInfo.phone : "",
        roles: rolesIds,
        hubs: hubsIds,
        all_hubs: userInfo.all_hubs,
      });

      rolesIds.forEach((v) => {
        if (noActionsRoles.includes(v.label)) {
          setPredifinedRolesWarning({
            message: <FormattedMessage id="You have selected one or more Pre-Defined Role(s)" />,
            description: <FormattedMessage id="You can only select one hub" />,
          });
        }
      });
    }
    return () => {
      clearUser();
      dispatch(clearHubs());
    };
  }, [clearUser, userInfo, initialValues]);

  const renderForm = () => {
    if (initialValues) {
      return (
        <Card className="p-2">
          <CardHeader>
            <FormattedMessage id="Edit User" />
          </CardHeader>
          <CardBody>
            <Form className="w-100" onSubmit={formik.handleSubmit}>
              <Row>
                <Col lg="6">
                  {/* user name */}
                  <FormGroup>
                    <Label for="email" className="mb-1">
                      <FormattedMessage id="Name" />*
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter name..."
                      {...formik.getFieldProps("name")}
                      invalid={formik.errors.name && formik.touched.name}
                    />
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
                      <FormattedMessage id="Email" />*
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
                  {/* Company phone number */}
                  <FormGroup>
                    <Label for="phone" className="mb-1">
                      <FormattedMessage id="Phone Number" />
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
                      if (!e) {
                        setPredifinedRolesWarning(null);
                      }
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
                    onChange={(value) => {
                      if (value) {
                        const mapedHubs = value.map((v) => ({
                          label: v.label,
                          value: v.value,
                        }));
                        initialValues.hubs = mapedHubs;
                        formik.setFieldValue("hubs", mapedHubs);
                      } else {
                        initialValues.hubs = [];
                        formik.setFieldValue("hubs", []);
                      }
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
                    label="Save"
                    loader={loaders.editUser}
                    disabled={Boolean(predifinedRolesWarning && formik.values.hubs?.length > 1)}
                  />
                  <CancelButton className="ml-2" url="/users" />
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      );
    }
    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="Edit User" />
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg="6" className="mb-2">
              <Skeleton className="w-25 mb-1" />
              <h1>
                <Skeleton />
              </h1>
            </Col>
            <Col lg="6" className="mb-2">
              <Skeleton className="w-25 mb-1" />
              <h1>
                <Skeleton />
              </h1>
            </Col>
            <Col lg="6" className="mb-2">
              <Skeleton className="w-25 mb-1" />
              <h1>
                <Skeleton />
              </h1>
            </Col>
            <Col lg="6" className="mb-2">
              <Skeleton className="w-25 mb-1" />
              <h1>
                <Skeleton />
              </h1>
            </Col>
            <Col lg="12" className="mb-2">
              <Skeleton className="w-25 mb-1" />
              <h1>
                <Skeleton />
              </h1>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <div className="  w-sm-100">
                <h1>
                  <Skeleton width={100} height={40} />
                  <Skeleton width={100} height={40} className="ml-2" />
                </h1>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  if (!can("edit", "users")) {
    return <NoPermissions />;
  }

  return <>{renderForm()}</>;
};

const mapDispatchToProps = {
  getRoles,
  getHubs,
  clearUser,
  viewUser,
  editUser,
};

const mapStateToProps = (state) => ({
  roles: state.roles.rolesList,
  hubs: state.hubs.hubsList,
  userInfo: state.users.viewedUser,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);
