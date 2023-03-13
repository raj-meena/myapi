// const db = require("../database/database");

// const getIpFromDatabase = async (req, res) => {
//   try {
//     let query = `select * from ip_address`;
//     console.log(query, "query");
//     db.query(query, (err, result) => {
//       // console.log(result)
//       if (err) {
//         throw err;
//       }
//       return res.status(200).json({ result: result, status: true });
//     });
//   } catch (err) {
//     // return res.status(500).send({
//     //   status: false,
//     //   message: "someting went wrong",
//     //   code: "ERR",
//     // });
//   }
// };

exports.restrictIP = async (req, res, next) => {
  // try {
  //   const ips = await getIpFromDatabase().then((res) =>
  //     console.log(res, "rerrr")
  //   );
  //   console.log(ips);
  // } catch (err) {}
  // // const ipsData = ips?.map((ele) => ele.ip_address);
  // // if (!ips) return;
  // // const allowedIPs = ["::ffff:127.0.0.1", "::ffff:192.168.216.19"]; // add your allowed IP addresses here
  // // const allowedIPs = process.env.IP_ACCESS;
  allowedIPs = process.env.IP_ACCESS.split(",");
  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip; // get the client IP address

  console.log(clientIP, "clientIP");
  if (allowedIPs.includes(clientIP)) {
    // if (allowedIPs == clientIP) {
    next(); // IP is allowed, proceed to the next middleware
  } else {
    return res.status(403).send("Access denied"); // IP is not allowed, send a 403 error
  }
};
