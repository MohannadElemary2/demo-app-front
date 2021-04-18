import React from "react";
import { Button, Spinner } from "reactstrap";

const LazyButton = ({
  color = "primary",
  type = "submit",
  loadingText = "Loading...",
  className,
  label,
  loader,
  disabled,
  icon,
  ...rest
}) => {
  if (loader) {
    return (
      <Button color={color} type={type} className={className} disabled>
        <Spinner color="white" size="sm" />
        <span className="ml-50">{loadingText}</span>
      </Button>
    );
  }
  return (
    <Button color={color} type={type} className={className} disabled={disabled} {...rest}>
      {icon && <span className="mr-1">{icon}</span>}
      <span>{label}</span>
    </Button>
  );
};

export default React.memo(LazyButton);
