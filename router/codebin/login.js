

const express = require('express');
const db = require('../../database/database')
const jwt = require("jsonwebtoken");
const { keysExist } = require('../../middleware/keyExist');
const router = express.Router();
const miscModel = require('../../model/misc_model')
// Handling post request
router.post("/login", async (req, res) => {

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
        let query = `select * from codebin_user where username='${username}' and password='${password}' `;
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
                        .status(409)
                        .send({
                            status: false,
                            message: "Wrong details please check at once"
                        });
                }
                else {
                    let token = jwt.sign(
                        { username: existingUser[0].username, email: existingUser[0].email },
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
                                email: existingUser[0].email,
                                phone: existingUser[0].phone,
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
// // Handling post request
// router.post("/register", async (req, res) => {

//     try {
//         let { username, password,email,phone } = req.body;
//         let keys = Object.keys(req.body)
//         let keysExist = ['username', 'password'].filter((ele) => !keys.includes(ele))
//         let msgkey
//         if (keysExist.length > 0) {
//             msgkey = ` Required keys! ${keysExist} `
//             return res
//                 .status(400)
//                 .send({
//                     status: false,
//                     message: msgkey,
//                     code: "ERR"
//                 });
//         }
//         let existingUser;
//         let query = `select * from codebin_admin where username='${username}' and password='${password}' `;
//         db.query(query, (err, result) => {
//             if (err) {
//                 return res
//                     .status(500)
//                     .send({
//                         status: false,
//                         message: "someting went wrong",
//                         code: "ERR"
//                     });
//             }
//             else {
//                 existingUser = JSON.parse(JSON.stringify(result))
//                 if (existingUser && existingUser.length < 1) {
//                     return res
//                         .status(201)
//                         .send({
//                             status: false,
//                             message: "Wrong details please check at once"
//                         });
//                 }
//                 else {
//                     let token = jwt.sign(
//                         { userId: existingUser[0].username, role: existingUser[0].role },
//                         "MY-OTEX",
//                         { expiresIn: "24 hours" }
//                     );

//                     return res
//                         .status(200)
//                         .send({
//                             status: true,
//                             data: {
//                                 userId: existingUser[0].user_id,
//                                 username: existingUser[0].username,
//                                 role: existingUser[0].role,
//                                 callcenter: existingUser[0].callcenter,
//                             },
//                             token: token,
//                             code: "OK",
//                             message: "login succesfully"
//                         });

//                 }
//             }

//         });

//     }
//     catch (err) {
//         return res
//             .status(500)
//             .send({
//                 status: false,
//                 message: "someting went wrong",
//                 code: "ERR"
//             });
//     }


// });
// create data
router.post('/register',async (req, res) => {
    try {
      
        let username = req.body.username
        let email = req.body.email
        let phone = req.body.phone
        let password = req.body.password
        let requiredKeys = [
            'username',
            'email',
            'phone',
            'password',
        ]
        let keysExistValue = keysExist(requiredKeys, req, res)
        if (keysExistValue.status) {
            let validation = []
            if (!username) {
                validation.push("username")

            }
            if (!email) {
                validation.push("email")

            }
            if (!phone) {
                validation.push("phone")

            }
            if (!password) {
                validation.push("password")

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
                'username':username,
                'email':email,
                'phone':phone,
                'password':password,
            }]

            //call create model and  here given argumnets(response,table name,data to insert) 
            miscModel.create(res, 'codebin_user', data_insert)
        }

    } catch (err) {
        return res.status(500).send({
            msg: `something went wrong. ${err}`,
            data: [],
            status: false,
        });
    }


})

module.exports = router;