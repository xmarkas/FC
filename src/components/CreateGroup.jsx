import React, { Component } from 'react';


class CreateGroup extends Component {
  state = {
    name: "",
    summary: "",
    area: "",
    image_url: null
  };

  onFormChange = ev => {
    let set = {};
    set[ev.target.id] = ev.target.value;
    this.setState(set);
  };

  createGroup = () => {
    let payload = {};
    Object.keys(this.state).forEach(k => {
      payload[k] = this.state[k];
    });

    let file = document.getElementById("image_url").files[0];
    let formData = new FormData();
    formData.append("file", file);

    // Append file name and user id to payload
    if (file) {
        payload.image_url = `${this.state.name}@${file.name}`;
        payload.image_url = payload.image_url.replace(" ", "");
      console.log(payload);

      // Send image
      fetch(`/imageUpload/group?groupname=${this.state.name}`, {
        body: formData,
        method: "POST"
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log(res);
        });
    }

    // if (this.props.editDeal) {
    //   // Update Deal
    //   console.log(payload);
    //   this.props.updateDeal(payload);
    // } else {
    // Insert Deal
    this.props.newGroup(payload);
    // }
  };
  render() {
    return (
      <div
        id="item-view-container"
        onClick={ev => {
          if (ev.target.id === "item-view-container") this.props.addGroup();
        }}
        className=""
        style={{
          overflowY: "auto",
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: "1000",
          top: "0"
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{
            boxShadow: "0 0 16px 2px rgba(0,0,0,.3)",
            maxWidth: "425pm!important"
          }}
        >
          <div className="modal-content">
            <div
              className="header spartan d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#346802",
                color: "white",
                padding: "12px"
              }}
            >
              <img width="40px" src="./media/logoAlpha.gif" alt="" />{" "}
              <div>Create A Group</div>
                <i class="fas fa-window-close modal-close" onClick={this.props.addGroup}></i>
            </div>
            <div className="modal-body">
              {/* Group Name */}
              <div className="form-group">
                <label>Group name</label>
                <input
                  style={{ width: "60%" }}
                  onChange={ev => this.onFormChange(ev)}
                  value={this.state.description}
                  type="text"
                  className="form-control"
                  id="name"
                ></input>
                <small
                  style={{
                    color: this.state.name.length > 30 ? "#dc3545" : "#6c757d"
                  }}
                >
                  maximum length 30 characters ({30 - this.state.name.length}{" "}
                  remaining)
                </small>
              </div>
              {/* Summary  */}
              <div className="form-group">
                <label>Summary - Tell them about your group</label>
                <textarea
                  onChange={ev => this.onFormChange(ev)}
                  value={this.state.summary}
                  type="text"
                  className="form-control"
                  id="summary"
                  style={{ height: "145px" }}
                ></textarea>
                <small
                  style={{
                    color:
                      this.state.summary.length > 255 ? "#dc3545" : "#6c757d"
                  }}
                >
                  maximum length 255 characters (
                  {255 - this.state.summary.length} remaining)
                </small>
              </div>
              {/* Area  */}
              <div className="form-group">
                <label>
                  Group Area - This can be a neigborhood, city, county, etc...
                </label>
                <input
                  style={{ width: "60%" }}
                  onChange={ev => this.onFormChange(ev)}
                  value={this.state.area}
                  type="text"
                  className="form-control"
                  id="area"
                ></input>
                <small
                  style={{
                    color: this.state.area.length > 30 ? "#dc3545" : "#6c757d"
                  }}
                >
                  maximum length 30 characters
                </small>
              </div>
              {/* Upload image */}
              <div className="form-group">
                <label>Upload an image of your product</label>
                <input
                  //   value={this.state.image_url}
                  type="file"
                  className="form-control-file"
                  id="image_url"
                ></input>
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "space-evenly" }}
            >
              <button
                className="btn btn-sm btn-primary flex-cc"
                onClick={this.createGroup}
              >
                <img
                  src="/media/logoAlpha.gif"
                  alt=""
                  style={{ width: "15px", marginRight: "2px" }}
                ></img>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateGroup;