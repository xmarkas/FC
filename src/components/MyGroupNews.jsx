import React, { Component } from 'react';

class MyGroupNews extends Component {
  state = {
    edit: false,
    newMessage: ""
  };

  newNews = () => {
    this.setState({ edit: true });
  };

  cancelAddNews = () => {
    this.setState({ newMessage: "", edit: false });
  };

  addNews = () => {
    if (this.state.newMessage.length > 0) {
      this.props.addNewNews(this.state.newMessage);
      this.setState({ newMessage: "", edit: false });
    }
  };

  render() {
    return (
      <div className="card bg-light">
        <div className="card-header button-group">
          <div>News</div>
          {/* add news */}
          {!this.state.edit && (
            <button
              className="btn btn-sm btn-primary"
              style={{ font: "small-caption", float: "right" }}
              onClick={this.newNews}
            >
              <i className="fas fa-plus"></i>
            </button>
          )}
          {/* save news */}
          {this.state.edit && (
            <button
              className="btn btn-sm btn-success"
              style={{ font: "small-caption", float: "right" }}
              onClick={this.addNews}
            >
              save
            </button>
          )}
          {/* cancel add */}
          {this.state.edit && (
            <button
              className="btn btn-sm btn-danger"
              style={{ font: "small-caption", float: "right" }}
              onClick={this.cancelAddNews}
            >
              cancel
            </button>
          )}
        </div>
        <div className="card-body p-0" style={{ overflowY: "auto", maxHeight: "315px" }}>
          <div className="container-fluid pt-2" id="news-list">
            <ul
              id="group-news-list"
              style={{ listStyle: "none", padding: "0", fontSize: "small" }}
            >
              {this.state.edit && (
                <textarea
                  style={{ width: "100%", height: "90px" }}
                  name="news"
                  className="group-news-item"
                  onChange={ev =>
                    this.setState({ newMessage: ev.target.value })
                  }
                ></textarea>
              )}
              {this.props.data &&
                this.props.data.News.map(n => {
                  return (
                    <li className="mb-4">
                      <div className="group-news-item">{n.message}</div>
                      <div className="mt-1" style={{ float: "right", fontSize: "x-small" }}>
                        {new Date(n.created).toLocaleString()}
                      </div>
                    </li>
                  );
                })}
              {/* <li className="group-news-item">
              We are getting ready to place some orders please get in what you
              ASAP we are hoping to get our order within 5 days!
              </li>
              <li className="group-news-item">Welcome new members!</li> */}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default MyGroupNews;