const router = require("express").Router();
const documentController = require("../controllers/documentController");
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
var uploadeDocument = multer({
  storage: multerS3({
    s3: s3,
    bucket: "facebook-lagui/docs",
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

router.get("/", requireAuth, documentController.getAll);

router.post(
  "/",
  requireAuth,
  uploadeDocument.single("file"),
  documentController.create
);

router.delete("/:id", requireAuth, documentController.delete);

module.exports = router;
