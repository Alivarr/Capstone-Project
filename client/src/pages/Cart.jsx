export default function Cart() {
    return (
        <div>
        <h1>Cart</h1>
        <form>
            <input type="text" placeholder="Product Name" />
            <input type="text" placeholder="Product Description" />
            <input type="text" placeholder="Product Price" />
            <button type="submit">Add Product</button>
        </form>
        </div>
    );
    }