/* eslint-disable no-unused-vars */
import React from "react";
import useAuth from "./useAuth";

export default function Logout() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
}