const router = require("express").Router();
const constantController = require("../controllers/constantController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, constantController.getAllConstant);
router.post("/", requireAuth, constantController.create);
router.put("/:id", requireAuth, constantController.update);
router.delete("/:id", requireAuth, constantController.delete);

module.exports = router;
