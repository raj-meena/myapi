const express =require('express')
const { verifyToken } = require('../../middleware/authToken')
const router=express.Router()
const webMetaInfoController = require("../../controller/websites/webMetaInfoController");
const { restrictIP } = require('../../middleware/restrictIp');

//get data with pagination and filter
// router.post('/',verifyToken,website_page_controller.get_data_with_pagination)

//get data with pagination and filter
// router.post('/all',verifyToken,website_page_controller.get_data_without_pagination)

// create data
router.post('/add',restrictIP,verifyToken,webMetaInfoController.create_website)

//get data by id
// router.get('/view/:id',verifyToken,website_page_controller.get_data_with_id)

// //delete data by id
// router.delete('/delete/:id',verifyToken,website_page_controller.delete_data_with_id)

//update data by id
// router.put('/update/:id',verifyToken,website_page_controller.update_data_with_id)


module.exports=router