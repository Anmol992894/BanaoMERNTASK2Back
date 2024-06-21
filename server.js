// importing dependencies
const express=require('express');
const PORT=4000;
const cors=require('cors')
const app=express();
const moongoose=require('mongoose');
const {MONGOBD_URL}=require('./config');

moongoose.set('strictQuery', false);

// Building connections
moongoose.connect(MONGOBD_URL);

// Establishing connections
moongoose.connection.on('connected', ()=>{
    console.log('DB Connected');
})

moongoose.connection.on('error',()=>{
    console.log("Some error occured while connecting to DB");
})

app.use(cors());
app.use(express.json());


require('./models/usermodel')
require('./models/postmodel')

app.use(require('./routes/userroute'))
app.use(require('./routes/postroute'))

app.listen(PORT,()=>{
    console.log("Connected to the server");
})