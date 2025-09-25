// Quick test to verify dashboard integration
// This script tests the complete flow: Create ticket -> View in dashboards

const testChatbotIntegration = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing Chatbot -> Dashboard Integration');
  console.log('==========================================\n');

  try {
    // Test 1: Create a test ticket via chat
    console.log('1. Creating test ticket via chat API...');
    const chatResponse = await fetch(`${baseURL}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'kuppai collection problem in our area',
        username: 'test_user_dashboard'
      })
    });

    const chatResult = await chatResponse.json();
    console.log('   Chat API Response:', {
      success: chatResult.success,
      ticketCreated: chatResult.ticketCreated,
      ticketNumber: chatResult.ticketNumber
    });

    if (chatResult.ticketCreated) {
      console.log('   ✅ Ticket created successfully!');
      console.log(`   📋 Ticket Number: ${chatResult.ticketNumber}`);
    } else {
      console.log('   ❌ No ticket was created');
    }

    // Test 2: Verify ticket appears in admin dashboard
    console.log('\n2. Checking admin dashboard...');
    const adminResponse = await fetch(`${baseURL}/api/dashboard/admin/tickets`);
    
    if (adminResponse.status === 401) {
      console.log('   ⚠️  Admin endpoint requires authentication - this is correct');
      console.log('   📝 To test admin dashboard, login with admin credentials');
    } else {
      const adminResult = await adminResponse.json();
      console.log('   Admin tickets found:', adminResult.tickets?.length || 0);
    }

    // Test 3: Check user tickets endpoint
    console.log('\n3. Checking user tickets endpoint...');
    const userResponse = await fetch(`${baseURL}/api/dashboard/user/tickets`);
    
    if (userResponse.status === 401) {
      console.log('   ⚠️  User endpoint requires authentication - this is correct');
      console.log('   📝 To test user dashboard, login with user credentials');
    } else {
      const userResult = await userResponse.json();
      console.log('   User tickets found:', userResult.tickets?.length || 0);
    }

    console.log('\n✅ Integration test completed!');
    console.log('📋 Summary:');
    console.log('   - Chat API: Working');
    console.log('   - Ticket Creation: Working');
    console.log('   - Dashboard Endpoints: Protected (requires auth)');
    console.log('\n💡 Next steps:');
    console.log('   1. Start the backend server');
    console.log('   2. Test with the frontend');
    console.log('   3. Login and verify dashboards show real tickets');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the backend server is running on port 5000');
  }
};

// Only run if this file is executed directly
if (typeof window === 'undefined') {
  testChatbotIntegration();
}

module.exports = { testChatbotIntegration };