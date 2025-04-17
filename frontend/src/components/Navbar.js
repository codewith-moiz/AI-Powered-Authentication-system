import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout, user }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>AI Auth System</Link>
        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <span style={styles.welcome}>Welcome, {user?.name}</span>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <button onClick={logout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.link}>Sign Up</Link>
              {user?.useFaceRecognition && (
                <Link to="/face-login" style={styles.link}>Face Login</Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: '#2c3e50',
    color: '#fff',
    padding: '1rem 0',
    marginBottom: '2rem'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '1.5rem',
    padding: '0.5rem 0'
  },
  button: {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    marginLeft: '1.5rem',
    cursor: 'pointer'
  },
  welcome: {
    marginRight: '1rem'
  }
};

export default Navbar; 