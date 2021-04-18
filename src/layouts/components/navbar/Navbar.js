import React, { useEffect, useState } from "react";
import { Navbar, Progress } from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import NavbarBookmarks from "./NavbarBookmarks";
import NavbarUser from "./NavbarUser";
import userImg from "../../../assets/img/portrait/small/avatar.png";

const ThemeNavbar = ({
  profile,
  navbarType,
  navbarColor,
  horizontal,
  scrolling,
  sidebarVisibility,
  handleAppOverlay,
  changeCurrentLang,
  loaders,
  permissions,
}) => {
  const colorsArr = ["primary", "danger", "success", "info", "warning", "dark"];
  const navbarTypes = ["floating", "static", "sticky", "hidden"];
  const [userData, setUserData] = useState(() => "");
  const [role, setRole] = useState(() => "-");

  useEffect(() => {
    if (profile.name) {
      setUserData({
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (permissions.is_super) {
      setRole("Admin");
    } else if (permissions.roles.length) {
      setRole(permissions.roles[0].name);
    }
  }, [permissions]);

  return (
    <>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light": navbarColor === "default" || !colorsArr.includes(navbarColor),
            "navbar-dark": colorsArr.includes(navbarColor),
            "bg-primary": navbarColor === "primary" && navbarType !== "static",
            "bg-danger": navbarColor === "danger" && navbarType !== "static",
            "bg-success": navbarColor === "success" && navbarType !== "static",
            "bg-info": navbarColor === "info" && navbarType !== "static",
            "bg-warning": navbarColor === "warning" && navbarType !== "static",
            "bg-dark": navbarColor === "dark" && navbarType !== "static",
            "d-none": navbarType === "hidden" && !horizontal,
            "floating-nav":
              (navbarType === "floating" && !horizontal) ||
              (!navbarTypes.includes(navbarType) && !horizontal),
            "navbar-static-top": navbarType === "static" && !horizontal,
            "fixed-top": navbarType === "sticky" || horizontal,
            scrolling: horizontal && scrolling,
          },
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                <NavbarBookmarks
                  sidebarVisibility={sidebarVisibility}
                  handleAppOverlay={handleAppOverlay}
                />
              </div>
              {horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50"></div>
                  <h2 className="text-primary brand-text mb-0">Vuexy</h2>
                </div>
              ) : null}
              <NavbarUser
                handleAppOverlay={handleAppOverlay}
                changeCurrentLang={changeCurrentLang}
                user={userData}
                role={role}
                userImg={userImg}
              />
            </div>
          </div>
          {Boolean(loaders.totalRequestsArr.length) && (
            <Progress
              className="m-0"
              animated
              max={loaders.totalRequests}
              value={loaders.loading}
            />
          )}
        </div>
      </Navbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  loaders: state.loaders,
  profile: state.profile,
  serverErrors: state.serverErrors,
  permissions: state.permissions,
});

export default connect(mapStateToProps)(ThemeNavbar);
