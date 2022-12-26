const db = require('../database/database');

exports.get_blog_data_with_pagination = async (res, table_name, data) => {
    try {
        let page = parseInt(data.page) //page
        let limit = parseInt(data.limit) //
        let id = data.website_id
        let orderBy = data.orderBy
        let offset = (limit * (page - 1))
        let totapages = 0
        let totalItem = 0
        let sql = ''
        
        var query = `SELECT * from  websites
        RIGHT JOIN website_blogs_tbl as web_page  on web_page.website_id=websites.website_id
         WHERE websites.website_id='${id}' `;
        var count = `SELECT  COUNT(*) as itemsCount   from  websites
        RIGHT JOIN website_blogs_tbl as web_page  on web_page.website_id=websites.website_id
         WHERE  websites.website_id='${id}' `;

        if (data.searchQuery) {
            if (data.searchKey.length > 0) {
                sql += ' AND ('
                data.searchKey.forEach((column_key, ind) => {
                    if (data.searchKey.length - 2 < ind) {
                        sql += `${column_key} LIKE '%${data.searchQuery}%'`
                    }
                    else {
                        sql += `${column_key} LIKE '%${data.searchQuery}%' OR `
                    }

                });
                sql += ')'
            }
        }
        sql += ` order by websites.${orderBy} DESC `
        count = count + sql
        sql += `  limit ${limit} offset ${offset}`

        query = query + sql
        db.query(count, function (err, result) {
            if (err) throw err;
            totalItem = result[0].itemsCount
            db.query(query, function (err, result) {
                if (err) throw err;
                if (totalItem % limit == 0) {
                    totapages = parseInt(totalItem / limit)

                }
                else {
                    totapages = parseInt(totalItem / limit) + 1

                }
                return res.status(200)
                    .send({
                        status: true,
                        msg: `Data Found`,
                        code: "OK",
                        data: result,
                        totalItem: totalItem,
                        page: page,
                        limit: limit,
                        totapages: totapages
                    });
            });
        });
    }
    catch (err) {
        return res.status(500)
            .send({
                status: false,
                msg: `Internal server error ${err}`,
                code: "ERR",
            });
    }

}