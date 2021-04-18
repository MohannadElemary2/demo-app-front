import React from "react";
import ReactTypingEffect from "react-typing-effect";
import { UncontrolledAlert } from "reactstrap";
import { syncStatus } from "../../utility/constants";

const SyncStatus = ({ status, moduleName }) => {
  switch (status.status.value) {
    case syncStatus.NO_SYNC_YET:
      return (
        <UncontrolledAlert color="primary" className="px-3 text-center">
          Please Sync your account data.
        </UncontrolledAlert>
      );
    case syncStatus.SYNCED_SUCCESSFULLY:
      return (
        <UncontrolledAlert color="success" className="px-3 text-center">
          {moduleName} information has been updated successfully.
        </UncontrolledAlert>
      );
    case syncStatus.SYNC_FAILED:
      return (
        <UncontrolledAlert color="danger" className="px-3 text-center">
          Failed to get the {moduleName} information.
        </UncontrolledAlert>
      );
    case syncStatus.SYNC_IN_PROGRESS:
      return (
        <UncontrolledAlert color="info" className="px-3 text-center">
          <ReactTypingEffect
            speed={100}
            typingDelay={0}
            eraseDelay={2000}
            eraseSpeed={20}
            text={[
              "Syncing...",
              "This might take a while...",
              `Please wait while we get your ${moduleName}...`,
            ]}
          />
        </UncontrolledAlert>
      );
    default:
      return null;
  }
};

export default SyncStatus;
