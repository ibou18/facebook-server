const router = require("express").Router();
const youtubeController = require("../controllers/youtubeController");
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

router.get("/", youtubeController.getAll);
router.post("/", youtubeController.create);
router.get("/:id", youtubeController.info);
router.patch("/:id", youtubeController.update);
router.delete("/:id", youtubeController.delete);

module.exports = router;
