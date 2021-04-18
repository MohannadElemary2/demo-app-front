import React, { useEffect, useState } from "react";
import { Alert, UncontrolledTooltip, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, RefreshCw } from "react-feather";
import FirstTimeWizzard from "../../components/Wizzard/FirstTimeWizzard";
import { syncPermissions } from "../../redux/permissions/permissionsActions";
import SpinnerComponent from "../../components/@vuexy/spinner/Fallback-spinner";

/**
 * Home Component
 */
const Home = () => {
  const { permissions, profile } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showWizzard, setShowWizzard] = useState(() => false);
  document.title = "Home";
  useEffect(() => {
    if (profile.id) {
      setShowWizzard(!profile.is_setup_wizard_finished);
    }
  }, []);

  return profile.id ? (
    <>
      {!permissions.roles?.length && !permissions.is_super && (
        <Alert color="info">
          <span>You don't have any permissions, Please contact your account manager.</span>
          <RefreshCw
            id="refresh"
            className="pointer ml-2"
            size={15}
            onClick={() => {
              dispatch(syncPermissions());
            }}
          />
          <UncontrolledTooltip target="refresh">Refresh</UncontrolledTooltip>
        </Alert>
      )}
      <div className="data-list-header d-flex justify-content-between flex-wrap mb-5">
        <h1>You are Home</h1>
        <Button
          color="primary"
          outline
          onClick={() => {
            setShowWizzard(!showWizzard);
          }}
        >
          {showWizzard && <EyeOff size={17} />}
          {!showWizzard && <Eye size={17} />} Wizard
        </Button>
      </div>
      {showWizzard && <FirstTimeWizzard />}
    </>
  ) : (
    <SpinnerComponent />
  );
};

export default Home;
