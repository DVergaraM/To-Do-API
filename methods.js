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
    add: 'Task "{0}" added to the date {1}',
    list: "Here are your tasks:\n{0}",
    list_status: "{0} tasks found with status **{1}**: \n {2}",
    no_tasks: "No tasks to show.",
    help: "Available commands:\n{0}",
    deleteTask: 'Task with id "{0}" deleted.',
    setDone: 'Task with id "{0}" marked as done.',
    setUndone: 'Task with id "{0}" marked as pending.',
    setLanguage: 'Language set to "{0}".',
    setChannel: 'Channel set to "{0}".',
    defaultActivity: "1 pending task",
    defaultActivityPlural: "{0} pending tasks",
    noTasksActivity: "No pending tasks",
    pending: "Pending",
    done: "Done",
    getConfig:
      "Server configuration: \n- Channel: <#{0}>.\n- User: {1}.\n- Language: {2}.",
    configError: "Error getting server configuration.",
    saveError: "An error occurred while saving the configuration.",
    saved: "Configuration successfully saved.",
    configReset: "Configuration has been reset to default values.",
    reminderList: "Your reminders:\n{0}",
    removeReminder: "Reminder removed.",
    addReminder: "Reminder added.",
    noReminders: "No reminders to show.",
    reminderCommands:
      "Available reminder commands:\n- add: Add a new reminder.\n- remove: Remove a reminder.\n- list: List all reminders.",
    channelNotFound:
      'Channel ID: "{0}" not found. Please check the ID and try again.',
    userNotFound:
      'User ID: "{0}" not found. Please check the ID and try again.',
    guildNotFound:
      'Guild ID: "{0}" not found. Please check the ID and try again.',
    ownerError: "Only the server owner can perform this action.",
  };
  app.locals["es"] = {
    reminder: "Tienes {0} tareas pendientes para hoy.",
    add: 'Tarea "{0}" agregada la la fecha {1}',
    list: "Aquí están tus tareas:\n{0}",
    list_status: "{0} tareas encontradas con estado **{1}**: \n {2}",
    no_tasks: "No hay tareas para mostrar.",
    help: "Comandos disponibles:\n{0}",
    deleteTask: 'Tarea con id "{0}" eliminada.',
    setDone: 'Tarea con id "{0}" marcada como realizada.',
    setUndone: 'La tarea con id "{0}" marcada como pendiente.',
    setLanguage: 'Idioma cambiado a "{0}".',
    setChannel: 'Canal cambiado a "{0}".',
    defaultActivity: "1 tarea pendiente",
    defaultActivityPlural: "{0} tareas pendientes",
    noTasksActivity: "No hay tareas pendientes",
    pending: "Pendiente",
    done: "Realizado",
    getConfig:
      "Configuración del servidor:\n- Canal: <#{0}>.\n- Usuario: {1}.\n- Idioma: {2}.",
    configError: "Error al obtener la configuración del servidor.",
    saveError: "Ocurrió un error al guardar la configuración.",
    saved: "Configuración guardada exitosamente.",
    configReset:
      "La configuración ha sido restablecida a los valores predeterminados.",
    reminderList: "Tus recordatorios:\n{0}",
    removeReminder: "Recordatorio eliminado.",
    addReminder: "Recordatorio agregado.",
    noReminders: "No hay recordatorios para mostrar.",
    reminderCommands:
      "Comandos de recordatorio disponibles:\n- add: Agregar un nuevo recordatorio.\n- remove: Eliminar un recordatorio.\n- list: Listar todos los recordatorios.",
    channelNotFound:
      'ID de canal: "{0}" no encontrado. Por favor, verifica el ID e intenta nuevamente.',
    userNotFound:
      'ID de usuario: "{0}" no encontrado. Por favor, verifica el ID e intenta nuevamente.',
    guildNotFound:
      'ID de servidor: "{0}" no encontrado. Por favor, verifica el ID e intenta nuevamente.',
    ownerError: "Solo el dueño del servidor puede realizar esta acción.",
  };
}

module.exports = { setLocals };
