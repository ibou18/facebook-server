const router = require("express").Router();
const billController = require("../controllers/billController");
const { requireAuth } = require("../middleware/authMiddleware");

const aws = require("aws-sdk");
const multer = require("multer");

// cmulter = require("multer")),
const multerS3 = require("multer-s3");
const { uploadPayout } = require("../middleware/uploadImage");
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ca-central-1",
});

s3 = new aws.S3();
var uploadMaterielImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "facebook-lagui/docs",
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

const upload = multer({ dest: "uploads/" });

router.get("/", billController.getAll);
router.get("/reference/:id", billController.getAllByRef);
router.post("/month", billController.saveBills);
router.post("/", billController.createBill);
router.post("/payout", uploadPayout.single("file"), billController.savePayout);
router.post("/upload", upload.single("file"), billController.uploadJson);

router.get("/:id", billController.info);
router.get("/by-facebook/:id", billController.infobyFacebookId);
router.get("/info-by-period/:id", billController.infoByPeriod);
router.patch("/:id", billController.update);
router.delete("/:id", billController.delete);

module.exports = router;
