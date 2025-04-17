import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateUserProfile } from '../services/api';

const Dashboard = ({ user, updateUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await updateUserProfile({ name });
      updateUser(data.user);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '30px', 
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h1>Welcome to Your Dashboard</h1>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Profile Information</h2>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <p>{user?.email}</p>
                <small>Email cannot be changed</small>
              </div>
              
              <div className="button-group">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setName(user?.name || '');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '15px' }}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '40px' }}>
          <h2>Face Recognition</h2>
          
          {user?.useFaceRecognition ? (
            <div>
              <p style={{ color: 'green', marginBottom: '15px' }}>
                Face recognition is enabled for your account.
              </p>
              <Link to="/setup-face-auth">
                <button className="secondary">Update Face Recognition</button>
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: '15px' }}>
                Enhance your account security by enabling face recognition login.
              </p>
              <Link to="/setup-face-auth">
                <button>Setup Face Recognition</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 