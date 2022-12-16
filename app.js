const express=require("express");
const auth= require('./router/login/login')
const order= require('./router/order/order')
const websites=require('./router/website/website')
const websitesPage=require('./router/website/websitePageRoute')
const websiteMetaInfo=require('./router/website/webMetaRoute')
const cors= require('cors')
// const db= require('./database/database')
const app=express();
//create connnection
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())
app.use('/login',auth)
app.use('/order',order)
app.use('/website',websites)
app.use('/website/page',websitesPage)
app.use('/website/page/meta',websiteMetaInfo)

try{
    app.listen('3005',()=>{
        console.log("server started on port 3005")
    })
}catch(err)
{
    console.error(err)
}



