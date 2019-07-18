require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config');

const app = express();

//Normally store data in database, not memory
const users = [
  {
    'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
    'username': 'sallyStudent',
    'password': 'c00d1ng1sc00l',
    'favoriteClub': 'Cache Valley Stone Society',
    'newsLetter': 'true'
  },
  {
    'id': 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
    'username': 'johnBlocton',
    'password': 'veryg00dpassw0rd',
    'favoriteClub': 'Salt City Curling Club',
    'newsLetter': 'false'
  }
];

const morganOption = (NODE_ENV === 'production')
  ? 'common'
  : 'dev';

app.use(morgan(morganOption));
app.use(express.json()); //parses body of request to JSON
app.use(helmet());
app.use(cors());

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('POST request received.');
});

app.post('/register', (req, res) => {
  //get the data
  //sets newsLetter to false if not provided
  const { username, password, favoriteClub, newsLetter=false } = req.body;

  //validation code goes here

  //required input is present
  if (!username) {
    return res  
      .status(400)
      .send('Username required');
  }

  //validate content
  if (username.length < 6 || username.length > 20) {
    return res
      .status(400)
      .send('Uername must be between 6 and 20 characters');
  }

  //required input is present
  if (!password) {
    return res 
      .status(400)
      .send('Password required');
  }

  //validate content
  if (password.length < 8 || password.length > 36) {
    return res
      .status(400)
      .send('Password must be between 8 and 36 characters');
  }

  //password contains digit, using a regex here
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res
      .status(400)
      .send('Password must be contain at least one digit');
  }

  //required input is present
  if (!favoriteClub) {
    return res
      .status(400)
      .send('Favorite club required');
  }

  //make sure the club is valid from a list of predetermined values
  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'
  ];

  if (!clubs.includes(favoriteClub)) {
    return res
      .status(400)
      .send('Not a valid club');
  }

  //push data to our users array at the top
  const id = uuid();//generate a unique id using uuid, or let database auto-gen a unique id
  const newUser = {
    id,
    username,
    password,
    favoriteClub,
    newsLetter
  };
 
  users.push(newUser);

  //if all validations has passed, send
  //res.send('All validation passed');

  res
    .status(201)
    .location('http://localhost:8000/user/${id}')
    .json(newUser);
});

//DELETE /user/:userId handler
app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  //find index
  const index = users.findIndex(user => user.id === userId);

  //make sure we actually find a suser with that id
  //findIndex will return -1 if no index is found
  if (index === -1) {
    return res
      .status(404)
      .send('User not found');
  }

  users.splice(index, 1);

  res
    .status(204)
    .end();
});

app.get('/user', (req, res) => {
  res.json(users);
});

app.get('/', (req, res) => {
  res.send('A GET request');
});

//if 4 params, knows error is first; 2 or 3 params, knows req, res (next), need to have next despiten not using it (to equal 4)
app.use(function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;