import React, { Component } from "react";

class AddDeal extends Component {
  constructor(props) {
    super(props);
    if (props.editDeal) {
      this.state = props.editDeal;
      console.log(props.editDeal);
    }
  }
  state = {
    description: "",
    summary: "",
    category: "",
    unit_measure: "",
    units: "",
    price: "",
    public: 0,
    imageName: "",
  };

  onFormChange = (ev) => {
    let set = {};
    set[ev.target.id] = ev.target.value;
    this.setState(set);
  };

  createDeal = () => {
    let payload = {};
    Object.keys(this.state).forEach((k) => {
      if (!["imageName"].includes(k)) {
        // Exclude state list
        payload[k] = this.state[k];
      }
    });

    let file = document.getElementById("image_url1").files[0];
    let formData = new FormData();
    formData.append("file", file);

    // Append file name and user id to payload
    if (file) {
      payload.image_url = `${this.props.user.id}@${file.name}`;
      payload.user_id = this.props.user.id;
      console.log(payload);

      // Send image
      fetch(`/imageUpload?userid=${this.props.user.id}`, {
        body: formData,
        method: "POST",
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
        });
    }

    if (this.props.editDeal) {
      // Update Deal
      console.log(payload);
      this.props.updateDeal(payload);
    } else {
      // Insert Deal
      console.log("---> NEW DEAL");
      this.props.newDeal(payload);
    }
  };

  uploadImage = (ev) => {
    console.log("IMAGE ALT");
    console.log(ev.target.files);
    this.setState({ imageName: ev.target.files[0].name });
  };

  publicSetting = (ev) => {
    this.setState({ public: ev.target.checked ? 1 : 0 });
  };

  render() {
    return (
      <div
        id="item-view-container"
        onClick={(ev) => {
          if (ev.target.id === "item-view-container") this.props.showAddDeal();
        }}
        className="view-container"
        style={{
          overflowY: "auto",
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: "1000",
          top: "0",
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{
            boxShadow: "0 0 16px 2px rgba(0,0,0,.3)",
            maxWidth: "425pm!important",
          }}
        >
          <div className="modal-content">
            <div className="modal-close" onClick={this.props.showAddDeal}>
              <i className="fas fa-window-close modal-close"></i>
            </div>
            <div
              className="header spartan d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#346802",
                color: "white",
                padding: "12px",
              }}
            >
              <img width="40px" src="./media/logoAlpha.gif" alt="" />{" "}
              <div>{this.props.editDeal ? "Editing Deal" : "New Deal"}</div>
            </div>
            <div className="modal-body">
              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <input
                  onChange={(ev) => this.onFormChange(ev)}
                  value={this.state.description}
                  type="text"
                  className="form-control"
                  id="description"
                ></input>
                <small
                  style={{
                    color:
                      this.state.description.length > 30
                        ? "#dc3545"
                        : "#6c757d",
                  }}
                >
                  maximum length 30 characters (
                  {30 - this.state.description.length} remaining)
                </small>
              </div>
              {/* Summary  */}
              <div className="form-group">
                <label>Summary - Tell them about your deal</label>
                <textarea
                  onChange={(ev) => this.onFormChange(ev)}
                  value={this.state.summary}
                  type="text"
                  className="form-control"
                  id="summary"
                ></textarea>
                <small
                  style={{
                    color:
                      this.state.summary.length > 250 ? "#dc3545" : "#6c757d",
                  }}
                >
                  maximum length 250 characters (
                  {250 - this.state.summary.length} remaining)
                </small>
              </div>

              <div className="row">
                <div className="col">
                  {/* Category */}
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      onChange={(ev) => this.onFormChange(ev)}
                      value={this.state.category}
                      id="category"
                      className="form-control form-control-sm"
                    >
                      <option>Fresh Produce</option>
                      <option>Vegetables</option>
                      <option>Spices, Herbs & Seasonings</option>
                      <option>Cheese, Eggs & Dairy</option>
                      <option>Meats and Poultry</option>
                      <option>Seafood</option>
                      <option>Grains, Beans & Flour</option>
                      <option>Coffee, Tea & Chocolate</option>
                      <option>Nuts & Dried Fruit</option>
                      <option>Fermented & Pickled Foods</option>
                      <option>Specialty Foods</option>
                      <option>Packaged & Canned Foods</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  {/* Unit Measure*/}
                  <div className="form-group">
                    <label>Unit measure</label>
                    <select
                      onChange={(ev) => this.onFormChange(ev)}
                      value={this.state.unit_measure}
                      id="unit_measure"
                      className="form-control form-control-sm"
                    >
                      <option value="lbs">lbs (pounds)</option>
                      <option value="oz">oz (ounces)</option>
                      <option value="kg">kg (kilograms)</option>
                      <option value="g">g (grams)</option>
                      <option value="gal">gal (gallons)</option>
                      <option value="qt">qt (quarts)</option>
                      <option value="case">case</option>
                      <option value="doz">doz (dozen)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  {/* Price */}
                  <div className="form-group">
                    <label>Price</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          style={{
                            backgroundColor: "#f8f9fa",
                            fontSize: ".8rem",
                          }}
                        >
                          $
                        </span>
                      </div>
                      <input
                        onChange={(ev) => this.onFormChange(ev)}
                        value={this.state.price}
                        type="number"
                        className="form-control"
                        id="price"
                        style={{ fontSize: ".8rem" }}
                      ></input>

                      {/* <small className="text-muted">
                      No need to include a '$' symbol
                    </small> */}
                    </div>
                  </div>
                </div>

                <div className="col">
                  {/* Units */}
                  <div className="form-group">
                    <label>Units</label>
                    <input
                      onChange={(ev) => this.onFormChange(ev)}
                      value={this.state.units}
                      type="number"
                      className="form-control"
                      id="units"
                      style={{ fontSize: ".8rem" }}
                    ></input>
                    <small className="text-muted">
                      Number of units included in your item
                    </small>
                  </div>
                </div>
              </div>

              {/* Public setting */}
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <input
                          checked={!!this.state.public}
                          type="checkbox"
                          style={{ fontSize: ".8rem" }}
                          onChange={(ev) => this.publicSetting(ev)}
                        ></input>
                      </div>
                    </div>
                    <span
                      type="text"
                      className="form-control"
                      aria-label="Text input with checkbox"
                      style={{ fontSize: ".8rem" }}
                    >
                      Make this offer public
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload image */}
              {/* <div className="form-group">
                <label>Upload an image of your product</label>
                <input
                  //   value={this.state.image_url}
                  type="file"
                  className="form-control-file"
                  id="image_url"
                ></input>
              </div> */}

              {/* Upload image alt */}
              <div className="row">
                <div className="col">
                  <div class="input-group my-2">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="uploadInput">
                        Upload Image
                      </span>
                    </div>
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        id="image_url1"
                        aria-describedby="uploadInput"
                        onChange={(ev) => this.uploadImage(ev)}
                      ></input>
                      <label class="custom-file-label" for="image_url1">
                        {this.state.imageName === ""
                          ? "Choose File"
                          : this.state.imageName}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="modal-footer"
              style={{ justifyContent: "space-evenly" }}
            >
              {!this.props.editDeal && (
                <button
                  className="btn btn-sm btn-primary flex-cc"
                  onClick={this.createDeal}
                >
                  <img
                    src="/media/logoAlpha.gif"
                    alt=""
                    style={{ width: "15px", marginRight: "2px" }}
                  ></img>
                  Create
                </button>
              )}
              {this.props.editDeal && (
                <button
                  className="btn btn-sm btn-primary flex-cc"
                  onClick={this.createDeal}
                >
                  <img
                    src="/media/logoAlpha.gif"
                    alt=""
                    style={{ width: "15px", marginRight: "2px" }}
                  ></img>
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDeal;
