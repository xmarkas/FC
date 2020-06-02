import React, { Component } from 'react';

class SearchBar extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div id="search-bar" className="row">
          <div className="col-12 py-3">
            <div className="search-wrap">
              <input
                type="text"
                id="search-input"
                placeholder={this.props.placeHolderVal}
                onChange={this.props.onSearch}
              ></input>
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchBar;
