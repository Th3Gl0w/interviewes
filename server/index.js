const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const port = 4242;
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  // Resolving CORS problems by accepting * as origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/hello', (req, res) => {
  res.status(200).end();
});

app.use('/login', require('./routes/login'));
app.use('/users', require('./routes/users'))
app.use('/orders', require('./routes/order'))
app.listen(port, () => {
  console.log(`Running on port ${port}`);
  sequelize.sync();
  sequelize.authenticate();
  console.log('server ready');
});
