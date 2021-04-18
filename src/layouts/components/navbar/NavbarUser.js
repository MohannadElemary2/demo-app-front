import React from "react";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import ReactCountryFlag from "react-country-flag";
import * as Icon from "react-feather";
import { connect, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import { IntlContext } from "../../../utility/context/Internationalization";
import { changeDir } from "../../../redux/customizer/customizerActions";
import { logout } from "../../../redux/Auth/AuthActions";
import { history } from "../../../history";
const UserDropdown = () => {
  const dispatch = useDispatch();
  return (
    <DropdownMenu right>
      <DropdownItem tag="div"  style={{width:"100%"}} onClick={()=>history.push("/profile/edit-profile")}>
        <NavLink className="text-gray"  to="/profile/edit-profile">
          <Icon.User size={14} className="mr-50" />
          <span className="align-middle">
            <FormattedMessage id="Edit Profile" />
          </span>
        </NavLink>
      </DropdownItem>

      <DropdownItem tag="div">
        <NavLink className="text-gray" to="/profile/change-password">
          <Icon.Key size={14} className="mr-50" />
          <span className="align-middle">
            <FormattedMessage id="Change Password" />
          </span>
        </NavLink>
      </DropdownItem>

      <DropdownItem tag="div">
        <NavLink className="text-gray" to="/profile/edit-timezone">
          <Icon.Clock size={14} className="mr-50" />
          <span className="align-middle">
            <FormattedMessage id="Change Time Zone" />
          </span>
        </NavLink>
      </DropdownItem>

      <DropdownItem divider />
      <DropdownItem
        tag="a"
        onClick={() => {
          dispatch(logout(true));
        }}
      >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">LogOut</span>
      </DropdownItem>
    </DropdownMenu>
  );
};

class NavbarUser extends React.PureComponent {
  state = {
    navbarSearch: false,
    // suggestions: [],
  };

  componentDidMount() {}

  handleNavbarSearch = () => {
    this.setState({
      navbarSearch: !this.state.navbarSearch,
    });
  };

  handleLangDropdown = () => {
    this.setState({ langDropdown: !this.state.langDropdown });
  };

  render() {
    return (
      <ul className="nav navbar-nav navbar-nav-user float-right">
        <IntlContext.Consumer>
          {(context) => {
            const langArr = {
              en: "English",
              ar: "Arabic",
            };
            return (
              <Dropdown
                tag="li"
                className="dropdown-language nav-item"
                isOpen={this.state.langDropdown}
                toggle={this.handleLangDropdown}
                data-tour="language"
              >
                <DropdownToggle tag="a" className="nav-link">
                  <ReactCountryFlag
                    className="country-flag"
                    countryCode={context.state.locale === "en" ? "us" : "sa"}
                    svg
                  />
                  <span className="d-sm-inline-block d-none text-capitalize align-middle ml-50">
                    {langArr[context.state.locale]}
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    tag="a"
                    onClick={() => {
                      this.props.changeDir("ltr");
                      return context.switchLanguage("en");
                    }}
                  >
                    <ReactCountryFlag className="country-flag" countryCode="us" svg />
                    <span className="ml-1">English</span>
                  </DropdownItem>
                  {/* <DropdownItem
                    tag="a"
                    onClick={(e) => {
                      this.props.changeDir("rtl");

                      return context.switchLanguage("ar");
                    }}
                  >
                    <ReactCountryFlag
                      className="country-flag"
                      countryCode="sa"
                      svg
                    />
                    <span className="ml-1">Arabic</span>
                  </DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            );
          }}
        </IntlContext.Consumer>

        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
          <DropdownToggle tag="a" className="nav-link dropdown-user-link">
            <div className="user-nav d-sm-flex d-none">
              <span className="user-name text-bold-600">{this.props.user.name}</span>
              <small>{this.props.role}</small>
            </div>
            <span data-tour="user">
              <img src={this.props.userImg} className="round" height="40" width="40" alt="avatar" />
            </span>
          </DropdownToggle>
          <UserDropdown {...this.props} />
        </UncontrolledDropdown>
      </ul>
    );
  }
}
export default connect(null, { changeDir })(NavbarUser);
