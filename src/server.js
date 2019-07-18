const app = require('./app');

const { PORT, NODE_ENV } = require('./config');

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} running in ${NODE_ENV} mode`);
});