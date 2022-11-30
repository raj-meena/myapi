const express=require("express");
const auth= require('./router/login')
const order= require('./router/order')
const cors= require('cors')
// const db= require('./database/database')
const app=express();
//create connnection
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())
app.use('/login',auth)
app.use('/order',order)

try{
    app.listen('3005',()=>{
        console.log("server started on port 3005")
    })
}catch(err)
{
    console.error(err)
}



