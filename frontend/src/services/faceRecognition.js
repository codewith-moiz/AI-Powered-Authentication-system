import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let faceDetector = null;
let faceLandmarksModel = null;

export const loadModels = async () => {
  try {
    await tf.ready();
    
    // Load face detection model
    if (!faceDetector) {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 1
      };
      faceDetector = await faceDetection.createDetector(model, detectorConfig);
    }
    
    // Load face landmarks model for feature extraction
    if (!faceLandmarksModel) {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const meshConfig = {
        runtime: 'tfjs',
        refineLandmarks: true,
        maxFaces: 1
      };
      faceLandmarksModel = await faceLandmarksDetection.createDetector(model, meshConfig);
    }
    
    return { faceDetector, faceLandmarksModel };
  } catch (error) {
    console.error('Error loading face models:', error);
    throw new Error('Failed to load TensorFlow.js models');
  }
};

export const detectFace = async (imageElement) => {
  if (!faceDetector) {
    await loadModels();
  }
  
  try {
    const faces = await faceDetector.estimateFaces(imageElement);
    return faces;
  } catch (error) {
    console.error('Error detecting face:', error);
    return [];
  }
};

export const getFaceLandmarks = async (imageElement) => {
  if (!faceLandmarksModel) {
    await loadModels();
  }
  
  try {
    const landmarks = await faceLandmarksModel.estimateFaces(imageElement);
    return landmarks;
  } catch (error) {
    console.error('Error getting face landmarks:', error);
    return [];
  }
};

export const extractFaceDescriptor = async (imageElement) => {
  try {
    const landmarks = await getFaceLandmarks(imageElement);
    
    if (landmarks.length === 0) {
      throw new Error('No face detected');
    }
    
    // Extract normalized face landmarks for face embedding
    const keypoints = landmarks[0].keypoints;
    
    // Create face descriptor from face mesh landmarks
    // This is a simplified approach - a real system would use a dedicated face embedding model
    const faceDescriptor = keypoints.map(point => {
      const { x, y, z } = point;
      return [x, y, z || 0];
    }).flat();
    
    // Normalize the descriptor
    const tensorDescriptor = tf.tensor1d(faceDescriptor);
    const normalizedDescriptor = tf.div(
      tf.sub(tensorDescriptor, tf.mean(tensorDescriptor)), 
      tf.add(tf.sqrt(tf.mean(tf.square(tensorDescriptor))), tf.scalar(1e-10))
    );
    
    const result = await normalizedDescriptor.array();
    
    // Clean up tensors
    tensorDescriptor.dispose();
    normalizedDescriptor.dispose();
    
    return result;
  } catch (error) {
    console.error('Error extracting face descriptor:', error);
    throw error;
  }
};

export const compareFaceDescriptors = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return 1.0; // Maximum distance (no match)
  }
  
  // Calculate Euclidean distance
  const tensorDesc1 = tf.tensor1d(descriptor1);
  const tensorDesc2 = tf.tensor1d(descriptor2);
  
  const distance = tf.sqrt(tf.sum(tf.square(tf.sub(tensorDesc1, tensorDesc2)))).dataSync()[0];
  
  // Clean up tensors
  tensorDesc1.dispose();
  tensorDesc2.dispose();
  
  return distance;
};

export const isFaceMatch = (descriptor1, descriptor2, threshold = 0.6) => {
  const distance = compareFaceDescriptors(descriptor1, descriptor2);
  return distance < threshold;
}; 