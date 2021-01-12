const express = require('express')
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongoConnect = require('./databaseAuth/mongoConnect');
const flash = require('express-flash')
const session = require('express-session')

// Create the express app
const app = express()
const port = process.env.PORT || 5000
mongoConnect();

// Routes and middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view-engine','ejs');
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
// Error handlers

app.use('/api',routes);

app.use(function fourOhFourHandler (req, res) {
  res.status(404).send()
})
app.use(function fiveHundredHandler (err, req, res, next) {
  console.error(err)
  res.status(500).send()
})



// Start server
app.listen(port, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Server Started at :${port}`)
})
