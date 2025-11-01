const express = require("express");
const upload = require("../middleware/filesMiddleware");
const path = require("path");
const router = express.Router();

router.get("/download/:filepath", (req, res) => {
  const filepath = atob(req.params.filepath);
  res.sendFile(path.join(__dirname, "../../", filepath));
});

router.post("/upload", upload.single("file"), (req, res) => {
  const file = new UploadFile();
  const now = new Date().toLocaleString("en-us");

  file.filepath = "123.txt";
  file.time = now.getTime();

  file.save((result) => {
    try {
      res.status(200).json({
        path: path,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  });
});

module.exports = router;
