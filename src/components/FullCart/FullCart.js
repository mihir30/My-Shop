import React, { useEffect, useState } from "react";
import fetchUrls from "../../config/config.json";
import GetAmount from "./GetAmount"; //for total price of products
import "./FullCart.scss";
import { Link } from "react-router-dom";

const Fullcart = () => {
  const [data, fetchData] = useState([]);
  const [producQuantity, qtyChange] = useState(data.quantity);

  const updateCartBackend = (url, method, postData) => {
    fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), // posting or patching the stringified postData
    })
      .then((result) => {
        return result.json();
      })
      .then((resp) => {
        if (method === "GET") {
          fetchData(resp);
        }
        else {
          getProducts();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("Update cart fetch hit.");
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  //fetching the data from api
  const getProducts = () => {
    updateCartBackend(fetchUrls.cartItemsApi, "GET");
  };

  let totalPrice = 0;
  //delete the products
  const deleteProduct = (id) => {
    let postData = { id: id };
    updateCartBackend(`${fetchUrls.cartItemsApi}/${id}`, "DELETE", postData);
  };

  //update the products
  const updateProduct = (data) => {
    data.map((product) => {
      let postData = { quantity: producQuantity };
      updateCartBackend(`${fetchUrls.cartItemsApi}/${product.id}`, "PATCH", postData);
      return <></>;
    });
  };

  return (
    <div className="cart-page">
      <table className="full-cart-table">
        {/* <thead></thead> */}
        <caption className="shopping">Shopping Cart</caption>
        <thead>
          <tr className="full-cart-th">
            {/* for thumbnail image */}
            <th />
            <th>Item(s)</th>
            <th>Price</th>
            <th>Qty</th>
            <th className="total">Total</th>
          </tr>
        </thead>

        <tbody id="fullTableBody">
          {data.map((item, index) => {
            // total price of individual product
            const amount = Number(item.price) * Number(item.quantity);
            // total price of all product
            totalPrice = totalPrice + amount;

            return (
              <tr key={index}>
                <td>
                  <img src={item.thumbnail} alt="not load" />
                </td>
                <td>{item.productName}</td>
                <td
                  className="full-cart-price"
                  id={"fullCartProductPrice" + item.id}
                >
                  {"Rs." + item.price}
                </td>
                <td className="full-cart-qty">
                  <input
                    type="number"
                    className="full-cart-qty-input"
                    id={"fullTotalQuantity" + item.id}
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(event) => qtyChange(event.target.value)}
                  />
                </td>

                <td className="full-amount" id={"fullProductAmount" + item.id}>
                  Rs. {amount}
                </td>
                <td>
                  <button
                    className="full-remove-button"
                    id={"fullRemoveBtn" + item.id}
                    onClick={deleteProduct.bind(this, item.id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tbody>
          <tr className="full-cart-subtotal">
            <td colSpan={6} className="full-cart-sub">
              <GetAmount price={totalPrice} />
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button
          type="button"
          className="update"
          id="update"
          onClick={updateProduct.bind(this, data)}
        >
          Update
        </button>
        <Link to="/checkout/addresscheckout" className="btn">
          Checkout
        </Link>
      </div>

      <div className="total-price">
        <Link to="/checkout/addresscheckout" className="btn">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default Fullcart;