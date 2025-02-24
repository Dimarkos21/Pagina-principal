const todosRouter = require('express').Router();
const User = require('../models/user');
const Todo = require('../models/todo'); 

todosRouter.get("/", async (request, response) => {
    const user = request.user;
    console.log('User en GET /:', user); // Verifica que request.user esté definido

    if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
    }

    const todos = await Todo.find({ user: user._id });
    console.log('Todos:', todos); // Verifica las tareas encontradas

    return response.status(200).json(todos);
});

todosRouter.post("/", async (request, response) => {
    const user = request.user;
    console.log('User en POST /:', user); // Verifica que request.user esté definido

    if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
    }

    const { text } = request.body;
    console.log('Texto recibido:', text); // Verifica el texto recibido

    const newTodo = new Todo({
        text,
        checked: false,
        user: user._id
    });

    const savedTodo = await newTodo.save();
    user.todos = user.todos.concat(savedTodo._id);
    await user.save();
    console.log('Tarea guardada:', savedTodo); // Verifica la tarea guardada

    return response.status(200).json(savedTodo);
});

todosRouter.delete("/:id", async (request, response) => {
    const user = request.user;
    console.log('User en DELETE /:id:', user); // Verifica que request.user esté definido

    if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
    }

    await Todo.findByIdAndDelete(request.params.id);
    user.todos = user.todos.filter(todo => todo.toString() !== request.params.id);
    await user.save();
    console.log('Usuario actualizado después de eliminar:', user); // Verifica el usuario actualizado

    return response.status(204).end();
});

todosRouter.patch("/:id", async (request, response) => {
    const user = request.user;
    console.log('User en PATCH /:id:', user); // Verifica que request.user esté definido

    if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
    }

    const { checked } = request.body;
    console.log('Checked recibido:', checked); // Verifica el valor de checked recibido

    await Todo.findByIdAndUpdate(request.params.id, { checked });
    console.log('Tarea actualizada'); // Verifica que la tarea ha sido actualizada

    return response.sendStatus(200);
});

module.exports = todosRouter;
