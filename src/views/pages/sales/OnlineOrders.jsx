import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useLocation } from "react-router-dom";
import "../../../../node_modules/flatpickr/dist/flatpickr.min.css";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  Col,
  Row,
  UncontrolledTooltip,
  Input,
  Button,
  CardBody,
  Card,
  Collapse,
  FormGroup,
  Label,
  CardHeader,
  CardTitle,
  Spinner,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import { getSaleChannelDDLAsync } from "../../../redux/ecommerce-channels/ecommerceActions";
import { getHubsDDLAsync } from "../../../redux/hubs/hubsActions";
import PageSpinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { history } from "../../../history";
import { truncate, appendURLParams } from "../../../utility/commonFunctions";
import { getOnlineOrders } from "../../../redux/orders/ordersActions";
import { can } from "../../../configs/casl/ability";
import ListDataTable from "../../../components/shared/listDataTable";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * Online Oreders Component
 * @param {object} ReactProps - ReactProps
 */
const OnlineOrders = () => {
  const { loaders, orders, salesChannels, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(() => true);
  const [data, setData] = useState(() => []);
  const [meta, setMeta] = useState(() => null);
  const [q, setQ] = useState(() => "");
  const [hub, setHub] = useState(() => "");
  const [fromDate, setFromDate] = useState(() => "");
  const [toDate, setToDate] = useState(() => "");
  const [dateRange, setDateRange] = useState(() => "");
  const [channel, setChannel] = useState(() => "");
  const [sku, setSku] = useState(() => "");
  const [status, setStatus] = useState(() => "");
  const [channelsList, setChannelsList] = useState(() => []);
  const query = new URLSearchParams(useLocation().search);
  useBreadCrumb({
    breadCrumbTitle: "Online Orders",
    breadCrumbItems: [
      {
        title: "Online Orders",
      },
    ],
  });

  // cell width
  const minWidth = "150px";
  const handleFilterHub = (e) => {
    setHub(e);
    dispatch(
      getOnlineOrders({
        page: 1,
        hub: e?.value,
        q,
        sku,
        sales_channel: channel?.value,
        from_date: fromDate,
        to_date: toDate,
        status: status?.value,
      }),
    );
  };
  const handleFilterStatus = (e) => {
    setStatus(e);
    dispatch(
      getOnlineOrders({
        page: 1,
        hub: hub?.value,
        q,
        sku,
        sales_channel: channel?.value,
        from_date: fromDate,
        to_date: toDate,
        status: e?.value,
      }),
    );
  };
  const handleFilterChannel = (e) => {
    setChannel(e);
    dispatch(
      getOnlineOrders({
        page: 1,
        hub: hub?.value,
        q,
        sku,
        sales_channel: e?.value,
        from_date: fromDate,
        to_date: toDate,
        status: status?.value,
      }),
    );
  };

  const handleFilterDateRange = (date) => {
    setDateRange(date);
    const offset = moment(date[0]).utcOffset();
    setFromDate(moment(date[0]).utc(offset).unix());
    if (date[1]) {
      setToDate(moment(date[1]).utc(offset).unix());
    }
    dispatch(
      getOnlineOrders({
        page: 1,
        hub: hub?.value,
        q,
        sku,
        sales_channel: channel?.value,
        from_date: moment(date[0]).utc(offset).unix(),
        to_date: date[1] ? moment(date[1]).utc(offset).unix() : "",
        status: status?.value,
      }),
    );
  };
  // Table Columns
  const columns = [
    {
      name: "ID",
      selector: "orderID.",
      minWidth,
      center: true,
      cell: (row) => <span id={`orderID-${row.id}`}>{row.id}</span>,
    },
    {
      name: "Number",
      selector: "orderNumber",
      minWidth,
      center: true,
      cell: (row) => <span id={`orderNumber-${row.id}`}>{row.readable_id}</span>,
    },
    {
      name: "Status",
      selector: "status",
      minWidth,
      center: true,
      cell: (row) => <span id={`status-${row.id}`}>{row.status?.description}</span>,
    },
    {
      name: "Created at",
      selector: "createdDateTime",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`createdDateTime-${row.id}`}>{moment.unix(row.created_at).format("LLL")}</span>
      ),
    },
    {
      name: "Sale Channel",
      selector: "saleChannel",
      minWidth: "180px",
      center: true,
      cell: (row) => (
        <span id={`saleChannel-${row.id}`}>
          {truncate(row.salesChannel?.name, 10)}
          <UncontrolledTooltip placement="top" target={`saleChannel-${row.id}`}>
            {row.salesChannel?.name}
          </UncontrolledTooltip>
        </span>
      ),
    },
    {
      name: "Hub",
      selector: "hub",
      minWidth: "200px",
      center: true,
      cell: (row) => (
        <span id={`hub-${row.id}`}>
          {row.hub ? truncate(row.hub?.name, 10) : "No hub"}
          <UncontrolledTooltip placement="top" target={`hub-${row.id}`}>
            {row.hub?.name}
          </UncontrolledTooltip>
        </span>
      ),
    },

    {
      name: "Updated at",
      selector: "updatedDateTime",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`updatedDateTime-${row.id}`}>{moment.unix(row.updated_at).format("LLL")}</span>
      ),
    },
    {
      name: "order Price",
      selector: "orderPrice",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`orderPrice-${row.id}`}>
          {row.invoice?.amount} {row.invoice?.currency}
        </span>
      ),
    },
    {
      name: "No of sku",
      selector: "noOfSku",
      minWidth,
      center: true,
      cell: (row) => <span id={`noOfSku-${row.id}`}>{row.items_count}</span>,
    },
    {
      name: "Email",
      selector: "customerEmail",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`customerEmail-${row.id}`}>
          {truncate(row.customer_details?.email, 12)}
          <UncontrolledTooltip placement="top" target={`customerEmail-${row.id}`}>
            {row.customer_details?.email}
          </UncontrolledTooltip>
        </span>
      ),
    },
    {
      name: "Phone No",
      selector: "customerPhone",
      minWidth,
      center: true,
      cell: (row) => (
        <span id={`customerPhone-${row.id}`}>
          {truncate(row.customer_details?.phone, 16)}
          <UncontrolledTooltip placement="top" target={`customerPhone-${row.id}`}>
            {row.customer_details?.phone}
          </UncontrolledTooltip>
        </span>
      ),
    },
  ];

  // getting the list of orders , hubs, channels from server
  useEffect(() => {
    dispatch(
      getOnlineOrders({
        page: +query.get("page") ? +query.get("page") : 1,
        q: q?.value,
        sku: sku?.value,
      }),
    );
    setQ("");
    setSku("");
  }, []);

  // setting list of channels
  useEffect(() => {
    if (salesChannels.data) {
      setChannelsList(
        salesChannels.data.map((v) => ({
          label: v.name,
          value: v.id,
        })),
      );
    }
  }, [salesChannels.data]);

  // bind data to the `data` constant to be displayed
  useEffect(() => {
    if (orders.onlineOrdersList) {
      const listData = [];
      orders.onlineOrdersList.data.forEach((ele) => {
        const data = {
          id: ele.id,
          readable_id: ele.readable_id,
          number: ele.number,
          hub: ele.hub,
          salesChannel: ele.salesChannel,
          customer_details: ele.customer_details,
          invoice: ele.invoice,
          status: ele.status,
          items_count: ele.items_count,
          updated_at: ele.updated_at,
          created_at: ele.created_at,
        };
        if (ele.name) {
          ele.name.trim();
        }

        listData.push(data);
      });
      setData(listData);
      setMeta(orders.onlineOrdersList.meta);
    }
  }, [orders.onlineOrdersList]);

  const handlePagination = (page) => {
    // getting data from server using params
    dispatch(
      getOnlineOrders({
        page: page.selected + 1,
        q,
        sku,
        phone: q,
        sales_channel: channel?.value,
        hub: hub.value,
        from_date: fromDate,
        to_date: toDate,
        status: status?.value,
      }),
    );

    // adding search on url
    history.push(`/sales/online-orders?page=${page.selected + 1}`);
  };

  const handleFilter = (q) => {
    dispatch(
      getOnlineOrders({
        page: 1,
        q,
        sku,
        sales_channel: channel?.value,
        hub: hub.value,
        from_date: fromDate,
        to_date: toDate,
        status: status?.value,
      }),
    );
  };

  const handleSearchSku = (sku) => {
    dispatch(
      getOnlineOrders({
        page: 1,
        sku,
        sales_channel: channel?.value,
        hub: hub.value,
        from_date: fromDate,
        to_date: toDate,
        status: status?.value,
      }),
    );
  };

  const renderList = () => {
    const canViewResolveBtn = Boolean(profile.is_super) || Boolean(profile.all_hubs);
    if (orders.onlineOrdersList && can("viewOnline", "orders")) {
      return (
        <Row>
          <Col sm="12">
            <div>
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
                        <Row style={{ "max-height": "100px" }}>
                          <Col lg="3" md="3" sm="12">
                            <Label for="hubs" className="mb-1">
                              <FormattedMessage id="Hubs" />
                            </Label>
                            <AsyncPaginate
                              isClearable
                              id="hubs"
                              value={hub}
                              loadOptions={getHubsDDLAsync}
                              onChange={handleFilterHub}
                              debounceTimeout={1000}
                              isLoading={loaders.getHubsDDLAsync}
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
                          </Col>
                          <Col lg="3" md="3" sm="12">
                            <FormGroup className="mb-0">
                              <Label className="mb-1" for="verified">
                                Status
                              </Label>
                              <Select
                                classNamePrefix="select"
                                id="status"
                                name="status"
                                isClearable
                                value={status}
                                onChange={handleFilterStatus}
                                options={[
                                  { label: "Pending", value: 1 },
                                  { label: "Preparing", value: 2 },
                                  { label: "Prepared", value: 3 },
                                  { label: "Preparing to ship", value: 4 },
                                  { label: "Shipment Ready", value: 5 },
                                  { label: "Shipped", value: 6 },
                                  { label: "Delivered", value: 7 },
                                  { label: "Canceled", value: 8 },
                                ]}
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="3" md="3" sm="12">
                            <FormGroup className="mb-0">
                              <Label className="mb-1" for="Channel">
                                Channel
                              </Label>

                              <AsyncPaginate
                                isClearable
                                id="channel"
                                name="Channel"
                                value={channel}
                                loadOptions={getSaleChannelDDLAsync}
                                onChange={handleFilterChannel}
                                debounceTimeout={1000}
                                isLoading={loaders.getSaleChannelDDLAsync}
                                additional={{
                                  page: 1,
                                }}
                                placeholder={
                                  loaders.getSaleChannelDDLAsync ? (
                                    <span>
                                      Loading... <Spinner style={{ height: 20, width: 20 }} />
                                    </span>
                                  ) : (
                                    "Search Sale channel"
                                  )
                                }
                              />
                            </FormGroup>
                          </Col>

                          <Col className="mb-3" lg="3" md="3" sm="12">
                            <h5 className="text-bold-500 mb-1">Date</h5>
                            <Flatpickr
                              style={{ marginTop: "18px" }}
                              id="dateRange"
                              name="dateRange"
                              placeholder="Select Date"
                              value={dateRange}
                              className="form-control"
                              options={{
                                maxDate: "today",
                                dateFormat: "d/m/Y",
                                mode: "range",
                              }}
                              onChange={handleFilterDateRange}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="4" md="6" sm="12">
                            <Button
                              className="add-new-btn"
                              color="primary"
                              onClick={() => {
                                setDateRange("");
                                setHub("");
                                setChannel("");
                                setToDate("");
                                setFromDate("");
                                setStatus("");

                                dispatch(getOnlineOrders({ page: 1, q, sku }));
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
              </Row>
              <div className="data-list-header d-flex justify-content-start flex-wrap">
                <div className="actions-left d-flex flex-wrap">
                  <div>
                    <Row>
                      <Col sm="7">
                        <Input
                          style={{ display: "inline", padding: 19 }}
                          type="text"
                          value={q}
                          placeholder=" Search ..."
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
                      <Col sm="5">
                        <Button
                          className="add-new-btn"
                          color="primary"
                          onClick={() => handleFilter(q)}
                        >
                          <span className="align-middle">Search</span>
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12" md="12" className="pt-1 mr-3">
                        <p>Search by order Num , ID or Customer Num</p>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="actions-left d-flex flex-wrap">
                  <div>
                    <Row>
                      <Col sm="7">
                        <Input
                          style={{ display: "inline", padding: 19 }}
                          type="text"
                          value={sku}
                          placeholder=" Search ..."
                          onChange={(e) => {
                            setSku(e.target.value);
                          }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              handleSearchSku(event.target.value);
                            }
                          }}
                        />
                      </Col>
                      <Col sm="5">
                        <Button
                          className="add-new-btn"
                          color="primary"
                          onClick={() => handleSearchSku(sku)}
                        >
                          <span className="align-middle">Search</span>
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12" md="12" className="pt-1">
                        <p> Search by SKU</p>
                      </Col>
                    </Row>
                  </div>
                </div>

                {canViewResolveBtn && (
                  <div className="ml-auto">
                    <Button
                      color="primary"
                      outline
                      onClick={() => history.push("/sales/online-orders/manual-resolve")}
                    >
                      <FormattedMessage id="Resolve Orders" />
                    </Button>
                  </div>
                )}
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
                history.push(`/sales/online-orders/${row.id}`);
              }}
            />
          </Col>
        </Row>
      );
    }
    if (!can("viewOnline", "orders")) {
      return (
        <Card className="mt-2">
          <CardBody>
            <h2 className="text-center">You don't have permission to view list</h2>
          </CardBody>
        </Card>
      );
    }
    return <PageSpinner />;
  };
  return <>{renderList()}</>;
};

export default OnlineOrders;
