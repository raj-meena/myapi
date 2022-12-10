const express =require('express')
const { verifyToken } = require('../../middleware/authToken')
const router=express.Router()
const website_controller = require("../../controller/websites/websiteController");

//get data with pagination and filter
router.post('/',verifyToken,website_controller.get_data_with_pagination)

//get data with pagination and filter
router.post('/all',verifyToken,website_controller.get_data_without_pagination)

// create data
router.post('/add',verifyToken,website_controller.create_website)

//get data by id
router.get('/view/:id',verifyToken,website_controller.get_data_with_id)

//delete data by id
router.delete('/delete/:id',verifyToken,website_controller.delete_data_with_id)

//update data by id
router.put('/update/:id',verifyToken,website_controller.update_data_with_id)


module.exports=router