import { toast } from "react-toastify";

const position = toast.POSITION.BOTTOM_LEFT;

const Error = (msg) =>
  toast.error(msg, {
    position,
  });

const Success = (msg) =>
  toast.success(msg, {
    position,
  });
const Info = (msg) =>
  toast.info(msg, {
    position,
  });

const Warning = (msg) =>
  toast.warn(msg, {
    position,
  });

export default {
  Error,
  Success,
  Warning,
  Info,
};
