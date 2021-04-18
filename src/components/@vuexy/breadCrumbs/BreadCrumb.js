import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Home } from "react-feather";
import { NavLink } from "react-router-dom";
class BreadCrumbs extends React.Component {
  render() {
    return (
      <div className="content-header row">
        <div className="content-header-left col-md-12 col-12 mb-2">
          <div className="row breadcrumbs-top">
            <div className="col-12">
              {this.props.breadCrumbTitle ? (
                <h2 className="content-header-title float-left mb-0">
                  {this.props.breadCrumbTitle}
                </h2>
              ) : (
                ""
              )}
              {this.props.breadCrumbParent && (
                <div className="breadcrumb-wrapper vx-breadcrumbs d-sm-block d-none col-12">
                  <Breadcrumb tag="ol">
                    {/* Home icon */}
                    <BreadcrumbItem tag="li">
                      <NavLink to="/">
                        <Home className="align-top" size={15} />
                      </NavLink>
                    </BreadcrumbItem>
                    {/* breadCrumbParent */}
                    <BreadcrumbItem tag="li" className="text-primary">
                      {this.props.breadCrumbParent && (
                        <NavLink
                          to={`${this.props.breadCrumbParentURL ?? this.props.breadCrumbParent}`}
                        >
                          {this.props.breadCrumbParent}
                        </NavLink>
                      )}
                    </BreadcrumbItem>
                    {this.props.breadCrumbParent2 ? (
                      <BreadcrumbItem tag="li" className="text-primary">
                        <NavLink
                          to={`${this.props.breadCrumbParent2URL ?? this.props.breadCrumbParent2}`}
                        >
                          {this.props.breadCrumbParent2}
                        </NavLink>
                      </BreadcrumbItem>
                    ) : (
                      ""
                    )}
                    {this.props.breadCrumbParent3 ? (
                      <BreadcrumbItem tag="li" className="text-primary">
                        <NavLink
                          to={`${this.props.breadCrumbParent3URL ?? this.props.breadCrumbParent3}`}
                        >
                          {this.props.breadCrumbParent3}
                        </NavLink>
                      </BreadcrumbItem>
                    ) : (
                      ""
                    )}
                       {this.props.breadCrumbParent4 ? (
                      <BreadcrumbItem tag="li" className="text-primary">
                        <NavLink
                          to={`${this.props.breadCrumbParent4URL ?? this.props.breadCrumbParent4}`}
                        >
                          {this.props.breadCrumbParent4}
                        </NavLink>
                      </BreadcrumbItem>
                    ) : (
                      ""
                    )}
                    <BreadcrumbItem tag="li">{this.props.breadCrumbActive}</BreadcrumbItem>
                  </Breadcrumb>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BreadCrumbs;
