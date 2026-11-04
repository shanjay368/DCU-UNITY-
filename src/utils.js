export const money = (n) => "$" + Number(n).toFixed(2);

export const prettify = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const discounted = (price, pct) => price * (1 - (pct || 0) / 100);
