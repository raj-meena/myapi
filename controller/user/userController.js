const express = require('express');
const userModel = require('../../model/user_model')
// const websiteModel=require('../../model/website.model')
// const { verifyToken } = require('../../middleware/authToken');
// const { keysExist } = require('../../middleware/keyExist');
// const { resMessage } = require('../../middleware/showMessage');
// const { resourceLimits } = require('worker_threads');
// const router = express.Router();
// var convert = require('xml-js');
// const db = require('../../database/database');

//we are fecthing data with particular id from tabl
exports.getDataAllCenter = async (req, res) => {
    try {

        userModel.get_data_with_id(res, 'admin')


    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }

}