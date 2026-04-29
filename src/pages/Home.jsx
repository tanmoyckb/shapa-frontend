import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import api from '../api';
import localProducts from '../data/products';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then(data => setProducts(data.products || data))
      .catch(() => setProducts(localProducts))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) { el.target.classList.add('visible'); observer.unobserve(el.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const handleSearch = useCallback((query, category) => {
    setSearchQuery(query || '');
    if (category !== undefined) setSearchCategory(category);
  }, []);

  const filtered = (() => {
    let list = products;
    const cat = searchCategory || activeFilter;
    if (cat && cat !== 'All') {
      list = list.filter(p => p.category === cat || (cat === 'Sale' && p.badge === 'Sale'));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  })();

  const handleAddToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'One Size');
    setToast(`${product.name} added to cart 🛍`);
  };

  const filterProducts = (cat) => {
    setActiveFilter(cat);
    setSearchCategory(null);
  };

  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <Navbar onSearch={handleSearch} />

      <div className="hero">
        <div className="hero-left">
          <div className="hero-content fade-in">
            <p className="hero-tag">New Collection 2025</p>
            <h1 className="hero-title">Where Style<br />Meets <em>Soul</em></h1>
            <p className="hero-desc">Discover clothing that tells your story. Thoughtfully crafted pieces for the modern wardrobe.</p>
            <button className="btn-primary" onClick={scrollToProducts}>Explore Collection</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-placeholder">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M40 10 C30 10 20 20 20 35 L20 70 L60 70 L60 35 C60 20 50 10 40 10Z" stroke="#8A8078" strokeWidth="1.5" fill="none" />
              <path d="M20 35 L5 30 L10 50 L20 50" stroke="#8A8078" strokeWidth="1.5" fill="none" />
              <path d="M60 35 L75 30 L70 50 L60 50" stroke="#8A8078" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="hero-image-label">SHAPA 2025</span>
          </div>
        </div>
      </div>

      <section className="categories">
        <div className="section-header reveal">
          <p className="section-tag">Browse by Category</p>
          <h2 className="section-title">Shop the Collection</h2>
        </div>
        <div className="cat-grid">
          {[
            { name: 'Women',       sub: 'Explore',        bg: 'linear-gradient(135deg,#c5b09a,#8A8078)', emoji: '👗' },
            { name: 'Men',         sub: 'Explore',        bg: 'linear-gradient(135deg,#6b7280,#374151)', emoji: '🧥' },
            { name: 'Accessories', sub: 'Explore',        bg: 'linear-gradient(135deg,#d4a373,#a07c45)', emoji: '👜' },
            { name: 'Sale',        sub: 'Up to 50% off',  bg: 'linear-gradient(135deg,#9b2226,#6a0707)', emoji: '🏷️' },
          ].map((cat, i) => (
            <div
              key={cat.name}
              className={`cat-card reveal reveal-delay-${i + 1}`}
              onClick={() => { filterProducts(cat.name); scrollToProducts(); }}
            >
              <div className="cat-card-bg" style={{ background: cat.bg }}>
                <div className="cat-card-overlay" />
                <div style={{ fontSize: '5rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', opacity: .3 }}>
                  {cat.emoji}
                </div>
              </div>
              <div className="cat-card-label">
                <span className="cat-card-sub">{cat.sub}</span>
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-header reveal">
          <p className="section-tag">Curated for You</p>
          <h2 className="section-title">Featured Pieces</h2>
        </div>
        <div className="filter-bar">
          {['All', 'Women', 'Men', 'Accessories', 'Sale'].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat && !searchCategory ? 'active' : ''}`}
              onClick={() => filterProducts(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--warm-gray)' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--warm-gray)' }}>
            <p style={{ fontSize: '3rem' }}>🔍</p>
            <p>No products found</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <ProductCard key={p._id || p.id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      <div className="promo-banner">
        <p className="section-tag">Limited Time</p>
        <h2 className="section-title" style={{ color: 'var(--cream)' }}>Get 20% Off<br />Your First Order</h2>
        <p className="promo-desc">Join the Shapa community and unlock exclusive member benefits, early access to new arrivals, and personalised style recommendations.</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Join Shapa</button>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">SHAPA</div>
            <p className="footer-desc">A curated fashion destination for those who believe clothing is more than fabric — it&apos;s expression, identity, and art.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <a href="#">Women</a><a href="#">Men</a><a href="#">Accessories</a><a href="#">New Arrivals</a><a href="#">Sale</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a><a href="#">Sustainability</a><a href="#">Careers</a><a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Contact Us</a><a href="#">Size Guide</a><a href="#">Returns</a><a href="#">Shipping Info</a><a href="#">FAQ</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Shapa. All rights reserved. · Privacy Policy · Terms of Service</p>
        </div>
      </footer>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;
