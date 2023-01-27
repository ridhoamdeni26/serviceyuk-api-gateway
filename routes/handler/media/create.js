const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_MEDIA } = process.env;

const api = apiAdapter(URL_SERVICE_MEDIA);

module.exports = async (req, res) => {
  try {
    await api
      .post("/media", req.body)
      .then((response) => {
        return res.json(response.data);
      })
      .catch((error) => {
        return res.json(error.response.data);
      });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.code,
      api: URL_SERVICE_MEDIA,
    });
  }
};
