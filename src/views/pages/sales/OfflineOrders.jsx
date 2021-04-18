import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import { Row, Col, Label, Button, InputGroup, Input, InputGroupAddon } from "reactstrap";
import Select from "react-select";
import { can } from "../../../configs/casl/ability";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
import NoPermissions from "../../../components/shared/noPermission";
import { getOfflineOrders } from "../../../redux/orders/ordersActions";
import { offlineOrderStatus } from "../../../utility/constants";
import ListDataTable from "../../../components/shared/listDataTable";
import { ListSkeleton } from "../../../components/shared/Skeletons";
import {
  deleteURLParam,
  appendURLParams,
  getURLParams,
  truncate,
} from "../../../utility/commonFunctions";
import ListFilterCollapse from "../../../components/shared/listFilterCollapse";
import { history } from "../../../history";
import { getHubs, getHubsDDLAsync } from "../../../redux/hubs/hubsActions";
import AppDatePicker from "../../../components/shared/AppDatePicker";
import AppAsyncPaginate from "../../../components/shared/AppAsyncPaginate";
/**
 * OfflineOrders Component
 */
const OfflineOrders = ({ match }) => {
  const { loaders, orders, permissions, hubs, profile } = useSelector((state) => state);
  const [params, setParams] = useState({
    page: getURLParams("page"),
    hub: getURLParams("hub"),
    type: getURLParams("type"),
    from_date: getURLParams("from_date"),
    to_date: getURLParams("to_date"),
    q: getURLParams("q"),
    getData: true,
  });
  const [listData, setListData] = useState([]);
  const [meta, setmeta] = useState(null);
  const dispatch = useDispatch();

  useBreadCrumb({
    breadCrumbTitle: "POS Orders",
    breadCrumbItems: [
      {
        title: "POS Orders",
      },
    ],
  });

  useEffect(() => {
    if (can("viewOffline", "orders") && params.getData) {
      delete params.getData;
      dispatch(getOfflineOrders(params));
    }
  }, [params]);

  useEffect(() => {
    if (orders.offlineOrders) {
      setListData(orders.offlineOrders.data);
      setmeta(orders.offlineOrders.meta);
    }
  }, [orders.offlineOrders]);

  if (!can("viewOffline", "orders")) {
    return <NoPermissions />;
  }
  return (
    <>
      <Filter
        setParams={setParams}
        match={match}
        loaders={loaders}
        params={params}
        hubs={hubs}
        profile={profile}
        dispatch={dispatch}
      />
      {loaders.getOfflineOrders && <ListSkeleton />}
      {meta && (
        <List
          permissions={permissions}
          setParams={setParams}
          data={listData}
          meta={meta}
          match={match}
        />
      )}
    </>
  );
};

export default OfflineOrders;

// OfflineOrders Components
const List = ({ data, meta, setParams, match }) => {
  const [columns, setColumns] = useState();

  const handlePagination = (page) => {
    const PAGE = page.selected + 1;
    setParams((prevParams) => ({ ...prevParams, page: PAGE, getData: true }));
    history.push(`${match.path}?${appendURLParams("page", PAGE)}`);
  };

  const getOfflineOrdersType = (type) => {
    switch (type) {
      case offlineOrderStatus.Sale:
        return (
          <span className="badge badge-success">
            <FormattedMessage id="Sale" />
          </span>
        );
      case offlineOrderStatus.Refund:
        return (
          <span className="badge badge-secondary text-dark">
            <FormattedMessage id="Refund" />
          </span>
        );
      default:
        return "-";
    }
  };

  useEffect(() => {
    const cols = [
      {
        name: "Transaction ID",
        width: "200px",
        center: true,
        cell: (row) => <span>{row.transaction_id || "-"}</span>,
      },
      {
        name: "Store ID",
        width: "200px",
        center: true,
        cell: (row) => <span>{row.pos_id || "-"}</span>,
      },
      {
        name: "Hub",
        width: "200px",
        center: true,
        cell: (row) => <span>{row.hub?.name || "-"}</span>,
      },
      {
        name: "Return Store ID",
        width: "200px",

        center: true,
        cell: (row) => <span>{row.return_pos_id || "-"}</span>,
      },
      {
        name: "Return Hub",
        width: "200px",

        center: true,
        cell: (row) => <span>{row.return_hub?.name || "-"}</span>,
      },
      {
        name: "SKU",
        center: true,
        width: "200px",
        cell: (row) => (
          <span id={`sku-${row.product.id}`}>
            {row.product?.sku ? truncate(row.product.sku, 20) : "-"}
            <UncontrolledTooltip placement="top" target={`sku-${row.product.id}`}>
              {row.product?.sku || "-"}
            </UncontrolledTooltip>
          </span>
        ),
      },
      {
        name: "Quantity",
        center: true,
        cell: (row) => <span>{Math.abs(+row.quantity) || "-"}</span>,
      },
      {
        name: "Type",
        center: true,
        cell: (row) => <span>{getOfflineOrdersType(Number(row.type))}</span>,
      },
      {
        name: "Date & Time",
        width: "200px",
        center: true,
        cell: (row) => <span>{moment.unix(row.transaction_date).format("LLL")}</span>,
      },
      {
        name: "Terminal Id",
        width: "200px",
        center: true,
        cell: (row) => <span>{row.terminal_id || "-"}</span>,
      },
      {
        name: "Net Amount",
        width: "200px",
        center: true,
        cell: (row) => <span>{row.net_amount || "-"}</span>,
      },
      {
        name: "Vat",
        center: true,
        cell: (row) => <span>{row.vat || "-"}</span>,
      },
      {
        name: "Tax Amount",
        center: true,
        cell: (row) => <span>{row.tax_amount || "-"}</span>,
      },
      {
        name: "Price",
        center: true,
        cell: (row) => <span>{row.price || "-"}</span>,
      },
    ];

    setColumns(cols);
  }, []);

  return (
    <ListDataTable columns={columns} data={data} meta={meta} handlePagination={handlePagination} />
  );
};

const Filter = ({ setParams, match, loaders, params, hubs, profile, dispatch }) => {
  const [paramHub, setParamHub] = useState(() => "");
  const [dateParams, setDateParams] = useState(() => null);
  const [searchValue, setSearchValue] = useState(() => params.q || "");
  useEffect(() => {
    if (getURLParams("to_date")) {
      setDateParams([
        new Date(+getURLParams("from_date") * 1000),
        new Date(+getURLParams("to_date") * 1000),
      ]);
    } else {
      setDateParams("");
    }
  }, [params.to_date]);

  useEffect(() => {
    if (profile.hasOneHub && profile.hubs?.length) {
      setParamHub({ label: profile.hubs[0].name, value: profile.hubs[0].id });
      setParams((prevParams) => ({
        ...prevParams,
        hub: profile.hubs[0].id,
        page: 1,
        getData: true,
      }));
      history.push(`${match.path}?${appendURLParams("hub", profile.hubs[0].id)}`);
    } else if (getURLParams("hub")) {
      dispatch(getHubs());
    }
  }, [profile]);

  useEffect(() => {
    if (hubs.hubsList?.data) {
      const HUB = hubs.hubsList.data.find((hub) => hub.id === +getURLParams("hub"));
      if (HUB) {
        setParamHub({ label: HUB.name, value: HUB.id });
      } else {
        setParamHub("");
      }
    }
  }, [hubs, params]);

  const handleSearch = () => {
    if (searchValue) {
      setParams((prevParams) => ({ ...prevParams, q: searchValue, page: 1, getData: true }));
      history.push(`${match.path}`);
    } else {
      setParams((prevParams) => {
        delete prevParams.q;
        return {
          ...prevParams,
          getData: true,
        };
      });
      history.push(`${match.path}?${deleteURLParam("q")}`);
    }
  };

  const typeOptions = [
    { value: offlineOrderStatus.Sale, label: <FormattedMessage id="Sale" /> },
    { value: offlineOrderStatus.Refund, label: <FormattedMessage id="Refund" /> },
  ];
  return (
    <>
      <ListFilterCollapse>
        <Row>
          <Col lg={4} className="mb-2">
            <Label for="hub" className="mb-1">
              <FormattedMessage id="Hub" />
            </Label>
            <AppAsyncPaginate
              id="hub"
              isClearable
              value={paramHub}
              isDisabled={loaders.getOfflineOrders}
              loadOptions={getHubsDDLAsync}
              onChange={(e) => {
                if (e) {
                  setParamHub(e);
                  setParams((prevParams) => ({
                    ...prevParams,
                    hub: e.value,
                    page: 1,
                    getData: true,
                  }));
                  history.push(`${match.path}?${appendURLParams("hub", e.value)}`);
                } else {
                  setParamHub("");
                  setParams((prevParams) => {
                    delete prevParams.hub;
                    return {
                      ...prevParams,
                      page: 1,
                      getData: true,
                    };
                  });
                  history.push(`${match.path}?${deleteURLParam("hub")}`);
                }
              }}
              isLoading={loaders.getHubsDDLAsync}
              placeholder="Search Hubs"
            />
          </Col>
          <Col lg={4} className="mb-2">
            <Label for="type" className="mb-1">
              <FormattedMessage id="Type" />
            </Label>
            <Select
              isDisabled={loaders.getOfflineOrders}
              isClearable
              id="type"
              onChange={(e) => {
                if (e) {
                  setParams((prevParams) => ({
                    ...prevParams,
                    type: e.value,
                    page: 1,
                    getData: true,
                  }));
                  history.push(`${match.path}?${appendURLParams("type", e.value)}`);
                } else {
                  setParams((prevParams) => {
                    delete prevParams.type;
                    return {
                      ...prevParams,
                      page: 1,
                      getData: true,
                    };
                  });
                  history.push(`${match.path}?${deleteURLParam("type")}`);
                }
              }}
              options={typeOptions}
              value={typeOptions.find((o) => o.value === +getURLParams("type")) || ""}
            />
          </Col>
          <Col lg={4} className="mb-2">
            <Label for="date" className="mb-1">
              <FormattedMessage id="Date" />
            </Label>
            <AppDatePicker
              id="date"
              isClearable
              disabled={loaders.getOfflineOrders}
              placeholder="Select Date"
              value={dateParams}
              onChange={(date) => {
                if (date.length > 1) {
                  const fromOffset = moment(date[0]).utcOffset();
                  const toOffset = moment(date[1]).utcOffset();
                  const DATE = {
                    from_date: moment(date[0]).utc(fromOffset).unix(),
                    to_date: moment(date[1]).utc(toOffset).unix(),
                  };
                  history.push(`${match.path}?${appendURLParams("from_date", DATE.from_date)}`);
                  history.push(`${match.path}?${appendURLParams("to_date", DATE.to_date)}`);

                  setParams((prevParams) => ({
                    ...prevParams,
                    page: 1,
                    getData: true,
                    ...DATE,
                  }));
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              onClick={() => {
                // if (getURLParams("q")) history.push(`${match.path}?q=${getURLParams("q")}`);
                history.push(`${match.path}`);
                setParamHub("");
                setParams((prevParams) => ({
                  ...prevParams,
                  page: 1,
                  q: searchValue,
                  hub: getURLParams("hub"),
                  type: getURLParams("type"),
                  from_date: getURLParams("from_date"),
                  to_date: getURLParams("to_date"),
                  getData: true,
                }));
              }}
            >
              <FormattedMessage id="Reset Filters" />
            </Button>
          </Col>
        </Row>
      </ListFilterCollapse>
      <Row className="px-1">
        <Col lg={4} className="mb-2">
          <InputGroup>
            <Input
              style={{ height: 38 }}
              placeholder="Search by Trans ID or SKU"
              disabled={loaders.getOfflineOrders}
              id="search"
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (!e.target.value) {
                  setParams((prevParams) => ({
                    ...prevParams,
                    q: "",
                    getData: false,
                  }));
                  history.push(`${match.path}?${deleteURLParam("q")}`);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <InputGroupAddon addonType="append" style={{ height: 38, zIndex: 0 }}>
              <Button color="primary" disabled={loaders.getOfflineOrders} onClick={handleSearch}>
                <FormattedMessage id="Search" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
    </>
  );
};
