const express = require('express');
const { createUnparsedSourceFile } = require('typescript');
const { getOrderWithPagination, updateOrderById, getTopTenProducts, getOrderById, updateOrderByAgent, getTodayProduct, getAllproduct } = require('../../controller/order/orderController');
const db = require('../../database/database');
const { verifyToken } = require('../../middleware/authToken');
const { keysExist } = require('../../middleware/keyExist');
const { resMessage } = require('../../middleware/showMessage');
const router = express.Router();

router.post('/', verifyToken, getOrderWithPagination)

router.put('/update/:id', verifyToken, updateOrderById)

router.get('/topTenProducts', verifyToken, getTopTenProducts)


router.get('/view/:id', verifyToken,getOrderById )
router.put('/order-update/:id', verifyToken, updateOrderByAgent)

router.get('/today-product', verifyToken, getTodayProduct)


router.get('/all-product', verifyToken, getAllproduct)

module.exports = router;