const router = require("express").Router();
const clientController = require("../controllers/clientController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", clientController.getAllClient);
router.post("/", clientController.create);
router.post("/bulk", clientController.createBulk);
router.patch("/:id", clientController.update);
router.delete("/:id", clientController.delete);

module.exports = router;
