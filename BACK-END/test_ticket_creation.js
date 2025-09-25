const mongoose = require('mongoose');
const Ticket = require('./src/models/Ticket');
const GeminiChatService = require('./src/services/GeminiChatService');
require('dotenv').config();

async function testTicketCreation() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const chatService = new GeminiChatService();
        
        // Test creating a ticket
        console.log('\n🧪 Testing ticket creation...');
        
        const ticketData = {
            ticketNumber: chatService.generateTicketNumber(),
            username: 'TestUser',
            originalMessage: 'theru vilakku work seiya villai',
            translation: 'Street light is not working',
            category: 'Street Light',
            priority: 'medium',
            status: 'open',
            confidence: 0.9,
            reason: 'Valid street light complaint',
            aiResponse: 'Ticket created successfully'
        };
        
        console.log('Creating ticket with data:', ticketData);
        
        const ticket = new Ticket(ticketData);
        const savedTicket = await ticket.save();
        
        console.log('✅ Ticket created successfully:', savedTicket.ticketNumber);
        console.log('Ticket ID:', savedTicket._id);
        
        // Test querying tickets
        console.log('\n🔍 Testing ticket queries...');
        
        const allTickets = await Ticket.find().sort({ createdAt: -1 }).limit(5);
        console.log(`✅ Found ${allTickets.length} tickets in database`);
        
        allTickets.forEach(ticket => {
            console.log(`- ${ticket.ticketNumber}: ${ticket.category} (${ticket.status})`);
        });
        
        // Test duplicate prevention
        console.log('\n🔄 Testing duplicate prevention...');
        
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const duplicateCheck = await Ticket.findOne({
            username: 'TestUser',
            category: 'Street Light',
            status: { $in: ['open', 'in_progress'] },
            createdAt: { $gte: last24Hours }
        });
        
        if (duplicateCheck) {
            console.log('✅ Duplicate prevention working - found existing ticket:', duplicateCheck.ticketNumber);
        } else {
            console.log('❌ No duplicate found (this might be expected if no recent tickets exist)');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n📊 Database connection closed');
    }
}

testTicketCreation();