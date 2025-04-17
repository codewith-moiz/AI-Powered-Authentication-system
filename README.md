# AI-Powered Authentication System

A modern authentication system featuring both traditional credential-based login and AI-powered face recognition.

## Technologies Used

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for secure authentication
- Bcrypt for password hashing

### Frontend
- React.js
- TensorFlow.js for face detection and recognition
- React Webcam for camera integration
- Axios for API communication

## Features

1. **Traditional Authentication**
   - Signup with email/password
   - Secure login with JWT tokens
   - Password hashing and security

2. **Face Recognition**
   - Browser-based face detection
   - Face descriptor extraction and matching
   - Secure face enrollment process
   - Face-based login option

3. **User Dashboard**
   - User profile management
   - Face recognition setup/management
   - Security settings

## Project Structure

```
├── backend/              # Server-side code
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── index.js      # Server entry point
│   └── package.json      # Backend dependencies
│
├── frontend/             # Client-side code
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API & utility services
│   │   ├── utils/        # Helper functions
│   │   ├── App.js        # Main React component
│   │   └── index.js      # Frontend entry point
│   └── package.json      # Frontend dependencies
```

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Modern web browser with webcam access

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-auth-system
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```

## Security Considerations

- Face descriptors are securely stored in the database
- JWT tokens are used for session management
- Passwords are hashed using bcrypt
- HTTP-only cookies for token storage (in production)

## Future Enhancements

- Multi-factor authentication
- Liveness detection for face recognition
- Improved face recognition accuracy
- Advanced security features 