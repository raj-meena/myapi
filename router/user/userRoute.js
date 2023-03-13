const express = require('express');
const { createUnparsedSourceFile } = require('typescript');
const { getDataAllCenter } = require('../../controller/user/userController');
const { verifyToken } = require('../../middleware/authToken');
const { restrictIP } = require('../../middleware/restrictIp');

const router = express.Router();

router.get('/callcenter',restrictIP, verifyToken, getDataAllCenter)

module.exports = router;