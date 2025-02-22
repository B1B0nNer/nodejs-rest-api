const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require("dotenv");

dotenv.config()

const contactsRouter = require('./routes/api/contacts.js')
const auth = require("./routes/api/users.js");

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

app.use('/api/users', auth);
app.use(`/api/contacts`, contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
  console.log(err.status, err.message);
})

module.exports = app