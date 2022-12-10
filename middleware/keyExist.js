exports.keysExist = (rquiredkeys, req, res) => {
    try {

        let keys = Object.keys(req.body)
        let keysExistvalue = rquiredkeys.filter((ele) => !keys.includes(ele))
        let msgkey
        if (keysExistvalue.length > 0) {
            msgkey = ` Required keys! ${keysExistvalue} `
            // return { status:false ,msg: msgkey}
            return res.status(400)
            .send({
                status: false,
                msg: msgkey,
                code: "ERR"
            });
        }
        else {
            return {status:true}
        }
    } catch (err) {
        console.log("🚀 ~ file: keyExist.js ~ line 20 ~ err", err)
        return res.status(400)
            .send({
                status: false,
                msg: "something went wrong",
                code: "ERR"
            });
    }


};

