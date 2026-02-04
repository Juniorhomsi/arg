// Sélection des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const remainingTasksEl = document.getElementById('remainingTasks');

// Tableau pour stocker les tâches
let tasks = [];

// Charger les tâches depuis localStorage au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateUI();
});

// Ajouter une tâche en cliquant sur le bouton
addTaskBtn.addEventListener('click', addTask);

// Ajouter une tâche en appuyant sur Entrée
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Animation pour indiquer que le champ est vide
        taskInput.style.borderColor = '#ff4757';
        setTimeout(() => {
            taskInput.style.borderColor = '#e0e0e0';
        }, 500);
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    taskInput.value = '';
    saveTasks();
    updateUI();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateUI();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    updateUI();
}

function updateUI() {
    // Mettre à jour la liste des tâches
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <button class="btn-delete" onclick="deleteTask(${task.id})">
                Supprimer
            </button>
        `;
        
        taskList.appendChild(li);
    });

    // Afficher/masquer l'état vide
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        taskList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        taskList.classList.remove('hidden');
    }

    // Mettre à jour les statistiques
    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    remainingTasksEl.textContent = remaining;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Rendre les fonctions globales pour les événements onclick
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
