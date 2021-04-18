import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "reactstrap";
import * as Icon from "react-feather";
import toasters from "../../utility/toasters";

const UploadButton = ({ label = "Upload", onload, accept = ".xlsx, .xls, .csv", ...rest }) => {
  const { getInputProps, open } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      const reader = new FileReader();
      reader.onload = () => {
        const FILE = acceptedFiles[0];
        onload(FILE);
      };
      if (acceptedFiles.length) {
        reader.readAsBinaryString(acceptedFiles[0]);
      } else {
        toasters.Error(`You can only upload ${accept} files!`);
      }
    },
  });
  return (
    <>
      <input {...getInputProps()} />
      <Button color="primary" className="mr-2" type="button" onClick={open} {...rest}>
        <div className="d-flex align-items-center">
          <Icon.Upload size={16} className="mr-1 d-block" />
          <span className="d-block">{label}</span>
        </div>
      </Button>
    </>
  );
};

export default UploadButton;
