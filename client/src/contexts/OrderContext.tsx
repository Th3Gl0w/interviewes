import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AllOrder, Order, User } from "../utils/Interfaces";
const orderContext = createContext(undefined);

const OrderProvider: FC<AllOrder> = (props: PropsWithChildren<AllOrder>) => {
  const token = localStorage.getItem("token");
  console.log(token);
  const [order, setOrder] = useState<Order>({
    price: 0,
  });
  const [allOrders, setAllOrders] = useState<Array<AllOrder>>();
  const [allUsers, setAllUsers] = useState<Array<User>>();
  const [singleUser, setSingleUser] = useState<User>();
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
    getOrders();
  };
  const getSingleUser = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:4242/users/my_orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSingleUser(data);
    } catch (err) {
      throw new Error(err);
    }
  }, []);
  const getAllUsers = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:4242/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      throw new Error(err);
    }
  }, []);
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

  const getModify = async (id: number): Promise<void> => {
    const requestOptions = {
      method: "PUT",
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
        await fetch(`http://localhost:4242/orders/${id}`, requestOptions)
      ).json();
      setOrder(await data);
    } catch (err) {
      throw new Error(err);
    }
    getOrders();
  };

  const checkExpiration = useCallback(async (): Promise<void> => {
    allOrders &&
      allOrders.map(async (e) => {
        let date: number | string = Date.parse(new Date().toDateString());
        if (date >= Date.parse(e.expirationDate)) {
          try {
            const res = await fetch(`http://localhost:4242/orders/${e.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            console.log(data);
            getOrders();
          } catch (err) {
            throw new Error(err);
          }
        }
      });
  }, []);

  useEffect(() => {
    getOrders();
    getAllUsers();
    getSingleUser();
    checkExpiration();
  }, [getOrders, getAllUsers, getSingleUser, checkExpiration]);
  useEffect(() => {
    getOrders;
    console.log(allOrders);
  });
  return (
    <orderContext.Provider
      value={{
        allOrders,
        token,
        singleUser,
        allUsers,
        order,
        setOrder,
        getAllUsers,
        getSingleUser,
        getOrders,
        checkExpiration,
        getModify,
        addOrder,
      }}
    >
      {props.children}
    </orderContext.Provider>
  );
};
const useOrderContext = () => {
  return useContext(orderContext);
};
export { OrderProvider, useOrderContext };
