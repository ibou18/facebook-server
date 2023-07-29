const router = require("express").Router();
const paiementController = require("../controllers/paiementController");
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

router.get("/", paiementController.getAll);
router.get("/detail", paiementController.getPaiementbyName);
router.get("/upload", upload.single("file"), paiementController.uploadJson);
router.post("/", uploadMaterielImage.array("files"), paiementController.create);
router.get("/:id", paiementController.info);
router.patch(
  "/:id",
  uploadMaterielImage.array("files"),
  paiementController.update
);
router.delete("/:id", paiementController.delete);

module.exports = router;
