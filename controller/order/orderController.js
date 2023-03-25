const express = require("express");
const { createUnparsedSourceFile } = require("typescript");
const db = require("../../database/database");
const { verifyToken } = require("../../middleware/authToken");
const { keysExist } = require("../../middleware/keyExist");
const { resMessage } = require("../../middleware/showMessage");
const router = express.Router();

exports.getOrderWithPagination = async (req, res) => {
  try {
    const callcenter = req.callcenter;
    let keys = Object.keys(req.body);
    let limit = 10;
    let page = 1;
    let offset = limit * (page - 1);
    let totalItem = 0;
    let totapages = 0;
    if (keys.includes("limit") && keys.includes("page")) {
      limit = parseInt(req.body.limit) ? parseInt(req.body.limit) : 10;
      page = parseInt(req.body.page) ? parseInt(req.body.page) : 0;
      offset = limit * (page - 1);
    } else {
      return res.status(500).send({
        status: false,
        msg: "limit and page required",
        code: "ERR",
      });
    }

    let query = "select * from order_detail where order_id>0 ";
    let countQuery =
      "select COUNT(DISTINCT phone, email) as count from order_detail where order_id>0 ";

    if (keys.includes("filterBy")) {
      if (req.body.filterBy[0].fieldName == "mode") {
        if (
          req.body.filterBy[0].value.length > 0 &&
          !(req.body.filterBy[0].value[0] == "LATEST_ORDER")
        ) {
          query += ` AND mode='${req.body.filterBy[0].value[0]}'`;
          countQuery += ` AND mode='${req.body.filterBy[0].value[0]}'`;
        }
      }
    }
    if (keys.includes("dateFilter")) {
      if (req.body.dateFilter.status) {
        query += ` AND status='${req.body.dateFilter.status}'`;
        countQuery += ` AND status='${req.body.dateFilter.status}'`;
      }
    }
    if (keys.includes("dateFilter")) {
      if (req.body.dateFilter.start_date && req.body.dateFilter.end_date) {
        query += ` AND DATE(date)  >='${req.body.dateFilter.start_date}' AND DATE(date)  <= '${req.body.dateFilter.end_date}'`;
        countQuery += ` AND DATE(date)  >='${req.body.dateFilter.start_date}' AND DATE(date)  <= '${req.body.dateFilter.end_date}'`;
      }
    }
    if (keys.includes("dateFilter")) {
      if (req.body.dateFilter.idtag) {
        query += ` AND idtag ='${req.body.dateFilter.idtag}'`;
        countQuery += ` AND idtag ='${req.body.dateFilter.idtag}'`;
      }
    }

    if (keys.includes("searchValue")) {
      if (req.body.searchValue) {
        query += ` AND (product_name LIKE '%${req.body.searchValue}%' or idtag LIKE '%${req.body.searchValue}%' or name LIKE '%${req.body.searchValue}%' or order_id LIKE '%${req.body.searchValue}%' or email LIKE '%${req.body.searchValue}%' or phone LIKE '%${req.body.searchValue}%' or address LIKE '%${req.body.searchValue}%')`;
        countQuery += ` AND (product_name LIKE '%${req.body.searchValue}%' or idtag LIKE '%${req.body.searchValue}%' or name LIKE '%${req.body.searchValue}%' or order_id LIKE '%${req.body.searchValue}%' or email LIKE '%${req.body.searchValue}%' or phone LIKE '%${req.body.searchValue}%' or address LIKE '%${req.body.searchValue}%')`;
      }
    }
    query += ` And idtag LIKE '%${callcenter}%' group by phone,email`;
    countQuery += ` And idtag LIKE '%${callcenter}%'`;
    query += ` order by order_id DESC`;
    countQuery += ` order by order_id DESC`;
    if (keys.includes("limit")) {
      queryPage = ` limit ${limit} offset ${offset}`;
      // countQuery = ` limit ${limit} offset ${offset}`
    }
    db.query(countQuery, async (err, result) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "someting went wrong",
          code: "ERR",
        });
      } else {
        totalItem = result[0]["count"];
      }
    });
    db.query(query + queryPage, async (err, result) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "someting went wrong",
          code: "ERR",
        });
      } else {
        if (totalItem % limit == 0) {
          totapages = parseInt(totalItem / limit);
        } else {
          totapages = parseInt(totalItem / limit) + 1;
        }
        return res.status(200).send({
          status: true,
          msg: "data Found",
          totalItem: totalItem,
          totapages: totapages,
          page: page,
          limit: limit,
          data: result,
        });
      }
    });
  } catch (error) {
    return res.status(401).send({
      msg: "something went wrong.",
      data: [],
      status: false,
    });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    let requiredKeys = ["status", "dispatch_date", "docket_no", "dispatch_by"];
    let keysExistValue = keysExist(requiredKeys, req, res);

    var { id } = req.params;
    if (keysExistValue.status) {
      if (id == "") {
        return resMessage(res, false, "id is required");
      }
      let body = { ...req.body };
      if (
        body.status &&
        body.dispatch_by &&
        body.dispatch_date &&
        body.docket_no
      ) {
        let query = `update order_detail set status= '${body.status}',
            docket_no='${body.docket_no}',dispatch_date='${body.dispatch_date}',dispatch_by='${body.dispatch_by}'
            where order_id='${id}'`;

        db.query(query, async (err, result) => {
          if (err) return resMessage(res, false, "something went wrong");
          else return resMessage(res, true, "update succesfully");
        });
      } else return resMessage(res, false, `fileds should not be empty `);
    } else {
      return res.status(400).send({
        status: false,
        msg: keysExistValue.msg,
        code: "ERR",
      });
    }
  } catch (err) {
    return resMessage(res, false, "something went wrong");
  }
};

exports.getTopTenProducts = async (req, res) => {
  try {
    const callcenter = req.callcenter;
    var { start_date, end_date } = req.query;
    let query = `SELECT product_name, count(*) AS count FROM order_detail  where order_id>0`;
    if (start_date && end_date) {
      query += ` AND DATE(date)  >= '${start_date}' AND DATE(date)  <=  '${end_date}' `;
    }
    query += ` And idtag LIKE '%${callcenter}%'`;
    query += ` GROUP BY product_name  ORDER BY count DESC `;
    if (!start_date && !end_date) {
      query += ` LIMIT 10 `;
    }
    db.query(query, async (err, result) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "someting went wrong",
          code: "ERR",
        });
      } else {
        return res.status(200).send({
          status: true,
          msg: "data Found",
          data: result,
        });
      }
    });
  } catch (error) {
    return res.status(401).send({
      msg: "something went wrong.",
      data: [],
      status: false,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    var { id } = req.params;
    if (id == "") {
      return resMessage(res, false, "id is required");
    }

    let query = `Select * from order_detail where order_id='${id}'`;
    db.query(query, async (err, result) => {
      if (err) return resMessage(res, false, "something went wrong", []);
      else {
        return resMessage(res, true, "Data found", result);
      }
    });
  } catch (err) {
    return resMessage(res, false, "something went wrong");
  }
};

exports.updateOrderByAgent = async (req, res) => {
  try {
    var { id } = req.params;
    if (id == "") {
      return resMessage(res, false, "id is required");
    }
    let requiredKeys = [
      "product_name",
      "name",
      "phone",
      "email",
      "status",
      "zip_code",
      "city",
      "state",
      "remark",
      "quantity",
      "address",
      "mode",
    ];
    let keysExistValue = keysExist(requiredKeys, req, res);
    if (keysExistValue.status) {
      let body = { ...req.body };
      let bodyValues = Object.values(body);
      let bodyKeys = Object.keys(body);
      let emptyValues = [];
      for (let i = 0; i < bodyValues.length; i++) {
        if (bodyValues[i] == "") {
          emptyValues.push(bodyKeys[i]);
        }
      }
      if (emptyValues.length > 0) {
        return resMessage(
          res,
          false,
          `Field should not be empty ${emptyValues}`
        );
      } else {
        let query = `Update order_detail set product_name='${body.product_name}', name='${body.name}',
                 phone='${body.phone}', email='${body.email}', status='${body.status}', 
                 zip_code='${body.zip_code}', city='${body.city}', state='${body.state}', 
                 remark='${body.remark}', quantity='${body.quantity}', address='${body.address}', mode='${body.mode}'
                 WHERE order_id='${id}' `;
        db.query(query, async (err, result) => {
          if (err) return resMessage(res, false, "something went wrong");
          else return resMessage(res, true, "update succesfully");
        });
      }
    } else {
      return res.status(400).send({
        status: false,
        msg: keysExistValue.msg,
        code: "ERR",
      });
    }
  } catch (err) {
    return resMessage(res, false, "something went wrong");
  }
};

exports.getTodayProduct = async (req, res) => {
  try {
    const callcenter = "";
    const { start_date, end_date } = req.query;
    if (!start_date && !end_date) {
      return res.status(400).send({
        status: false,
        msg: "dates are required",
        data: result,
      });
    }
    let query = `SELECT product_name,idtag,status,
          COUNT(mode) as totalcount,
          COUNT(CASE WHEN status="Confirmed" THEN 1 END) AS ConfirmedCount,
          COUNT(CASE WHEN status="Pending" THEN 1 END) AS PendingCount,
          COUNT(CASE WHEN status="Shipped" THEN 1 END) AS ShippedCount,
          COUNT(CASE WHEN status="Cancelled" THEN 1 END) AS CancelledCount,
          COUNT(CASE WHEN mode="COD" THEN 1 END) AS CodCount,
          COUNT(CASE WHEN mode="Overseas" THEN 1 END) AS OverseasCount, 
          COUNT(CASE WHEN mode="Enquiry" THEN 1 END) AS EnquiryCount,
          COUNT(CASE WHEN mode="Online" THEN 1 END) AS OnlineCount FROM 
          (select *  from order_detail group by email,phone ) sub_order_detail 
          where DATE(date)  >= '${start_date}' AND DATE(date)  <=  '${end_date}' and idtag LIKE '%${callcenter}%'
          group by idtag`;
    db.query(query, async (err, result) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "someting went wrong in query",
          code: "ERR",
        });
      } else {
        return res.status(200).send({
          status: true,
          msg: "data Found",
          data: result,
        });
      }
    });
  } catch (error) {
    return res.status(401).send({
      msg: "something went wrong in data",
      data: [],
      status: false,
    });
  }
};

exports.getAllproduct = async (req, res) => {
  try {
    let query = `Select product_name from order_detail group by product_name`;
    db.query(query, async (err, result) => {
      if (err) return resMessage(res, false, "something went wrong", []);
      else return resMessage(res, true, "Data found", result);
    });
  } catch (err) {
    return resMessage(res, false, "something went wrong");
  }
};
