import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceCapture from '../components/FaceCapture';
import { extractFaceDescriptor } from '../services/faceRecognition';
import { saveFaceData, disableFaceRecognition } from '../services/api';

const SetupFaceAuth = ({ user, updateUser }) => {
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
    setError('');
    setSuccess('');
    setIsProcessing(true);
    
    try {
      // Extract face descriptor from captured image
      const faceDescriptor = await extractFaceDescriptor(imgElement);
      
      if (!faceDescriptor) {
        setError('Could not process face features. Please try again with better lighting.');
        setIsProcessing(false);
        return;
      }
      
      // Send to backend for storage
      const data = await saveFaceData({ faceDescriptor });
      
      // Update user state with face recognition enabled
      const updatedUser = {
        ...user,
        useFaceRecognition: true
      };
      updateUser(updatedUser);
      
      setSuccess('Face recognition has been set up successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to set up face recognition. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisableFaceRecognition = async () => {
    setError('');
    setSuccess('');
    setIsProcessing(true);
    
    try {
      await disableFaceRecognition();
      
      // Update user state with face recognition disabled
      const updatedUser = {
        ...user,
        useFaceRecognition: false
      };
      updateUser(updatedUser);
      
      setSuccess('Face recognition has been disabled.');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to disable face recognition. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <h1>Face Recognition Setup</h1>
      
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <p>
          Look directly at the camera in good lighting conditions.
          Your face will be scanned and the biometric data will be securely stored.
        </p>
      </div>
      
      {modelsLoaded ? (
        <FaceCapture 
          onCapture={handleFaceCapture} 
          buttonText="Capture and Save Face Data" 
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
      
      {user?.useFaceRecognition && (
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Disable Face Recognition</h3>
          <p>
            If you want to disable face recognition login for your account, 
            click the button below.
          </p>
          <button 
            onClick={handleDisableFaceRecognition} 
            className="secondary"
            disabled={isProcessing}
            style={{ marginTop: '10px' }}
          >
            {isProcessing ? 'Processing...' : 'Disable Face Recognition'}
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ backgroundColor: '#95a5a6' }}
          disabled={isProcessing}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SetupFaceAuth; 