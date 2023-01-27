const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      throw Error("no token attached");
    }

    jwt.verify(token, JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          message: err.message,
        });
      }

      req.user = decoded;
      return next();
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error JWT",
    });
  }
};
