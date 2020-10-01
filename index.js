if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index')

app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

// Catch All routes

app.all('*', (req, res, next) => {
    console.log("A new request received at " + Date.now() + " || For : " + req.url + " | Method : " + req.method);
    next();
})

// Database Connection
const mongo = require('mongoose');
// mongo.connect(process.env.DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true })

mongo.connect("mongodb+srv://test09:Obpgb7wqgDTfGHNd@cluster0-p0icc.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true })
const db = mongo.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongodb'))

// Route Setup
app.use('/api', indexRouter)


app.listen(3000, () => {
    console.log("Server listening on port 3000")
});

/*
**********************************************************
 ~ Ajax call from Frontend.
**********************************************************
$.ajax({
        url:'http://localhost:3000/api/....',
        type: 'GET',
        dataType: 'json',
        headers: {
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
            },
        complete: (response) => {
        },
        error:  () => {
        },
    });
*/
