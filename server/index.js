const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());
app.use(cors())

const secretKey = 'yourSecretKey';

const candidates = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // Add more users as needed
];

const companies = [
  {username: 'company1', password: 'pwd1'},
  {username: 'company2', password: 'pwd2'}
]

app.post('/api/login', (req, res) => {
    console.log('entered /api/login router')
    const { username, password } = req.body;
    const candidate = candidates.find((u) => u.username === username && u.password === password);
    const company = companies.find((u) => u.username === username && u.password === password)
    if(!candidate && !company) {
      res.status(401).json({ message: 'User Does not exist, wrong credentials!'})
    }
    if (candidate) {
        // If the user is found in the database, generate a JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else if (company){
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.json({token})
    } else {
        // Authentication failed
        res.status(401).json({ message: 'Authentication failed' });
    }
});

app.post('/api/signup', (req, res) => {
  const {username, password, user} = req.body;
  const candidate = candidates.find((u) => u.username === username && u.password === password);
  const company = companies.find((u) => u.username === username && u.password === password)
  if(candidate || company){
    console.log('fouind existing user')
    res.send(409).json({ message: 'User Already Exists!'})
  }
  if(user==='candidate'){
    candidates.push({
      username: username,
      password: password
    })
  } else if (user === 'employer'){
    companies.push({
      username: username,
      password: password
    })
  } 
  const token = jwt.sign({ username }, secretKey, {expiresIn: '1hr'})
  res.json(token)
})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
