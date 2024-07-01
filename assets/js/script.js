const taskTitleInput = $('#task-title');
const taskDateInput = $('#task-duedate');
const taskDescInput = $('#task-description');
const taskForm = $('#task-form');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

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
        .attr('data-task-id', task.id)
        .draggable({  // Making the cards draggable here instead
            opacity: 0.9,
            zIndex: 100,
            helper: function (e) {
                const original = $(e.target).hasClass('ui-draggable')
                    ? $(e.target)
                    : $(e.target).closest('.ui-draggable');
                return original.clone().css({
                    width: original.outerWidth(),
            });
            }
        });
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
        cardDeleteBtn.addClass('border-light');
    }

    // Changes the card to white if it's in the done column
    if (task.status === 'done') {
        taskCard.removeClass('bg-danger bg-warning text-white');
    }

    // Puts all the elements into one card
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}

// Renders tasks by clearing the columns and loops through all the tasks and places them in their respective column
function renderTaskList(tasks) {
    
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
}

// Adds a new task
function handleAddTask(event){
    event.preventDefault();
    
    // Trims inputs and gets values
    const taskTitle = taskTitleInput.val().trim();
    const taskDueDate = taskDateInput.val();
    const taskDescription = taskDescInput.val().trim();

    // Checks if all three fields are filled
    if (!taskTitle || !taskDueDate || !taskDescription) {
        window.alert('Please fill all three fields');
    } else {
    // Creates new object
    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'to-do',
    }
    let tasks = readTasksFromStorage();
    
    console.log('tasks before adding:', tasks);
    // Adds new task to tasks array
    tasks.push(newTask);
    console.log('tasks after adding:', tasks);
    // Sets the array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Hides the modal
    $('#formModal').modal('hide');    
    // Clear input fields
    taskTitleInput.val('');
    taskDateInput.val('');
    taskDescInput.val('');

    // Empty out columns
    const todo = $('#todoCards');
    todo.empty();
    const inProgress = $('#inProgressCards');
    inProgress.empty();
    const done = $('#doneCards');
    done.empty();
    tasks = readTasksFromStorage();
    // Renders the cards from task list
    renderTaskList(tasks);
    
    // The only way to fix UI bug
    location.reload();
    }
}

// Deletes task cards
function handleDeleteTask(event){
    event.preventDefault();
    const taskId = $(this).attr('data-task-id');
        
    // Remove the card
    $(this).closest('.card').remove();
        
    // Filter out the remaining tasks
    let tasks = readTasksFromStorage();
    tasks = tasks.filter(task => task.id !== taskId);
        
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Drop function, changes task status when dropped in a column
function handleDrop(event, ui) {
    $(this).append(ui.draggable);
    
    const tasks = readTasksFromStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const targetCard = event.target;
    
    // Get the element with the ID contained in event.target.id
    const targetId = event.target.id;
    const targetElement = document.getElementById(targetId);
    
    // Get the parent element of the target element
    const parentElement = targetElement.parentNode;
    
    // Get the status ID from the parent element
    const newStatus = parentElement.id;

    // Update the status of the task in the tasks array
    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
            break;
        }
    }
    
    // Save the updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}

// When the page loads, renders the task list, adds event listeners, makes lanes droppable, and makes the due date field a date picker
$(document).ready(function () {
    const tasks = readTasksFromStorage();
    renderTaskList(tasks);
    
    $('#task-duedate').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    // Makes lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // Submits modal, adds new task, creates new card, renders cards. Using click event instead of submit event because submit doesn't seem to be working with this
    $('#submitTask').on('click', handleAddTask);

    // Event delegation so the delete buttons work
    $('#task-display').on('click', '.btn-delete-task', handleDeleteTask);
});