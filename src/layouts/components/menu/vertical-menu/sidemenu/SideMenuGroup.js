/* eslint-disable no-unused-vars */
/* eslint-disable no-undefined */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "reactstrap";
import classnames from "classnames";
import { ChevronRight } from "react-feather";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";
import { connect } from "react-redux";
import * as Icon from "react-feather";
import { syncStatus } from "../../../../../utility/constants";
import { AbilityContext } from "../../../../../configs/casl/can";

class SideMenuGroup extends React.Component {
  constructor(props) {
    super(props);
    this.flag = true;
    this.parentArray = [];
    this.childObj = {};
  }

  state = {
    isOpen: false,
    activeItem: this.props.activePath,
  };

  handleActiveItem = (url) => {
    this.setState({
      activeItem: url,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePath !== this.props.activePath) {
      if (this.childObj.navLink && this.childObj.collapsed) {
        this.props.collapsedMenuPaths(this.childObj.navLink);
      }
      if (
        this.props.activePath === this.childObj.navLink &&
        !this.props.parentArr.includes(this.parentArray[0])
      ) {
        this.props.parentArr.splice(0, this.props.parentArr.length);
        this.props.parentArr.push(this.parentArray);
      } else if (this.props.parentArr.includes(this.parentArray)) {
        this.props.parentArr.splice(0, this.props.parentArr.length);
      }
    }
  }

  renderSuccessBadge(child) {
    return (
      <>
        <Badge
          id={`badge-${child.id}`}
          style={{
            position: "absolute",
            top: 10,
            right: 0,
          }}
          color="success"
          className="float-right mr-2"
        >
          <Icon.Check size={14} className="m-0" />
        </Badge>
        <UncontrolledTooltip target={`badge-${child.id}`}>Sync Success</UncontrolledTooltip>
      </>
    );
  }

  renderProgressBadge(child) {
    return (
      <>
        <Badge
          id={`badge-${child.id}`}
          style={{
            position: "absolute",
            top: 10,
            right: 0,
          }}
          color="info"
          className="float-right mr-2"
        >
          <Spinner size="sm" className="m-0" />
        </Badge>
        <UncontrolledTooltip target={`badge-${child.id}`}>Sync In Progress</UncontrolledTooltip>
      </>
    );
  }

  renderFailureBadge(child) {
    return (
      <>
        <Badge
          id={`badge-${child.id}`}
          style={{
            position: "absolute",
            top: 10,
            right: 0,
          }}
          color="danger"
          className="float-right mr-2"
        >
          <Icon.X size={14} className="m-0" />
        </Badge>
        <UncontrolledTooltip target={`badge-${child.id}`}>Sync Failed</UncontrolledTooltip>
      </>
    );
  }

  renderSyncBadge(child) {
    // Check the type of the sync ["categories", "attributes", "product"]
    switch (child.id) {
      case "categories":
        if (this.props.categoriesSyncStatus) {
          // Check syncStatus Status ["SYNCED_SUCCESSFULLY", "SYNC_IN_PROGRESS" "SYNC_FAILED"]
          switch (this.props.categoriesSyncStatus?.status?.value) {
            // SUCCESS
            case syncStatus.SYNCED_SUCCESSFULLY:
              return this.renderSuccessBadge(child);
            // PROGRESS
            case syncStatus.SYNC_IN_PROGRESS:
              return this.renderProgressBadge(child);
            // FALIUR
            case syncStatus.SYNC_FAILED:
              return this.renderFailureBadge(child);
            default:
              break;
          }
        }
        break;
      case "attributes":
        if (this.props.attributesSyncStatus) {
          // Check syncStatus Status ["SYNCED_SUCCESSFULLY", "SYNC_FAILED"]
          switch (this.props.attributesSyncStatus?.status?.value) {
            // SUCCESS
            case syncStatus.SYNCED_SUCCESSFULLY:
              return this.renderSuccessBadge(child);
            // PROGRESS
            case syncStatus.SYNC_IN_PROGRESS:
              return this.renderProgressBadge(child);
            // FALIUR
            case syncStatus.SYNC_FAILED:
              return this.renderFailureBadge(child);
            default:
              break;
          }
        }
        break;
      case "product":
        if (this.props.productsSyncStatus) {
          // Check syncStatus Status ["SYNCED_SUCCESSFULLY", "SYNC_FAILED"]
          switch (this.props.productsSyncStatus?.status?.value) {
            // SUCCESS
            case syncStatus.SYNCED_SUCCESSFULLY:
              return this.renderSuccessBadge(child);
            // PROGRESS
            case syncStatus.SYNC_IN_PROGRESS:
              return this.renderProgressBadge(child);
            // FALIUR
            case syncStatus.SYNC_FAILED:
              return this.renderFailureBadge(child);
            default:
              break;
          }
        }
        break;

      default:
        break;
    }
  }

  renderChild(item, activeGroup, handleGroupClick, handleActiveItem, parent) {
    return (
      <ul className="menu-content">
        {item.children
          ? // eslint-disable-next-line array-callback-return
            item.children.map((child) => {
              if (this.context.can("viewPage", child.id)) {
                const CustomAnchorTag = child.type === "external-link" ? `a` : Link;
                if (!this.parentArray.includes(item.id) && this.flag) {
                  this.parentArray.push(item.id);
                }

                if (child.navlink && child.collapsed) {
                  this.props.collapsedMenuPaths(child.navLink);
                }

                if (this.props.activeItemState === child.navLink) {
                  this.childObj = child;
                  this.props.parentArr.push(this.parentArray);
                  this.flag = false;
                }
                if (child.permissions === undefined) {
                  return (
                    <li
                      key={child.id}
                      className={classnames({
                        hover: this.props.hoverIndex === child.id,
                        "has-sub": child.type === "collapse",
                        open: child.type === "collapse" && activeGroup.includes(child.id),
                        "sidebar-group-active": this.props.currentActiveGroup.includes(child.id),
                        active:
                          (this.props.activeItemState === child.navLink && child.type === "item") ||
                          (child.parentOf && child.parentOf.includes(this.props.activeItemState)) ||
                          (child.navLink &&
                            child.navLink !== "/" &&
                            window.location.href.includes(child.navLink)),
                        disabled: child.disabled,
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupClick(child.id, item.id, child.type);
                        if (child.navLink && child.navLink !== undefined) {
                          handleActiveItem(child.navLink);
                        }
                        if (this.props.deviceWidth <= 1200 && child.type === "item") {
                          this.props.toggleMenu();
                        }
                      }}
                    >
                      <CustomAnchorTag
                        className={classnames({
                          "d-flex justify-content-between": child.type === "collapse",
                        })}
                        to={child.navLink && child.type === "item" ? child.navLink : ""}
                        href={child.type === "external-link" ? child.navLink : ""}
                        onMouseEnter={() => {
                          this.props.handleSidebarMouseEnter(child.id);
                        }}
                        onMouseLeave={() => {
                          this.props.handleSidebarMouseEnter(child.id);
                        }}
                        key={child.id}
                        onClick={(e) => (child.type === "collapse" ? e.preventDefault() : "")}
                        target={child.newTab ? "_blank" : undefined}
                      >
                        <div className="menu-text">
                          {child.icon}
                          <span className="menu-item menu-title">{child.title}</span>
                        </div>
                        {/* Sync Notification Badge */}
                        {child.badge && this.renderSyncBadge(child)}
                        {child.type === "collapse" ? (
                          <ChevronRight className="menu-toggle-icon" size={13} />
                        ) : (
                          ""
                        )}
                      </CustomAnchorTag>

                      {child.children
                        ? this.renderChild(
                            child,
                            activeGroup,
                            handleGroupClick,
                            handleActiveItem,
                            item.id,
                          )
                        : ""}
                    </li>
                  );
                }
                return null;
              }
            })
          : null}
      </ul>
    );
  }

  render() {
    return (
      <>
        {this.renderChild(
          this.props.group,
          this.props.activeGroup,
          this.props.handleGroupClick,
          this.props.handleActiveItem,
          null,
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  categoriesSyncStatus: state.categories.syncStatus,
  productsSyncStatus: state.products.syncStatus,
  attributesSyncStatus: state.attributes.syncStatus,
});

export default connect(mapStateToProps)(SideMenuGroup);
SideMenuGroup.contextType = AbilityContext;
