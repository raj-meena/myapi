const mysql=require("mysql");

const db=mysql.createConnection({
    host:"database-1.cvvi0mb1kon8.ap-south-1.rds.amazonaws.com",
    user:"admin",
    password:"admin123",
    database:"tm",
})
db.connect((err)=>{
    if(err)
    {
        throw err;
    }
    console.log("mysql connnected ....")
})

module.exports = db;