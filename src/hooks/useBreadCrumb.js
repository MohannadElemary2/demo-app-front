import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { clearBreadCrumbData, updateBreadCrumbData } from "../redux/BreadCrumb/BreadCrumbActions";

export const useBreadCrumb = ({ breadCrumbTitle, breadCrumbItems }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const items = breadCrumbItems.map((ele) => ({
    title: intl.formatMessage({ id: ele.title }),
    url: ele.url,
  }));
  useEffect(() => {
    dispatch(
      updateBreadCrumbData({
        breadCrumbTitle: intl.formatMessage({ id: breadCrumbTitle }),
        breadCrumbItems: items,
      }),
    );
    return () => dispatch(clearBreadCrumbData());
  }, []);
};
