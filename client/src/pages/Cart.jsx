import { useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const Cart = ({ items }) => {
  const stripe = useStripe();
  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (response.ok) {
      const { id } = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: id });
      if (result.error) {
        setCheckoutError(result.error.message);
      }
    }
  }

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
      {checkoutError && <p>{checkoutError}</p>}
    </div>
  );
}

export default Cart;