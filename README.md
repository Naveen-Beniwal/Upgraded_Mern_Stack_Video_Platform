# 🎬 Advanced MERN Stack Video Platform

A full-stack Netflix-inspired streaming platform built with MERN stack, featuring advanced authentication, TMDB integration, and a modern responsive UI.

## ⭐ Core Features

### 🔐 Advanced Authentication System
- **Secure Email Verification Flow**
  - Custom verification token generation
  - Token expiration handling
  - Automatic token renewal
  - Mailjet integration for reliable email delivery
  
- **Enhanced Security**
  - JWT-based authentication
  - Password encryption using bcrypt
  - Protected route middleware
  - Session management

- **User Management**
  - Unique username validation
  - Duplicate email prevention
  - Automatic avatar assignment
  - Search history tracking

### 🎯 Content Discovery Engine
- **Multi-Category Search System**
  - Movies search with TMDB integration
  - TV Shows discovery functionality
  - People/Cast search capabilities
  - Personalized search history

- **TMDB API Integration**
  - Custom service layer for API calls
  - Error handling and response formatting
  - Rate limiting management
  - Data transformation and caching

### 🏗️ Backend Architecture
- **RESTful API Design**
  - Clean and modular controller architecture
  - Robust error handling
  - Scalable and maintainable codebase

- **Environment Configuration**
  - Secure environment variable management
  - Configurable through .env file

- **Database Integration**
  - MongoDB with Mongoose for data modeling
  - Efficient query processing
  - Schema validation

### 🌐 Frontend Features
- **Modern UI with React + Vite**
  - Fast refresh and HMR (Hot Module Replacement)
  - Responsive design with TailwindCSS
  - User-friendly forms and navigation

- **Authentication Screens**
  - User-friendly sign-up and login forms
  - Email verification prompts
  - Profile creation for kids

- **Content Sections**
  - Informative content sections with images and descriptions
  - Downloadable content showcase
  - Multi-device support

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository
```bash
git clone https://github.com/Naveen-Beniwal/Upgraded_Mern_Stack_Video_Platform.git
Install backend dependencies
bash
cd Upgraded_Mern_Stack_Video_Platform
npm install
Install frontend dependencies
bash
cd frontend
npm install
Set up environment variables
Create a .env file in the root directory
Add the required environment variables
env
PORT=
MONGO_URI=
JWT_SECRET=
NODE_ENV=
TMDB_API_KEY=
CLIENT_URL=
ACTIVE_LINK=
MAILJET_API_KEY=
MAILJET_SECRET_KEY=
Start the server
npm start
Start the frontend
bash
cd frontend
npm run dev
📄 API Endpoints
Authentication Routes
Code
POST /api/v1/auth/signup - Register new user
GET /api/v1/auth/verify-email - Verify email address
POST /api/v1/auth/login - User login
GET /api/v1/auth/logout - User logout
GET /api/v1/auth/check - Check user authentication
Protected Routes
Code
/api/v1/movie/* - Movie-related endpoints
/api/v1/tv/* - TV show-related endpoints
/api/v1/search/* - Search functionality endpoints
Search Routes
Code
GET /api/v1/search/movie/:query - Search movies
GET /api/v1/search/tv/:query - Search TV shows
GET /api/v1/search/person/:query - Search people
GET /api/v1/search/history - Get user's search history
