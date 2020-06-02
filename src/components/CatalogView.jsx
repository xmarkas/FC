import React, { Component } from 'react';
import ItemView from './ItemView';
import SearchBar from './SearchBar';
import Catalog from './Catalog';
import { CatalogActions } from './ItemViewOption';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    user: state.user,
    token: state.token
  };
};

class CatalogView extends Component {
  state = {
    searchInput: "",
    modal: null
  };

  /**
   * Load data for component
   */
  componentWillMount() {
    // Get catalog items
    let data = getCatalog()
      .then(resolved => {
        console.log("DATAAA", resolved);
        this.setState({ data: resolved });
      })
      .catch(err => {
        console.log(err);
      });
    
    // Get user clans
    getUserClans(this.props.token, this.props.user.id)
        .then(resolved => {
          console.log(resolved);
          this.setState({ userClans: resolved.MyClans });
        })
        .catch(err => {
          console.log(err);
        });
  }

  onSearch = ev => {
    let value = ev.target.value;

    this.setState({ searchInput: value });
  };

  itemView = itemIndex => {
    console.log(itemIndex);
    this.setState({ modal: this.state.data.Deals[itemIndex] });
  };

  closeModal = () => {
    this.setState({ modal: null });
  };

  render() {
    return (
      <React.Fragment>
        {/* <!-- Main Content --> */}
        <div className="row">
          <div id="catalog" className="col">
            <SearchBar
              onSearch={this.onSearch}
              placeHolderVal={rndPlaceHolder()}
            />
            {this.state.data && (
              <Catalog
                searchValue={this.state.searchInput}
                itemView={this.itemView}
                data={this.state.data}
                userClans={this.state.userClans}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(CatalogView);

function rndPlaceHolder() {
  let time = new Date().getTime();

  if (time % 2 === 0) {
    return "What are you looking for?";
  } else if (time % 3 === 0) {
    return "Carrots, Apples, Tomatoes...";
  } else {
    return "Strawberries, Onions, Broccoli..";
  }
}

function getCatalog() {
  return new Promise((resolve, reject) => {
    let options = {
      method: "GET"
      
    };
    fetch("https://foodcommune.com/site/catalog", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res) {
          console.log(res);
          resolve(res);
        } else {
          console.log("Unable to retrieve data");
          reject("Did not load");
        }
      });
  });
}

function getUserClans(token, userId) {
  return new Promise((resolve, reject) => {
    let request = { userId: userId };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({
        entity: request
      })
    };
    fetch("/accounts/userClans", options)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res);
        if (res) {
          // Return to account detail and display error message
          resolve(res);
        } else {
          reject("Unable to retrieve data");
        }
      });
  });
}
