import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toTop } from "../../utility/commonFunctions";
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    toTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
