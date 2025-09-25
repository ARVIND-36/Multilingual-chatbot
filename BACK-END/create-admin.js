const bcrypt = require('bcryptjs');

async function generateAdminUser() {
  // Admin user details - CHANGE THESE AS NEEDED
  const adminData = {
    username: "admin",
    email: "admin@cityservices.com", 
    aadhar_no: "123456789012", // Change this to a valid 12-digit number
    password: "admin123", // Change this password
    role: "admin"
  };

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create the document to insert in MongoDB
    const adminDocument = {
      username: adminData.username,
      email: adminData.email,
      aadhar_no: adminData.aadhar_no,
      password: hashedPassword,
      role: adminData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('🔐 Admin User Document for MongoDB Compass:');
    console.log('=====================================');
    console.log(JSON.stringify(adminDocument, null, 2));
    console.log('');
    console.log('📋 Steps to add in MongoDB Compass:');
    console.log('1. Open MongoDB Compass');
    console.log('2. Connect to: mongodb://localhost:27017');
    console.log('3. Navigate to database: multilingual-chatbot');
    console.log('4. Go to collection: users');
    console.log('5. Click "Insert Document"');
    console.log('6. Copy and paste the JSON above');
    console.log('7. Click "Insert"');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Role: ${adminData.role}`);

  } catch (error) {
    console.error('Error generating admin user:', error);
  }
}

generateAdminUser();