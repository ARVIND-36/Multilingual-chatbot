# Multilingual Chatbot Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation

### 1. Clone the repository (if not already done)
```bash
git clone <your-repo-url>
cd Multilingual-chatbot
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd BACK-END

# Install dependencies
npm install

# Create .env file with your MongoDB connection string
# Edit the .env file and update MONGODB_URI if needed
# For local MongoDB: mongodb://localhost:27017/multilingual-chatbot
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/multilingual-chatbot

# Start the backend server
npm run dev
```

### 3. Frontend Setup (in a new terminal)
```bash
# Navigate to frontend directory
cd FRONT-END

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

## Database Schema

The application uses the following user schema:
- **username**: Unique username (3-20 characters, alphanumeric + underscore)
- **email**: Unique email address
- **aadhar_no**: Unique 12-digit Aadhar number
- **password**: Encrypted password (minimum 6 characters)

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

## Environment Variables

### Backend (.env in BACK-END folder)
```
MONGODB_URI=mongodb://localhost:27017/multilingual-chatbot
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env in FRONT-END folder)
```
VITE_API_URL=http://localhost:5000/api
VITE_SHOW_CHAT=false
```

## Running the Application

1. Start MongoDB service on your machine
2. Run backend: `cd BACK-END && npm run dev`
3. Run frontend: `cd FRONT-END && npm run dev`
4. Open browser to `http://localhost:5173`

## Features

- User registration with username, email, and Aadhar number
- Secure password hashing with bcrypt
- JWT-based authentication
- Form validation on both frontend and backend
- Responsive design
- Error handling and loading states

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Unique constraints on username, email, and Aadhar number

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in backend .env file or kill the process using the port
3. **CORS Error**: Ensure frontend is running on the correct port and backend CORS is configured properly