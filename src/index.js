const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const username = request.header('username')
  if (users.some(user => user.username === username)) {
    request.username = username
    return next()
  }
  return response.status(400).json({ error: 'user does not exist' })

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  if (users.some(user => user.username === username)) {
    return response.status(400).json({ error: 'user already exist' })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const data = users.find(user => user.username === username)
  return response.status(200).json(data.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { title, deadline } = request.body
  const newTodo = {
    id: uuidv4(),
    title,
    deadline,
    done: false,
    created_at: new Date()
  }
  const data = users.find(user => user.username === username)
  data.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id: todoId } = request.params
  const { title, deadline, done } = request.body
  const data = users.find(user => user.username === username)
  if (data.todos.some(todo => todo.id === todoId)) {
    const todos = data.todos.map((todo) => {
      if (todo.id === todoId) {
        todo.title = title
        todo.deadline = deadline
      }
      return todo
    })
    data.todos = todos
    const todo = data.todos.find(todo => todo.id === todoId)
    return response.status(201).json(todo)
  }
  return response.status(404).json({ error: 'todo item not found' })
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id: todoId } = request.params
  const data = users.find(user => user.username === username)
  if (data.todos.some(todo => todo.id === todoId)) {
    const todos = data.todos.map(todo => {
      if (todo.id === todoId) {
        todo.done = true
      }
      return todo
    })

    data.todos = todos
    const todo = data.todos.find(todo => todo.id === todoId)
    return response.status(201).json(todo)
  }
  return response.status(404).json({ error: 'todo item not found' })
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request
  const { id: todoId } = request.params
  const data = users.find(user => user.username === username)
  if (data.todos.some(todo => todo.id === todoId)) {
    const todos = data.todos.filter(todo => todo.id !== todoId)
    data.todos = todos
    return response.status(204).json(data.todos)
  }
  return response.status(404).json({ error: 'todo item not found' })
});

module.exports = app;