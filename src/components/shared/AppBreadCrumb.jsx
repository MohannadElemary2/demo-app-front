import React from "react";
import { Home } from "react-feather";
import { NavLink } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

/**
 * AppBreadCrumb Component
 */
const AppBreadCrumb = ({ breadCrumbTitle = "", breadCrumbItems = [] }) => {
  document.title = breadCrumbTitle;
  return (
    <div>
      <h2 className="text-gray float-left mb-0 border-right pr-1">{breadCrumbTitle}</h2>
      {Boolean(breadCrumbItems.length) && (
        <Breadcrumb tag="ol">
          <BreadcrumbItem tag="li">
            <NavLink to="/">
              <Home className="align-top" size={15} />
            </NavLink>
          </BreadcrumbItem>
          {breadCrumbItems.map((ele, i) => {
            const lastEle = breadCrumbItems[breadCrumbItems.length - 1];
            const isLast = ele === lastEle;
            return (
              <BreadcrumbItem tag="li" active={isLast} key={JSON.stringify(i)}>
                {!isLast && (
                  <NavLink className="text-primary" to={ele.url}>
                    {ele.title}
                  </NavLink>
                )}
                {isLast && ele.title}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      )}
    </div>
  );
};
export default React.memo(AppBreadCrumb);
