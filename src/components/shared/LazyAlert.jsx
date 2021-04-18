import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button } from "reactstrap";
import LazyButton from "./lazyButton";

const func = () => {};

const LazyAlert = ({
  btnColor = "primary",
  confirmBtnColor = "primary",
  iconType = "warning",
  confirmLabel = "Yes",
  cancelLabel = "No",
  cancelBtnColor = "danger",
  children,
  show,
  loader,
  message,
  onConfirm,
  onCancel,
}) => (
  <SweetAlert
    custom
    input
    title={<small>{message}</small>}
    type={iconType}
    show={show}
    openAnim
    closeAnim
    onConfirm={onConfirm || func}
    customButtons={
      <>
        <LazyButton
          label={confirmLabel}
          className="mr-2 px-3"
          onClick={onConfirm}
          color={confirmBtnColor || btnColor}
          loader={loader}
        />
        <Button
          className="px-3"
          outline
          color={cancelBtnColor || btnColor}
          type="button"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      </>
    }
  >
    {children}
  </SweetAlert>
);

export default LazyAlert;
