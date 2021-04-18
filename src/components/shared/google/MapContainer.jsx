import React from "react";

import { Map, Marker } from "google-maps-react";
import { useDispatch } from "react-redux";
import { getCityFromLatLng } from "../../../redux/hubs/hubsActions";

const MapContainer = ({ position, setPosition, validationErr, setLocationValidation }) => {
  const dispatch = useDispatch();

  const onMarkerDragEnd = (coord) => {
    if (validationErr) setLocationValidation(null);
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setPosition({ lat, lng });

    dispatch(getCityFromLatLng({ lat, lng }, true));
  };

  const style = {
    width: "100%",
    height: "100%",
  };
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "500px",
    left: 0,
  };
  return (
    <Map
      google={window.google}
      zoom={10}
      containerStyle={containerStyle}
      style={style}
      center={{
        lat: position.lat,
        lng: position.lng,
      }}
    >
      <Marker
        draggable
        onDragend={(t, map, coord) => onMarkerDragEnd(coord)}
        position={{
          lat: position.lat,
          lng: position.lng,
        }}
      ></Marker>
    </Map>
  );
};

export default MapContainer;
