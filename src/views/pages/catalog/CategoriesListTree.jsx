import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, CardImg, Col, Row, Table, UncontrolledTooltip } from "reactstrap";
import { Treebeard, decorators } from "react-treebeard";
import { FormattedMessage } from "react-intl";
import { RefreshCw } from "react-feather";
import moment from "moment";
import {
  checkSyncCategories,
  getCategories,
  syncCategories,
  viewCategoryDetails,
} from "../../../redux/catalog/categories/categoriesActions";
import { styleLight } from "../../../extensions/treeview/Styles";
import { getInnerHTML } from "../../../utility/commonFunctions";
import { can } from "../../../configs/casl/ability";
import LazyButton from "../../../components/shared/lazyButton";
import LazyAlert from "../../../components/shared/LazyAlert";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import defaultProductImage from "../../../assets/img/pages/noimg.jpg";
import SyncStatus from "../../../components/shared/syncStatus";
import { syncStatus } from "../../../utility/constants";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * CategoriesListTree Component
 */
const CategoriesListTree = () => {
  useBreadCrumb({
    breadCrumbTitle: "Categories",
    breadCrumbItems: [
      {
        title: "Categories",
      },
    ],
  });
  const dispatch = useDispatch();

  const treeParentName = "Categories";
  const [data, setData] = useState(() => ({
    name: treeParentName,
    id: 1,
    toggled: true,
    loading: true,
    children: [],
  }));
  const [cursor, setCursor] = useState(() => false);
  const [alertData, setAlertData] = useState(() => ({ show: false, data: null }));

  const { loaders, categories } = useSelector((state) => state);

  const concatName = (data) =>
    data.map((el) => {
      const name = `${el.originalName || el.name} (${el.products_count})`;
      return {
        ...el,
        originalName: el.originalName || el.name,
        name,
      };
    });

  // getting the list of categories from server
  useEffect(() => {
    if (can("view", "categories")) dispatch(getCategories());
  }, []);

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    const data = [];
    if (categories?.categoryTreeList?.length) {
      categories.categoryTreeList.forEach((ele) => {
        data.push({
          ...ele,
          name: `${ele.name} (${ele.products_count})`,
          children: ele.children?.length ? ele.children : null,
          originalName: ele.name,
        });
      });
      setData((prevState) => ({
        ...prevState,
        loading: false,
        children: concatName(data),
      }));

      dispatch(viewCategoryDetails(data[0]));
    }
  }, [categories.categoryTreeList]);

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
      node.children = concatName(node.children);
    }
    setCursor(node);
    setData({ ...data });

    dispatch(viewCategoryDetails(node));
  };

  const renderCatDetails = () => {
    if (categories.categoryDetails && categories.categoryDetails.name !== treeParentName) {
      return (
        <Card>
          <CardImg
            top
            src={categories.categoryDetails.image || defaultProductImage}
            alt="CategoryImage"
            className="w-25 mx-auto mt-2 mb-2"
          />
          <CardBody>
            {/* Name */}
            <h3>Category Name:</h3>
            <p className="mb-2">{categories.categoryDetails.originalName}</p>
            {/* Description */}
            <h3>
              <FormattedMessage id="Description" />
            </h3>
            <p className="mb-2">
              {categories.categoryDetails.description
                ? getInnerHTML(categories.categoryDetails.description)
                : "No Description"}
            </p>

            <hr />
            {/* Sales Channels */}
            <h3 className="mb-2 mt-3">Sales Channels</h3>
            <Table bordered hover responsive className="text-center">
              <tbody>
                {categories.categoryDetails?.sales_channels?.map((ele) => (
                  <tr key={ele.id}>
                    <td>{ele.name}</td>
                    <td>
                      {ele.is_active ? (
                        <span className="badge badge-success">Enabled</span>
                      ) : (
                        <span className="badge badge-warning">Disabled</span>
                      )}
                    </td>
                    {ele.path && (
                      <td>
                        <Button
                          disabled={!ele.is_active}
                          target="_blank"
                          outline
                          color="primary"
                          href={ele.path}
                        >
                          View
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      );
    }
  };

  const renderCategoriesTree = () => (
    <div style={{ maxHeight: "85vh", overflow: "auto" }}>
      {categories?.categoryTreeList?.length !== 0 && (
        <Treebeard data={data} style={styleLight} decorators={decorators} onToggle={onToggle} />
      )}
    </div>
  );

  const renderSyncBtn = () => {
    if (can("sync", "categories")) {
      return (
        <div className="text-right mb-2 ml-auto w-25">
          <RefreshCw
            id="refresh"
            className="pointer mr-1 text-primary"
            size={16}
            onClick={() => {
              dispatch(
                checkSyncCategories(can("view", "categories"), "viewToaster", "From Refresh"),
              );
            }}
          />
          <UncontrolledTooltip target="refresh">Refresh Sync Status</UncontrolledTooltip>
          <LazyButton
            outline
            loadingText="Syncing..."
            label="Sync Magento"
            loader={categories.syncStatus?.status.value === syncStatus.SYNC_IN_PROGRESS}
            disabled={loaders.checkSyncCategories}
            onClick={() => {
              setAlertData((prevData) => ({
                ...prevData,
                show: true,
                data: "Magento",
              }));
            }}
          />
          {categories.syncStatus?.status.value !== syncStatus.NO_SYNC_YET &&
            categories.syncStatus?.updated_at && (
              <small className="d-block mt-1">
                Updated: {moment.unix(categories.syncStatus?.updated_at).fromNow()}
              </small>
            )}
        </div>
      );
    }
  };

  const renderPageStatus = () => {
    if (can("view", "categories") && loaders.listCategories) {
      return <Spinner />;
    }
    if (can("view", "categories") && !categories?.categoryTreeList?.length) {
      return (
        <Card className="mt-2">
          <CardBody>
            <h5 className="text-center">There is no data to display.</h5>
          </CardBody>
        </Card>
      );
    }
  };

  return (
    <>
      <LazyAlert
        confirmLabel="Yes"
        cancelLabel="No"
        show={alertData.show}
        loader={loaders.syncCategories}
        message={<span>Do you want to get the categories from {alertData.data}?</span>}
        onConfirm={() => {
          dispatch(syncCategories({ integration: "magento" }, can("view", "categories")));
          setTimeout(() => {
            setAlertData((prevData) => ({ ...prevData, show: false, data: null }));
          }, 500);
        }}
        onCancel={() => {
          setAlertData((prevData) => ({ ...prevData, show: false }));
        }}
      />
      {categories.syncStatus && (
        <SyncStatus status={categories.syncStatus} moduleName="Categories" />
      )}
      {renderSyncBtn()}
      {/* page status and loader */}
      {renderPageStatus()}
      {can("view", "categories") && (
        <Row>
          {/* TREE */}
          <Col lg={4} className="mb-3">
            {renderCategoriesTree()}
          </Col>
          {/* Details */}
          <Col lg={8}>{renderCatDetails()}</Col>
        </Row>
      )}
      {!can("view", "categories") && (
        <Card className="mt-2">
          <CardBody>
            <h2 className="text-center">You don't have permission to view the categories list</h2>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default CategoriesListTree;
