// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
  const taskInput = document.getElementById('task');
  const noteInput = document.getElementById('note');

  if (taskInput.value === '') {
    alert('Please enter a task.');
    return;
  }

  const task = taskInput.value;
  const note = noteInput.value;
  const taskItem = createTaskItem(task, note, false);

  // Save task to local storage
  saveTaskToLocalStorage(task, note, false);

  document.getElementById('tasks').appendChild(taskItem);

  // Clear input fields
  taskInput.value = '';
  noteInput.value = '';
}

function createTaskItem(task, note, completed) {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');
  if (completed) {
    taskDiv.classList.add('completed-task');
  }
  taskDiv.innerHTML = `
        <p>${task}</p>
        <p class="notes">${note}</p>
        <button class="complete-button" onclick="toggleComplete(this)">Complete</button>
        <button class="edit-button" onclick="editTask(this)">Edit</button>
        <button class="delete-button" onclick="deleteTask(this)">Delete</button>
    `;
  return taskDiv;
}

function saveTaskToLocalStorage(task, note, completed) {
  let tasks = [];
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push({ task, note, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  if (localStorage.getItem('tasks')) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
      const taskItem = createTaskItem(task.task, task.note, task.completed);
      document.getElementById('tasks').appendChild(taskItem);
    });
  }
}

function editTask(button) {
  const taskDiv = button.parentElement;
  const taskText = taskDiv.querySelector('p');
  const noteText = taskDiv.querySelector('.notes');

  const updatedTask = prompt('Edit task:', taskText.textContent);
  const updatedNote = prompt('Edit note:', noteText.textContent);

  if (updatedTask !== null && updatedNote !== null) {
    taskText.textContent = updatedTask;
    noteText.textContent = updatedNote;

    // Update task in local storage
    updateTaskInLocalStorage(taskDiv, updatedTask, updatedNote);
  }
}

function updateTaskInLocalStorage(taskDiv, updatedTask, updatedNote) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = Array.from(taskDiv.parentElement.children).indexOf(taskDiv);

  tasks[taskIndex].task = updatedTask;
  tasks[taskIndex].note = updatedNote;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleComplete(button) {
  const taskDiv = button.parentElement;
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = Array.from(taskDiv.parentElement.children).indexOf(taskDiv);

  // Toggle completed status in local storage
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Toggle completed class in the UI
  taskDiv.classList.toggle('completed-task');
}

function deleteTask(button) {
  const taskDiv = button.parentElement;
  const tasksContainer = taskDiv.parentElement;
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = Array.from(tasksContainer.children).indexOf(taskDiv);

  // Remove task from local storage
  tasks.splice(taskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Remove task from the UI
  taskDiv.remove();
}
