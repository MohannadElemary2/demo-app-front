import React from "react";
import { Button } from "reactstrap";
import { Plus } from "react-feather";
import { NavLink } from "react-router-dom";

const AddButton = ({ url }) => (
  <NavLink to={url}>
    <Button className="add-new-btn" color="primary" outline>
      <Plus size={15} />
      <span className="align-middle">Add New</span>
    </Button>
  </NavLink>
);

export default React.memo(AddButton);
