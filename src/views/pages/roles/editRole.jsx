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
import { randomNumber, containsAll } from "../../../utility/commonFunctions";
import {
  editRole,
  getPermissions,
  viewRole,
  clearViewedRole,
} from "../../../redux/roles/rolesActions";
import { removeServerError } from "../../../redux/serverErrors/serverErrorsActions";
import { can } from "../../../configs/casl/ability";
import CancelButton from "../../../components/shared/cancelButton";
import { noActionsRoles } from "../../../utility/constants";
import { history } from "../../../history";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import NoPermission from "../../../components/shared/noPermission";

/**
 * EditRole Component
 * @param {object} ReactProps - ReactProps
 */
const EditRole = ({
  match,
  serverPermissions,
  getPermissions,
  editRole,
  serverErrors,
  removeServerError,
  loaders,
  viewRole,
  viewedRole,
  clearViewedRole,
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

  const [initialValues, setInitialValues] = useState("");
  useBreadCrumb({
    breadCrumbTitle: "Edit Role",
    breadCrumbItems: [
      {
        title: "Roles",
        url: "/roles",
      },
      {
        title: "Edit Role",
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
    if (can("edit", "roles")) getPermissions();
  }, [getPermissions]);

  // bind permissions from server
  useEffect(() => {
    if (serverPermissions) {
      setPermissionAccordions(serverPermissions);
    }
  }, [serverPermissions]);

  // getting role with id from server
  useEffect(() => {
    viewRole(match.params.id);
    return () => {
      clearViewedRole();
    };
  }, [viewRole]);

  // bind the recieved role from server
  useEffect(() => {
    if (viewedRole) {
      if (noActionsRoles.includes(viewedRole.name)) {
        history.push("/roles");
        return;
      }
      setInitialValues({ roleName: viewedRole.name });
      const pers = [...permissions];
      viewedRole.permissions.forEach((ele) => {
        pers.push(ele.id);
      });
      setpermissions(pers);
    }
  }, [viewedRole]);

  const handleChange = (checked, id, key = null) => {
    // removing frontend validation from permissions
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

  const renderFormInput = () => {
    if (initialValues) {
      return (
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
      );
    }
    return (
      <Card>
        <CardBody>
          <Skeleton height={40} />
        </CardBody>
      </Card>
    );
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
                        checked={permissions.includes(option.id)}
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
        {arr.map((ele) => (
          <Card key={randomNumber(0, 10000)} className="mb-1">
            <CardBody>
              <Skeleton height={20} width={randomNumber(100, 300)} />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };
  const checkTheAllInputCheckbox = (permissions, options) => {
    const optionIds = [];
    options.forEach((ele) => optionIds.push(ele.id));
    return containsAll(permissions, optionIds);
  };
  const handleInputChange = (e, inputName) => {
    formik.handleChange(e);
    if (serverErrors[inputName]) removeServerError(inputName);
  };

  const onSubmit = (values) => {
    const body = {
      name: values.roleName,
      permissions,
    };

    if (permissions.length !== 0) {
      editRole(match.params.id, body);
    }
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
    enableReinitialize: true,
  });

  if (!can("edit", "roles")) {
    return <NoPermission />;
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>Role Name</CardHeader>
          <CardBody>{renderFormInput()}</CardBody>
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
          {can("edit", "roles") && (
            <LazyButton
              label="Save"
              loader={loaders.saveBtn}
              onClick={() => {
                if (permissions.length === 0) {
                  setPermissionsValidation({
                    permissions: "This field is required!",
                  });
                }
              }}
            />
          )}

          <CancelButton className="ml-2" url="/roles" />
        </div>
      </Form>
    </>
  );
};

const mapDispatchToProps = {
  getPermissions,
  removeServerError,
  viewRole,
  editRole,
  clearViewedRole,
};

const mapStateToProps = (state) => ({
  serverPermissions: state.roles.permissions,
  serverErrors: state.serverErrors,
  loaders: state.loaders,
  viewedRole: state.roles.viewedRole,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditRole);
