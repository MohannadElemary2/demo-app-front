import React from "react";
import { Button } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { history } from "../../history";

const CancelButton = ({ className, url }) => (
  <Button
    className={className}
    outline
    color="primary"
    type="button"
    onClick={() => {
      history.push(url);
    }}
  >
    <FormattedMessage id="cancel" />
  </Button>
);

export default React.memo(CancelButton);
