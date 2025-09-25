# 🔧 Troubleshooting Guide - Multilingual Chatbot

## ✅ What I've Fixed

### 1. App.jsx Authentication Flow
- ✅ Removed auto-bypass to chatbot
- ✅ Added proper token verification on app load
- ✅ Fixed login page as default landing page
- ✅ Proper authentication state management

### 2. API Integration
- ✅ Fixed duplicate imports in dashboard components
- ✅ Added proper dashboardAPI exports
- ✅ Standardized API calls across components
- ✅ Added proper error handling

### 3. Component Navigation
- ✅ Fixed UserDashboard and AdminDashboard prop handling
- ✅ Added proper CSS imports for styling
- ✅ Fixed logout functionality
- ✅ Added "Back to Chat" navigation

### 4. Database Connection
- ✅ Verified MongoDB local connection works
- ✅ Created database test script
- ✅ Confirmed all models and schemas are correct

## 🚀 How to Start the Application

### Option 1: Manual Start (Recommended)
```bash
# Terminal 1 - Backend
cd BACK-END
npm run dev

# Terminal 2 - Frontend
cd FRONT-END
npm run dev
```

### Option 2: Batch File
Double-click `start-dev.bat` in the root directory

## 🌐 Access Points
- **Login Page**: http://localhost:5173 (should show by default)
- **Backend API**: http://localhost:5000
- **API Test**: http://localhost:5000 (should show "API is running")

## 🐛 Common Issues & Solutions

### Issue 1: "Login page doesn't show"
**Symptoms**: Sees chatbot instead of login
**Solution**: 
```javascript
// Clear browser storage
localStorage.clear()
// Refresh the page
```

### Issue 2: "Dashboard shows errors"
**Symptoms**: Blank dashboard or API errors
**Solutions**:
1. Check if backend is running on port 5000
2. Verify JWT token in localStorage
3. Check browser console for specific errors

### Issue 3: "Logout doesn't work"
**Symptoms**: Stays logged in after clicking logout
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify `onLogout` prop is passed correctly
3. Clear localStorage manually if needed

### Issue 4: "Cannot connect to database"
**Symptoms**: Backend shows MongoDB connection errors
**Solutions**:
1. Start MongoDB locally: `mongod`
2. Or use MongoDB Compass with local connection
3. Verify port 27017 is available

## 🧪 Test the Application

### 1. Test Login Flow
1. Go to http://localhost:5173
2. Should see login page
3. Click "Create Account" to register
4. Fill form with: username, email, aadhar_no, password
5. Should redirect to chatbot after registration

### 2. Test Dashboard Access
1. In chatbot, click three dots (⋮) in top-right
2. Click "Dashboard"
3. Should show user dashboard with profile tab

### 3. Test Admin Dashboard
1. Register a user normally
2. In MongoDB, change user's `role` from "user" to "admin"
3. Login again
4. Dashboard should show admin features

### 4. Test Logout
1. From any authenticated page
2. Click logout button (in three-dot menu or dashboard)
3. Should return to login page
4. localStorage should be cleared

## 📊 API Endpoints Test

You can test these in browser or Postman:

### Public Endpoints
- `GET http://localhost:5000/` - Server status

### Authentication (No token needed)
- `POST http://localhost:5000/api/auth/signup` - Register
- `POST http://localhost:5000/api/auth/login` - Login

### Protected Endpoints (Need Authorization header)
- `GET http://localhost:5000/api/auth/verify` - Verify token
- `GET http://localhost:5000/api/dashboard/user/profile` - User profile
- `GET http://localhost:5000/api/dashboard/admin/stats` - Admin stats

## 💡 Pro Tips

### Clear Everything and Start Fresh
```bash
# Clear browser data
localStorage.clear()
sessionStorage.clear()

# Stop all servers
Ctrl+C in both terminals

# Restart in correct order
1. Start backend first
2. Wait for "MongoDB connected" message
3. Start frontend
4. Test login page loads
```

### Create Admin User
```javascript
// After registering normally, use MongoDB Compass or CLI:
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### Debug Authentication
```javascript
// In browser console, check current auth state:
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('user'));
```

## 🆘 If Still Not Working

1. **Check both terminals** - Backend should show "MongoDB connected" and "Server running on port 5000"
2. **Check browser console** - Look for any red error messages
3. **Check Network tab** - Verify API calls are being made to localhost:5000
4. **Verify MongoDB** - Use MongoDB Compass to connect to localhost:27017
5. **Port conflicts** - Make sure ports 5000 and 5173 are available

## 📱 Expected User Experience

### New User Journey
1. **Landing**: Login page with "Create Account" option
2. **Registration**: Form with username, email, aadhar_no, password
3. **Success**: Automatic login and redirect to chatbot
4. **Chatbot**: Clean interface with three-dot menu
5. **Dashboard**: Profile and tickets tabs (user) or stats and tickets (admin)
6. **Navigation**: Easy switching between chat and dashboard
7. **Logout**: Clean logout returning to login page

Everything should now work correctly! Start both servers and test the flow step by step.