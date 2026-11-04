import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">🛍️ ShopEase</Link>
        <nav className="nav-links">
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart
            {count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
