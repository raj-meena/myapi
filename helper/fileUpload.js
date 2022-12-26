const multer = require('multer')
const path=require('path')
const fileUpload={
    storage:multer.diskStorage({
        destination:function(req,file,cb)
        {
            cb(null,"uploads")
        },
        filename:function(req,file,cb)
        {
            cb(null,file.fieldname+"-"+Date.now()+".jpg")
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
}


exports.upload=multer(fileUpload).single("blog_image")

