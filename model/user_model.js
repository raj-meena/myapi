const db = require('../database/database');


exports.get_data_with_id = async (res, table_name) => {
    try {
       
        var query = `SELECT callcenter from  ${table_name} group by callcenter `;
        db.query(query, function (err, result) {
            if (err) throw err;
            return res.status(200)  
                .send({
                    status: true,
                    msg: `Data Found`,
                    code: "OK",
                    data: result,

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