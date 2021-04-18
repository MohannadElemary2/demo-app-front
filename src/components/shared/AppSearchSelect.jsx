import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import { Spinner } from "reactstrap";
import Select from "react-select";
import { debounce } from "../../utility/commonFunctions";
/**
 * AppSearchSelect Component
 */
const AppSearchSelect = ({
  options,
  name,
  isLoading,
  searchFunction,
  searchKey,
  onChange,
  isDisabled,
  placeholder,
  isMulti,
  label,
  isClass,
  isClearable = true,
  value,
  searchParams,
  onMenuOpen,
}) => {
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
        options={options}
        placeholder={
          isLoading ? (
            <span>
              Loading... <Spinner style={{ height: 20, width: 20 }} />
            </span>
          ) : (
            placeholder
          )
        }
        isClearable={isClearable}
        isMulti={isMulti}
        isDisabled={isDisabled}
        id={name}
        name={name}
        value={value}
        isLoading={isLoading}
        onChange={(e) => {
          if (onChange) onChange(e);
        }}
        onInputChange={(text) => {
          if (text && !isClass) search({ [searchKey]: text, ...searchParams });
          if (text && isClass) searchClass({ [searchKey]: text, ...searchParams });
        }}
        onMenuOpen={() => {
          if (onMenuOpen && !options.length) {
            dispatch(onMenuOpen({ ...searchParams }));
          }
        }}
      />
    </FormGroup>
  );
};
export default AppSearchSelect;
