const jwt = require("jsonwebtoken");
const db = require('../database/database')


exports.verifyToken = async (req, res, next) => {
    try {
        if (
            req.headers !== undefined &&
            req.headers["x-access-token"] !== undefined &&
            req.headers["x-access-token"] !== ""
        ) {
            const token = req.headers["x-access-token"].trim();
            let decoded
            jwt.verify(token, "MY-OTEX",
                function (err, decodedData) {

                    if (err) {
                        return res.status(401).send({
                            msg: "Please login with registered username.",
                            data: [],
                            status: false,
                        });
                    }
                    else {
                        decoded = decodedData
                        if (decoded.userId === undefined || decoded.userId === "") {
                            return res.status(401).send({
                                msg: "Please login with registered username.",
                                data: [],
                                status: false,
                            });
                        } else {
                            let query = `select * from admin where username='${decoded.userId}' and role='${decoded.role}'`;
                             db.query(query, async (err, result) => {
                               
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({
                                            status: false,
                                            msg: "someting went wrong in token",
                                            code: "ERR"
                                        });
                                }
                                else {
                                    existingUser = JSON.parse(JSON.stringify(result))

                                    if (existingUser && existingUser.length < 1) {
                                        return res
                                            .status(400)
                                            .send({
                                                status: false,
                                                msg: "Wrong details please check at once"
                                            });
                                    }
                                    else {
                                        req.callcenter = existingUser[0].callcenter
                                        next()
                                    }
                                }
                            })

                        }
                    }
                });


        } else {
            return res.status(401).send({
                msg: "Please login with registered username.",
                data: [],
                status: false,
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(401).send({
            msg: "Authentication failed.",
            data: [],
            status: false,
        });
    }


}


