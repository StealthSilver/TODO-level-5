const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Utility functions
const readTodos = () => {
    try {
        const data = fs.readFileSync('todo.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeTodos = (todos) => {
    fs.writeFileSync('todo.json', JSON.stringify(todos, null, 2), 'utf8');
};

// Routes
app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = { id: Date.now(), text: req.body.text, completed: false };
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const todos = readTodos();
    const id = parseInt(req.params.id, 10);
    const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, ...req.body } : todo
    );
    writeTodos(updatedTodos);
    res.json(updatedTodos.find(todo => todo.id === id));
});

app.delete('/todos/:id', (req, res) => {
    const todos = readTodos();
    const id = parseInt(req.params.id, 10);
    const filteredTodos = todos.filter(todo => todo.id !== id);
    writeTodos(filteredTodos);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});