const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const userIds = req.query.userIds || [];

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const getUsers = await api.get("/users/get-users", {
      params: {
        userIds: userIds,
        search: search,
        page: page,
        limit: limit,
      },
    });

    if (getUsers == 404) {
      return res.status(404).json({
        status: "error",
        message: "users not found",
      });
    }

    return res.json(getUsers.data);
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
