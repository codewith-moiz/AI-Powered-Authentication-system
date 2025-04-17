const calculateFaceSimilarity = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return 0;
  }

  let distance = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    distance += diff * diff;
  }
  distance = Math.sqrt(distance);
  
  // Lower distance means higher similarity
  // Typical threshold for face recognition is around 0.5-0.6
  return distance;
};

const verifyFaceMatch = (descriptor1, descriptor2, threshold = 0.6) => {
  const distance = calculateFaceSimilarity(descriptor1, descriptor2);
  return distance < threshold;
};

module.exports = {
  calculateFaceSimilarity,
  verifyFaceMatch
}; 