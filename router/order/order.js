const express = require('express');
const { createUnparsedSourceFile } = require('typescript');
const { getOrderWithPagination, updateOrderById, getTopTenProducts, getOrderById, updateOrderByAgent, getTodayProduct, getAllproduct } = require('../../controller/order/orderController');
const db = require('../../database/database');
const { verifyToken } = require('../../middleware/authToken');
const { keysExist } = require('../../middleware/keyExist');
const { restrictIP } = require('../../middleware/restrictIp');
const { resMessage } = require('../../middleware/showMessage');
const router = express.Router();

router.post('/',restrictIP, verifyToken, getOrderWithPagination)

router.put('/update/:id',restrictIP, verifyToken, updateOrderById)

router.get('/topTenProducts',restrictIP, verifyToken, getTopTenProducts)


router.get('/view/:id',restrictIP, verifyToken,getOrderById )
router.put('/order-update/:id',restrictIP, verifyToken, updateOrderByAgent)

router.get('/today-product',restrictIP, verifyToken, getTodayProduct)


router.get('/all-product', verifyToken, getAllproduct)

module.exports = router;