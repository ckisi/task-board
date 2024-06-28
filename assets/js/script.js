// Retrieve tasks and nextId from localStorage
let nextId = JSON.parse(localStorage.getItem('nextId'));

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function readTasksFromStorage() {
    let taskList = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
        tasks = [];
    }
    return tasks;
}

// Generates a unique task id
function generateTaskId() {
    card.crypto = randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<article>')
        .addClass('card text-dark bg-light mb-3')
        .attr('data-task-id', task.id);
    const taskHeader = $('<h4>').addClass('card-header h4').text(task.name);
    const taskDescription = $('<p>').addClass('card-text').text(task.description);
    const taskDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const taskDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
    taskDeleteBtn.on('click', handleDeleteTask);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // const taskName
    // const taskDescription
    // const taskDueDate
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#task-duedate').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
