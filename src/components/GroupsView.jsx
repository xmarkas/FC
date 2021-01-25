import React, { Component } from "react";
import SearchBar from "./SearchBar";
import GroupList from "./GroupList";
import CreateGroup from "./CreateGroup";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    provisional: state.provisional,
    user: state.user,
    token: state.token,
  };
};

class GroupsView extends Component {
  state = {
    searchInput: "",
    showAddGroup: false,
  };

  componentDidMount() {
    // Value passed from Router > Link
    if (this.props.history.location.query) {
      let option = this.props.history.location.query.option;

      // If the option flag exist and is true open add group window
      if (option) this.setState({ showAddGroup: true });
    }
  }

  componentWillMount() {
    fetchData(this.props.token, this.props.user.id)
      .then((resolved) => {
        console.log(resolved);
        this.setState({ data: resolved });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSearch = (ev) => {
    let value = ev.target.value;
    this.setState({ searchInput: value });
  };

  addGroup = (toggle) => {
    this.setState({ showAddGroup: this.state.showAddGroup ? false : true });
  };

  newGroup = (payload) => {
    payload.user_id = this.props.user.id;

    insertGroup(this.props.token, payload)
      .then((resolved) => {
        console.log(resolved);
        this.setState({ showAddGroup: false });
        this.setState((prevState) => {
          let Clans = [...prevState.data.Clans];
          payload.admin_id = this.props.user.id;
          Clans.push(payload);
          let data = { ...prevState.data, Clans: Clans };
          return { data: data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        {/* <!-- Main Content --> */}
        <div className="row" style={{ backgroundColor: "white" }}>
          {this.state.showAddGroup && (
            <CreateGroup newGroup={this.newGroup} addGroup={this.addGroup} />
          )}
          <div id="group-view" className="col-12">
            <SearchBar
              onSearch={this.onSearch}
              placeHolderVal={"Search for group or area..."}
            />
            <GroupList
              searchValue={this.state.searchInput}
              data={this.state.data}
              addGroup={this.addGroup}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(withRouter(GroupsView));

function fetchData(token, userid) {
  console.log("fetching data......", token, userid);
  return new Promise((resolve, reject) => {
    let request = { userId: userid };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: request,
      }),
    };
    fetch("/accounts/groups", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (!res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}

function insertGroup(token, payload) {
  console.log("fetching data......");
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        entity: payload,
      }),
    };
    fetch("/accounts/createGroup", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}
