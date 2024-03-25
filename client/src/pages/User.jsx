import { useState, useEffect } from "react";

export default function User() {
    const [accountInfo, setAccountInfo] = useState(null);
    const [orders, setOrders] = useState(null);

  
    useEffect(() => {
        fetch('/api/account/userId')
          .then(response => response.json())
          .then(data => setAccountInfo(data));
    
        fetch('/api/account/orders/userId')
          .then(response => response.json())
          .then(data => setOrders(data));
      }, []);
    
      return (
        <div>
          <h1>Account Information</h1>
          {accountInfo && (
            <div>
              <p>Username: {accountInfo.username}</p>
              <p>Email: {accountInfo.email}</p>         
            </div>
          )}
    
          <h1>Orders</h1>
          {orders && orders.map(order => (
            <div key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Product: {order.product}</p>
                <p>Price: {order.price}</p>
                <p>Quantity: {order.quantity}</p>
            </div>
          ))}
        </div>
      );
    }