
# Task Management System

## Overview

A comprehensive Task Management System designed for teams to create, assign, track, and manage tasks efficiently. This full-stack application features advanced collaboration tools, AI-powered task suggestions, and real-time updates.

## 🎥 Demo Video

[📽️ Watch the User Demo](https://drive.google.com/file/d/1ZTGfLhlN_sxiHXTF2Mo9C3QL-uRJGtDH/view?usp=sharing)

[📽️ Watch the Admin Demo](https://drive.google.com/file/d/1ZTGfLhlN_sxiHXTF2Mo9C3QL-uRJGtDH/view?usp=sharing)



## Features

### Core Features
- 🔒 Secure user authentication with JWT (login/register)
- 🔄 Forgot & reset password functionality
- 👤 User profile management with avatar upload
- 📝 Full CRUD operations for tasks
- 👥 Team collaboration with task assignment
- 📧 Automated email notifications for task assignments/updates
- 📊 Comprehensive admin dashboard with analytics
- 🏷️ Custom tags and labels for tasks
- � Kanban-style drag & drop task management
- 🤖 AI-powered task descriptions and priority suggestions (Google Gemini integration)
- 🔔 Real-time updates using Socket.io

### Dashboard Features
- 📈 User analytics (active users, total users, new users)
- 📉 Churn rate tracking
- 📅 User join trends (Chart.js visualizations)
- ✅ Task completion statistics
- ⏰ Overdue task tracking

### Task Management
- 🔍 Advanced search and filtering
- 🏷️ Priority levels and due dates
- 📝 Markdown support for task descriptions
- 🔄 Status workflow management (Todo → In Progress → Done)


## Tech Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Redux (state management)
- Socket.io (real-time communication)
- Chart.js (data visualization)
- Hello Pangea (drag and drop)

### Backend
- Node.js with Express
- TypeScript
- JWT Authentication
- MongoDB/PostgreSQL (database)
- Socket.io (real-time updates)
- Nodemailer (email notifications)
- Google Gemini API (AI suggestions)

### Deployment
- Vercel/Netlify (frontend deployment)
- Railway/Render (backend deployment)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB/PostgreSQL database
- OpenAI API key (for AI features)

### Installation

1.Clone the repository:
```bash
git clone https://github.com/Code12Git/TaskManagement
cd task-management-system
```

2.Install dependencies for both frontend and backend:

Frontend
```bash
cd task-management-frontend
npm install
```

Backend
```bash
cd task-management-backend
npm install
```

3.Set up environment variables:

Backend .env example:
``` bash
 PORT=3001

 NODE_ENV=development

 LOG_LEVEL=debug

 NOSQL_DATABASE_URL='your mongodb_url'

 SECRET_KEY=your-secret-key

 JWT_REFRESH_SECRET=your-jwt-refresh-secret

 EMAIL_USER=your-email@example.com

 EMAIL_PASS=your-email-app-password

 ALLOWED_ORIGINS=https://your-frontend-domain.com

 ADMIN_EMAIL=admin@example.com

 ADMIN_PASSWORD=your-admin-password

 CLOUD_NAME=your-cloudinary-cloud-name

 API_KEY=your-cloudinary-api-key

 API_SECRET=your-cloudinary-api-secret
```
Frontend .env.example:

```bash
 NEXT_PUBLIC_API_URL=http://localhost:5000/api

 NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```
4.Run the application:

In server directory:

```bash
npm run start
```
In client directory:

```bash
npm run dev
```

5.Access the application at http://localhost:3000

## Deployment
The application is deployed on:

- Frontend(User): https://task-management-pi-virid.vercel.app

- Frontend(Admin):https://task-management-admin-mu.vercel.app/

- Backend: https://taskmanagement-mvcu.onrender.com/api


## System Architecture

### Key Design Decisions

- Modular architecture with clear separation of concerns

- RESTful API design with proper status codes

- Real-time updates via WebSockets (Socket.io)

- Optimistic UI updates for better user experience

- AI integration for task enhancement suggestions

- Comprehensive analytics dashboard

### Security Considerations

- Password hashing with bcrypt

- JWT authentication with refresh tokens

- Input validation on both client and server

- Rate limiting for API endpoints

- CORS policy configuration

- Secure file upload handling

### Performance Optimizations

- Database indexing for frequent queries

- Client-side caching with Redux

- Lazy loading for dashboard components

- Optimized image handling for avatars

## Future Improvements

### Planned Features

🔔 Automated due date reminders (push notifications)

📅 Calendar view for tasks

📱 Mobile application (React Native)

📊 Advanced reporting and analytics

🗂️ Project management (grouping tasks into projects)

🔄 Task dependencies and relationships

📤 CSV/PDF export options

### Technical Enhancements
✅ Comprehensive unit and integration testing

📜 API documentation with Swagger/OpenAPI

🚀 CI/CD pipeline implementation

🛡️ Enhanced security audits

⚡ Performance benchmarking and optimization

## Support

For any issues or questions, please:

- Open an issue in the GitHub repository

- Contact the maintainer directly

Contributions are welcome! Please fork the repository and submit a pull request.


