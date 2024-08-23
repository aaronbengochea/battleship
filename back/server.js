require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
//const db = require('./queries')
const port = 4000

app.use(express.json())
app.use(cors())

//add DB creds + .env
//create basic api functions tomm

app.get('/visit', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
    console.log("ping")
  });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  