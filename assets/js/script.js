const taskTitleInput = $('#task-title');
const taskDateInput = $('#task-duedate');
const taskDescInput = $('#task-description');
const taskForm = $('#task-form');

// Retrieve tasks and nextId from localStorage
let nextId = JSON.parse(localStorage.getItem('nextId'));

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function readTasksFromStorage() {


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
    const cardHeader = $('<h4>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    const now = dayjs();
    const dayjsDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (now.isSame(dayjsDueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(dayjsDueDate)) {
        taskCard.addClass('bg-danger text-white');
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList(tasks) {
    const todo = $('#to-do');
    todo.empty();
    const inProgress = $('#in-progress')
    inProgress.empty();
    const done = $('#done')
    done.empty();
    for (let task of tasks) {
        $('#to-do').append(createTaskCard(task));
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleInput.val().trim();
    const taskDueDate = taskDateInput.val();
    const taskDescription = taskDescInput.val().trim();

    const newTask = {
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
    }

    let tasks = [];
    const tasksFromStorage = localStorage.getItem('tasks');
    if (tasksFromStorage) {
        try {
            tasks = JSON.parse(tasksFromStorage);
        } catch (error) {
            console.error('Error parsing tasks from localStorage:', error);
            tasks = []; // Fallback to empty array
        }
    }
    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    $('#formModal').modal('hide');    
   
    renderTaskList(tasks);

    // Clear input fields
    taskTitleInput.val('');
    taskDateInput.val('');
    taskDescInput.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
// Check if tasks key exists in local storage
// If tasks key doesn't exist or is null, initialize tasks as an empty array
/* let taskList = localStorage.getItem('tasks');
let tasks;

if (taskList === null) {
    tasks = [];
} else {
    try {
        // Check if taskList is a valid JSON string
        if (taskList.trim().startsWith('{') || taskList.trim().startsWith('[')) {
            tasks = JSON.parse(taskList);
        } else {
            console.error('Invalid JSON format');
            tasks = [];
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
        tasks = [];
    }
}
*/


$('#task-duedate').datepicker({
    changeMonth: true,
    changeYear: true,
});

$('#submitTask').on('click', handleAddTask);
});