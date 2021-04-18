import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { history } from "../../../history";
import { logout } from "../../../redux/Auth/AuthActions";
import { connect } from "react-redux";
class BasicSweetCallback extends React.Component {
  state = {
    defaultAlert: false,
    confirmAlert: false,
    cancelAlert: false,
  };

  handleAlert = (state, value) => {
    this.setState({ [state]: value });

    switch (state) {
      case "confirmAlert": {
        this.props.logout(true);
        return;
      }
      case "cancelAlert": {
        history.push("/pages/login");
        return;
      }
      default: {
      }
    }
  };
  componentDidMount() {
    this.handleAlert("defaultAlert", true);
  }
  render() {
    return (
      <span>
        <span
          className="mr-1 mb-1"
          color="primary"
          onClick={() => this.handleAlert("defaultAlert", true)}
        >
          logout
        </span>

        <SweetAlert
          title="Are you sure you want to logout?"
          warning
          show={this.state.defaultAlert}
          showCancel
          reverseButtons
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes"
          cancelBtnText="No"
          onConfirm={() => {
            this.handleAlert("basicAlert", false);
            this.handleAlert("confirmAlert", true);
          }}
          onCancel={() => {
            this.handleAlert("basicAlert", false);
            this.handleAlert("cancelAlert", true);
          }}
        ></SweetAlert>

        <SweetAlert
          success
          title="Logged out!"
          confirmBtnBsStyle="success"
          show={this.state.confirmAlert}
          onConfirm={() => {
            this.handleAlert("defaultAlert", false);
            this.handleAlert("confirmAlert", false);
          }}
        ></SweetAlert>

        <SweetAlert
          error
          title="Cancelled"
          confirmBtnBsStyle="success"
          show={this.state.cancelAlert}
          onConfirm={() => {
            this.handleAlert("defaultAlert", false);
            this.handleAlert("cancelAlert", false);
          }}
        ></SweetAlert>
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    serverErrors: state.serverErrors,
    loaders: state.loaders,
  };
};

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicSweetCallback);
