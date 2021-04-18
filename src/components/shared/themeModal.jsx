import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

/**
 *
 * ThemeModal Component
 */
const ThemeModal = ({ isOpen, toggle, header, body, btnLabel = "Close" }) => (
  <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
    <ModalHeader toggle={toggle}>{header}</ModalHeader>
    <ModalBody className="modal-dialog-centered">{body}</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={toggle}>
        {btnLabel}
      </Button>
    </ModalFooter>
  </Modal>
);

export default ThemeModal;
