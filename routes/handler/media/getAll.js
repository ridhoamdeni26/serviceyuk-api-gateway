const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_MEDIA } = process.env;

const api = apiAdapter(URL_SERVICE_MEDIA);

module.exports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // const media = await api.get(`/media?${page}&${offset}`);
    const media = await api.get(
      `/media?search=${search}&page=${page}&limit=${limit}`
    );

    if (media == 404) {
      return res.status(404).json({
        status: "error",
        message: "media not found",
      });
    }

    return res.json(media.data);
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
