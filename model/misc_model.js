const db = require('../database/database');

exports.create = async (res, table_name, data) => {
    try {
        data.map((ele) => {
            let key = Object.keys(ele)
            let values = Object.values(ele)
            var sql = `INSERT INTO ${table_name} (${key}) VALUES (?)`;
            db.query(sql, [values], function (err, result) {
                if (err) throw err;
                return res.status(201)
                    .send({
                        status: true,
                        msg: `Added succesfully`,
                        code: "OK",
                        inserted: result.affectedRows
                    });
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
exports.get_data_with_pagination = async (res, table_name, data) => {
    try {
        let page = parseInt(data.page) //page
        let limit = parseInt(data.limit) //
        let offset = (limit * (page - 1))
        let orderBy=data.orderBy
        let totapages = 0
        let totalItem = 0
        let sql = ''
        var query = `SELECT *  from  ${table_name} WHERE inserted_at >0 `;
        var count = `SELECT  COUNT(*) as itemsCount from  ${table_name}  WHERE inserted_at >0 `;

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

        sql += ` order by ${orderBy} DESC `
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

exports.get_data_without_pagination = async (res, table_name, data) => {
    try {

        let sql = ''
        var query = `SELECT *  from  ${table_name} WHERE inserted_at >0 `;
        var count = `SELECT COUNT(*) OVER () as totalItem from  ${table_name}  WHERE inserted_at >0 `;
        if (data.searchQuery) {
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
        count = count + sql
        query = query + sql
        let totalItem = 0
        db.query(count, function (err, result) {
            if (err) throw err;
            totalItem = result[0].totalItem
        });
        db.query(query, function (err, result) {
            if (err) throw err;
            return res.status(200)
                .send({
                    status: true,
                    msg: `Data Found`,
                    code: "OK",
                    data: result,
                    totalItem: totalItem,
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

exports.get_data_with_id = async (res, table_name, data) => {
    try {
        let value = Object.values(data)
        let key = Object.keys(data)
        var query = `SELECT *  from  ${table_name} WHERE inserted_at >0 AND ${key}=${value} `;
        db.query(query, function (err, result) {
            if (err) throw err;
            return res.status(200)
                .send({
                    status: true,
                    msg: `Data Found With Id`,
                    code: "OK",
                    data: result[0],

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

exports.delete_data_with_id = async (res, table_name, data) => {
    try {
        let value = Object.values(data)
        let key = Object.keys(data)
        var query = `SELECT *  from  ${table_name} WHERE inserted_at >0 AND ${key}=${value} `;
        db.query(query, function (err, result) {
            if (err) throw err;
            if (result.length) {
                var query = `DELETE  from  ${table_name} WHERE inserted_at >0 AND ${key}=${value} `;
                db.query(query, function (err, result) {
                    if (err) throw err;
                    return res.status(200)
                        .send({
                            status: true,
                            msg: `Data Delete from databse`,
                            code: "OK",
                            deleted: result.affectedRows,

                        });
                });
            } else {
                return res.status(200)
                    .send({
                        status: true,
                        msg: `Data not Exist in dataBase`,
                        code: "OK",
                        data: result,

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

exports.update_date_with_id = async (res, table_name, dataForUpdate, dataToUpdate) => {
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
        sql += ` WHERE ${id}=${value_id}`
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (result.affectedRows) {
                return res.status(200)
                    .send({
                        status: true,
                        msg: `update data successfully`,
                        code: "OK",
                    });
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