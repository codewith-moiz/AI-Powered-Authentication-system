import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FaceCapture from '../components/FaceCapture';
import { extractFaceDescriptor } from '../services/faceRecognition';
import { faceLogin } from '../services/api';

const FaceLogin = ({ login: loginUser }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTfModels = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        await tf.ready();
        
        await Promise.all([
          import('@tensorflow/tfjs-backend-webgl'),
          import('@tensorflow-models/face-detection')
        ]);
        
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading TensorFlow.js models:', error);
        setError('Failed to load face recognition models. Please try again.');
      }
    };
    
    loadTfModels();
  }, []);

  const handleFaceCapture = async (imgElement) => {
    if (!email.trim()) {
      setError('Please enter your email first');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsProcessing(true);
    
    try {
      // Extract face descriptor from captured image
      const faceDescriptor = await extractFaceDescriptor(imgElement);
      
      if (!faceDescriptor) {
        setError('Could not process face features. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      // Send to backend for verification
      const data = await faceLogin({ email, faceDescriptor });
      
      setSuccess('Face recognized successfully!');
      
      // Login the user
      loginUser(data.user, data.token);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Face login failed. Please try again or use password login.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Face Recognition Login</h1>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          disabled={isProcessing}
        />
      </div>
      
      {modelsLoaded ? (
        <FaceCapture 
          onCapture={handleFaceCapture} 
          buttonText="Login with Face" 
        />
      ) : (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>Loading face recognition models...</p>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            margin: '20px auto',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don't have face recognition set up? <Link to="/">Login with Password</Link></p>
        <p style={{ marginTop: '10px' }}>
          <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default FaceLogin; 