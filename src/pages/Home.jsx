import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../api";
import { prettify } from "../utils";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 12;

const SORTS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Top Rated", value: "rating:desc" },
  { label: "Name: A to Z", value: "title:asc" },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // categories load once
  useEffect(() => {
    const ctrl = new AbortController();
    getCategories(ctrl.signal).then(setCategories).catch(() => {});
    return () => ctrl.abort();
  }, []);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch products whenever filters change
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");

    getProducts({ search: debounced, category, sort, page, limit: PAGE_SIZE }, ctrl.signal)
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Could not load products");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [debounced, category, sort, page]);

  const onCategory = (value) => {
    setCategory(value);
    setSearch("");
    setDebounced("");
    setPage(1);
  };

  const onSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="hero">
        <h1>Find something you'll love</h1>
        <p>Browse hundreds of products, add to cart and checkout in seconds.</p>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value) setCategory("");
          }}
        />
        <select value={category} onChange={(e) => onCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{prettify(c)}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </section>

      {error && (
        <div className="state error">
          {error}. Check your internet connection and refresh.
        </div>
      )}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <p className="state">No products found. Try a different search.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Prev
          </button>
          <span className="muted">Page {page} of {totalPages}</span>
          <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </>
  );
}
