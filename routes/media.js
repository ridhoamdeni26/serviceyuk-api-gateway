const express = require("express");
const router = express.Router();

const mediaHandler = require("./handler/media");

router.post("/", mediaHandler.create);
router.get("/", mediaHandler.getAll);
router.delete("/:id", mediaHandler.destroy);
router.get("/:id", mediaHandler.getId);

module.exports = router;
