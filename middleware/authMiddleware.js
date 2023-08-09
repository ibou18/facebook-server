const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  console.log("__REQ**__", req.headers["x-access-token"]);
  const token = req.headers["x-access-token"];
  // ? req.cookies.jwt
  // : req.headers["x-access-token"];

  console.log("__TOKEN__**", token);
  // var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  // console.log("decoded", decoded);

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      console.log("decodedToken", decodedToken);
      if (err) {
        console.log("🔴ERRRRR", err);
        res.status(200).send("no token");
        res.status(401).send("not authorized");
      } else {
        console.log("id", decodedToken.id);
        const user = await UserModel.findById(decodedToken.id);
        console.log("user", user);
        req.user = user;
        next();
      }
    });
  } else {
    return res
      .status(403)
      .json({ statut: "error", message: "Require Admin Role!" });
  }
};
