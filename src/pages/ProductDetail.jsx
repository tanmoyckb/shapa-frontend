import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import products from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const p = products.find(x => x.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(p?.sizes[0]);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [toast, setToast] = useState(null);

  if (!p) return <div style={{ padding: '8rem 2rem', textAlign: 'center' }}><h2>Product not found</h2><button className="btn-primary" onClick={() => navigate('/')}>Go Home</button></div>;

  const handleAddToCart = () => {
    addToCart(p, selectedSize, qty);
    setToast(`${p.name} added to cart 🛍`);
  };

  const handleBuyNow = () => {
    addToCart(p, selectedSize, qty);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail">
        {/* Images */}
        <div className="product-detail-images">
          <div className="product-main-img" style={{ background: p.color }}>{p.emoji}</div>
          <div className="product-thumbnails">
            {[p.emoji, p.emoji, p.emoji].map((e, i) => (
              <div key={i} className={`thumb ${i === 0 ? 'active' : ''}`} style={{ background: p.color }}>{e}</div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <p className="detail-category">{p.category}</p>
          <h1 className="detail-name">{p.name}</h1>
          <div className="detail-rating">
            <span className="stars">{'★'.repeat(Math.floor(p.rating))}</span>
            {p.rating} · {p.reviews} reviews
          </div>
          <div>
            <span className="detail-price">${p.price}</span>
            {p.oldPrice && <span className="detail-price-old">${p.oldPrice}</span>}
            {p.oldPrice && <span style={{ color: 'var(--error)', fontSize: '.85rem', marginLeft: '.5rem', fontWeight: 500 }}>Save ${p.oldPrice - p.price}</span>}
          </div>
          <p className="detail-desc">{p.desc}</p>

          <div className="option-label">Size <span>— {selectedSize}</span></div>
          <div className="size-grid">
            {p.sizes.map(s => (
              <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
            ))}
          </div>
          <a href="#" style={{ fontSize: '.75rem', color: 'var(--warm-gray)', letterSpacing: '.1em', textDecoration: 'underline', display: 'block', marginTop: '-.5rem', marginBottom: '1.5rem' }}>Size Guide</a>

          <div className="option-label">Quantity</div>
          <div className="qty-row">
            <div className="qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            {p.badge === 'Sale' && <span style={{ background: 'var(--error)', color: 'white', padding: '.3rem .7rem', fontSize: '.7rem', letterSpacing: '.1em' }}>LIMITED STOCK</span>}
          </div>

          <div className="detail-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>Add to Cart — ${p.price}</button>
            <button className={`btn-wishlist-detail`} onClick={() => { setWishlist(!wishlist); setToast(wishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️'); }}>
              {wishlist ? '❤️' : '🤍'}
            </button>
          </div>
          <button className="btn-primary" style={{ width: '100%', textAlign: 'center', background: 'var(--accent)' }} onClick={handleBuyNow}>Buy Now</button>

          <div style={{ marginTop: '2rem' }}>
            <div className="option-label">Product Details</div>
            <ul className="detail-features">
              {p.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sand)', fontSize: '.78rem', color: 'var(--warm-gray)' }}>
            <span>🚚 Free shipping over $150</span>
            <span>🔄 30-day returns</span>
            <span>🛡 Authentic guarantee</span>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProductDetail;
