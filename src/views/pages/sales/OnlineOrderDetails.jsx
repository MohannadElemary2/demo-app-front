/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import { Card, CardBody, Row, Col, CardHeader, Table } from "reactstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { formateNumberWithCommas } from "../../../utility/commonFunctions";
import Spinner from "../../../components/@vuexy/spinner/Loading-spinner";
import { can } from "../../../configs/casl/ability";
import PrintLabel from "../dispatchOrders/PrintLabel";
import {
  getOnlineOrderDetails,
  clearOnlineOrderDetails,
} from "../../../redux/orders/ordersActions";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";
const OnlineOrderDetails = ({ match }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state);

  useBreadCrumb({
    breadCrumbTitle: "Online Order Details",
    breadCrumbItems: [
      {
        title: "Online Orders",
        url: "/sales/online-orders",
      },
      {
        title: "Online Order Details",
      },
    ],
  });

  // getting order  info on mount
  useEffect(() => {
    dispatch(getOnlineOrderDetails(match.params.id));
    return () => {
      dispatch(clearOnlineOrderDetails());
    };
  }, []);

  const renderOrderDetails = () => {
    if (orders.onlineOrderDetails && can("viewOnline", "orders")) {
      return (
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <div className="mt-1 d-flex justify-content-between">
                      <div>
                        <h4>Order ID :</h4>
                        <p>{orders.onlineOrderDetails.data.id}</p>
                      </div>
                      <div>
                        {orders.onlineOrderDetails.data.status.key === "SHIPPED" ||
                        orders.onlineOrderDetails.data.status.key === "SHIPMENT_READY" ? (
                          <PrintLabel
                            orderId={orders.onlineOrderDetails.data.id}
                            showContinueDispatchingBtn={false}
                            orderStatus={orders.onlineOrderDetails.data.status.key}
                          ></PrintLabel>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <hr />

                    <div className="mt-1">
                      <h4>Order Created Date/Time:</h4>
                      <p>{moment.unix(orders.onlineOrderDetails.data.created_at).format("LLL")}</p>
                    </div>
                    <hr />
                    <div className="mt-1">
                      <h4>Order Status:</h4>
                      <p>{orders.onlineOrderDetails.data.status.description}</p>
                    </div>
                    <hr />
                    <div className="mt-1">
                      <h4>Sales Channel:</h4>
                      <p>{orders.onlineOrderDetails.data.salesChannel.name}</p>
                    </div>
                    <hr />
                    <div className="mt-1">
                      <h4>Hub:</h4>
                      <p>
                        {orders.onlineOrderDetails.data.hub
                          ? orders.onlineOrderDetails.data.hub.name
                          : "No hub"}
                      </p>
                    </div>
                    <hr />
                    <div className="mt-1">
                      <h4>Order Updated Date/Time:</h4>
                      <p>{moment.unix(orders.onlineOrderDetails.data.updated_at).format("LLL")}</p>
                    </div>
                    <hr />
                    <div className="mt-1">
                      <h4>Order Price:</h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.total_actual,
                        )}
                        <span> {orders.onlineOrderDetails.data.invoice.currency}</span>
                      </p>
                    </div>

                    <hr />
                    <div className="mt-1">
                      <h4>Order details:</h4>
                      <p>Total Order items : {orders.onlineOrderDetails.data.items.length}</p>
                      <Row>
                        <Col sm="12">
                          <Table className="table-hover-animation" responsive>
                            <thead>
                              <tr>
                                <td>Item Photo</td>
                                <td>Name</td>
                                <td>SKU</td>
                                <td>Barcode</td>
                                <td>Attribute</td>
                                <td>Quantity</td>
                                <td>Price</td>
                                <td>Sub Total</td>
                                <td style={{ minWidth: 90 }}>Tax % </td>
                                <td>
                                  <FormattedMessage id="Tax Amount" />
                                </td>
                                <td>Discount Amount</td>
                                <td>Total Price</td>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.onlineOrderDetails.data.items.map((row) => (
                                <tr key={row.id}>
                                  <td>
                                    <img
                                      src={row.image.path}
                                      height="100"
                                      width="100"
                                      alt="item image"
                                    />
                                  </td>
                                  <td>{row.name}</td>
                                  <td>{row.sku}</td>
                                  <td>{row.barcode ? row.barcode : "no barcode"}</td>
                                  <td style={{ minWidth: 150 }}>
                                    {row.attributes.find((ele) => ele.attribute === "Color") ? (
                                      <p>
                                        {
                                          row.attributes.find((ele) => ele.attribute === "Color")
                                            .attribute
                                        }
                                        :
                                        {
                                          row.attributes.find((ele) => ele.attribute === "Color")
                                            .variation
                                        }
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                    {row.attributes.find((ele) => ele.attribute === "Size") ? (
                                      <p>
                                        {
                                          row.attributes.find((ele) => ele.attribute === "Size")
                                            .attribute
                                        }
                                        :
                                        {
                                          row.attributes.find((ele) => ele.attribute === "Size")
                                            .variation
                                        }
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td>{row.quantity_actual}</td>
                                  <td>
                                    {formateNumberWithCommas(row.unit_price)}
                                    {"  "}
                                    {orders.onlineOrderDetails.data.invoice.currency}
                                  </td>
                                  <td>
                                    {formateNumberWithCommas(row.subtotal_actual)}
                                    {"  "}
                                    {orders.onlineOrderDetails.data.invoice.currency}
                                  </td>
                                  <td>{row.tax_percent_actual}</td>
                                  <td>{formateNumberWithCommas(row.tax_actual)} </td>
                                  <td>
                                    {formateNumberWithCommas(row.discount_actual)}
                                    {orders.onlineOrderDetails.data.invoice.currency}
                                  </td>
                                  <td>
                                    {formateNumberWithCommas(row.total_actual)}
                                    {"  "}
                                    {orders.onlineOrderDetails.data.invoice.currency}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {/* Customer Information  section */}
            <Card>
              <CardHeader>
                <h3>Customer Information</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Name:</h4>
                      <p>{orders.onlineOrderDetails.data.customer_details.name}</p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Email:</h4>
                      <p>{orders.onlineOrderDetails.data.customer_details.email}</p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Phone:</h4>
                      <p>{orders.onlineOrderDetails.data.customer_details.phone}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Customer Information  section */}
            <Card>
              <CardHeader>
                <h3>Shipping Information</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Shipping Method: </h4>
                      <p>{orders.onlineOrderDetails.data.shipping_details.method}</p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Order Delivery address:</h4>
                      <p>
                        {orders.onlineOrderDetails.data.shipping_details.streets.join(",")}
                        {orders.onlineOrderDetails.data.shipping_details.region}
                      </p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>
                        <FormattedMessage id="Payment method" />:
                      </h4>
                      <p>
                        {orders.onlineOrderDetails.data.invoice.payment_method
                          ? orders.onlineOrderDetails.data.invoice.payment_method
                          : "No method available"}
                      </p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Country:</h4>
                      <p>{orders.onlineOrderDetails.data.shipping_details.country}</p>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mt-1">
                      <h4>City:</h4>
                      <p>{orders.onlineOrderDetails.data.shipping_details.city}</p>
                    </div>
                  </Col>

                  <Col sm="6">
                    <div className="mt-1">
                      <h4>Phone:</h4>
                      <p>{orders.onlineOrderDetails.data.shipping_details.phone}</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* order total section */}

            <Card>
              <CardHeader>
                <h3>
                  <FormattedMessage id="Order Totals" />
                </h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="SubTotal" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.subtotal_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Discount" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.discount_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Tax" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(orders.onlineOrderDetails.data.invoice.tax_actual)}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Shipping Cost" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.shipping_price_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                    <hr />
                  </Col>
                  <hr />
                </Row>

                <Row>
                  <Col sm="6" className="bg-primary white">
                    <div className="mt-1 d-flex justify-content-between flex-wrap ">
                      <h4 className="white">
                        <FormattedMessage id="Grand total" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.total_actual,
                        )}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Total paid" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.total_paid_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Total Refund" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.total_refunded_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <div className="mt-1 d-flex justify-content-between flex-wrap">
                      <h4>
                        <FormattedMessage id="Total due" />
                      </h4>
                      <p>
                        {formateNumberWithCommas(
                          orders.onlineOrderDetails.data.invoice.total_due_actual,
                        )}{" "}
                        {orders.onlineOrderDetails.data.invoice.currency}
                      </p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    }
    if (!can("viewOnline", "orders")) {
      return (
        <Card className="mt-2">
          <CardBody>
            <h2 className="text-center">You don't have permission to view order details</h2>
          </CardBody>
        </Card>
      );
    }
    if (orders.onlineOrderDetails === false && can("viewOnline", "orders")) {
      return (
        <Card className="mt-2">
          <CardBody>
            <h2 className="text-center"> There is no order with this number</h2>
          </CardBody>
        </Card>
      );
    }
    return <Spinner />;
  };
  return <>{renderOrderDetails()}</>;
};

export default OnlineOrderDetails;
