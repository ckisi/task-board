const taskTitleInput = $('#task-title');
const taskDateInput = $('#task-duedate');
const taskDescInput = $('#task-description');
const taskForm = $('#task-form');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Gets the tasks array from local storage
function readTasksFromStorage() {

    // Get tasks from local storage and convert it to an array
    let tasks = JSON.parse(localStorage.getItem('tasks'));
      
    // If there is no tasks array, initialize a new one
    if (!tasks) {
        tasks = [];
    }
      
    // Returns the tasks array
    return tasks;
}

// Creates the task cards with the inputs
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card text-dark draggable mb-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<h4>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // Changes the color of the card based on when the task is due
    const now = dayjs();
    const dayjsDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (now.isSame(dayjsDueDate, 'day' || now.isSame(dayjsDueDate, 'date'))) {
        taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(dayjsDueDate)) {
        taskCard.addClass('bg-danger text-white');
    }

    // Puts all the elements into one card
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}

// Renders tasks by clearing the columns and loops through all the tasks and places them in their respective column
function renderTaskList(tasks) {
    tasks = readTasksFromStorage();
    
    // Empty out columns
    const todo = $('#todo-cards');
    todo.empty();
    const inProgress = $('#in-progress-cards');
    inProgress.empty();
    const done = $('#done-cards');
    done.empty();
    // Loop through tasks and render the task cards based on their status
    if (Array.isArray(tasks)) {
    for (let task of tasks) {
        if (task.status === 'to-do') {
            todo.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgress.append(createTaskCard(task));
        } else if (task.status === 'done') {
            done.append(createTaskCard(task));
        }
    }
    } else {
        console.error('tasks is not an array')
    }

    // Makes cards draggable
    $('.draggable').draggable({
        opacity: 0.9,
        zIndex: 100,
        helper: function (e) {
          // Makes sure that the whole card is being dragged irrespective of where it is clicked
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          return original.clone().css({
            width: original.outerWidth(),
          });
        }, 
      });    
}

// Adds a new task
function handleAddTask(event){
    event.preventDefault();

    // Trims inputs and gets values
    const taskTitle = taskTitleInput.val().trim();
    const taskDueDate = taskDateInput.val();
    const taskDescription = taskDescInput.val().trim();

    // Creates new object
    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'to-do',
    }

   /* IGNORE ==============
   let tasks = [];
    const tasksFromStorage = localStorage.getItem('tasks');
    if (tasksFromStorage) {
        try {
            tasks = JSON.parse(tasksFromStorage);
        } catch (error) {
            console.error('Error parsing tasks from localStorage:', error);
            tasks = []; // Fallback to empty array
        }
    } ====================== */
    tasks = readTasksFromStorage();
    
    // Adds new task to tasks array
    tasks.push(newTask);
    // Sets the array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Hides the modal
    $('#formModal').modal('hide');    
    // Renders the cards from task list
    renderTaskList(tasks);

    // Clear input fields
    taskTitleInput.val('');
    taskDateInput.val('');
    taskDescInput.val('');
}

// Deletes task cards
function handleDeleteTask(event){
    const projectId = $(this).attr('data-project-id');
}

// Drop function, changes task status when dropped in a column
function handleDrop(event, ui) {
    $(this).append(ui.draggable);
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId
    const newStatus = event.target.id;
    
    console.log('Task ID:', taskId);
    console.log('New Status:', newStatus);
    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // renderTaskList(tasks);
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    
    $('#task-duedate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    // Makes lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    $('#submitTask').on('click', handleAddTask);
});