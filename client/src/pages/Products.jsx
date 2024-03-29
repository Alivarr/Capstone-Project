//products page
import { useState, useEffect } from 'react';

const Products = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        async function getProducts() {
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            setProducts(data);
        }
        getProducts();
    }
    , []);

    async function addToCart(productId) {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });
        if (!response.ok) {
            return alert('Failed to add to cart');
        }
        alert('Added to cart');
    }


    return (
        <div>
            <h2>Products</h2>
            {products.map((product) => (
                <div key={product.id} style={{border: '1px solid', margin: '10px', padding: '10px'}}>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                    <p>{product.description}</p>
                    <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
}

export default Products;