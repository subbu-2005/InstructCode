# InstructCode

**InstructCode** is a collaborative coding platform designed for technical interviews, pair programming, and real-time code collaboration.

## 🚀 Features

- **Real-time Code Editor** - Monaco editor with syntax highlighting for JavaScript, Python, and Java
- **Live Video Chat** - HD video and audio using Stream SDK
- **Problem Library** - Curated coding problems with difficulty levels (Easy, Medium, Hard)
- **AI-Powered Problem Generation** - Generate coding problems using Gemini AI
- **Test Case Validation** - Automatic code execution and validation using Piston API
- **Progress Tracking** - Track solved problems, streaks, and performance
- **Admin Panel** - Manage problems, users, and platform content
- **Leaderboard** - Compete with other users based on points and solved problems

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- TailwindCSS + DaisyUI
- Monaco Editor
- Stream Video SDK
- Clerk Authentication
- Axios + React Query

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Clerk Authentication
- Google Gemini AI
- Stream Chat & Video
- Piston API (Code Execution)

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Clerk Account
- Stream Account
- Google Gemini API Key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/subbu-2005/InstructCode.git
cd InstructCode
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure environment variables**

Create `.env` in the backend directory:
```env
PORT=3000
CLIENT_URL=http://localhost:5173
DB_URL=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
GEMINI_API_KEY=your_gemini_api_key
ADMIN_EMAIL=your_admin_email
NODE_ENV=development
```

Create `.env.local` in the frontend directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

4. **Seed the database** (optional)
```bash
cd backend
node src/scripts/seedProblems.js
```

5. **Run the application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

1. **Sign up/Login** using Clerk authentication
2. **Browse Problems** - View and filter coding problems by difficulty
3. **Start Coding** - Select a problem and start coding in the editor
4. **Submit Solution** - Run test cases and validate your solution
5. **Track Progress** - View your stats, streaks, and solved problems
6. **Admin Features** - Create/edit problems, generate with AI

## 🤖 AI Features

- **Problem Generation** - Generate complete coding problems with Gemini AI
- **Test Case Generation** - Automatically create test cases for problems
- **Code Analysis** - AI-powered hints and suggestions (coming soon)

## 📝 API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems/:id/submit` - Submit solution

### Admin
- `POST /admin/problems` - Create new problem
- `PUT /admin/problems/:id` - Update problem
- `DELETE /admin/problems/:id` - Delete problem
- `POST /admin/ai/generate` - Generate problem with AI
- `POST /admin/ai/generate-testcases` - Generate test cases

### User
- `GET /api/dashboard` - Get user dashboard data
- `GET /api/progress` - Get user progress stats

## 🔒 Security

- Authentication via Clerk
- Protected routes with middleware
- Environment variables for sensitive data
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

**Subbu** - [@subbu-2005](https://github.com/subbu-2005)

## 🙏 Acknowledgments

- Original project inspiration from various coding platforms
- Enhanced with AI capabilities and modern tech stack
- Built with ❤️ for the developer community

---

**InstructCode** - Code Together, Learn Together 🚀
