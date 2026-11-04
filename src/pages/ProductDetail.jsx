import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api";
import { useCart } from "../context/CartContext";
import { discounted, money, prettify } from "../utils";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    setQty(1);

    getProduct(id, ctrl.signal)
      .then((p) => {
        setProduct(p);
        setImage(p.images?.[0] || p.thumbnail);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError("Product not found or could not be loaded.");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [id]);

  if (loading) return <p className="state">Loading product...</p>;
  if (error || !product) {
    return (
      <div className="state">
        <p>{error || "Product not found."}</p>
        <Link to="/" className="btn">← Back to shop</Link>
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;
  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <Link to="/" className="back">← Back to shop</Link>

      <div className="detail">
        <div className="gallery">
          <div className="card main-img">
            <img src={image} alt={product.title} />
          </div>
          <div className="thumbs">
            {(product.images || []).map((src) => (
              <button
                key={src}
                className={`thumb ${src === image ? "active" : ""}`}
                onClick={() => setImage(src)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="info">
          <span className="muted small">
            {prettify(product.category)}{product.brand ? ` • ${product.brand}` : ""}
          </span>
          <h1>{product.title}</h1>
          <span className="rating">★ {product.rating.toFixed(1)}</span>

          <div className="price-row big">
            <strong>{money(discounted(product.price, product.discountPercentage))}</strong>
            {hasDiscount && (
              <>
                <s className="muted">{money(product.price)}</s>
                <span className="tag inline">-{Math.round(product.discountPercentage)}%</span>
              </>
            )}
          </div>

          <p>{product.description}</p>

          <p className={product.stock > 0 ? "ok" : "danger"}>
            {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
          </p>

          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn primary" disabled={product.stock === 0} onClick={handleAdd}>
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>

          {product.shippingInformation && <p className="muted small">🚚 {product.shippingInformation}</p>}
          {product.returnPolicy && <p className="muted small">↩️ {product.returnPolicy}</p>}
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <section className="reviews">
          <h2>Customer reviews</h2>
          {product.reviews.map((r, i) => (
            <div key={i} className="card review">
              <div className="review-head">
                <strong>{r.reviewerName}</strong>
                <span className="rating">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
