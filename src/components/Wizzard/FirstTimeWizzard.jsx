import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormFeedback,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Select from "react-select";
import { Clock, Globe } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Wizard from "../@vuexy/wizard/WizardComponent";
import timeZones from "../../utility/timeZones";
import { history } from "../../history";
import Langs from "../../utility/languages";
import { can } from "../../configs/casl/ability";
import { updateSettings, getSettings, setupWizard } from "../../redux/settings/settingsActions";
import { removeServerError } from "../../redux/serverErrors/serverErrorsActions";
import { changeTimezone } from "../../redux/profile/profileActions";
import "../../assets/scss/plugins/forms/react-select/_react-select.scss";

const FirstTimeWizzard = () => {
  const { serverErrors, settings, profile, permissions } = useSelector((state) => state);
  const dispatch = useDispatch();
  const childRef = useRef();
  const [selectedTimezone, setSelectedTimezone] = useState(() => null);
  const [stepNumber, setStepNumber] = useState(() => 1);

  const [defaultLocal, setDefaulLocale] = useState(() => null);
  const [selectedLocal, setSelectedLocale] = useState(() => null);
  const [steps, setSteps] = useState(() => []);

  const handleTimeZoneChange = (val) => {
    if (serverErrors.time_zone) {
      dispatch(removeServerError("time_zone"));
    }
    setSelectedTimezone(val);
  };
  const handleLocaleChange = (val) => {
    setSelectedLocale(val);
    setDefaulLocale(val);
  };

  // getting cashed timezone
  useEffect(() => {
    const timezoneValue = profile.time_zone;
    const tz = timeZones.find((ele) => ele.value === timezoneValue);
    setSelectedTimezone(tz);
    return () => {
      removeServerError("time_zone");
    };
  }, [profile]);

  useEffect(() => {
    if (can("viewPage", "settings")) {
      dispatch(getSettings());
    }
  }, []);

  useEffect(() => {
    if (settings) {
      // all settings values
      const settingValues = Object.values(settings);
      //  locale value
      const localeValue = settingValues.find((ele) => ele.key === "locale");
      if (localeValue) {
        const locale = Langs.find((ele) => ele.value === localeValue.value);
        setSelectedLocale(locale);
        setDefaulLocale(locale);
      }
    }
  }, [settings]);

  useEffect(() => {
    const stps = [
      {
        title: <Clock size={20} />,
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Change Timezone</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>
                  <Select
                    classNamePrefix="select"
                    value={selectedTimezone}
                    onChange={handleTimeZoneChange}
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
            </CardBody>
          </Card>
        ),
      },
    ];

    if (can("editLocale", "settings")) {
      stps.push({
        title: <Globe size={20} />,
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Select Default Language</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={12}>
                  <Select
                    classNamePrefix="select"
                    defaultValue={defaultLocal || { label: "English", value: "en" }}
                    value={defaultLocal}
                    options={Langs}
                    onChange={handleLocaleChange}
                    isClearable
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        ),
      });
    }
    setSteps(stps);
  }, [selectedTimezone, selectedLocal, defaultLocal, permissions.is_super]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Omniful wizard</CardTitle>
        </CardHeader>
        <CardBody>
          <Wizard
            enableAllSteps
            ref={childRef}
            saveLocale={() => {
              dispatch(
                updateSettings({
                  settings: [
                    {
                      key: "locale",
                      value: selectedLocal ? selectedLocal.value : "en",
                    },
                  ],
                }),
              );
            }}
            stepNumber={stepNumber}
            saveTimezone={() => {
              setStepNumber(2);
              dispatch(
                changeTimezone({
                  time_zone: selectedTimezone ? selectedTimezone.value : null,
                }),
              );
            }}
            onFinish={() => {
              history.push("/settings/ecommerce-channels");
              dispatch(
                setupWizard({
                  is_setup_wizard_finished: 1,
                }),
              );
            }}
            changeStepNumber={() => setStepNumber(2)}
            closeWizard={() => {
              dispatch(
                setupWizard({
                  is_setup_wizard_finished: 1,
                }),
              );
            }}
            steps={steps}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default FirstTimeWizzard;
