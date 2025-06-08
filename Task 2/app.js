class TaskManager {
    constructor() {
        this.tasks = [];
        this.cacheKey = 'tasks_cache';
        this.cacheTimestamp = 'tasks_cache_timestamp';
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.performanceMetrics = {
            cacheHits: 0,
            cacheMisses: 0,
            apiCalls: 0
        };
        
        this.init();
    }

    async init() {
        await this.loadTasks();
        this.bindEvents();
        this.updatePerformanceDisplay();
    }

    bindEvents() {
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.getElementById('refreshCache').addEventListener('click', () => {
            this.clearCache();
            this.loadTasks();
        });
    }

    // Caching Methods
    isCacheValid() {
        const timestamp = localStorage.getItem(this.cacheTimestamp);
        if (!timestamp) return false;
        
        const now = Date.now();
        const cacheAge = now - parseInt(timestamp);
        return cacheAge < this.cacheExpiry;
    }

    getCachedTasks() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Error parsing cached tasks:', error);
            return null;
        }
    }

    setCachedTasks(tasks) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(tasks));
            localStorage.setItem(this.cacheTimestamp, Date.now().toString());
        } catch (error) {
            console.error('Error caching tasks:', error);
        }
    }

    clearCache() {
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.cacheTimestamp);
        console.log('Cache cleared');
    }

    // API Simulation Methods
    async simulateApiCall(endpoint, options = {}) {
        const delay = Math.random() * 1000 + 500; // 500-1500ms delay
        this.performanceMetrics.apiCalls++;
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.handleApiCall(endpoint, options));
            }, delay);
        });
    }

    handleApiCall(endpoint, options) {
        switch (endpoint) {
            case 'GET /api/tasks':
                return this.generateSampleTasks();
            case 'POST /api/tasks':
                const newTask = {
                    id: Date.now(),
                    text: options.task,
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                return [...this.tasks, newTask];
            case 'PUT /api/tasks':
                return this.tasks.map(task => 
                    task.id === options.taskId 
                        ? { ...task, completed: options.completed }
                        : task
                );
            case 'DELETE /api/tasks':
                return this.tasks.filter(task => task.id !== options.taskId);
            default:
                return [];
        }
    }

    generateSampleTasks() {
        const sampleTasks = [
            'Complete project documentation',
            'Review code pull requests',
            'Attend team standup meeting',
            'Update task management system',
            'Test caching implementation'
        ];

        return sampleTasks.map((text, index) => ({
            id: Date.now() + index,
            text,
            completed: Math.random() > 0.7,
            createdAt: new Date().toISOString()
        }));
    }

    // Task Management Methods
    async loadTasks() {
        this.updateCacheStatus('loading');
        
        // Check cache first
        if (this.isCacheValid()) {
            const cached = this.getCachedTasks();
            if (cached) {
                this.tasks = cached;
                this.performanceMetrics.cacheHits++;
                this.updateCacheStatus('hit');
                this.renderTasks();
                this.updatePerformanceDisplay();
                console.log('✅ Cache HIT - Loaded from cache');
                return;
            }
        }

        // Cache miss - fetch from "server"
        try {
            this.performanceMetrics.cacheMisses++;
            this.updateCacheStatus('miss');
            
            const tasks = await this.simulateApiCall('GET /api/tasks');
            this.tasks = tasks;
            this.setCachedTasks(tasks);
            this.renderTasks();
            this.updatePerformanceDisplay();
            console.log('❌ Cache MISS - Loaded from server');
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.updateCacheStatus('error');
        }
    }

    async addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();
        
        if (!taskText) return;

        const addBtn = document.getElementById('addBtn');
        addBtn.disabled = true;
        addBtn.textContent = 'Adding...';

        try {
            const updatedTasks = await this.simulateApiCall('POST /api/tasks', { task: taskText });
            this.tasks = updatedTasks;
            this.setCachedTasks(updatedTasks);
            this.renderTasks();
            this.updatePerformanceDisplay();
            
            input.value = '';
            console.log('✅ Task added and cache updated');
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            addBtn.disabled = false;
            addBtn.textContent = 'Add Task';
        }
    }

    async toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const updatedTasks = await this.simulateApiCall('PUT /api/tasks', {
                taskId,
                completed: !task.completed
            });
            
            this.tasks = updatedTasks;
            this.setCachedTasks(updatedTasks);
            this.renderTasks();
            this.updatePerformanceDisplay();
            
            console.log('✅ Task toggled and cache updated');
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    async deleteTask(taskId) {
        try {
            const updatedTasks = await this.simulateApiCall('DELETE /api/tasks', { taskId });
            this.tasks = updatedTasks;
            this.setCachedTasks(updatedTasks);
            this.renderTasks();
            this.updatePerformanceDisplay();
            
            console.log('✅ Task deleted and cache updated');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // UI Methods
    updateCacheStatus(status) {
        const indicator = document.getElementById('cacheIndicator');
        const statusText = document.getElementById('cacheStatus');

        switch (status) {
            case 'hit':
                indicator.className = 'cache-indicator';
                statusText.textContent = 'Cache Status: HIT ✅';
                break;
            case 'miss':
                indicator.className = 'cache-indicator miss';
                statusText.textContent = 'Cache Status: MISS ❌';
                break;
            case 'loading':
                indicator.className = 'cache-indicator';
                statusText.textContent = 'Cache Status: Loading...';
                break;
            case 'error':
                indicator.className = 'cache-indicator miss';
                statusText.textContent = 'Cache Status: ERROR ⚠️';
                break;
        }
    }

    updatePerformanceDisplay() {
        document.getElementById('cacheHits').textContent = this.performanceMetrics.cacheHits;
        document.getElementById('cacheMisses').textContent = this.performanceMetrics.cacheMisses;
        document.getElementById('apiCalls').textContent = this.performanceMetrics.apiCalls;
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        
        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    <h3>No tasks yet</h3>
                    <p>Add your first task to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-content">
                    <input 
                        type="checkbox" 
                        class="task-checkbox"
                        ${task.completed ? 'checked' : ''}
                        onchange="taskManager.toggleTask(${task.id})"
                    >
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button 
                        class="delete-btn"
                        onclick="taskManager.deleteTask(${task.id})"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the app
const taskManager = new TaskManager();