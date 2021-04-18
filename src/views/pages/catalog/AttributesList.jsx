import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, UncontrolledTooltip, Input, Button, Card, CardBody } from "reactstrap";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { RefreshCw } from "react-feather";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import { truncate, appendURLParams } from "../../../utility/commonFunctions";
import {
  getAttributes,
  syncAttributes,
  checkSyncAttributes,
} from "../../../redux/catalog/attributes/attributesActions";
import { can } from "../../../configs/casl/ability";
import LazyButton from "../../../components/shared/lazyButton";
import LazyAlert from "../../../components/shared/LazyAlert";
import SyncStatus from "../../../components/shared/syncStatus";
import { syncStatus } from "../../../utility/constants";
import ListDataTable from "../../../components/shared/listDataTable";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * AttributesList Component
 * @param {object} ReactProps - ReactProps
 */
const AttributesList = () => {
  const [alertData, setAlertData] = useState(() => ({ show: false, data: null }));
  const { loaders, attributes } = useSelector((state) => state);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  useBreadCrumb({
    breadCrumbTitle: "Attributes",

    breadCrumbItems: [
      {
        title: "Attributes",
      },
    ],
  });

  // cell width
  const minWidth = "150px";

  useEffect(() => {
    if (can("view", "attributes")) {
      if (query.get("page")) {
        dispatch(getAttributes({ page: +query.get("page") }));
      } else {
        dispatch(getAttributes({ page: 1 }));
      }
    }
  }, [query.get("page")]);
  // Table Columns
  const columns = [
    {
      name: "name",
      selector: "name",
      minWidth,
      cell: (row) => (
        <span id={`name-${row.id}`}>
          {truncate(row.name, 10)}
          <UncontrolledTooltip placement="top" target={`name-${row.id}`}>
            {row.name}
          </UncontrolledTooltip>
        </span>
      ),
    },
    {
      name: "Type",
      selector: "type",
      minWidth,
      center: true,
      cell: (row) => <span id={`type-${row.id}`}>{row.type.description}</span>,
    },
    {
      name: "variations",
      selector: "variations",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`variation-${row.id}`}>
          {truncate(row.variations, 90)}
          <UncontrolledTooltip placement="top" target={`variation-${row.id}`}>
            {row.variations}
          </UncontrolledTooltip>
        </span>
      ),
    },
  ];

  // Table Data to be got from server
  const [data, setData] = useState(() => []);
  const [meta, setMeta] = useState(() => null);
  const [name, setName] = useState(() => "");

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    if (attributes.attributesList) {
      const listData = [];
      attributes.attributesList.data.forEach((ele) => {
        const data = {
          id: ele.id,
          variations: "",
          name: ele.name,
          type: ele.type,
        };
        if (ele.name) {
          ele.name.trim();
        }
        if (ele.variations.length > 0) {
          ele.variations.forEach((variation) => {
            // if not the last ele
            if (ele.variations.indexOf(variation) !== ele.variations.length - 1) {
              data.variations += ` ${variation.name} -`;
              // if last ele
            } else {
              data.variations += ` ${variation.name}`;
            }
          });
          // if has no variatiion
        } else {
          data.variations = "";
        }
        listData.push(data);
      });
      setData(listData);
      setMeta(attributes.attributesList.meta);
    }
  }, [attributes.attributesList]);

  const handlePagination = (page) => {
    // getting data from server using params
    dispatch(getAttributes({ page: page.selected + 1, name }));

    // adding search on url
    history.push(`attributes?page=${page.selected + 1}`);
  };

  const handleFilter = (name) => {
    dispatch(getAttributes({ page: 1, name }));
  };

  const renderList = () => {
    if (can("view", "attributes")&&attributes.attributesList) {
      return (
        <Row>
          <Col sm="12">
            <div className="data-list-header d-flex justify-content-between flex-wrap">
              <div className="actions-left d-flex flex-wrap">
                <div>
                  <Row>
                    <Col sm="8">
                      <Input
                        style={{ display: "inline", padding: 19 }}
                        type="text"
                        value={name}
                        placeholder=" Search by name..."
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            handleFilter(event.target.value);
                          }
                        }}
                      />
                    </Col>
                    <Col sm="4">
                      <Button
                        className="add-new-btn"
                        color="primary"
                        onClick={() => handleFilter(name)}
                      >
                        <span className="align-middle">Search</span>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="12">
            <ListDataTable
              columns={columns}
              data={data}
              meta={meta}
              handlePagination={handlePagination}
              onRowClicked={(row) => {
                history.push(`/catalog/attributes/attribute-details/${row.id}`);
              }}
            />
          </Col>
        </Row>
      );
    }
    if (can("view", "attributes")) {
      return <Spinner />;
    }
    return (
      <Card className="mt-2">
        <CardBody>
          <h2 className="text-center">You don't have permission to view the attributes list</h2>
        </CardBody>
      </Card>
    );
  };

  const renderSyncBtn = () => {
    if (can("sync", "attributes"))
      return (
        <div className="text-right mb-2 ml-auto w-25">
          <RefreshCw
            id="refresh"
            className="pointer mr-2 text-primary"
            size={16}
            onClick={() => {
              dispatch(
                checkSyncAttributes(can("view", "attributes"), "viewToaster", "From Refresh"),
              );
            }}
          />
          <UncontrolledTooltip target="refresh">Refresh Sync Status</UncontrolledTooltip>
          <LazyButton
            outline
            loadingText="Syncing..."
            label="Sync Magento"
            loader={attributes.syncStatus?.status.value === syncStatus.SYNC_IN_PROGRESS}
            disabled={loaders.checkSyncAttributes}
            onClick={() => {
              setAlertData((prevData) => ({
                ...prevData,
                show: true,
                data: "Magento",
              }));
            }}
          />
          {attributes.syncStatus?.status.value !== syncStatus.NO_SYNC_YET &&
            attributes.syncStatus?.updated_at && (
              <small className="d-block mt-1">
                Updated: {moment.unix(attributes.syncStatus?.updated_at).fromNow()}
              </small>
            )}
        </div>
      );
  };
  return (
    <>
      <LazyAlert
        confirmLabel="Yes"
        cancelLabel="No"
        show={alertData.show}
        loader={loaders.syncAttributes}
        message={<span>Do you want to get the attributes from {alertData.data}?</span>}
        onConfirm={() => {
          const params = { integration: "magento" };
          dispatch(syncAttributes(params, can("view", "attributes")));
          setTimeout(() => {
            setAlertData((prevData) => ({ ...prevData, show: false, data: null }));
          }, 500);
        }}
        onCancel={() => {
          setAlertData((prevData) => ({ ...prevData, show: false }));
        }}
      />
      {attributes.syncStatus?.updated_at && (
        <SyncStatus status={attributes.syncStatus} moduleName="Attributes" />
      )}

      {renderSyncBtn()}

      {renderList()}
    </>
  );
};

export default AttributesList;
