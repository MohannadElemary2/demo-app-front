import React, { useCallback } from "react";
import { RefreshCw } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import { FormFeedback, UncontrolledAlert } from "reactstrap";
import { removeServerError } from "../../redux/serverErrors/serverErrorsActions";
import { debounce } from "../../utility/commonFunctions";

/**
 * AppFormikSearchSelect Component
 */
const AppFormikSearchSelect = ({
  formik,
  options,
  name,
  isLoading,
  serverErrKey,
  searchFunction,
  searchKey,
  onChange,
  isDisabled,
  placeholder,
  isMulti,
  label,
  isClass,
  isClearable,
  searchParams,
}) => {
  const { serverErrors } = useSelector((state) => state);
  const handleSelectChange = (e, input, serverErrKey) => {
    if (serverErrors[serverErrKey]) {
      dispatch(removeServerError(serverErrKey));
    }
    formik.setFieldValue(input.name, e ?? "");
  };

  const search = useCallback(
    debounce((...query) => dispatch(searchFunction(...query)), 1000),
    [],
  );
  const searchClass = useCallback(
    debounce((...query) => searchFunction(...query), 1000),
    [],
  );

  const dispatch = useDispatch();

  return (
    <FormGroup>
      {label && (
        <Label for={name} className="mb-1">
          <span>{label}</span>
        </Label>
      )}
      <Select
        classNamePrefix="select"
        placeholder={placeholder}
        isClearable={isClearable}
        isMulti={isMulti}
        isDisabled={isDisabled}
        id={name}
        name={name}
        isLoading={isLoading}
        onChange={(e, input) => {
          if (onChange) onChange(e);
          handleSelectChange(e, input, serverErrKey);
        }}
        onInputChange={(text) => {
          if (text && !isClass) search({ [searchKey]: text, ...searchParams });
          if (text && isClass) searchClass({ [searchKey]: text, ...searchParams });
        }}
        value={formik.values[name]}
        options={options}
      />
      {/* Front end validation */}
      <FormFeedback className="d-block">{formik.touched[name] && formik.errors[name]}</FormFeedback>

      {/* Backend validation */}
      {serverErrors[serverErrKey] && (
        <FormFeedback className="d-block">
          <UncontrolledAlert color="danger">{serverErrors[serverErrKey]}</UncontrolledAlert>
        </FormFeedback>
      )}
    </FormGroup>
  );
};
export default AppFormikSearchSelect;
