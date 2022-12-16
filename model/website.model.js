const db = require('../database/database');
var convert = require('xml-js');

exports.create_website = async (res, table_name, data) => {
    try {
        data.map((ele) => {
            let key = Object.keys(ele)
            let values = Object.values(ele)
            var sql = `INSERT INTO ${table_name} (${key}) VALUES (?)`;
            db.query(sql, [values], function (err, result) {
                if (err) {

                    return res.status(500)
                        .send({
                            status: false,
                            msg: err.sqlMessage,
                            code: "ERR",
                            // inserted: result.affectedRows
                        });
                } else {
                    let sql_query = `SELECT * from  ${table_name} where website_id=${result.insertId}`
                    db.query(sql_query, function (err, result1) {
                        if (err) {

                            return res.status(500)
                                .send({
                                    status: false,
                                    msg: err.sqlMessage,
                                    code: "ERR",
                                    // inserted: result.affectedRows
                                });
                        } else {

                            if (result1[0].sitemap_url === '') {
                                return res.status(201)
                                    .send({
                                        status: true,
                                        msg: 'add succesfully',
                                        code: "OK",
                                        // inserted: result.affectedRows
                                    });
                            }
                            else {
                                var xmlData = convert.xml2js(result1[0].sitemap_url, { compact: true, spaces: 4 });
                                let values_insert = xmlData.urlset.url.map(ele => [ele.loc._text, result.insertId])
                                var sql_queyr_page = `INSERT INTO website_page_tbl (page_url,website_id) VALUES ?`;
                                db.query(sql_queyr_page, [values_insert], function (err2, result2) {
                                    if (err) {
                                        return res.status(500)
                                            .send({
                                                status: false,
                                                msg: err.sqlMessage,
                                                code: "ERR",
                                                // inserted: result.affectedRows
                                            });
                                    }
                                    else {
                                        return res.status(201)
                                            .send({
                                                status: true,
                                                msg: 'add succesfully',
                                                code: "OK",
                                                // inserted: result.affectedRows
                                            });
                                    }


                                })

                            }


                        }

                    })

                }

            });


        })
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
exports.update_website = async (res, table_name, dataForUpdate, dataToUpdate) => {
    try {
        let value = Object.values(dataForUpdate)
        let keys = Object.keys(dataForUpdate)
        let value_id = Object.values(dataToUpdate)
        let id = Object.keys(dataToUpdate)
        var sql = `UPDATE ${table_name} SET  `;
        keys.forEach((key, ind) => {

            if (keys.length - 2 < ind) {
                sql += `${key} = '${value[ind]}'`
            }
            else {
                sql += `${key} = '${value[ind]}',`
            }

        });
        sql += ` WHERE ${id}='${value_id}'`
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows) {
                let sql_query = `SELECT * from  ${table_name} where website_id='${value_id}'`
                db.query(sql_query, function (err, result1) {
                    if (err) {
                        return res.status(500)
                            .send({
                                status: false,
                                msg: err.sqlMessage,
                                code: "ERR",
                                // inserted: result.affectedRows
                            });
                    } else {

                        if (result1[0].sitemap_url === '') {
                            return res.status(201)
                                .send({
                                    status: true,
                                    msg: 'update succesfully',
                                    code: "OK",
                                    // inserted: result.affectedRowsquery
                                });
                        }
                        else {
                            var sql_delete = `DELETE FROM website_page_tbl WHERE website_id='${value_id}'`
                            db.query(sql_delete, function (errDelete, delete_result) {
                                if (errDelete) {
                                    return res.status(500)
                                        .send({
                                            status: false,
                                            msg: err.sqlMessage,
                                            code: "ERR",
                                            // inserted: result.affectedRows
                                        });
                                } else {

                                    var sql_delete = `DELETE FROM website_meta_tbl WHERE website_id='${value_id}'`

                                    db.query(sql_delete, function (err_meta, delete_result) {

                                        if (err_meta) {

                                            return res.status(500)
                                                .send({
                                                    status: false,
                                                    msg: err.sqlMessage,
                                                    code: "ERR",
                                                });
                                        } //end of if db delete website_meta_tbl
                                        else {

                                            var xmlData = convert.xml2js(result1[0].sitemap_url, { compact: true, spaces: 4 });
                                            let values_insert = xmlData.urlset.url.map(ele => [ele.loc._text, value_id])
                                            var sql_queyr_page = `INSERT INTO website_page_tbl (page_url,website_id) VALUES ?`;
                                            db.query(sql_queyr_page, [values_insert], function (err2, result2) {
                                                if (err) {
                                                    return res.status(500)
                                                        .send({
                                                            status: false,
                                                            msg: err.sqlMessage,
                                                            code: "ERR",
                                                            // inserted: result.affectedRows
                                                        });
                                                }
                                                else {
                                                    return res.status(201)
                                                        .send({
                                                            status: true,
                                                            msg: 'update succesfully',
                                                            code: "OK",
                                                            // inserted: result.affectedRows
                                                        });
                                                }


                                            })
                                        }// end of else db delete website_meta_tbl
                                    }) //  end of  db delete website_meta_tbl


                                }



                            }) // / end of else db delete website_page_tbl
                        }
                    }

                    })
            } else {
                return res.status(200)
                    .send({
                        status: true,
                        msg: `data not exist`,
                        code: "OK",
                    });
            }

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