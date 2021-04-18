import React from "react";
import { Card, CardBody } from "reactstrap";

const NoPermissions = ({ message = "You don't have permissions to view this page" }) => (
  <Card className="mt-2">
    <CardBody>
      <h2 className="text-center my-2">{message}</h2>
    </CardBody>
  </Card>
);

export default React.memo(NoPermissions);
