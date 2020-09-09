const express = require('express');
const redis = require('redis');
const app = express();
const DataHandler = require('./dataHandler');
const { getDefaultStatus, getNextStatus } = require('./status');
const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || '127.0.0.1:6379';

const redisClient = redis.createClient();
const dataHandler = new DataHandler(redisClient);

dataHandler.getTodo().then((todo) => {
  const defaultTodo = { title: 'Todo', tasks: [], lastTaskId: 0 };
  app.locals.Todo = todo || defaultTodo;
});

app.use(express.static('build'));

app.use(express.json());

const updateDb = function(callback) {
  const { Todo } = app.locals;
  dataHandler.setTodo(Todo).then((status) => status && callback());
};

app.get('/api/getTodo', (req, res) => {
  res.json(req.app.locals.Todo);
});

app.post('/api/addTask', (req, res) => {
  const { content } = req.body;
  const { Todo } = req.app.locals;
  Todo.lastTaskId++;
  Todo.tasks.push({ content, id: Todo.lastTaskId, status: getDefaultStatus() });
  updateDb(() => res.end());
});

app.post('/api/toggleTaskStatus', (req, res) => {
  const { taskId } = req.body;
  const { Todo } = req.app.locals;
  const taskToUpdate = Todo.tasks.find((task) => task.id === taskId);
  taskToUpdate.status = getNextStatus(taskToUpdate.status);
  updateDb(() => res.end());
});

app.post('/api/deleteTask', (req, res) => {
  const { taskId } = req.body;
  const { Todo } = req.app.locals;
  Todo.tasks = Todo.tasks.filter((task) => task.id !== taskId);
  updateDb(() => res.end());
});

app.post('/api/setTitle', (req, res) => {
  const { title } = req.body;
  const { Todo } = req.app.locals;
  Todo.title = title;
  updateDb(() => res.end());
});

app.post('/api/resetTodo', (req, res) => {
  const { Todo } = req.app.locals;
  Todo.title = 'Todo';
  Todo.tasks = [];
  Todo.lastTaskId = 0;
  updateDb(() => res.end());
});

app.listen(PORT, () => console.log(`app is listening to ${PORT}`));
