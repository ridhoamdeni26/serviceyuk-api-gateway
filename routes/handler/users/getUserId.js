const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const userId = req.user.data.id;
    const getUsersId = await api.get("/users/get-users", {
      params: {
        userIds: userId,
      },
    });

    if (getUsersId == 404) {
      return res.status(404).json({
        status: "error",
        message: "users not found",
      });
    }

    return res.json(getUsersId.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        status: "error",
        message: "service unavailable",
      });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
