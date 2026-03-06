function TaskManager() {
    this.tasks = this.loadFromStorage(); 
}

TaskManager.prototype.saveToStorage = function() {
    localStorage.setItem('taskFlowData', JSON.stringify(this.tasks));
};

TaskManager.prototype.loadFromStorage = function() {
    const savedData = localStorage.getItem('taskFlowData');
    return savedData ? JSON.parse(savedData) : {};
};

TaskManager.prototype.addTask = function(task) {
    task.id = Date.now();
    this.tasks[task.id] = task;
    this.saveToStorage();
};

TaskManager.prototype.toggleComplete = function(id) {
    if (this.tasks[id]) {
        this.tasks[id].isCompleted = !this.tasks[id].isCompleted;
        this.saveToStorage();
    }
};

TaskManager.prototype.deleteTask = function(id) {
    if (this.tasks[id]) {
        delete this.tasks[id];
        this.saveToStorage();
        return true;
    }
    return false;
};

function Task(description, category, priority) {
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.isCompleted = false;
    this.id = null;
}

const myTodos = new TaskManager();

function handleAddTask() {
    const descIn = document.getElementById('t-desc');
    const catIn = document.getElementById('t-category');
    const prioIn = document.getElementById('t-priority');

    if (descIn.value.trim() === "") {
        alert("Enter a description");
        return;
    }

    const newTask = new Task(descIn.value, catIn.value, prioIn.value);
    myTodos.addTask(newTask);
    alert("Task Added!");
    descIn.value = "";
}

function renderTasks() {
    const listEl = document.getElementById('task-display');
    const countEl = document.getElementById('count-pending');
    if (!listEl) return; 

    listEl.innerHTML = "";
    const tasksArr = Object.values(myTodos.tasks);
    
    if(countEl) countEl.innerText = tasksArr.filter(t => !t.isCompleted).length;

    if (tasksArr.length === 0) {
        listEl.innerHTML = "<div>No tasks found</div>";
        return;
    }

    tasksArr.sort((a, b) => a.isCompleted - b.isCompleted);

    tasksArr.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-card';
        item.style.border = "1px solid #ccc";
        item.style.padding = "10px";
        item.style.margin = "10px 0";
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        
        if(task.isCompleted) item.style.opacity = "0.5";

        item.innerHTML = `
            <div>
                <strong>${task.description}</strong> (${task.priority})<br>
                <small>${task.category}</small>
            </div>
            <div>
                <button onclick="handleToggle(${task.id})">Done</button>
                <button onclick="handleDelete(${task.id})">Delete</button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

function handleDelete(id) {
    if(confirm("Delete?")) {
        myTodos.deleteTask(id);
        renderTasks();
    }
}

function handleToggle(id) {
    myTodos.toggleComplete(id);
    renderTasks();
}

document.addEventListener('DOMContentLoaded', renderTasks);