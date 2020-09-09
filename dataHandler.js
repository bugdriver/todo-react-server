class DataHandler {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  getTodo() {
    return new Promise((resolve, reject) => {
      this.dbClient.get('todo', (err, value) => {
        if (err) {
          reject(err);
        }
        const todo = JSON.parse(value);
        resolve(todo);
      });
    });
  }

  setTodo(todo) {
    return new Promise((resolve, reject) => {
      this.dbClient.set('todo', JSON.stringify(todo), (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

module.exports = DataHandler;
