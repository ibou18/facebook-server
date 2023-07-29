const router = require("express").Router();
const FactureController = require("../controllers/factureController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, FactureController.getAll);
router.post("/", FactureController.create);
router.get("/:id", FactureController.info);
router.put("/:id", FactureController.update);
router.delete("/:id", FactureController.delete);
router.post("/send-facture", FactureController.sendFacture);

// payment factures routes

router.patch("/payment/:id", FactureController.addPayment);
router.patch("/edit-payment/:id", FactureController.editPayment);
router.patch(
  "/delete-payment/:id",

  FactureController.deletePayment
);

module.exports = router;
