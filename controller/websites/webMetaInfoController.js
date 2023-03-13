const express = require('express');
const miscModel = require('../../model/misc_model')
const weesitePageModel = require('../../model/website_page_model')
const { verifyToken } = require('../../middleware/authToken');
const { keysExist } = require('../../middleware/keyExist');
const { resMessage } = require('../../middleware/showMessage');
const { resourceLimits } = require('worker_threads');
const router = express.Router();
const db = require('../../database/database');



// we are inserted data in table

exports.create_website = async (req, res) => {
    try {
        // let page_url = req.body.page_url
        // let page_name = req.body.page_name
        // let website_id = req.body.website_id
        // let website_meta_id=req.body.website_meta_id.
        let website_page_id = req.body.website_page_id
        let website_id = req.body.website_id
        let meta_description = req.body.meta_description
        let meta_keyword = req.body.meta_keyword
        let meta_og_title = req.body.meta_og_title
        let meta_og_url = req.body.meta_og_url
        let meta_og_image = req.body.meta_og_image
        let meta_og_description = req.body.meta_og_description
        let meta_og_type = req.body.meta_og_type
        let meta_twitter_title = req.body.meta_twitter_title
        let meta_twitter_card = req.body.meta_twitter_card
        let meta_twitter_image = req.body.meta_twitter_image
        let canonical_url=req.body.canonical_url




        let requiredKeys = [
            'website_page_id',
            'website_id',
            'meta_description',
            'meta_keyword',
            'meta_og_title',
            'meta_og_url',
            'meta_og_image',
            'meta_og_description',
            'meta_og_type',
            'meta_twitter_title',
            'meta_twitter_card',
            'meta_twitter_image',
            'canonical_url'
        ]
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!website_page_id) {
                validation.push("website_page_id")

            }
            if (!website_id) {
                validation.push("website_id")

            }
            if (!meta_description) {
                validation.push("meta_description")

            }
            if (!meta_keyword) {
                validation.push("meta_keyword")

            }
            if (!meta_og_title) {
                validation.push("meta_og_title")

            } if (!meta_og_url) {
                validation.push("meta_og_url")

            }
            if (!meta_og_image) {
                validation.push("meta_og_image")

            }
            if (!meta_og_description) {
                validation.push("meta_og_description")

            } if (!meta_og_type) {
                validation.push("meta_og_type")

            }
            if (!meta_twitter_title) {
                validation.push("meta_twitter_title")

            }
            if (!meta_twitter_card) {
                validation.push("meta_twitter_card")

            }
            if (!meta_twitter_image) {
                validation.push("meta_twitter_image")

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

                'website_page_id': website_page_id,
                'website_id': website_id,
                'meta_description': meta_description,
                'meta_keyword': meta_keyword,
                'meta_og_title': meta_og_title,
                'meta_og_url': meta_og_url,
                'meta_og_image': meta_og_image,
                'meta_og_description': meta_og_description,
                'meta_og_type': meta_og_type,
                'meta_twitter_title': meta_twitter_title,
                'meta_twitter_card': meta_twitter_card,
                'meta_twitter_image': meta_twitter_image,
                'canonical_url':canonical_url


            }]

            //call create model and  here given argumnets(response,table name,data to insert) 
            miscModel.create(res, 'website_meta_tbl', data_insert)
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
// exports.get_data_with_pagination = async (req, res) => {
//     try {

//         let page, limit, searchValue,searchKey,website_id
//         page = req.body.page
//         limit = req.body.limit
//         website_id=req.body.website_id
//         searchValue = req.body.searchValue
//         searchKey = req.body.searchKey
//         if (!page && !limit) {
//             return res.status(500)
//                 .send({
//                     status: false,
//                     msg: `Required limit and page`,
//                     code: "ERR"
//                 });
//         }
//         dataToSend = {
//             "page": page,
//             "limit": limit,
//             "searchQuery": searchValue,
//             "searchKey": searchKey,
//             "website_id":website_id,
//             "orderBy":"website_id",
//         }
//         weesitePageModel.get_website_page_data_with_pagination(res,'table_name', dataToSend)

//     } catch (err) {
//         return res.status(500)
//             .send({
//                 status: false,
//                 msg: `something went wrong ${err}`,
//                 code: "ERR"
//             });
//     }

// }

// //we are fecthing data with particular id from tabl
// exports.get_data_with_id = async (req, res) => {
//     try {

//         let { id } = req.params
//         dataToGetWith = {
//             "website_page_id": id
//         }
//         miscModel.get_data_with_id(res, 'website_page_tbl', dataToGetWith)

//     } catch (err) {
//         return res.status(500)
//             .send({
//                 status: false,
//                 msg: `something went wrong ${err}`,
//                 code: "ERR"
//             });
//     }

// }

// // // we are  fecthing  data without pagination from table
// // exports.get_data_without_pagination = async (req, res) => {
// //     try {
// //         let searchKey,searchValue
// //         searchValue = req.body.searchValue
// //         searchKey = req.body.searchKey
// //         dataToSend = {

// //             "searchQuery": searchValue,
// //             "searchKey": searchKey,
// //         }
// //         miscModel.get_data_without_pagination(res, 'websites', dataToSend)

// //     } catch (err) {
// //         return res.status(500)
// //             .send({
// //                 status: false,
// //                 msg: `something went wrong ${err}`,
// //                 code: "ERR"
// //             });
// //     }

// // }

// // // delete data in table
// // exports.delete_data_with_id = async (req, res) => {
// //     try {
// //         let { id } = req.params
// //         dataToDelete = {
// //             "website_id": id
// //         }
// //         miscModel.delete_data_with_id(res, 'websites', dataToDelete)
// //     } catch (err) {
// //         return res.status(500)
// //             .send({
// //                 status: false,
// //                 msg: `something went wrong ${err}`,
// //                 code: "ERR"
// //             });
// //     }
// // }

// // we are inserted data in table
// exports.update_data_with_id = async (req, res) => {
//     try {
//         let { id }=req.params
//         if(!id)
//         {
//             return res.status(500)
//                     .send({
//                         status: false,
//                         msg: `Required! Update id`,
//                         code: "ERR"
//                     });
//         }
//         let page_url = req.body?.page_url?.
//         let page_name = req.body?.page_name?.
//         let website_id = req.body?.website_id?.
//         let requiredKeys = ['page_url', 'page_name','website_id']
//         let keysExistValue = keysExist(requiredKeys, req, res)
//         if (keysExistValue.status) {
//             let validation = []
//             if (!page_url) {
//                 validation.push("page_url")
//             }
//             if (!page_name) {
//                 validation
//                 validation.push("page_name")
//             }
//             if (!website_id) {
//                 validation.push("website_id")
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
//                 "page_url": page_url,
//                 "page_name": page_name,
//                 "website_id": website_id
//             }
//             data_to_update={
//                 "website_page_id":id
//             }

//             //call create model and  here given argumnets(response,table name,data to insert)
//             miscModel.update_date_with_id(res, 'website_page_tbl', data_for_update,data_to_update)
//         }

//     } catch (err) {
//         return res.status(500).send({
//             msg: `something went wrong. ${err}`,
//             data: [],
//             status: false,
//         });
//     }


// }