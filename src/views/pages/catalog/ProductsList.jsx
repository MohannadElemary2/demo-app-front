import React, { useEffect, useState } from "react";
import { RefreshCw, ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  Col,
  Row,
  UncontrolledTooltip,
  Input,
  Button,
  Collapse,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import PageSpinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import { truncate, appendURLParams } from "../../../utility/commonFunctions";
import {
  getProducts,
  syncProducts,
  exportCatalogProducts,
  checkSyncProducts,
} from "../../../redux/catalog/products/productsActions";
import { getCategoriesDDLAsync } from "../../../redux/catalog/categories/categoriesActions";
import defaultProductImage from "../../../assets/img/pages/noimg.jpg";
import LazyButton from "../../../components/shared/lazyButton";
import { can } from "../../../configs/casl/ability";
import LazyAlert from "../../../components/shared/LazyAlert";
import SyncStatus from "../../../components/shared/syncStatus";
import { syncStatus } from "../../../utility/constants";
import ListDataTable from "../../../components/shared/listDataTable";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * CategoriesList Component
 * @param {object} ReactProps - ReactProps
 */

const ProductsList = () => {
  const [alertData, setAlertData] = useState(() => ({ show: false, data: null }));
  const { loaders, products } = useSelector((state) => state);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  useBreadCrumb({
    breadCrumbTitle: "Products",
    breadCrumbItems: [
      {
        title: "Products",
      },
    ],
  });

  // cell width
  const minWidth = "150px";

  // Table Columns
  const columns = [
    {
      name: "Image",
      selector: "Image",
      minWidth: "200px",
      center: true,
      cell: (row) => {
        if (row.image) {
          return <img src={row.image.path} height="69" width="140" alt={row.name} />;
        }
        return <img src={defaultProductImage} height="69" width="140" alt={row.name} />;
      },
      //
    },
    {
      name: "name",
      selector: "name",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`name-${row.id}`}>
          {truncate(row.name, 15)}
          <UncontrolledTooltip placement="top" target={`name-${row.id}`}>
            {row.name}
          </UncontrolledTooltip>
        </span>
      ),
    },
    {
      name: "SKU",
      selector: "SKU",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`sku-${row.id}`}>
          {truncate(row.sku, 15)}
          <UncontrolledTooltip placement="top" target={`sku-${row.id}`}>
            {row.sku}
          </UncontrolledTooltip>
        </span>
      ),
    },

    {
      name: "Type",
      selector: "Type",
      minWidth,
      center: true,
      cell: (row) => <span id={`type -${row.id}`}>{row.type}</span>,
    },
    {
      name: "barcode",
      selector: "barcode",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`barcode-${row.id}`}>{row.barcode ? row.barcode : "No barcode"}</span>
      ),
    },
    {
      name: "categories",
      selector: "categories",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`categories-${row.id}`}>
          {truncate(row.categories, 15)}
          <UncontrolledTooltip placement="top" target={`categories-${row.id}`}>
            {row.categories}
          </UncontrolledTooltip>
        </span>
      ),
    },
  ];

  // Table Data to be got from server
  const [data, setData] = useState(() => []);
  const [meta, setMeta] = useState(() => null);
  const [q, setQ] = useState(() => "");
  const [collapse, setCollapse] = useState(() => true);
  const [isActive, setIsActive] = useState(() => "");
  const [type, setType] = useState(() => "");
  const [category, setCategory] = useState(() => "");
  const handleFilterIsactive = (e) => {
    setIsActive(e);
    if (!e) {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          type: type?.value,
          is_active: "",
          category: category?.value,
          q,
        }),
      );
    } else {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          is_active: e.value,
          type: type?.value,
          category: category?.value,
          q,
        }),
      );
    }
  };

  const handleFilterType = (e) => {
    setType(e);
    if (!e) {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          is_active: isActive?.value,
          type: "",
          category: category?.value,
          q,
        }),
      );
    } else {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          type: e.value,
          is_active: isActive?.value,
          category: category?.value,
          q,
        }),
      );
    }
  };
  const handleFilterCategory = (e) => {
    setCategory(e);
    if (!e) {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          is_active: isActive?.value,
          category: "",
          type: type?.value,
          q,
        }),
      );
    } else {
      history.push(`products?page=1`);
      dispatch(
        getProducts({
          category: e.value,
          is_active: isActive?.value,
          type: type?.value,
          q,
        }),
      );
    }
  };

  // getting the list of categories from server
  useEffect(() => {
    if (can("view", "product")) {
      if (query.get("page")) {
        dispatch(getProducts({ page: +query.get("page") }));
      } else {
        dispatch(getProducts({ page: 1 }));
      }
    }
  }, []);

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    if (products.productsList) {
      const listData = [];
      products.productsList.data.forEach((ele) => {
        const data = {
          id: ele.id,
          barcode: ele.barcode,
          name: ele.name,
          sku: ele.sku,
          type: ele.type?.description,
          image: ele.image,
          categories: "",
        };
        if (ele.categories.length > 0) {
          ele.categories.forEach((category) => {
            // if not the last ele
            if (ele.categories.indexOf(category) !== ele.categories.length - 1) {
              data.categories += ` ${category.name} -`;
              // if last ele
            } else {
              data.categories += ` ${category.name}`;
            }
          });
          // if has no variatiion
        } else {
          data.categories = "";
        }
        listData.push(data);
      });
      setData(listData);
      setMeta(products.productsList.meta);
    }
  }, [products.productsList]);

  // const CustomHeader = (props) => (

  // );

  const handlePagination = (page) => {
    // getting data from server using params
    dispatch(
      getProducts({
        page: page.selected + 1,
        is_active: isActive?.value,
        type: type?.value,
        category: category?.value,
        q,
      }),
    );
    // adding search on url
    history.push(`products?page=${page.selected + 1}`);
  };

  const handleFilter = (q) => {
    dispatch(
      getProducts({
        page: 1,
        q,
        is_active: isActive?.value,
        type: type?.value,
        category: category?.value,
      }),
    );
  };

  const renderList = () => {
    if (can("view", "product") && products.productsList) {
      return (
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <CardTitle className="pb-1">Filters</CardTitle>
                <div className="actions">
                  <ChevronDown
                    className="collapse-icon mr-50"
                    onClick={() => setCollapse(!collapse)}
                    size={15}
                  />
                </div>
              </CardHeader>
              <Collapse isOpen={collapse}>
                <CardBody>
                  <Row>
                    <Col lg="4" md="6" sm="12">
                      <FormGroup className="mb-0">
                        <Label className="mb-1" for="status">
                          Status
                        </Label>
                        <Select
                          classNamePrefix="select"
                          value={isActive}
                          onChange={handleFilterIsactive}
                          options={[
                            { label: "enabled", value: 1 },
                            { label: "disabled", value: 0 },
                          ]}
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4" md="6" sm="12">
                      <Label for="locations" className="mb-1">
                        <FormattedMessage id="Categories" />*
                      </Label>
                      <AsyncPaginate
                        id="categories"
                        loadOptions={getCategoriesDDLAsync}
                        onChange={handleFilterCategory}
                        debounceTimeout={1000}
                        isLoading={loaders.getCategoriesDDLAsync}
                        additional={{
                          page: 1,
                        }}
                        isClearable
                        value={category}
                        placeholder={
                          loaders.getCategoriesDDLAsync ? (
                            <span>
                              Loading... <Spinner style={{ height: 20, width: 20 }} />
                            </span>
                          ) : (
                            "Search Categories"
                          )
                        }
                      />
                    </Col>
                    <Col lg="4" md="6" sm="12">
                      <FormGroup className="mb-0">
                        <Label className="mb-1" for="department">
                          Type
                        </Label>
                        <Select
                          classNamePrefix="select"
                          value={type}
                          onChange={handleFilterType}
                          options={[
                            { label: "Virtual", value: 3 },
                            { label: "Simple", value: 1 },
                            { label: "Configurable", value: 2 },
                          ]}
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4" md="6" sm="12">
                      <Button
                        className="add-new-btn mt-1"
                        color="primary"
                        onClick={() => {
                          setCategory("");
                          setIsActive("");
                          setType("");

                          dispatch(
                            getProducts({
                              type: type?.value,
                              is_active: "",
                              category: "",
                              q,
                            }),
                          );
                        }}
                      >
                        <span className="align-middle">Reset Filters</span>
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </Col>

          <Col sm="12">
            <div className="data-list-header d-flex justify-content-between flex-wrap">
              <div className="actions-left d-flex flex-wrap">
                <div>
                  <Row>
                    <Col sm="8">
                      <Input
                        style={{ display: "inline", padding: 19 }}
                        type="text"
                        value={q}
                        placeholder=" Search..."
                        onChange={(e) => {
                          setQ(e.target.value);
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
                        className="add-new-btn ml-1"
                        color="primary"
                        onClick={() => handleFilter(q)}
                      >
                        <span className="align-middle">Search</span>
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12" md="12" className="pt-2">
                      <p>Search by product name, SKU, or barcode</p>
                    </Col>
                  </Row>
                </div>
              </div>

              <div>
                <LazyButton
                  label="Export"
                  disabled={products.productsList.data.length < 1}
                  onClick={() => {
                    dispatch(
                      exportCatalogProducts({
                        is_active: isActive?.value,
                        type: type?.value,
                        category: category?.value,
                        q,
                      }),
                    );
                  }}
                  color="primary"
                  loader={loaders.exportCatalogProducts}
                />
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
                history.push(`/catalog/products/product-details/${row.id}`);
              }}
            />
          </Col>
        </Row>
      );
    }
    if (can("view", "product")) {
      return <PageSpinner />;
    }
    return (
      <Card className="mt-2">
        <CardBody>
          <h2 className="text-center">You don't have permission to view the products list</h2>
        </CardBody>
      </Card>
    );
  };

  const renderSyncBtn = () => {
    if (can("sync", "product"))
      return (
        <div className="text-right mb-2 ml-auto w-25">
          <RefreshCw
            id="refresh"
            className="pointer mr-2 text-primary"
            size={16}
            onClick={() => {
              dispatch(checkSyncProducts(can("view", "products"), "viewToaster", "From Refresh"));
            }}
          />
          <UncontrolledTooltip target="refresh">Refresh Sync Status</UncontrolledTooltip>
          <LazyButton
            outline
            loadingText="Syncing..."
            loader={products.syncStatus?.status.value === syncStatus.SYNC_IN_PROGRESS}
            disabled={loaders.checkSyncProducts}
            label="Sync Magento"
            onClick={() => {
              setAlertData((prevData) => ({
                ...prevData,
                show: true,
                data: "Magento",
              }));
            }}
          />
          <div>
            {products.syncStatus?.status.value !== syncStatus.NO_SYNC_YET &&
              products.syncStatus?.updated_at && (
                <small className="d-block mt-1">
                  Updated: {moment.unix(products.syncStatus.updated_at).fromNow()}
                </small>
              )}
          </div>
        </div>
      );
  };

  return (
    <>
      <LazyAlert
        confirmLabel="Yes"
        cancelLabel="No"
        show={alertData.show}
        loader={loaders.syncProducts}
        message={<span>Do you want to get the products from {alertData.data}?</span>}
        onConfirm={() => {
          dispatch(syncProducts({ integration: "magento" }, can("view", "products")));
          setTimeout(() => {
            setAlertData((prevData) => ({ ...prevData, show: false, data: null }));
          }, 500);
        }}
        onCancel={() => {
          setAlertData((prevData) => ({ ...prevData, show: false }));
        }}
      />
      {products.syncStatus && <SyncStatus status={products.syncStatus} moduleName="Products" />}

      {renderSyncBtn()}
      {renderList()}
    </>
  );
};

export default ProductsList;
