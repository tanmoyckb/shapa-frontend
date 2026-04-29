import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
    setToast(`${product.name} added to cart 🛍`);
  };

  return (
    <>
      <div className="product-card" onClick={() => navigate(`/product/${product._id || product.id}`)}>
        <div className="product-img">
          <div className="product-img-bg" style={{ background: product.color }}>
            {product.emoji}
          </div>
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <button
            className={`wishlist-btn ${wishlist ? 'active' : ''}`}
            onClick={e => {
              e.stopPropagation();
              setWishlist(!wishlist);
              setToast(wishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
            }}
          >
            {wishlist ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-row">
            <span className="product-price">${product.price}</span>
            {product.oldPrice && <span className="product-price-old">${product.oldPrice}</span>}
          </div>
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating || 4))}</span>
            {product.rating} · {product.reviews} reviews
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
};

export default ProductCard;
