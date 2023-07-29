const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");
// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// forgot and reset password

router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword/:token", authController.resetPassword);

//contact
router.post("/send-mail", userController.sendMailContact);
router.post("/send-document", userController.sendDocument);

// statistique
router.get("/statistique", userController.getStatistique);

// user DB
router.get("/", requireAuth, userController.getAllUsers);
router.get("/:id", requireAuth, userController.userInfo);
router.put("/:id", requireAuth, userController.updateUser);
router.delete("/:id", requireAuth, userController.deleteUser);

module.exports = router;
