const express = require('express');
const miscModel = require('../../model/misc_model')
const websiteModel=require('../../model/website.model')
const { verifyToken } = require('../../middleware/authToken');
const { keysExist } = require('../../middleware/keyExist');
const { resMessage } = require('../../middleware/showMessage');
const { resourceLimits } = require('worker_threads');
const router = express.Router();
var convert = require('xml-js');
const db = require('../../database/database');
// var parser = require('xml2json');

// we are inserted data in table
exports.create_website = async (req, res) => {
    try {
        let url = req.body.url
        let product_name = req.body.product_name
        let product_tag = req.body.product_tag
        let requiredKeys = ['url', 'product_name', 'product_tag', "sitemap_url",
            "header_space",
            "footer_space",
            "gatag_ip",
            "search_console_id",
            "conversin_tag"]
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!url) {
                validation.push("url")
            }
            if (!product_name) {
                validation
                validation.push("product_name")
            }
            if (!product_tag) {
                validation.push("product_tag")
            }
            if (validation.length) {
                return res.status(500)
                    .send({
                        status: false,
                        msg: `Required! valid data of ${validation}`,
                        code: "ERR"
                    });
            }
            try{
                console.log("hereerer 23344")

                var xmlData = convert.xml2json(req.body.sitemap_url, { compact: true, spaces: 4 });
                data_insert = [{
                    "url": url,
                    "product_name": product_name,
                    "product_tag": product_tag,
                    "sitemap_url": req.body.sitemap_url?req.body.sitemap_url :req.body.sitemap_url,
                    "header_space": req.body.header_space,
                    "footer_space": req.body.footer_space,
                    "gatag_ip": req.body.gatag_ip,
                    "search_console_id": req.body.search_console_id,
                    "conversin_tag": req.body.conversin_tag,
                }]
                db.query(`select url from websites where url='${url}'`, function (err, result) {
    
                    if (err) {
    
                    }
                    else {
                        if (!result.length) {
                       
                            // call create model and  here given argumnets(response,table name,data to insert) 
                            websiteModel.create_website(res, 'websites', data_insert)
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
            catch(err)
            {
                return res.status(201)
                .send({
                    status: false,
                    msg: `site url must be xml formate ${err}`,
                    code: "ERR"
                });
            }
          

      



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

        let page, limit, searchValue, searchKey
        page = req.body.page
        limit = req.body.limit
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
            "orderBy": "website_id"
        }
        miscModel.get_data_with_pagination(res, 'websites', dataToSend)

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
            "website_id": id
        }
        miscModel.get_data_with_id(res, 'websites', dataToGetWith)


    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }

}

// we are  fecthing  data without pagination from table
exports.get_data_without_pagination = async (req, res) => {
    try {
        let searchKey, searchValue
        searchValue = req.body.searchValue
        searchKey = req.body.searchKey
        dataToSend = {

            "searchQuery": searchValue,
            "searchKey": searchKey,
        }
        miscModel.get_data_without_pagination(res, 'websites', dataToSend)

    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }

}

// delete data in table
exports.delete_data_with_id = async (req, res) => {
    try {
        let { id } = req.params
        dataToDelete = {
            "website_id": id
        }
        miscModel.delete_data_with_id(res, 'websites', dataToDelete)
    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }
}

// // we are inserted data in table
// exports.update_data_with_id = async (req, res) => {
//     try {
//         let { id } = req.params
//         if (!id) {
//             return res.status(500)
//                 .send({
//                     status: false,
//                     msg: `Required! Update id`,
//                     code: "ERR"
//                 });
//         }
//         let url = req.body.url
//         let product_name = req.body.product_name
//         let product_tag = req.body.product_tag
//         let requiredKeys = ['url', 'product_name', 'product_tag']
//         let keysExistValue = keysExist(requiredKeys, req, res)
//         if (keysExistValue.status) {
//             let validation = []
//             if (!url) {
//                 validation.push("url")
//             }
//             if (!product_name) {
//                 validation
//                 validation.push("product_name")
//             }
//             if (!product_tag) {
//                 validation.push("product_tag")
//             }
//             if (validation.length) {
//                 return res.status(500)
//                     .send({
//                         status: false,
//                         msg: `Required! valid data of ${validation}`,
//                         code: "ERR"
//                     });
//             }
//             data_for_update = {
//                 "url": url,
//                 "product_name": product_name,
//                 "product_tag": product_tag
//             }
//             data_to_update = {
//                 "website_id": id
//             }

//             //call create model and  here given argumnets(response,table name,data to insert) 
//             miscModel.update_date_with_id(res, 'websites', data_for_update, data_to_update)
//         }

//     } catch (err) {
//         return res.status(500).send({
//             msg: `something went wrong. ${err}`,
//             data: [],
//             status: false,
//         });
//     }


// }

exports.update_website_with_id = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(500)
                .send({
                    status: false,
                    msg: `Required! Update id`,
                    code: "ERR"
                });
        }
        let url = req.body.url
        let product_name = req.body.product_name
        let product_tag = req.body.product_tag
        let requiredKeys = ['url', 'product_name', 'product_tag', "sitemap_url",
            "header_space",
            "footer_space",
            "gatag_ip",
            "search_console_id",
            "conversin_tag"]
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!url) {
                validation.push("url")
            }
            if (!product_name) {
                validation
                validation.push("product_name")
            }
            if (!product_tag) {
                validation.push("product_tag")
            }
            if (validation.length) {
                return res.status(500)
                    .send({
                        status: false,
                        msg: `Required! valid data of ${validation}`,
                        code: "ERR"
                    });
            }
            try{

                var xmlData = convert.xml2json(req.body.sitemap_url, { compact: true, spaces: 4 });
            }
            catch(err)
            {
                return res.status(201)
                .send({
                    status: false,
                    msg: `site url must be xml formate ${err}`,
                    code: "ERR"
                });
            }
      

            data_insert = {
                "url": url,
                "product_name": product_name,
                "product_tag": product_tag,
                "sitemap_url": req.body.sitemap_url?req.body.sitemap_url :req.body.sitemap_url,
                "header_space": req.body.header_space,
                "footer_space": req.body.footer_space,
                "gatag_ip": req.body.gatag_ip,
                "search_console_id": req.body.search_console_id,
                "conversin_tag": req.body.conversin_tag,
            }
            data_to_update = {
                "website_id": id
            }

            
            websiteModel.update_website(res, 'websites', data_insert,data_to_update)
            // db.query(`select url from websites where url='${url}'`, function (err, result) {

            //     if (err) {

            //     }
            //     else {
            //         if (!result.length) {
                   
            //             // call create model and  here given argumnets(response,table name,data to insert) 
                        
            //         }
            //         else {
            //             return res.status(201)
            //                 .send({
            //                     status: false,
            //                     msg: `URL Already exist`,
            //                     code: "ERR"
            //                 });
            //         }
            //     }
            // })



        }

    } catch (err) {
        return res.status(500).send({
            msg: `something went wrong. ${err}`,
            data: [],
            status: false,
        });
    }


}