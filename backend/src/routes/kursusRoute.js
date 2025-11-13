const express = require("express");
const router = express.Router();

const kursusController = require("../controllers/kursusController");

router.get("/", kursusController.getSemuaKursus);

router.get("/:id", kursusController.getKursusById);

router.post("/", kursusController.createKursus);

router.put("/:id", kursusController.updateKursus);

router.delete("/:id", kursusController.deleteKursus);

// Export router agar dapat digunakan di app.js
module.exports = router;
