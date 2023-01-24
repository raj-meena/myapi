const express = require('express');
const miscModel = require('../../model/misc_model')
const weesitePageModel = require('../../model/website_page_model')
const { verifyToken } = require('../../middleware/authToken');
const { keysExist } = require('../../middleware/keyExist');
const { resMessage } = require('../../middleware/showMessage');
const { resourceLimits } = require('worker_threads');
const router = express.Router();


// we are inserted data in table
exports.create_website = async (req, res) => {
    try {
        let page_url = req.body.page_url
        let page_name = req.body.page_name
        let website_id = req.body.website_id
        let requiredKeys = ['page_url', 'page_name', 'website_id','header_space','footer_space']
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!page_url) {
                validation.push("page_url")
            }
            if (!page_name) {
                validation
                validation.push("page_name")
            }
            if (!website_id) {
                validation.push("website_id")
            }
            if (validation.length) {
                return res.status(500)
                    .send({
                        status: false,
                        msg: `Required! valid data of ${validation}`,
                        code: "ERR"
                    });
            }
            data_insert = [{
                "page_url": page_url,
                "page_name": page_name,
                "website_id": website_id,
                "header_space": req.body.header_space,
                "footer_space": req.body.footer_space,
            }]

            //call create model and  here given argumnets(response,table name,data to insert) 
           
            db.query(`select url from website_page_tbl where page_url='${page_url}'`, function (err, result) {

                if (err) {

                }
                else {
                    if (!result.length) {
                   
                        // call create model and  here given argumnets(response,table name,data to insert) 
                        miscModel.create(res, 'website_page_tbl', data_insert)
                    }
                    else {
                        return res.status(201)
                            .send({
                                status: false,
                                msg: `URL Already exist`,
                                code: "ERR"
                            });
                    }
                }
            })
        }

    } catch (err) {
        return res.status(500).send({
            msg: `something went wrong. ${err}`,
            data: [],
            status: false,
        });
    }


}

// we are  fecthing  data with pagination from table
exports.get_data_with_pagination = async (req, res) => {
    try {

        let page, limit, searchValue,searchKey,website_id
        page = req.body.page
        limit = req.body.limit
        website_id=req.body.website_id
        searchValue = req.body.searchValue
        searchKey = req.body.searchKey
        if (!page && !limit) {
            return res.status(500)
                .send({
                    status: false,
                    msg: `Required limit and page`,
                    code: "ERR"
                });
        }
        dataToSend = {
            "page": page,
            "limit": limit,
            "searchQuery": searchValue,
            "searchKey": searchKey,
            "website_id":website_id,
            "orderBy":"website_id",
        }
        weesitePageModel.get_website_page_data_with_pagination(res,'table_name', dataToSend)

    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }

}

//we are fecthing data with particular id from tabl
exports.get_data_with_id = async (req, res) => {
    try {

        let { id } = req.params
        dataToGetWith = {
            "website_page_id": id
        }
        miscModel.get_data_with_id(res, 'website_page_tbl', dataToGetWith)

    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }

}

// // we are  fecthing  data without pagination from table
// exports.get_data_without_pagination = async (req, res) => {
//     try {
//         let searchKey,searchValue
//         searchValue = req.body.searchValue
//         searchKey = req.body.searchKey
//         dataToSend = {

//             "searchQuery": searchValue,
//             "searchKey": searchKey,
//         }
//         miscModel.get_data_without_pagination(res, 'websites', dataToSend)

//     } catch (err) {
//         return res.status(500)
//             .send({
//                 status: false,
//                 msg: `something went wrong ${err}`,
//                 code: "ERR"
//             });
//     }

// }

// delete data in table
exports.delete_data_with_id = async (req, res) => {
    try {
        let { id } = req.params
        dataToDelete = {
            "website_page_id": id
        }
        miscModel.delete_data_with_id(res, 'website_page_tbl', dataToDelete)
    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }
}

// we are inserted data in table
exports.update_data_with_id = async (req, res) => {
    try {
        let { id }=req.params
        if(!id)
        {
            return res.status(500)
                    .send({
                        status: false,
                        msg: `Required! Update id`,
                        code: "ERR"
                    });
        }
        let page_url = req.body?.page_url
        let page_name = req.body?.page_name
        let website_id = req.body?.website_id
        let requiredKeys = ['page_url', 'page_name','website_id']
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!page_url) {
                validation.push("page_url")
            }
            if (!page_name) {
                validation
                validation.push("page_name")
            }
            if (!website_id) {
                validation.push("website_id")
            }
            if (validation.length) {
                return res.status(500)
                    .send({
                        status: false,
                        msg: `Required! valid data of ${validation}`,
                        code: "ERR"
                    });
            }
            data_for_update = {
                "page_url": page_url,
                "page_name": page_name,
                "website_id": website_id
            }
            data_to_update={
                "website_page_id":id
            }

            //call create model and  here given argumnets(response,table name,data to insert) 
            miscModel.update_date_with_id(res, 'website_page_tbl', data_for_update,data_to_update)
        }

    } catch (err) {
        return res.status(500).send({
            msg: `something went wrong. ${err}`,
            data: [],
            status: false,
        });
    }


}