import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { detectFace } from '../services/faceRecognition';

const FaceCapture = ({ onCapture, buttonText = "Capture Face" }) => {
  const webcamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [faceDetected, setFaceDetected] = useState(false);

  const checkForFace = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const imageElement = webcamRef.current.video;
      const faces = await detectFace(imageElement);
      
      setFaceDetected(faces.length > 0);
      return faces.length > 0;
    }
    return false;
  }, []);

  const captureImage = useCallback(async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const hasFace = await checkForFace();
      
      if (!hasFace) {
        setError('No face detected. Please position your face in the frame.');
        setIsLoading(false);
        return;
      }
      
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc && typeof onCapture === 'function') {
        const img = new Image();
        img.src = imageSrc;
        
        img.onload = () => {
          onCapture(img);
          setIsLoading(false);
        };
        
        img.onerror = () => {
          setError('Error processing the image');
          setIsLoading(false);
        };
      } else {
        setError('Could not capture image');
        setIsLoading(false);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setIsLoading(false);
    }
  }, [onCapture, checkForFace]);

  // Periodically check for face
  useEffect(() => {
    const interval = setInterval(async () => {
      await checkForFace();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [checkForFace]);

  return (
    <div className="webcam-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 500,
          height: 375,
          facingMode: "user"
        }}
        className="webcam"
      />
      
      {error && <p className="error">{error}</p>}
      
      <div style={{ marginTop: '1rem' }}>
        <div style={{ 
          padding: '5px 10px', 
          borderRadius: '5px', 
          backgroundColor: faceDetected ? '#27ae60' : '#e74c3c',
          display: 'inline-block',
          color: 'white',
          marginBottom: '10px'
        }}>
          {faceDetected ? 'Face Detected' : 'No Face Detected'}
        </div>
      </div>
      
      <button 
        onClick={captureImage} 
        disabled={isLoading || !faceDetected}
        style={{ opacity: (isLoading || !faceDetected) ? 0.7 : 1 }}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
};

export default FaceCapture; 