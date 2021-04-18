import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Row, UncontrolledTooltip } from "reactstrap";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import { truncate } from "../../../utility/commonFunctions";
import { deleteUser, listUsers } from "../../../redux/users/usersActions";
import LazyAlert from "../../../components/shared/LazyAlert";
import { can } from "../../../configs/casl/ability";
import AddButton from "../../../components/shared/addButton";
import ListActionsComponent from "../../../components/shared/listActions";
import ListDataTable from "../../../components/shared/listDataTable";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
/**
 * RolesList Component
 * @param {object} ReactProps - ReactProps
 */
const RolesList = () => {
  const [alertData, setAlertData] = useState(() => ({ show: false, user: null }));
  const [columns, setColumns] = useState(() => []);

  const { loaders, users, permissions } = useSelector((state) => state);
  const dispatch = useDispatch();

  // Table Data to be got from server
  const [data, setData] = useState(() => []);

  const [meta, setMeta] = useState(() => null);
  useBreadCrumb({
    breadCrumbTitle: "Users",
    breadCrumbItems: [
      {
        title: "Users",
      },
    ],
  });

  // Table Columns
  useEffect(() => {
    const cols = [
      {
        name: (
          <FormattedMessage
            id="cols"
            values={{
              name: "User Name",
            }}
          />
        ),
        selector: "userName",
        center: true,
        cell: (row) => (
          <span id={`userName-${row.id}`} className="text-center">
            {truncate(row.userName, 15)}
            <UncontrolledTooltip placement="top" target={`userName-${row.id}`}>
              {row.userName}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: (
          <FormattedMessage
            id="cols"
            values={{
              name: "Email",
            }}
          />
        ),
        selector: "email",
        center: true,
        cell: (row) => (
          <span id={`email-${row.id}`} className="text-center">
            {truncate(row.email, 15)}
            <UncontrolledTooltip placement="top" target={`email-${row.id}`}>
              {row.email}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: "Phone Number",
        selector: "phoneNumber",
        center: true,
        cell: (row) => <span className="text-center">{row.phoneNumber}</span>,
      },
      {
        name: "Created Date",
        selector: "createdDate",
        center: true,
        cell: (row) => (
          <span className="text-center">{moment.unix(row.createdDate).format("LL")}</span>
        ),
      },
      {
        name: "Created By",
        selector: "createdBy",
        center: true,
      },
      {
        name: "Hubs",
        selector: "hubs",
        center: true,
        cell: (row) => (
          <span id={`hub-${row.id}`} className="text-center">
            {truncate(row.hubs, 20)}
            <UncontrolledTooltip placement="top" target={`hub-${row.id}`}>
              {row.hubs}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: "Roles",
        selector: "roles",
        center: true,
        cell: (row) => (
          <span id={`role-${row.id}`} className="text-center">
            {truncate(row.roles, 20)}
            <UncontrolledTooltip placement="top" target={`role-${row.id}`}>
              {row.roles}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: "Last Login",
        selector: "lastLogin",
        center: true,
        cell: (row) => (
          <span className="text-center">
            {row.lastLogin ? (
              moment.unix(row.lastLogin).fromNow()
            ) : (
              <span className="badge badge-warning text-center">New</span>
            )}
          </span>
        ),
      },
    ];

    // adding actions col if any actions is allowed
    if (can("edit", "users") || can("delete", "users")) {
      cols.push({
        name: "Actions",
        center: true,
        cell: (row) => <ActionsComponent row={row} />,
      });
    }

    setColumns(cols);
  }, [permissions.roles]);

  // getting the list of users from server
  useEffect(() => {
    if (can("view", "users")) dispatch(listUsers({ page: 1 }));
  }, []);

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    if (users.usersList) {
      const listData = [];
      users.usersList.data.forEach((ele) => {
        if (!ele.is_super) {
          const data = {
            id: ele.id,
            userName: ele.name,
            email: ele.email,
            phoneNumber: ele.phone ? ele.phone : "No Phone",
            createdDate: ele.created_at,
            createdBy: ele.created_by.name,
            lastLogin: ele.last_login_at,
            hubs: "",
            all_hubs: ele.all_hubs ? ele.all_hubs : 0,
            roles: "", // placeholder to convert the arr into one string
          };
          // converting roles arr into one string splitted by -
          if (ele.roles.length > 0) {
            ele.roles.forEach((role) => {
              // if not the last ele
              if (ele.roles.indexOf(role) !== ele.roles.length - 1) {
                data.roles += ` ${role.name} -`;
                // if last ele
              } else {
                data.roles += ` ${role.name}`;
              }
            });
            // if has no role
          } else {
            data.roles = "No Roles";
          }

          if (ele.hubs.length > 0) {
            ele.hubs.forEach((hub) => {
              // if not the last ele
              if (ele.hubs.indexOf(hub) !== ele.hubs.length - 1) {
                data.hubs += ` ${hub.name} -`;
                // if last ele
              } else {
                data.hubs += ` ${hub.name}`;
              }
            });
            // if has no role
          } else if (ele.all_hubs === 1) {
            data.hubs = "All hubs";
          } else {
            data.hubs = "No Hubs";
          }
          listData.push(data);
        }
      });
      setData(listData);
      setMeta(users.usersList.meta);
    }
  }, [users.usersList]);

  const handlePagination = (page) => {
    // getting data from server using params
    dispatch(listUsers({ page: page.selected + 1 }));

    // adding search on url
    history.push(`users?page=${page.selected + 1}`);
  };

  const ActionsComponent = ({ row }) => (
    <>
      <ListActionsComponent
        canEdit={{
          show: can("edit", "users"),
          onClick: () => {
            history.push(`/users/edit-user/${row.id}`);
          },
        }}
        canDelete={{
          show: can("delete", "users"),
          onClick: () => {
            setAlertData((prevData) => ({
              ...prevData,
              show: true,
              user: row,
            }));
          },
        }}
      />
    </>
  );

  const renderList = () => {
    const onRowClicked = (row) => {
      history.push(`/users/edit-user/${row.id}`);
    };
    if (users.usersList && can("view", "users")) {
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
    if (can("view", "users")) {
      return <Spinner />;
    }
    return (
      <Card className="mt-2">
        <CardBody>
          <h2 className="text-center">You don't have permission to view the users list</h2>
        </CardBody>
      </Card>
    );
  };

  const renderAddNewBtn = () => {
    if (can("add", "users")) {
      return (
        <div className=" mb-2 ml-1">
          <AddButton url="/users/create-user" />
        </div>
      );
    }
  };
  return (
    <>
      <LazyAlert
        confirmLabel="Delete"
        cancelLabel="Cancel"
        show={alertData.show}
        loader={loaders.deleteUser}
        btnColor="danger"
        message={
          <span>
            Are you sure you want to delete
            <small> "{alertData.user && alertData.user.userName}" ? </small>
          </span>
        }
        onConfirm={() => {
          dispatch(deleteUser(alertData.user.id));
          setTimeout(() => {
            setAlertData((prevData) => ({ ...prevData, show: false }));
          }, 1000);
        }}
        onCancel={() => {
          setAlertData((prevData) => ({ ...prevData, show: false }));
        }}
      />
      {renderList()}
    </>
  );
};

export default RolesList;
