import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Row, UncontrolledTooltip } from "reactstrap";
import { truncate } from "../../../utility/commonFunctions";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import ConfirmDeleteRoleAlert from "./confirmDeleteRoleAlert";
import { deleteRole, getRoles } from "../../../redux/roles/rolesActions";
import { can } from "../../../configs/casl/ability";
import LazyAlert from "../../../components/shared/LazyAlert";
import AddButton from "../../../components/shared/addButton";
import ListActionsComponent from "../../../components/shared/listActions";
import ListDataTable from "../../../components/shared/listDataTable";
import { noActionsRoles } from "../../../utility/constants";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * RolesList Component
 */
const RolesList = () => {
  const [columns, setColumns] = useState(() => []);
  const [alertData, setAlertData] = useState(() => ({ show: false, role: null }));
  const { roles, permissions } = useSelector((state) => state);
  const dispatch = useDispatch();
  useBreadCrumb({
    breadCrumbTitle: "Roles",
    breadCrumbItems: [
      {
        title: "Roles",
      },
    ],
  });

  // cell width
  const minWidth = "150px";

  // Table Columns
  useEffect(() => {
    const cols = [
      {
        name: "Role Name",
        selector: "roleName",
        minWidth,
        center: true,
        cell: (row) => (
          <span id={`roleName-${row.id}`}>
            {truncate(row.name, 10)}
            <UncontrolledTooltip placement="top" target={`roleName-${row.id}`}>
              {row.name}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: "Number Of Users",
        selector: "numberOfUsers",
        minWidth,
        center: true,
        cell: (row) => <span id={`numberOfUsers-${row.id}`}>{row.number_of_users}</span>,
      },
    ];

    // adding actions col if any actions is allowed
    if (can("edit", "roles") || can("delete", "roles")) {
      cols.push({
        name: "Actions",
        cell: (row) => <ActionsComponent row={row} />,
      });
    }

    setColumns(cols);
  }, [permissions.roles]);

  // Table Data to be got from server
  const [data, setData] = useState(() => []);

  const [meta, setMeta] = useState(() => null);

  // getting the list of rules from server
  useEffect(() => {
    if (can("view", "roles")) dispatch(getRoles({ page: 1, per_page: 20 }));
  }, []);

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    if (roles.rolesList) {
      const listData = [];
      roles.rolesList.data.forEach((ele) => {
        if (!ele.is_super) {
          listData.push({
            id: ele.id,
            name: ele.name,
            number_of_users: ele.number_of_users,
          });
        }
      });
      setData(listData);
      setMeta(roles.rolesList.meta);
    }
  }, [roles.rolesList]);

  const handlePagination = (page) => {
    // getting data from server using params
    dispatch(getRoles({ page: page.selected + 1, per_page: 20 }));

    // adding search on url
    history.push(`roles?page=${page.selected + 1}`);
  };

  const ActionsComponent = ({ row }) => (
    <>
      <ListActionsComponent
        canEdit={{
          show: can("edit", "roles") && !noActionsRoles.includes(row.name),
          onClick: () => {
            history.push(`/roles/edit-role/${row.id}`);
          },
        }}
        canDelete={{
          show: can("delete", "roles") && !noActionsRoles.includes(row.name),
          onClick: () => {
            setAlertData((prevData) => ({
              ...prevData,
              show: true,
              role: row,
            }));
          },
        }}
      />
    </>
  );

  const renderList = () => {
    if (roles.rolesList && can("view", "roles")) {
      const onRowClicked = (row) => {
        if (!noActionsRoles.includes(row.name)) history.push(`/roles/edit-role/${row.id}`);
      };
      return (
        <Row>
          <Col sm="12">{renderAddNewBtn()}</Col>
          <Col sm="12">
            <ListDataTable
              columns={columns}
              meta={meta}
              data={data}
              handlePagination={handlePagination}
              onRowClicked={onRowClicked}
            />
          </Col>
        </Row>
      );
    }
    if (can("view", "roles")) {
      return <Spinner />;
    }
    return (
      <Card className="mt-2">
        <CardBody>
          <h2 className="text-center">You don't have permission to view the roles list</h2>
        </CardBody>
      </Card>
    );
  };

  const renderAddNewBtn = () => {
    if (can("add", "roles"))
      return (
        <div className="mb-2 ml-1">
          <AddButton url="/roles/create-role" />
        </div>
      );
  };
  return (
    <>
      {alertData.role?.number_of_users === 0 ? (
        <LazyAlert
          confirmLabel="Delete"
          show={alertData.show}
          message={<span>Are you sure you want to delete the role ?</span>}
          onConfirm={() => {
            dispatch(deleteRole(alertData.role.id));
            handlePagination(1);
            setAlertData((prevData) => ({ ...prevData, show: false }));
          }}
          onCancel={() => {
            setAlertData((prevData) => ({ ...prevData, show: false }));
          }}
        />
      ) : (
        <ConfirmDeleteRoleAlert
          show={alertData.show}
          role={alertData.role}
          onCancel={() => {
            setAlertData((prevData) => ({ ...prevData, show: false }));
          }}
          onConfirm={() => {
            handlePagination(1);
            setAlertData((prevData) => ({ ...prevData, show: false }));
          }}
        ></ConfirmDeleteRoleAlert>
      )}
      {renderList()}
    </>
  );
};

export default RolesList;
