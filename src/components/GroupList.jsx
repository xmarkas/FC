import React, { Component } from "react";
import { Link, Redirect, Route } from "react-router-dom";

class GroupList extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center py-3">
          <div className="col-md-8 col-lg-8 mb-3 mb-md-0">
            <div className="group-list-header spartan">
              <div>Public Groups</div>
              <button
                style={{ fontSize: "small" }}
                className="btn btn-sm btn-primary ml-2"
                onClick={this.props.addGroup}
              >
                create a new group
              </button>
            </div>
            <div id="list-wrapper" className="px-3">
              {this.props.data &&
                this.props.data.Clans.map((item, index) => {
                  let target =
                    item.name.toUpperCase() + item.area.toUpperCase();
                  if (target.includes(this.props.searchValue.toUpperCase())) {
                    return GroupItem(item, index, this);
                  }
                })}
            </div>
          </div>
          <div className="col-md-4 col-lg-4">
            <div className="row pb-3">
              <div className="col">
                <div className=" blank-div">Add Something Else HERE!!!</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className=" blank-div">Add Something Else HERE!!!</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div className="blank-div-foot">Something here too!!</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default GroupList;

function GroupItem(item, index, thisContext) {
  return (
    <Link
      to={{
        pathname: "/grouppage",
        query: { groupId: item.id },
      }}
      style={{ textDecoration: "none" }}
    >
      <div
        key={index}
        className="row group-list-item"
        style={{ background: index % 2 ? "#346802" : "#343a40" }}
      >
        <div className="col-2">
          {!item.image_url && <i className="fas fa-users group-img mr-1"></i>}
          {item.image_url && (
            <div className="img-wrap-sm mr-1">
              <img
                src={`/Group_Images/${item.image_url}`}
                style={{ width: "inherit" }}
              ></img>
            </div>
          )}
          {/* <img className="seller-img-md" src={item.image_url} alt=""></img> */}
        </div>
        <div className="col-5">
          <div className="row group-name" style={{ fontSize: "1.3rem" }}>
            {item.name}
          </div>
          <div className="row" style={{ fontSize: ".7rem" }}>
            Members {item.member_count}
          </div>
        </div>
        <div className="col-5">{item.area}</div>
      </div>
    </Link>
  );
}
