# Task Manager - Dockerized Full Stack Application

A modern, responsive task management application built with React frontend and Node.js/Express backend, fully containerized with Docker.

## Features

### Core Functionality
- **Task Management**: Create, read, update, and delete tasks
- **Status Tracking**: Todo, In Progress, and Done status management
- **Real-time Updates**: Instant status changes with optimistic UI updates
- **Filtering**: Filter tasks by status (All, Todo, In Progress, Done)
- **Statistics Dashboard**: Overview of task completion metrics

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback for all async operations
- **Toast Notifications**: Real-time feedback for user actions

### Technical Features
- **RESTful API**: Well-structured backend with proper HTTP methods
- **Input Validation**: Both frontend and backend validation
- **Error Recovery**: Automatic retry mechanisms and error boundaries
- **Docker Support**: Full containerization for easy deployment
- **Health Checks**: API health monitoring endpoints

## Architecture

```
task-manager/
├── docker-compose.yml          # Multi-container orchestration
├── backend/                    # Node.js/Express API
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/                   # React application
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js
│       └── components/
│           └── TaskManager.js
└── README.md
```

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Create the project structure**
   ```bash
   mkdir -p backend frontend/src/components frontend/public
   ```

3. **Build and start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports filtering and sorting)
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

### Statistics
- `GET /api/tasks/stats/summary` - Get task statistics

### Health
- `GET /api/health` - Health check endpoint


## Development

### Running in Development Mode

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start    # Starts React development server
   ```

### Environment Variables

**Backend (`backend/.env`)**
```env
NODE_ENV=development
PORT=5000
```

**Frontend (`frontend/.env`)**
```env
REACT_APP_API_URL=http://localhost:5000
```

## Production Deployment

### Using Docker Compose
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   npm install --production
   npm start
   ```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **UUID** - Unique identifier generation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Testing

### Manual Testing Checklist
- [ ] Create new task
- [ ] Update task status
- [ ] Edit task details
- [ ] Delete task
- [ ] Filter tasks by status
- [ ] Responsive design on mobile
- [ ] Error handling (network errors)
- [ ] Loading states

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get statistics
curl http://localhost:5000/api/tasks/stats/summary

# Test error handling
curl http://localhost:5000/api/nonexistent
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :5000
   
   # Kill processes if needed
   kill -9 <PID>
   ```

2. **Docker build issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Network connectivity issues**
   ```bash
   # Check container logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Inspect network
   docker network ls
   docker network inspect task-manager_task-network
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Acknowledgments

- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Built with [React](https://reactjs.org/) and [Node.js](https://nodejs.org/)
