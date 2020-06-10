const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(cors());

// body parser middlware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

const post = require('./routes/api/post');

app.listen(port, ()=> {
  console.log(`server run localhost:${port}`)
})

app.use('/api/post', post);
