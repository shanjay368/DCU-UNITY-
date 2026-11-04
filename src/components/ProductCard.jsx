import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { discounted, money, prettify } from "../utils";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="card product-card">
      <Link to={`/product/${product.id}`} className="img-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {hasDiscount && <span className="tag">-{Math.round(product.discountPercentage)}%</span>}
      </Link>

      <div className="card-body">
        <span className="muted small">{prettify(product.category)}</span>
        <Link to={`/product/${product.id}`} className="title">{product.title}</Link>
        <span className="rating">★ {product.rating.toFixed(1)}</span>

        <div className="price-row">
          <strong>{money(discounted(product.price, product.discountPercentage))}</strong>
          {hasDiscount && <s className="muted small">{money(product.price)}</s>}
        </div>

        <button className="btn primary" onClick={() => addItem(product)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
