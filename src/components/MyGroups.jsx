import React, { Component } from "react";
import { Link } from "react-router-dom";

class MyGroups extends Component {
  state = {
    editGroup: false,
    removeGroupSelector: null
  };

  changeState = () => {
    setTimeout(() => {
      this.setState(prevState => {
        let groups = [...prevState.groups];
        groups.forEach((g, index) => {
          groups[index].members = 10;
        });
        return { groups: groups };
      });
    }, 2000);
  };

  goToGroups = groupId => {
    if (groupId) {
      window.location.replace(`/group-page.html?ref=${groupId}`);
    } else {
      window.location.replace("/groups.html");
    }
  };

  editGroupList = () => {
    this.setState({ editGroup: this.state.editGroup ? false : true });
  };

  removeGroup = (ev, id) => {
    ev.stopPropagation();
    this.setState({ removeGroupSelector: id });
  };

  render() {
    return (
      <div className="card bg-light" style={{ width: "inherit" }}>
        <div className="card-header button-group">
          <div>Your Groups</div>
          <i
            onClick={this.editGroupList}
            style={{ fontSize: "medium", cursor: "pointer" }}
            className="fas fa-pencil-alt"
          ></i>
          <div>
            <Link
              to="/groups"
              className="btn btn-sm btn-primary mr-1"
              style={{ font: "small-caption", textDecoration: "none" }}
            >
              join a group
            </Link>
            <Link
              to={"/groups?option=1"}
              className="btn btn-sm btn-warning"
              style={{ font: "small-caption" }}
            >
              create group
            </Link>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="container-fluid" id="group-list">
            <ul
              id="group-list"
              style={{ listStyle: "none", padding: "0", fontSize: "small" }}
            >
              {this.props.data &&
                this.props.data.MyClans.map((g, index) => {
                  return (
                    <li
                      key={index}
                      className="row"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "dodgerblue" : "#adb5bd"
                      }}
                    >
                      {(!this.state.removeGroupSelector || this.state.removeGroupSelector !== g.id) && (
                        <Link
                          to={"/grouppage?ref=" + g.id}
                          className="col group-item d-flex"
                          style={{
                            font: "small-caption",
                            textDecoration: "none"
                          }}
                        >
                          <div className="col-2">
                            {!g.image_url && (
                              <i className="fas fa-users group-img"></i>
                            )}
                            {g.image_url && (
                              <div className="img-wrap-sm">
                                <img
                                  style={{ width: "inherit" }}
                                  src={`./Uploads/Group_Images/${g.image_url}`}
                                  alt=""
                                ></img>
                              </div>
                            )}
                          </div>
                          <div className="col-6">{g.name}</div>
                        </Link>
                      )}
                      {this.state.removeGroupSelector === g.id && (
                        <React.Fragment>
                          <div
                            className="col"
                            style={{
                              fontSize: "smaller",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "55px"
                            }}
                          >
                            Are you sure you want to leave {g.name}?
                          </div>
                          <div className="col d-flex justify-content-around align-items-center">
                            <button
                              className="btn btn-sm btn-danger"
                              style={{fontSize:"smaller"}}
                              onClick={() =>
                                this.setState({ removeGroupSelector: null })
                              }
                            >
                              cancel
                            </button>
                            <button
                              style={{fontSize:"smaller"}}
                              className="btn btn-sm btn-success"
                              onClick={() => this.props.leaveGroup(g.id)}
                            >
                              leave
                            </button>
                          </div>
                        </React.Fragment>
                      )}
                      {this.state.editGroup && !this.state.removeGroupSelector && (
                        <div
                          style={{
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "whitesmoke"
                          }}
                        >
                          <button
                            style={{ fontSize: "x-small" }}
                            className="btn btn-sm btn-danger"
                            onClick={ev => this.removeGroup(ev, g.id)}
                          >
                            remove
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroups;
