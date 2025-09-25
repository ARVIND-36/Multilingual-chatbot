# 🇮🇳 Multilingual Municipal Chatbot

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)

A modern, AI-powered multilingual chatbot system designed for municipal complaint management in India. The system supports Tamil, Hindi, and English languages, providing citizens with an intuitive way to report municipal issues while offering administrators comprehensive management tools.

## 🌟 Features

### 🤖 **Intelligent Chat System**
- **Multi-language Support**: Tamil, Hindi, and English
- **AI-Powered Analysis**: Google Gemini AI for complaint categorization
- **Smart Location Detection**: Automatic ward/area validation
- **Real-time Responses**: Instant complaint processing and ticket generation

### 🎫 **Ticket Management**
- **Automated Ticket Creation**: Smart ticket generation with unique IDs
- **Priority Assignment**: AI-based priority classification (Low, Medium, High)
- **Status Tracking**: Real-time status updates (Open, In Progress, Resolved)
- **Duplicate Prevention**: Intelligent duplicate detection system

### 👥 **User Management**
- **Secure Authentication**: JWT-based user authentication
- **Role-based Access**: User and Admin role separation
- **Profile Management**: User profile and settings management
- **Dashboard Analytics**: Comprehensive complaint statistics

### 🏛️ **Admin Features**
- **Comprehensive Dashboard**: System-wide analytics and statistics
- **Ticket Management**: View, filter, and manage all complaints
- **User Oversight**: Monitor user activities and complaints
- **System Analytics**: Detailed reporting and insights

## 🏗️ Architecture

```
🏢 MULTILINGUAL-CHATBOT/
├── 📂 BACK-END/              # Node.js/Express Backend
│   ├── 📂 src/
│   │   ├── 📂 middleware/    # Authentication & validation
│   │   ├── 📂 models/        # MongoDB data models
│   │   ├── 📂 routes/        # API endpoints
│   │   ├── 📂 services/      # Business logic & AI service
│   │   └── 📄 server.js      # Application entry point
│   ├── 📄 package.json
│   └── 📄 .env               # Environment variables
│
├── 📂 FRONT-END/             # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/    # React components
│   │   ├── 📂 services/      # API services
│   │   ├── 📂 styles/        # CSS stylesheets
│   │   └── 📂 assets/        # Static assets
│   ├── 📄 package.json
│   └── 📄 vite.config.js     # Vite configuration
│
├── 📄 README.md
└── 📄 .gitignore
```

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** 18.0 or higher
- **MongoDB** 6.0 or higher
- **npm** or **yarn** package manager
- **Google Gemini API Key** (for AI functionality)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ARVIND-36/Multilingual-chatbot.git
   cd Multilingual-chatbot
   ```

2. **Backend Setup**
   ```bash
   cd BACK-END
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../FRONT-END
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in `BACK-END/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/multilingual_chatbot
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

   Create `.env` file in `FRONT-END/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Database Setup**
   
   Ensure MongoDB is running and accessible. The application will automatically create the necessary collections.

### 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd BACK-END
   npm start
   # For development with auto-reload
   npm run dev
   ```

2. **Start the Frontend Application**
   ```bash
   cd FRONT-END
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### 💬 Chat System
- `POST /api/chat/message` - Process chat message
- `GET /api/chat/tickets/:username` - Get user tickets

### 📊 Dashboard
- `GET /api/dashboard/user/profile` - Get user profile
- `GET /api/dashboard/user/tickets` - Get user tickets
- `GET /api/dashboard/admin/stats` - Get admin statistics
- `GET /api/dashboard/admin/tickets` - Get all tickets

## 🎨 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Google Gemini AI** - Natural language processing
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - Frontend framework
- **Vite** - Build tool
- **React Icons** - Icon library
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

## 🌍 Language Support

The chatbot intelligently handles multiple languages and formats:

- **Tamil Script**: எங்கள் பகுதியில் குப்பை எடுக்கப்படவில்லை
- **Tamil in English**: engal paguthiyil kuppai edukkappada villai
- **Mixed Format**: garbage edukkappa villai
- **English**: garbage not collected

## 🎯 Complaint Categories

- 🚰 **Water Supply** - Water shortage, quality issues
- 🗑️ **Waste Management** - Garbage collection, disposal
- 💡 **Street Light** - Lighting issues, maintenance
- 🛣️ **Road Maintenance** - Potholes, road repairs
- 🚦 **Traffic Management** - Traffic signals, congestion
- 🔇 **Noise Pollution** - Noise complaints
- 🏥 **Public Health** - Health and sanitation issues
- 💰 **Property Tax** - Tax-related queries
- 📄 **Birth/Death Certificate** - Document services
- 📋 **General** - Other municipal services

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for passwords
- **Input Validation** - Comprehensive input sanitization
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API abuse prevention
- **Data Validation** - Schema-based data validation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 🖥️ Desktop computers
- 📱 Mobile phones
- 📟 Tablets
- 💻 Various screen sizes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👨‍💻 Author

**ARVIND-36**
- GitHub: [@ARVIND-36](https://github.com/ARVIND-36)

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- React community for the amazing framework
- MongoDB for the flexible database solution
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/ARVIND-36/Multilingual-chatbot/issues) page
2. Create a new issue with detailed information
3. Reach out through GitHub discussions

---

<div align="center">
  <strong>Made with ❤️ for Indian Municipal Services</strong>
  <br>
  🇮🇳 Supporting Digital India Initiative 🇮🇳
</div>