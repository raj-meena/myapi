// const express=express('require')

const { keysExist } = require("../../middleware/keyExist")
const miscModel = require('../../model/misc_model')
const blogModel=require('../../model/blog_model')
exports.create_blog = async (req, res) => {
    try {
        let website_id = req.body.website_id
        let blog_image=null
        if(req.file==undefined)
        {
         blog_image=null
        }
        else
        {
         blog_image = '/uploads/'+req?.file?.filename
           
        }
        let blog_name = req.body.blog_name
        let blog_title = req.body.blog_title
        let blog_description = req.body.blog_description
        let blog_subtitle = req.body.blog_subtitle
        let requiredKeys = ['website_id', 'blog_name', 'blog_title','blog_description','blog_subtitle']
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
           
            if (!blog_name) {
                validation
                validation.push("blog_name")
            }
            if (!blog_title) {
                validation.push("blog_title")
            }
            if (!blog_description) {
                validation.push("blog_description")
            }
            if (!blog_subtitle) {
                validation.push("blog_subtitle")
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
                'website_id':website_id,
                "blog_image": blog_image?blog_image:"",
                "blog_name": blog_name,
                "blog_title": blog_title,
                "blog_description":blog_description,
                "blog_subtitle": blog_subtitle,
            }]

            //call create model and  here given argumnets(response,table name,data to insert) 
            miscModel.create(res, 'website_blogs_tbl', data_insert)
          
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
        blogModel.get_blog_data_with_pagination(res,'website_blogs_tbl', dataToSend)

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
            "website_blogs_id": id
        }
        miscModel.get_data_with_id(res, 'website_blogs_tbl', dataToGetWith)

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
        let website_id = req.body.website_id
        let blog_image = null
        if(req.file==undefined)
        {
         blog_image=null
        }
        else
        {
         blog_image = '/uploads/'+req?.file?.filename
           
        }
        let blog_name = req.body.blog_name
        let blog_title = req.body.blog_title
        let blog_description = req.body.blog_description
        let blog_subtitle = req.body.blog_subtitle
        let requiredKeys = ['website_id','blog_image', 'blog_name', 'blog_title','blog_description','blog_subtitle']
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
           
            if (!blog_name) {
                validation
                validation.push("blog_name")
            }
            if (!blog_title) {
                validation.push("blog_title")
            }
            if (!blog_description) {
                validation.push("blog_description")
            }
            if (!blog_subtitle) {
                validation.push("blog_subtitle")
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
                'website_id':website_id,
                "blog_image": blog_image,
                "blog_name": blog_name? blog_name : "",
                "blog_title": blog_title,
                "blog_description":blog_description,
                "blog_subtitle": blog_subtitle,
            }
            data_to_update={
                "website_blogs_id":id
            }

            //call create model and  here given argumnets(response,table name,data to insert) 
            miscModel.update_date_with_id(res, 'website_blogs_tbl', data_for_update,data_to_update)
        }

    } catch (err) {
        return res.status(500).send({
            msg: `something went wrong. ${err}`,
            data: [],
            status: false,
        });
    }


}
// delete data in table
exports.delete_data_with_id = async (req, res) => {
    try {
        let { id } = req.params
        dataToDelete = {
            "website_blogs_id": id
        }
        miscModel.delete_data_with_id(res, 'website_blogs_tbl', dataToDelete)
    } catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `something went wrong ${err}`,
                code: "ERR"
            });
    }
}