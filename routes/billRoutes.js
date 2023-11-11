const router = require("express").Router();
const billController = require("../controllers/billController");
const { requireAuth } = require("../middleware/authMiddleware");

const aws = require("aws-sdk");
const multer = require("multer");

// cmulter = require("multer")),
const multerS3 = require("multer-s3");
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "ca-central-1",
});

s3 = new aws.S3();
var uploadMaterielImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "facebook-lagui/images",
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

const upload = multer({ dest: "uploads/" });

router.get("/", billController.getAll);
router.post("/month", billController.saveBills);
// router.get("/info", billController.info);
router.post("/upload", upload.single("file"), billController.uploadJson);
router.post("/", uploadMaterielImage.array("files"), billController.create);
router.get("/:id", billController.info);
router.get("/by-facebook/:id", billController.infobyFacebookId);
router.patch("/:id", uploadMaterielImage.array("files"), billController.update);
router.delete("/:id", billController.delete);

module.exports = router;
