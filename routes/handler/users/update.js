const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const userId = req.user.data.id;
    const userUpdate = await api.put(`/users/updateUser/${userId}`, req.body);
    return res.json(userUpdate.data);
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
