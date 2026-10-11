import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim())    errs.email = 'Email is required.';
    if (!form.password)        errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await loginUser(form);
    if (!result.success) {
      setServerError(result.error);
    } else {
      login(result.user);
      navigate('/reviews');
    }
    setLoading(false);
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
    setServerError('');
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-card__brand">🍽</div>
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__sub">Sign in to your Voice of Foodies account</p>

        {serverError && <div className="auth-alert auth-alert--error">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Signing In…' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
