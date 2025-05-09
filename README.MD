# Task Management System


## Overview

A feature-rich Task Management System designed for small teams to create, assign, track, and manage tasks efficiently. This application demonstrates proficiency in full-stack development with Next.js, Node.js, and MongoDB/PostgreSQL.

## Features
### Core Features

🔒 Secure user authentication with JWT

📝 Full CRUD operations for tasks

👥 Team collaboration with task assignment

🔔 Notification system for assigned tasks

📊 Comprehensive dashboard with:

- Assigned tasks

- Created tasks

- Overdue tasks

🔍 Advanced search and filtering


## Tech Stack

### Frontend
- Next.js (React framework)

- TypeScript

- Tailwind CSS

- Redux (state management)

- Socket.io (real-time communication)

### Backend
- Node.js with ExpressJs

- TypeScript

- JWT Authentication

- MongoDB/PostgreSQL (database)

### Deployment

- Vercel/Netlify (frontend deployment)

- Railway/Render (backend deployment)

## Getting Started

### Prerequisites
- Node.js (v16+)

- npm or yarn

- MongoDB/PostgreSQL database


## Installation
Clone the repository:

bash

git clone https://github.com/Code12Git/TaskManagement

cd task-management-system

Install dependencies for both frontend and backend:



### Frontend
```bash
cd client
npm install
```

### Backend
```bash
cd ../server
npm install
```

### Set up environment variables:

- Create .env files in both client and server directories

- Example .env for backend:

- DATABASE_URL=your_database_connection_string
- JWT_SECRET=your_jwt_secret_key
Run the application:


### In server directory

```bash
npm run start:dev
```

### In client directory
```bash
npm run dev
```

- Access the application at http://localhost:3000

## Deployment
The application is deployed on:

- Frontend: https://task-management-frontend-646j011m8-code12gits-projects.vercel.app/

- Backend: https://taskmanagement-mvcu.onrender.com/api

## Approach & Architecture
### System Design

- Modular architecture with clear separation of concerns

- RESTful API design with proper status codes

- Real-time updates via WebSockets

- Optimistic UI updates for better user experience

### Security Considerations

- Password hashing with bcrypt

- JWT authentication with refresh tokens

- Input validation on both client and server

- Rate limiting for API endpoints

- CORS policy configuration

### Performance Optimizations

- Database indexing for frequent queries
 

## Future Improvements
* Role-Based Access Control (RBAC): Implement Admin, Manager, and Regular User roles with different permissions.
* Real-Time Notifications: Use WebSockets (Socket.io) to instantly notify users when a task is assigned or updated.
* Recurring Tasks: Add functionality for tasks that repeat daily, weekly, or monthly.
* Audit Logging: Maintain a log of all user actions (task created, assigned, deleted, updated) for transparency.
* Offline Support (PWA): Make your app a Progressive Web App (PWA) so it works offline and syncs when back online.
* Unit and Integration Tests: Add Jest or Mocha tests covering important functionalities and business logic.
* Analytics Dashboard: Track metrics like number of completed tasks per user, overdue trends, task completion rates.
* Customizable Notifications: Allow users to set their notification preferences (email, in-app alerts, mute certain updates).

- API Documentation: Swagger/OpenAPI documentation

### Support
For any issues or questions, please open an issue in the GitHub repository or contact the maintainer directly.

