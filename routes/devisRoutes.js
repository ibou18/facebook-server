const router = require("express").Router();
const DevisRoutes = require("../controllers/devisController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", DevisRoutes.getAll);
router.get("/ended", DevisRoutes.getAllEnded);
router.post("/", DevisRoutes.create);
router.get("/:id", DevisRoutes.info);
router.patch("/:id", DevisRoutes.update);
router.delete("/:id", DevisRoutes.delete);

router.post("/send-devis", DevisRoutes.sendDevis);

module.exports = router;
