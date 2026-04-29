import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState('signin');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [siEmail, setSiEmail] = useState('');
  const [siPass,  setSiPass]  = useState('');
  const [suFirst, setSuFirst] = useState('');
  const [suLast,  setSuLast]  = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass,  setSuPass]  = useState('');
  const [suConf,  setSuConf]  = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const showError = (msg) => setToast({ msg, type: 'error' });

  const loginUser = async () => {
    if (!siEmail || !siPass) return showError('Please fill in all fields');
    setLoading(true);
    try {
      await login({ email: siEmail, password: siPass });
      setToast('Welcome back to Shapa! 👋');
      setTimeout(() => navigate('/'), 800);
    } catch (err) { showError(err.message); }
    finally { setLoading(false); }
  };

  const signupUser = async () => {
    if (!suFirst || !suEmail || !suPass) return showError('Please fill in all required fields');
    if (suPass !== suConf) return showError('Passwords do not match');
    if (suPass.length < 6) return showError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ firstName: suFirst, lastName: suLast, email: suEmail, password: suPass });
      setToast('Account created! Welcome to Shapa ✨');
      setTimeout(() => navigate('/'), 800);
    } catch (err) { showError(err.message); }
    finally { setLoading(false); }
  };

  const loginAdmin = async () => {
    if (!adminUser || !adminPass) return showError('Please fill in all fields');
    setLoading(true);
    try {
      const user = await login({ username: adminUser, password: adminPass });
      if (user.role !== 'admin') { showError('Not an admin account'); return; }
      setToast('Welcome, Admin 🔐');
      setTimeout(() => navigate('/admin'), 500);
    } catch (err) { showError(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-layout">
        <div className="login-left">
          <div className="login-left-content">
            <p className="section-tag">Welcome to Shapa</p>
            <h2>Your <em>style</em><br />journey starts<br />here.</h2>
            <p>Access your wardrobe, track orders, and unlock exclusive member benefits.</p>
            <div className="login-perks">
              <div className="perk"><div className="perk-icon">✨</div>Early access to new collections</div>
              <div className="perk"><div className="perk-icon">🎁</div>Member-only discounts &amp; offers</div>
              <div className="perk"><div className="perk-icon">📦</div>Free shipping on every order</div>
              <div className="perk"><div className="perk-icon">🔄</div>Hassle-free 30-day returns</div>
            </div>
          </div>
        </div>
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="login-tabs">
              <button className={`login-tab ${tab==='signin'?'active':''}`} onClick={()=>setTab('signin')}>Sign In</button>
              <button className={`login-tab ${tab==='signup'?'active':''}`} onClick={()=>setTab('signup')}>Create Account</button>
              <button className={`login-tab ${tab==='admin'?'active':''}`} onClick={()=>setTab('admin')}>🔐 Admin</button>
            </div>

            {tab==='signin' && (
              <div>
                <h2 className="form-title">Welcome back</h2>
                <p className="form-subtitle">Sign in to your Shapa account</p>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" value={siEmail} onChange={e=>setSiEmail(e.target.value)} /></div>
                <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={siPass} onChange={e=>setSiPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loginUser()} /></div>
                <div style={{textAlign:'right',marginBottom:'1.5rem'}}><a href="#" style={{fontSize:'.8rem',color:'var(--warm-gray)'}}>Forgot password?</a></div>
                <button className="btn-primary" style={{width:'100%',textAlign:'center'}} onClick={loginUser} disabled={loading}>{loading?'Signing in…':'Sign In'}</button>
                <div className="divider">or continue with</div>
                <div className="social-logins">
                  <button className="social-btn">🌐 Google</button>
                  <button className="social-btn">🍎 Apple</button>
                </div>
              </div>
            )}

            {tab==='signup' && (
              <div>
                <h2 className="form-title">Create account</h2>
                <p className="form-subtitle">Join Shapa and start your journey</p>
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input type="text" placeholder="Jane" value={suFirst} onChange={e=>setSuFirst(e.target.value)} /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" placeholder="Doe" value={suLast} onChange={e=>setSuLast(e.target.value)} /></div>
                </div>
                <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" value={suEmail} onChange={e=>setSuEmail(e.target.value)} /></div>
                <div className="form-group"><label>Password</label><input type="password" placeholder="Create a strong password" value={suPass} onChange={e=>setSuPass(e.target.value)} /></div>
                <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="Repeat password" value={suConf} onChange={e=>setSuConf(e.target.value)} /></div>
                <button className="btn-primary" style={{width:'100%',textAlign:'center',marginTop:'.5rem'}} onClick={signupUser} disabled={loading}>{loading?'Creating account…':'Create Account'}</button>
                <p style={{fontSize:'.75rem',color:'var(--warm-gray)',textAlign:'center',marginTop:'1rem'}}>By creating an account you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a></p>
              </div>
            )}

            {tab==='admin' && (
              <div>
                <h2 className="form-title">Admin Login</h2>
                <p className="form-subtitle">Access the Shapa management dashboard</p>
                <div style={{background:'rgba(201,169,110,.1)',border:'1px solid rgba(201,169,110,.3)',padding:'1rem',borderRadius:2,marginBottom:'1.5rem',fontSize:'.8rem',color:'var(--accent-dark)'}}>
                  🔒 Demo credentials: admin / shapa2025
                </div>
                <div className="form-group"><label>Admin ID</label><input type="text" placeholder="admin" value={adminUser} onChange={e=>setAdminUser(e.target.value)} /></div>
                <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={adminPass} onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loginAdmin()} /></div>
                <button className="btn-primary" style={{width:'100%',textAlign:'center'}} onClick={loginAdmin} disabled={loading}>{loading?'Logging in…':'Access Dashboard'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={typeof toast==='string'?toast:toast.msg} type={toast.type||'success'} onClose={()=>setToast(null)} />}
    </div>
  );
};

export default Login;
