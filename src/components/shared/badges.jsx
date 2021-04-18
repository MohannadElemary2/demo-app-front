import React from "react";
import { Badge, UncontrolledTooltip, Spinner } from "reactstrap";
import { AlertCircle, Check, X } from "react-feather";

const AppBadge = ({ type = "success", id, message, ...rest }) => (
  <>
    <Badge id={`badge-${id}`} color={type} {...rest}>
      {type === "success" && <Check size={14} className="m-0" />}
      {type === "danger" && <X size={14} className="m-0" />}
      {type === "warning" && <AlertCircle size={14} className="m-0" />}
      {type === "info" && <Spinner size="sm" className="m-0" />}
    </Badge>
    {message && <UncontrolledTooltip target={`badge-${id}`}>{message}</UncontrolledTooltip>}
  </>
);

export default React.memo(AppBadge);
