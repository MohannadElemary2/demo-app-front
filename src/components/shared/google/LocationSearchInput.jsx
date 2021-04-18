import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Input, Spinner } from "reactstrap";

const LocationSearchInput = ({
  address,
  setAddress,
  handleLocationInput,
  invalid,
  setLocationValidation,
  id,
}) => {
  const handleChange = (address) => {
    setAddress(address);
    if (invalid) setLocationValidation(null);
  };

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        handleLocationInput(latLng);
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Input
            invalid={Boolean(invalid)}
            id={id}
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "location-search-input",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <Spinner color="primary" className="m-1" />}
            {suggestions.map((suggestion, i) => {
              const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  key={JSON.stringify(i)}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
