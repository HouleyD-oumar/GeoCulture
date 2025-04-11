import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useErrorHandler from '../hooks/useErrorHandler';

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { handleError, error, clearError } = useErrorHandler();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to load users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      handleError(error, t('admin.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error('Error updating user role');
      fetchUsers();
    } catch (error) {
      handleError(error, t('admin.errorUpdating'));
    }
  };

  return (
    <div className="admin-user-manager">
      <h2>{t('admin.userManagement')}</h2>
      
      {error && (
        <div className="error-message">
          {error.message}
          <button onClick={clearError}>{t('common.close')}</button>
        </div>
      )}
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('admin.userId')}</th>
              <th>{t('admin.username')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select 
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="user">{t('admin.roleUser')}</option>
                    <option value="moderator">{t('admin.roleModerator')}</option>
                    <option value="admin">{t('admin.roleAdmin')}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserManager;