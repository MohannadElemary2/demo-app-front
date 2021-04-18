import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Collapse,
  Row,
  Col,
  FormGroup,
  Input,
  Form,
  FormFeedback,
  UncontrolledAlert,
} from "reactstrap";
import * as Yup from "yup";

import { ChevronDown, Check } from "react-feather";
import classnames from "classnames";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import { useFormik } from "formik";
import CheckBox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

import LazyButton from "../../../components/shared/lazyButton";
import { containsAll, randomNumber } from "../../../utility/commonFunctions";
import { createRole, getPermissions } from "../../../redux/roles/rolesActions";
import { removeServerError } from "../../../redux/serverErrors/serverErrorsActions";
import CancelButton from "../../../components/shared/cancelButton";

import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import { can } from "../../../configs/casl/ability";
import NoPermission from "../../../components/shared/noPermission";
/**
 * CreateRole Component
 * @param {object} ReactProps - ReactProps
 */
const CreateRole = ({
  serverPermissions,
  getPermissions,
  createRole,
  serverErrors,
  removeServerError,
  loaders,
}) => {
  // Managa Collapse
  const [status, setStatus] = useState(() => "closed");
  const [collapseID, setCollapseID] = useState(() => "");

  // permissions collected from the user to be sent to server
  const [permissions, setpermissions] = useState(() => []);

  // initial permissions to be got from server
  const [permissionAccordions, setPermissionAccordions] = useState(() => null);

  // permissions frontend validation
  const [permissionsValidation, setPermissionsValidation] = useState(() => ({
    permissions: null,
  }));

  useBreadCrumb({
    breadCrumbTitle: "Create Role",
    breadCrumbItems: [
      {
        title: "Roles",
        url: "/roles",
      },
      {
        title: "Create Role",
      },
    ],
  });

  const toggleCollapse = (collapseID) => {
    setCollapseID((prevcollapseID) => (prevcollapseID !== collapseID ? collapseID : ""));
  };

  const onEntered = (id) => {
    if (id === collapseID) setStatus("Opened");
  };
  const onEntering = (id) => {
    if (id === collapseID) setStatus("Opening...");
  };

  const onExited = (id) => {
    if (id === collapseID) setStatus("Closed");
  };

  const onExiting = (id) => {
    if (id === collapseID) setStatus("Closing...");
  };

  // getting permissions from server
  useEffect(() => {
    if (can("add", "roles")) getPermissions();
  }, [getPermissions]);

  // bind data from server
  useEffect(() => {
    if (serverPermissions) {
      setPermissionAccordions(serverPermissions);
    }
  }, [serverPermissions]);

  const handleChange = (checked, id, key = null) => {
    if (permissionsValidation.permissions) {
      setPermissionsValidation({
        ...permissionsValidation,
        permissions: null,
      });
    }

    // if the `all` checkbox is checked
    if (typeof id === "string" && id.search("all") === 0) {
      Object.keys(permissionAccordions).forEach((k) => {
        // check to loop to checkboxes related to the same `all` checkbox
        if (k === key) {
          let pers = [...permissions];
          // looping through all checkboxes that related to the `all` checkbox
          permissionAccordions[key].forEach((ele) => {
            // collecting ids to permissions arr
            if (checked) {
              document.getElementById(ele.id).checked = true;
              pers.push(ele.id);
            } else {
              document.getElementById(ele.id).checked = false;
              pers = pers.filter((p) => p !== ele.id);
            }
            setpermissions(pers);
          });
        }
      });
      // if any other checkbox is checked
    } else {
      let pers = [...permissions];
      if (checked) {
        pers.push(id);
      } else {
        pers = pers.filter((p) => p !== id);
      }
      setpermissions(pers);
    }
  };

  const renderPermissions = () => {
    if (permissionAccordions) {
      return Object.keys(permissionAccordions).map((key) => (
        <div className="collapse-margin accordion vx-collapse" key={key}>
          <Card
            className={classnames("shadow-none", {
              "collapse-collapsed": status === "Closed" && collapseID === key,
              "collapse-shown": status === "Opened" && collapseID === key,
              closing: status === "Closing..." && collapseID === key,
              opening: status === "Opening..." && collapseID === key,
            })}
          >
            <CardHeader onClick={() => toggleCollapse(key)}>
              <CardTitle className="lead collapse-title collapsed text-truncate w-75">
                {key}
              </CardTitle>
              <ChevronDown className="collapse-icon" size={15} />
            </CardHeader>
            <Collapse
              isOpen={key === collapseID}
              onEntering={() => onEntering(key)}
              onEntered={() => onEntered(key)}
              onExiting={() => onExiting(key)}
              onExited={() => onExited(key)}
            >
              <CardBody className="p-2">
                <Row>
                  <Col lg={4}>
                    <CheckBox
                      name="all"
                      color="primary"
                      icon={<Check className="vx-icon" size={16} />}
                      label="All"
                      id={`all-${key}`}
                      className="permission-checkbox"
                      value="all"
                      checked={checkTheAllInputCheckbox(permissions, permissionAccordions[key])}
                      onChange={(e) => handleChange(e.currentTarget.checked, "all", key)}
                    />
                  </Col>
                  {permissionAccordions[key].map((option) => (
                    <Col key={option.id} lg={4}>
                      <CheckBox
                        name={option.name}
                        color="primary"
                        icon={<Check className="vx-icon" size={16} />}
                        label={option.name}
                        id={option.id}
                        className="permission-checkbox"
                        value={option.id}
                        onChange={(e) => handleChange(e.currentTarget.checked, option.id, key)}
                      />
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Collapse>
          </Card>
        </div>
      ));
    }
    const arr = [...Array(randomNumber(6, 12))];
    return (
      <div>
        {arr.map(() => (
          <Card key={randomNumber(0, 1000)} className="mb-1">
            <CardBody>
              <Skeleton height={20} width={randomNumber(100, 300)} />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  const handleInputChange = (e, inputName) => {
    formik.handleChange(e);
    if (serverErrors[inputName]) removeServerError(inputName);
  };

  const checkTheAllInputCheckbox = (permissions, options) => {
    const optionIds = [];
    options.forEach((ele) => optionIds.push(ele.id));
    return containsAll(permissions, optionIds);
  };

  const onSubmit = (values) => {
    const body = {
      name: values.roleName,
      permissions,
    };

    if (permissions.length !== 0) {
      createRole(body);
    }
  };

  const initialValues = {
    roleName: "",
  };
  const validationSchema = Yup.object({
    roleName: Yup.string()
      .required("This field is required!")
      .min(1, "The minimum number of character is 1")
      .max(25, "The maximum number of characters is 25"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  if (!can("add", "roles")) {
    return <NoPermission />;
  }
  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>Role Name</CardHeader>
          <CardBody>
            <FormGroup>
              <Input
                invalid={formik.errors.roleName && formik.touched.roleName}
                className="mb-1"
                type="text"
                name="roleName"
                placeholder="Type role name"
                {...formik.getFieldProps("roleName")}
                onChange={(e) => {
                  handleInputChange(e, "name");
                }}
              />
              {/* Front end validation */}
              <FormFeedback className="d-block">
                {formik.touched.roleName && formik.errors.roleName}
              </FormFeedback>
              {/* Backend validation when check inactive account */}
              {serverErrors.name && (
                <FormFeedback className="d-block">
                  <UncontrolledAlert color="danger">{serverErrors.name}</UncontrolledAlert>
                </FormFeedback>
              )}
            </FormGroup>
          </CardBody>
        </Card>
        <h4 className="mb-2">Permissions</h4>
        {/* Front end validation */}
        {permissionsValidation && (
          <FormFeedback className="d-block mb-2">{permissionsValidation.permissions}</FormFeedback>
        )}
        {/* Backend validation */}
        {serverErrors.permissions && (
          <FormFeedback className="d-block">
            <UncontrolledAlert color="danger">{serverErrors.permissions}</UncontrolledAlert>
          </FormFeedback>
        )}
        {renderPermissions()}

        <div className="mt-3">
          <LazyButton
            label="Create Role"
            loader={loaders.saveBtn}
            onClick={() => {
              if (permissions.length === 0) {
                setPermissionsValidation({
                  permissions: "Please select at least one permission.",
                });
              }
            }}
          />
          <CancelButton className="ml-2" url="/roles" />
        </div>
      </Form>
    </>
  );
};

const mapDispatchToProps = {
  getPermissions,
  removeServerError,
  createRole,
};

const mapStateToProps = (state) => ({
  serverPermissions: state.roles.permissions,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRole);
