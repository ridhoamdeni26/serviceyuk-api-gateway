const apiAdapter = require("../../apiAdapter");
const jwt = require("jsonwebtoken");

const {
  URL_SERVICE_USER,
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_EXPIRED,
} = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const loginUser = await api.post("/users/login", req.body);
    const data = loginUser.data.data;

    const token = jwt.sign(
      {
        data,
      },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_TOKEN_EXPIRED }
    );

    const refreshToken = jwt.sign(
      {
        data,
      },
      JWT_SECRET_REFRESH_TOKEN,
      { expiresIn: JWT_REFRESH_TOKEN_EXPIRED }
    );

    await api.post("/refresh-tokens", {
      refresh_token: refreshToken,
      uuid: data.id,
    });

    return res.json({
      status: "success",
      data: {
        token,
        refresh_token: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "service unavailable",
    });
  }
};
