import React from "react";
import { CornerDownRight, Edit, Trash } from "react-feather";

const ListActionsComponent = ({
  canEdit = { show: false, onClick: () => {} },
  canDelete = { show: false, onClick: () => {} },
  canMove = { show: false, onClick: () => {} },
}) => (
  <div className="data-list-action">
    {canEdit.show && (
      <span title="Edit">
        <Edit className="cursor-pointer mr-1" size={20} onClick={canEdit.onClick} />
      </span>
    )}
    {canDelete.show && (
      <span title="delete">
        <Trash className="cursor-pointer mr-1" size={20} onClick={canDelete.onClick} />
      </span>
    )}
    {canMove.show && (
      <span title="Move" onClick={canMove.onClick}>
        <CornerDownRight className="cursor-pointer" size={20} />
      </span>
    )}
  </div>
);

export default React.memo(ListActionsComponent);
