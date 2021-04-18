import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "reactstrap";
import { FormattedMessage } from "react-intl";
import Skeleton from "react-loading-skeleton";
import CardBody from "reactstrap/lib/CardBody";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import { getUnresolvedOrders } from "../../../redux/orders/ordersActions";
import { LabelSkeleton } from "../../../components/shared/Skeletons";
import { randomNumber } from "../../../utility/commonFunctions";
import NoPermissions from "../../../components/shared/noPermission";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * ManualResolve Component
 */
const ManualResolve = () => {
  const { loaders, orders } = useSelector((state) => state);
  const dispatch = useDispatch();

  useBreadCrumb({
    breadCrumbTitle: "Resolve Orders",
    breadCrumbItems: [
      {
        title: "Online Orders",
        url: "/sales/online-orders",
      },
      {
        title: "Resolve Orders",
      },
    ],
  });

  useEffect(() => {
    dispatch(getUnresolvedOrders());
  }, []);

  const TableData = () => {
    if (orders.unresolvedOrders?.length) {
      return (
        <Table className="text-center" responsive striped bordered>
          <thead>
            <tr>
              <th className="font-medium-4 ">
                <FormattedMessage id="SKU" />
              </th>
              <th className="font-medium-4 ">
                <FormattedMessage id="Hub" />
              </th>
              <th className="font-medium-4 ">
                <FormattedMessage id="Quantity" />
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.unresolvedOrders.map((ele) => (
              <tr key={JSON.stringify(ele.id)}>
                <td>{ele.product}</td>
                <td>{ele.hub}</td>
                <td>{ele.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    return <NoPermissions message="No data to Display" />;
  };
  const PageSkeleton = () => (
    <>
      <div className="d-flex justify-content-between">
        {[...Array(4)].map((ele, i) => (
          <LabelSkeleton key={JSON.stringify(i)} height={25} />
        ))}
      </div>
      {[...Array(randomNumber(5, 15))].map((ele, i) => (
        <Skeleton key={JSON.stringify(i)} height={35} className="mb-3" />
      ))}
    </>
  );

  const Page = () => {
    if (!loaders.getUnresolvedOrders && orders.unresolvedOrders) return <TableData />;
    if (loaders.getUnresolvedOrders && !orders.unresolvedOrders) return <PageSkeleton />;
    return null;
  };
  return (
    <Card>
      <CardHeader>
        <h4 className="mb-3 text-primary">
          <FormattedMessage id="You need to add the following quantities to your hubs in order to route the pending orders" />
        </h4>
      </CardHeader>
      <CardBody>
        <Page />
      </CardBody>
    </Card>
  );
};
export default ManualResolve;
