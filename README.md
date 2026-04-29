# SHAPA — Frontend (React + Vite)

This is the complete React frontend for SHAPA Fashion Store, converted from the original HTML prototype with the **exact same UI, styles, and functionality**.

## Project Structure

```
src/
├── context/
│   └── CartContext.jsx      # Global cart state
├── components/
│   ├── Navbar.jsx           # Nav + side menu + dropdowns
│   ├── ProductCard.jsx      # Product grid card
│   └── Toast.jsx            # Notification toast
├── pages/
│   ├── Home.jsx             # Hero + categories + products + footer
│   ├── ProductDetail.jsx    # Full product page with size/qty
│   ├── Cart.jsx             # Cart + checkout modal
│   ├── Login.jsx            # Sign in / Sign up / Admin tabs
│   └── Admin.jsx            # Admin dashboard (5 tabs)
├── data/
│   └── products.js          # Product data (replace with API later)
├── App.jsx                  # Routes
├── main.jsx                 # Entry point
└── index.css                # All styles (exact copy from original)
```

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

## Pages / Routes

| Route | Page |
|---|---|
| `/` | Home (Hero, Categories, Products) |
| `/product/:id` | Product Detail |
| `/cart` | Cart + Checkout Modal |
| `/login` | Login / Sign Up / Admin |
| `/admin` | Admin Dashboard |

## Admin Login
- Username: `admin`
- Password: `shapa2025`

## Adding Backend Later (MERN)
When you're ready to connect to the backend:
1. Replace `src/data/products.js` imports with `fetch('/api/products')`
2. Replace login functions with `POST /api/auth/login`
3. Replace cart state with `POST /api/orders` on checkout
4. Add `axios` and an `AuthContext` for JWT token management
