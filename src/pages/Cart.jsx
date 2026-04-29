import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import api from '../api';

const Cart = () => {
  const { cart, removeFromCart, updateQty, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [payTab, setPayTab] = useState('card');
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [orderDone, setOrderDone] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const [shipping_, setShipping_] = useState({ firstName:'', lastName:'', email:'', address:'', city:'', postCode:'', country:'United States' });

  const shipping = subtotal * (1 - promoDiscount) >= 150 ? 0 : 12;
  const tax = subtotal * (1 - promoDiscount) * 0.08;
  const total = subtotal * (1 - promoDiscount) + shipping + tax;

  const handleApplyPromo = async () => {
    try {
      const data = await api.post('/orders/validate-promo', { code: promoInput });
      setPromoDiscount(data.discount);
      setToast(data.message);
    } catch (err) {
      setToast({ msg: err.message, type: 'error' });
    }
  };

  const handleCheckout = () => {
    if (!cart.length) return;
    setModalOpen(true); setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(item => ({ product: item._id || item.id, id: item._id || item.id, size: item.size, qty: item.qty }));
      const order = await api.post('/orders', { items, shipping: shipping_, paymentMethod: payTab, promoCode: promoInput || undefined });
      setOrderNum(order.orderNumber);
      setStep(3);
      setTimeout(() => { setModalOpen(false); setOrderDone(true); clearCart(); }, 800);
    } catch (err) {
      setToast({ msg: err.message || 'Order failed. Please try again.', type: 'error' });
    } finally { setLoading(false); }
  };

  if (orderDone) return (
    <div className="cart-page">
      <Navbar />
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'3rem 2rem' }}>
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <div className="order-number">Order #{orderNum}</div>
          <p>Thank you for your purchase. Your order is being prepared with care.</p>
          <p style={{ fontSize:'.85rem', color:'var(--warm-gray)', marginBottom:'2rem' }}>A confirmation email has been sent to your inbox.</p>
          <button className="btn-primary" onClick={() => { setOrderDone(false); navigate('/'); }}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-layout">
        <div>
          <h2 className="cart-title">
            Shopping Cart {cart.length > 0 && <span style={{color:'var(--warm-gray)',fontSize:'1.2rem',fontWeight:300}}>({cart.reduce((s,i)=>s+i.qty,0)} items)</span>}
          </h2>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛍</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={`${item._id||item.id}-${item.size}`}>
                <div className="cart-item-img" style={{background:item.color}}>{item.emoji}</div>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">Size: {item.size}</div>
                  <div className="qty-ctrl" style={{marginTop:'.5rem'}}>
                    <button style={{width:32,height:32}} onClick={()=>updateQty(item._id||item.id,item.size,item.qty-1)}>−</button>
                    <span style={{width:40,height:32}}>{item.qty}</span>
                    <button style={{width:32,height:32}} onClick={()=>updateQty(item._id||item.id,item.size,item.qty+1)}>+</button>
                  </div>
                  <button className="cart-remove" onClick={()=>removeFromCart(item._id||item.id,item.size)}>Remove</button>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">${(item.price*item.qty).toFixed(2)}</div>
                  <div style={{fontSize:'.78rem',color:'var(--warm-gray)',marginTop:'.3rem'}}>${item.price} each</div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row"><span className="label">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {promoDiscount > 0 && <div className="summary-row"><span className="label" style={{color:'var(--success)'}}>Discount</span><span style={{color:'var(--success)'}}>−${(subtotal*promoDiscount).toFixed(2)}</span></div>}
            <div className="summary-row"><span className="label">Shipping</span><span>{shipping===0?<span style={{color:'var(--success)'}}>Free</span>:`$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span className="label">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="promo-input">
              <input type="text" placeholder="Promo code" value={promoInput} onChange={e=>setPromoInput(e.target.value.toUpperCase())} />
              <button onClick={handleApplyPromo}>Apply</button>
            </div>
            <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button className="btn-primary" style={{width:'100%',textAlign:'center',marginTop:'1.5rem',padding:'1rem'}} onClick={handleCheckout}>Proceed to Checkout</button>
            <button className="btn-secondary" style={{width:'100%',textAlign:'center',marginTop:'.8rem',padding:'.8rem'}} onClick={()=>navigate('/')}>Continue Shopping</button>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      <div className={`modal-overlay ${modalOpen?'open':''}`}>
        <div className="modal">
          <button className="modal-close" onClick={()=>setModalOpen(false)}>✕</button>
          {step < 3 ? (
            <>
              <h2 className="modal-title">Checkout</h2>
              <div className="step-indicator">
                <div className={`step ${step>=1?'done':''}`} />
                <div className={`step ${step>=2?'done':''}`} />
                <div className={`step ${step>=3?'done':''}`} />
              </div>

              {step===1 && (
                <>
                  <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.2rem',fontWeight:300,marginBottom:'1.2rem'}}>Shipping Details</h3>
                  <div className="form-row">
                    <div className="form-group"><label>First Name</label><input type="text" placeholder="Jane" value={shipping_.firstName} onChange={e=>setShipping_({...shipping_,firstName:e.target.value})} /></div>
                    <div className="form-group"><label>Last Name</label><input type="text" placeholder="Doe" value={shipping_.lastName} onChange={e=>setShipping_({...shipping_,lastName:e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label>Email</label><input type="email" placeholder="your@email.com" value={shipping_.email} onChange={e=>setShipping_({...shipping_,email:e.target.value})} /></div>
                  <div className="form-group"><label>Address</label><input type="text" placeholder="123 Main St" value={shipping_.address} onChange={e=>setShipping_({...shipping_,address:e.target.value})} /></div>
                  <div className="form-row">
                    <div className="form-group"><label>City</label><input type="text" placeholder="New York" value={shipping_.city} onChange={e=>setShipping_({...shipping_,city:e.target.value})} /></div>
                    <div className="form-group"><label>Post Code</label><input type="text" placeholder="10001" value={shipping_.postCode} onChange={e=>setShipping_({...shipping_,postCode:e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label>Country</label>
                    <select value={shipping_.country} onChange={e=>setShipping_({...shipping_,country:e.target.value})}>
                      <option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{width:'100%',textAlign:'center',marginTop:'.5rem'}} onClick={()=>setStep(2)}>Continue to Payment →</button>
                </>
              )}

              {step===2 && (
                <>
                  <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.2rem',fontWeight:300,marginBottom:'1.2rem'}}>Payment</h3>
                  <div className="payment-tabs">
                    {['card','paypal','apple'].map(t=>(
                      <button key={t} className={`pay-tab ${payTab===t?'active':''}`} onClick={()=>setPayTab(t)}>
                        {t==='card'?'💳 Card':t==='paypal'?'🅿️ PayPal':'🍎 Apple Pay'}
                      </button>
                    ))}
                  </div>
                  {payTab==='card' && (
                    <div className="payment-form active">
                      <div className="form-group"><label>Card Number</label><input type="text" placeholder="4242 4242 4242 4242" /></div>
                      <div className="form-row">
                        <div className="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" /></div>
                        <div className="form-group"><label>CVV</label><input type="text" placeholder="•••" /></div>
                      </div>
                      <div className="form-group"><label>Name on Card</label><input type="text" placeholder="Jane Doe" /></div>
                    </div>
                  )}
                  {payTab!=='card' && (
                    <div style={{textAlign:'center',padding:'2rem',color:'var(--warm-gray)',background:'var(--cream)',borderRadius:2}}>
                      <p style={{fontSize:'2rem',marginBottom:'.5rem'}}>{payTab==='paypal'?'🅿️':'🍎'}</p>
                      <p>You'll be redirected to complete payment.</p>
                    </div>
                  )}
                  <div style={{background:'var(--cream)',padding:'1rem',borderRadius:2,margin:'1rem 0',fontSize:'.85rem',display:'flex',justifyContent:'space-between',fontWeight:500}}>
                    <span>Total Due:</span><span>${total.toFixed(2)}</span>
                  </div>
                  <button className="btn-primary" style={{width:'100%',textAlign:'center'}} onClick={handlePlaceOrder} disabled={loading}>
                    {loading?'Placing order…':`Place Order — $${total.toFixed(2)}`}
                  </button>
                  <button onClick={()=>setStep(1)} style={{background:'none',border:'none',color:'var(--warm-gray)',cursor:'pointer',fontSize:'.8rem',marginTop:'.8rem',display:'block'}}>← Back to Shipping</button>
                </>
              )}
            </>
          ) : (
            <div style={{textAlign:'center',padding:'2rem 0'}}>
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
              <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.4rem'}}>Processing your order...</p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={typeof toast==='string'?toast:toast.msg} type={toast?.type||'success'} onClose={()=>setToast(null)} />}
    </div>
  );
};

export default Cart;
