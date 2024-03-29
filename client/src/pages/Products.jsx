/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    // Add product to cart logic here
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product.product_id}>
          <h2>{product.product_name}</h2>
          <p>{product.description}</p>
            <p>{product.price}</p>
            <img src={product.imageUrl} alt={product.product_name} />
          <button onClick={() => handleAddToCart(product.product_id)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default Products;