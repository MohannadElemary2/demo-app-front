import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormFeedback,
  UncontrolledAlert,
} from "reactstrap";
import Select from "react-select";
import timeZones from "../../../utility/timeZones";
import "../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import LazyButton from "../../../components/shared/lazyButton";
import { changeTimezone } from "../../../redux/profile/profileActions";
import { getLocalItem } from "../../../utility/commonFunctions";
import { removeServerError } from "../../../redux/serverErrors/serverErrorsActions";
import CancelButton from "../../../components/shared/cancelButton";
import { useBreadCrumb } from "../../../hooks/useBreadCrumb";

/**
 * Edit TimeZone Component
 * @param {object} ReactProps - ReactProps
 */
const EditTimezone = ({ loaders, changeTimezone, serverErrors, removeServerError, profile }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(() => null);

  useBreadCrumb({
    breadCrumbTitle: "Edit Timezone",
    breadCrumbItems: [
      {
        title: "Edit Timezone",
      },
    ],
  });

  const handleChange = (tz) => {
    if (serverErrors.time_zone) {
      removeServerError("time_zone");
    }
    setSelectedTimezone(tz);
  };

  // getting cashed timezone
  useEffect(() => {
    const timezoneValue = profile.time_zone;
    const tz = timeZones.find((ele) => ele.value === timezoneValue);
    setSelectedTimezone(tz);
    return () => {
      removeServerError("time_zone");
    };
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Timezone</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <label htmlFor="timezone" className="my-1">
                Select Timezone
              </label>
              <Select
                classNamePrefix="select"
                value={selectedTimezone}
                onChange={handleChange}
                options={timeZones}
                isClearable
              />
              {/* Backend validation */}
              {serverErrors.time_zone && (
                <FormFeedback className="d-block">
                  <UncontrolledAlert color="danger">{serverErrors.time_zone}</UncontrolledAlert>
                </FormFeedback>
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <LazyButton
                label="Save"
                type="button"
                loader={loaders.saveBtn}
                onClick={() => {
                  changeTimezone({
                    time_zone: selectedTimezone ? selectedTimezone.value : null,
                  });
                }}
              />
              <CancelButton className="ml-2" url="/" />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

const mapDispatchToProps = {
  changeTimezone,
  removeServerError,
};

const mapStateToProps = (state) => ({
  loaders: state.loaders,
  serverErrors: state.serverErrors,
  profile: state.profile,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTimezone);
