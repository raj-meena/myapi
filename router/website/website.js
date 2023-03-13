const express =require('express')
const { verifyToken } = require('../../middleware/authToken')
const router=express.Router()
const website_controller = require("../../controller/websites/websiteController");
const { restrictIP } = require('../../middleware/restrictIp');

//get data with pagination and filter
router.post('/',restrictIP,verifyToken,website_controller.get_data_with_pagination)

//get data with pagination and filter
router.post('/all',restrictIP,verifyToken,website_controller.get_data_without_pagination)

// create data
router.post('/add',restrictIP,verifyToken,website_controller.create_website)

//get data by id
router.get('/view/:id',restrictIP,verifyToken,website_controller.get_data_with_id)

//delete data by id
router.delete('/delete/:id',restrictIP,verifyToken,website_controller.delete_data_with_id)

//update data by id
router.put('/update/:id',restrictIP,verifyToken,website_controller.update_website_with_id)


module.exports=router