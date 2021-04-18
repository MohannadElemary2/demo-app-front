import React from "react";

const BarcodeReader = ({ value, displayValue, height }) => {
  const Barcode = require("react-barcode");

  return (
    <Barcode value={value} displayValue={displayValue} height={height} textPosition="top"></Barcode>
  );
};

export default React.memo(BarcodeReader);
