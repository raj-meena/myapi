exports.resMessage =(res,status,msg,data)=>{
    if(!status)
    {
        return res.status(500)
        .send({
            status: false,
            msg: msg,
            code: "ERR"
        });
    }
    else{
        return  res.status(200)
        .send({
            status: true,
            msg:msg,
            data:data,
            code: "OK"
        });
    }
   
}