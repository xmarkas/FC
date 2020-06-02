import React from "react";

function CatalogActions(token, userClans, userId, deal) {
  let state = {
    groupSelected: undefined,
  };

  let addToGroup = (list) => {
    let request = {
      addType: list === "mylist" ? "mylist" : "clan",
      userId: userId,
      clanId: list === "mylist" ? null : list,
      dealId: deal.id,
      sellerId: deal.user_id,
    };
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
    fetch("/accounts/addDealTo", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          console.log(res);
        } else {
          console.log("Unable to retrieve data");
        }
      });
  };

  return (
    <React.Fragment>
      <div className="col">
        <div class="dropdown dropleft">
          <button
            class="btn btn-sm btn-light dropdown-toggle"
            style={{
              backgroundColor: "#5a9026",
              fontSize: "inherit",
              color: "white",
              fontWeight: "600",
            }}
            type="fc"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div className="btn-fc"></div>
            Add To...
          </button>
          <div
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
            style={{
              backgroundColor: "#346802",
              color: "white",
              boxShadow: "0px 0px 11px 3px rgba(0, 0, 0, 0.2)",
              fontSize: "small",
            }}
          >
            <div
              className="p-2"
              style={{ cursor: "pointer" }}
              onClick={() => addToGroup("mylist")}
            >
              Wish List
            </div>
            {userClans.map((c) => {
              return (
                <div
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  list-value={c.id}
                  onClick={(ev) => {
                    addToGroup(ev.target.getAttribute("list-value"));
                  }}
                >
                  {c.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function GroupPageActions(token, userId, clanId, deal, update) {
  let state = {
    order_quantity: update ? update.purchase_units : 0,
  };

  let placeOrder = () => {
    let request = {
      userId: userId,
      clanId: clanId,
      dealId: deal.id,
      sellerId: deal.user_id,
      purchaseUnits: state.order_quantity,
      unitPrice: deal.price,
      units: deal.units,
    };
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
    fetch("/accounts/groupPurchase", options)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.success) {
          // Return to account detail and display error message
          console.log(res);
        } else {
          console.log("Unable to retrieve data");
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
      }}
    >
      <div
        className="form-group"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          margin: "0",
        }}
      >
        <label style={{ marginRight: "5px" }}>Quantity in pounds</label>
        <input
          defaultValue={update ? update.purchase_units : 0}
          onChange={(ev) => (state.order_quantity = ev.target.value)}
          style={{ margin: "0", width: "75px" }}
          type="number"
          className="form-control"
          id="quantity"
          aria-describedby="emailHelp"
        ></input>
      </div>
      {!update ? (
        <button type="fc" className="btn btn-light" onClick={placeOrder}>
          <div className="btn-fc"></div>Place my order
        </button>
      ) : (
        <button type="fc" className="btn btn-light">
          <div className="btn-fc"></div>Update my order
        </button>
      )}
    </div>
  );
}

export { CatalogActions, GroupPageActions };
