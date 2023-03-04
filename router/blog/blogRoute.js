const express=require('express')
const blogController = require('../../controller/blog/blogController')
const uploadSingleImage=require('./../../helper/fileUpload')
const { verifyToken } = require('../../middleware/authToken')
const { restrictIP } = require('../../middleware/restrictIp')
const router=express.Router()

// create data
router.post('/add',restrictIP,verifyToken,uploadSingleImage.upload,blogController.create_blog)

//get data with pagination
router.post('/',restrictIP,verifyToken,blogController.get_data_with_pagination)

//get data by id
router.get('/view/:id',restrictIP,verifyToken,blogController.get_data_with_id)

//update data by id
router.put('/update/:id',restrictIP,verifyToken,blogController.update_data_with_id)

//delete data by id
router.delete('/delete/:id',restrictIP,verifyToken,blogController.delete_data_with_id)

module.exports=router