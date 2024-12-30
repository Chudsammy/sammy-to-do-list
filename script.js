const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to send a notification
function sendNotification(task) {
    if (Notification.permission === "granted") {
        new Notification("Task Reminder", {
            body: `Reminder: ${task.text} is due!`,
            icon: 'icon.png' // Optional: Add an icon for the notification
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Task Reminder", {
                    body: `Reminder: ${task.text} is due!`
                });
            }
        });
    }
}

// Function to check for due tasks
function checkDueTasks() {
    const currentTime = new Date();
    tasks.forEach((task, index) => {
        const taskTime = new Date(task.date);
        if (taskTime <= currentTime && !task.completed && !task.notified) {
            sendNotification(task);
            task.notified = true; // Mark as notified
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
}

// Set an interval to check for due tasks every minute
setInterval(checkDueTasks, 60000); // Check every 60 seconds

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'checked' : '';
        li.innerHTML = `
            <span><div>${task.text}</div> - ${new Date(task.date).toLocaleString()}</span>
            <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompletion(${index})">
        `;
        taskList.appendChild(li);
    });
}

// Function to add a task
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value;
    const taskDateValue = taskDate.value;

    if (taskText && taskDateValue) {
        tasks.push({ text: taskText, date: taskDateValue, completed: false, notified: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        taskDate.value = '';
        renderTasks();
    }
});

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to toggle task completion
function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to search tasks
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'checked' : '';
        li.innerHTML = `
            <span>${task.text} - ${new Date(task.date).toLocaleString()}</span>
            <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompletion(${index})">
        `;
        taskList.appendChild(li);
    });
});

// Initial render
renderTasks();
