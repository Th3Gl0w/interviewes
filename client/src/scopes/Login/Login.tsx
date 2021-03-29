import React, { ChangeEvent, FC, useState } from "react";
import { useHistory } from "react-router";
import { tokenToString } from "typescript";

import "./Login.css";

interface UserProfile {
  username: string;
  password: string;
}

const Login: FC = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<UserProfile>({
    username: "",
    password: "",
  });
  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userInfo.username,
        password: userInfo.password,
      }),
    };
    const response = await fetch("http://localhost:4242/login", requestOptions);
    const data = await response.json();
    console.log(data);
    await localStorage.setItem("token", data.token);
    const token = localStorage.getItem("token");
    history.push(`/trade?token=${token}`);
  };
  console.log(userInfo);
  console.log(localStorage.getItem("token"));
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChanges} />
        <input name="password" onChange={handleChanges} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;
