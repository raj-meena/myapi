// const express=express('require')

const { keysExist } = require("../../middleware/keyExist")
const miscModel = require('../../model/misc_model')


// const blogModel=require('../../model/blog_model')

// const app=express();

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })
// var upload = multer({ storage: storage })
// app.use(express.static(__dirname + '/public'));


// app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
//     // req.file is the `profile-file` file
//     // req.body will hold the text fields, if there were any
//     console.log(JSON.stringify(req.file))
//     var response = '<a href="/">Home</a><br>'
//     response += "Files uploaded successfully.<br>"
//     response += `<img src="${req.file.path}" /><br>`
//     return res.send(response)
//   })

//   app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
//       // req.files is array of `profile-files` files
//       // req.body will contain the text fields, if there were any
//       var response = '<a href="/">Home</a><br>'
//       response += "Files uploaded successfully.<br>"
//       for(var i=0;i<req.files.length;i++){
//           response += `<img src="${req.files[i].path}" /><br>`
//       }

//       return res.send(response)
//   })


//   app.listen(port,() => console.log(`Server running on port ${port}!`))



exports.upload_file = async (req, res) => {
    try {
        console.log(req.file.filename)
    } catch (err) {
        console.log(err)
    }
}