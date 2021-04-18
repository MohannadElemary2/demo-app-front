import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { Spinner } from "reactstrap";

const AppAsyncPaginate = ({
  id,
  value,
  loader,
  loadOptions,
  onChange,
  placeholder,
  isDisabled,
  isClearable,
}) => (
  <AsyncPaginate
    isClearable={isClearable}
    value={value}
    isDisabled={isDisabled}
    id={id}
    loadOptions={loadOptions}
    onChange={onChange}
    debounceTimeout={1000}
    isLoading={loader}
    additional={{
      page: 1,
    }}
    placeholder={
      loader ? (
        <span>
          Loading... <Spinner style={{ height: 20, width: 20 }} />
        </span>
      ) : (
        placeholder
      )
    }
  />
);

export default AppAsyncPaginate;
