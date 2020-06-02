import React, { Component } from 'react';

class ItemView extends Component {
  state = {};

  render() {
    return (
      <div id="item-view-container" className="view-container">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-close">
              <i
                className="fas fa-window-close modal-close"
                style={{ color: "red" }}
                onClick={this.props.closeModal}
              ></i>
            </div>
            <div
              className="modal-header align-items-center"
              style={{ backgroundColor: "#f3f3f3" }}
            >
              <div className="col-12 spartan" style={{color: "dimgray"}}>
                <h5 className="modal-title" style={{ color: "black" }}>
                  {this.props.modal && this.props.modal.description}
                </h5>
                {/* Posted Date */}
                <small style={{ fontSize: "small" }}>
                  Posted:{" "}
                  {this.props.modal &&
                    new Date(this.props.modal.created).toDateString()}
                </small>
                {/* Seller Image */}
                <div style={{display:"flex", alignItems: "center"}}>
                  <span className="img-wrap-xs mr-1">
                    <img
                      style={{ width: "inherit" }}
                      src={
                        "./Uploads/Profile_Images/" +
                        this.props.modal.seller_image
                      }
                      alt=""
                    ></img>
                  </span>
                  {/* Seller Name */}
                  {this.props.modal && this.props.modal.seller_name}
                </div>
                {/* Deal info */}
                <div>{this.props.modal.units} {this.props.modal.unit_measure} for ${this.props.modal.price.toFixed(2)}</div>
              </div>
            </div>
            <div className="row modal-body">
              <div className="col-6">
                <img
                  src={"./Uploads/Deal_Images/" + this.props.modal.image_url}
                  alt=""
                  style={{ width: "inherit" }}
                ></img>
              </div>
              <div className="col-6 d-flex align-items-center">
                {this.props.modal && this.props.modal.summary}
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "space-evenly" }}
            >
              {this.props.options}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ItemView;