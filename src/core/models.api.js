import { DOMAIN, PATH, MODELS_PATH } from '../constant/server.js';
import $ from './jquery.with.plugins.js';

// Consts
const modelsUrl = DOMAIN + PATH + MODELS_PATH;

/**
 * Makes a ajax to the server to get an array of all tasks
 * @param  {function} doneCallback
 * Function thats get called on finish/failure, arguments (err, tasks)
 * tasks - Array of Objects, each has id and name properties
 */
export function getAllTasks(doneCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: modelsUrl,
        method: 'GET'
    })
    .done(tasks => {
        doneCallback(undefined, tasks);
    })
    .fail(function(err) {
        doneCallback(err);
    });
}

/**
 * Makes ajax to the server to get specific task by id
 * @param  {string} id - id of the requested task
 * @param  {function} doneCallback - Function thats get called on finish/failure, arguments (err, task)
 */
export function getTaskById(id, doneCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: modelsUrl + `/${id}`,
        method: 'GET'
    })
    .done(task => {
        doneCallback(undefined, task);
    })
    .fail(function(err) {
        doneCallback(err);
    });
}

/**
 * Makes ajax to the server to add a task
 * @param {object} task - task object to add to the server
 * @param {function} doneCallback - Function thats get called on finish/failure, arguments (err, id)
 * {string} id String which is a hash string - task's id
 */
export function addTask(task, doneCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: modelsUrl,
        method: 'POST',
        data: JSON.stringify(task)
    })
    .done(id => {
        doneCallback(undefined, id);
    })
    .fail(function(err) {
        doneCallback(err);
    });
}

/**
 * Makes ajax to the server to updated an existing task by id and new task object
 * @param  {string} id - task's existing id
 * @param  {object} task - new task object
 * @param  {function} doneCallback - Function thats get called on finish/failure, arguments (err)
 */
export function updateTaskById(id, task, doneCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: modelsUrl + `/${id}`,
        method: 'PUT',
        data: JSON.stringify(task)
    })
    .done(() => {
        doneCallback();
    })
    .fail(function(err) {
        doneCallback(err);
    });
}

/**
 * Makes ajax to the server to delete existing
 * @param  {string} id - task's existing id
 * @param  {function} doneCallback - Function thats get called on finish/failure, arguments (err)
 */
export function deleteTaskById(id, doneCallback) {
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: modelsUrl + `/${id}`,
        method: 'DELETE'
    })
    .done(() => {
        doneCallback();
    })
    .fail(function(err) {
        doneCallback(err);
    });
}
