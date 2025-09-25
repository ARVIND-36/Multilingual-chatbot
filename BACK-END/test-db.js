// Test script to verify backend and database connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'connection-test' });
    await testDoc.save();
    console.log('✅ Document creation test passed');
    
    // Clean up
    await TestModel.deleteMany({ test: 'connection-test' });
    console.log('✅ Document deletion test passed');
    
    await mongoose.disconnect();
    console.log('✅ All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB is installed and running');
      console.log('2. Try starting MongoDB with: mongod --dbpath ./data/db');
      console.log('3. Or install MongoDB Compass and start a local instance');
      console.log('4. Check if port 27017 is available');
    }
  }
  
  process.exit(0);
};

testConnection();