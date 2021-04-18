import { axiosInstance } from "../../../network/apis";
import { SCAN_CART } from "./pickerTypes";
import { history } from "../../../history";

export const scanCart = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/api/v1/client/picking/scan-cart", data, {
      handlerEnabled: true,
      loader: "scanCart",
    });
    dispatch({
      type: SCAN_CART,
      payload: res.data.data,
    });
  } catch (err) {}
};
