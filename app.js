const express=require("express");
require('dotenv').config()
const PORT=process.env.PORT
const authRoutes= require('./router/login/login')
//codebin
const authCodebinRoutes= require('./router/codebin/login')
const orderRoutes= require('./router/order/order')
const websitesRoutes=require('./router/website/website')
const websitesPageRoutes=require('./router/website/websitePageRoute')
const websiteMetaRoutes=require('./router/website/webMetaRoute')
const blogRoutes=require('./router/blog/blogRoute')
const fileRoutes =require('./router/file/fileRoute')
const userRoutes=require('./router/user/userRoute')
const cors= require('cors')
// const db= require('./database/database')
const app=express();
//create connnection
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())
//codebin
app.use('/codebin',authCodebinRoutes)

app.use('/login',authRoutes)
app.use('/order',orderRoutes)
app.use('/website',websitesRoutes)
app.use('/website/page',websitesPageRoutes)
app.use('/website/page/meta',websiteMetaRoutes)
app.use('/website/blog',blogRoutes)
// app.use('/file',fileRoutes)
app.use('/admin',userRoutes)
try{
    app.listen(PORT,()=>{
        console.log(`server started on port ${PORT}`)
    })
}catch(err)
{
    console.error(err)
}



