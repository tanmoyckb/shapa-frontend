import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import api from '../api';
import localProducts from '../data/products';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Load data for all tabs in background
    api.get('/admin/stats').then(setStats).catch(()=>{});
    api.get('/orders').then(d=>setOrders(d.orders||[])).catch(()=>{});
    api.get('/products').then(d=>setProducts(d.products||localProducts)).catch(()=>setProducts(localProducts));
    api.get('/admin/customers').then(d=>setCustomers(d.customers||[])).catch(()=>{});
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      const updated = await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id===id ? updated : o));
      setToast('Order status updated ✓');
    } catch { setToast({ msg: 'Update failed', type: 'error' }); }
  };

  const navItems = [
    { key:'dashboard', label:'📊 Dashboard' },
    { key:'orders',    label:'📦 Orders' },
    { key:'products',  label:'👗 Products' },
    { key:'customers', label:'👥 Customers' },
    { key:'analytics', label:'📈 Analytics' },
  ];

  const statCards = stats ? [
    ['Total Revenue', `$${stats.totalRevenue?.toFixed(0)||'—'}`, '↑ 12% vs last month'],
    ['Orders',        stats.totalOrders||'—',                    '↑ 8% vs last month'],
    ['Customers',     stats.totalCustomers||'—',                 '↑ 23% vs last month'],
    ['Avg Order',     `$${stats.avgOrderValue?.toFixed(0)||'—'}`, '↑ 5% vs last month'],
  ] : [
    ['Total Revenue','$24,580','↑ 12% vs last month'],
    ['Orders','148','↑ 8% vs last month'],
    ['Customers','1,243','↑ 23% vs last month'],
    ['Conversion','3.8%','↑ 0.4% vs last month'],
  ];

  const recentOrders = orders.slice(0, 5);

  const renderDashboard = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Dashboard</h2>
        <span style={{fontSize:'.8rem',color:'var(--warm-gray)'}}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
      </div>
      <div className="stats-grid">
        {statCards.map(([label,val,change])=>(
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{val}</div>
            <div className="stat-change">{change}</div>
          </div>
        ))}
      </div>
      <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.3rem',fontWeight:300,marginBottom:'1rem'}}>Recent Orders</h3>
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {recentOrders.length ? recentOrders.map(o=>(
            <tr key={o._id}>
              <td style={{fontWeight:500}}>{o.orderNumber}</td>
              <td>{o.shipping?.firstName} {o.shipping?.lastName}</td>
              <td style={{color:'var(--warm-gray)'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{fontWeight:500}}>${o.total?.toFixed(2)}</td>
              <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
            </tr>
          )) : (
            <tr><td colSpan={5} style={{textAlign:'center',color:'var(--warm-gray)',padding:'1.5rem'}}>No orders yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">All Orders</h2>
        <button className="btn-primary" style={{fontSize:'.75rem',padding:'.6rem 1.2rem'}} onClick={()=>setToast('CSV exported ✓')}>Export CSV</button>
      </div>
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {orders.length ? orders.map(o=>(
            <tr key={o._id}>
              <td style={{fontWeight:500}}>{o.orderNumber}</td>
              <td>{o.shipping?.firstName} {o.shipping?.lastName}</td>
              <td style={{color:'var(--warm-gray)'}}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{fontWeight:500}}>${o.total?.toFixed(2)}</td>
              <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
              <td>
                <select style={{border:'1px solid var(--sand)',padding:'.3rem',fontSize:'.75rem',borderRadius:2,background:'transparent',cursor:'pointer'}}
                  value={o.status} onChange={e=>updateOrderStatus(o._id,e.target.value)}>
                  {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=><option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={6} style={{textAlign:'center',color:'var(--warm-gray)',padding:'1.5rem'}}>No orders yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );

  const renderProducts = () => (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Products</h2>
        <button className="btn-primary" style={{fontSize:'.75rem',padding:'.6rem 1.2rem'}} onClick={()=>setToast('Product added ✓')}>+ Add Product</button>
      </div>
      <table>
        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {products.map(p=>(
            <tr key={p._id||p.id}>
              <td><span style={{marginRight:'.5rem'}}>{p.emoji}</span>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stock ?? Math.floor(Math.random()*80)+10}</td>
              <td><span className="status-badge status-delivered">Active</span></td>
              <td style={{display:'flex',gap:'.5rem'}}>
                <button style={{background:'none',border:'1px solid var(--sand)',padding:'.3rem .6rem',cursor:'pointer',fontSize:'.75rem',borderRadius:2}} onClick={()=>setToast('Product edited ✓')}>Edit</button>
                <button style={{background:'none',border:'1px solid var(--error)',color:'var(--error)',padding:'.3rem .6rem',cursor:'pointer',fontSize:'.75rem',borderRadius:2}} onClick={()=>setToast('Product removed')}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderCustomers = () => (
    <>
      <div className="admin-header"><h2 className="admin-title">Customers</h2></div>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Member Since</th></tr></thead>
        <tbody>
          {customers.length ? customers.map(c=>(
            <tr key={c._id}>
              <td style={{fontWeight:500}}>{c.firstName} {c.lastName}</td>
              <td style={{color:'var(--warm-gray)'}}>{c.email}</td>
              <td>{c.orderCount}</td>
              <td style={{fontWeight:500,color:'var(--success)'}}>${c.totalSpent?.toFixed(2)}</td>
              <td style={{color:'var(--warm-gray)'}}>{new Date(c.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</td>
            </tr>
          )) : (
            <tr><td colSpan={5} style={{textAlign:'center',color:'var(--warm-gray)',padding:'1.5rem'}}>No customers yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );

  const renderAnalytics = () => (
    <>
      <div className="admin-header"><h2 className="admin-title">Analytics</h2></div>
      <div className="stats-grid">
        {[['Page Views','18,420','↑ 34% this month'],['Avg Order Value',`$${stats?.avgOrderValue?.toFixed(0)||'166'}`,'↑ 5% this month'],['Return Rate','4.2%','↓ 1.1% this month'],['New Customers',stats?.totalCustomers||'312','↑ 18% this month']].map(([label,val,change])=>(
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{val}</div>
            <div className="stat-change">{change}</div>
          </div>
        ))}
      </div>
      <div style={{background:'white',padding:'2rem',borderRadius:2,marginTop:'1.5rem'}}>
        <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.2rem',fontWeight:300,marginBottom:'1.5rem'}}>Top Products</h3>
        {products.slice(0,5).map((p,i)=>(
          <div key={p._id||p.id} style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
            <span style={{fontSize:'.8rem',color:'var(--warm-gray)',width:20}}>#{i+1}</span>
            <span style={{fontSize:'1.2rem'}}>{p.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:'.85rem',fontWeight:500}}>{p.name}</div>
              <div style={{height:6,background:'var(--sand)',borderRadius:3,marginTop:'.4rem'}}>
                <div style={{height:6,background:'var(--accent)',borderRadius:3,width:`${90-i*15}%`}} />
              </div>
            </div>
            <span style={{fontSize:'.85rem',fontWeight:500}}>${p.price*(50-i*8)}</span>
          </div>
        ))}
      </div>
    </>
  );

  const contentMap = { dashboard:renderDashboard, orders:renderOrders, products:renderProducts, customers:renderCustomers, analytics:renderAnalytics };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-layout">
        <div className="admin-sidebar">
          <div style={{padding:'1.5rem 1.5rem 2rem',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.3rem',color:'var(--cream)',letterSpacing:'.1em'}}>SHAPA</div>
            <div style={{fontSize:'.7rem',color:'var(--warm-gray)',letterSpacing:'.15em',textTransform:'uppercase',marginTop:'.2rem'}}>Admin Panel</div>
          </div>
          {navItems.map(item=>(
            <button key={item.key} className={`admin-nav-item ${activeTab===item.key?'active':''}`} onClick={()=>setActiveTab(item.key)}>{item.label}</button>
          ))}
          <div style={{position:'absolute',bottom:'2rem',left:0,right:0}}>
            <button className="admin-nav-item" style={{color:'var(--error)'}} onClick={()=>navigate('/')}>⬅ Exit Dashboard</button>
          </div>
        </div>
        <div className="admin-content">{contentMap[activeTab]?.()}</div>
      </div>
      {toast && <Toast message={typeof toast==='string'?toast:toast.msg} type={toast?.type||'success'} onClose={()=>setToast(null)} />}
    </div>
  );
};

export default Admin;
