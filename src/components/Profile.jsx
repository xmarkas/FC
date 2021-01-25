import React, { Component } from 'react';
import { connect } from "react-redux";

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

class Profile extends Component {
  state = {
    edit: false,
    area: "_",
    imageFile: null,
    imgUpload: false,
    imgPreview: null
  };

  stars = userScore => {
    let score = [];
    for (let s = 0; s < 5; s++) {
      if (s < userScore) {
        score.push(<i key={s} className="fas fa-star sY"></i>);
      } else {
        score.push(<i key={s} className="fas fa-star sG"></i>);
      }
    }
    return score;
  };

  saveProfile = () => {
    this.setState({ edit: false });

    let payload = {};

    // Append area if has value
    if (this.state.area !== "_") payload.area = this.state.area;

    // Append file name and user id to payload
    if (this.state.imageFile) {
      // let groupName = this.props.data.Clan[0].name.replace(/\s|"|'/g, "");
      let file = this.state.imageFile;
      let formData = new FormData();
      formData.append("file", file);

      payload.image_url = `${this.props.user.id}@${file.name}`;
      payload.image_url = payload.image_url.replace(/\s|"|'/g, "");
      console.log(payload);

      // Send image
      fetch(`/imageUpload/user?userId=${this.props.user.id}`, {
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

    if (Object.keys(payload).length !== 0) this.props.updateProfile(payload);
  };

  groupImgUpload = () => {
    this.setState(
      prevState => {
        return { imgUpload: true };
      },
      () => {
        document.getElementById('image').click();
      }
    );
  };

  imgPreview = ev => {
    let file = document.getElementById("image").files[0];
    this.setState({ imageFile: file });
    let Reader = new FileReader();

    Reader.onloadend = (e) => {
      this.setState({imgPreview: e.target.result})
    };

    Reader.readAsDataURL(file);
  };

  render() {
    return (
      <React.Fragment>
        <div className="card bg-light">
          <div
            className="card-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>Profile</div>
            {!this.state.edit ? (
              <div id="edit">
                <i
                  className="fas fa-pencil-alt"
                  onClick={() => {
                    this.setState({ edit: true });
                  }}
                ></i>
              </div>
            ) : (
              <button
                id="save"
                onClick={this.saveProfile}
                className="btn btn-sm btn-success"
                style={{ font: "small-caption" }}
              >
                save
              </button>
            )}
          </div>
          <div className="card-body">
            {/* ROW */}
            <div className="row">
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                onChange={this.imgPreview}
              ></input>
              <div className="col-6 text-center d-flex justify-content-center">
                {this.state.edit && (
                  <i
                    className="fas fa-camera-retro fa-3x"
                    onClick={this.groupImgUpload}
                  ></i>
                )}
                {!this.state.imgUpload && !this.props.user.image_url && (
                  <i className="fas fa-users fa-7x"></i>
                )}
                {!this.state.imgUpload && this.props.user.image_url && (
                  <div className="img-wrap-lg">
                    <img
                      src={`/Profile_Images/${this.props.user.image_url}`}
                      style={{ width: "inherit" }}
                    ></img>
                  </div>
                )}
                {this.state.imgUpload && (
                  <div className="img-wrap-lg">
                    <img id="preview" src={this.state.imgPreview} style={{ width: "inherit" }}></img>
                  </div>
                )}
              </div>
              <div className="col-6 align-self-center">
                <div className="row justify-content-center">
                  {this.props.user.first_name} {this.props.user.last_name}
                </div>
                <div className="row">
                  <div className="col text-center">
                    {this.stars(this.props.user.score)}
                  </div>
                </div>
              </div>
            </div>
            {/* ROW */}
            <div id="user-details" className="row mt-4">
              <div className="col-6">
                <div className="row justify-content-center">Your Area</div>
                <div className="row justify-content-center text-muted">
                  {this.state.edit ? (
                    <input
                      id="area"
                      placeholder="general location"
                      onChange={ev => this.setState({ area: ev.target.value })}
                    ></input>
                  ) : (
                    this.props.user.area
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="row justify-content-center">
                  Profile Visibility
                </div>
                <div className="row justify-content-center text-muted">
                  {this.state.edit ? (
                    <select id="visibility">
                      <option value="0">Private</option>
                      <option value="1">Group Only</option>
                      <option value="2">Public</option>
                    </select>
                  ) : (
                    "Groups Only"
                  )}
                </div>
              </div>
            </div>
            {/* ROW */}
            <div id="user-details" className="row mt-2">
              <div className="col-6">
                <div className="row justify-content-center">
                  Transaction Types
                </div>
                <div className="row justify-content-center text-muted">
                  {this.props.user.type === 0
                    ? "Buyer"
                    : this.props.user.type === 1
                    ? "Seller"
                    : "Buyer/Seller"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(Profile);
