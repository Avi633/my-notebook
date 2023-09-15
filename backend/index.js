const connectToMongo = require('./db');
const express = require("express");
const app = express();
var cors = require('cors')
const port = 5000;

// mongo connection
connectToMongo();

 
app.use(cors()) // for cors error when adding note in backend using frontend
app.use(express.json());

// Available routes
app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));


app.listen(port, () => {
    console.log(`iNotebook backend is running on ${port}`);
})
