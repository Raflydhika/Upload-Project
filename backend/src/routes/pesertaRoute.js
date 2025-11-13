// backend/src/routes/pesertaRoutes.js

const express = require("express");
const router = express.Router();
const pesertaController = require("../controllers/pesertaController");

router.post("/daftar", pesertaController.registerPeserta);

router.get("/", pesertaController.tampilSemuaPeserta);

router.put("/:id", pesertaController.updatePeserta);

router.delete("/:id", pesertaController.hapusPeserta);

module.exports = router;
