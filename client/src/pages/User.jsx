import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const User = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch('http://localhost:3000/account/userId', {
        headers: {
          Authorization: token
        }
      });
      const data = await response.json();
      setUserData(data);
    }

    async function fetchOrders() {
      const response = await fetch('http://localhost:3000/account/orders/userId', {
        headers: {
          Authorization: token
        }
      });
      const data = await response.json();
      setOrders(data);
    }

    async function fetchReviews() {
      const response = await fetch('http://localhost:3000/account/reviews/userId', {
        headers: {
          Authorization: token
        }
      });
      const data = await response.json();
      setReviews(data);
    }

    fetchUserData();
    fetchOrders();
    fetchReviews();
  }, [token]);

  return (
    <div>
      <h2>User Data</h2>
      {userData && (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}

      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Product: {order.product}</p>
          <p>Price: {order.price}</p>
          <p>Quantity: {order.quantity}</p>
        </div>
      ))}

      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id}>
          <p>Review ID: {review.id}</p>
          <p>Product: {review.product}</p>
          <p>Rating: {review.rating}</p>
          <p>Comment: {review.comment}</p>
        </div>
      ))}

      <Link to="/cart">Go to Cart</Link>
    </div>
  );
};

export default User;