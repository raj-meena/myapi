const mysql=require("mysql");
require('dotenv').config()
const HOST=process.env.DATABASE_HOST
const USERNAME= process.env.DATABASE_USERNAME
const PASSWORD= process.env.DATABASE_PASSWORD
const DATABASE= process.env.DATABASE_DATABASE_NAME
const db=mysql.createConnection({
    host:HOST,
    user:USERNAME,
    password:PASSWORD,
    database:DATABASE
})
db.connect((err)=>{
    if(err)
    {
        throw err;
    }
    console.log("mysql connnected ....")
})

module.exports = db;