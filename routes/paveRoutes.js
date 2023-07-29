const router = require("express").Router();
const paveController = require("../controllers/paveController");
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

router.get("/", paveController.getAll);
router.post("/", uploadMaterielImage.array("files"), paveController.create);
router.get("/:id", paveController.info);
router.patch("/:id", uploadMaterielImage.array("files"), paveController.update);
router.delete("/:id", paveController.delete);

module.exports = router;
