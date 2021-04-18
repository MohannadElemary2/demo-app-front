import React from "react";
import { deleteRole } from "../../../redux/roles/rolesActions";
import { connect } from "react-redux";
import LazyAlert from "../../../components/shared/LazyAlert";
import { Input } from "reactstrap";

class ConfirmDeleteRoleAlert extends React.Component {
  state = {
    inputAlert: false,
    wrongAnswer: false,
  };
  handleDelete = () => {
    let answer = +document.getElementById("conf-inp").value;
    if (answer !== this.props.role.number_of_users) {
      this.setState({ wrongAnswer: true });
    } else {
      this.setState({ wrongAnswer: false });
      this.props.deleteRole(this.props.role?.id);
      this.props.onConfirm();
    }
  };

  render() {
    return (
      <LazyAlert
        title="Are you sure you want to delete the role?"
        show={this.props.show}
        onConfirm={(e) => this.handleDelete(e)}
        onCancel={this.props.onCancel}
        btnColor="danger"
        confirmLabel="Delete"
      >
        <small className="sweet-alert-text">
          By deleting this role you will remove the permissions of [
          {this.props.role?.number_of_users}] users assigned to this role!
          Confirm by typing the mentioned number of users.
        </small>

        <Input className="mt-2" type="number"   onWheel={(evt) => evt.target.blur()} id="conf-inp" />
        {this.state.wrongAnswer ? (
          <small className="danger">Wrong number, please try again</small>
        ) : (
          ""
        )}
      </LazyAlert>
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
  deleteRole,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDeleteRoleAlert);
