const express = require("express");
const cors = require("cors");
const { v4: uuidv4, v4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "user not found" });
  }

  request.user = user;

  return next();
}

app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const userAlreadyExists = users.some((user) => {
    return user.username === username;
  });

  if (userAlreadyExists) {
    return response.status(400).json({ error: "user already exists" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(201).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => {
    return todo.id === id;
  });

  if (!todo) {
    return response.status(404).json({ error: "TODO not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
