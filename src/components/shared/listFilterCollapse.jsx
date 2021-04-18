import React, { useState } from "react";
import { ChevronDown } from "react-feather";
import { Card, CardHeader, CardTitle, Collapse, CardBody } from "reactstrap";
import { FormattedMessage } from "react-intl";

const ListFilterCollapse = ({ children }) => {
  const [collapse, setCollapse] = useState(() => true);

  return (
    <div className="px-1">
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setCollapse(!collapse)}>
          <CardTitle className="pb-1">
            <FormattedMessage id="Filters" />
          </CardTitle>
          <div className="mb-1">
            <ChevronDown className={collapse ? "rotate-0" : "rotate-90"} size={15} />
          </div>
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>{children}</CardBody>
        </Collapse>
      </Card>
    </div>
  );
};

export default ListFilterCollapse;
