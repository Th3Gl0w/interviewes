import React, {
  ChangeEvent,
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";

import "./Trade/Trade.css";

import { AllOrder, Order } from "../utils/Interfaces";

const TestComponent: FC = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const [order, setOrder] = useState<Order>({
    price: 0,
  });
  const [allOrders, setAllOrders] = useState<AllOrder>();
  const addOrder = async (): Promise<void> => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        price: order.price,
      }),
    };
    try {
      const data = (
        await fetch("http://localhost:4242/orders/", requestOptions)
      ).json();
      setOrder(await data);
    } catch (err) {
      throw new Error(err);
    }
  };
  const getOrders = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:4242/orders/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setAllOrders(data);
    } catch (err) {
      throw new Error(err);
    }
  }, []);
  useEffect(() => {
    getOrders;
  });
  console.log(allOrders);
  return (
    <div className="Trade">
      <div className="table">
        <div className="control">
          <label htmlFor="price">
            Price
            <input
              type="number"
              name="price"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOrder({ ...order, price: parseFloat(e.target.value) })
              }
            ></input>
          </label>
          <button onClick={addOrder}>{`Ajouter une option d'achat`}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>username</th>
              <th>price</th>
              <th>expiration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Example</td>
              <td>100$</td>
              <td>{new Date().toDateString()}</td>
            </tr>
            <tr>
              <td>Example</td>
              <td>100$</td>
              <td>{new Date().toDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="stats"></div>
    </div>
  );
};

export default TestComponent;
