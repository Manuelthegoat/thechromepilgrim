import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const loginError = await login(email, password);
    if (loginError) {
      setError('Invalid email or password.');
      return;
    }
    navigate('/admin');
  }

  return (
    <section className="admin-login">
      <h1>Admin login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </section>
  );
}

export default AdminLogin;