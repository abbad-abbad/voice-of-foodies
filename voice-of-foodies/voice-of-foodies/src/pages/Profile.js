import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, deleteAccount } from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePassword, setChangePassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format.';

    if (changePassword) {
      if (!pwForm.currentPassword) errs.currentPassword = 'Enter your current password.';
      if (!pwForm.newPassword) errs.newPassword = 'Enter a new password.';
      else if (pwForm.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters.';
      if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setServerError('');

    const payload = { name: form.name.trim(), email: form.email.trim() };
    if (changePassword) {
      payload.currentPassword = pwForm.currentPassword;
      payload.newPassword = pwForm.newPassword;
    }

    const result = await updateProfile(payload);
    setSaving(false);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    updateUser(result.user);
    setEditing(false);
    setChangePassword(false);
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email });
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangePassword(false);
    setErrors({});
    setServerError('');
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const result = await deleteAccount();
    setDeleting(false);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    logout();
    navigate('/');
  };

  const joined = new Date(user.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="auth-page page-enter">
      <div className="auth-card profile-card">
        <div className="auth-card__brand">👤</div>
        <h1 className="auth-card__title">My Profile</h1>
        <p className="auth-card__sub">View and manage your account details</p>

        {success && <div className="auth-alert auth-alert--success">{success}</div>}
        {serverError && <div className="auth-alert auth-alert--error">{serverError}</div>}

        {!editing ? (
          <>
            <div className="profile-view">
              <div className="profile-row">
                <span className="profile-row__label">Full Name</span>
                <span className="profile-row__value">{user.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">Email</span>
                <span className="profile-row__value">{user.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">Role</span>
                <span className="profile-row__value">{user.role}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">Member Since</span>
                <span className="profile-row__value">{joined}</span>
              </div>
            </div>

            <button className="auth-submit" onClick={() => setEditing(true)}>✏️ Edit Profile</button>

            {!confirmDelete ? (
              <button className="profile-danger-link" onClick={() => setConfirmDelete(true)}>
                Delete my account
              </button>
            ) : (
              <div className="profile-delete-confirm">
                <p>Are you sure? This will permanently delete your account and all your reviews.</p>
                <div className="profile-delete-actions">
                  <button className="auth-submit auth-submit--danger" onClick={handleDeleteAccount} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Yes, delete my account'}
                  </button>
                  <button className="profile-danger-link" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <form className="auth-form" onSubmit={handleSave} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {!changePassword ? (
              <button type="button" className="profile-link-btn" onClick={() => setChangePassword(true)}>
                🔒 Change Password
              </button>
            ) : (
              <div className="profile-password-block">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    className={`form-input ${errors.currentPassword ? 'form-input--error' : ''}`}
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) => { setPwForm({ ...pwForm, currentPassword: e.target.value }); setErrors({ ...errors, currentPassword: '' }); }}
                  />
                  {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className={`form-input ${errors.newPassword ? 'form-input--error' : ''}`}
                    type="password"
                    value={pwForm.newPassword}
                    onChange={(e) => { setPwForm({ ...pwForm, newPassword: e.target.value }); setErrors({ ...errors, newPassword: '' }); }}
                  />
                  {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => { setPwForm({ ...pwForm, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                  />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>
                <button type="button" className="profile-link-btn" onClick={() => { setChangePassword(false); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}>
                  Cancel password change
                </button>
              </div>
            )}

            <div className="profile-edit-actions">
              <button type="submit" className="auth-submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="profile-link-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
