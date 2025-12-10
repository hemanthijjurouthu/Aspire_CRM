🚀 Aspire CRM – Full-Stack Customer Relationship Management System

A modern full-stack CRM Application built with React, Node.js, Express, and MongoDB, featuring authentication, lead tracking, customer management, and a dashboard with live statistics.

✨ Features

🔐 JWT Authentication

👥 Role-based User Management

📊 Dashboard Metrics

🎯 Lead Management

👤 Customer Management

🎨 Modern MUI UI

📱 Fully Responsive

🚀 Production Ready (Vercel + Render)

🛠 Tech Stack
Frontend

React 19

Vite

Material UI

Axios

React Router DOM

Notistack

Backend

Node.js

Express.js

MongoDB + Mongoose

bcryptjs

JWT

CORS

⚡ Quick Start
🔧 1. Clone the Repository
git clone <your-repo-url>
cd Aspire_crm

📦 2. Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

🔐 3. Environment Variables
Backend → backend/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

Frontend → frontend/.env
VITE_API_URL=http://localhost:5000

🌱 4. (Optional) Seed Default Users
cd backend
npm run seed

Demo Accounts
Role	Email	Password
Admin	admin@crm.com
	admin123
Sales Agent	demo@crm.com
	password123
▶️ 5. Run the Application
Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm run dev


Frontend URL → http://localhost:5173

Backend URL → http://localhost:5000

🚀 Deployment Guide
🌐 Frontend Deployment — Vercel
1. Push frontend to GitHub
2. Import repo in Vercel
3. Add environment variable:
VITE_API_URL=https://your-backend-url.onrender.com

4. Deploy ✔️
🟨 Backend Deployment — Render
Build Command
npm install

Start Command
npm start

Add Environment Variables
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

CORS Setup (in backend)
import cors from "cors";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

📁 Project Structure
Aspire_crm/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md

📡 API Endpoints
🔐 Authentication
POST /api/auth/register
POST /api/auth/login

🎯 Leads
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id

👤 Customers
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id

👥 Users (Admin)
GET    /api/users
PUT    /api/users/:id
DELETE /api/users/:id

📊 Dashboard
GET /api/dashboard/stats

📄 License
MIT License

👨‍💻 Author

IJJUROUTHU HEMANTH
Aspire CRM — Full-Stack CRM Application