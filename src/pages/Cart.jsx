import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { discounted, money } from "../utils";

export const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= 100 ? 0 : 5);

export default function Cart() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="state">
        <h2>Your cart is empty</h2>
        <p className="muted">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn primary">Start shopping</Link>
      </div>
    );
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <>
      <div className="page-head">
        <h1>Shopping cart</h1>
        <button className="link danger" onClick={clear}>Clear cart</button>
      </div>

      <div className="cart-layout">
        <div className="card">
          {items.map((i) => (
            <div key={i.id} className="cart-item">
              <img src={i.thumbnail} alt={i.title} />
              <div className="cart-info">
                <Link to={`/product/${i.id}`} className="title">{i.title}</Link>
                <span className="muted small">
                  {money(discounted(i.price, i.discountPercentage))} each
                </span>
                <button className="link danger" onClick={() => removeItem(i.id)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
              </div>
              <strong className="line-total">
                {money(discounted(i.price, i.discountPercentage) * i.qty)}
              </strong>
            </div>
          ))}
        </div>

        <aside className="card summary">
          <h3>Order summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="sum-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="muted small">Add {money(100 - subtotal)} more for free shipping.</p>
          )}
          <hr />
          <div className="sum-row total"><span>Total</span><span>{money(total)}</span></div>
          <Link to="/checkout" className="btn primary block">Proceed to checkout</Link>
        </aside>
      </div>
    </>
  );
}
