import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
import { InputGroup, Input, InputGroupAddon } from "reactstrap";
import LazyButton from "./lazyButton";
import { debounce } from "../../utility/commonFunctions";

/**
 * SearchInput Component
 */
const SearchInput = ({
  searchFunction,
  searchKey,
  searchParams,
  isDisabled,
  placeholder,
  loader,
  label,
}) => {
  const [searchValue, setSearchValue] = useState(() => "");
  const dispatch = useDispatch();
  const ref = useRef(0);
  console.log((ref.current += 1));

  const search = useCallback(
    debounce((...query) => dispatch(searchFunction(...query)), 1000),
    [],
  );
  return (
    <InputGroup>
      <Input
        style={{ height: 38 }}
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          if (searchFunction) search({ ...searchParams, name: e.target.value });
          setSearchValue(e.target.value);
        }}
      />

      <InputGroupAddon addonType="append" style={{ height: 38 }}>
        <LazyButton
          disabled={isDisabled}
          icon={<Search size={16} />}
          label={label}
          loader={loader}
          onClick={() => {
            if (searchFunction) search({ [searchKey]: searchValue, ...searchParams });
          }}
        />
      </InputGroupAddon>
    </InputGroup>
  );
};
export default SearchInput;
