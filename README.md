<<<<<<< HEAD
# DCU-UNITY-
=======
# ShopEase (React, frontend only)

An e-commerce storefront built with **React (Vite)** and **React Router**. No backend needed: products come from the free public API [dummyjson.com](https://dummyjson.com), and the cart is saved in the browser (localStorage).

## Features

- Product listing with images, price, discount and rating
- Search (debounced), category filter, sorting and pagination
- Product detail page with image gallery, stock info and reviews
- Shopping cart with quantity change, remove, totals and free-shipping rule
- Checkout form with validation and order success screen
- Cart persists after page refresh
- Loading skeletons, error and empty states, mobile responsive

## Project structure

```
shopease/
├── index.html
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx               routes
    ├── api.js                dummyjson API calls
    ├── utils.js              price / text helpers
    ├── styles.css
    ├── context/CartContext.jsx
    ├── components/           Navbar, ProductCard
    └── pages/                Home, ProductDetail, Cart, Checkout
```

## How to run (Windows PowerShell)

Node.js 18+ must be installed (`node -v` to check).

```powershell
cd path\to\shopease
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173

If `npm.cmd` is not needed on your system, plain `npm install` and `npm run dev` also work.

An internet connection is required because products load from dummyjson.com.

## Ideas to extend

- Wishlist page
- Login / signup (fake auth with localStorage)
- Dark mode
- Order history page
- Deploy free on Vercel or Netlify (`npm run build`)
>>>>>>> 91ac258 (Initial commit)
