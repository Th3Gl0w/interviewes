import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AllOrder } from "../utils/Interfaces";
const orderContext = createContext(undefined);

const OrderProvider: FC<AllOrder> = (props: PropsWithChildren<AllOrder>) => {
  const token = localStorage.getItem("token");
  console.log(token);
  const [allOrders, setAllOrders] = useState<AllOrder>();
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
    console.log(allOrders);
  });
  return (
    <orderContext.Provider value={{ allOrders, token }}>
      {props.children}
    </orderContext.Provider>
  );
};
const useOrderContext = () => {
  return useContext(orderContext);
};
export { OrderProvider, useOrderContext };
