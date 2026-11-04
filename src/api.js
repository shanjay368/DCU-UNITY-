const BASE = "https://dummyjson.com";

async function request(path, signal) {
  const res = await fetch(BASE + path, { signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export const getCategories = (signal) => request("/products/category-list", signal);

export const getProduct = (id, signal) => request(`/products/${id}`, signal);

// search overrides category (the API cannot combine them)
export function getProducts({ search, category, sort, page, limit }, signal) {
  const params = new URLSearchParams({ limit, skip: (page - 1) * limit });

  if (sort) {
    const [by, order] = sort.split(":");
    params.set("sortBy", by);
    params.set("order", order);
  }

  let path = "/products";
  if (search) {
    path = "/products/search";
    params.set("q", search);
  } else if (category) {
    path = `/products/category/${category}`;
  }

  return request(`${path}?${params}`, signal);
}
