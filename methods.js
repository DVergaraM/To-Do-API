const { Express } = require("express");
/**
 * Sets the locals object for the given app with language-specific strings.
 * 
 * @param {Express} app - The Express app object.
 * @returns {void}
 */
function setLocals(app) {
    app.locals["en"] = {
        reminder: "You have {0} pending tasks for today.",
        add: "Task \"{0}\" added to the date {1}",
        list: "**Pending tasks:**\n{0}\n**Completed tasks:**\n{1}",
        list_status: "**Tasks {0}:**\n{1}",
        help: "Available commands:\n{0}",
        deleteTask: "Task with id \"{0}\" deleted.",
        setDone: "Task with id \"{0}\" marked as done.",
        setUndone: "Task with id \"{0}\" marked as pending.",
        setLanguage: "Language set to \"{0}\".",
        defaultActivity: "1 pending task",
        defaultActivityPlural: "{0} pending tasks"
    }
    app.locals["es"] = {
        reminder: "Tienes {0} tareas pendientes para hoy.",
        add: "Tarea \"{0}\" agregada la la fecha {1}",
        list: "**Tareas pendientes:**\n{0}\n**Tareas realizadas:**\n{1}",
        list_status: "**Tareas {0}:**\n{1}",
        help: "Comandos disponibles:\n{0}",
        deleteTask: "Tarea con id \"{0}\" eliminada.",
        setDone: "Tarea con id \"{0}\" marcada como realizada.",
        setUndone: "La tarea con id \"{0}\" marcada como pendiente.",
        setLanguage: "Idioma cambiado a \"{0}\".",
        defaultActivity: "1 tarea pendiente",
        defaultActivityPlural: "{0} tareas pendientes"
    }
}

module.exports = setLocals;