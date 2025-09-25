# 🔐 Admin User Setup Guide for MongoDB Compass

## Generated Admin User Document

Copy this JSON document and paste it into MongoDB Compass:

```json
{
  "username": "admin",
  "email": "admin@cityservices.com",
  "aadhar_no": "123456789012",
  "password": "$2a$10$NWBOJPao.FpAUkd/R.pH7Ofxytx6JCwQVO0zZwC1CaIh8ohrpsqqa",
  "role": "admin",
  "createdAt": "2025-09-25T05:57:27.359Z",
  "updatedAt": "2025-09-25T05:57:27.359Z"
}
```

## 📋 Step-by-Step Instructions

### 1. Open MongoDB Compass
- Launch MongoDB Compass application
- If not installed, download from: https://www.mongodb.com/products/compass

### 2. Connect to Local MongoDB
- Connection string: `mongodb://localhost:27017`
- Click "Connect"

### 3. Navigate to Database
- Look for database named: `multilingual-chatbot`
- If it doesn't exist, your backend hasn't connected yet - run the backend server first

### 4. Access Users Collection
- Click on `multilingual-chatbot` database
- Find the `users` collection
- Click on `users`

### 5. Insert Admin Document
- Click the green "Insert Document" button
- You'll see a JSON editor
- **Delete the default `{}` content**
- Copy and paste the JSON document from above
- Click "Insert"

### 6. Verify Admin User
- You should see the admin user in the users collection
- Note the `role` field shows "admin"
- The password is hashed for security

## 🔑 Admin Login Credentials

Use these credentials to login as admin:

- **Email**: `admin@cityservices.com`
- **Password**: `admin123`
- **Role**: `admin`

## 🎯 Testing Admin Access

1. Start your application servers:
   ```bash
   # Backend
   cd BACK-END
   npm run dev
   
   # Frontend  
   cd FRONT-END
   npm run dev
   ```

2. Go to: http://localhost:5173

3. Login with admin credentials

4. After login, click the three dots (⋮) in chatbot

5. Click "Dashboard" - you should see the AdminDashboard with admin features

## 🔧 Customization Options

If you want to change the admin details, edit the `create-admin.js` file:

```javascript
const adminData = {
  username: "youradmin",           // Change username
  email: "youremail@domain.com",   // Change email  
  aadhar_no: "987654321098",       // Change Aadhar (12 digits)
  password: "yourpassword",        // Change password
  role: "admin"                    // Keep as admin
};
```

Then run: `node create-admin.js` to generate a new document.

## ⚠️ Security Notes

1. **Change the default password** in production
2. **Use a real email** for password recovery (future feature)
3. **Use a valid Aadhar number** if required for compliance
4. The password is automatically hashed for security

## 🔍 Troubleshooting

### "Database not found"
- Make sure backend server is running
- Backend creates the database automatically on first connection

### "Collection not found"  
- Register at least one regular user first
- This creates the users collection

### "Admin login not working"
- Verify the document was inserted correctly
- Check that `role` field is exactly "admin"
- Ensure password matches what you set

### "Dashboard shows user instead of admin"
- Clear browser localStorage: `localStorage.clear()`
- Login again with admin credentials
- Check the user document in MongoDB has `role: "admin"`

## 📱 Expected Admin Features

Once logged in as admin, you should see:
- Admin Dashboard with statistics
- All user tickets/complaints
- Ability to update ticket status
- User management capabilities (future)
- System analytics (future)

The admin will have access to the municipal dashboard design with additional administrative controls.