const express = require('express');
const app = express();
const { getDefaultStatus, getNextStatus } = require('./status');

const PORT = process.env.PORT || 3001;

app.locals.Todo = { title: 'Todo', tasks: [], lastTaskId: 0 };

app.use(express.static('build'));

app.use(express.json());

app.get('/api/getTodo', (req, res) => {
  res.json(req.app.locals.Todo);
});

app.post('/api/addTask', (req, res) => {
  const { content } = req.body;
  const { Todo } = req.app.locals;
  Todo.lastTaskId++;
  Todo.tasks.push({ content, id: Todo.lastTaskId, status: getDefaultStatus() });
  res.end();
});

app.post('/api/toggleTaskStatus', (req, res) => {
  const { taskId } = req.body;
  const { Todo } = req.app.locals;
  const taskToUpdate = Todo.tasks.find((task) => task.id === taskId);
  taskToUpdate.status = getNextStatus(taskToUpdate.status);
  res.end();
});

app.post('/api/deleteTask', (req, res) => {
  const { taskId } = req.body;
  const { Todo } = req.app.locals;
  Todo.tasks = Todo.tasks.filter((task) => task.id !== taskId);
  res.end();
});

app.post('/api/setTitle', (req, res) => {
  const { title } = req.body;
  const { Todo } = req.app.locals;
  Todo.title = title;
  res.end();
});

app.post('/api/resetTodo', (req, res) => {
  const { Todo } = req.app.locals;
  Todo.title = 'Todo';
  Todo.tasks = [];
  Todo.lastTaskId = 0;
  res.end();
});

app.listen(PORT, () => console.log(`app is listening to ${PORT}`));
