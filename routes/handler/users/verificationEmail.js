const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const confirmation_code = req.params.confirmationCode;
    await api
      .get(`/users/confirm/${confirmation_code}`)
      .then((response) => {
        return res.json(response.data);
      })
      .catch((error) => {
        return res.json(error.response.data);
      });
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
