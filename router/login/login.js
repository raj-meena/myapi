

const express = require('express');
const db = require('../../database/database')
const jwt = require("jsonwebtoken");
const router = express.Router();

// Handling post request
router.post("/", async (req, res) => {

    try {
        let { username, password } = req.body;
        let keys = Object.keys(req.body)
        let keysExist = ['username', 'password'].filter((ele) => !keys.includes(ele))
        let msgkey
        if (keysExist.length > 0) {
            msgkey = ` Required keys! ${keysExist} `
            return res
                .status(400)
                .send({
                    status: false,
                    message: msgkey,
                    code: "ERR"
                });
        }
        let existingUser;
        let query = `select * from admin where username='${username}' and password='${password}' `;
        db.query(query, (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({
                        status: false,
                        message: "someting went wrong",
                        code: "ERR"
                    });
            }
            else {
                existingUser = JSON.parse(JSON.stringify(result))
                if (existingUser && existingUser.length < 1) {
                    return res
                        .status(201)
                        .send({
                            status: false,
                            message: "Wrong details please check at once"
                        });
                }
                else {
                    let token = jwt.sign(
                        { userId: existingUser[0].username, role: existingUser[0].role },
                        "MY-OTEX",
                        { expiresIn: "24 hours" }
                    );

                    return res
                        .status(200)
                        .send({
                            status: true,
                            data: {
                                userId: existingUser[0].user_id,
                                username: existingUser[0].username,
                                role: existingUser[0].role,
                                callcenter: existingUser[0].callcenter,
                            },
                            token: token,
                            code: "OK",
                            message: "login succesfully"
                        });

                }
            }

        });

    }
    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: "someting went wrong",
                code: "ERR"
            });
    }


});

module.exports = router;