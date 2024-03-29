import { Link } from "react-router-dom";
import useAuth from "./useAuth";

export default function  Nav() {
    const { user } = useAuth();
  
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/user">User</Link>
              </li>
              <div className="nav-right">
                <li>
                  <Link to="/logout">Logout</Link>
                </li>
              </div>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    );
  }