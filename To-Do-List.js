const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const completedTaskCount = document.getElementById("completed-task-count");
const uncompletedTaskCount = document.getElementById("uncompleted-task-count");
const congratsMessage = document.getElementById("congrats-message");

// Load tasks when page loads
window.onload = function () {
  loadTasksFromStorage();
  taskInput.focus();
};

// Add task when pressing Enter
taskInput.addEventListener("keydown", handleTaskInput);

// Event handler for the Enter key
function handleTaskInput(event) {
  if (event.key === "Enter") {
    addNewTask();
  }
}

// Function to update counters
function updateCounters() {
  const totalTasks = taskList.children.length;
  let completedTasks = 0;
  
  // Count completed tasks by checking the completed class
  Array.from(taskList.children).forEach(task => {
    if (task.classList.contains("completed")) {
      completedTasks++;
    }
  });
  
  // Update the UI counters
  completedTaskCount.textContent = completedTasks;
  uncompletedTaskCount.textContent = totalTasks - completedTasks;

  // Display congrats message if all tasks are completed
  congratsMessage.style.display = (completedTasks === totalTasks && totalTasks > 0) ? "block" : "none";
}

// Function to save tasks to localStorage
function saveTasksToStorage() {
  const tasksData = Array.from(taskList.children).map(task => {
    return {
      text: task.querySelector(".task-text").textContent,
      completed: task.classList.contains("completed")
    };
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// Function to load tasks from localStorage
function loadTasksFromStorage() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(task => createTaskElement(task.text, task.completed));
  updateCounters();
}

// Function to create and append a new task item
function createTaskElement(taskText, isCompleted = false) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.innerHTML = `
    <div class="task-details">
      <input type="checkbox" class="task-checkbox" ${isCompleted ? "checked" : ""}>
      <span class="task-text">${taskText}</span>
    </div>
    <div class="task-actions">
      <button class="edit-task-btn" ${isCompleted ? "disabled" : ""}>Edit</button>
      <button class="delete-task-btn">Delete</button>
    </div>
  `;
  
  if (isCompleted) taskItem.classList.add("completed");

  taskList.appendChild(taskItem);
  updateCounters();

  // Task checkbox toggle for completion
  const checkbox = taskItem.querySelector(".task-checkbox");
  checkbox.addEventListener("change", () => {
    taskItem.classList.toggle("completed", checkbox.checked);
    taskItem.querySelector(".edit-task-btn").disabled = checkbox.checked; // Disable edit if task is completed
    updateCounters();
    saveTasksToStorage();
  });

  // Task delete button click event
  const deleteButton = taskItem.querySelector(".delete-task-btn");
  deleteButton.addEventListener("click", () => {
    taskItem.remove();
    updateCounters();
    saveTasksToStorage();
  });

  // Task edit button click event (only for uncompleted tasks)
  const editButton = taskItem.querySelector(".edit-task-btn");
  editButton.addEventListener("click", () => {
    if (!taskItem.classList.contains("completed")) {
      const taskSpan = taskItem.querySelector(".task-text");
      taskSpan.contentEditable = true;
      taskSpan.focus();
      taskSpan.addEventListener("blur", saveEditedTask);
      taskSpan.addEventListener("keypress", (event) => {
        if (event.key === "Enter") saveEditedTask();
      });

      function saveEditedTask() {
        if (!taskSpan.textContent.trim()) {
          alert("Task cannot be empty!");
          taskSpan.textContent = taskText;
        }
        taskSpan.contentEditable = false;
        saveTasksToStorage();
      }
    }
  });
  
  saveTasksToStorage();
}

// Function to add a ew task
function addNewTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    createTaskElement(taskText);
    taskInput.value = "";
  } else {
    alert("Please enter a task!");
  }
}
