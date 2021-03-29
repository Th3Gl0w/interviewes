import { formatWithCursor } from "prettier";
import React, {
  ChangeEvent,
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Bar } from "react-chartjs-2";
import "./Trade.css";
import modif from "../../assets/modif.svg";
import deletesvg from "../../assets/deletesvg.svg";
import { useOrderContext } from "../../contexts/OrderContext";
const Trade: FC = () => {
  const [isModified, setIsModified] = useState<boolean>(false);
  const {
    allOrders,
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
    deleteOrder,
  } = useOrderContext();

  useEffect(() => {
    getOrders();
    getAllUsers();
    getSingleUser();
    checkExpiration();
  }, [getOrders, getAllUsers, getSingleUser, checkExpiration]);
  let average: number;
  console.log(allOrders);
  console.log(allUsers);
  if (allOrders) {
    const prices: number[] = allOrders.map((e) => e.price);
    if (prices) {
      average = prices.reduce(
        (a: number, b: number) => (a + b) / prices.length
      );
    }
  }

  //Add all user orders
  let priceUser;
  if (allUsers) {
    priceUser = allUsers.map((e, i) => {
      const sum = e.orders.map((e) => e.price);
      if (sum && sum.length > 1) {
        return {
          username: e.username,
          allOrdersPrices: sum.reduce((a: number, b: number) => a + b),
        };
      } else if (sum.length === 0) {
        return {
          username: e.username,
          allOrdersPrices: 0,
        };
      } else {
        return {
          username: e.username,
          allOrdersPrices: sum[0],
        };
      }
    });

    // const sumPrices = priceUser.reduce((a: number, b: number) => a + b);
  }

  const topPrice =
    priceUser &&
    Math.max.apply(
      Math,
      priceUser.map((e) => e.allOrdersPrices)
    );
  const topUser =
    priceUser && priceUser.filter((f) => f.allOrdersPrices === topPrice);
  const bestBuyerList =
    priceUser &&
    priceUser.sort((a, b) => b.allOrdersPrices - a.allOrdersPrices);

  console.log(bestBuyerList);

  const dateArr = [];
  allOrders &&
    allOrders.map((e) => {
      if (!dateArr.includes(e.expirationDate)) {
        dateArr.push(e.expirationDate);
      }
    });
  const totalPriceByDate = dateArr.map((e) => {
    const filterDate = allOrders.filter((f) => f.expirationDate === e);
    const sum = filterDate.map((e) => e.price);
    return {
      e,
      sumAllOrdersByDate: sum.reduce((a: number, b: number) => a + b),
    };
  });
  console.log(totalPriceByDate);
  const listOrders =
    allOrders && singleUser
      ? allOrders.map((element, index) => {
          if (singleUser.id === element.userId) {
            return (
              <tr key={index}>
                <td>{element.user.username}</td>
                <td>{element.price}$</td>
                <td>{element.expirationDate}</td>
                {!isModified ? (
                  <td className="modif_button">
                    <button onClick={() => setIsModified(!isModified)}>
                      <img src={modif} alt="modif" />
                    </button>
                    <button onClick={() => deleteOrder(element.id)}>
                      <img src={deletesvg} alt="delete" />
                    </button>
                  </td>
                ) : (
                  <td></td>
                )}
                {isModified ? (
                  <td>
                    <input
                      type="number"
                      name="price"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setOrder({
                          ...order,
                          [e.target.name]: parseFloat(e.target.value),
                        })
                      }
                    />
                    <button
                      onClick={() => {
                        getModify(element.id), setIsModified(!isModified);
                      }}
                    >
                      Add changes
                    </button>
                    <button onClick={() => setIsModified(!isModified)}>
                      Cancel
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          } else {
            return (
              <tr key={index}>
                <td>{element.user.username}</td>
                <td>{element.price}$</td>
                <td>{element.expirationDate}</td>
              </tr>
            );
          }
        })
      : null;
  const dataUser = bestBuyerList && bestBuyerList.map((e) => e.username);
  const dataAmout =
    bestBuyerList && bestBuyerList.map((e) => e.allOrdersPrices);
  console.log(dataUser);
  //TODO
  //push all orders date in a new array with includes*
  //filter orders by date then sum all the prices*
  //check date every time the app render then compare to the expiration if newDate >= expiration: call Api Delete function*
  //if the user.id and userId is the same then display delete and modify button, click on modifiy will display a new input by updating a state*

  console.log(average);

  console.log(singleUser);
  return (
    <div className="Trade">
      <div className="table">
        <div className="control">
          <label htmlFor="price">
            Price : {"  "}
            <input
              type="number"
              name="price"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOrder({ ...order, price: parseFloat(e.target.value) })
              }
            ></input>
          </label>
          <button onClick={addOrder}>{`Add order`}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>username</th>
              <th>price</th>
              <th>expiration</th>
            </tr>
          </thead>
          <tbody>{listOrders && listOrders}</tbody>
        </table>
      </div>
      <div className="stats">
        <div>Average : {average}</div>
        <div>
          Top User : {topUser && topUser[0].username} with{" "}
          {topUser && topUser[0].allOrdersPrices}$
        </div>
        <div>
          User Ranking :{" "}
          {bestBuyerList &&
            bestBuyerList.map((e, i) => (
              <div key={i}>
                <ul>
                  <li>
                    n°{i + 1} {e.username}
                  </li>
                </ul>
              </div>
            ))}
        </div>
        <div>
          all orders amount by date :{" "}
          {totalPriceByDate &&
            totalPriceByDate.map((e, i) => (
              <div key={i}>
                {e.e} : {e.sumAllOrdersByDate}$
              </div>
            ))}
        </div>
        <Bar
          data={{
            labels: dataUser,
            datasets: [
              {
                label: "Amount",
                data: dataAmout,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Trade;
