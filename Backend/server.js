const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory task storage (in production, use a database)
let tasks = [
  {
    id: 1,
    title: "Finish report",
    description: "Complete Q3 summary",
    status: "todo",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Team meeting",
    description: "Discuss project goals",
    status: "done",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Code review",
    description: "Review pull requests from team",
    status: "in progress",
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

// Helper function to validate task data
const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!task.description || typeof task.description !== 'string') {
    errors.push('Description is required and must be a string');
  }
  
  const validStatuses = ['todo', 'in progress', 'done'];
  if (!task.status || !validStatuses.includes(task.status)) {
    errors.push('Status must be one of: todo, in progress, done');
  }
  
  return errors;
};

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all tasks
app.get('/api/tasks', asyncHandler(async (req, res) => {
  // Simulate potential network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
  
  let filteredTasks = [...tasks];
  
  // Filter by status if provided
  if (status && ['todo', 'in progress', 'done'].includes(status)) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  // Sort tasks
  filteredTasks.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  res.json({
    success: true,
    data: filteredTasks,
    count: filteredTasks.length
  });
}));

// Get single task
app.get('/api/tasks/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  res.json({
    success: true,
    data: task
  });
}));

// Create new task
app.post('/api/tasks', asyncHandler(async (req, res) => {
  const { title, description, status = 'todo' } = req.body;
  
  const taskData = { title, description, status };
  const errors = validateTask(taskData);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    data: newTask,
    message: 'Task created successfully'
  });
}));

// Update task
app.put('/api/tasks/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  const { title, description, status } = req.body;
  const taskData = { 
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    status: status || tasks[taskIndex].status
  };
  
  const errors = validateTask(taskData);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: tasks[taskIndex],
    message: 'Task updated successfully'
  });
}));

// Delete task
app.delete('/api/tasks/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTask,
    message: 'Task deleted successfully'
  });
}));

// Get task statistics
app.get('/api/tasks/stats/summary', asyncHandler(async (req, res) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in progress').length,
    done: tasks.filter(t => t.status === 'done').length
  };
  
  res.json({
    success: true,
    data: stats
  });
}));

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});