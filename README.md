# 📚 Library Management System

A full-stack library management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system helps libraries manage their book inventory, track member information, and handle book borrowing operations efficiently.

## ✨ Key Features

- **User Authentication** - Secure login and registration system
- **Role-Based Access** - Different permissions for Admin and Librarian roles
- **Book Management** - Add, update, search, and organize books with pagination
- **Member Management** - Maintain member records and track borrowing history
- **Issue & Return System** - Track book loans with real-time availability updates
- **Email Notifications** - Automated notifications for book transactions
- **Modern Dashboard** - View statistics and recent activity at a glance
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🗂️ Project Structure

```
library-management-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Application entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # State management
    │   ├── pages/       # Application pages
    │   ├── utils/       # API configuration
    │   └── App.jsx      # Main component
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- A Gmail account (for email notifications)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd library-management-system
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your configuration

npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create environment file (optional)
cp .env.example .env

npm run dev
```

The backend runs on port 5000 and frontend on port 3000 by default.

## ⚙️ Configuration

Both backend and frontend require environment variables. Copy the `.env.example` files and configure them with your settings:

- **Backend**: Database connection, JWT secret, email service credentials
- **Frontend**: API endpoint URL

> **Note**: Never commit your `.env` files to version control. They contain sensitive information.

## 👥 User Roles

**Admin**
- Full system access
- Can manage books, members, and transactions
- Can delete records

**Librarian**
- Can add and update books and members
- Can process book issues and returns
- Cannot delete records

## 🛠️ Tech Stack

**Backend**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email service

**Frontend**
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## 🚢 Deployment

This application can be deployed using various platforms:

- **Backend**: Render, Heroku, Railway, or any Node.js hosting service
- **Frontend**: Vercel, Netlify, or similar static hosting platforms
- **Database**: MongoDB Atlas (free tier available)

Make sure to configure environment variables on your hosting platform.

## 📝 Usage

1. Register an account (first user can be set as admin)
2. Log in to access the dashboard
3. Add books to the library inventory
4. Register library members
5. Issue books to members and track returns
6. View statistics and manage operations from the dashboard

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

---

Built with the MERN Stack
