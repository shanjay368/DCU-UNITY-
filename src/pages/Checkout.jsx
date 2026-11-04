import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { discounted, money } from "../utils";
import { shippingFor } from "./Cart";

const empty = { name: "", email: "", phone: "", address: "", city: "", pincode: "", payment: "cod" };

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone must be 10 digits";
    if (form.address.trim().length < 5) e.address = "Enter your address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Pincode must be 6 digits";
    return e;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setOrder({
      id: "ORD" + Date.now().toString().slice(-7),
      total,
      count: items.reduce((s, i) => s + i.qty, 0),
      name: form.name,
      payment: form.payment,
    });
    clear();
  };

  if (order) {
    return (
      <div className="state success">
        <div className="tick">✓</div>
        <h2>Order placed successfully!</h2>
        <p>
          Thanks, {order.name}. Your order <strong>{order.id}</strong> ({order.count} items,{" "}
          {money(order.total)}) will be delivered soon.
        </p>
        <p className="muted small">
          Payment: {order.payment === "cod" ? "Cash on delivery" : order.payment.toUpperCase()} • This is a demo store, no real order was made.
        </p>
        <Link to="/" className="btn primary">Continue shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state">
        <h2>Nothing to checkout</h2>
        <Link to="/" className="btn primary">Go to shop</Link>
      </div>
    );
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label>{label}</label>
      <input name={name} value={form[name]} onChange={onChange} {...props} />
      {errors[name] && <span className="err">{errors[name]}</span>}
    </div>
  );

  return (
    <>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="card" onSubmit={onSubmit} noValidate>
          <h3>Delivery details</h3>
          <div className="two">
            {field("name", "Full name")}
            {field("email", "Email", { type: "email" })}
          </div>
          <div className="two">
            {field("phone", "Phone", { inputMode: "numeric", maxLength: 10 })}
            {field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6 })}
          </div>
          {field("address", "Address")}
          {field("city", "City")}

          <h3>Payment</h3>
          <div className="pay">
            {[
              ["cod", "Cash on delivery"],
              ["upi", "UPI"],
              ["card", "Card"],
            ].map(([v, l]) => (
              <label key={v} className={`pay-opt ${form.payment === v ? "active" : ""}`}>
                <input type="radio" name="payment" value={v} checked={form.payment === v} onChange={onChange} />
                {l}
              </label>
            ))}
          </div>

          <button className="btn primary block">Place order • {money(total)}</button>
        </form>

        <aside className="card summary">
          <h3>Your items</h3>
          {items.map((i) => (
            <div key={i.id} className="sum-row small">
              <span>{i.title} × {i.qty}</span>
              <span>{money(discounted(i.price, i.discountPercentage) * i.qty)}</span>
            </div>
          ))}
          <hr />
          <div className="sum-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
          <div className="sum-row total"><span>Total</span><span>{money(total)}</span></div>
        </aside>
      </div>
    </>
  );
}
